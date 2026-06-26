// Remove internal "(batch N #M)" suffixes from live Q&A questions + batch-N tags.
// Usage: node _strip_batch_from_questions.js [--dry-run]
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const DRY = process.argv.includes('--dry-run');

function loadPat() {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  const m = env.match(/^BLOBS_PAT=(.+)$/m);
  if (!m) throw new Error('BLOBS_PAT missing in .env.local');
  return m[1].trim();
}

/** Strip internal batch markers from question titles. */
function cleanQuestion(q) {
  if (!q) return q;
  let s = String(q);
  s = s.replace(/\s*\(batch\s+\d+\s*#\d+\)\s*/gi, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  if (s && !s.endsWith('?')) s += '?';
  return s;
}

function cleanTags(tags) {
  if (!Array.isArray(tags)) return tags;
  return tags.filter((t) => !/^batch-\d+$/i.test(String(t)));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const pat = loadPat();
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: pat });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const changed = [];

  for (const row of idx.entries || []) {
    if (!row || !/^q\d+$/i.test(row.id)) continue;
    const cleaned = cleanQuestion(row.question);
    const tags = cleanTags(row.tags);
    const tagsChanged =
      Array.isArray(row.tags) &&
      tags.length !== row.tags.length;
    if (cleaned === row.question && !tagsChanged) continue;

    changed.push({
      id: row.id,
      before: row.question,
      after: cleaned,
      tagsRemoved: (row.tags || []).length - tags.length,
    });

    if (!DRY) {
      row.question = cleaned;
      row.tags = tags;
      const blob = await store.get('answers/' + row.id + '.json', { type: 'json' });
      if (blob) {
        blob.question = cleaned;
        blob.tags = cleanTags(blob.tags);
        await store.setJSON('answers/' + row.id + '.json', blob);
      }
    }
  }

  if (!DRY && changed.length) {
    await store.setJSON('_index.json', idx);
  }

  console.log(
    JSON.stringify(
      {
        dry_run: DRY,
        changed: changed.length,
        samples: changed.slice(0, 5).map((c) => ({ id: c.id, after: c.after.slice(0, 72) })),
      },
      null,
      2
    )
  );

  if (DRY) return;

  // Re-ping IndexNow for cleaned titles (SEO title change)
  const https = require('https');
  const KEY = 'pulsemachine-writer-2026';
  for (let i = 0; i < changed.length; i++) {
    const id = changed[i].id;
    const payload = JSON.stringify({ key: KEY, id });
    await new Promise((resolve) => {
      const req = https.request(
        {
          hostname: 'pulserevops.com',
          path: '/.netlify/functions/pulse-indexnow-target',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
        },
        (res) => {
          res.on('data', () => {});
          res.on('end', () => resolve(res.statusCode));
        }
      );
      req.on('error', () => resolve(0));
      req.write(payload);
      req.end();
    });
    if ((i + 1) % 25 === 0) console.log('IndexNow', i + 1, '/', changed.length);
    await sleep(600);
  }
  console.log('Done. Re-indexed', changed.length, 'cleaned questions.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
