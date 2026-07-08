// Watches _{pillar}_pillar_image_state.json and emails koryjordanwhite@gmail.com per completed entry.
// Run alongside _pillar_image_fix_run.js (no restart needed). Stop: _pillar_image_email_stop.flag
// Env: PILLAR=hf (required)
'use strict';

const fs = require('fs');
const path = require('path');
const WD = __dirname;
const STOP_F = WD + '/_pillar_image_email_stop.flag';
const POLL_MS = parseInt(process.env.PILLAR_IMAGE_EMAIL_POLL_MS || '8000', 10);
const PILLAR = String(process.env.PILLAR || process.argv.find((a) => a.startsWith('--pillar='))?.split('=')[1] || '').toLowerCase();

for (const l of (() => {
  try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; }
})()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const { getStore } = require('@netlify/blobs');
const { notifyPillarEntryDone } = require('./_pillar_entry_done_email');
const { pillarUrl } = require('./_ranking_list_rebuild_lib');

const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STATE_F = WD + '/_' + PILLAR + '_pillar_image_state.json';
const SEEN_F = WD + '/_pillar_image_email_seen_' + PILLAR + '.json';
const LOG_F = WD + '/_pillar_image_email_watcher.log';

function log(m) {
  const s = new Date().toISOString() + ' ' + m;
  try { fs.appendFileSync(LOG_F, s + '\n'); } catch (e) {}
  console.log('[pillar-email-watch] ' + m);
}

function loadSeen() {
  try { return new Set(JSON.parse(fs.readFileSync(SEEN_F, 'utf8'))); } catch (e) { return new Set(); }
}

function saveSeen(set) {
  try { fs.writeFileSync(SEEN_F, JSON.stringify([...set])); } catch (e) {}
}

function doneIds(state) {
  const ids = new Set();
  for (const k of ['rankingDone', 'essayDone', 'ceDone']) {
    for (const id of state[k] || []) ids.add(String(id).toLowerCase());
  }
  return [...ids];
}

function titleFromSamples(state, id) {
  const s = (state.samples || []).find((x) => x && String(x.id).toLowerCase() === id);
  return s && s.title ? s.title : '';
}

async function main() {
  if (!PILLAR) {
    console.error('Usage: PILLAR=hf node _pillar_image_fix_email_watcher.js');
    process.exit(1);
  }
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: SITE,
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN,
  });
  const seen = loadSeen();
  log('live · pillar=' + PILLAR + ' · state=' + path.basename(STATE_F) + ' · seen=' + seen.size);

  while (!fs.existsSync(STOP_F)) {
    try {
      if (!fs.existsSync(STATE_F)) {
        await new Promise((r) => setTimeout(r, POLL_MS));
        continue;
      }
      const state = JSON.parse(fs.readFileSync(STATE_F, 'utf8'));
      const fresh = doneIds(state).filter((id) => !seen.has(id));
      for (const id of fresh) {
        let title = titleFromSamples(state, id);
        let grade;
        let imageCount;
        if (!title) {
          try {
            const e = await store.get('answers/' + id + '.json', { type: 'json' });
            title = (e && e.question) || id;
            grade = e && e.quality_score;
          } catch (e) {
            title = id;
          }
        }
        const sample = (state.samples || []).find((x) => x && String(x.id).toLowerCase() === id);
        if (sample) {
          if (sample.grade != null) grade = sample.grade;
          if (sample.productImgs != null) imageCount = sample.productImgs;
          if (sample.imgs != null) imageCount = sample.imgs;
        }
        const phase = (state.rankingDone || []).includes(id) ? 'ranking images' :
          (state.ceDone || []).includes(id) ? 'CE template' : 'Q&A gold';
        try {
          await notifyPillarEntryDone({
            id,
            title,
            url: pillarUrl(id),
            phase,
            grade,
            imageCount,
          });
          seen.add(id);
          saveSeen(seen);
        } catch (e) {
          log('email err ' + id + ' · ' + e.message);
        }
        await new Promise((r) => setTimeout(r, 1200));
      }
    } catch (e) {
      log('loop err ' + (e.message || e));
    }
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
  log('stopped');
}

main().catch((e) => { log('FATAL ' + e.message); process.exit(1); });
