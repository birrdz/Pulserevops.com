// _tl_face_backfill — background lane (owner 2026-07-02): give every CRO/Tools (tl) entry a
// UNIQUE, topic-relevant "face card" image (Pollinations flux prompted from the question). Each image
// is PRE-GENERATED + verified to actually load before saving; if flux fails, falls back to a reliable
// curated CRO cover — so NO black cards. Resumable via face_verified flag, gentle, low load.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const GENERIC = /\/assets\/cro-cover-\d|placeholder|og-preview|pulse-og|no-?image/i;
const CONC = parseInt(process.env.FACE_CONC || '5', 10), PACE = parseInt(process.env.FACE_PACE || '400', 10);
const firstImage = b => { const m = String(b || '').slice(0, 1200).match(/!\[[^\]]*\]\(([^)\s]+)/); return m ? m[1] : null; };
const coverFor = id => 'https://pulserevops.com/assets/cro-cover-' + ((Math.abs(parseInt(String(id).replace(/\D/g, ''), 10) || 0) % 5) + 1) + '.jpg';
function pollCover(title) {
  const prompt = ('high quality editorial photograph illustrating ' + String(title).slice(0, 100) + ', revenue operations, executive business leadership, modern office, realistic magazine style, warm light, no text, no watermark, no words').slice(0, 320);
  let h = 0; for (const c of String(title)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=1200&height=675&nologo=true&model=flux&seed=' + (h % 100000);
}
async function loads(u) { try { const r = await fetch(u, { signal: AbortSignal.timeout(45000) }); return r.ok && (r.headers.get('content-type') || '').startsWith('image'); } catch (e) { return false; } }
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ids = (idx.entries || []).filter(e => e && e.id && /^tl\d/.test(e.id)).map(e => e.id);
  console.log('[tl-face] ' + ids.length + ' CRO/Tools entries · verify+fallback');
  let qi = 0, faced = 0, fell = 0, kept = 0, done = 0;
  async function worker() {
    while (qi < ids.length) {
      if (fs.existsSync(WD + '/_tl_face_stop.flag')) return;
      const id = ids[qi++];
      try {
        const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
        if (e && e.answer && !e.face_verified) {
          const cur = firstImage(e.answer);
          if (cur && !GENERIC.test(cur) && !/pollinations/i.test(cur)) {
            await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { face_verified: true })); kept++;   // already has a real unique image
          } else {
            const cand = pollCover(e.question || id);           // pre-generate + verify; fall back to a reliable cover
            const use = (await loads(cand)) ? cand : coverFor(id);
            if (use === coverFor(id)) fell++; else faced++;
            const alt = String(e.question || id).replace(/[\[\]"]/g, '').slice(0, 80);
            const body = '![' + alt + '](' + use + ')\n\n' + String(e.answer).replace(/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/, '');
            await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: body, face_set: true, face_verified: true, face_at: new Date().toISOString() }));
          }
        }
      } catch (x) {}
      if (++done % 50 === 0) console.log('[tl-face] ' + done + '/' + ids.length + ' · faced=' + faced + ' fallback=' + fell + ' kept=' + kept);
      await sleep(PACE);
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));
  console.log('[tl-face] DONE · faced=' + faced + ' fallback=' + fell + ' kept=' + kept + ' of ' + ids.length);
})().catch(e => { console.log('[tl-face] FATAL', e && e.message); process.exit(1); });
