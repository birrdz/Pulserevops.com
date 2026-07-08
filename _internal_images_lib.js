// _internal_images_lib.js — section/internal images only (DDG). Never touches face-card or hero.
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { C } = require('./_v2_components');
const { isTop10Body } = require('./netlify/functions/lib/ensure-entry-images');
const { fluxRewriteSectionsOnly } = require('./_img_flux_rewrite_lib');

const INTERNAL_KEYS = ['pollinatorInternalFlux', 'media3to10', 'imagesLaw'];

function internalImagesRubricAudit(id, body, opts) {
  opts = opts || {};
  const g = gradeEntry(id, body, { imagesDeferred: false });
  const checks = {
    pollinatorInternalFlux: opts.internalImagesOk ? opts.internalImagesOk(body, id) : true,
    media3to10: opts.mediaOk ? opts.mediaOk(body, id) : true,
    imagesLaw: !!(g.checks && g.checks.images_law),
  };
  const failed = INTERNAL_KEYS.filter(k => !checks[k]);
  const total = INTERNAL_KEYS.length;
  const passed = total - failed.length;
  return {
    pass: failed.length === 0,
    checks,
    failed,
    passed,
    total,
    rubricPct: Math.round(passed / total * 100),
    contentScore: g.score,
  };
}

function internalImagesPass(id, body, opts) {
  return internalImagesRubricAudit(id, body, opts).pass;
}

async function internalImagesFixEntry(id, title, body, opts) {
  opts = opts || {};
  let b = String(body || '');
  if (opts.collapseSectionImages) b = opts.collapseSectionImages(b, id);
  const before = internalImagesRubricAudit(id, b, opts);
  if (before.pass) return { body: b, before, after: before, pass: true, skipped: true, fluxDone: 0, steps: ['already-pass'] };

  const steps = [];
  if (opts.shouldStop && opts.shouldStop()) return { body: b, before, after: before, pass: false, stopped: true, fluxDone: 0, steps };

  // DDG finalize fills every ## section — skip separate media pass to avoid double-insert stacks.
  if (opts.ensureMediaImages && !isTop10Body(b) && !(opts.useDdg && opts.finalizeDdgImages)) {
    const withMedia = await opts.ensureMediaImages(id, title, opts.pillarOf(id), b);
    if (withMedia !== b) { b = withMedia; steps.push('media-count'); }
    if (opts.collapseSectionImages) b = opts.collapseSectionImages(b, id);
  }

  if (opts.useDdg && opts.finalizeDdgImages) {
    if (opts.onProgress) opts.onProgress({ phase: 'ddg', label: 'DDG sections' });
    b = await opts.finalizeDdgImages(id, title, opts.pillarOf(id), b, opts.onProgress);
    steps.push('ddg-sections');
    if (opts.collapseSectionImages) b = opts.collapseSectionImages(b, id);
    if (opts.ensureInternalRendered) {
      b = await opts.ensureInternalRendered(id, title, opts.pillarOf(id), b, opts.onProgress);
      steps.push('ddg-verify');
      if (opts.collapseSectionImages) b = opts.collapseSectionImages(b, id);
    }
  } else {
    if (opts.onProgress) opts.onProgress({ phase: 'flux', label: 'Pollinator sections' });
    const fr = await fluxRewriteSectionsOnly(id, title, b, {
      shouldStop: opts.shouldStop,
      guideKeywords: opts.guideKeywords || '',
      noCooldown: !!opts.noCooldown,
      onProgress: opts.onProgress,
    });
    if (fr.body) b = fr.body;
    if (fr.stopped) return { body: b, before, after: internalImagesRubricAudit(id, b, opts), pass: false, stopped: true, fluxDone: fr.fluxDone || 0, steps: steps.concat(['flux-stopped']) };
    if (fr.error) return { body: b, before, after: internalImagesRubricAudit(id, b, opts), pass: false, error: fr.error, fluxDone: fr.fluxDone || 0, steps: steps.concat(['flux-error']) };
    steps.push('flux-sections');
  }

  if (opts.finalizeBody) b = await opts.finalizeBody(id, title, b);
  if (opts.enforceCroCardLaw) b = opts.enforceCroCardLaw(b, id);
  if (opts.collapseSectionImages) b = opts.collapseSectionImages(b, id);

  let imagesPending = false;
  if (opts.verifyAllImagesRender) {
    if (opts.onProgress) opts.onProgress({ phase: 'verify', label: 'all images render' });
    const vr = await opts.verifyAllImagesRender(id, title, b, opts);
    b = vr.body || b;
    if (!vr.ok) {
      imagesPending = true;
      steps.push('render-hold');
    } else {
      steps.push('render-pass');
    }
  }

  const after = internalImagesRubricAudit(id, b, opts);
  return { body: b, before, after, pass: after.pass && !imagesPending, imagesPending, fluxDone: 0, steps, top10: isTop10Body(b), ddg: !!(opts.useDdg && opts.finalizeDdgImages) };
}

module.exports = {
  INTERNAL_KEYS,
  internalImagesRubricAudit,
  internalImagesPass,
  internalImagesFixEntry,
};
