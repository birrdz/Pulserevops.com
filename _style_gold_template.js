'use strict';
/**
 * Style golden template (goat #3) — outfit guides.
 * Spec: GOLDEN_TEMPLATE_STYLE.md · gold ref sy0001
 * Shape: cover + Direct Answer + For Men (3 ages) + For Women (3 ages) + FAQ + Sources
 */
const { isRankingListBody } = require('./_ranking_list_master_law');
const {
  GOLD_IMAGE_PROVIDER_LAW,
  auditLivePollinationsInBody,
  auditDirectAnswerNotBlank,
} = require('./_image_provider_alternate');

const STYLE_GOLD_ID = 'sy0001';
const STYLE_GOLD_URL = 'https://pulserevops.com/style/sy0001';

const WANT_AGES = ['20s', '40s', '60s'];

const STYLE_TEMPLATE_OUTLINE = [
  'GOLD REFERENCE: ' + STYLE_GOLD_URL + ' (id ' + STYLE_GOLD_ID + ')',
  '',
  'READING ORDER:',
  '1. Title (H1 from question)',
  '2. Cover image ![…](/assets/qa/…) — Style ALLOWED before Direct Answer',
  '3. ## Direct Answer — gold box at render; never blank',
  '4. ## For Men — intro + 3 ```outfit blocks (20s / 40s / 60s)',
  '5. ## For Women — intro + 3 ```outfit blocks (20s / 40s / 60s)',
  '6. Optional ## How to Adapt by Age / ## Common Mistakes',
  '7. ## FAQ (≥4)',
  '8. ## Sources (≥4)',
  '9. ## Related on PULSE',
  '',
  'Each outfit: gender, age, title, occasion, budget, img (self-hosted), 4–6 garment lines',
  '',
  GOLD_IMAGE_PROVIDER_LAW,
  '',
  'NEVER: @@PRODUCT · TL;DR · CRO in blob · live pollinations · missing age band · blank img on certify',
  'ALWAYS: exactly 6 outfits · Men×3 + Women×3 · ages 20s/40s/60s · ≥900 words',
].join('\n');

function parseOutfitBlocks(body) {
  const re = /```outfit\r?\n([\s\S]*?)```/g;
  const out = [];
  let m;
  while ((m = re.exec(String(body || '')))) {
    const inner = m[1];
    const meta = {};
    for (const s of inner.split(/\r?\n/)) {
      const kv = s.match(/^(gender|age|img|title|occasion|budget):\s*(.*)$/i);
      if (kv) meta[kv[1].toLowerCase()] = kv[2].trim();
    }
    const isWomen = /women|female|ladies/i.test(meta.gender || '');
    const isMen = /men|male|guys/i.test(meta.gender || '') && !isWomen;
    const ageM = (meta.age || '').match(/(\d{2})\s*s?/i);
    const age = ageM ? ageM[1] + 's' : '';
    const img = (meta.img || '').trim();
    out.push({
      gender: isWomen ? 'women' : isMen ? 'men' : 'other',
      age,
      img,
      title: meta.title || '',
    });
  }
  return out;
}

function titleSuggestsStyleOutfit(title) {
  return /what\s+to\s+wear|outfit|dress\s*code|what\s+does\s+.+\s+(mean|look\s+like)/i.test(
    String(title || '')
  );
}

function appliesStyleGold(id, body, opts) {
  opts = opts || {};
  const entryId = String(id || '').toLowerCase();
  const b = String(body || '');
  const t = opts.title != null ? String(opts.title) : '';
  if (isRankingListBody(b, t)) return false;
  if (/^sy\d+/i.test(entryId) && !isRankingListBody(b, t)) return true;
  const blocks = parseOutfitBlocks(b);
  if (blocks.length >= 6) {
    const men = blocks.filter((x) => x.gender === 'men').length;
    const women = blocks.filter((x) => x.gender === 'women').length;
    if (men >= 3 && women >= 3) return true;
  }
  if (titleSuggestsStyleOutfit(t) && /```outfit/i.test(b)) return true;
  return false;
}

function auditStyleGoldTemplate(body, opts) {
  opts = opts || {};
  const b = String(body || '');
  const issues = [];
  const blocks = parseOutfitBlocks(b);

  const daFail = auditDirectAnswerNotBlank(b);
  if (Array.isArray(daFail) ? daFail.length : daFail && !daFail.ok) {
    issues.push('direct_answer_blank');
  }

  if (!/^##\s+Direct\s+Answer\b/im.test(b)) issues.push('missing_direct_answer_h2');
  if (!/^##\s+For\s+Men\b/im.test(b)) issues.push('missing_for_men');
  if (!/^##\s+For\s+Women\b/im.test(b)) issues.push('missing_for_women');
  if (!/^##\s+FAQ\b/im.test(b)) issues.push('missing_faq');
  if (!/^##\s+(?:Sources|References)\b/im.test(b)) issues.push('missing_sources');
  if (!/^##\s+Related\s+on\s+PULSE\b/im.test(b)) issues.push('missing_related');

  if (blocks.length !== 6) issues.push('outfit_count_' + blocks.length + '_want_6');

  const menAges = new Set(
    blocks.filter((x) => x.gender === 'men').map((x) => x.age).filter(Boolean)
  );
  const womenAges = new Set(
    blocks.filter((x) => x.gender === 'women').map((x) => x.age).filter(Boolean)
  );
  for (const a of WANT_AGES) {
    if (!menAges.has(a)) issues.push('missing_men_' + a);
    if (!womenAges.has(a)) issues.push('missing_women_' + a);
  }

  let missingImg = 0;
  for (const bl of blocks) {
    if (!bl.img || /placeholder|example\.com|pollinations\.ai\/prompt/i.test(bl.img)) missingImg++;
  }
  if (missingImg) issues.push('outfit_img_gaps_' + missingImg);

  const poll = auditLivePollinationsInBody(b);
  if (poll && poll.bad) issues.push('live_pollinations');

  if (/@@PRODUCT/i.test(b)) issues.push('product_markers_on_style');
  if (/^##\s*TL;?DR/im.test(b) || /\bTL;?DR\b/i.test(b.slice(0, 400))) issues.push('tldr');

  const words = b.replace(/\s+/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  if (words < 900) issues.push('words_below_900');

  // Cover: image near top (Style allows before DA)
  const beforeDa = b.split(/^##\s+Direct\s+Answer\b/im)[0] || '';
  if (!/!\[[^\]]*\]\([^)]+\)/.test(beforeDa) && !/!\[[^\]]*\]\([^)]+\)/.test(b.slice(0, 800))) {
    issues.push('missing_cover');
  }

  if (/!\[[^\]]*\]\([^)]+\)\s*\n\s*!\[[^\]]*\]\([^)]+\)/m.test(b)) {
    issues.push('stacked_images');
  }

  return {
    compliant: issues.length === 0,
    issues,
    goldId: STYLE_GOLD_ID,
    goldUrl: STYLE_GOLD_URL,
    blocks: blocks.length,
    words,
  };
}

module.exports = {
  STYLE_GOLD_ID,
  STYLE_GOLD_URL,
  STYLE_TEMPLATE_OUTLINE,
  WANT_AGES,
  parseOutfitBlocks,
  titleSuggestsStyleOutfit,
  appliesStyleGold,
  auditStyleGoldTemplate,
};
