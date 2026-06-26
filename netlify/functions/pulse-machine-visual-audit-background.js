// ════════════════════════════════════════════════════════════════════════
// pulse-machine-visual-audit — daily 22:00 UTC. Walks every library entry
// and validates that each one has a working visual (Mermaid diagram or
// markdown table). Flags entries with:
//   - No visual at all (no mermaid block, no table)
//   - Mermaid blocks with likely syntax errors (heuristic lint)
//
// Schedule: "0 22 * * *" (= 6pm EDT, 30 min before the evening IndexNow push,
// so broken entries can be flagged BEFORE search engines re-crawl them).
//
// Emails Kory only if broken count > 0. Stores history in
// `pulse-machine-library/_visual_audits/YYYY-MM-DD.json` for trend tracking.
// ════════════════════════════════════════════════════════════════════════

const https = require('https');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const SITE = 'https://pulserevops.com';
const HAIKU_MODEL = 'claude-haiku-4-5-20251001';
const MAX_AUTOFIXES_PER_RUN = 20;  // cost cap: ~20 × $0.005 = $0.10/day max

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

function dayKey(d) { return (d || new Date()).toISOString().slice(0, 10); }

function extractMermaid(answer) {
  const m = String(answer || '').match(/```mermaid\s*\n([\s\S]*?)```/);
  return m ? m[1].trim() : null;
}

function hasMarkdownTable(answer) {
  return /^\s*\|[^\n]+\|\s*\n\s*\|\s*[-:]+/m.test(String(answer || ''));
}

function lintMermaid(src) {
  const issues = [];
  if (!src || src.trim().length < 5) return ['empty block'];

  const lines = src.split('\n').map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || '';
  const declared = VALID_DIAGRAM_TYPES.find(t => firstLine.startsWith(t));
  if (!declared) issues.push(`unknown diagram type: "${firstLine.slice(0, 50)}"`);

  const counts = { '[': 0, ']': 0, '(': 0, ')': 0, '{': 0, '}': 0 };
  for (const c of src) { if (c in counts) counts[c]++; }
  if (counts['['] !== counts[']']) issues.push(`unbalanced [] (${counts['[']}/${counts[']']})`);
  if (counts['('] !== counts[')']) issues.push(`unbalanced () (${counts['(']}/${counts[')']})`);
  if (counts['{'] !== counts['}']) issues.push(`unbalanced {} (${counts['{']}/${counts['}']})`);

  if (/--->>/.test(src) && declared !== 'sequenceDiagram') issues.push('--->> only valid in sequenceDiagram');
  if (/<-->/.test(src)) issues.push('<--> not valid Mermaid arrow');

  if (declared === 'gantt' && !/dateFormat/i.test(src)) issues.push('gantt missing dateFormat');
  if (declared === 'pie' && !/^\s*"[^"]+"\s*:\s*[\d.]+/m.test(src)) issues.push('pie slices not in "label" : number format');
  if (declared === 'sequenceDiagram' && !/(participant|->>|-->>)/.test(src)) issues.push('sequenceDiagram has no participants/arrows');

  return issues;
}

function claudePost(payload) {
  return new Promise((resolve) => {
    const data = JSON.stringify(payload);
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      timeout: 15000,
    }, (res) => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => {
        try { resolve({ ok: res.statusCode === 200, data: JSON.parse(buf) }); }
        catch (e) { resolve({ ok: false }); }
      });
    });
    req.on('error', () => resolve({ ok: false }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false }); });
    req.write(data);
    req.end();
  });
}

