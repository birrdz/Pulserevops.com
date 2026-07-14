'use strict';
/**
 * ST browse-face relevance audit (read-only).
 * Flags: missing imgSq, live 404, weak title↔face keyword fit.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const WD = __dirname;
for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

function head(url) {
  return new Promise((res) => {
    const req = https.request(url, { method: 'HEAD', timeout: 10000 }, (r) => res(r.statusCode || 0));
    req.on('error', () => res(0));
    req.end();
  });
}

// Loose topical buckets for sales-training titles vs typical Pexels-ish wrong themes
const WRONG_IF = [
  { re: /\b(car|auto|vehicle|headlight|truck|bus)\b/i, badFor: /sales|workshop|discovery|cold.?call|negotiation|upsell|ramp|facilitator|account.?plan|role.?play|script/i, label: 'auto/vehicle stock' },
  { re: /\b(grill|meat|bbq|food|restaurant|pastry)\b/i, badFor: /sales|workshop|training|call|script/i, label: 'food stock' },
  { re: /\b(drum|music|concert|guitar)\b/i, badFor: /sales|selling|training/i, label: 'music stock' },
  { re: /\b(moon|space|planet|orbit)\b/i, badFor: /sales|training|workshop/i, label: 'space stock' },
  { re: /\b(harbor|aerial|drone|landscape|mountain)\b/i, badFor: /sales|training|workshop|call/i, label: 'landscape stock' },
];

function scoreTitleTheme(q) {
  const s = String(q || '').toLowerCase();
  const tags = [];
  if (/workshop|training|facilitator|session|clinic|role.?play/.test(s)) tags.push('workshop');
  if (/cold.?call|script|discovery|negotiation|upsell|cross.?sell/.test(s)) tags.push('sales-skills');
  if (/account.?plan|enterprise|pipeline|funnel|meddpicc|gong/.test(s)) tags.push('sales-ops');
  if (/top\s*10|templates?|ready.?to/.test(s)) tags.push('listicle');
  return tags;
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const rows = (idx.entries || []).filter((e) => e && /^st\d/i.test(String(e.id)));
  const QA = path.join(WD, 'assets', 'qa');

  let missSq = 0,
    noLocalFace = 0,
    noLocalSq = 0,
    liveFace404 = 0,
    liveSq404 = 0;
  const black = [];
  const sampleLive = [];

  // Full local/index inventory
  for (const e of rows) {
    const id = String(e.id);
    const face = path.join(QA, id + '.jpg');
    const sq = path.join(QA, id + '.sq.jpg');
    let faceOk = false,
      sqOk = false;
    try {
      faceOk = fs.statSync(face).size > 8000;
    } catch (err) {}
    try {
      sqOk = fs.statSync(sq).size > 3000;
    } catch (err) {}
    if (!faceOk) noLocalFace++;
    if (!sqOk) noLocalSq++;
    if (!e.imgSq) {
      missSq++;
      black.push({ id, q: String(e.question || e.title || '').slice(0, 70), why: 'no_imgsq_index' });
    } else if (!sqOk) {
      black.push({ id, q: String(e.question || e.title || '').slice(0, 70), why: 'no_local_sq' });
    }
  }

  // Live HEAD sample across pillar (every ~15th) + any black candidates
  const step = Math.max(1, Math.floor(rows.length / 50));
  const probe = [];
  for (let i = 0; i < rows.length; i += step) probe.push(rows[i]);
  // titles from owner screenshot
  const shotRe =
    /Account Planning Strategy|sales training workshops|Upsell and Cross-Sell|Sales Negotiation|ramping rep|Ready-to-Run Sessions|Cold Calling Script/i;
  for (const e of rows) {
    if (shotRe.test(String(e.question || e.title || ''))) probe.push(e);
  }
  const seen = new Set();
  for (const e of probe) {
    const id = String(e.id);
    if (seen.has(id)) continue;
    seen.add(id);
    const q = String(e.question || e.title || '');
    const faceSt = await head('https://pulserevops.com/assets/qa/' + id + '.jpg');
    const sqSt = await head('https://pulserevops.com/assets/qa/' + id + '.sq.jpg');
    if (faceSt !== 200) liveFace404++;
    if (sqSt !== 200) liveSq404++;
    sampleLive.push({
      id,
      q: q.slice(0, 72),
      themes: scoreTitleTheme(q),
      img: e.img || null,
      imgSq: e.imgSq || null,
      liveFace: faceSt,
      liveSq: sqSt,
      blackCard: sqSt !== 200 || !e.imgSq,
    });
  }

  // Pull cover_src / query hints from blobs for mismatch suspects (sample)
  const mismatch = [];
  for (const row of sampleLive.slice(0, 40)) {
    const b = await store.get('answers/' + row.id + '.json', { type: 'json' });
    const cover = (b && (b.cover_src || b.image_query || b.face_query || b.pexels_query)) || '';
    const q = row.q;
    let flag = null;
    for (const w of WRONG_IF) {
      if (w.re.test(cover) && w.badFor.test(q)) {
        flag = w.label + ' via ' + String(cover).slice(0, 60);
        break;
      }
    }
    // Heuristic: sales-training title but cover/query is clearly off-domain
    if (!flag && /sales|workshop|discovery|cold.?call|negotiation|upsell|ramp|script|facilitator/i.test(q)) {
      if (/\b(car|vehicle|grill|drum|moon|harbor|sneaker|jordan|yacht|aquarium)\b/i.test(cover)) {
        flag = 'off-domain query: ' + String(cover).slice(0, 70);
      }
    }
    if (flag || row.blackCard) {
      mismatch.push(Object.assign({}, row, { coverHint: String(cover).slice(0, 80), flag: flag || (row.blackCard ? 'BLACK/missing sq' : null) }));
    }
  }

  const out = {
    at: new Date().toISOString(),
    pillar: 'st',
    total: rows.length,
    inventory: { missImgSqIndex: missSq, noLocalFace, noLocalSq, liveFace404InSample: liveFace404, liveSq404InSample: liveSq404 },
    blackCandidates: black.length,
    blackSample: black.slice(0, 20),
    liveProbe: sampleLive.filter((x) => x.blackCard).slice(0, 25),
    mismatchSuspects: mismatch.slice(0, 30),
    note: 'Black cards = missing/404 .sq.jpg on CDN or null imgSq. Mismatch = title vs cover_src/query heuristic — visual confirm still required.',
  };
  fs.writeFileSync(path.join(WD, '_st_face_title_audit.json'), JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
