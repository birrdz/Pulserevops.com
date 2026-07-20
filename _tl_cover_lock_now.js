#!/usr/bin/env node
/**
 * One-shot: lock ALL tl covers to cro-cover-1..6 + strip pollinations body imgs.
 * Index rewritten once; answers patched in chunks.
 *
 *   node _tl_cover_lock_now.js
 *   PILOT=tl10740,tl9495 node _tl_cover_lock_now.js
 */
const fs = require('fs');
const { getStore } = require('/workspace/node_modules/@netlify/blobs');
const { lockTlAnswerEntry, lockTlIndexRow, isTlId, croCoverForId } = require('/workspace/_tl_cover_lock_lib');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const LOG = '/tmp/tl-cover-lock.log';
const REPORT = '/tmp/tl-cover-lock-report.json';

try {
  const envPath = '/tmp/aq-drip.env';
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  }
} catch (_e) {}

const cfg = require('/home/ubuntu/.config/netlify/config.json');
const token = Object.values(cfg.users || {})[0].auth.token;
const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token });

function log(s) {
  const line = `[${new Date().toISOString()}] ${s}`;
  console.log(line);
  fs.appendFileSync(LOG, line + '\n');
}

async function main() {
  const pilot = String(process.env.PILOT || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const limit = Number(process.env.LIMIT || 0) || 0;

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let ids = (idx.entries || []).map((e) => e && e.id).filter(isTlId);
  if (pilot.length) ids = pilot.filter(isTlId);
  if (limit > 0) ids = ids.slice(0, limit);

  log(`START lock covers ids=${ids.length}`);

  // 1) index pass
  const idSet = new Set(ids);
  let indexPatched = 0;
  const entries = (idx.entries || []).map((e) => {
    if (!e || !idSet.has(e.id)) return e;
    const next = lockTlIndexRow(e, e.id);
    if (next.img !== e.img || next.cover_src !== e.cover_src || e.face_title_baked) indexPatched++;
    return next;
  });
  if (!pilot.length || ids.length > 10) {
    await store.setJSON('_index.json', Object.assign({}, idx, { entries }));
    log(`INDEX patched rows=${indexPatched}`);
  } else {
    // surgical index update for pilots
    const byId = new Map(entries.map((e, i) => [e && e.id, i]));
    for (const id of ids) {
      const i = byId.get(id);
      if (i == null) continue;
      idx.entries[i] = lockTlIndexRow(idx.entries[i], id);
    }
    await store.setJSON('_index.json', idx);
    log(`INDEX surgical patched=${ids.length}`);
  }

  // 2) answers
  const stats = { scanned: 0, fixed: 0, bodyStripped: 0, errors: 0 };
  for (let i = 0; i < ids.length; i += 40) {
    const chunk = ids.slice(i, i + 40);
    await Promise.all(
      chunk.map(async (id) => {
        stats.scanned++;
        try {
          const e = await store.get('answers/' + id + '.json', { type: 'json' });
          if (!e) return;
          const { entry, bodyChanged } = lockTlAnswerEntry(e, id);
          const already =
            e.cover_src === 'cro-cover-locked' &&
            e.img === croCoverForId(id) &&
            !e.face_title_baked &&
            !bodyChanged;
          if (already) return;
          await store.setJSON('answers/' + id + '.json', entry);
          stats.fixed++;
          if (bodyChanged) stats.bodyStripped++;
        } catch (err) {
          stats.errors++;
          log('ERR ' + id + ' ' + (err.message || err));
        }
      })
    );
    if ((i + 40) % 400 === 0 || i + 40 >= ids.length) {
      log(`answers ${Math.min(i + 40, ids.length)}/${ids.length} fixed=${stats.fixed} stripped=${stats.bodyStripped}`);
    }
  }

  const report = { at: new Date().toISOString(), ids: ids.length, indexPatched, stats, sample: ids.slice(0, 5).map((id) => ({ id, cover: croCoverForId(id) })) };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  log('DONE ' + JSON.stringify(report.stats));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
