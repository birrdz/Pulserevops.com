// Shared: strip internal batch suffixes from question titles (not for visitor-facing copy).
function cleanBatchFromQuestion(q) {
  if (!q) return q;
  let s = String(q).replace(/\s*\(batch\s+\d+\s*#\d+\)\s*/gi, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  if (s && !s.endsWith('?')) s += '?';
  return s;
}

module.exports = { cleanBatchFromQuestion };
