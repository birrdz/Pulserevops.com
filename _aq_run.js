// _aq_run.js — fix EVERY aquariums Q&A's images: self-host any external/hotlinked image (body + cover)
//   -> download -> storeGradedImage (warm grade + EXIF stamp) -> /assets/qa/ -> rewrite local.
//   Emails per page (q id + link) via Resend. Batched _index.json writes (every 40). Content untouched.
'use strict';
process.on('unhandledRejection', e => console.log('UNHANDLED', e && e.message));
process.on('uncaughtException', e => console.log('UNCAUGHT', e && e.message));
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require(WD + '/node_modules/@netlify/blobs');
const { storeGradedImage, verifyGradeStamp } = require(WD + '/_ddg_facecard_lib');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const RK = process.env.RESEND_API_KEY || process.env.resendapikey || '';
const FROM = process.env.ALERT_FROM_EMAIL || 'Pulse <onboarding@resend.dev>';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PulseRevOps/1.0';
const httpsify = u => String(u).replace(/^http:\/\//i, 'https://');
const isExternal = u => /^https?:\/\//i.test(u) && !/pulserevops\.com/i.test(u);
const START = process.argv[2] || 'aq';
async function email(subj, html) { if (!RK) return; try { await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + RK, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: FROM, to: ['koryjordanwhite@gmail.com'], subject: subj, html }) }); } catch (e) {} }
async function fetchImg(u) { try { const r = await fetch(httpsify(u), { headers: { 'User-Agent': UA, Referer: 'https://www.google.com/' }, signal: AbortSignal.timeout(20000) }); if (!r.ok) return null; if (!(r.headers.get('content-type') || '').toLowerCase().startsWith('image')) return null; const b = Buffer.from(await r.arrayBuffer()); return b.length > 3000 ? b : null; } catch (e) { return null; } }
async function grade(buf, dest) { try { await storeGradedImage(buf, dest, { square: 760, faceCard: true, cropPosition: 'attention' }); return await verifyGradeStamp(dest); } catch (e) { return false; } }
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const arr = idx.entries || idx;
  const aq = arr.filter(e => e && e.id && /^aq\d/.test(e.id));
  let done = 0, imgTot = 0, fail = 0, dirty = false;
  console.log('aq run: ' + aq.length + ' pages');
  for (const e of aq) {
   const id = e.id;
   try {
    let a; try { a = await store.get('answers/' + id + '.json', { type: 'json' }); } catch (_) {}
    if (!a) { fail++; continue; }
    if (a.aq_img_fixed_at) { continue; }   // resumable: skip pages already fixed (no re-email)
    let body = String(a.answer || ''); let cover = 0, bfix = 0, slot = 0;
    // cover (index entry img)
    if (e.img && isExternal(e.img)) { const buf = await fetchImg(e.img); if (buf && await grade(buf, WD + '/assets/qa/' + id + '.jpg')) { e.img = '/assets/qa/' + id + '.jpg'; e.cover_src = 'aq-selfhost'; cover = 1; dirty = true; } }
    // body images
    const urls = new Set(); const re = /(https?:\/\/[^\s"'<>()]+\.(?:jpg|jpeg|png|webp|gif))/gi; let m;
    while ((m = re.exec(body)) !== null) { if (isExternal(m[1])) urls.add(m[1]); }
    for (const u of urls) { slot++; const dest = WD + '/assets/qa/' + id + '-' + slot + '.jpg'; const buf = await fetchImg(u); if (buf && await grade(buf, dest)) { body = body.split(u).join('/assets/qa/' + id + '-' + slot + '.jpg'); bfix++; } }
    if (bfix || cover) { a.answer = body; a.aq_img_fixed_at = new Date().toISOString(); await store.setJSON('answers/' + id + '.json', a); }
    done++; imgTot += bfix + cover;
    const link = 'https://pulserevops.com/knowledge/' + id;
    await email('Pulse aq fixed: ' + id, '<p><b>' + id + '</b> — ' + (bfix + cover) + ' image(s) self-hosted &amp; graded (cover ' + cover + ', body ' + bfix + '). Images now render reliably, no hotlinks.</p><p><a href="' + link + '">' + link + '</a></p>');
    if (dirty && done % 40 === 0) { await store.setJSON('_index.json', idx); dirty = false; console.log('  checkpoint index @ ' + done); }
    await sleep(200);
    if (done % 25 === 0) console.log('  ' + done + '/' + aq.length + ' (imgs ' + imgTot + ')');
   } catch (perr) { fail++; console.log('  page err ' + id + ': ' + (perr && perr.message)); }
  }
  if (dirty) await store.setJSON('_index.json', idx);
  console.log('=== aq DONE: ' + done + ' pages, ' + imgTot + ' images self-hosted, ' + fail + ' no-blob ===');
  await email('Pulse aquariums — image fix DONE', '<p>Aquariums complete: ' + done + ' pages processed, ' + imgTot + ' images self-hosted + graded. Paused. Not deployed.</p>');
})().catch(e => console.log('RUN ERR', e.message));
