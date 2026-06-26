// Quick local grader for gp#### body files before publishing.
// Usage: node _check_gp.js <id>
const fs = require('fs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const ID = process.argv[2];
const path = `C:/Users/koryj/${ID}_answer.md`;
const body = fs.readFileSync(path, 'utf8');
const r = gradeEntry(ID, body);
console.log(JSON.stringify({
  id: ID, score: r.score, word_count: r.word_count, floor: r.word_floor,
  mermaid_count: r.mermaid_count, faq_qa_count: r.faq_qa_count,
  source_count: r.source_count, bold_spans: r.bold_spans,
  named_companies: r.named_companies, banned_hits: r.banned_hits, missing: r.missing
}, null, 2));
