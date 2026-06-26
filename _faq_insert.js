// Surgically append an FAQ section to an existing library entry, WITHOUT
// re-running the strict pillar writer (legacy entries may not match the current
// locked template). Reads a generated FAQ markdown file, inserts it before the
// ## Sources section (else before ## Bottom Line, else at end), re-grades to
// guard against regression, saves to the blob, pings IndexNow.
//
// Usage: node _faq_insert.js <id> <faq-file.md>
//   faq-file.md must contain the FAQ body: a "## FAQ" heading followed by
//   >=5 **bold question?** lines each with an answer below.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const ID = process.argv[2];
const FAQFILE = process.argv[3];
if (!ID || !FAQFILE) { console.error('usage: node _faq_insert.js <id> <faq-file.md>'); process.exit(1); }

(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
  const e = await s.get('answers/' + ID + '.json', { type: 'json' });
  if (!e || !e.answer) { console.error('NOT FOUND/empty:', ID); process.exit(2); }
  // Skip if ANY FAQ form already exists (plain, numbered "## 6. FAQ", or ### FAQ)
  // — prevents creating duplicate FAQ blocks on entries with a legacy FAQ.
  if (/^#{2,4}\s*((\d+|[IVXLC]+)[.)]\s*)?(FAQ|Frequently Asked)/im.test(e.answer)) { console.log(JSON.stringify({ ok: true, id: ID, skipped: 'already has FAQ' })); return; }

  let faq = fs.readFileSync(FAQFILE, 'utf8').trim();
  // ensure it carries an ## FAQ heading and >=5 bold-question pairs
  if (!/^#{2,3}\s*FAQ/im.test(faq)) faq = '## FAQ\n\n' + faq;
  const pairs = (faq.match(/^\s*\*\*[^*]+\?\*\*/gm) || []).length;
  if (pairs < 5) { console.error('REJECT: only ' + pairs + ' bold-question pairs (<5)'); process.exit(3); }

  const body = e.answer.replace(/\s+$/, '');
  const lines = body.split(/\r?\n/);
  // insertion point: before ## Sources, else before ## Bottom Line, else end
  let at = lines.findIndex(l => /^#{2,3}\s*Sources\b/i.test(l));
  if (at < 0) at = lines.findIndex(l => /^#{2,3}\s*Bottom Line\b/i.test(l));
  let newBody;
  if (at < 0) newBody = body + '\n\n' + faq + '\n';
  else { const head = lines.slice(0, at).join('\n').replace(/\s+$/, ''); const tail = lines.slice(at).join('\n'); newBody = head + '\n\n' + faq + '\n\n' + tail; }

  const before = gradeEntry(ID, e.answer);
  const after = gradeEntry(ID, newBody);
  if (after.score < before.score) { console.error('REJECT: grade regression ' + before.score + ' -> ' + after.score); process.exit(4); }

  const now = Date.now();
  e.answer = newBody; e.ts = now; e.polished_at = now;
  await s.setJSON('answers/' + ID + '.json', e);
  try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id: ID }), signal: AbortSignal.timeout(8000) }); } catch (e) {}
  try { fs.unlinkSync(FAQFILE); } catch (e) {}
  console.log(JSON.stringify({ ok: true, id: ID, pairs, grade_before: before.score, grade_after: after.score }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
