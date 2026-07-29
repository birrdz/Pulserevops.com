// 👁 TOP-10 WATCHER — read-only. Tails the crew log for finished pages, pulls each blob,
// and audits ONLY the ranked ones against the live v1 gold + the 13-point gate.
// Writes findings to _top10_watch.out.log. Never writes a blob, never publishes.
'use strict';
require('./_loadenv');
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { gateScore } = require('./new/content_gate');
const { appliesTop10Gold, auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');

const WD = 'C:/Users/koryj/website';
const SRC = WD + '/_page_finisher.out.log';
const OUT = WD + '/_top10_watch.out.log';
const POLL_MS = 20000;

function theStore() {
  return getStore({
    name: 'pulse-machine-library',
    siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN,
  });
}
function say(m) {
  const line = new Date().toISOString() + ' ' + m;
  try { fs.appendFileSync(OUT, line + '\n'); } catch (e) {}
  console.log(line);
}

let offset = 0;
try { offset = fs.statSync(SRC).size; } catch (e) {}   // start at the tail — only NEW work
const seen = new Set();

async function auditOne(id) {
  const s = theStore();
  let blob;
  try { blob = await s.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' }); }
  catch (e) { say('· ' + id + ' — blob read failed: ' + e.message); return; }
  if (!blob) { say('· ' + id + ' — no blob'); return; }

  const body = String(blob.body || blob.answer || '');
  const title = String(blob.title || '');
  if (!appliesTop10Gold(body, title)) return;          // not ranked → not our business

  const g = gateScore({ body });
  const a = auditTop10GoldTemplate(body, title);
  const imgs = (body.match(/^@@PRODUCT\b/gm) || []).length;
  const mds = (body.match(/^!\[[^\]]*\]\([^)]*\)\s*$/gm) || []).length;
  const ranks = (body.match(/^##\s+\d+\.\s/gm) || []).length;

  const flag = (!g.pass || !a.compliant) ? '⚠️ ' : '✅ ';
  say(flag + id + ' TOP-10 · gate ' + g.score + '/13 · ' + ranks + ' ranks · ' +
      imgs + ' @@PRODUCT + ' + mds + ' md-img · ' + g.wordCount + 'w · ' + g.mermaids + ' mermaid');
  if (!g.pass) g.fails.forEach(f => say('     ✗ gate ' + f.n + ' ' + f.name + ' — ' + f.detail));
  if (!a.compliant) a.issues.slice(0, 8).forEach(i => say('     ✗ gold ' + i));
  // the failure the owner cares most about: one image per ranked item
  if (ranks >= 3 && imgs + mds !== ranks) {
    say('     ⚠️ IMAGE/RANK MISMATCH — ' + ranks + ' ranks but ' + (imgs + mds) + ' images');
  }
}

async function tick() {
  let st;
  try { st = fs.statSync(SRC); } catch (e) { return; }
  if (st.size < offset) offset = 0;                    // log rotated
  if (st.size === offset) return;
  const fd = fs.openSync(SRC, 'r');
  const len = st.size - offset;
  const buf = Buffer.alloc(len);
  fs.readSync(fd, buf, 0, len, offset);
  fs.closeSync(fd);
  offset = st.size;

  const ids = [];
  for (const line of buf.toString('utf8').split('\n')) {
    if (line.indexOf('✅ DONE') < 0) continue;
    const m = line.match(/\]\s+(\S+)\s+✅ DONE/);
    if (m && !seen.has(m[1])) { seen.add(m[1]); ids.push(m[1]); }
  }
  for (const id of ids) { try { await auditOne(id); } catch (e) { say('· ' + id + ' audit error: ' + e.message); } }
}

say('👁 TOP-10 WATCHER up — auditing ranked pages as crews finish them. Read-only.');
tick();
setInterval(() => { tick().catch(() => {}); }, POLL_MS);
