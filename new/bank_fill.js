// new/bank_fill.js — bulk-fill the CRO image bank to 2,000 (owner pre-approved the rest).
// Same HD filter, same CRO queries, same dedup as the swipe tool. Downloads into the shared library.
'use strict';
const https = require('https');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const PEXELS = process.env.PEXELS_API_KEY;
const RESEND = process.env.resendapikey || process.env.RESEND_API_KEY;
const DIR = WD + '/new/imagebank', CRO_DIR = DIR + '/cro';
fs.mkdirSync(CRO_DIR, { recursive: true });
const APPROVED = DIR + '/_approved.json', SEEN = DIR + '/_seen.json', FLAG = DIR + '/_notified_2000.flag';
const TARGET = 2000;
const QUERIES = ['business executive', 'revenue growth chart', 'sales team meeting', 'corporate boardroom', 'business leadership', 'business handshake', 'team meeting office', 'financial dashboard', 'business strategy', 'businesswoman executive', 'startup office', 'business presentation', 'data analytics screen', 'corporate finance', 'business growth graph', 'conference room', 'sales pipeline', 'business planning', 'modern office', 'business technology laptop', 'professional business people', 'executive leadership', 'office collaboration', 'business negotiation', 'corporate meeting', 'business analytics', 'business success', 'CEO office', 'business consulting', 'marketing strategy', 'sales growth', 'business chart'];
const load = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const save = (f, o) => fs.writeFileSync(f, JSON.stringify(o));
const dl = url => new Promise(res => { https.get(url, r => { if (r.statusCode !== 200) { r.resume(); return res(null); } const c = []; r.on('data', d => c.push(d)); r.on('end', () => res(Buffer.concat(c))); }).on('error', () => res(null)); });
const pex = (q, page) => new Promise(res => { https.get('https://api.pexels.com/v1/search?per_page=40&orientation=landscape&size=large&query=' + encodeURIComponent(q) + '&page=' + page, { headers: { Authorization: PEXELS } }, r => { let s = ''; r.on('data', d => s += d); r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { res(null); } }); }).on('error', () => res(null)); });

(async () => {
  const seen = new Set(load(SEEN, []));
  const approved = load(APPROVED, []);
  console.log('starting at', approved.length, '· target', TARGET);
  let qi = 0; const pageOf = {}; let guard = 0;
  while (approved.length < TARGET && guard < 4000) {
    guard++;
    const q = QUERIES[qi % QUERIES.length]; qi++;
    pageOf[q] = (pageOf[q] || 0) + 1;
    const r = await pex(q, pageOf[q]);
    const photos = (r && r.photos) || [];
    if (!photos.length) continue;
    for (const p of photos) {
      if (approved.length >= TARGET) break;
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      if ((p.width || 0) < 1600) continue;
      const buf = await dl(p.src.large2x || p.src.original || p.src.large);
      if (!buf || buf.length < 3000) continue;
      fs.writeFileSync(CRO_DIR + '/' + p.id + '.jpg', buf);
      approved.push({ id: p.id, file: p.id + '.jpg', query: q, w: p.width, h: p.height });
    }
    save(SEEN, Array.from(seen)); save(APPROVED, approved);
    if (approved.length % 100 < 40) console.log('  ' + approved.length + ' / ' + TARGET);
  }
  save(SEEN, Array.from(seen)); save(APPROVED, approved);
  console.log('DONE ·', approved.length, 'in the CRO library');
  if (RESEND && approved.length >= TARGET && !fs.existsSync(FLAG)) {
    try { const rr = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + RESEND, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: ['koryjordanwhite@gmail.com'], subject: '🎉 CRO Image Bank hit 2,000!', html: '<div style="font-family:system-ui;font-size:16px"><h2>🎉 2,000 CRO images banked!</h2><p>Your reusable CRO library is full. Tell Claude "wire the library in" and future CRO fixes pull covers (unique) + inside images from it.</p></div>' }) }); if (rr.ok) fs.writeFileSync(FLAG, new Date().toISOString()); } catch (e) {}
  }
})().catch(e => { console.log('ERR', e.message); process.exit(1); });
