// ════════════════════════════════════════════════════════════════════════
// mermaid-audit-fix-background — runs hourly. Walks every library entry,
// applies DETERMINISTIC mermaid syntax fixes, and queues entries that need
// LLM regeneration (zero mermaid block) into apollo-daily-queue/mermaid-
// pending.json so the next active Claude Code session can patch them.
//
// Deterministic fixes (no API spend):
//   - ]] → ]   (the double-bracket close bug we've seen on workers)
//   - Trailing whitespace inside ["..."]  collapsed
//   - Stray BOM / non-printable chars stripped
//
// Queues for human/LLM regeneration:
//   - Any entry whose `answer` has no fenced ```mermaid block
//   - Any entry whose mermaid block fails to start with a recognised graph
//     directive (graph, flowchart, sequenceDiagram, etc.)
//
// Required env: BLOBS_PAT
// ════════════════════════════════════════════════════════════════════════

const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

const VALID_DIRECTIVES = [
  'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram',
  'erDiagram', 'gantt', 'pie', 'journey', 'mindmap', 'timeline', 'gitGraph',
  'quadrantChart', 'sankey-beta', 'xychart-beta',
];

function fixMermaid(answer) {
  if (typeof answer !== 'string') return { answer, changed: false };
  const before = answer;
  let s = answer;

  // Find each ```mermaid ... ``` block and apply fixes inside it
  s = s.replace(/```mermaid([\s\S]*?)```/g, (whole, inner) => {
    let body = inner;
    // 1) ]] before -->, ---, --, ==, ==>, |, end-of-line → ]
    body = body.replace(/\]\](\s*(?:-->|---|--|==>|==|\||$))/gm, ']$1');
    // 2) ]]<newline> → ]<newline>
    body = body.replace(/\]\](\s*\n)/g, ']$1');
    // 3) double-quoted brackets like ["foo "] with trailing space pre-quote — collapse
    body = body.replace(/\["\s+/g, '["').replace(/\s+"\]/g, '"]');
    // 4) strip BOM / soft-hyphen / zero-width junk
    body = body.replace(/[​-‏﻿­]/g, '');
    return '```mermaid' + body + '```';
  });

  return { answer: s, changed: s !== before };
}

function looksValidMermaid(blockBody) {
  if (!blockBody) return false;
  const trimmed = blockBody.trim().split('\n')[0].trim();
  return VALID_DIRECTIVES.some(d => trimmed.toLowerCase().startsWith(d.toLowerCase()));
}

exports.handler = async () => {
  const lib = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: process.env.BLOBS_PAT });
  const queueStore = getStore({ name: 'apollo-daily-queue', siteID: SITE_ID, token: process.env.BLOBS_PAT });

  let idx;
  try { idx = (await lib.get('_index.json', { type: 'json' })) || { entries: [] }; }
  catch (e) { console.error('[mermaid-audit] index load failed:', e.message); return { statusCode: 200, body: 'idx fail' }; }

  const totals = { scanned: 0, fixed: 0, queued: 0, ok: 0, failed: 0 };
  const queued = [];
  const fixed = [];

  // Walk entries — cap at 200 per run to stay under timeout (15min for background fns)
  const slice = idx.entries.slice(0, 200);
  for (const meta of slice) {
    if (!meta || !meta.id) continue;
    // Graphics (gb####) are downloadable visual assets, not text entries — they
    // never carry mermaid diagrams, so skip them rather than queue regeneration.
    if (/^gb\d+$/i.test(meta.id)) continue;
    totals.scanned++;
    let entry;
    try { entry = await lib.get('answers/' + meta.id + '.json', { type: 'json' }); }
    catch (e) { totals.failed++; continue; }
    if (!entry || typeof entry.answer !== 'string') { totals.failed++; continue; }

    const blockMatch = entry.answer.match(/```mermaid([\s\S]*?)```/);
    if (!blockMatch || !looksValidMermaid(blockMatch[1])) {
      // Queue for LLM regeneration — no API call here
      queued.push({ id: meta.id, question: meta.question || entry.question || '', reason: blockMatch ? 'bad_directive' : 'missing_mermaid' });
      totals.queued++;
      continue;
    }

    const result = fixMermaid(entry.answer);
    if (result.changed) {
      try {
        await lib.setJSON('answers/' + meta.id + '.json', { ...entry, answer: result.answer });
        fixed.push(meta.id);
        totals.fixed++;
      } catch (e) {
        totals.failed++;
      }
    } else {
      totals.ok++;
    }
  }

  const report = {
    ran_at: new Date().toISOString(),
    totals,
    fixed_ids: fixed.slice(0, 50),
    queued: queued.slice(0, 100),
    note: queued.length
      ? 'Entries in `queued` need a fresh mermaid generated; pick them up next active Claude Code session.'
      : 'All scanned entries have a valid fenced mermaid block.',
  };

  try { await queueStore.setJSON('mermaid-pending.json', report); } catch (e) {}

  console.log('[mermaid-audit]', JSON.stringify(totals));
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report, null, 2),
  };
};

// Hourly
exports.config = { schedule: '15 * * * *' };  // 15 past every hour to avoid stampede with other crons
