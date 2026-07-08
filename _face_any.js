// _face_any — "pollinator" image fixer (owner 4444). Gives entries a UNIQUE, topic-relevant face
// image (Pollinations flux from the question) where the current image is generic/missing/broken —
// pre-generated + verified; falls back to a reliable cover for tl, or leaves non-tl for a later pass
// if flux fails (never overwrites a good real image). Sharded: SHARD/SHARDS split the catalog across
// 4 instances. face_verified flag = resumable. Stop: _face_any_stop.flag.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
// DDG real-photo search = the fast, reliable workhorse (keyless). Try it BEFORE Pollinations flux so
// entries get a REAL topical photo instead of getting skipped when flux is rate-limited. (owner 2026-07-02)
let searchRealPhoto = null; try { ({ searchRealPhoto } = require('./netlify/functions/lib/img-search-lib')); } catch (e) {}
const GENERIC = /\/assets\/cro-cover-\d|placeholder|og-preview|pulse-og|no-?image/i;
const SHARD = parseInt(process.env.SHARD || process.argv[2] || '0', 10), SHARDS = parseInt(process.env.SHARDS || process.argv[3] || '1', 10);
const CONC = parseInt(process.env.FACE_CONC || '2', 10), PACE = parseInt(process.env.FACE_PACE || '600', 10);
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];
const firstImage = b => { const m = String(b || '').slice(0, 1200).match(/!\[[^\]]*\]\(([^)\s]+)/); return m ? m[1] : null; };
// every image URL in the body, BEST-QUALITY-APPLICABLE FIRST: curated Top-10 @@PRODUCT photos rank
// ahead of inline media images (they're hand-picked, on-topic product shots). (owner 2026-07-02)
function allImages(b) { const s = String(b || ''); const prod = [], med = []; let m; const pr = /@@PRODUCT[^\n]* img="([^"]+)"/g; while ((m = pr.exec(s))) prod.push(m[1]); const md = /!\[[^\]]*\]\(([^)\s]+)/g; while ((m = md.exec(s))) med.push(m[1]); return [...prod, ...med]; }
// AUDIT: the entry's own REAL photos we could promote to the face card (products first, then media)
const internalCandidates = (b, exclude) => allImages(b).filter(u => u && u !== exclude && !GENERIC.test(u) && !/pollinations/i.test(u));
const coverFor = id => 'https://pulserevops.com/assets/cro-cover-' + ((Math.abs(parseInt(String(id).replace(/\D/g, ''), 10) || 0) % 5) + 1) + '.jpg';
const TOPIC = { tl: 'revenue operations, executive leadership, modern office', ca: 'automobile car', bt: 'boat yacht marine', aq: 'planted aquarium fish tank', er: 'consumer electronics', dn: 'restaurant food dining', nl: 'nightlife bar lounge', tn: 'town city skyline', sc: 'school campus', mv: 'cinema film', es: 'espresso coffee', tv: 'television home theater', rs: 'luxury resort', cl: 'cologne fragrance bottle', lv: 'luxury travel', ev: 'event celebration', ga: 'board game', gm: 'video gaming setup', wl: 'wellness spa', dr: 'sports drill', fr: 'franchise storefront', co: 'collectible memorabilia', sy: 'fashion outfit', cr: 'chesapeake crabbing', fs: 'fishing boat', pt: 'pet animal', tk: 'software dashboard', ik: 'business analytics chart', gb: 'infographic', bo: 'commercial real estate', ai: 'AI automation', gp: 'go to market office', ra: 'revenue operations', bs: 'business book', st: 'sales training', ce: 'news media', q: 'professional editorial' };
function pollCover(title, p) {
  const lane = TOPIC[p] || 'professional editorial business';
  const prompt = ('high quality editorial ' + lane + ' photograph illustrating ' + String(title).slice(0, 95) + ', realistic magazine style, warm light, no text, no watermark, no words').slice(0, 320);
  let h = 0; for (const c of String(title)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=1200&height=675&nologo=true&model=flux&seed=' + (h % 100000);
}
async function loads(u) { try { const r = await fetch(u, { signal: AbortSignal.timeout(45000) }); return r.ok && (r.headers.get('content-type') || '').startsWith('image'); } catch (e) { return false; } }
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let ids = (idx.entries || []).filter(e => e && e.id && /^[a-z]{2,3}\d/.test(e.id)).map(e => e.id);
  ids = ids.filter((_, n) => n % SHARDS === SHARD);   // this instance's shard
  console.log('[face-any] shard ' + SHARD + '/' + SHARDS + ' · ' + ids.length + ' entries');
  let qi = 0, faced = 0, cover = 0, kept = 0, skip = 0, promoted = 0, done = 0;
  async function worker() {
    while (qi < ids.length) {
      if (fs.existsSync(WD + '/_face_any_stop.flag')) return;
      const id = ids[qi++]; const p = pillarOf(id);
      try {
        const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
        const curHero = e && e.answer ? firstImage(e.answer) : null;
        const flaky = curHero && /pollinations/i.test(curHero);   // a "generating" flux URL renders black on the card
        if (e && e.answer && (!e.face_verified || flaky)) {   // audit the hero; re-do it if it's a flaky flux image
          const cur = curHero;
          if (cur && !GENERIC.test(cur) && !/pollinations/i.test(cur)) {
            await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { face_verified: true })); kept++;   // good real image — keep
          } else {
            const alt = String(e.question || id).replace(/[\[\]"]/g, '').slice(0, 80);
            const setHero = (url, extra) => { const body = '![' + alt + '](' + url + ')\n\n' + String(e.answer).replace(/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/, ''); return store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: body, face_set: true, face_verified: true, face_at: new Date().toISOString() }, extra)); };
            // 1) BEST-QUALITY APPLICABLE INTERNAL IMAGE — audit the entry's own photos (curated products
            //    first), verify it actually renders, promote the best one. Fastest, always on-topic.
            let picked = null;
            for (const u of internalCandidates(e.answer, cur)) { if (await loads(u)) { picked = { url: u, real: true, from: 'internal' }; break; } }
            // 2) else ALTERNATE DDG ↔ Pollinations (variety + spread load); each verified to render.
            if (!picked) {
              const ddg = async () => { if (!searchRealPhoto) return null; try { const pk = await searchRealPhoto(e.question || id, id, { skipRefine: true }); if (pk && pk.img && await loads(pk.img)) return { url: pk.img, real: true, from: 'ddg' }; } catch (x) {} return null; };
              const flux = async () => { const c = pollCover(e.question || id, p); return (await loads(c)) ? { url: c, real: false, from: 'flux' } : null; };
              picked = (done % 2 === 0) ? (await ddg()) || (await flux()) : (await flux()) || (await ddg());
            }
            if (picked) { await setHero(picked.url, { face_real: picked.real, face_from: picked.from }); if (picked.from === 'internal') promoted++; else faced++; }
            else if (p === 'tl') { await setHero(coverFor(id), { face_from: 'cover' }); cover++; }
            else { skip++; }   // non-tl generation failed → leave for a later pass (never a CRO cover on it)
          }
        }
      } catch (x) {}
      if (++done % 50 === 0) console.log('[face-any] s' + SHARD + ' ' + done + '/' + ids.length + ' · promoted=' + promoted + ' faced=' + faced + ' cover=' + cover + ' kept=' + kept + ' skip=' + skip);
      await sleep(PACE);
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));
  console.log('[face-any] s' + SHARD + ' DONE · promoted=' + promoted + ' faced=' + faced + ' cover=' + cover + ' kept=' + kept + ' skip=' + skip);
})().catch(e => { console.log('[face-any] FATAL', e && e.message); process.exit(1); });
