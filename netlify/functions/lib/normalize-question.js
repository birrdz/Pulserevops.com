// Shared question-text normalizer — enforces the question-text-law LAW
// (passcode 4444 to change). Used by every writer that stores a `question`
// field, so visitor input + machine writes are normalized consistently.
//
//   const { normalizeQuestion } = require('./lib/normalize-question');
//   const cleanQ = normalizeQuestion(rawQ);
//
// Idempotent — running it twice on the same string returns the same result.

const ACRONYMS = [
  'RevOps','SaaS','SaaStr','GTM','AI','API','KPI','KPIs','CRM','PE','B2B','B2C','DTC',
  'NRR','ARR','MRR','OTE','ACV','CAC','LTV','AE','AEs','BDR','BDRs','SDR','SDRs',
  'CRO','CMO','CFO','CEO','CTO','NIL','NILs','MEDDIC','MEDDPICC','SPIN','PLG','SLG',
  'CSAT','NPS','MQL','SQL','TAM','SAM','SOM','ICP','ROI','FAQ','SEO','ETL','BI',
];

const TYPO_FIX = {
  'definately':'definitely','recieve':'receive','thier':'their','seperate':'separate',
  'occured':'occurred','untill':'until','alot':'a lot',
  "dont":"don't","cant":"can't","wont":"won't","wouldnt":"wouldn't","shouldnt":"shouldn't",
  "isnt":"isn't","arent":"aren't","wasnt":"wasn't","werent":"weren't",
  "hasnt":"hasn't","havent":"haven't","didnt":"didn't","doesnt":"doesn't","couldnt":"couldn't",
  "im":"I'm","ive":"I've","ill":"I'll","youre":"you're","youve":"you've","youll":"you'll",
  "theyre":"they're","theyve":"they've","theyll":"they'll","weve":"we've","wereall":"we're all",
  'incollege':'in college','nol':'NIL','nols':'NILs','whats':"What's",
};

const QUESTION_WORDS = /^(How|What|When|Where|Why|Who|Is|Are|Do|Does|Did|Can|Should|Would|Could|Will)\b/i;

function normalizeQuestion(q) {
  if (!q || typeof q !== 'string') return q;
  let s = q.replace(/\s+/g, ' ').trim();
  if (!s) return s;

  // 1) First-char capital
  s = s.charAt(0).toUpperCase() + s.slice(1);

  // 2) Acronym fixes (word-boundary, case-insensitive — preserves brand-name casing
  //    by only firing on full token matches; doesn't replace inside larger words).
  for (const a of ACRONYMS) {
    const re = new RegExp('\\b' + a + '\\b', 'gi');
    s = s.replace(re, (m) => {
      // Skip if preceded by . (preserve TLDs like Day.ai / Otter.ai)
      const idx = s.indexOf(m);
      if (idx > 0 && s[idx - 1] === '.') return m;
      return a;
    });
  }

  // 3) Typo fixes — case-insensitive match, preserve original case of first char.
  for (const [k, v] of Object.entries(TYPO_FIX)) {
    const re = new RegExp('\\b' + k + '\\b', 'gi');
    s = s.replace(re, (m) => {
      if (m.charAt(0) === m.charAt(0).toUpperCase()) {
        return v.charAt(0).toUpperCase() + v.slice(1);
      }
      return v;
    });
  }

  // 4) Terminal punctuation — add ? if question-word start and no terminal punct
  if (QUESTION_WORDS.test(s) && !/[?.!]$/.test(s)) s = s + '?';

  // 5) Final whitespace pass
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

module.exports = { normalizeQuestion };
