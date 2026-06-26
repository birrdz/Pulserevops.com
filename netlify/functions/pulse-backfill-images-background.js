// pulse-backfill-images-background — DURABLE Top-10 image+link backfill.
// JOB-QUEUE driven: drains _backfill_jobs.json so pivots need no redeploy.
//
// _backfill_jobs.json = {
//   jobs: [ { prefix:'es', limit:10, done:0, suffix:'', suffixFromTitle:false } ... ],
//   cursor: { es: <lastNum>, tn: <lastNum> }   // advance-only per prefix
// }
// Each run: pick first job with done<limit, backfill ONE entry of that prefix
// with @@PRODUCT cards (real Serper Google image + source link per item),
// email the owner, advance. Idles when all jobs are done.
//
// Env: SERPER_API_KEY, resendapikey/RESEND_API_KEY, ALERT_FROM_EMAIL.
const { getStore } = require('@netlify/blobs');

const RECIPIENT = 'koryjordanwhite@gmail.com';
const LOCK_MS = 8 * 60 * 1000;
const PILLAR_PATH = { er:'electronic-reviews', ca:'cars', sc:'schools', dn:'dining', bt:'boats', mv:'movies', wl:'wellness', tv:'travel', rs:'resorts', es:'estates', cl:'clubs', lv:'living', ev:'events', ga:'gatherings', gm:'gaming', nl:'nightlife', tl:'tools', tn:'towns', co:'collectibles', ai:'ai-infrastructure', aq:'aquariums', hf:'highschool-football-recruiting' };

