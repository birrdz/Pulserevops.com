// 🔒 4444 LOCKED (owner 2026-06-30). _breach_check.js — FREE deterministic "smoke detector" for
// quality breaches. Re-grades every URL (no API tokens), compares the under-12 set to the saved
// baseline, and if a SPIKE of new under-12 URLs appears (e.g. a bad writer dumped a bunch of 5s),
// it: (1) emails the owner via _ask_owner, (2) drops the new bad ids into the scrub-button queue so
// they surface, (3) updates the baseline. Run it manually anytime, or wire it to a button.
//   node _breach_check.js            # scan + alert + queue if spike
//   node _breach_check.js --quiet    # update baseline silently (no email) — use to set first baseline
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { askOwner } = require('./_ask_owner');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const BASELINE = WD + '/_under12_baseline.json';
const QUEUE = WD + '/_scrub_button_queue.json';
const SPIKE = parseInt(process.env.BREACH_SPIKE || '15', 10);   // alert if this many NEW under-12 appear
const QUIET = process.argv.includes('--quiet');
const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ids = (idx.entries || []).filter(e => e && e.id).map(e => e.id);
  const under = []; let qi = 0, done = 0;
  async function worker() {
    while (qi < ids.length) {
      const id = ids[qi++];
      try { const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null); if (e && e.answer && gradeEntry(id, e.answer, { imagesDeferred: true }).score < 12) under.push(id); } catch (x) {}
      if (++done % 6000 === 0) console.log(`[breach] ${done}/${ids.length} under12=${under.length}`);
    }
  }
  await Promise.all(Array.from({ length: 16 }, () => worker()));

  const prev = new Set(readArr(BASELINE));
  const fresh = under.filter(id => !prev.has(id));   // under-12 that were NOT under-12 last time = NEW problems
  const byPillar = {}; for (const id of fresh) byPillar[pillarOf(id)] = (byPillar[pillarOf(id)] || 0) + 1;
  console.log(`[breach] total under12=${under.length} · NEW since baseline=${fresh.length} · byPillar=${JSON.stringify(byPillar)}`);

  // always refresh baseline
  fs.writeFileSync(BASELINE, JSON.stringify(under));

  if (!QUIET && fresh.length >= SPIKE) {
    // surface them: merge into the button queue (front)
    const q = readArr(QUEUE); const qs = new Set(q);
    const merged = [...fresh.filter(id => !qs.has(id)), ...q];
    fs.writeFileSync(QUEUE, JSON.stringify(merged));
    const top = Object.entries(byPillar).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([p, n]) => `${p}:${n}`).join(', ');
    await askOwner(`⚠️ Quality breach — ${fresh.length} new under-12 URLs`, `The smoke detector found <b>${fresh.length}</b> URLs that dropped below 12/13 since the last scan (total under-12 now ${under.length}).<br>By pillar: ${top}.<br>They've been added to the front of the Scrub Button queue (localhost:8899). Likely a writer dumped raw content — check the hourly cloud writer is off.`).catch(() => {});
    console.log(`[breach] ⚠️ SPIKE (${fresh.length} >= ${SPIKE}) — owner emailed + queued.`);
  } else if (fresh.length) {
    console.log(`[breach] ${fresh.length} new under-12 (below spike threshold ${SPIKE}) — baseline updated, no alert.`);
  } else {
    console.log('[breach] ✅ no new under-12 since baseline. All quiet.');
  }
})().catch(e => { console.log('[breach] FATAL', e && e.message); process.exit(1); });
