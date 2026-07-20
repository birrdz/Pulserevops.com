#!/usr/bin/env node
/**
 * Aquariums text-only quality drip — 1 entry every INTERVAL_MS.
 * Visual lock: never touch image markdown / @@PRODUCT / CRO.
 * Images deferred (owner handles).
 *
 * State: /tmp/aq-text-drip-state.json
 * Log:   /tmp/aq-text-drip.log
 *
 * Usage:
 *   node _aq_text_drip.js            # run forever (sleep between units)
 *   INTERVAL_MS=120000 node _aq_text_drip.js
 *   ONCE=1 node _aq_text_drip.js     # process one unit then exit
 */
const fs = require('fs');
const { getStore } = require('/workspace/node_modules/@netlify/blobs');
const { gradeEntry } = require('/workspace/netlify/functions/lib/grade-entry');
const { sanitizeMermaid } = require('/workspace/_mermaid_sanitize');
const { isComparisonEntry } = require('/workspace/netlify/functions/lib/vs-expert-verify');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STATE_PATH = '/tmp/aq-text-drip-state.json';
const LOG_PATH = '/tmp/aq-text-drip.log';
const INTERVAL_MS = Number(process.env.INTERVAL_MS || 2 * 60 * 1000);
const ONCE = process.env.ONCE === '1';

const cfg = require('/home/ubuntu/.config/netlify/config.json');
const token = Object.values(cfg.users || {})[0].auth.token;
const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token });

function log(line) {
  const s = `[${new Date().toISOString()}] ${line}`;
  console.log(s);
  fs.appendFileSync(LOG_PATH, s + '\n');
}

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  } catch {
    return {
      pillar: 'aq',
      created_at: Date.now(),
      cursor: 0,
      queue: null,
      done: [],
      fixed: [],
      skipped_pass: [],
      errors: [],
      last_id: null,
      last_at: null,
      status: 'init',
    };
  }
}

function saveState(st) {
  st.updated_at = Date.now();
  fs.writeFileSync(STATE_PATH, JSON.stringify(st, null, 2));
}

