// Sync wrapper — prefer generateAnswer() for quality (Gemini).

const { capitalizeSentencesInMarkdown } = require('./text-capitalize');
const { buildAnswer, isCannedEconomyAnswer } = require('./economy-answer-build');

function cluster(question) {
  const q = question.toLowerCase();
  if (/\bnil\b|college football|transfer portal|nil collective|d1 football/.test(q)) return 'nil';
  if (/palantir|foundry|gotham|\baip\b/.test(q)) return 'palantir';
  if (/fractional cro|chief revenue officer|interim cro/.test(q)) return 'cro';
  if (/forecast|sandbag|commit|pipeline coverage/.test(q)) return 'forecast';
  if (/commission|quota|comp plan|spiff|clawback/.test(q)) return 'comp';
  if (/meddic|discovery|multi-thread|win-loss/.test(q)) return 'sales_process';
  if (/salesforce|hubspot|dynamics|netsuite|gong|outreach|snowflake/.test(q)) return 'stack';
  if (/attribution|utm|mql/.test(q)) return 'attribution';
  if (/territory|routing|sdr|handoff/.test(q)) return 'routing';
  return 'revops';
}

function answerFor(question) {
  return capitalizeSentencesInMarkdown(buildAnswer(question));
}

module.exports = { answerFor, cluster, isCannedEconomyAnswer, buildAnswer };
