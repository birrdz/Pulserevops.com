// Fix duplicate leading cover images — keep first occurrence, replace 2nd+.
// Usage: node _fix_duplicate_cover_images.js [--dry] [--limit N]
// Reads: _duplicate_cover_audit.json
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { loadEnv, blobsPat, netlifySiteId } = require('./netlify/functions/lib/load-env');
const { createBatchProgressReporter } = require('./netlify/functions/lib/progress-email');
const {
  stripLeadingImage,
  queryVariants,
  prefixOf,
  leadingImageMatch,
} = require('./netlify/functions/lib/img-cover-lib');
const { ddgImages, ddgThrottle, headOk, DDG_DELAY_MS } = require('./netlify/functions/lib/img-search-lib');
const {
  pollinationsHostedImage,
  coverPrompt,
  ensureImagenProbed,
  geminiCoverFor,
} = require('./netlify/functions/lib/gemini-image-lib');
const { grokHostImage } = require('./netlify/functions/lib/grok-image-lib');

loadEnv(__dirname);

const ROOT = __dirname;
const AUDIT = path.join(ROOT, '_duplicate_cover_audit.json');
const SITE_ID = netlifySiteId() || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const DRY = process.argv.includes('--dry');
const LIMIT = (() => {
  const i = process.argv.indexOf('--limit');
  return i >= 0 ? parseInt(process.argv[i + 1], 10) : 0;
})();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

async function pingIndexNow(id) {
  try {
    const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }),
      signal: AbortSignal.timeout(12000),
    });
    return { ok: r.ok, status: r.status };
  } catch (e) {
    return { ok: false, error: String(e.message || e) };
  }
}

async function pickAlternateCover(title, id, avoidUrls, variantIndex) {
  const avoid = new Set([...avoidUrls].map(normalizeCoverUrl));
  const pre = prefixOf(id);
  const queries = [
    ...queryVariants(title, pre),
    `${title} stock photo ${variantIndex}`,
    `${title} editorial photo ${variantIndex}`,
    `${title} professional ${variantIndex}`,
  ].filter(Boolean);

  const seenQ = new Set();
  for (const q of queries) {
    if (!q || seenQ.has(q)) continue;
    seenQ.add(q);
    await ddgThrottle();
    const arr = await ddgImages(q);
    const start = Math.min(variantIndex, Math.max(0, arr.length - 1));
    for (let round = 0; round < arr.length; round++) {
      const idx = (start + round) % arr.length;
      const row = arr[idx];
      const img = row && (row.image || row);
      if (!img || typeof img !== 'string') continue;
      if (avoid.has(normalizeCoverUrl(img))) continue;
      if (!(await headOk(img))) continue;
      return { img, via: `ddg:${q}:${idx}` };
    }
  }

  const pollHint = `poll-dupfix-${id}-v${variantIndex}-${Date.now()}`;
  const poll = await pollinationsHostedImage(coverPrompt(`${title} variant ${variantIndex}`, pre), pollHint);
  if (poll && !avoid.has(normalizeCoverUrl(poll))) {
    return { img: poll, via: 'pollinations' };
  }

  const grokHint = `grok-dupfix-${id}-v${variantIndex}-${Date.now()}`;
  const grok = await grokHostImage(coverPrompt(`${title} alternate ${variantIndex}`, pre), grokHint);
  if (grok && !avoid.has(normalizeCoverUrl(grok))) {
    return { img: grok, via: 'grok' };
  }

  await ensureImagenProbed();
  const gem = await geminiCoverFor(`${title} unique cover ${variantIndex}`, `${id}-dup${variantIndex}`, {
    geminiOnly: true,
  });
  if (gem && !avoid.has(normalizeCoverUrl(gem))) {
    return { img: gem, via: 'gemini-image' };
  }

  return null;
}

function applyCover(body, title, newUrl) {
  const alt = String(title || '').replace(/[\[\]]/g, '').slice(0, 90);
  const lead = `![${alt}](${newUrl})\n\n`;
  return lead + stripLeadingImage(body).replace(/^\n+/, '');
}

