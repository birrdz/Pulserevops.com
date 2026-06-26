// Append missing CRO keywords to static pages + sync Netlify function lib.
// Usage: node _cro_seo_sync_static.js
const fs = require('fs');
const path = require('path');
const { FRACTIONAL_CRO_100, CRO_SYNDICATE_TEAM_EXTRA } = require('./_cro_fractional_100_keywords');
const { ALL_CRO_PHRASES, CRO_STATIC_PAGES, loadExtendedKeywords } = require('./_cro_seo_keywords');
const { CRO_LANDSCAPE_ALL } = require('./_cro_competitive_landscape_keywords');

const ROOT = __dirname;
const PAGES = CRO_STATIC_PAGES;
function readMetaKeywords(html) {
  const m = html.match(/<meta name="keywords" content="([^"]+)"/i);
  if (!m) return [];
  return m[1].split(',').map((s) => s.trim()).filter(Boolean);
}

/** Union keywords already on any CRO page + master phrase lists */
function buildKeywordUnion() {
  const seen = new Set();
  const out = [];
  const add = (kw) => {
    const k = String(kw).trim();
    if (!k) return;
    const low = k.toLowerCase();
    if (seen.has(low)) return;
    seen.add(low);
    out.push(k);
  };
  for (const file of PAGES) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) continue;
    readMetaKeywords(fs.readFileSync(p, 'utf8')).forEach(add);
  }
  [...ALL_CRO_PHRASES, ...CRO_LANDSCAPE_ALL, ...loadExtendedKeywords()].forEach(add);
  return out;
}

const KEYWORD_PHRASES = buildKeywordUnion();

function appendMetaKeywords(html, phrases) {
  return html.replace(
    /(<meta name="keywords" content=")([^"]*)(" *\/>)/i,
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
        if (!k) continue;
        if (!existing.has(k.toLowerCase())) {
          added.push(k);
          existing.add(k.toLowerCase());
        }
      }
      if (!added.length) return full;
      const sep = content.trim().endsWith(',') || !content.trim() ? ' ' : ', ';
      return `${pre}${content}${sep}${added.join(', ')}${post}`;
    }
  );
}

const report = { pages: {}, lib: null };

for (const file of PAGES) {
  const p = path.join(ROOT, file);
  const before = fs.readFileSync(p, 'utf8');
  const after = appendMetaKeywords(before, KEYWORD_PHRASES);
  if (after !== before) fs.writeFileSync(p, after);
  const m = after.match(/<meta name="keywords" content="([^"]+)"/i);
  report.pages[file] = {
    updated: after !== before,
    metaLen: m ? m[1].length : 0,
  };
}

const libPath = path.join(ROOT, 'netlify', 'functions', 'lib', 'cro-seo-keywords.js');
const libBody = `// CRO brand keywords for pulse-machine-entry — synced from _cro_fractional_100_keywords.js
// Regenerate: node _cro_seo_sync_static.js
'use strict';

const CRO_BRAND_KEYWORDS = ${JSON.stringify(KEYWORD_PHRASES, null, 2)};

module.exports = { CRO_BRAND_KEYWORDS };
`;
fs.writeFileSync(libPath, libBody);
report.lib = { path: libPath, count: KEYWORD_PHRASES.length };

fs.writeFileSync(path.join(ROOT, '_cro_seo_sync_report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
