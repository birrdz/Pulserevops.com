// Shared helper for the year-at-end law: outdatable titles end with the current
// year ("... in 2027"); evergreen/definitional titles are left alone.
const YEAR = '2027';
const hasYear = t => /\b20\d{2}\b/.test(String(t || ''));
// VERY narrow evergreen guard — only skip truly timeless definitional titles.
// When in doubt, stamp (owner: "anything that COULD be outdated by the year").
const EVERGREEN = /^(what is|what are|what does .+ mean|why (does|do|is|are) .+\b(matter|important)|define )\b/i;
const isEvergreen = t => EVERGREEN.test(String(t || '').trim());
function stampYear(title) {
  const t = String(title || '').trim();
  if (!t || hasYear(t) || isEvergreen(t)) return t;
  return /\?$/.test(t) ? t.replace(/\?+$/, ` in ${YEAR}?`) : t.replace(/[.\s]+$/, '') + ` in ${YEAR}`;
}
module.exports = { stampYear, hasYear, isEvergreen, YEAR };
