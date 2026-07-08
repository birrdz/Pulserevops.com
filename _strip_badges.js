// _strip_badges — take the CERTIFIED badges off EVERY entry (owner 4444) so nothing is falsely
// "done" and the whole population gets re-scanned to a true 12/13. Removes cc_signed / claude_certified
// / quality / cc_signed_at from each blob (backed up in _pre_strip so it's reversible). Resumable via
// badge_stripped flag. Paced/low-load. Stop: _strip_badges_stop.flag.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const CONC = parseInt(process.env.STRIP_CONC || '6', 10), PACE = parseInt(process.env.STRIP_PACE || '120', 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ids = (idx.entries || []).filter(e => e && e.id && /^[a-z]{2,3}\d/.test(e.id)).map(e => e.id);
  console.log('[strip] ' + ids.length + ' entries · removing certified badges');
  let qi = 0, stripped = 0, done = 0;
  async function worker() {
    while (qi < ids.length) {
      if (fs.existsSync(WD + '/_strip_badges_stop.flag')) return;
      const id = ids[qi++];
      try {
        const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
        if (e && !e.badge_stripped) {
          const bak = { cc_signed: e.cc_signed, claude_certified: e.claude_certified, quality: e.quality, cc_signed_at: e.cc_signed_at };
          const ne = Object.assign({}, e); delete ne.cc_signed; delete ne.claude_certified; delete ne.quality; delete ne.cc_signed_at;
          ne._pre_strip = bak; ne.badge_stripped = true; ne.updated_at = new Date().toISOString();
          await store.setJSON('answers/' + id + '.json', ne); stripped++;
        }
      } catch (x) {}
      if (++done % 200 === 0) console.log('[strip] ' + done + '/' + ids.length + ' · stripped=' + stripped);
      await sleep(PACE);
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));
  console.log('[strip] DONE · stripped=' + stripped + ' of ' + ids.length);
})().catch(e => { console.log('[strip] FATAL', e && e.message); process.exit(1); });
