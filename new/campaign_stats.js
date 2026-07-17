// new/campaign_stats.js — tracks the "bad URLs → good URLs" fix campaign for the dashboard.
// Freezes a baseline of bad URLs at campaign start, then counts fixers (💚 in-place upgrades)
// and brand-new builds (🩷). Writes new/campaign_stats.json every 10 min (dashboard reads it).
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN });
const STATS = WD + '/new/campaign_stats.json';
const BASE = WD + '/new/_campaign_baseline.json';
const BAD = e => e && ((e.quality_score || 0) < 11) && !e.bb;   // low-quality, not yet upgraded

async function scan() {
  try {
    const idx = await store.get('_index.json', { type: 'json' });
    const entries = idx.entries || [];
    const total = entries.length;
    const badNow = entries.filter(BAD).length;
    const green = entries.filter(e => e && e.trim === 'green').length;      // fixed in place
    const pink = entries.filter(e => e && e.bb && e.trim !== 'green').length; // brand-new builds
    let base;
    try { base = JSON.parse(fs.readFileSync(BASE, 'utf8')); }
    catch (e) { base = { badAtStart: badNow + green, startedAt: new Date().toISOString() }; fs.writeFileSync(BASE, JSON.stringify(base, null, 1)); }
    const stats = {
      badAtStart: base.badAtStart,
      startedAt: base.startedAt,
      fixedInPlace: green,
      newBuilt: pink,
      remaining: Math.max(0, base.badAtStart - green),
      total,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(STATS, JSON.stringify(stats, null, 1));
    console.log('[campaign] bad@start ' + stats.badAtStart + ' · fixed ' + green + ' · new ' + pink + ' · remaining ' + stats.remaining);
  } catch (e) { console.log('[campaign] scan error', e.message); }
}
scan();
setInterval(scan, 10 * 60 * 1000);
console.log('[campaign] tracker up · writes new/campaign_stats.json every 10 min');
