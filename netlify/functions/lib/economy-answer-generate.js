// Async answers: LLM cascade (quality) → compact programmatic fallback.

const { capitalizeSentencesInMarkdown } = require('./text-capitalize');
const { buildAnswer, isCannedEconomyAnswer, needsIntelligentRewrite } = require('./economy-answer-build');
const { llmAnswer } = require('./economy-answer-llm');
const { finalizeEconomyAnswer, validateEconomyAnswer, MIN_WORDS } = require('./economy-answer-quality');

async function generateAnswer(question, opts = {}) {
  const q = String(question || '').trim();
  const wantLlm = opts.preferLlm !== false;

  if (wantLlm) {
    try {
      const { text, source, words } = await llmAnswer(q, opts);
      return {
        answer: capitalizeSentencesInMarkdown(text),
        source: 'llm-' + source.replace(/:/g, '-'),
        words,
      };
    } catch (err) {
      if (opts.llmRequired) throw err;
    }
  }

  const fin = finalizeEconomyAnswer(buildAnswer(q), q);
  return {
    answer: capitalizeSentencesInMarkdown(fin.answer),
    source: 'programmatic-v2',
    words: fin.words,
  };
}

function isValidEconomyAnswer(markdown) {
  return validateEconomyAnswer(markdown).ok;
}

module.exports = { generateAnswer, isCannedEconomyAnswer, needsIntelligentRewrite, isValidEconomyAnswer, MIN_WORDS };
