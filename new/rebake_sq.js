// new/rebake_sq.js — make Recents thumbnails clean: crop the baked 34px frame off qa-bin/<qid>.sq.jpg
// for every already-published block-builder entry. The bold pink/green CSS card border is the frame now.
// Blob-only, no deploy.
'use strict';
const fs = require('fs');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN });
const OUT = WD + '/new/output';
const bw = 34;

(async () => {
  const ids = [];
  for (const d of fs.readdirSync(OUT)) { try { const m = JSON.parse(fs.readFileSync(OUT + '/' + d + '/meta.json', 'utf8')); if (m.live && m.qid) ids.push(m.qid); } catch (e) {} }
  console.log('cleaning', ids.length, 'thumbnails…');
  let done = 0;
  for (const qid of ids) {
    try {
      const raw = await store.get('qa-bin/' + qid + '.jpg', { type: 'arrayBuffer' });
      if (!raw) continue;
      const buf = Buffer.from(raw);
      const md = await sharp(buf).metadata();
      if ((md.width || 0) < 3 * bw) continue;
      const clean = await sharp(buf).extract({ left: bw, top: bw, width: md.width - 2 * bw, height: md.height - 2 * bw }).jpeg({ quality: 86 }).toBuffer();
      await store.set('qa-bin/' + qid + '.sq.jpg', clean, { metadata: { src: 'rebake-clean' } });
      done++;
    } catch (e) { console.log('  skip', qid, e.message); }
  }
  console.log('✅ cleaned', done, 'Recents thumbnails');
})().catch(e => { console.log('ERR', e.message); process.exit(1); });
