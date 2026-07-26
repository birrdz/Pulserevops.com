'use strict';
// Heuristic: does this image belong with the page/section topic?
// Used by the image-lead drip (white-purge) to catch spa-on-hotel, tribal-chief-on-CRO, etc.

const path = require('path');
const {
  extractCoreTerms,
  textMatchesCore,
  acceptTermsFor,
  SPA_NOISE,
  TRIBAL_CHIEF_NOISE,
  HOTEL_CORE,
  CRO_CORE,
} = (() => {
  const g = require('../../netlify/functions/lib/image-relevance-gate');
  // Re-export hard rejects if gate module doesn't export them — fall back to local copies
  return {
    extractCoreTerms: g.extractCoreTerms,
    textMatchesCore: g.textMatchesCore,
    acceptTermsFor: g.acceptTermsFor,
    SPA_NOISE: /\b(massage|spa|aromatherapy|facial|manicure|wellness.?center|hot.?stone|essential.?oil)\b/i,
    TRIBAL_CHIEF_NOISE:
      /\b(native american|american indian|tribal|tribe|headdress|war chief|indigenous chief|plains indian|pow.?wow)\b/i,
    HOTEL_CORE: new Set(['hotel', 'motel', 'inn', 'hospitality', 'franchise']),
    CRO_CORE: new Set(['cro', 'revenue', 'officer', 'fractional', 'executive', 'sales', 'pipeline']),
  };
})();
const { deriveImageSearchQuery } = require('../../netlify/functions/lib/derive-image-search-query');

function sectionTitleForUrl(body, url) {
  const lines = String(body || '').split('\n');
  const target = String(url || '').replace(/\?.*$/, '');
  let lastH = '(intro)';
  for (const line of lines) {
    const hm = line.match(/^#{2,3}\s+(.+?)\s*$/);
    if (hm) lastH = hm[1].replace(/[#*_`]/g, '').trim();
    if (target && line.includes(target)) return lastH;
  }
  return lastH;
}

function altForUrl(body, url) {
  const target = String(url || '').replace(/\?.*$/, '');
  for (const line of String(body || '').split('\n')) {
    const m = line.match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
    if (!m) continue;
    const u = String(m[2] || '').replace(/\?.*$/, '');
    if (u === target || u.endsWith(target) || target.endsWith(u)) return String(m[1] || '');
  }
  return '';
}

/**
 * @returns {{ offTopic: boolean, reason?: string, section?: string, alt?: string, core?: string[] }}
 */
function checkImageContext(url, body, pageTitle) {
  const section = sectionTitleForUrl(body, url);
  const alt = altForUrl(body, url);
  const base = path.basename(String(url || '').split('?')[0] || '');
  const topic = deriveImageSearchQuery(String(pageTitle || '') + ' ' + (section !== '(intro)' ? section : ''));
  const core = extractCoreTerms(topic);
  const hay = (alt + ' ' + base.replace(/[-_.]/g, ' ') + ' ' + section).toLowerCase();

  const hotelish = (core || []).some((t) => HOTEL_CORE.has(String(t).toLowerCase()));
  const croish = (core || []).some((t) => CRO_CORE.has(String(t).toLowerCase()));

  if (hotelish && SPA_NOISE.test(hay)) {
    return { offTopic: true, reason: 'spa-on-hotel', section, alt, core };
  }
  if (croish && TRIBAL_CHIEF_NOISE.test(hay)) {
    return { offTopic: true, reason: 'tribal-chief-on-cro', section, alt, core };
  }
  if (
    croish &&
    /\bchief\b/i.test(hay) &&
    !/\b(revenue|executive|officer|sales|business|ceo|cfo|fractional)\b/i.test(hay)
  ) {
    return { offTopic: true, reason: 'bare-chief-on-cro', section, alt, core };
  }

  // Soft gate: only when we have real alt text (filenames like se8-b2.jpg are not evidence)
  const altWords = String(alt || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, ' ')
    .trim();
  if (altWords.length >= 8 && core.length) {
    const accept = acceptTermsFor(core);
    if (!textMatchesCore(altWords, accept)) {
      return { offTopic: true, reason: 'alt-misses-core', section, alt, core };
    }
  }

  return { offTopic: false, section, alt, core };
}

module.exports = {
  checkImageContext,
  sectionTitleForUrl,
  altForUrl,
};
