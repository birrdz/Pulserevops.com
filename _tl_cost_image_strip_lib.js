/**
 * Shared classifier/stripper for CRO Pulse Tools money/cost graph images.
 * No LLM. Used by bulk runner + finish drip.
 */
'use strict';

function safeDecode(s) {
  try {
    return decodeURIComponent(String(s).replace(/\+/g, ' '));
  } catch {
    return String(s).replace(/%20/g, ' ').replace(/\+/g, ' ');
  }
}

/** Return why this markdown image is a cost/money graph, or null to keep. */
function classifyCostImg(img) {
  const u = (img.match(/\(([^)]+)\)/) || [])[1] || '';
  const alt = (img.match(/!\[([^\]]*)\]/) || [])[1] || '';
  const blob = safeDecode(alt + ' ' + u).toLowerCase();

  if (/cro-cover-4\.(jpg|png|webp)/i.test(u)) return 'cro-cover-4';
  if (/cro-cover-5\.(jpg|png|webp)/i.test(u)) return 'cro-cover-5';
  if (/fractional-cro-roi-comparison/i.test(u)) return 'roi-comparison-asset';

  // Live pollinations cost / frac-vs-FT / pricing prompts
  if (/pollinations\.ai\/prompt\//i.test(u)) {
    if (
      /(real\s*cost|cost\s*breakdown|cost\s*of\s*a\s*frac|how\s*much\s*(does|is)|pricing|salary|compensation\s*plan|fractional\s*vs\.?\s*full|full[- ]?time\s*vs\.?\s*frac|compare:\s*fractional|what\s*you\s*(actually\s*)?get\s*for|roi\s*(should|expect|comparison)|worth\s*it\s*for)/i.test(
        blob
      )
    ) {
      return 'pollinations-cost';
    }
    if (/fractional\s*cro\s*vs\.?\s*full/i.test(blob)) return 'pollinations-frac-vs-ft';
  }

  // Self-hosted / pool assets whose ALT is explicitly a cost/ROI money graph
  if (
    /\/assets\//i.test(u) &&
    /(the\s*cost\s*of\s*a\s*fractional|cost\s*of\s*a\s*fractional\s*cro\s*vs|fractional\s*cro\s*vs\.?\s*full[- ]?time|roi\s*comparison|real\s*cost|cost\s*breakdown|how\s*much\s*does\s*a\s*fractional)/i.test(
      blob
    )
  ) {
    return 'asset-cost-alt';
  }

  // Hotlinked external "how much / cost / ROI" money images (cdn/shop, cloudzero, etc.)
  if (
    /^https?:\/\//i.test(u) &&
    !/pulserevops\.com\//i.test(u) &&
    !/pollinations\.ai\//i.test(u) &&
    /(how\s*much\s*does\s*a\s*fractional|cost\s*of\s*a\s*fractional|fractional\s*cro\s*vs\.?\s*full|roi\s*(comparison|expect|should)|real\s*cost|cost\s*breakdown|compensation\s*plan|pricing\s*for\s*a\s*fractional)/i.test(
      blob
    )
  ) {
    return 'hotlink-cost';
  }

  // Explicit cro-cover money slots still leftover
  if (/cro-cover-[45]\.(jpg|png|webp)/i.test(u)) return 'cro-cover-45';

  return null;
}

function stripCostImages(answer) {
  const removed = [];
  let next = String(answer || '').replace(/!\[[^\]]*\]\([^)]+\)/g, (img) => {
    const why = classifyCostImg(img);
    if (!why) return img;
    removed.push(why);
    return '';
  });
  next = next.replace(/([^\n])\n{3,}/g, '$1\n\n').replace(/\n{3,}/g, '\n\n');
  return { next, removed };
}

function coverNeedsCostStrip(entry) {
  const hit = {};
  for (const f of ['img', 'cover', 'face_path']) {
    const v = String((entry && entry[f]) || '');
    if (/cro-cover-4/i.test(v) || /cro-cover-5/i.test(v) || /fractional-cro-roi-comparison/i.test(v)) {
      hit[f] = v;
    }
  }
  return hit;
}

module.exports = {
  classifyCostImg,
  stripCostImages,
  coverNeedsCostStrip,
  SAFE_COVER: 'https://pulserevops.com/assets/cro-cover-8.jpg',
};
