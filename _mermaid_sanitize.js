// _mermaid_sanitize.js — shared, deterministic mermaid label fixer. Inside ```mermaid
// blocks, stray '<' / '>' in node/edge labels break Mermaid -> red "Syntax error in graph"
// box. Rewrite them to words that always render ('<$1M'->'under $1M', '>$5M'->'over $5M',
// '<='/'>='->'at most'/'at least', bare '<'/'>'-> 'under'/'over') WITHOUT touching arrow
// tokens (-->, <--, ==>, -.->, ---, etc.). Called at PUBLISH time (_write_lib.prepareBodyForGrade)
// so new/regenerated entries never ship the bug, and by _fix_mermaid_ltgt.js for backfill.
const ARROWS = [/<-\.->/g,/<-->/g,/<==>/g,/<--/g,/<==/g,/-\.->/g,/-->/g,/==>/g,/---/g,/-\.-/g,/===/g];
const SO = 'ZZARROWZZ', SC = 'ZZ';
function fixLine(line) {
  let s = line; const saved = [];
  ARROWS.forEach(rx => { s = s.replace(rx, m => { saved.push(m); return SO + (saved.length - 1) + SC; }); });
  s = s.replace(/<=\s*/g, 'at most ').replace(/>=\s*/g, 'at least ')
       .replace(/<\s*(?=[$\d])/g, 'under ').replace(/>\s*(?=[$\d])/g, 'over ')
       .replace(/</g, 'under ').replace(/>/g, 'over ')
       .replace(/under\s+under /g, 'under ').replace(/over\s+over /g, 'over ');
  s = s.replace(new RegExp(SO + '(\\d+)' + SC, 'g'), (_, n) => saved[+n]);
  return s;
}
function sanitizeMermaid(body) {
  if (!body || String(body).indexOf('```mermaid') < 0) return body;
  return String(body).replace(/```mermaid\s*([\s\S]*?)```/g, (full, inner) => {
    if (!/[<>]/.test(inner)) return full;
    return '```mermaid\n' + inner.split('\n').map(fixLine).join('\n').replace(/^\n+/, '').replace(/\n+$/, '') + '\n```';
  });
}
module.exports = { sanitizeMermaid };