(async () => {
  if (!fs.existsSync(AUDIT)) {
    console.error('Run _audit_duplicate_cover_images.js first');
    process.exit(1);
  }

  const audit = JSON.parse(fs.readFileSync(AUDIT, 'utf8'));
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
  const indexById = new Map((idx.entries || []).map((e) => [e.id, e]));

  const jobs = [];
  for (const g of audit.duplicateGroups || []) {
    const sharedUrl = g.sampleUrl || g.normalized;
    for (let i = 0; i < (g.toFix || []).length; i++) {
      jobs.push({
        id: g.toFix[i],
        sharedUrl,
        normalized: g.normalized,
        variantIndex: i + 1,
        keeper: g.keeper,
      });
    }
  }

  const total = LIMIT > 0 ? Math.min(LIMIT, jobs.length) : jobs.length;
  console.log(`Fix queue: ${jobs.length} entries${LIMIT ? ` (limit ${total})` : ''}${DRY ? ' [DRY]' : ''}`);

  const progress = createBatchProgressReporter({
    label: 'PULSE duplicate cover fix',
    total,
    interval: 10,
    pillarUrl: 'https://pulserevops.com/knowledge',
  });

  if (!DRY) await progress.start(`<p>Replacing duplicate cover images for ${total} entries.</p>`);

  const results = [];
  const failures = [];
  const usedUrls = new Set();
  let fixed = 0;

  for (let ji = 0; ji < total; ji++) {
    const job = jobs[ji];
    const row = indexById.get(job.id) || {};
    const blob = await store.get(`answers/${job.id}.json`, { type: 'json' }).catch(() => null);
    if (!blob || !blob.answer) {
      failures.push({ id: job.id, reason: 'no-blob' });
      if (!DRY) await progress.fail(`${job.id}: no blob`);
      continue;
    }

    const cur = leadingImageMatch(blob.answer);
    const oldUrl = cur ? cur[2] : job.sharedUrl;
    const oldNorm = normalizeCoverUrl(oldUrl);
    if (oldNorm !== job.normalized && oldNorm !== normalizeCoverUrl(job.sharedUrl)) {
      if (!DRY) await progress.skip(`${job.id}: already unique`);
      continue;
    }
    const title = row.question || blob.question || job.id;

    const avoid = new Set([job.sharedUrl, oldUrl, job.normalized]);
    for (const u of usedUrls) avoid.add(u);

    if (DRY) {
      console.log(`[dry] would fix ${job.id} (keeper ${job.keeper}) old=${oldUrl.slice(0, 80)}`);
      fixed++;
      continue;
    }

    let pick = null;
    for (let attempt = 0; attempt < 3 && !pick; attempt++) {
      pick = await pickAlternateCover(title, job.id, [...avoid], job.variantIndex + attempt);
      if (pick && avoid.has(normalizeCoverUrl(pick.img))) pick = null;
    }

    if (!pick || !pick.img) {
      failures.push({ id: job.id, reason: 'no-alternate-image', keeper: job.keeper, oldUrl });
      await progress.fail(`${job.id}: no alternate image`);
      continue;
    }

    const newBody = applyCover(blob.answer, title, pick.img);
    blob.answer = newBody;
    blob.ts = Date.now();
    blob.polished_at = Date.now();
    blob.cover_dupfix_at = new Date().toISOString();

    await store.setJSON(`answers/${job.id}.json`, blob);

    const i = (idx.entries || []).findIndex((e) => e && e.id === job.id);
    if (i >= 0) {
      idx.entries[i] = {
        ...idx.entries[i],
        was_indexed_at: new Date().toISOString(),
        cover_dupfix_at: blob.cover_dupfix_at,
      };
    }

    const ix = await pingIndexNow(job.id);
    usedUrls.add(pick.img);

    fixed++;
    results.push({
      id: job.id,
      keeper: job.keeper,
      oldUrl,
      newUrl: pick.img,
      via: pick.via,
      indexNow: ix,
    });

    console.log(`[${fixed}/${total}] ${job.id} via ${pick.via}`);
    await progress.tick(`${job.id} → ${pick.via}`);

    if (ji < total - 1) await sleep(Math.floor(DDG_DELAY_MS / 3));
  }

  if (!DRY && fixed > 0) {
    await store.setJSON('_index.json', idx);
    await progress.complete(`<p>Fixed <b>${fixed}</b> duplicate covers. Failed: <b>${failures.length}</b>.</p>`);
  }

  const outPath = path.join(ROOT, '_duplicate_cover_fix_results.json');
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        dry: DRY,
        totalJobs: jobs.length,
        processed: total,
        fixed,
        failed: failures.length,
        failures,
        sample: results.slice(0, 15),
        results,
      },
      null,
      2
    )
  );

  console.log(
    JSON.stringify({ fixed, failed: failures.length, dry: DRY, out: outPath }, null, 2)
  );
})().catch(async (e) => {
  console.error('FATAL', e && e.stack);
  try {
    const progress = createBatchProgressReporter({ label: 'PULSE duplicate cover fix' });
    await progress.error(String(e.message || e));
  } catch (_) {}
  process.exit(1);
});
