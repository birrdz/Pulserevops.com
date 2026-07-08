// Shared publish prep: auto-ensure images (LAW), grade, pillar SEO stamp, IndexNow.
// SEO auto-applied at publish for every pillar with a compete module in _pillar_seo_registry.js.
const path = require('path');
const { loadEnv } = require('./netlify/functions/lib/load-env');
loadEnv(path.join(__dirname));
const { ensureImages } = require('./netlify/functions/lib/ensure-entry-images');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { applyPillarSeo, pingIndexNowAfterPublish } = require('./netlify/functions/lib/ensure-pillar-seo');
const { sanitizeMermaid } = require('./_mermaid_sanitize');

async function prepareBodyForGrade(id, title, body, opts = {}) {
  const force = !!opts.force;
  const skipImages = !!opts.skipImages;

  // Render-safety: rewrite stray '<'/'>' in mermaid labels to words so new/regenerated
  // entries never ship the "Syntax error in graph" box (DeepSeek emits '<$1M' etc.).
  body = sanitizeMermaid(body);

  if (!skipImages) {
    const img = await ensureImages(id, title, body);
    body = img.body;
    if (!img.audit.compliant && !force) {
      return {
        body,
        grade: gradeEntry(id, body),
        imageAudit: img.audit,
        rejected: 'images_law',
      };
    }
  }

  // Text-first (skipImages): grade with imagesDeferred so a missing cover/product
  // image doesn't cap the score at 9 — the later Claude image pass fills them in.
  const grade = gradeEntry(id, body, { imagesDeferred: skipImages });
  return { body, grade, imageAudit: null, rejected: null };
}

/** Idempotent SEO metadata stamp before blob write. Returns merged entry object. */
function prepareEntryForPublish(id, title, entry, opts = {}) {
  const out = applyPillarSeo(id, title, entry, opts).entry;
  // Per-URL SEO keyword cluster (owner law 2026-06-27): store the tight intent
  // variants for the alternateName render, and append a deploy-free "People also
  // search for:" line when it reads cleanly. After SEO/CRO so it never re-grades.
  try {
    const { clusterFor } = require('./_kw_cluster');
    const c = clusterFor(title, (String(id).match(/^([a-z]+)/i) || [])[1]);
    out.seo_kw_cluster = c.variants || [];
    out.kw_line_at = Date.now();
    if (c.line && typeof out.answer === 'string' && !/People also search for/i.test(out.answer)) {
      out.answer = out.answer.replace(/\s+$/, '') + '\n\n' + c.line + '\n';
    }
  } catch (e) {}
  return out;
}

/** Local IndexNow ping when caller has blob store (direct-write scripts). */
async function finalizeIndexNow(id, store, indexRow, opts = {}) {
  return pingIndexNowAfterPublish(id, store, indexRow, opts);
}

module.exports = {
  prepareBodyForGrade,
  prepareEntryForPublish,
  finalizeIndexNow,
  applyPillarSeo,
};
