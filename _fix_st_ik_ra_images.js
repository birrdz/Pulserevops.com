'use strict';
/**
 * Serial unique face + sq + unique top for st, ik, ra from _live_bank.
 * No DeepSeek. Consume bank uniquely when possible; worst-case on-site dupe.
 * Usage: node _fix_st_ik_ra_images.js [st|ik|ra|all] [limit]
 */
const fs = require('fs');
const path = require('path');

const WD = __dirname;
for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { stampTitleFaceTop } = require('./_stamp_title_face');

const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

const LOG = path.join(WD, '_fix_st_ik_ra_images.log');
const STATE = path.join(WD, '_fix_st_ik_ra_images_state.json');
const arg = String(process.argv[2] || 'all').toLowerCase();
const LIMIT = parseInt(process.argv[3] || '0', 10) || 0;
const PILLARS = arg === 'all' ? ['st', 'ik', 'ra'] : [arg];

function log(m) {
  const line = new Date().toISOString() + ' ' + m;
  console.log(line);
  try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {}
}
function readJSON(f, d) {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; }
}
function writeJSON(f, o) {
  fs.writeFileSync(f, JSON.stringify(o, null, 2));
}

async function idsFor(pfx) {
  const mosaic = path.join(WD, 'mosaic-pool-' + pfx + '.json');
  if (fs.existsSync(mosaic)) {
    try {
      return JSON.parse(fs.readFileSync(mosaic, 'utf8'))
        .map((x) => x.id || x)
        .filter((id) => new RegExp('^' + pfx + '\\d+$', 'i').test(String(id)));
    } catch (e) {}
  }
  const idx = await store.get('_index.json', { type: 'json' });
  return (idx.entries || [])
    .map((e) => e && e.id)
    .filter((id) => new RegExp('^' + pfx + '\\d+$', 'i').test(String(id)))
    .sort((a, b) => (parseInt(String(a).replace(/\D/g, ''), 10) || 0) - (parseInt(String(b).replace(/\D/g, ''), 10) || 0));
}

(async () => {
  const st = readJSON(STATE, { done: {}, at: null });
  let n = 0, ok = 0, fail = 0;
  for (const pfx of PILLARS) {
    const ids = await idsFor(pfx);
    log('pillar ' + pfx + ' ids=' + ids.length);
    for (const id of ids) {
      if (st.done[id]) continue;
      if (LIMIT && n >= LIMIT) break;
      n++;
      try {
        const blob = await store.get('answers/' + id + '.json', { type: 'json' });
        const title = (blob && (blob.question || blob.h1 || blob.title)) || id;
        const r = await stampTitleFaceTop(store, id, {
          title,
          body: blob && (blob.answer || blob.body),
          surface: false, // don't bump Recents for mass image pass
          force: true,
          quality: 10,
        });
        if (r && r.ok) {
          ok++;
          st.done[id] = { at: new Date().toISOString(), via: r.via, dupe: !!r.dupe, top: r.topUrl };
          if (ok % 25 === 0) {
            writeJSON(STATE, st);
            log('ok ' + ok + ' fail ' + fail + ' last=' + id + ' via=' + r.via);
          }
        } else {
          fail++;
          log('FAIL ' + id + ' ' + (r && r.why));
        }
      } catch (e) {
        fail++;
        log('ERR ' + id + ' ' + (e && e.message));
      }
    }
    if (LIMIT && n >= LIMIT) break;
  }
  st.at = new Date().toISOString();
  writeJSON(STATE, st);
  log('DONE n=' + n + ' ok=' + ok + ' fail=' + fail + ' doneTotal=' + Object.keys(st.done).length);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
