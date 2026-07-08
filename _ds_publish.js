// Generic TEXT-FIRST publisher for ANY pillar (LAW 2026-06-23: DeepSeek text now,
// Claude images later). Reads body from C:/Users/koryj/<id>_answer.md, grades with
// images deferred, applies pillar SEO, writes blob + index, stamps images_deferred_at.
// Usage: node _ds_publish.js <id> "<title>" [--tags=a,b,c]
// Returns JSON {ok,id,score,words,url}.
const fs = require('fs');
const { prepareBodyForGrade, prepareEntryForPublish, finalizeIndexNow } = require('./_write_lib');
const { getStore } = require('@netlify/blobs');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

// Per-pillar default tags + URL path segment.
const PILLAR = {
  q:  { tags: ['revops', 'current-events-2027', 'sales-ai'], seg: 'knowledge' },
  cg: { tags: ['sales-coaching', 'coaching', 'coaching-playbook'], seg: 'coaching' },
  ra: { tags: ['revenue-architecture', 'revops', 'gtm'], seg: 'knowledge' },
  gp: { tags: ['gtm-playbook', 'go-to-market', 'revops'], seg: 'knowledge' },
  ik: { tags: ['industry-kpis', 'kpi', 'revops-metrics'], seg: 'industry-kpis' },
  tk: { tags: ['tech-stack', 'revops-tools', 'sales-stack'], seg: 'tech-stacks' },
  st: { tags: ['sales-training', 'enablement', 'coaching'], seg: 'sales-trainings' },
  pt: { tags: ['pets', 'pet-care', 'best-of-2027'], seg: 'pets' },
  sw: { tags: ['software', 'software-comparison', 'saas', 'best-of-2027'], seg: 'software' },
  ai: { tags: ['ai-tool-review', 'top-10', 'ai-tools', 'ai-infrastructure', 'best-of-2027'], seg: 'ai-infrastructure' },
  ga: { tags: ['gatherings', 'top-10', 'best-of-2027'], seg: 'gatherings' },
  tl: { tags: ['revops-tools', 'sales-tools', 'tools', 'best-of-2027'], seg: 'tools' },
  sy: { tags: ['style', 'what-to-wear', 'outfits', 'work-style'], seg: 'style' },
  tc: { tags: ['telco', 'telecom', 'wireless', 'cellular-carrier', 'top-10', 'best-of-2027'], seg: 'telco' },
  kw: { tags: ['kory-white-projects', 'projects', 'portfolio'], seg: 'kory-white-projects' },
  cr: { tags: ['crabbing', 'crab', 'chesapeake', 'blue-crab', 'best-of-2027'], seg: 'crabbing' },
  fs: { tags: ['fishing', 'fishing-spots', 'chesapeake', 'angling', 'best-of-2027'], seg: 'fishing' },
};
const prefixOf = (id) => (String(id).match(/^([a-z]+)/i) || [])[1];

async function publishTextFirst(id, title, opts = {}) {
  const BODY_PATH = `C:/Users/koryj/${id}_answer.md`;
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  let body = fs.readFileSync(BODY_PATH, 'utf8');
  const now = Date.now();
  const pfx = prefixOf(id);
  const conf = PILLAR[pfx] || { tags: [pfx], seg: 'knowledge' };
  const tags = Array.from(new Set([...(conf.tags || []), ...(opts.tags || [])]));

  // EXACT-duplicate guard (owner law): a duplicate = the SAME question WORD FOR WORD
  // WITHIN THE SAME PILLAR. Two rules from the owner:
  //   1. Near-but-not-identical questions ARE allowed — match verbatim (whitespace-
  //      normalized only; case + punctuation stay significant), never fuzzy.
  //   2. The same question in a DIFFERENT pillar is intentional crossover — allowed.
  // So we only block when another id in the SAME pillar prefix has the exact question.
  // Re-writing the same id is fine. Checked before grading/blob-write so no orphan blob.
  const exactKey = (q) => String(q || '').trim().replace(/\s+/g, ' ');
  if (!opts.allowDuplicate) {
    const pre = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
    const key = exactKey(title);
    const clash = (pre.entries || []).find((e) => e && e.id !== id && prefixOf(e.id) === pfx && exactKey(e.question) === key);
    if (clash) return { ok: false, id, reason: 'duplicate', dupeOf: clash.id };
  }

  const prep = await prepareBodyForGrade(id, title, body, { skipImages: true });
  body = prep.body;
  const grade = prep.grade;
  if (grade.score < 10) {
    return { ok: false, id, reason: 'grade', score: grade.score, missing: grade.missing, banned: grade.banned_hits };
  }

  // CRO card: render-time only (pulse-machine-entry insertCroAd). Do not bake into blobs.
  try { const { stripAllCroFromBody } = require('./_cro_strip_lib'); body = stripAllCroFromBody(body); } catch (e) {}

  const existing = await store.get(`answers/${id}.json`, { type: 'json' });
  const prevQs = existing && typeof existing.quality_score === 'number' ? existing.quality_score : 0;
  let entry = {
    id, question: title, answer: body, tags,
    quality_score: 10, format_v: '2026-05', pending: false,
    ts: now, polished_at: now, model: 'deepseek-chat', gold_format: true,
    images_deferred_at: now, images_pending: true,
    polish_history: [
      ...(existing && Array.isArray(existing.polish_history) ? existing.polish_history : []),
      { from: prevQs, to: 10, at: now, note: existing ? 'deepseek text-first upgrade' : 'deepseek text-first direct-write' },
    ],
  };
  entry = prepareEntryForPublish(id, title, entry);
  await store.setJSON(`answers/${id}.json`, entry);

  const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
  const ix = idx.entries.findIndex((e) => e && e.id === id);
  const indexEntry = {
    id, question: title, tags: entry.tags, quality_score: 10, format_v: '2026-05',
    pending: false, ts: now, polished_at: now, model: 'deepseek-chat', was_indexed_at: null,
    seo_optimized_at: entry.seo_optimized_at || now, images_pending: true,
  };
  if (ix >= 0) idx.entries.splice(ix, 1);
  idx.entries.unshift(indexEntry);
  await store.setJSON('_index.json', idx);

  try { fs.unlinkSync(BODY_PATH); } catch (e) {}
  let indexed = null;
  try { indexed = await finalizeIndexNow(id, store, indexEntry); } catch (e) {}
  return { ok: true, id, score: grade.score, words: grade.word_count, url: `https://pulserevops.com/${conf.seg}/${id}`, indexnow: indexed };
}

module.exports = { publishTextFirst, PILLAR, prefixOf };

if (require.main === module) {
  (async () => {
    const id = process.argv[2];
    const title = process.argv[3];
    const tagsArg = (process.argv.find((a) => a.startsWith('--tags=')) || '').replace('--tags=', '');
    if (!id || !title) { console.error('usage: node _ds_publish.js <id> "<title>" [--tags=a,b]'); process.exit(1); }
    const r = await publishTextFirst(id, title, { tags: tagsArg ? tagsArg.split(',') : [] });
    console.log(JSON.stringify(r));
    if (!r.ok) process.exit(2);
  })().catch((e) => { console.error('ERR', e.message); process.exit(1); });
}
