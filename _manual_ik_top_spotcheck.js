'use strict';
// Spot-check N IK entries: top internal = face dupe, no pollinations on top internal.
// Usage: node _manual_ik_top_spotcheck.js [N=100]
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';
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
const N = Math.max(1, parseInt(process.argv[2] || '100', 10) || 100);
const QA = path.join(WD, 'assets', 'qa');

function doneIds() {
  const s = new Set();
  const LOG = path.join(WD, '_ik_manual_top_log.jsonl');
  if (!fs.existsSync(LOG)) return s;
  for (const line of fs.readFileSync(LOG, 'utf8').split(/\n/)) {
    if (!line.trim()) continue;
    try {
      const j = JSON.parse(line);
      if (j.id && (j.status === 'swapped' || j.status === 'already')) s.add(j.id);
    } catch (e) {}
  }
  return s;
}

function firstNonFace(body, id) {
  const faceUrl = '/assets/qa/' + id + '.jpg';
  const matches = [...String(body || '').matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
  for (const m of matches) {
    const url = m[2].replace(/\?.*$/, '');
    if (url === faceUrl || url.endsWith('/' + id + '.jpg')) continue;
    return { url: m[2], alt: m[1] };
  }
  return null;
}

function faceOk(id) {
  try {
    const s = fs.statSync(path.join(QA, id + '.jpg'));
    return s.size > 8000;
  } catch (e) {
    return false;
  }
}

(async () => {
  const mos = JSON.parse(fs.readFileSync(path.join(WD, 'mosaic-pool-ik.json'), 'utf8'));
  const done = doneIds();
  const pool = mos.map((e) => e.id).filter((id) => done.has(id));
  const step = Math.max(1, Math.floor(pool.length / N));
  const sample = [];
  for (let i = 0; i < N && i * step < pool.length; i++) sample.push(pool[i * step]);
  while (sample.length < N && sample.length < pool.length) {
    const id = pool[sample.length];
    if (!sample.includes(id)) sample.push(id);
  }

  const bad = [];
  let pass = 0;
  for (const id of sample) {
    const blob = await store.get('answers/' + id + '.json', { type: 'json' });
    const body = (blob && (blob.answer || blob.body)) || '';
    const top = firstNonFace(body, id);
    const faceUrl = '/assets/qa/' + id + '.jpg';
    let ok = true;
    const reasons = [];
    if (!top) { ok = false; reasons.push('no_top_internal'); }
    else {
      const u = top.url.replace(/\?.*$/, '');
      if (/pollinations\.ai/i.test(top.url)) { ok = false; reasons.push('pollinations'); }
      if (u !== faceUrl && !u.endsWith('/' + id + '.jpg')) { ok = false; reasons.push('not_face_dupe:' + u.slice(0, 60)); }
    }
    if (!faceOk(id)) { ok = false; reasons.push('face_missing_small'); }
    if (ok) pass++;
    else bad.push({ id, reasons, topUrl: top && top.url.slice(0, 80) });
  }
  const pct = sample.length ? Math.round((pass / sample.length) * 100) : 0;
  const failPct = 100 - pct;
  const out = {
    at: new Date().toISOString(),
    checked: sample.length,
    pass,
    fail: bad.length,
    passPct: pct,
    failPct,
    gate: failPct <= 10 ? 'PASS' : 'FAIL_FIX',
    badSample: bad.slice(0, 25),
  };
  fs.writeFileSync(path.join(WD, '_ik_manual_top_spot100.json'), JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
