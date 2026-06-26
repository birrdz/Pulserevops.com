// Shorten one sales-training title (question field) — economy blob update only.
// Usage: node _economy_st_shorten_title_one.js st0074
//        node _economy_st_shorten_title_one.js --all
const fs = require('fs');
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

const OVERRIDES = {
  st0010: 'Pharma HCP Detailing — 60-Min Training',
  st0020: 'Wedding Venue Tour — 60-Min Training',
  st0026: 'MSP MSA Renewal — 60-Min Training',
  st0027: 'Commercial HVAC Renewal — 60-Min Training',
  st0028: 'Commercial Pest Control Bid Walk — 60-Min Training',
  st0029: 'Commercial Janitorial Bid Walk — 60-Min Training',
  st0034: 'Waste & Recycling Bid Walk — 60-Min Training',
  st0035: 'Landscape Bid Walk — 60-Min Training',
  st0061: 'Multi-Threading Enterprise Deals — 60-Min Training',
};

/** Short, scannable title — keep the hook, drop the essay subtitle. */
function shortenTitle(old, id) {
  if (id && OVERRIDES[id]) return OVERRIDES[id];
  if (!old) return old;
  let s = old
    .replace(/\s*([—–]|--)\s*a 60-Minute Sales Training\s*$/i, '')
    .replace(/\s*—\s*a 60-Minute Sales Training\s*$/i, '')
    .trim();

  if (/^Sales training:/i.test(s)) {
    s = s.replace(/^Sales training:\s*/i, '').trim();
    s = s.charAt(0).toUpperCase() + s.slice(1);
  } else {
    const running = s.match(/^(The [^:]+):\s*Running a 60-Minute/i);
    if (running) {
      s = running[1].trim();
    } else if (s.includes(':') && s.length > 55) {
      s = s.split(':')[0].trim();
    }
  }

  if (s.length > 62) {
    s = s
      .replace(/\s+2027$/, ' (2027)')
      .replace(/\s+2026$/, ' (2026)');
    if (s.length > 62) s = s.slice(0, 59).trim() + '…';
  }

  return s + ' — 60-Min Training';
}

function loadToken() {
  const line = fs
    .readFileSync(`${__dirname}/.env.local`, 'utf8')
    .split(/\r?\n/)
    .find((l) => l.startsWith('BLOBS_PAT='));
  if (!line) throw new Error('BLOBS_PAT missing');
  return line.slice('BLOBS_PAT='.length).trim();
}

async function shortenOne(store, id) {
  const entry = await store.get(`answers/${id}.json`, { type: 'json' });
  if (!entry) {
    console.log(JSON.stringify({ ok: false, id, reason: 'not found' }));
    return;
  }
  const oldQ = entry.question || '';
  const newQ = shortenTitle(oldQ, id);
  if (newQ === oldQ) {
    console.log(JSON.stringify({ ok: true, id, skipped: true, question: newQ }));
    return;
  }

  const ts = Date.now();
  await store.setJSON(`answers/${id}.json`, {
    ...entry,
    question: newQ,
    last_modified_ms: ts,
    title_shortened_at: ts,
  });

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const i = (idx.entries || []).findIndex((e) => e && e.id === id);
  if (i >= 0) {
    idx.entries[i] = { ...idx.entries[i], question: newQ, last_modified_ms: ts };
    await store.setJSON('_index.json', idx);
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        id,
        old: oldQ.slice(0, 100) + (oldQ.length > 100 ? '…' : ''),
        new: newQ,
        oldLen: oldQ.length,
        newLen: newQ.length,
      },
      null,
      2
    )
  );
}

async function main() {
  const token = loadToken();
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token });
  const arg = process.argv[2];

  if (arg === '--all') {
    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    const ids = (idx.entries || [])
      .map((e) => e.id)
      .filter((id) => /^st\d+$/i.test(id))
      .sort((a, b) => parseInt(a.slice(2), 10) - parseInt(b.slice(2), 10));
    for (const id of ids) {
      await shortenOne(store, id);
      await new Promise((r) => setTimeout(r, 250));
    }
    return;
  }

  if (!arg || !/^st\d+$/i.test(arg)) {
    console.error('Usage: node _economy_st_shorten_title_one.js st0074');
    console.error('       node _economy_st_shorten_title_one.js --all');
    process.exit(1);
  }
  await shortenOne(store, arg);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