// Try to fix a broken Mermaid block via Haiku. Returns { fixed: <new block> }
// only when the result passes lintMermaid clean. Otherwise returns null and
// the block is left alone.
async function fixBrokenMermaid(question, brokenBlock, issues) {
  const r = await claudePost({
    model: HAIKU_MODEL,
    max_tokens: 600,
    system: `You fix broken Mermaid diagram syntax in PULSE RevOps library entries.

VIBE GUARDRAILS (this is not generic content — it's operator-grade RevOps research for senior sales leaders):
- Tone is sharp, technical, operator-led — never corporate-fluffy
- Audience: CROs, VPs Sales, RevOps leaders. Grown-ups with an edge.
- Labels should use the actual vocabulary of the discipline (ARR, NRR, MEDDPICC, AE, OTE, Series B, ICP)

ALLOWED DIAGRAM TYPES — pick the one that BEST FITS the answer, do not invent new types:
gantt, sequenceDiagram, stateDiagram-v2, pie, mindmap, timeline, quadrantChart, flowchart LR, flowchart TB

PRESERVATION RULES:
- Preserve the original diagram type unless the type itself is invalid (e.g. typo)
- Preserve the original concept and node count (6-12 nodes typical)
- Don't soften technical terminology or add filler labels

SYNTAX RULES (must render in mermaid.js v10):
1. First non-blank line declares diagram type exactly, no leading words
2. Every [, (, { balanced with its closing pair
3. pie slices: "label" : number (quotes mandatory)
4. gantt: include "dateFormat YYYY-MM-DD" near the top
5. sequenceDiagram: declare participants, use ->> (sync) or -->> (async). Never <--> or --->>>
6. Node labels with parens/quotes/colons must be quoted: A["Label (with parens)"]

OUTPUT: Return ONLY the corrected \`\`\`mermaid fenced block. No explanation, no prose, no markdown wrapping. If unsalvageable, replace with a simpler valid diagram of the same type covering the same operator concept.`,
    messages: [{
      role: 'user',
      content: 'QUESTION: ' + String(question).slice(0, 200) + '\n\nISSUES DETECTED: ' + (issues || []).join('; ') + '\n\nBROKEN MERMAID:\n' + brokenBlock.slice(0, 2000) + '\n\nReturn ONLY the corrected ```mermaid fenced block.',
    }],
  });
  if (!r.ok) return null;
  const blocks = (r.data && r.data.content) || [];
  let txt = '';
  for (const b of blocks) { if (b.type === 'text' && b.text) txt += b.text; }
  const m = txt.match(/```mermaid\s*\n([\s\S]*?)```/);
  if (!m) return null;
  const candidate = m[1].trim();
  const newIssues = lintMermaid(candidate);
  if (newIssues.length) return null;  // Haiku's fix is also broken — don't write
  return candidate;
}

const { isVisitorPriorityActive } = require('./lib/visitor-priority');