function store() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  return (tok && sid) ? getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }) : getStore('pulse-machine-library');
}
const num = (id) => { const m = String(id).match(/\d+/); return m ? parseInt(m[0], 10) : 0; };
const prefixOf = (id) => { const m = String(id).match(/^([a-z]+)\d+$/i); return m ? m[1].toLowerCase() : null; };
function cleanName(s) {
  return s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}⭐️]/gu, ' ')
    .replace(/\bBEST OVERALL\b/gi, '').replace(/\bBEST VALUE\b/gi, '')
    .replace(/\s{2,}/g, ' ').trim();
}
async function headOk(url) {
  try { const r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(9000) });
    const ct = (r.headers.get('content-type') || '').toLowerCase(); return r.ok && ct.startsWith('image/'); } catch (e) { return false; }
}
async function serperImages(queries) {
  const r = await fetch('https://google.serper.dev/images', { method: 'POST',
    headers: { 'X-API-KEY': process.env.SERPER_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(queries.map(q => ({ q }))), signal: AbortSignal.timeout(25000) });
  const d = await r.json(); return Array.isArray(d) ? d : [d];
}
async function emailOwner(subject, html) {
  const rs = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
  const from = process.env.ALERT_FROM_EMAIL || process.env.alert_from_email || 'onboarding@resend.dev';
  if (!rs) return;
  try { await fetch('https://api.resend.com/emails', { method: 'POST',
    headers: { Authorization: 'Bearer ' + rs, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [RECIPIENT], subject, html }) }); } catch (e) {}
}
async function backfillBody(answer, qSuffix) {
  const lines = answer.split(/\r?\n/);
  const items = [];
  for (const l of lines) { const m = l.match(/^##\s+(\d+)\.\s+(.+)$/); if (m) items.push({ idx: m[1], q: cleanName(m[2]) }); }
  if (items.length < 5) return null;
  const results = await serperImages(items.map(i => i.q + (qSuffix ? ' ' + qSuffix : '')));
  const picks = await Promise.all(items.map(async (it, i) => {
    const arr = (results[i] && results[i].images) || [];
    for (const c of arr.slice(0, 6)) { if (!c.imageUrl) continue; if (await headOk(c.imageUrl)) return { idx: it.idx, q: it.q, img: c.imageUrl, site: c.link || '' }; }
    return { idx: it.idx, q: it.q, img: '', site: (arr[0] && arr[0].link) || '' };
  }));
  const seen = new Set();
  for (const p of picks) { if (p.img) { if (seen.has(p.img)) p.img = ''; else seen.add(p.img); } }
  const card = {}; let imgs = 0, links = 0;
  for (const p of picks) {
    let s = `@@PRODUCT name="${p.q.replace(/"/g, '')}"`;
    if (p.img) { s += ` img="${p.img.replace(/"/g, '')}"`; imgs++; }
    if (p.site) { s += ` site="${p.site.replace(/"/g, '')}"`; links++; }
    card[p.idx] = s;
  }
  const out = [];
  for (const l of lines) { out.push(l); const m = l.match(/^##\s+(\d+)\.\s/); if (m && card[m[1]]) out.push(card[m[1]]); }
  return { body: out.join('\n'), imgs, links, items: items.length };
}

exports.handler = async () => {
  const s = store();
  let lock = null; try { lock = await s.get('_backfill_lock.json', { type: 'json' }); } catch (e) {}
  if (lock && lock.ts && (Date.now() - lock.ts) < LOCK_MS) return { statusCode: 200, body: 'locked' };
  await s.setJSON('_backfill_lock.json', { ts: Date.now() });
  const unlock = async () => { try { await s.setJSON('_backfill_lock.json', { ts: 0 }); } catch (e) {} };

  try {
    const jb = await s.get('_backfill_jobs.json', { type: 'json' });
    if (!jb || !Array.isArray(jb.jobs)) { await unlock(); return { statusCode: 200, body: 'no jobs' }; }
    jb.cursor = jb.cursor || {};
    const job = jb.jobs.find(j => (j.done || 0) < j.limit);
    if (!job) { await unlock(); return { statusCode: 200, body: 'all jobs done' }; }
    const prefix = job.prefix;

    const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
    const ids = (idx.entries || []).filter(e => prefixOf(e.id) === prefix).map(e => e.id).sort((a, b) => num(a) - num(b));
    const cnum = jb.cursor[prefix] || 0;
    const id = ids.find(x => num(x) > cnum);
    if (!id) { job.done = job.limit; await s.setJSON('_backfill_jobs.json', jb); await unlock();
      await emailOwner(`PULSE backfill: ${prefix} exhausted`, `<p>No more ${prefix} entries to backfill; job complete at ${job.done}.</p>`);
      return { statusCode: 200, body: prefix + ' exhausted' }; }
    jb.cursor[prefix] = num(id);
    await s.setJSON('_backfill_jobs.json', jb); // advance cursor regardless

    const entry = await s.get('answers/' + id + '.json', { type: 'json' });
    if (!entry || !entry.answer || /@@PRODUCT/.test(entry.answer)) { await unlock(); return { statusCode: 200, body: 'skip ' + id }; }

    let suffix = job.suffix || '';
    if (job.suffixFromTitle) { const mm = (entry.question || '').match(/\b(?:to live in|in|across|near)\s+([A-Z][\w .&'\/-]+?)\s*$/i); if (mm) suffix = mm[1].trim(); }

    const res = await backfillBody(entry.answer, suffix);
    if (!res) { await unlock(); return { statusCode: 200, body: 'no items ' + id }; }
    entry.answer = res.body; entry.ts = Date.now(); entry.polished_at = Date.now();
    await s.setJSON('answers/' + id + '.json', entry);
    job.done = (job.done || 0) + 1; await s.setJSON('_backfill_jobs.json', jb);

    try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }) }); } catch (e) {}
    await emailOwner(`PULSE backfill: ${id} done (${prefix} ${job.done}/${job.limit})`,
      `<p><b>${id} - ${entry.question}</b></p><p>${res.imgs} images / ${res.links} links across ${res.items} items${suffix ? ' (ctx: ' + suffix + ')' : ''}.</p><p>https://pulserevops.com/${PILLAR_PATH[prefix] || 'knowledge'}/${id}</p><p>${prefix} job: ${job.done}/${job.limit}.</p>`);

    await unlock();
    return { statusCode: 200, body: JSON.stringify({ ok: true, id, prefix, done: job.done }) };
  } catch (err) { await unlock(); return { statusCode: 500, body: String(err && err.message) }; }
};
