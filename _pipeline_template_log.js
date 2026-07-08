// PIPELINE TEMPLATE LAW — per-run audit record (classification + score history + 13/13 proof).

function makePipelineTemplateRun(opts) {
  const o = opts || {};
  const classification = o.classification || {
    template: o.template || null,
    goldId: o.goldId || null,
    goldUrl: o.goldUrl || null,
    reason: o.reason || null,
  };
  const scoreHistory = Array.isArray(o.scoreHistory) ? o.scoreHistory : [];
  const last = scoreHistory.length ? scoreHistory[scoreHistory.length - 1] : null;
  const finalScore = last && last.score != null ? last.score : null;
  const certified = !!o.certified;
  return {
    at: new Date().toISOString(),
    id: o.id || null,
    classification,
    template: classification.template || o.template || null,
    goldId: classification.goldId || o.goldId || null,
    scoreHistory,
    steps: Array.isArray(o.steps) ? o.steps : [],
    certified,
    finalScore,
    proof13: certified && finalScore >= 13,
  };
}

module.exports = { makePipelineTemplateRun };
