// ════════════════════════════════════════════════════════════════════════
// pulse-machine-mermaid-check — owner-only diagnostic. Walks every library
// entry, extracts the ```mermaid``` fenced block (if any), and reports:
//   - which entries have a Mermaid block
//   - which entries have a markdown table instead (also acceptable)
//   - which entries have NEITHER (true skips)
//   - which Mermaid blocks have likely syntax issues (heuristic)
//
// Auth: ?key=pulsemachine
// Usage:
//   /.netlify/functions/pulse-machine-mermaid-check?key=pulsemachine
//   /.netlify/functions/pulse-machine-mermaid-check?key=pulsemachine&format=json
//   /.netlify/functions/pulse-machine-mermaid-check?key=pulsemachine&id=<entryId>
//     → returns just the raw mermaid block for one entry
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const ADMIN_KEY = 'pulsemachine';

const VALID_DIAGRAM_TYPES = [
  'graph', 'flowchart', 'sequenceDiagram', 'gantt', 'stateDiagram', 'stateDiagram-v2',
  'classDiagram', 'erDiagram', 'journey', 'pie', 'mindmap', 'timeline', 'quadrantChart',
  'gitGraph', 'requirementDiagram', 'C4Context', 'sankey-beta', 'block-beta',
];

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

function escHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

function extractMermaid(answer) {
  const m = String(answer || '').match(/```mermaid\s*\n([\s\S]*?)```/);
  return m ? m[1].trim() : null;
}

function hasMarkdownTable(answer) {
  // Detect 2+ pipe-tables (rough — header separator pattern |---|---|)
  return /^\s*\|[^\n]+\|\s*\n\s*\|\s*[-:]+/m.test(String(answer || ''));
}

