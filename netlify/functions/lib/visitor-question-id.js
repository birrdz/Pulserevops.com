'use strict';

function normalizeQuestion(q) {
  return String(q || '').toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Stable vq_* id for a visitor question (matches queue + library ghost cards). */
function visitorQuestionId(q) {
  const norm = normalizeQuestion(q);
  let h = 5381;
  for (let i = 0; i < norm.length; i++) h = ((h << 5) + h + norm.charCodeAt(i)) | 0;
  return 'vq_' + (h >>> 0).toString(36).slice(0, 7);
}

module.exports = { normalizeQuestion, visitorQuestionId };
