// pulse-featured — CNET-style homepage feature feed (owner 2026-07-02).
// Returns a big HERO + a row of CARDS drawn from the newest entries, each with its
// top image + title (the homepage overlays the title on the image). ROTATES HOURLY:
// a different slice of the newest pool is featured each hour, cached within the hour.
let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const NAMES = { tl:'CRO & Tools', ca:'Cars', bt:'Boats', aq:'Aquariums', ik:'Industry KPIs', tk:'Tech Stacks', bs:'Book Summaries', st:'Sales Trainings', fr:'Franchises', co:'Collectibles', ai:'AI Infrastructure', gb:'Graphics', bo:'Buildouts', sy:'Style', cr:'Crabbing', fs:'Fishing', gp:'GTM Playbooks', ra:'Revenue Architecture', pt:'Pets', es:'Espresso', tv:'TVs', rs:'Resorts', cl:'Cologne', lv:'Luxury Travel', ev:'Events', ga:'Gatherings', gm:'Gaming', mv:'Movies', wl:'Wellness', dr:'Drills', dn:'Dining', nl:'Nightlife', tn:'Towns', sc:'Schools', tc:'Telco', er:'Electronics', ce:'Pulse News', q:'Knowledge', sk:'Skills', sw:'Software', hf:'Home & Family' };
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) {} }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}
function firstImage(body) {
  const md = String(body || '').match(/!\[[^\]]*\]\(([^)\s]+)/);
  if (md) return md[1];
  const ht = String(body || '').match(/<img[^>]+src=["']([^"']+)/i);
  return ht ? ht[1] : null;
}
function proxy(u) {
  if (!u) return null;
  if (u[0] === '/') u = 'https://pulserevops.com' + u;   // relative site assets (e.g. tl covers) → absolute
  if (!/^https?:\/\//.test(u)) return null;
  if (/wsrv\.nl/.test(u)) return u;
  return 'https://wsrv.nl/?url=' + encodeURIComponent(u.replace(/^https?:\/\//, '')) + '&w=1100&output=webp&q=80&we';
}
function deckOf(body) {
  const t = String(body || '')
    .replace(/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*/, '')     // drop leading image
    .replace(/#{1,6}\s+.*(?:\n|$)/g, ' ')                  // drop headings
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '').replace(/\s+/g, ' ').trim();
  return t.slice(0, 155);
}

let cache = { hour: null, data: null };

exports.handler = async () => {
  const HOUR = Math.floor(Date.now() / 3600000);
  if (cache.hour === HOUR && cache.data) return json(cache.data);
  const store = initStore();
  if (!store) return { statusCode: 503, body: '{"error":"no store"}' };
  let idx;
  try { idx = await store.get('_index.json', { type: 'json' }); } catch (e) { return { statusCode: 500, body: '{"error":"idx"}' }; }
  const isDemo = t => /\bdemo\b|standing desk|\btest entry\b/i.test(String(t || ''));
  const all = (idx.entries || [])
    .filter(e => e && e.id && !isDemo(e.question) && /^[a-z]{2,3}\d/.test(e.id))
    .sort((a, b) => (b.polished_at || b.ts || 0) - (a.polished_at || a.ts || 0));
  if (!all.length) return { statusCode: 500, body: '{"error":"empty"}' };
  // ROUND-ROBIN across EVERY pillar for maximum image variety (cars, boats, aquariums, movies,
  // resorts…), rotated hourly. HERO stays a CRO (tl) Q&A; tl capped so the grid isn't all boardrooms.
  const N = 250;   // long "wall of boxes" scroller (owner 4444) — cached hourly
  const byP = {};
  for (const e of all) { const p = pillarOf(e.id); (byP[p] = byP[p] || []).push(e); }
  const tl = byP['tl'] || [];
  const heroE = tl.length ? tl[HOUR % tl.length] : all[0];
  const pillars = Object.keys(byP).sort();
  const used = new Set([heroE.id]);
  const pick = [heroE];
  let tlN = 1, r = 0;
  while (pick.length < N && r < 900) {
    let added = false;
    for (const p of pillars) {
      if (pick.length >= N) break;
      if (p === 'tl' && tlN >= 3) continue;              // keep CRO limited → varied grid
      const list = byP[p]; if (!list.length) continue;
      const it = list[(HOUR + r) % list.length];
      if (it && !used.has(it.id)) { used.add(it.id); pick.push(it); if (p === 'tl') tlN++; added = true; }
    }
    if (!added) break; r++;
  }
  const coverFor = id => 'https://pulserevops.com/assets/cro-cover-' + ((Math.abs(parseInt(String(id).replace(/\D/g, ''), 10) || 0) % 5) + 1) + '.jpg';
  const items = await Promise.all(pick.map(async e => {
    let img = null, deck = '', verified = false;
    try { const b = await store.get('answers/' + e.id + '.json', { type: 'json' }); img = firstImage(b && b.answer); deck = deckOf(b && b.answer); verified = !!(b && b.face_verified); } catch (x) {}
    // an UNVERIFIED Pollinations URL may still be generating (shows black) → use a reliable cover instead
    if (img && /pollinations/i.test(img) && !verified) img = coverFor(e.id);
    const p = pillarOf(e.id);
    return { id: e.id, title: e.question || e.id, pillar: NAMES[p] || p.toUpperCase(), img: proxy(img), deck };
  }));
  const withImg = items.filter(i => i.img);
  const use = withImg.length >= 6 ? withImg : items;   // prefer image-bearing, but never blank the feature
  // HERO must load instantly (it's always CRO + most prominent): if its image is a still-generating
  // Pollinations URL, swap to a reliable curated CRO cover so the hero is never black.
  if (use[0] && /pollinations/i.test(use[0].img || '')) { const n = (Math.abs(parseInt((use[0].id || '').replace(/\D/g, ''), 10) || HOUR) % 5) + 1; use[0].img = 'https://pulserevops.com/assets/cro-cover-' + n + '.jpg'; }
  const data = { hour: HOUR, hero: use[0], cards: use.slice(1, 5), pool: use };   // pool feeds the random card flips
  cache = { hour: HOUR, data };
  return json(data);
};

function json(data) {
  return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=1800, s-maxage=3600' }, body: JSON.stringify(data) };
}