// Heuristic syntax check. NOT a full parser — just catches obvious breakage.
function lintMermaid(src) {
  const issues = [];
  if (!src || src.trim().length < 5) return ['empty block'];

  const lines = src.split('\n').map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || '';
  const declared = VALID_DIAGRAM_TYPES.find(t => firstLine.startsWith(t));
  if (!declared) issues.push(`unknown diagram type — first line: "${firstLine.slice(0, 50)}"`);

  // Balanced brackets across the whole block (rough)
  const counts = { '[': 0, ']': 0, '(': 0, ')': 0, '{': 0, '}': 0 };
  for (const c of src) { if (c in counts) counts[c]++; }
  if (counts['['] !== counts[']']) issues.push(`unbalanced [] (${counts['[']} vs ${counts[']']})`);
  if (counts['('] !== counts[')']) issues.push(`unbalanced () (${counts['(']} vs ${counts[')']})`);
  if (counts['{'] !== counts['}']) issues.push(`unbalanced {} (${counts['{']} vs ${counts['}']})`);

  // Forbidden patterns I've seen Sonnet emit by mistake
  if (/--->>/.test(src) && declared !== 'sequenceDiagram') issues.push('--->> arrow only valid in sequenceDiagram');
  if (/<-->/.test(src)) issues.push('<--> is not valid Mermaid arrow syntax');
  if (/\)\s*\)\s*-/.test(src)) issues.push('possible double-paren node-end');
  if (/\bend\s*$/.test(firstLine)) issues.push('"end" on first line — diagram type declaration missing');

  // gantt-specific
  if (declared === 'gantt') {
    if (!/dateFormat/i.test(src)) issues.push('gantt missing dateFormat');
  }
  // pie-specific
  if (declared === 'pie') {
    if (!/^\s*"[^"]+"\s*:\s*[\d.]+/m.test(src)) issues.push('pie chart slices not in `"label" : number` format');
  }
  // sequenceDiagram-specific
  if (declared === 'sequenceDiagram') {
    if (!/(participant|->>|-->>)/.test(src)) issues.push('sequenceDiagram has no participants or arrows');
  }

  return issues;
}

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  if (params.key !== ADMIN_KEY) return { statusCode: 403, body: 'forbidden' };

  const store = initStore();
  if (!store) return { statusCode: 500, body: 'no store' };

  // Single-entry mode
  if (params.id) {
    const full = await store.get('answers/' + params.id + '.json', { type: 'json' });
    if (!full) return { statusCode: 404, body: 'not found' };
    const block = extractMermaid(full.answer);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: 'QUESTION: ' + (full.question || '') + '\n\n' +
            'MERMAID:\n' + (block || '(no mermaid block)') + '\n\n' +
            'ISSUES: ' + (block ? lintMermaid(block).join('; ') || 'none' : 'no block to lint'),
    };
  }

  // Full scan
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const entries = idx.entries || [];

  const results = [];
  // Pull in parallel batches of 10 to avoid blowing through Blobs read concurrency
  const batchSize = 10;
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    const fulls = await Promise.all(batch.map(e => store.get('answers/' + e.id + '.json', { type: 'json' }).catch(() => null)));
    fulls.forEach((full, j) => {
      const e = batch[j];
      if (!full) { results.push({ id: e.id, error: 'missing answer blob', question: e.question }); return; }
      const block = extractMermaid(full.answer);
      const hasTable = hasMarkdownTable(full.answer);
      const lint = block ? lintMermaid(block) : [];
      results.push({
        id: e.id,
        question: e.question,
        ts: e.ts,
        has_mermaid: !!block,
        has_table: hasTable,
        diagram_type: block ? (block.split('\n')[0] || '').trim().slice(0, 30) : null,
        node_count: block ? (block.match(/\n/g) || []).length : 0,
        issues: lint,
        block_preview: block ? block.slice(0, 200) : null,
      });
    });
  }

  // Aggregations
  const stats = {
    total: results.length,
    with_mermaid: results.filter(r => r.has_mermaid).length,
    without_mermaid: results.filter(r => !r.has_mermaid).length,
    with_only_table: results.filter(r => !r.has_mermaid && r.has_table).length,
    with_neither: results.filter(r => !r.has_mermaid && !r.has_table).length,
    with_lint_issues: results.filter(r => r.issues && r.issues.length).length,
  };

  if (params.format === 'json') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ ok: true, stats, entries: results }, null, 2),
    };
  }

  // HTML view — flag broken entries first
  const broken = results.filter(r => r.issues && r.issues.length);
  const noVisual = results.filter(r => !r.has_mermaid && !r.has_table);

  const renderEntry = (r) => `
    <div style="background:#0e131c;border:1px solid rgba(255,255,255,0.08);border-left:3px solid ${r.issues.length ? '#ef4444' : !r.has_mermaid ? '#FFD740' : '#22c55e'};border-radius:8px;padding:12px 14px;margin-bottom:8px;">
      <div style="font-size:13px;font-weight:700;color:#EDE5D8;margin-bottom:4px;line-height:1.4;">${escHtml((r.question || '').slice(0, 120))}</div>
      <div style="font-size:11px;color:rgba(237,229,216,0.5);font-family:monospace;margin-bottom:6px;">id: <a href="?key=${ADMIN_KEY}&id=${r.id}" style="color:#FF8C1A;">${escHtml(r.id)}</a> · type: ${escHtml(r.diagram_type || '—')} · lines: ${r.node_count}</div>
      ${r.issues && r.issues.length ? `<div style="font-size:12px;color:#ef4444;font-weight:700;margin-bottom:4px;">⚠ ${r.issues.join(' · ')}</div>` : ''}
      ${r.block_preview ? `<pre style="background:#070a0f;padding:8px 10px;border-radius:4px;font-size:11px;color:rgba(237,229,216,0.6);overflow-x:auto;font-family:'JetBrains Mono',Consolas,monospace;margin:6px 0 0;">${escHtml(r.block_preview)}${r.block_preview.length >= 200 ? '...' : ''}</pre>` : '<div style="font-size:11px;color:rgba(237,229,216,0.4);">no mermaid block</div>'}
    </div>`;

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Mermaid Audit · PULSE</title>
<style>
  body { background:#0a0d12; color:#EDE5D8; font-family:'Segoe UI',system-ui,sans-serif; padding:32px 16px; margin:0; min-height:100vh; }
  .wrap { max-width:880px; margin:0 auto; }
  h1 { color:#FF8C1A; font-size:13px; letter-spacing:2px; text-transform:uppercase; margin:0 0 4px; }
  h2 { font-family:Georgia,serif; font-size:24px; font-weight:800; color:#fff; margin:0 0 18px; }
</style></head>
<body><div class="wrap">
  <h1>◉ Pulse Machine — Mermaid Audit</h1>
  <h2>Diagram coverage across the library</h2>

  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:24px;">
    <div style="background:#1A2025;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:14px;text-align:center;">
      <div style="font-size:11px;color:rgba(237,229,216,0.5);text-transform:uppercase;letter-spacing:1.4px;font-weight:700;">Entries</div>
      <div style="font-size:22px;font-weight:900;color:#fff;margin-top:4px;">${stats.total}</div>
    </div>
    <div style="background:#1A2025;border:1px solid rgba(34,197,94,0.3);border-radius:8px;padding:14px;text-align:center;">
      <div style="font-size:11px;color:rgba(237,229,216,0.5);text-transform:uppercase;letter-spacing:1.4px;font-weight:700;">With Mermaid</div>
      <div style="font-size:22px;font-weight:900;color:#22c55e;margin-top:4px;">${stats.with_mermaid}</div>
    </div>
    <div style="background:#1A2025;border:1px solid rgba(255,215,64,0.3);border-radius:8px;padding:14px;text-align:center;">
      <div style="font-size:11px;color:rgba(237,229,216,0.5);text-transform:uppercase;letter-spacing:1.4px;font-weight:700;">Table only</div>
      <div style="font-size:22px;font-weight:900;color:#FFD740;margin-top:4px;">${stats.with_only_table}</div>
    </div>
    <div style="background:#1A2025;border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:14px;text-align:center;">
      <div style="font-size:11px;color:rgba(237,229,216,0.5);text-transform:uppercase;letter-spacing:1.4px;font-weight:700;">No visual</div>
      <div style="font-size:22px;font-weight:900;color:#ef4444;margin-top:4px;">${stats.with_neither}</div>
    </div>
  </div>

  ${broken.length ? `
    <div style="font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#ef4444;margin:18px 0 10px;">⚠ Likely syntax errors · ${broken.length}</div>
    ${broken.map(renderEntry).join('')}
  ` : ''}

  ${noVisual.length ? `
    <div style="font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#ef4444;margin:18px 0 10px;">🚫 No visual at all · ${noVisual.length}</div>
    ${noVisual.map(renderEntry).join('')}
  ` : ''}

  <details style="margin-top:18px;">
    <summary style="cursor:pointer;font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#94a3b8;">Show all ${stats.total} entries</summary>
    <div style="margin-top:8px;">${results.map(renderEntry).join('')}</div>
  </details>
</div></body></html>`;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    body: html,
  };
};
