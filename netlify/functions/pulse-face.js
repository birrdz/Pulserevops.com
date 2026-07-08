// pulse-face — give ONE entry a real "face card" image and SAVE it (owner 2026-07-02).
// Fired by the homepage feature flips: when a card cycles in, this ensures that entry has a
// unique, topic-relevant hero image that persists on its pillar page. Upgrade-only + idempotent
// (marks face_set), so it never overwrites a good unique image and never runs twice per entry.
let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const TOPIC = { tl: 'revenue operations office, executive dashboard, business growth', ca: 'automobile car vehicle', bt: 'boat yacht marine', aq: 'planted aquarium fish tank', er: 'consumer electronics product', dn: 'restaurant food dining', nl: 'nightlife bar lounge', tn: 'town city skyline', sc: 'school campus', mv: 'cinema film', es: 'espresso coffee', tv: 'television home theater', rs: 'luxury resort hotel', cl: 'cologne fragrance bottle', lv: 'luxury vacation travel', ev: 'event celebration', ga: 'board game', gm: 'video gaming setup', wl: 'wellness spa retreat', dr: 'sports training drill', fr: 'franchise storefront', co: 'collectible memorabilia', sy: 'fashion outfit style', cr: 'chesapeake crabbing', fs: 'fishing boat water', pt: 'pet animal', tk: 'software dashboard workspace', ik: 'business analytics chart', gb: 'clean infographic', bo: 'commercial real estate buildout', ai: 'AI automation abstract', gp: 'go to market strategy office', ra: 'revenue operations office', bs: 'business book desk', st: 'sales training workshop', ce: 'news media broadcast', q: 'professional editorial business' };
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];
const GENERIC = /\/assets\/cro-cover-\d|placeholder|og-preview|pulse-og|no-?image/i;

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) {} }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}
function firstImage(body) {
  const md = String(body || '').slice(0, 1200).match(/!\[[^\]]*\]\(([^)\s]+)/);
  return md ? md[1] : null;
}
function pollCover(title, p) {
  const lane = TOPIC[p] || 'professional editorial business';
  const prompt = ('high quality editorial ' + lane + ' photograph illustrating ' + String(title).slice(0, 90) + ', realistic magazine style, warm light, no text, no watermark, no words').slice(0, 300);
  let h = 0; for (const c of String(title)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=1200&height=675&nologo=true&model=flux&seed=' + (h % 100000);
}
const CORS = { 'Access-Control-Allow-Origin': '*' };

exports.handler = async (event) => {
  const id = (event.queryStringParameters || {}).id;
  if (!id || !/^[a-z]{2,3}\d+$/i.test(id)) return { statusCode: 400, headers: CORS, body: '{"ok":false}' };
  const store = initStore();
  if (!store) return { statusCode: 200, headers: CORS, body: '{"ok":false,"reason":"no store"}' };
  let e;
  try { e = await store.get('answers/' + id + '.json', { type: 'json' }); } catch (x) { return { statusCode: 200, headers: CORS, body: '{"ok":false}' }; }
  if (!e || !e.answer) return { statusCode: 200, headers: CORS, body: '{"ok":false}' };
  if (e.face_set) return { statusCode: 200, headers: CORS, body: '{"ok":true,"action":"already"}' };
  const cur = firstImage(e.answer);
  // upgrade-only: act when there is NO hero, or a generic/reused cover. Keep good unique images.
  if (cur && !GENERIC.test(cur)) {
    try { await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { face_set: true })); } catch (x) {}
    return { statusCode: 200, headers: CORS, body: '{"ok":true,"action":"kept"}' };
  }
  const title = e.question || id;
  const alt = String(title).replace(/[\[\]"]/g, '').slice(0, 80);
  const cand = pollCover(title, pillarOf(id));
  let use = cand;   // pre-generate + verify (short, within fn limits); fall back to a reliable cover
  try { const r = await fetch(cand, { signal: AbortSignal.timeout(8000) }); if (!(r.ok && (r.headers.get('content-type') || '').startsWith('image'))) use = 'https://pulserevops.com/assets/cro-cover-' + ((Math.abs(parseInt(id.replace(/\D/g, ''), 10) || 0) % 5) + 1) + '.jpg'; } catch (x) { use = 'https://pulserevops.com/assets/cro-cover-' + ((Math.abs(parseInt(id.replace(/\D/g, ''), 10) || 0) % 5) + 1) + '.jpg'; }
  const body = '![' + alt + '](' + use + ')\n\n' + String(e.answer).replace(/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/, '');
  try { await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: body, face_set: true, face_at: new Date().toISOString() })); } catch (x) { return { statusCode: 200, headers: CORS, body: '{"ok":false}' }; }
  return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, action: 'faced', id }) };
};
