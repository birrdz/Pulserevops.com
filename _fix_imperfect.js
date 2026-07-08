// _fix_imperfect — fix the entries flagged by _audit_green (build Top-10 images, re-grade, re-save).
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { ensureImages, auditImages } = require('./netlify/functions/lib/ensure-entry-images');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

(async () => {
  const r = JSON.parse(fs.readFileSync(WD + '/_audit_green_result.json', 'utf8'));
  const ids = (process.argv[2] ? process.argv.slice(2) : (r.imperfect || []).map(x => x.id));
  console.log('[fix] ' + ids.length + ' entries: ' + ids.join(' '));
  for (const id of ids) {
    const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (!e || !e.answer) { console.log('  ' + id + ' — no blob'); continue; }
    let body = e.answer;
    const before = gradeEntry(id, body, {}).score;
    try { const ri = await ensureImages(id, e.question, body); if (ri && ri.body) body = ri.body; } catch (x) { console.log('  ' + id + ' ensureImages err ' + x.message); }
    const g = gradeEntry(id, body, {}); const a = auditImages(id, body);
    await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: body, quality: g.score + '/13', updated_at: new Date().toISOString() }));
    console.log('  ' + id + ': ' + before + ' -> ' + g.score + '/13  · productImgs ' + a.productImgs + '/10 · compliant ' + a.compliant + (g.missing.length ? ' · missing ' + g.missing.join(',') : ''));
  }
  console.log('[fix] done');
})().catch(e => { console.log('FATAL', e && e.stack); process.exit(1); });
