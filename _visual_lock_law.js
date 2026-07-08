// _visual_lock_law.js — DeepSeek / writer visual lock (owner 2026-07-06).
// Writers fix TEXT ONLY. Images: swap one applicable image for another at an existing slot —
// never add, remove, reorder, or stack. Layout/CSS/render is renderer-owned (pulse-tan.css).

/** Append to every DeepSeek system prompt for content stations. */
const VISUAL_LOCK_DS_SYSTEM_SNIPPET =
  'VISUAL LOCK (mandatory): You may change prose, headings, FAQ, Sources, and mermaid CODE only. ' +
  'Do NOT add, remove, move, or edit any image markdown (![...](...)), @@PRODUCT lines, HTML, <aside>, ' +
  'inline styles, CRO cards, or layout. Never place two images back-to-back — text must sit between images. ' +
  'Never invent image URLs. Image swaps are handled by a separate image pipeline, not by you.';

/** Sitewide image render law — desktop + mobile (assets/pulse-tan.css). */
const VISUAL_LOCK_IMAGE_RENDER_LAW =
  'All images use real <img> tags at render; max-width:100%; height:auto; width:100% on entry figures. ' +
  'Self-hosted /assets/qa paths only in blobs. DDG↔Pollinator alternation · 15s floor.';

function isImageLine(line) {
  const t = String(line || '').trim();
  return /^!\[[^\]]*\]\([^)]+\)/.test(t) || /^@@PRODUCT\b/.test(t);
}

function collectImageLines(body) {
  return String(body || '').split('\n').filter(isImageLine);
}

/** Drop consecutive image lines globally — never two images stacked without text between. */
function collapseConsecutiveImages(body) {
  const lines = String(body || '').split('\n');
  const out = [];
  let prevImg = false;
  for (const line of lines) {
    const trimmed = String(line || '').trim();
    if (!trimmed) {
      if (prevImg) continue;
      out.push(line);
      continue;
    }
    const isImg = isImageLine(line);
    if (isImg && prevImg) continue;
    out.push(line);
    prevImg = isImg;
  }
  return out.join('\n');
}

/** Remove image lines that appear before ## Direct Answer (Q&A gold — no top hero). */
function stripImagesBeforeDirectAnswer(body) {
  const lines = String(body || '').split('\n');
  const daIdx = lines.findIndex((l) => /^##\s+Direct\s+Answer\b/i.test(l.trim()));
  if (daIdx < 0) return String(body || '');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (i < daIdx && isImageLine(lines[i])) continue;
    out.push(lines[i]);
  }
  return out.join('\n');
}

/** Strip HTML blocks, baked CRO, and live pollinations URLs writers must not touch. */
function stripDsVisualArtifacts(body) {
  let b = String(body || '');
  try {
    const { stripAllCroFromBody } = require('./_cro_strip_lib');
    b = stripAllCroFromBody(b);
  } catch (e) {}
  b = b.replace(/<aside[\s\S]*?<\/aside>/gi, '');
  b = b.replace(/<div[^>]*class=["'][^"']*cro[^"']*["'][\s\S]*?<\/div>/gi, '');
  b = b.replace(/<style[\s\S]*?<\/style>/gi, '');
  b = b.replace(/<figure[\s\S]*?<\/figure>/gi, (blk) => {
    const m = blk.match(/!\[[^\]]*\]\([^)]+\)/);
    return m ? m[0] : '';
  });
  b = b.split('\n').filter((line) => {
    const m = line.match(/!\[[^\]]*\]\(([^)\s]+)\)/);
    if (!m) return true;
    const url = m[1];
    if (/pollinations\.ai/i.test(url) && !/^\/assets\//.test(url)) return false;
    return true;
  }).join('\n');
  return b;
}

/**
 * Restore original image / @@PRODUCT lines at writer positions.
 * DS cannot add images (extras dropped), remove images (missing re-inserted before FAQ), or change URLs.
 */
function preserveImages(originalBody, newBody) {
  const origImgs = collectImageLines(originalBody);
  const lines = String(newBody || '').split('\n');
  if (!origImgs.length) {
    return lines.filter((l) => !isImageLine(l)).join('\n');
  }
  let i = 0;
  const out = [];
  for (const line of lines) {
    if (!isImageLine(line)) {
      out.push(line);
      continue;
    }
    if (i < origImgs.length) {
      out.push(origImgs[i++]);
      continue;
    }
    // DS added extra image line — drop it
  }
  if (i < origImgs.length) {
    const missing = origImgs.slice(i);
    const faqIdx = out.findIndex((l) => /^##\s+(FAQ|Frequently\s+Asked)/i.test(l.trim()));
    if (faqIdx >= 0) out.splice(faqIdx, 0, '', ...missing, '');
    else out.push('', ...missing, '');
  }
  return out.join('\n');
}

/**
 * Full writer visual lock after any DeepSeek or format pass.
 * opts.qaGold + opts.id → also enforce Q&A gold body shape (no top hero, DA first).
 */
function enforceWriterVisualLock(originalBody, body, opts) {
  opts = opts || {};
  let b = preserveImages(originalBody, body);
  b = stripDsVisualArtifacts(b);
  b = collapseConsecutiveImages(b);
  if (opts.qaGold && opts.id) {
    try {
      const { appliesQaGold, ensureQaGoldBodyShape } = require('./_qa_gold_template');
      if (appliesQaGold(opts.id, b, { title: opts.title })) {
        b = stripImagesBeforeDirectAnswer(b);
        b = ensureQaGoldBodyShape(b);
        b = collapseConsecutiveImages(b);
      }
    } catch (e) {}
  }
  return b.replace(/\n{3,}/g, '\n\n').trim();
}

/** Post-shape lock for Q&A entries after image pipeline may have swapped URLs in place. */
function lockQaVisualShape(body, id, title) {
  let b = String(body || '');
  try {
    const { appliesQaGold, ensureQaGoldBodyShape } = require('./_qa_gold_template');
    if (!appliesQaGold(id, b, { title })) return b;
    b = stripDsVisualArtifacts(b);
    b = stripImagesBeforeDirectAnswer(b);
    b = ensureQaGoldBodyShape(b);
    b = collapseConsecutiveImages(b);
  } catch (e) {}
  return b.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Image pipeline may only swap URLs at existing slots (same image line count).
 * Returns candidate body with URLs merged into original positions when counts match.
 */
function applyImageSwapOnly(originalBody, candidateBody) {
  const origLines = collectImageLines(originalBody);
  const candLines = collectImageLines(candidateBody);
  if (!origLines.length) return String(candidateBody || '');
  if (origLines.length !== candLines.length) {
    return preserveImages(originalBody, candidateBody);
  }
  let ci = 0;
  const out = String(candidateBody || '').split('\n').map((line) => {
    if (!isImageLine(line)) return line;
    const cand = candLines[ci++];
    const orig = origLines[ci - 1];
    const origUrl = (orig.match(/\(([^)]+)\)/) || [])[1];
    const candUrl = (cand.match(/\(([^)]+)\)/) || [])[1];
    if (candUrl && candUrl !== origUrl) return cand;
    return orig;
  });
  return out.join('\n');
}

module.exports = {
  VISUAL_LOCK_DS_SYSTEM_SNIPPET,
  VISUAL_LOCK_IMAGE_RENDER_LAW,
  isImageLine,
  collectImageLines,
  collapseConsecutiveImages,
  stripImagesBeforeDirectAnswer,
  stripDsVisualArtifacts,
  preserveImages,
  enforceWriterVisualLock,
  lockQaVisualShape,
  applyImageSwapOnly,
};
