// Unified cover-image backfill across the ENTIRE library (every prefix).
// LAW: every answer has a topical leading photo that embodies the Q&A.
// - Missing leading image -> prepend DDG photo
// - Weak cover (placeholder.svg or /img/auto/*.svg hero) -> replace with DDG photo
// Idempotent for real photos. Keyless DuckDuckGo. Resumable.
//   node _img_cover_all.js            (all prefixes)
//   node _img_cover_all.js q ra aq    (only these prefixes)
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const {
  prefixOf,
  needsCoverImage,
  stripLeadingImage,
  pickCoverImage,
} = require('./netlify/functions/lib/img-cover-lib');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
const ONLY = process.argv.slice(2).map((x) => x.toLowerCase()).filter((x) => !x.startsWith('--'));
const DRY = process.argv.includes('--dry');
const num = (id) => {
  const m = String(id).match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
};
const PROG = 'C:/Users/koryj/website/_img_cover_progress.json';

async function pingIndexNow(id) {
  try {
    await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (e) {}
}

async function emailOwner(subject, html) {
  try {
    await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, html }),
      signal: AbortSignal.timeout(12000),
    });
  } catch (e) {}
}

(async () => {
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  let entries = (idx.entries || []).filter((e) => e && e.id);
  if (ONLY.length) entries = entries.filter((e) => ONLY.includes(prefixOf(e.id)));
  entries.sort((a, b) => {
    const pa = prefixOf(a.id);
    const pb = prefixOf(b.id);
    return pa === pb ? num(a.id) - num(b.id) : pa < pb ? -1 : 1;
  });

  const targets = [];
  let scan = 0;
  const CS = 16;
  let cur = 0;
  async function scanWorker() {
    while (cur < entries.length) {
      const e0 = entries[cur++];
      const e = await s.get(`answers/${e0.id}.json`, { type: 'json' }).catch(() => null);
      if (!e || !e.answer) continue;
      if (needsCoverImage(e.answer)) targets.push(e0);
    }
  }
  await Promise.all(Array.from({ length: CS }, scanWorker));
  scan = entries.length;
  console.log(`scope: ${scan} entries${ONLY.length ? ` [${ONLY.join(',')}]` : ' (ALL)'} | need cover: ${targets.length}`);

  if (DRY) {
    targets.slice(0, 20).forEach((e) => console.log('  ', e.id, (e.question || '').slice(0, 70)));
    return;
  }

  let done = 0;
  let upgraded = 0;
  let added = 0;
  let skip = 0;
  let fail = 0;
  let ti = 0;
  let lastEmail = Date.now();
  let lastSave = Date.now();
  const CONC = 4;

  async function worker() {
    while (ti < targets.length) {
      const e0 = targets[ti++];
      const e = await s.get(`answers/${e0.id}.json`, { type: 'json' }).catch(() => null);
      if (!e || !e.answer) {
        skip++;
        continue;
      }
      if (!needsCoverImage(e.answer)) {
        skip++;
        continue;
      }
      const hadWeak = /^﻿?\s*!\[/.test(e.answer);
      const got = await pickCoverImage(e0.question || e0.title || e0.id, e0.id);
      if (!got) {
        fail++;
        console.log('  no-img', e0.id);
        continue;
      }
      const alt = String(e0.question || e0.title || '').replace(/[\[\]]/g, '').slice(0, 90);
      const lead = `![${alt}](${got.img})\n\n`;
      e.answer = lead + stripLeadingImage(e.answer).replace(/^\n+/, '');
      e.ts = Date.now();
      e.polished_at = Date.now();
      await s.setJSON(`answers/${e0.id}.json`, e);
      await pingIndexNow(e0.id);
      done++;
      if (hadWeak) upgraded++;
      else added++;
      if (done % 25 === 0) console.log(`  [${done}] cover ${e0.id} via "${got.via.slice(0, 40)}" (${ti}/${targets.length})`);
      const now = Date.now();
      if (now - lastSave > 20000) {
        lastSave = now;
        fs.writeFileSync(
          PROG,
          JSON.stringify({ scanned: scan, targets: targets.length, added, upgraded, skipped: skip, noImage: fail }, null, 1)
        );
      }
      if (now - lastEmail > 15 * 60 * 1000) {
        lastEmail = now;
        await emailOwner(
          `PULSE cover-images: ${done} done (${ti}/${targets.length})`,
          `<p>Topical cover backfill in progress.<br><b>${done}</b> covers set (${added} new, ${upgraded} upgraded), ${fail} no-image, ${skip} skipped.<br>Progress ${ti}/${targets.length}.</p>`
        );
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));

  fs.writeFileSync(
    PROG,
    JSON.stringify({ scanned: scan, targets: targets.length, added, upgraded, skipped: skip, noImage: fail, complete: true }, null, 1)
  );
  console.log(`\nCOVER-ALL DONE. set=${done} added=${added} upgraded=${upgraded} skipped=${skip} noImage=${fail}`);
  await emailOwner(
    `PULSE cover-images COMPLETE: ${done} topical heroes`,
    `<p>Library-wide topical cover backfill finished.<br><b>${done}</b> leading images set (${added} new, ${upgraded} upgraded from placeholder/SVG), ${fail} no-image found.</p>`
  );
})().catch((e) => {
  console.error('FATAL', e && e.stack);
  process.exit(1);
});
