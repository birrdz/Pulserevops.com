// Occasional section images for non-ranking Q&A answers (no top hero, 3–5 imgs spaced through text).
// Legacy path: searchRealPhoto only. Gold Q&A image fill uses fillEntryMissingImages + pickMatchingLibraryImage (allowTopicalReuse).
const { searchRealPhoto } = require('./netlify/functions/lib/img-search-lib');
const { sectionImageSearchQuery } = require('./netlify/functions/lib/entry-image-query');
const { prefixOf } = require('./netlify/functions/lib/img-cover-lib');
const { titleSuggestsRankingList, isRankingListBody, stripRankingHeroMarkdown, rankingListHasTopHero } = require('./_ranking_list_master_law');

const FORMAT_V_ESSAY = '2026-07-answer-occasional-imgs';
const SKIP_HEADING = /^#{2,3}\s+(?:Direct\s+Answer|FAQ|Sources|References|Related|Bottom\s+Line|How\s+We\s+Ranked|TL;DR|Frequently|How\s+to\s+Choose|What\s+to\s+Look\s+For)/i;

function isEssayEntry(body, title) {
  if (titleSuggestsRankingList(title)) return false;
  if (isRankingListBody(body, title)) return false;
  const pre = (String(title || '').match(/^[a-z]+/) || [''])[0];
  if (pre === 'ce') return false;
  return true;
}

function countInlineImages(body) {
  return (String(body || '').match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
}

function stripAllInlineImages(body) {
  return String(body || '')
    .split('\n')
    .filter(l => !/^!\[[^\]]*\]\([^)]+\)\s*$/.test(l.trim()))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function occasionalImageTargets(lines) {
  const h2 = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!/^##\s+\S/.test(line)) continue;
    if (SKIP_HEADING.test(line)) continue;
    if (/^##\s+\d+\.\s/.test(line)) continue;
    h2.push(i);
  }
  if (!h2.length) return [];
  if (h2.length <= 3) return h2;
  const step = Math.max(2, Math.ceil(h2.length / 4));
  const out = [];
  for (let i = 0; i < h2.length; i += step) out.push(h2[i]);
  return out.slice(0, 5);
}

function sectionHasImage(lines, headingIdx) {
  for (let j = headingIdx + 1; j < lines.length; j++) {
    if (/^#{1,3}\s/.test(lines[j])) break;
    if (/!\[[^\]]*\]\([^)]+\)/.test(lines[j])) return true;
  }
  return false;
}

async function fetchSectionImage(heading, title, id, seen) {
  const q = sectionImageSearchQuery(title, String(heading || '').replace(/^#{2,3}\s+/, '').replace(/[\[\]"]/g, '').trim());
  const pre = prefixOf(id);
  const suffix = pre === 'sw' || pre === 'tk' ? 'software product screenshot' : pre === 'aq' ? 'aquarium photo' : 'photo';
  for (let t = 0; t < 6; t++) {
    const pick = await searchRealPhoto(q, id, { suffix, salt: t + '-' + q.slice(0, 20), skipRefine: t > 2 });
    if (!pick || !pick.img || seen.has(pick.img)) continue;
    return pick.img;
  }
  return '';
}

function needsEssayImagesFix(id, body, title, entry) {
  if (!isEssayEntry(body, title)) return false;
  if (rankingListHasTopHero(body)) return true;
  if (entry && entry.cover_src && entry.cover_src !== 'no-hero') return true;
  if (entry && entry.format_v === FORMAT_V_ESSAY && countInlineImages(body) >= 3) return false;
  const n = countInlineImages(body);
  if (n < 3) return true;
  return entry && entry.format_v !== FORMAT_V_ESSAY;
}

async function rebuildEssayOccasionalImages(id, title, body, opts) {
  opts = opts || {};
  let b = stripRankingHeroMarkdown(stripAllInlineImages(body));
  let lines = b.split('\n');
  let targets = occasionalImageTargets(lines);

  if (!targets.length) {
    const h1 = lines.findIndex(l => /^##\s+\S/.test(l) && !SKIP_HEADING.test(l) && !/^##\s+\d+\./.test(l));
    if (h1 >= 0) targets = [h1];
  }

  const seen = new Set();
  const inserts = [];
  for (const idx of targets) {
    if (sectionHasImage(lines, idx)) continue;
    const heading = lines[idx];
    if (opts.onProgress) opts.onProgress({ kind: 'section', heading: heading.slice(0, 40) });
    const url = await fetchSectionImage(heading, title, id, seen);
    if (!url) continue;
    seen.add(url);
    const cap = heading.replace(/^#{2,3}\s+/, '').slice(0, 80);
    inserts.push({ idx, line: '![' + cap + '](' + url + ')' });
  }
  inserts.sort((a, b) => b.idx - a.idx).forEach(p => {
    lines.splice(p.idx + 1, 0, '', p.line, '');
  });

  b = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  const n = countInlineImages(b);
  if (n < 2) {
    throw new Error('Could not place enough section images (' + n + ')');
  }
  return b;
}

module.exports = {
  FORMAT_V_ESSAY,
  isEssayEntry,
  needsEssayImagesFix,
  rebuildEssayOccasionalImages,
  countInlineImages,
  occasionalImageTargets,
};
