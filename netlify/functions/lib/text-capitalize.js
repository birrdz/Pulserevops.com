// Sentence-case helpers — questions and prose start with capitals.

function capitalizeQuestion(q) {
  const s = String(q || '').trim();
  if (!s) return s;
  return capitalizeSentences(s.charAt(0).toUpperCase() + s.slice(1));
}

function capitalizeSentences(text) {
  let s = String(text || '');
  if (!s) return s;
  s = s.replace(/^([a-z])/, (_, c) => c.toUpperCase());
  s = s.replace(/([.!?…])\s+([a-z])/g, (_, punct, c) => punct + ' ' + c.toUpperCase());
  s = s.replace(/\n([a-z])/g, (_, c) => '\n' + c.toUpperCase());
  s = s.replace(/(^|\n)(\s*[-•*]\s+)([a-z])/g, (_, pre, bullet, c) => pre + bullet + c.toUpperCase());
  return s;
}

/** Capitalize prose lines; leave fenced code, tables, and headings unchanged. */
function capitalizeSentencesInMarkdown(md) {
  const lines = String(md || '').split('\n');
  let inFence = false;
  return lines
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      if (/^\s*#/.test(line)) {
        return line.replace(/^(#+\s+)(.*)$/, (_, hashes, rest) => hashes + capitalizeSentences(rest));
      }
      if (/^\s*\|/.test(line)) return line;
      if (/^\s*[-•*]\s+/.test(line)) {
        return line.replace(/^(\s*[-•*]\s+)(.*)$/, (_, bullet, rest) => bullet + capitalizeSentences(rest));
      }
      if (!line.trim()) return line;
      return capitalizeSentences(line);
    })
    .join('\n');
}

module.exports = {
  capitalizeQuestion,
  capitalizeSentences,
  capitalizeSentencesInMarkdown,
};
