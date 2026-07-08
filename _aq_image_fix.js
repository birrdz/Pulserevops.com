// _aq_image_fix.js <aqId> — make every image on an aquariums Q&A WORK: any external/hotlinked image
//   (cover img field + in-body URLs) -> download -> storeGradedImage (warm grade + EXIF stamp) ->
//   self-host /assets/qa/<id>[-N].jpg -> rewrite reference to the local copy. Content left as-is.
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require(WD + '/node_modules/@netlify/blobs');
const lib = require(WD + '/_ddg_facecard_lib');
const { storeGradedImage, verifyGradeStamp } = lib;
const id = process.argv[2];
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PulseRevOps/1.0';
const httpsify = u => String(u).replace(/^http:\/\//i, 'https://');
const isExternal = u => /^https?:\/\//i.test(u) && !/pulserevops\.com/i.test(u);
async function fetchImg(u) {
  try {
    const r = await fetch(httpsify(u), { headers: { 'User-Agent': UA, Referer: 'https://www.google.com/' }, signal: AbortSignal.timeout(20000) });
    if (!r.ok) return null; const ct = (r.headers.get('content-type') || '').toLowerCase(); if (!ct.startsWith('image')) return null;
    const b = Buffer.from(await r.arrayBuffer()); return b.length > 3000 ? b : null;
  } catch (e) { return null; }
}
async function grade(buf, dest) { try { await storeGradedImage(buf, dest, { square: 760, faceCard: true, cropPosition: 'attention' }); return await verifyGradeStamp(dest); } catch (e) { return false; } }
(async () => {
  const a = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!a) { console.log(JSON.stringify({ id, ok: false, err: 'no blob' })); return; }
  let body = String(a.answer || '');
  let coverFixed = 0, bodyFixed = 0, failed = 0, slot = 0;
  const cover = a.img || '';
  if (cover && isExternal(cover)) {
    const buf = await fetchImg(cover);
    if (buf && await grade(buf, WD + '/assets/qa/' + id + '.jpg')) { a.img = '/assets/qa/' + id + '.jpg'; coverFixed = 1; } else failed++;
  }
  const urls = new Set();
  const re = /(https?:\/\/[^\s"'<>()]+\.(?:jpg|jpeg|png|webp|gif))/gi; let m;
  while ((m = re.exec(body)) !== null) { if (isExternal(m[1])) urls.add(m[1]); }
  for (const u of urls) {
    slot++;
    const dest = WD + '/assets/qa/' + id + '-' + slot + '.jpg';
    const buf = await fetchImg(u);
    if (buf && await grade(buf, dest)) { body = body.split(u).join('/assets/qa/' + id + '-' + slot + '.jpg'); bodyFixed++; }
    else failed++;
  }
  a.answer = body; a.aq_img_fixed_at = new Date().toISOString();
  await store.setJSON('answers/' + id + '.json', a);
  console.log(JSON.stringify({ id, ok: true, coverFixed, bodyFixed, failed }));
})().catch(e => console.log(JSON.stringify({ id, ok: false, err: e.message })));
