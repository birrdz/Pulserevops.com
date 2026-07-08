#!/usr/bin/env node
/** Verify face-hero smoke: hero path = /assets/qa/{id}.jpg, file renders */
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { verifyQaAssetRenders } = require('./_ddg_facecard_lib');

const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

const IDS = ['mv0050', 'mv0049', 'mv0048'];

function heroOf(body) {
  const m = String(body || '').match(/!\[[^\]]*\]\(([^)\s]+)\)/);
  return m ? m[1] : null;
}

async function main() {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  for (const id of IDS) {
    const facePath = '/assets/qa/' + id + '.jpg';
    const disk = path.join('C:/Users/koryj/website/assets/qa', id + '.jpg');
    const diskOk = fs.existsSync(disk);
    const diskBytes = diskOk ? fs.statSync(disk).size : 0;
    const renderOk = await verifyQaAssetRenders(facePath, id);
    const e = await store.get('answers/' + id + '.json', { type: 'json' });
    const hero = heroOf(e && e.answer);
    const ent = (idx.entries || []).find(x => x && x.id === id);
    const idxImg = ent && ent.img;
    const ok = diskOk && diskBytes > 40000 && renderOk && hero === facePath && idxImg === facePath;
    console.log(JSON.stringify({
      id,
      ok,
      diskBytes,
      renderOk,
      hero,
      idxImg,
      cover_src: ent && ent.cover_src,
      title: ent && ent.question,
    }));
  }
}

main().catch(e => { console.error(e); process.exit(1); });
