// Rewrite Aquarium general-essay Q&As touched today against corrected q11133 gold law.
// Usage: node _rewrite_today_aq_essays_batch.js [--dry] [--id=aq1160]
process.env.POLLINATOR_FREQ_MS = process.env.POLLINATOR_FREQ_MS || '20000';
process.env.DDG_THROTTLE_COOLDOWN_MS = process.env.DDG_THROTTLE_COOLDOWN_MS || '15000';
process.env.DDG_DELAY_MS = process.env.DDG_DELAY_MS || '15000';

const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const LOG_F = WD + '/_rewrite_today_aq_essays.log';
const PROGRESS_F = WD + '/_rewrite_today_aq_essays_progress.json';
const TODAY = '2026-07-06';

try {
  for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const { getStore } = require('@netlify/blobs');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { needsQaGoldFix, auditQaGoldTemplate } = require('./_qa_gold_template');
const { needsAqQaFix, rebuildAqQaEntry, saveAqQaEntry } = require('./_aq_qa_gold_fix_lib');
const { dsChat } = require('./_ds_lib');

const DRY = process.argv.includes('--dry');
const ONE = (process.argv.find((a) => a.startsWith('--id=')) || '').split('=')[1] || '';

const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

const log = (s) => {
  const line = new Date().toISOString() + ' ' + s;
  try { fs.appendFileSync(LOG_F, line + '\n'); } catch (e) {}
  console.log(s);
};

function writeProgress(obj) {
  try { fs.writeFileSync(PROGRESS_F, JSON.stringify(Object.assign({ at: new Date().toISOString() }, obj), null, 2)); } catch (e) {}
}

async function listTodayEssays() {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rows = (idx.entries || []).filter((e) => e && e.id && /^aq\d/i.test(e.id));
  const out = [];
  for (const row of rows) {
    const e = await store.get('answers/' + row.id + '.json', { type: 'json' }).catch(() => null);
    if (!e || !e.answer) continue;
    const route = pickGoldTemplate(row.id, e.answer, e.question || row.question);
    if (route.template !== 'qa') continue;
    const polished = e.polished_at ? new Date(e.polished_at).toISOString().slice(0, 10) : null;
    const updated = e.updated_at ? String(e.updated_at).slice(0, 10) : null;
    const touchedToday = polished === TODAY || updated === TODAY || e.format_v === '2026-07-aq-qa-gold';
    if (!touchedToday && !ONE) continue;
    if (ONE && row.id !== ONE) continue;
    const audit = auditQaGoldTemplate(e.answer, e.question || row.question, row.id);
    out.push({
      id: row.id,
      title: e.question || row.question,
      needsFix: needsQaGoldFix(e.answer, e.question || row.question, row.id) || needsAqQaFix(row.id, e.answer, e.question || row.question, e, true),
      issues: audit.issues || [],
      entry: e,
    });
  }
  return { idx, list: out };
}

(async () => {
  const { idx, list } = await listTodayEssays();
  const valid = new Set((idx.entries || []).map((e) => e && e.id).filter(Boolean));
  log('Today essay Q&As to check: ' + list.length);
  writeProgress({ running: !DRY, total: list.length, fixed: 0, failed: 0, queue: list.map((x) => x.id) });

  const fixed = [];
  const failed = [];

  for (const item of list) {
    writeProgress({ running: !DRY, currentId: item.id, total: list.length, fixed: fixed.length, failed: failed.length, queue: list.map((x) => x.id) });
    if (!item.needsFix && !(item.issues || []).length) {
      log('SKIP ' + item.id + ' — already compliant');
      fixed.push(item.id);
      continue;
    }
    log('FIX ' + item.id + ' — ' + (item.issues || []).join(', '));
    if (DRY) continue;

    try {
      const siblings = (idx.entries || [])
        .filter((e) => e && e.id && /^aq\d/i.test(e.id) && e.id !== item.id)
        .slice(0, 8)
        .map((e) => ({ id: e.id, title: e.question }));
      const result = await rebuildAqQaEntry(item.id, item.title, item.entry.answer, {
        store,
        valid,
        siblings,
        entryMeta: item.entry,
        dsChat,
        maxRounds: 3,
        onProgress: (p) => log(item.id + ' · ' + (p.label || p.phase || '')),
      });
      await saveAqQaEntry(store, idx, item.id, item.title, result.body, item.entry);
      log('OK ' + item.id + ' grade=' + result.grade + ' url=https://pulserevops.com/aquariums/' + item.id);
      fixed.push(item.id);
    } catch (err) {
      log('FAIL ' + item.id + ' — ' + (err.message || err));
      failed.push({ id: item.id, err: err.message || String(err) });
    }
  }

  writeProgress({
    running: false,
    total: list.length,
    fixed: fixed.length,
    failed: failed.length,
    doneIds: fixed,
    failedIds: failed,
    completedAt: new Date().toISOString(),
  });
  log('DONE fixed=' + fixed.length + ' failed=' + failed.length);
})().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