exports.handler = async () => {
  /* visitor-priority-injected */
  try {
    let __vp_getStore = null;
    try { __vp_getStore = require('@netlify/blobs').getStore; } catch (_e) {}
    if (__vp_getStore) {
      let __vp_store = null;
      try { __vp_store = __vp_getStore('pulse-machine-library'); }
      catch (_e) {
        const __vp_tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
        const __vp_sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
        if (__vp_tok && __vp_sid) {
          try { __vp_store = __vp_getStore({ name: 'pulse-machine-library', siteID: __vp_sid, token: __vp_tok }); } catch (_e2) {}
        }
      }
      if (__vp_store && await isVisitorPriorityActive(__vp_store)) {
        return { statusCode: 200, body: JSON.stringify({ ok: true, paused: 'visitor-priority' }) };
      }
    }
  } catch (_e) {}

  const store = initStore();
  if (!store) return { statusCode: 200, body: 'no store' };

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const entries = idx.entries || [];

  const broken = [];        // entries flagged with Mermaid syntax issues
  const noVisual = [];      // entries with no visual at all
  const missingSources = [];// entries with empty / missing sources array
  const lowSources = [];    // entries with <3 sources
  const fulls = {};         // id → full answer object (kept so we can write back fixes)
  let withMermaid = 0;
  let withTableOnly = 0;
  let sourcesOk = 0;

  // Pull in batches of 10 to bound concurrency
  const batchSize = 10;
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    const batchFulls = await Promise.all(batch.map(e => store.get('answers/' + e.id + '.json', { type: 'json' }).catch(() => null)));
    batchFulls.forEach((full, j) => {
      const e = batch[j];
      if (!full) return;
      fulls[e.id] = full;
      const block = extractMermaid(full.answer);
      const tbl = hasMarkdownTable(full.answer);
      if (block) {
        withMermaid++;
        const issues = lintMermaid(block);
        if (issues.length) broken.push({ id: e.id, question: e.question, issues, preview: block.slice(0, 200), originalBlock: block });
      } else if (tbl) {
        withTableOnly++;
      } else {
        noVisual.push({ id: e.id, question: e.question });
      }
      // Sources audit — flag empty arrays + low counts
      const srcs = full.sources;
      if (!srcs || !Array.isArray(srcs) || srcs.length === 0) {
        missingSources.push({ id: e.id, question: e.question });
      } else if (srcs.length < 3) {
        lowSources.push({ id: e.id, question: e.question, count: srcs.length });
      } else {
        sourcesOk++;
      }
    });
  }

  // ─── Auto-fix step — for each broken entry, ask Haiku to repair the Mermaid.
  // Only writes back to the blob when the repaired block lints clean. Capped
  // at MAX_AUTOFIXES_PER_RUN to bound spend. Sequential (not parallel) to
  // avoid hitting Anthropic rate limits during a burst.
  const fixed = [];
  const fixFailed = [];
  if (process.env.ANTHROPIC_API_KEY) {
    const toFix = broken.slice(0, MAX_AUTOFIXES_PER_RUN);
    for (const b of toFix) {
      try {
        const newBlock = await fixBrokenMermaid(b.question, b.originalBlock, b.issues);
        if (newBlock) {
          const full = fulls[b.id];
          if (full && full.answer) {
            // Replace the FIRST mermaid block in the answer with the corrected one
            const newAnswer = full.answer.replace(/```mermaid\s*\n[\s\S]*?```/, '```mermaid\n' + newBlock + '\n```');
            full.answer = newAnswer;
            full.visual_auto_fixed_at = Date.now();
            await store.setJSON('answers/' + b.id + '.json', full);
            fixed.push({ id: b.id, question: b.question, prev_issues: b.issues });
          } else {
            fixFailed.push({ id: b.id, reason: 'no answer body' });
          }
        } else {
          fixFailed.push({ id: b.id, question: b.question, reason: 'haiku output still broken or missing' });
        }
        await new Promise(r => setTimeout(r, 250));  // politeness delay
      } catch (e) {
        fixFailed.push({ id: b.id, reason: 'exception: ' + (e && e.message) });
      }
    }
  }

  // Recompute "still broken" after auto-fix attempts
  const fixedIds = new Set(fixed.map(f => f.id));
  const stillBroken = broken.filter(b => !fixedIds.has(b.id));

  const today = dayKey();
  const summary = {
    day: today,
    ts: Date.now(),
    total: entries.length,
    with_mermaid: withMermaid,
    with_table_only: withTableOnly,
    broken_count: broken.length,
    no_visual_count: noVisual.length,
    auto_fixed_count: fixed.length,
    still_broken_count: stillBroken.length,
    fix_failed_count: fixFailed.length,
    sources_ok_count: sourcesOk,
    missing_sources_count: missingSources.length,
    low_sources_count: lowSources.length,
    broken: stillBroken,    // only the ones we couldn't fix
    no_visual: noVisual,
    missing_sources: missingSources,
    low_sources: lowSources,
    fixed,
  };

  // Store the day's audit snapshot
  try { await store.setJSON('_visual_audits/' + today + '.json', summary); } catch (e) {}

  // Email when there's signal — issues remaining OR auto-fixes shipped.
  // Stays silent on a clean day with no fixes (avoids inbox noise).
  const apiKey = process.env.RESEND_API_KEY || process.env.resendapikey;
  const to     = process.env.ALERT_TO_EMAIL || process.env.alert_to_email;
  const from   = process.env.ALERT_FROM_EMAIL || 'onboarding@resend.dev';
  const issuesCount = stillBroken.length + noVisual.length;
  const shouldEmail = issuesCount > 0 || fixed.length > 0;

  if (apiKey && to && shouldEmail) {
    const dateLabel = new Date(today + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    const renderBroken = (b) => `
      <div style="background:#0e131c;border:1px solid rgba(239,68,68,0.3);border-left:3px solid #ef4444;border-radius:8px;padding:12px 14px;margin-bottom:8px;">
        <div style="font-size:13px;font-weight:700;color:#EDE5D8;margin-bottom:4px;line-height:1.4;">${escHtml((b.question || '').slice(0, 130))}</div>
        <div style="font-size:11px;color:rgba(237,229,216,0.5);font-family:monospace;margin-bottom:6px;">id: <a href="${SITE}/knowledge/${escHtml(b.id)}" style="color:#FF8C1A;">${escHtml(b.id)}</a></div>
        <div style="font-size:12px;color:#ef4444;font-weight:700;margin-bottom:6px;">⚠ ${escHtml((b.issues || []).join(' · '))}</div>
        ${b.preview ? `<pre style="background:#070a0f;padding:8px;border-radius:4px;font-size:10px;color:rgba(237,229,216,0.6);overflow-x:auto;font-family:monospace;margin:0;">${escHtml(b.preview.slice(0, 200))}</pre>` : ''}
      </div>`;

    const renderNoVisual = (n) => `
      <div style="background:#0e131c;border:1px solid rgba(255,215,64,0.3);border-left:3px solid #FFD740;border-radius:8px;padding:10px 14px;margin-bottom:6px;">
        <div style="font-size:12px;color:#EDE5D8;line-height:1.4;">${escHtml((n.question || '').slice(0, 130))}</div>
        <div style="font-size:11px;color:rgba(237,229,216,0.5);font-family:monospace;">id: <a href="${SITE}/knowledge/${escHtml(n.id)}" style="color:#FF8C1A;">${escHtml(n.id)}</a></div>
      </div>`;

    const html = `<!doctype html>
<html><body style="margin:0;padding:24px 16px;background:#070a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#EDE5D8;">
  <div style="max-width:640px;margin:0 auto;background:#111518;border:1px solid rgba(232,113,10,0.25);border-radius:14px;padding:28px;">
    <div style="font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#FF8C1A;margin-bottom:6px;">◉ Pulse Machine — Visual Audit</div>
    <h1 style="font-size:22px;font-weight:900;color:#fff;margin:0 0 4px;">${fixed.length > 0 && issuesCount === 0 ? 'All clean — ' + fixed.length + ' auto-fixed' : issuesCount + ' ' + (issuesCount === 1 ? 'entry needs' : 'entries need') + ' attention'}</h1>
    <div style="font-size:13px;color:rgba(237,229,216,0.55);">${escHtml(dateLabel)}</div>

    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:20px 0;">
      <div style="background:#1A2025;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:10px;color:rgba(237,229,216,0.5);text-transform:uppercase;letter-spacing:1.4px;font-weight:700;">Total</div>
        <div style="font-size:20px;font-weight:900;color:#fff;margin-top:4px;">${summary.total}</div>
      </div>
      <div style="background:#1A2025;border:1px solid rgba(34,197,94,0.3);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:10px;color:rgba(237,229,216,0.5);text-transform:uppercase;letter-spacing:1.4px;font-weight:700;">Auto-fixed</div>
        <div style="font-size:20px;font-weight:900;color:#22c55e;margin-top:4px;">${fixed.length}</div>
      </div>
      <div style="background:#1A2025;border:1px solid rgba(255,215,64,0.3);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:10px;color:rgba(237,229,216,0.5);text-transform:uppercase;letter-spacing:1.4px;font-weight:700;">Table</div>
        <div style="font-size:20px;font-weight:900;color:#FFD740;margin-top:4px;">${withTableOnly}</div>
      </div>
      <div style="background:#1A2025;border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:10px;color:rgba(237,229,216,0.5);text-transform:uppercase;letter-spacing:1.4px;font-weight:700;">Still broken</div>
        <div style="font-size:20px;font-weight:900;color:#ef4444;margin-top:4px;">${issuesCount}</div>
      </div>
    </div>

    ${fixed.length ? `
      <div style="font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#22c55e;margin:18px 0 10px;">✓ Auto-fixed via Haiku · ${fixed.length}</div>
      ${fixed.slice(0, 20).map(f => `
        <div style="background:#0e131c;border:1px solid rgba(34,197,94,0.3);border-left:3px solid #22c55e;border-radius:8px;padding:10px 14px;margin-bottom:6px;">
          <div style="font-size:12px;color:#EDE5D8;line-height:1.4;">${escHtml((f.question || '').slice(0, 130))}</div>
          <div style="font-size:11px;color:rgba(237,229,216,0.5);font-family:monospace;">id: <a href="${SITE}/knowledge/${escHtml(f.id)}" style="color:#FF8C1A;">${escHtml(f.id)}</a> · was: ${escHtml((f.prev_issues || []).join(', '))}</div>
        </div>`).join('')}
    ` : ''}

    ${stillBroken.length ? `
      <div style="font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#ef4444;margin:18px 0 10px;">⚠ Still broken — Haiku couldn't fix · ${stillBroken.length}</div>
      ${stillBroken.slice(0, 20).map(renderBroken).join('')}
    ` : ''}

    ${noVisual.length ? `
      <div style="font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#FFD740;margin:18px 0 10px;">⚠ No visual at all · ${noVisual.length}</div>
      ${noVisual.slice(0, 20).map(renderNoVisual).join('')}
    ` : ''}

    <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:rgba(237,229,216,0.45);">
      <a href="${SITE}/.netlify/functions/pulse-machine-mermaid-check?key=pulsemachine" style="color:#FF8C1A;font-weight:700;">Open full diagnostic</a> · runs daily at 22:00 UTC
    </div>
  </div>
</body></html>`;

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from, to: [to],
          subject: fixed.length && !issuesCount
            ? `✓ Visual audit · ${fixed.length} auto-fixed · ${dateLabel}`
            : `🔧 Visual audit · ${fixed.length} fixed · ${issuesCount} still broken · ${dateLabel}`,
          html,
        }),
      });
    } catch (e) { console.error('[visual-audit] email err', e && e.message); }
  }

  console.log('[visual-audit] done', { total: entries.length, broken: broken.length, fixed: fixed.length, still_broken: stillBroken.length, no_visual: noVisual.length });
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, ...summary }),
  };
};
