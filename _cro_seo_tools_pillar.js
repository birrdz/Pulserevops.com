// Apply ALL fractional CRO / GTM / RevOps SEO keywords to every Pulse Tools (tl####) entry.
// Usage:
//   node _cro_seo_tools_pillar.js              # tag blobs + IndexNow batch
//   node _cro_seo_tools_pillar.js --dry-run
//   node _cro_seo_tools_pillar.js --skip-index # blob tags only
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { tagsForEntry, CRO_STATIC_URLS } = require('./_cro_seo_keywords');
const { CRO_BRAND_KEYWORDS } = require('./netlify/functions/lib/cro-seo-keywords');
const {
  pingIndexNowUrlList,
} = require('./netlify/functions/lib/indexnow-ping-entry');
const { libraryEntryPublicUrl } = require('./netlify/functions/lib/library-entry-url');

try {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN;
const DRY = process.argv.includes('--dry-run');
const SKIP_INDEX = process.argv.includes('--skip-index');
const TOOLS_HUB = 'https://pulserevops.com/tools';
const REPORT = path.join(__dirname, '_cro_seo_tools_pillar_report.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function appendMetaKeywords(html, phrases) {
  return html.replace(
    /(<meta name="keywords" content=")([^"]*)(" *\/?>)/i,
    (full, pre, content, post) => {
      const existing = new Set(
        content
          .split(',')
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      );
      const added = [];
      for (const kw of phrases) {
        const k = String(kw).trim();
        if (!k || existing.has(k.toLowerCase())) continue;
        added.push(k);
        existing.add(k.toLowerCase());
      }
      if (!added.length) return full;
      const sep = content.trim().endsWith(',') || !content.trim() ? ' ' : ', ';
      return `${pre}${content}${sep}${added.join(', ')}${post}`;
    }
  );
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const tlRows = (idx.entries || []).filter((e) => e && /^tl\d+$/i.test(e.id));
  tlRows.sort((a, b) => parseInt(a.id.slice(2), 10) - parseInt(b.id.slice(2), 10));

  const brandKeywords = CRO_BRAND_KEYWORDS.slice();
  const stats = { total: tlRows.length, updated: 0, skipped: 0, indexUrls: [] };

  for (const row of tlRows) {
    const entry = await store.get(`answers/${row.id}.json`, { type: 'json' });
    if (!entry) {
      stats.skipped++;
      continue;
    }

    const baseTags = Array.isArray(entry.tags) ? entry.tags : Array.isArray(row.tags) ? row.tags : [];
    const newTags = tagsForEntry(row.question || entry.question, baseTags, 'cro');
    if (!newTags.includes('pulse-tools')) newTags.push('pulse-tools');

    const changed =
      JSON.stringify(newTags) !== JSON.stringify(entry.tags || []) ||
      entry.seo_cro_tier !== 'cro' ||
      JSON.stringify(entry.seo_brand_keywords || []) !== JSON.stringify(brandKeywords);

    if (!DRY && changed) {
      const now = Date.now();
      await store.setJSON(`answers/${row.id}.json`, {
        ...entry,
        tags: newTags,
        seo_cro_tier: 'cro',
        seo_brand_keywords: brandKeywords,
        seo_tools_pillar_at: now,
        seo_cro_optimized_at: now,
      });
      const i = idx.entries.findIndex((e) => e && e.id === row.id);
      if (i >= 0) {
        idx.entries[i] = {
          ...idx.entries[i],
          tags: newTags,
          seo_cro_tier: 'cro',
          seo_tools_pillar_at: now,
          seo_cro_optimized_at: now,
        };
      }
      stats.updated++;
    }

    const url = libraryEntryPublicUrl({ ...row, tags: newTags });
    if (url) {
      stats.indexUrls.push(url);
      stats.indexUrls.push(url + '/reviews');
    }

    if ((stats.updated + stats.skipped) % 50 === 0) {
      console.log(`… processed ${stats.updated + stats.skipped}/${stats.total}`);
    }
  }

  if (!DRY) await store.setJSON('_index.json', idx);

  // Pulse Tools hub page — append CRO keywords locally
  const toolsHtmlPath = path.join(__dirname, 'tools.html');
  if (fs.existsSync(toolsHtmlPath) && !DRY) {
    const before = fs.readFileSync(toolsHtmlPath, 'utf8');
    const after = appendMetaKeywords(before, brandKeywords);
    if (after !== before) fs.writeFileSync(toolsHtmlPath, after);
  }

  let indexBatches = [];
  if (!DRY && !SKIP_INDEX) {
    const allUrls = [TOOLS_HUB, ...CRO_STATIC_URLS, ...stats.indexUrls];
    const chunkSize = 500;
    for (let i = 0; i < allUrls.length; i += chunkSize) {
      const chunk = allUrls.slice(i, i + chunkSize);
      const ping = await pingIndexNowUrlList(chunk);
      indexBatches.push({ offset: i, count: chunk.length, ping });
      console.log(`IndexNow batch ${i / chunkSize + 1}: ${JSON.stringify(ping.pings)}`);
      await sleep(2000);
    }
    const ts = Date.now();
    for (const row of tlRows) {
      const i = idx.entries.findIndex((e) => e && e.id === row.id);
      if (i >= 0) idx.entries[i] = { ...idx.entries[i], was_indexed_at: ts };
    }
    await store.setJSON('_index.json', idx);
  }

  const report = {
    ok: true,
    dryRun: DRY,
    skipIndex: SKIP_INDEX,
    stats,
    keywordCount: brandKeywords.length,
    indexBatches,
    toolsHub: TOOLS_HUB,
  };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch((e) => {
  console.error('ERR', e && e.message);
  process.exit(1);
});
