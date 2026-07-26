'use strict';
// Shared Pexels fetch + relevance gate for image-lead drip / white-purge.

const fs = require('fs');
const path = require('path');
const { pexelsRequest } = require('../../netlify/functions/lib/pexels-throttle');
const { deriveImageSearchQuery } = require('../../netlify/functions/lib/derive-image-search-query');
const { extractCoreTerms, gatePexels, simplifyQuery } = require('../../netlify/functions/lib/image-relevance-gate');

let storeGradedImage;
try {
  ({ storeGradedImage } = require('../../_ddg_facecard_lib'));
} catch (e) {
  storeGradedImage = null;
}

const PEXELS_KEY = process.env.PEXELS_API_KEY || process.env.Pexels_Api_Key || '';

async function pexelsSearchApplicable(title, destId, assetDir) {
  if (!PEXELS_KEY) throw new Error('PEXELS_API_KEY missing');
  if (!storeGradedImage) throw new Error('storeGradedImage unavailable');
  const dir = assetDir || path.join(process.cwd(), 'assets', 'qa');
  fs.mkdirSync(dir, { recursive: true });

  const query = deriveImageSearchQuery(title || destId);
  const core = extractCoreTerms(query);
  const tryQueries = [query, simplifyQuery(query)].filter((q, i, a) => q && a.indexOf(q) === i);
  const maxPages = 8;

  for (const q of tryQueries) {
    for (let page = 1; page <= maxPages; page++) {
      const got = await pexelsRequest(async () => {
        const url =
          'https://api.pexels.com/v1/search?per_page=1&page=' +
          page +
          '&orientation=landscape&query=' +
          encodeURIComponent(q);
        const res = await fetch(url, {
          headers: { Authorization: PEXELS_KEY, 'User-Agent': 'pulserevops-image-lead/1.0' },
          signal: AbortSignal.timeout(30000),
        });
        if (res.status !== 200) {
          return { miss: true, status: res.status };
        }
        const data = JSON.parse(Buffer.from(await res.arrayBuffer()).toString('utf8'));
        const photos = data.photos || [];
        const p = photos[0];
        if (!p) return { miss: true, exhausted: true };

        const gated = gatePexels(core, data.total_results || 0, photos);
        const landscapeOk = p.width >= 1200 && p.width >= p.height;
        if (!gated.pass && !(landscapeOk && page >= maxPages)) {
          return { miss: true, tryNextPage: true };
        }
        if (!landscapeOk && page < maxPages) return { miss: true, tryNextPage: true };

        const src = p.src && (p.src.large2x || p.src.large || p.src.original);
        if (!src) return { miss: true, tryNextPage: true };

        const dl = await fetch(src, { signal: AbortSignal.timeout(45000) });
        if (!dl.ok) return { miss: true, tryNextPage: true };
        const buf = Buffer.from(await dl.arrayBuffer());
        const dest = path.join(dir, destId + '.jpg');
        await storeGradedImage(buf, dest, {
          square: 760,
          faceCard: true,
          cropPosition: 'attention',
          bright: false,
        });
        return {
          ok: true,
          rel: '/assets/qa/' + destId + '.jpg',
          query: q,
          gated: !!gated.pass,
          alt: (p.alt || '').slice(0, 120),
          page,
        };
      });

      if (got && got.ok) {
        return { rel: got.rel, query: got.query, gated: got.gated, alt: got.alt, page: got.page };
      }
      if (got && got.exhausted) break;
    }
  }
  throw new Error('pexels applicable miss');
}

function nextQaSlotId(entryId, assetDir) {
  const dir = assetDir || path.join(process.cwd(), 'assets', 'qa');
  let max = 0;
  try {
    const re = new RegExp('^' + String(entryId).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '-(\\d+)\\.jpe?g$', 'i');
    for (const f of fs.readdirSync(dir)) {
      const m = f.match(re);
      if (m) max = Math.max(max, parseInt(m[1], 10) || 0);
    }
  } catch (e) {}
  return entryId + '-' + (max + 1);
}

function replaceImageUrlInBody(body, oldUrl, newRel) {
  let out = String(body || '');
  const norm = (u) => String(u || '').replace(/\?.*$/, '').trim();
  const variants = new Set([oldUrl, norm(oldUrl)]);
  const rel = String(oldUrl || '').replace(/^https?:\/\/(?:www\.)?pulserevops\.com/i, '');
  if (rel && rel !== oldUrl) variants.add(rel);
  for (const v of variants) {
    if (!v) continue;
    out = out.split('](' + v + ')').join('](' + newRel + ')');
    out = out.split('img="' + v + '"').join('img="' + newRel + '"');
  }
  return out;
}

module.exports = {
  pexelsSearchApplicable,
  nextQaSlotId,
  replaceImageUrlInBody,
};
