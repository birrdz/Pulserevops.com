#!/usr/bin/env node
'use strict';
// One-shot: regenerate + deploy /assets/qa/{id}.jpg for pages that were
// "purged" but still show a 404 face cover (production always renders canon).

const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { ensureAlternateFaceCover } = require('../_ddg_facecard_lib');
const { deployQaAssetFiles } = require('./lib/deploy-qa-assets');

function loadEnv(p) {
  try {
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch (e) {}
}
loadEnv('/tmp/pulse-runtime.env');
if (!process.env.NETLIFY_AUTH_TOKEN && process.env.BLOBS_PAT) {
  process.env.NETLIFY_AUTH_TOKEN = process.env.BLOBS_PAT;
}

const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const ASSET_DIR = path.join(process.cwd(), 'assets', 'qa');
fs.mkdirSync(ASSET_DIR, { recursive: true });

const ids = (process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      'tl20624',
      'tl21475',
      'tl21476',
      'tl21477',
      'tl21479',
      'tl21482',
      'tl21484',
      'tl21486',
      'tl21489',
      'tl20324',
      'tl20302',
    ]
).map((x) => String(x).toLowerCase());

async function main() {
  const s = getStore({
    name: 'pulse-machine-library',
    siteID: SITE_ID,
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });
  const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
  const byId = new Map(
    (idx.entries || []).filter((e) => e && e.id).map((e) => [String(e.id).toLowerCase(), e])
  );
  const deployed = [];

  for (const id of ids) {
    const ent = byId.get(id);
    let blob = null;
    try {
      blob = await s.get('answers/' + id + '.json', { type: 'json' });
    } catch (e) {}
    const q = (blob && (blob.question || blob.title)) || (ent && ent.question) || id;
    const local = path.join(ASSET_DIR, id + '.jpg');
    try {
      if (fs.existsSync(local)) fs.unlinkSync(local);
    } catch (e) {}
    console.log(JSON.stringify({ phase: 'gen', id, q: String(q).slice(0, 80) }));
    let ok = false;
    try {
      ok = !!(await ensureAlternateFaceCover(id, String(q).slice(0, 160), s, null, {
        qaUpgradeAlternate: true,
        forceNew: true,
        alternateSources: true,
      }));
    } catch (e) {
      console.log(JSON.stringify({ phase: 'gen-err', id, err: String(e.message || e).slice(0, 160) }));
    }
    const size = fs.existsSync(local) ? fs.statSync(local).size : 0;
    if (!ok || size < 8000) {
      console.log(JSON.stringify({ phase: 'gen-miss', id, ok, size }));
      continue;
    }
    deployed.push(local);
    console.log(JSON.stringify({ phase: 'gen-ok', id, bytes: size }));
  }

  if (!deployed.length) {
    console.log(JSON.stringify({ phase: 'no-files' }));
    process.exit(2);
  }

  console.log(JSON.stringify({ phase: 'deploy', n: deployed.length }));
  const dep = await deployQaAssetFiles(deployed, {
    title: 'white-purge repair · ' + deployed.length + ' covers',
  });
  console.log(JSON.stringify({ phase: 'deploy-done', dep }));

  for (const id of ids) {
    const r = await fetch('https://pulserevops.com/assets/qa/' + id + '.jpg?v=' + Date.now());
    const buf = Buffer.from(await r.arrayBuffer());
    console.log(JSON.stringify({ phase: 'live', id, status: r.status, bytes: buf.length }));
  }
}

main().catch((e) => {
  console.error(JSON.stringify({ fatal: String(e.message || e) }));
  process.exit(1);
});
