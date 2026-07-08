// Shared media / image-placement law (scrubber + Pollinator overwrite).
const { isTop10Body } = require('./netlify/functions/lib/ensure-entry-images');

const MEDIA_MIN = 3;
const MEDIA_MAX = 10; // 1 hero + up to 9 section images
const MEDIA_SKIP_HEADING = /^#{2,3}\s+(FAQ|Sources|References|Related on PULSE)/i;

/** Major ## sections only (not ###), max 9 + hero = 10 counted. Top-10 skips sections. */
function ddgImageSectionTargets(lines, body) {
  if (body && isTop10Body(body)) return [];
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+\S/.test(lines[i]) && !MEDIA_SKIP_HEADING.test(lines[i])) out.push(i);
  }
  return out.slice(0, Math.max(0, MEDIA_MAX - 1));
}

function stripSectionLabel(h) {
  return String(h || '').replace(/^#{2,3}\s+/, '').replace(/^\d+\.\s*/, '').replace(/[^\w\s'-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function sectionCaption(title, sectLine) {
  return String(title).replace(/[\[\]"]/g, '').slice(0, 66) + ' — ' + String(sectLine).replace(/^#{2,3}\s+/, '').replace(/[\[\]"]/g, '').slice(0, 56);
}

function parseQaSlot(id, url) {
  if (!url) return null;
  const re = new RegExp('/assets/qa/' + String(id).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '-(\\d+)\\.jpg');
  const m = String(url).match(re);
  return m ? parseInt(m[1], 10) : null;
}

/** Flux default ti+2; DDG ti; preserve existing path slot when overwriting. */
function sectionFileSlot(id, ti, oldUrl) {
  const kept = parseQaSlot(id, oldUrl);
  if (kept != null) return kept;
  return process.env.INTERNAL_IMAGES_DDG === '1' ? ti : ti + 2;
}

function top10ProductSlot(id, idx, oldUrl) {
  const kept = parseQaSlot(id, oldUrl);
  if (kept != null) return kept;
  return 990 + parseInt(idx, 10);
}

function findSectionImageLine(lines, idx) {
  for (let j = idx + 1; j < lines.length; j++) {
    if (/^#{2,3}\s/.test(lines[j])) break;
    const m = lines[j].match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
    if (m) return { line: j, caption: m[1], url: m[2] };
  }
  return { line: -1, caption: '', url: '' };
}

module.exports = {
  MEDIA_MIN,
  MEDIA_MAX,
  MEDIA_SKIP_HEADING,
  ddgImageSectionTargets,
  stripSectionLabel,
  sectionCaption,
  parseQaSlot,
  sectionFileSlot,
  top10ProductSlot,
  findSectionImageLine,
  isTop10Body,
};
