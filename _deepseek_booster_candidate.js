'use strict';

const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const {
  VISUAL_LOCK_DS_SYSTEM_SNIPPET,
  enforceWriterVisualLock,
} = require('./_visual_lock_law');

let deepSeekTail = Promise.resolve();
function serialDeepSeek(messages, options, shouldStop) {
  const run = async () => {
    if (shouldStop && shouldStop()) throw new Error('DeepSeek booster stopped before queued call');
    const { dsChat } = require('./_ds_lib');
    return dsChat(messages, options);
  };
  const next = deepSeekTail.then(run, run);
  deepSeekTail = next.catch(() => {});
  return next;
}

function unwrap(text) {
  let body = String(text || '').trim();
  const fenced = body.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```\s*$/i);
  if (fenced) body = fenced[1].trim();
  return body;
}

function routeLaw(route) {
  if (route.template === 'top10') {
    return 'Keep the immutable aq1158 Top-10 shape. Preserve all ten ranks, @@PRODUCT directives, section order, and tail sections. Never convert it to an essay.';
  }
  if (route.template === 'qa') {
    return 'Keep the immutable q11133 Q&A essay shape. Direct Answer must remain first. Never add ranks, @@PRODUCT directives, or a Top-10 hero.';
  }
  return 'Keep the existing document structure and heading order.';
}

function contentImages(body) {
  return String(body || '').split(/\r?\n/).filter(line => (
    /^\s*!\[[^\]]*\]\([^)]+\)\s*$/.test(line)
    || /^\s*@@PRODUCT\b/.test(line)
    || /<img\b|<aside\b|class=["'][^"']*(?:cro-|product-card|direct-answer-box)/i.test(line)
  ));
}

function visualPlacementSignature(body) {
  let heading = '(top)';
  const signature = [];
  for (const line of String(body || '').split(/\r?\n/)) {
    if (/^#{2,3}\s+/.test(line)) heading = line.trim().toLowerCase();
    if (contentImages(line).length) {
      const type = /^\s*@@PRODUCT\b/.test(line) ? 'product'
        : /<img\b|<aside\b/i.test(line) ? 'html'
          : 'markdown';
      signature.push(heading + '|' + type);
    }
  }
  return signature;
}

function candidateInvariantIssues(original, candidate, lockedRoute, id, title) {
  const issues = [];
  const nextRoute = pickGoldTemplate(id, candidate, title);
  if (lockedRoute.template !== nextRoute.template) issues.push('template_changed');
  const originalImages = contentImages(original);
  const candidateImages = contentImages(candidate);
  if (JSON.stringify(originalImages) !== JSON.stringify(candidateImages)) issues.push('image_slots_changed');
  if (JSON.stringify(visualPlacementSignature(original)) !== JSON.stringify(visualPlacementSignature(candidate))) issues.push('image_slots_moved');
  if (candidate.length < original.length * 0.72) issues.push('candidate_truncated');
  if (/^\s*```(?:markdown|md)\b/i.test(candidate)) issues.push('markdown_wrapper_present');
  if (/\b(?:as an ai|i cannot browse|i can't browse|language model)\b/i.test(candidate)) issues.push('ai_meta_language');
  return issues;
}

async function makeDeepSeekCandidate({ id, title, body, directive, lockedRoute, shouldStop }) {
  const original = String(body || '');
  const route = lockedRoute || pickGoldTemplate(id, original, title);
  const system = `You are the DeepSeek-only Content Booster for PULSE.

Your job is surgical: fix ONLY the failed criteria supplied by the quality gate.
Return the COMPLETE revised Markdown body and nothing else.

${routeLaw(route)}

HARD QUALITY RULES:
- Preserve every image Markdown line byte-for-byte, in the same order and slots.
- Preserve all strong existing content. Expand or repair only what failed.
- Never change the article question/title or switch template type.
- Never invent a statistic, price, quote, vendor, study, source, URL, or named report.
- Keep claims factual and useful for a reader arriving from Google or Bing.
- No keyword stuffing, filler, generic SEO language, fake expertise, or AI meta-commentary.
- Sources must be real, relevant URLs. Do not cite pulserevops.com as an external source.
- Related PULSE links must already exist in the supplied body; do not invent internal URLs.
- Follow the failed-criteria directive literally and stop once those failures are repaired.

${VISUAL_LOCK_DS_SYSTEM_SNIPPET}`;

  const user = `ENTRY ID: ${id}
QUESTION: ${title}
LOCKED TEMPLATE: ${route.template || 'existing'} (${route.reason})

FAILED QUALITY CRITERIA:
${String(directive || '').trim()}

CURRENT BODY:
${original}`;

  const response = await serialDeepSeek([
    { role: 'system', content: system },
    { role: 'user', content: user },
  ], {
    temperature: 0.1,
    max_tokens: 12000,
    retries: 0,
  }, shouldStop);

  let candidate = unwrap(response && response.content);
  candidate = enforceWriterVisualLock(original, candidate, {
    qaGold: route.template === 'qa',
    id,
    title,
  });
  const issues = candidateInvariantIssues(original, candidate, route, id, title);
  return { candidate, route, issues, usage: response && response.usage };
}

module.exports = {
  makeDeepSeekCandidate,
  candidateInvariantIssues,
  contentImages,
  visualPlacementSignature,
};
