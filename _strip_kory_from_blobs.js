// One-shot: remove kory-white.jpg markdown from all library blobs (owner 2026-07-04).
// CRO widget is render-time only — in-body portrait was showing on every answer page.
const fs = require('fs');
const path = require('path');
const WD = __dirname;
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { stripAllCroFromBody } = require('./_cro_strip_lib');
const { KORY_CRO_IMG, isKoryCroImg } = require('./_img_flux_lib');

const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

function stripKory(body) {
  let b = stripAllCroFromBody(String(body || ''));
  return b.split('\n').filter(line => {
    const m = line.match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
    return !(m && isKoryCroImg(m[2]));
  }).join('\n');
}

(async () => {
  const dry = process.argv.includes('--dry');
  const list = await store.list({ prefix: 'answers/' });
  let scanned = 0, hit = 0, saved = 0, err = 0;
  for (const item of list.blobs) {
    if (!item.key.endsWith('.json')) continue;
    scanned++;
    try {
      const blob = await store.get(item.key, { type: 'json' });
      if (!blob || !blob.answer || !String(blob.answer).includes(KORY_CRO_IMG)) continue;
      hit++;
      const next = stripKory(blob.answer);
      if (next === blob.answer) continue;
      if (!dry) {
        await store.setJSON(item.key, { ...blob, answer: next });
      }
      saved++;
      if (saved <= 8 || saved % 500 === 0) console.log((dry ? '[dry] ' : '') + 'fixed ' + item.key.replace('answers/', '').replace('.json', ''));
    } catch (e) {
      err++;
      console.error('err', item.key, e.message);
    }
  }
  console.log(JSON.stringify({ scanned, hit, saved, err, dry }, null, 2));
})();
