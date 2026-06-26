// Stamp format_v="2026-05" on q30 blob + mirror to _index.json.
const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const raw of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('='); if (eq < 0) continue;
    const k = line.slice(0, eq).trim();
    let v = line.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v;
  }
}

const { getStore } = require('@netlify/blobs');
const ID = 'q30';
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

(async () => {
  const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
  if (!TOKEN) { console.error('Missing BLOBS_PAT'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOKEN });

  const entry = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!entry) { console.error(ID, 'not found'); process.exit(1); }

  const raw = entry.answer || '';
  const clean = raw.replace(/[#*_`>\[\]()-]/g, ' ').replace(/\s+/g, ' ').trim();
  console.log('BEFORE:', { qs: entry.quality_score, format_v: entry.format_v || null, raw_words: raw.trim().split(/\s+/).length, clean_words: clean.split(/\s+/).length });

  const now = Date.now();
  const updated = { ...entry, format_v: '2026-05', format_v_set_at: now, last_modified_ms: now };
  await store.setJSON('answers/' + ID + '.json', updated);
  console.log('blob: format_v stamped 2026-05');

  const idx = await store.get('_index.json', { type: 'json' });
  if (idx && Array.isArray(idx.entries)) {
    const i = idx.entries.findIndex(x => x && x.id === ID);
    if (i >= 0) {
      idx.entries[i] = { ...idx.entries[i], format_v: '2026-05', last_modified_ms: now };
      await store.setJSON('_index.json', idx);
      console.log('_index.json mirrored');
    } else {
      console.warn('not found in _index.json');
    }
  }

  const v = await store.get('answers/' + ID + '.json', { type: 'json' });
  console.log('VERIFY:', { qs: v.quality_score, format_v: v.format_v, polished_at: v.polished_at });
})();
