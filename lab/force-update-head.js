// Force-overwrite Head entries with current local file content. Used when
// tail-to-head.js skips an entry because the id is already in the index, but
// the indexed version is stale or empty.
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOKEN = process.env.BLOBS_PAT;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }

const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOKEN });

const targets = process.argv.slice(2);
if (!targets.length) { console.error('usage: node force-update-head.js q1194 q1195 ...'); process.exit(1); }

(async () => {
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const now = Date.now();
  let updated = 0;
  for (let i = 0; i < targets.length; i++) {
    const id = targets[i];
    const fp = path.join(__dirname, 'cheap-100', id + '.json');
    let local;
    try { local = JSON.parse(fs.readFileSync(fp, 'utf8')); }
    catch (e) { console.warn(id, 'parse err:', e.message); continue; }

    if (!local.id || !local.question || !local.answer) {
      console.warn(id, 'incomplete shape, skipping');
      continue;
    }

    // Stagger ts so each one has a unique fresh timestamp (newest first sort)
    const ts = now - (i * 1000);

    // Overwrite per-entry blob
    await store.setJSON('answers/' + local.id + '.json', {
      id: local.id,
      question: local.question,
      answer: local.answer,
      tags: local.tags || [],
      sources: local.sources || [],
      ts: ts,
      model: local.model || 'claude-haiku-4-5',
      lab_run: local.lab_run || 'drip-cro-pitch',
    });

    // Update index entry (or add if missing)
    const existing = idx.entries.find(e => e.id === local.id);
    if (existing) {
      existing.question = local.question;
      existing.tags = local.tags || [];
      existing.ts = ts;
    } else {
      idx.entries.push({
        id: local.id,
        question: local.question,
        tags: local.tags || [],
        ts: ts,
      });
    }
    updated++;
  }

  // Re-sort index newest-first
  idx.entries.sort((a, b) => {
    if ((b.ts || 0) !== (a.ts || 0)) return (b.ts || 0) - (a.ts || 0);
    const na = parseInt(String(a.id).match(/\d+/)?.[0] || '0', 10);
    const nb = parseInt(String(b.id).match(/\d+/)?.[0] || '0', 10);
    return nb - na;
  });

  await store.setJSON('_index.json', idx);
  console.log('force-updated', updated, 'entries · total now:', idx.entries.length);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
