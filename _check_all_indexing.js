// Audit (and optionally backfill) IndexNow indexing for all q#### library answers.
// Usage:
//   node _check_all_indexing.js              # report only
//   node _check_all_indexing.js --fix        # ping all missing (rate-limited)
//   node _check_all_indexing.js --fix 50     # ping at most 50 this run
const fs = require('fs');
const path = require('path');
const https = require('https');

const REPORT = path.join(__dirname, '_index_audit_report.json');
const LOG = path.join(__dirname, '_index_audit_run.log');
const SITE = 'pulserevops.com';
const WRITER_KEY = 'pulsemachine-writer-2026';
const DELAY_MS = 900;

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG, line + '\n', 'utf8');
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'pulse-index-audit/1.0' } }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, json: JSON.parse(body) });
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

function indexOne(id) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({ key: WRITER_KEY, id });
    const req = https.request(
      {
        hostname: SITE,
        path: '/.netlify/functions/pulse-indexnow-target',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          let j = {};
          try {
            j = JSON.parse(body);
          } catch (_) {}
          resolve({ id, status: res.statusCode, ok: res.statusCode === 200 && j.ok, pings: j.pings });
        });
      }
    );
    req.on('error', (e) => resolve({ id, status: 0, ok: false, error: e.message }));
    req.write(payload);
    req.end();
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchAllQFromBlob() {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) return null;
  const m = fs.readFileSync(envPath, 'utf8').match(/^BLOBS_PAT=(.+)$/m);
  if (!m) return null;
  const { getStore } = require('@netlify/blobs');
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: m[1].trim(),
  });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  return (idx.entries || []).filter((e) => e && /^q\d+$/i.test(e.id));
}

async function fetchAllQ() {
  const blobEntries = await fetchAllQFromBlob();
  if (blobEntries && blobEntries.length) {
    return { entries: blobEntries, source: 'blob_index' };
  }
  const { status, json } = await fetchJson(
    `https://${SITE}/.netlify/functions/pulse-machine-library-list?recent=5000`
  );
  if (status !== 200 || !json.ok) throw new Error('library-list failed HTTP ' + status);
  const entries = (json.entries || []).filter((e) => e && /^q\d+$/i.test(e.id));
  if (json.total && entries.length < json.total * 0.5) {
    log('WARN: API recent=5000 may truncate; set BLOBS_PAT in .env.local for full audit');
  }
  return { entries, source: 'api_recent_5000' };
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'pulse-index-audit/1.0' } }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      })
      .on('error', reject);
  });
}

async function sitemapHas(id) {
  const { status, body } = await fetchText(`https://${SITE}/.netlify/functions/pulse-machine-sitemap`);
  if (status !== 200) return null;
  return body.includes(`/knowledge/${id}`);
}

async function main() {
  const fix = process.argv.includes('--fix');
  const maxFix = parseInt(process.argv.find((a) => /^\d+$/.test(a)) || '0', 10) || (fix ? Infinity : 0);

  const { entries, source } = await fetchAllQ();
  const indexed = entries.filter((e) => e.was_indexed_at);
  const missing = entries.filter((e) => !e.was_indexed_at);

  const byNum = (arr) =>
    arr
      .map((e) => ({ id: e.id, n: parseInt(e.id.slice(1), 10), ts: e.ts || 0, q: (e.question || '').slice(0, 80) }))
      .sort((a, b) => b.n - a.n);

  const report = {
    audited_at: new Date().toISOString(),
    site: SITE,
    source,
    q_total: entries.length,
    q_indexed: indexed.length,
    q_missing_was_indexed_at: missing.length,
    pct_indexed: entries.length ? Math.round((100 * indexed.length) / entries.length) : 0,
    missing_newest: byNum(missing).slice(0, 15),
    missing_oldest: byNum(missing)
      .slice()
      .sort((a, b) => a.n - b.n)
      .slice(0, 10),
    sitemap_spot: {},
    fix_run: null,
  };

  for (const id of ['q1', missing[0]?.id, entries[0]?.id].filter(Boolean)) {
    if (!id) continue;
    report.sitemap_spot[id] = await sitemapHas(id);
  }

  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2), 'utf8');
  log(
    `AUDIT q_total=${report.q_total} indexed=${report.q_indexed} missing=${report.q_missing_was_indexed_at} (${report.pct_indexed}%)`
  );
  log(`Report: ${REPORT}`);

  if (!fix || !missing.length) {
    if (missing.length) log(`Run: node _check_all_indexing.js --fix [max]  (${missing.length} to ping)`);
    return;
  }

  const todo = byNum(missing).slice(0, maxFix === Infinity ? missing.length : maxFix);
  log(`FIX starting ${todo.length} IndexNow pings (${DELAY_MS}ms apart)`);
  let ok = 0;
  let fail = 0;
  for (let i = 0; i < todo.length; i++) {
    const { id } = todo[i];
    const r = await indexOne(id);
    if (r.ok) ok++;
    else fail++;
    log(`FIX ${i + 1}/${todo.length} ${id} HTTP ${r.status} ${r.ok ? 'OK' : 'FAIL'}`);
    if (i < todo.length - 1) await sleep(DELAY_MS);
  }
  report.fix_run = { at: new Date().toISOString(), attempted: todo.length, ok, fail };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2), 'utf8');

  const after = (await fetchAllQ()).entries;
  const still = after.filter((e) => !e.was_indexed_at).length;
  log(`FIX done ok=${ok} fail=${fail} still_missing=${still}`);
}

main().catch((e) => {
  log('ERROR ' + e.message);
  process.exit(1);
});
