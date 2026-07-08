const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ids = (idx.entries || []).filter(e => e && e.id && !/^vq_/i.test(e.id)).map(e => e.id);
  const ap = JSON.parse(fs.readFileSync(WD + '/_v2_approved.json', 'utf8'));
  const q = JSON.parse(fs.readFileSync(WD + '/_scrub_button_queue.json', 'utf8'));
  const c = JSON.parse(fs.readFileSync(WD + '/_scrub_cook_queue.json', 'utf8'));
  const cc = JSON.parse(fs.readFileSync(WD + '/_v2_cc_approved.json', 'utf8'));
  let idxCc = 0;
  for (const e of idx.entries || []) { if (e.cc_signed) idxCc++; }
  console.log(JSON.stringify({ index: ids.length, queue: q.length, cook: c.length, ap: ap.length, ccList: cc.length, indexCcSigned: idxCc }, null, 2));
  const st = await fetch('http://localhost:8899/scrub-status?key=4444').then(r => r.json()).catch(() => null);
  if (st) console.log('scrub:', { running: st.running, green: st.state.green, under: st.state.under, stage: st.stage });
})().catch(e => { console.error(e.message); process.exit(1); });
