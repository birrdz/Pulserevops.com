// Audit library entries for duplicate leading cover images.
// Usage: node _audit_duplicate_cover_images.js [--prefix q] [--prefix dn]
// Output: _duplicate_cover_audit.json
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { loadEnv, blobsPat, netlifySiteId } = require('./netlify/functions/lib/load-env');
const {
  leadingImageMatch,
  isWeakCoverUrl,
  prefixOf,
} = require('./netlify/functions/lib/img-cover-lib');

loadEnv(__dirname);

const ROOT = __dirname;
const OUT = path.join(ROOT, '_duplicate_cover_audit.json');
const SITE_ID = netlifySiteId() || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const ONLY = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const CONC = Math.min(16, Math.max(4, parseInt(process.env.AUDIT_CONC || '12', 10) || 12));

function normalizeCoverUrl(url) {
  if (!url) return '';
  const raw = String(url).trim();
  try {
    const u = new URL(raw, 'https://pulserevops.com');
    let p = u.pathname.replace(/\/+$/, '') || '/';
    return `${u.protocol}//${u.host.toLowerCase()}${p}`.toLowerCase();
  } catch (_) {
    return raw.split('?')[0].split('#')[0].toLowerCase();
  }
}

function extractCover(body) {
  const m = leadingImageMatch(body);
  if (!m) return null;
  return { alt: m[1], url: m[2], weak: isWeakCoverUrl(m[2]) };
}

function sortId(a, b) {
  const pa = prefixOf(a);
  const pb = prefixOf(b);
  if (pa !== pb) return pa < pb ? -1 : 1;
  const na = parseInt(String(a).match(/\d+/)?.[0] || '0', 10);
  const nb = parseInt(String(b).match(/\d+/)?.[0] || '0', 10);
  return na - nb;
}

(async () => {
  const token = blobsPat();
  if (!token) {
    console.error('Missing BLOBS_PAT');
    process.exit(1);
  }

  const store = getStore({
    name: 'pulse-machine-library',
    siteID: SITE_ID,
    token,
  });

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  let rows = (idx.entries || []).filter((e) => e && e.id);
  if (ONLY.length) {
    rows = rows.filter((e) => ONLY.includes(prefixOf(e.id).toLowerCase()));
  }

  console.log(`Scanning ${rows.length} index rows (conc=${CONC})…`);

  const scanned = [];
  let noBlob = 0;
  let noCover = 0;
  let weakCover = 0;
  let cur = 0;

  async function worker() {
    while (cur < rows.length) {
      const i = cur++;
      const row = rows[i];
      const blob = await store.get(`answers/${row.id}.json`, { type: 'json' }).catch(() => null);
      if (!blob || !blob.answer) {
        noBlob++;
        continue;
      }
      const cover = extractCover(blob.answer);
      if (!cover) {
        noCover++;
        continue;
      }
      if (cover.weak) weakCover++;
      scanned.push({
        id: row.id,
        prefix: prefixOf(row.id),
        question: String(row.question || blob.question || '').slice(0, 120),
        url: cover.url,
        normalized: normalizeCoverUrl(cover.url),
        weak: cover.weak,
      });
    }
  }

  await Promise.all(Array.from({ length: CONC }, worker));

  const byUrl = new Map();
  for (const e of scanned) {
    const key = e.normalized || e.url;
    if (!byUrl.has(key)) byUrl.set(key, []);
    byUrl.get(key).push(e);
  }

  const duplicateGroups = [];
  let duplicateEntryCount = 0;
  for (const [normalized, list] of byUrl) {
    if (list.length < 2) continue;
    list.sort((a, b) => sortId(a.id, b.id));
    duplicateGroups.push({
      normalized,
      sampleUrl: list[0].url,
      count: list.length,
      keeper: list[0].id,
      toFix: list.slice(1).map((x) => x.id),
      entries: list.map((x) => ({ id: x.id, prefix: x.prefix, question: x.question, url: x.url })),
    });
    duplicateEntryCount += list.length - 1;
  }

  duplicateGroups.sort((a, b) => b.count - a.count || a.keeper.localeCompare(b.keeper));

  const prefixCounts = {};
  for (const e of scanned) {
    prefixCounts[e.prefix] = (prefixCounts[e.prefix] || 0) + 1;
  }

  const report = {
    generatedAt: new Date().toISOString(),
    totalIndexRows: rows.length,
    scannedWithCover: scanned.length,
    noBlob,
    noCover,
    weakCover,
    uniqueCoverUrls: byUrl.size,
    duplicateUrlGroups: duplicateGroups.length,
    entriesNeedingFix: duplicateEntryCount,
    prefixCounts,
    duplicateGroups,
  };

  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify(
      {
        totalIndexRows: report.totalIndexRows,
        scannedWithCover: report.scannedWithCover,
        uniqueCoverUrls: report.uniqueCoverUrls,
        duplicateUrlGroups: report.duplicateUrlGroups,
        entriesNeedingFix: report.entriesNeedingFix,
        noBlob,
        noCover,
        weakCover,
        out: OUT,
      },
      null,
      2
    )
  );
})().catch((e) => {
  console.error('FATAL', e && e.stack);
  process.exit(1);
});
