// Compare _cro_fractional_100_keywords vs _cro_seo_keywords + static CRO pages.
const fs = require('fs');
const path = require('path');
const { FRACTIONAL_CRO_100, CRO_SYNDICATE_TEAM_EXTRA } = require('./_cro_fractional_100_keywords');
const { CRO_LANDSCAPE_ALL } = require('./_cro_competitive_landscape_keywords');
const { CORE_CRO_SLUGS, CRO_DISPLAY_KEYWORDS, CRO_STATIC_PAGES } = require('./_cro_seo_keywords');

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function metaKeywords(file) {
  const html = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const m = html.match(/<meta name="keywords" content="([^"]+)"/i);
  return m ? m[1].toLowerCase() : '';
}

const all = [...FRACTIONAL_CRO_100, ...CRO_SYNDICATE_TEAM_EXTRA, ...CRO_LANDSCAPE_ALL];
const slugSet = new Set(CORE_CRO_SLUGS);
const displaySet = new Set(CRO_DISPLAY_KEYWORDS.map((s) => s.toLowerCase()));

const pages = Object.fromEntries(
  CRO_STATIC_PAGES.map((file) => [file, metaKeywords(file)])
);

const missingSlug = [];
const missingDisplay = [];
const missingByPage = {};

for (const [page, meta] of Object.entries(pages)) {
  missingByPage[page] = [];
}

for (const kw of all) {
  const sl = slugify(kw);
  if (!slugSet.has(sl)) missingSlug.push(kw);
  if (!displaySet.has(kw.toLowerCase())) missingDisplay.push(kw);
  for (const [page, meta] of Object.entries(pages)) {
    if (!meta.includes(kw.toLowerCase())) missingByPage[page].push(kw);
  }
}

console.log(
  JSON.stringify(
    {
      totalKeywords: all.length,
      missingFromCoreSlugs: missingSlug.length,
      missingFromCroDisplayKeywords: missingDisplay.length,
      missingSlug,
      missingDisplay,
      missingByPage: Object.fromEntries(
        Object.entries(missingByPage).map(([k, v]) => [k, { count: v.length, keywords: v }])
      ),
    },
    null,
    2
  )
);
