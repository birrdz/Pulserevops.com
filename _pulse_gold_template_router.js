// Routes each entry to the correct immutable GOLD template by title + body shape.
// Top 10: aq1158 — https://pulserevops.com/aquariums/aq1158
// Q&A:    q11133 — https://pulserevops.com/knowledge/q11133
// 🔒 Image/provider law LOCKED (2026-07-06): DDG↔Pollinator alternation, 20s cooldown, self-hosted paths only — _image_provider_alternate.js

const {
  titleSuggestsRankingList,
  isRankingListBody,
} = require('./_ranking_list_master_law');
const {
  TOP10_GOLD_ID,
  TOP10_GOLD_URL,
  appliesTop10Gold,
  GOLD_IMAGE_PROVIDER_LAW,
} = require('./_ranking_top10_gold_template');
const {
  QA_GOLD_ID,
  QA_GOLD_URL,
  appliesQaGold,
} = require('./_qa_gold_template');

/**
 * Dual-pillar rule: BOTH title signal AND body ranking markers required for Top 10.
 * A title with "best" alone must NOT force Top 10 when body is essay/Q&A shape.
 */
function pickGoldTemplate(id, body, title) {
  const entryId = String(id || '').toLowerCase();
  const b = String(body || '');
  const t = title != null ? String(title) : '';

  if (titleSuggestsRankingList(t) && isRankingListBody(b, t)) {
    const top10 = appliesTop10Gold(b, t);
    return {
      template: 'top10',
      goldId: TOP10_GOLD_ID,
      goldUrl: TOP10_GOLD_URL,
      reason: top10
        ? 'title_and_body_ranking_markers_top10'
        : 'title_and_body_ranking_markers_not_top10_count',
    };
  }

  if (isRankingListBody(b, t)) {
    return {
      template: 'top10',
      goldId: TOP10_GOLD_ID,
      goldUrl: TOP10_GOLD_URL,
      reason: 'body_ranking_markers_without_title_signal',
    };
  }

  if (appliesQaGold(entryId, b, { title: t })) {
    return {
      template: 'qa',
      goldId: QA_GOLD_ID,
      goldUrl: QA_GOLD_URL,
      reason: titleSuggestsRankingList(t)
        ? 'title_suggests_ranking_but_body_is_essay_qa'
        : 'essay_qa_body_shape',
    };
  }

  return {
    template: null,
    goldId: null,
    goldUrl: null,
    reason: 'no_gold_template_applies',
  };
}

module.exports = {
  pickGoldTemplate,
  TOP10_GOLD_ID,
  TOP10_GOLD_URL,
  QA_GOLD_ID,
  QA_GOLD_URL,
  GOLD_IMAGE_PROVIDER_LAW,
};