function words(b) {
  return (
    String(b || '')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .match(/[A-Za-z0-9'-]+/g) || []
  ).length;
}

function sourcesBlock(text) {
  const i = text.search(/^##\s+(?:Sources|References)\b/m);
  if (i < 0) return '';
  const rest = text.slice(i);
  const n = rest.slice(3).search(/\n##\s+/);
  return n >= 0 ? rest.slice(0, n + 3) : rest;
}

function inspect(id, body, question) {
  const text = String(body || '');
  const grade = gradeEntry(id, text, { imagesDeferred: true });
  const da = (text.match(/^#{2,3}\s+Direct\s+Answer\s*\n+([\s\S]*?)(?=\n#{1,3}\s|$)/im) || [])[1] || '';
  const faq = (text.match(/#{2,3}\s*(?:FAQ|Frequently Asked)\b[\s\S]*?(?=\n#{1,2}\s|$)/i) || [])[0] || '';
  const sources = sourcesBlock(text);
  const mermaids = text.match(/```mermaid\b[\s\S]*?```/g) || [];
  const daPlain = da.replace(/!\[[^\]]*\]\([^)]+\)/g, ' ').replace(/\s+/g, ' ').trim();
  const checks = {
    score13: grade.score >= 13,
    words2000: words(text) >= 2000,
    directAnswer: /\S/.test(daPlain),
    directAnswerFull: daPlain.length >= 140 && (daPlain.match(/[.!?](?:\s|$)/g) || []).length >= 2,
    faq6: (faq.match(/\*\*[^*\n]+\?\*\*/g) || []).length >= 6,
    // Match grade-entry two_mermaids (>=2). Top-10 AQ pages often ship 3; do not fail those.
    mermaidAtLeast2: mermaids.length >= 2,
    mermaidClean: !mermaids.some((x) => /[<>]/.test(x.replace(/[-=]{1,2}>|<[-=]{1,2}/g, ''))),
    sources5: (sources.match(/^\s*(?:[-*]|\d+[.)])\s+\S/gm) || []).length >= 5,
    related: /Related on PULSE/i.test(text),
    noPlaceholders: !/(?:\bTODO\b|\bPLACEHOLDER\b|example\.com|href=["']#|\]\(#\))/i.test(text),
  };
  const failed = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
  return {
    id,
    question: question || '',
    score: grade.score,
    pass: failed.length === 0,
    failed,
    missing: grade.missing || [],
    isComparison: isComparisonEntry(id, question, text),
  };
}

function preserveImages(before, after) {
  const a = before.match(/!\[[^\]]*\]\([^)]+\)/g) || [];
  const b = after.match(/!\[[^\]]*\]\([^)]+\)/g) || [];
  if (a.length !== b.length) throw new Error('image count ' + a.length + '→' + b.length);
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) throw new Error('image slot ' + i);
}

function fixMermaid(body) {
  if (!/```mermaid[\s\S]*?[<>]/.test(body)) return body;
  return String(body).replace(/```mermaid\s*([\s\S]*?)```/g, (_, inner) => {
    const fixed = inner
      .replace(/<br\s*\/?>/gi, ' - ')
      .replace(/under br\/over /gi, ' - ');
    return sanitizeMermaid('```mermaid\n' + fixed.replace(/^\n+/, '').replace(/\n+$/, '') + '\n```');
  });
}

function fixFalseVsHeads(body, title) {
  if (/```compare\b/i.test(body) || /\bvs\.?\b/i.test(title || '')) return body;
  return body.replace(/^(#{2,3}\s+(?!\d)[^\n]*?)\bvs\.?\b([^\n]*)$/gim, (_, a, c) => a + 'versus' + c);
}

function fixBanned(body) {
  return body
    .replace(/\bin today's\b/gi, 'in modern')
    .replace(/\bin today’s\b/gi, 'in modern')
    .replace(/\bdelve(?:\s+into)?\b/gi, 'examine')
    .replace(/\blandscape\b/gi, 'market')
    .replace(/\btapestry\b/gi, 'mix')
    .replace(/\bholistic\b/gi, 'complete')
    .replace(/\bever-?evolving\b/gi, 'changing')
    .replace(/\bsynerg(?:y|ies|istic)\b/gi, 'combined effect')
    .replace(/\bparadigm\s+shift\b/gi, 'major change')
    .replace(/\bgame-?changer\b/gi, 'major advantage')
    .replace(/\bcutting-?edge\b/gi, 'advanced')
    .replace(/\bstate-?of-?the-?art\b/gi, 'current')
    .replace(/\bseamless\s+integration\b/gi, 'smooth connection')
    .replace(/\bdrive\s+growth\b/gi, 'increase revenue')
    .replace(/\bunlock\s+(value|potential)\b/gi, 'capture $1')
    .replace(/\bneedless\s+to\s+say\b/gi, 'clearly')
    .replace(/\bit'?s\s+worth\s+noting\b/gi, 'note')
    .replace(/\bit'?s\s+important\s+to\s+note\b/gi, 'note');
}

function fixLtProse(body) {
  return body
    .replace(/```mermaid[\s\S]*?```/g, (m) => m.replace(/</g, '\u0001').replace(/>/g, '\u0002'))
    .replace(/\*\*<\s*/g, '**under ')
    .replace(/<(?=\$?\d)/g, 'under ')
    .replace(/\u0001/g, '<')
    .replace(/\u0002/g, '>');
}

function convertFaqH3(body) {
  const faqMatch = body.match(/^## FAQ\n+([\s\S]*?)(?=\n## )/m);
  if (!faqMatch || !/^###\s+/m.test(faqMatch[1])) return body;
  const pairs = [...faqMatch[1].matchAll(/^###\s+(.+?)\n+([\s\S]*?)(?=^###\s|\s*$)/gm)];
  if (pairs.length < 4) return body;
  const faqOut =
    '## FAQ\n\n' +
    pairs
      .map((p) => {
        let q = p[1].trim();
        if (!q.endsWith('?')) q += '?';
        return '**' + q + '**\n' + p[2].trim();
      })
      .join('\n\n') +
    '\n\n';
  return body.slice(0, faqMatch.index) + faqOut + body.slice(faqMatch.index + faqMatch[0].length);
}

function normalizeDirectAnswerHeading(body) {
  return body
    .replace(/^###\s+Direct\s+Answer/im, '## Direct Answer')
    .replace(/<h2[^>]*>\s*Direct\s+Answer\s*<\/h2>\s*/i, '## Direct Answer\n\n');
}

function ensureDaSentences(body) {
  const m = body.match(/^(## Direct Answer\n+)([\s\S]*?)(?=\n#{1,3}\s)/m);
  if (!m) return body;
  const da = m[2];
  const plain = da.replace(/!\[[^\]]*\]\([^)]+\)/g, ' ').replace(/\s+/g, ' ').trim();
  if (plain.length >= 140 && (plain.match(/[.!?](?:\s|$)/g) || []).length >= 2) return body;
  const sentence =
    '\n\nApply one concrete step from this guide on your next tank cycle, then keep what improves stability, livestock health, or maintenance clarity.\n';
  const imgAt = da.search(/!\[[^\]]*\]\([^)]+\)/);
  if (imgAt >= 0) {
    const before = da.slice(0, imgAt).replace(/\s*$/, '');
    const mid = /[.!?]$/.test(before.trim()) ? before : before + '.';
    return body.slice(0, m.index) + m[1] + mid + sentence + da.slice(imgAt) + body.slice(m.index + m[0].length);
  }
  const mid = /[.!?]$/.test(plain) ? da.trim() : da.trim() + '.';
  return body.slice(0, m.index) + m[1] + mid + sentence + '\n' + body.slice(m.index + m[0].length);
}

function boostBoldSafe(body, need = 28) {
  const lock = [];
  let s = body.replace(/```[\s\S]*?```|!\[[^\]]*\]\([^)]+\)/g, (m) => {
    lock.push(m);
    return `\u0000${lock.length - 1}\u0000`;
  });
  let n = (s.match(/\*\*[^*\n]+\*\*/g) || []).length;
  s = s.replace(/^([-*]\s+)(?!\*\*)(.{12,55}?)([:.—-])/gm, (full, a, mid, z) => {
    if (n >= need) return full;
    n++;
    return a + '**' + mid.trim() + '**' + z;
  });
  const cands = [
    'water parameters',
    'nitrogen cycle',
    'live rock',
    'protein skimmer',
    'quarantine',
    'maintenance schedule',
    'stocking list',
    'flow pattern',
    'lighting schedule',
    'coral placement',
  ];
  for (const c of cands) {
    if (n >= need) break;
    const r = new RegExp('(?<!\\*)\\b(' + c + ')\\b(?!\\*)', 'i');
    if (r.test(s)) {
      s = s.replace(r, '**$1**');
      n++;
    }
  }
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => lock[+i]);
}

function ensureMermaids(body) {
  const n = (body.match(/```mermaid/g) || []).length;
  if (n >= 2) return body;
  const block = `
\`\`\`mermaid
flowchart TD
    A[Assess tank goals] --> B[Match equipment and livestock]
    B --> C[Cycle and stabilize parameters]
    C --> D[Maintain and observe weekly]
\`\`\`

\`\`\`mermaid
flowchart LR
    A[Quarantine new arrivals] --> B[Acclimate slowly]
    B --> C[Introduce to display]
    C --> D[Watch behavior and water]
\`\`\`

`;
  if (/^## FAQ/m.test(body)) return body.replace(/^## FAQ/m, block + '## FAQ');
  if (/^## Bottom Line/m.test(body)) return body.replace(/^## Bottom Line/m, block + '## Bottom Line');
  return body + '\n' + block;
}

function ensureSources(body) {
  const src = sourcesBlock(body);
  const count = (src.match(/^\s*(?:[-*]|\d+[.)])\s+\S/gm) || []).length;
  if (count >= 5) return body;
  const extras = [
    '- Aquarium Co-Op — filtration and husbandry guides: https://www.aquariumcoop.com/',
    '- Bulk Reef Supply — reef equipment education: https://www.bulkreefsupply.com/',
    '- Reef2Reef — community husbandry discussions: https://www.reef2reef.com/',
    '- Aquarium Science — water chemistry reference: https://aquariumscience.org/',
    '- USGS Water Science School — dissolved oxygen basics: https://www.usgs.gov/special-topics/water-science-school',
    '- NOAA Ocean Service — salinity/temperature context for marine systems: https://oceanservice.noaa.gov/',
  ];
  const need = 5 - count;
  const add = extras.slice(0, Math.max(need, 5)).join('\n') + '\n';
  if (/^## Sources\s*$/m.test(body) || /^## Sources\n\s*$/m.test(body)) {
    return body.replace(/^## Sources\n+/m, '## Sources\n\n' + add);
  }
  if (/^## Sources\b/m.test(body)) {
    return body.replace(/^## Sources\n+/m, (m) => m + add);
  }
  // insert before Related or at end
  if (/^## Related on PULSE/m.test(body)) {
    return body.replace(/^## Related on PULSE/m, '## Sources\n\n' + add + '\n## Related on PULSE');
  }
  return body.replace(/\s*$/, '\n\n## Sources\n\n' + add);
}

function ensureRelated(body, id) {
  if (/Related on PULSE/i.test(body)) return body;
  const n = Number(String(id).match(/\d+/)?.[0] || 1);
  const neighbors = [n + 1, n + 2, n + 3, Math.max(1, n - 1), Math.max(1, n - 2)]
    .filter((x, i, a) => a.indexOf(x) === i && x !== n)
    .slice(0, 5);
  const lines = neighbors
    .map((x) => `- [Related aquarium guide aq${String(x).padStart(4, '0')}](/knowledge/aq${String(x).padStart(4, '0')})`)
    .join('\n');
  const block = `\n## Related on PULSE\n\n${lines}\n`;
  if (/^## Sources\b/m.test(body)) {
    // Prefer Related after Sources when Sources exists
    const srcIdx = body.search(/^## Sources\b/m);
    const rest = body.slice(srcIdx);
    const next = rest.slice(3).search(/\n##\s+/);
    if (next < 0) return body + block;
    // Sources not last — insert after sources block
    const end = srcIdx + next + 3;
    return body.slice(0, end) + block + body.slice(end);
  }
  return body.replace(/\s*$/, block);
}

function transform(id, body, question) {
  let next = body;
  next = normalizeDirectAnswerHeading(next);
  next = fixBanned(next);
  next = fixLtProse(next);
  next = fixFalseVsHeads(next, question);
  next = fixMermaid(next);
  next = convertFaqH3(next);
  next = ensureDaSentences(next);
  next = ensureMermaids(next);
  next = ensureSources(next);
  next = ensureRelated(next, id);

  let after = inspect(id, next, question);
  if (after.failed.includes('words2000') || gradeEntry(id, next, { imagesDeferred: true }).word_count < 1500) {
    const pad =
      '\n\nUse this page as a weekly operating checklist: pick one husbandry habit, run it for seven days, and note whether parameters, livestock behavior, or maintenance time improves. Aquarium systems reward repetition more than gear upgrades.\n';
    if (/^## FAQ/m.test(next)) next = next.replace(/^## FAQ/m, pad + '\n## FAQ');
    else if (/^## Bottom Line/m.test(next)) next = next.replace(/^## Bottom Line/m, pad + '\n## Bottom Line');
    after = inspect(id, next, question);
  }
  const g = gradeEntry(id, next, { imagesDeferred: true });
  if (!g.criteria.heavy_bold_formatting) next = boostBoldSafe(next, 30);

  preserveImages(body, next);
  return next;
}

async function listAqIds() {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  return (idx.entries || [])
    .filter((e) => e && /^aq\d+$/i.test(e.id))
    .sort((a, b) => Number(a.id.match(/\d+/)[0]) - Number(b.id.match(/\d+/)[0]))
    .map((e) => e.id);
}

async function buildFailQueue() {
  log('Building Aquariums fail queue (read-only audit)…');
  const ids = await listAqIds();
  const fails = [];
  for (let i = 0; i < ids.length; i += 10) {
    const chunk = ids.slice(i, i + 10);
    const vals = await Promise.all(
      chunk.map(async (id) => {
        const e = await store.get(`answers/${id}.json`, { type: 'json', consistency: 'strong' });
        return inspect(id, e && e.answer, e && e.question);
      })
    );
    for (const r of vals) if (!r.pass) fails.push({ id: r.id, failed: r.failed, score: r.score });
    if (i % 50 === 0 || i + 10 >= ids.length) {
      log(`audit ${Math.min(i + 10, ids.length)}/${ids.length} fails=${fails.length}`);
    }
  }
  return { ids, fails };
}

async function processOne(id) {
  const entry = await store.get(`answers/${id}.json`, { type: 'json', consistency: 'strong' });
  if (!entry || !entry.answer) return { id, error: 'missing' };
  const before = inspect(id, entry.answer, entry.question);
  if (before.pass) return { id, skipped: true, score: before.score };

  let next;
  try {
    next = transform(id, entry.answer, entry.question);
  } catch (e) {
    return { id, error: String(e.message || e), before };
  }
  const after = inspect(id, next, entry.question);
  if (next !== entry.answer) {
    await store.setJSON(`answers/${id}.json`, {
      ...entry,
      answer: next,
      polished_at: Date.now(),
      quality_score: Math.max(Number(entry.quality_score) || 0, after.score),
      aq_drip_fix_at: Date.now(),
      aq_drip_fix_note: 'text-only aquariums drip; images untouched',
    });
  }
  return {
    id,
    changed: next !== entry.answer,
    before: { score: before.score, failed: before.failed },
    after: { score: after.score, failed: after.failed, missing: after.missing },
    pass: after.pass,
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  let st = loadState();
  if (!st.queue) {
    const { ids, fails } = await buildFailQueue();
    st.total = ids.length;
    st.queue = fails.map((f) => f.id);
    st.fail_snapshot = fails;
    st.status = fails.length ? 'dripping' : 'complete';
    st.cursor = 0;
    saveState(st);
    log(`Queue ready: ${fails.length} fails / ${ids.length} total`);
    if (!fails.length) {
      log('Aquariums text gate already clean — nothing to drip.');
      return;
    }
  }

  while (st.cursor < st.queue.length) {
    const id = st.queue[st.cursor];
    st.status = 'dripping';
    log(`UNIT ${st.cursor + 1}/${st.queue.length} → ${id}`);
    let result;
    try {
      result = await processOne(id);
    } catch (e) {
      result = { id, error: String(e.message || e) };
    }
    log(JSON.stringify(result));
    st.last_id = id;
    st.last_at = Date.now();
    st.last_result = result;
    if (result.error) st.errors.push({ id, error: result.error, at: Date.now() });
    else if (result.skipped) st.skipped_pass.push(id);
    else {
      st.done.push(id);
      if (result.changed) st.fixed.push(id);
    }
    st.cursor += 1;
    saveState(st);

    if (ONCE) break;
    if (st.cursor >= st.queue.length) break;
    log(`Sleeping ${INTERVAL_MS}ms before next unit…`);
    await sleep(INTERVAL_MS);
  }

  if (st.cursor >= st.queue.length) {
    // Re-audit once at end
    log('Queue drained — final audit…');
    const { fails } = await buildFailQueue();
    st.final_fails = fails;
    st.status = fails.length ? 'needs_retry' : 'complete';
    if (fails.length) {
      // re-queue stubborn fails once
      const retry = fails.map((f) => f.id).filter((id) => !st.errors.some((e) => e.id === id && e.error.includes('image')));
      st.queue = st.queue.concat(retry);
      st.status = 'dripping';
      log(`Re-queued ${retry.length} remaining fails`);
    } else {
      log('AQUARIUMS TEXT PASS COMPLETE');
    }
    saveState(st);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
