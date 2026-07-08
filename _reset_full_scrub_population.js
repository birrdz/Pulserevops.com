// Full population reset: every Q&A back in scrub queue, green cleared, certified badges stripped
// so nothing fast-passes — all must go through real scrub/cook.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const KEY = '4444';
const AP = WD + '/_v2_approved.json';
const CC = WD + '/_v2_cc_approved.json';
const QUEUE = WD + '/_scrub_button_queue.json';
const COOKQ = WD + '/_scrub_cook_queue.json';
const CONC = parseInt(process.env.STRIP_CONC || '8', 10);
const PACE = parseInt(process.env.STRIP_PACE || '40', 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));

for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

async function stopScrub() {
  try {
    await fetch('http://localhost:8899/scrub-auto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: KEY, action: 'stop' }) });
    for (let i = 0; i < 12; i++) {
      const st = await fetch('http://localhost:8899/scrub-status?key=' + KEY).then(r => r.json()).catch(() => null);
      if (!st || !st.running) return;
      await sleep(500);
    }
  } catch (e) {}
}

(async () => {
  console.log('[full-reset] stopping scrubber…');
  await stopScrub();

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ids = [...new Set((idx.entries || []).filter(e => e && e.id && !/^vq_/i.test(e.id)).map(e => e.id))];

  const bak = WD + '/_scrub_full_reset_backup_' + Date.now() + '.json';
  fs.writeFileSync(bak, JSON.stringify({
    at: new Date().toISOString(),
    ap: JSON.parse(fs.readFileSync(AP, 'utf8')),
    cc: JSON.parse(fs.readFileSync(CC, 'utf8')),
    queue: JSON.parse(fs.readFileSync(QUEUE, 'utf8')),
    cook: JSON.parse(fs.readFileSync(COOKQ, 'utf8')),
  }));

  fs.writeFileSync(AP, '[]');
  fs.writeFileSync(CC, '[]');
  fs.writeFileSync(COOKQ, '[]');
  fs.writeFileSync(QUEUE, JSON.stringify(ids));
  console.log('[full-reset] pool files: green=0, queue=' + ids.length + ', cook=0');
  console.log('[full-reset] backup:', bak);

  console.log('[full-reset] stripping certified badges from ' + ids.length + ' blobs…');
  let qi = 0, stripped = 0, done = 0;
  async function worker() {
    while (qi < ids.length) {
      const id = ids[qi++];
      try {
        const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
        if (e && (e.cc_signed || e.claude_certified || e.quality || e.cc_signed_at)) {
          const bakFields = { cc_signed: e.cc_signed, claude_certified: e.claude_certified, quality: e.quality, cc_signed_at: e.cc_signed_at };
          const ne = Object.assign({}, e);
          delete ne.cc_signed;
          delete ne.claude_certified;
          delete ne.quality;
          delete ne.cc_signed_at;
          ne._pre_strip = Object.assign({}, e._pre_strip || {}, bakFields);
          ne.badge_stripped = true;
          ne.updated_at = new Date().toISOString();
          await store.setJSON('answers/' + id + '.json', ne);
          stripped++;
        }
      } catch (x) {}
      if (++done % 500 === 0) console.log('[full-reset] strip ' + done + '/' + ids.length + ' · stripped=' + stripped);
      await sleep(PACE);
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));
  console.log('[full-reset] strip DONE · stripped=' + stripped + ' of ' + ids.length);

  const st = await fetch('http://localhost:8899/state?key=' + KEY).then(r => r.json()).catch(() => null);
  if (st) console.log('[full-reset] UI:', { green: st.green, under: st.under });
  console.log('[full-reset] ready — hit Begin Scrub when you want to start (no server restart needed).');
})().catch(e => { console.error('[full-reset] FATAL', e.message); process.exit(1); });
