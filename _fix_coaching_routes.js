// Cleanly remove all coaching route remnants from netlify.toml and re-add a fresh
// coaching block placed immediately AFTER the known-working movies block. Backs up
// first and validates the result. Per owner: "delete the coaching infrastructure and
// redo it in your image so it works."
const fs = require('fs');
const P = 'C:/Users/koryj/website/netlify.toml';
let s = fs.readFileSync(P, 'utf8');
fs.writeFileSync(P + '.bak', s);
const before = s;

// 1) Remove my top "force reprocessing" comment.
s = s.replace(/^# 2026-06-20: force redirect reprocessing to activate \/coaching\/:id routes \(cg pillar\)\.\n/m, '');

// 2) Remove the entire existing coaching region (comment + all /coaching* + /coachtest* rules).
let lines = s.split('\n');
const out = [];
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  // Drop the coaching section comment.
  if (/Coaching pillar \(added 2026-06-19\)/.test(l)) continue;
  // Drop a [[redirects]] table whose `from` is a /coaching* or /coachtest* path.
  if (l.trim() === '[[redirects]]') {
    const fromLine = lines[i + 1] || '';
    if (/from = "\/(coaching|coachtest)/.test(fromLine)) {
      // skip this table: [[redirects]] + from + to + status (4 lines), plus optional trailing blank
      i += 3;
      continue;
    }
  }
  out.push(l);
}
s = out.join('\n');

// 3) Build the fresh coaching block (cloned from the working movies format, plain ASCII).
const block = [
  '',
  '# Coaching pillar (cg) - sales-coaching Q&A. Rebuilt clean + relocated next to movies 2026-06-20.',
  '[[redirects]]',
  '  from = "/coaching/:id/reviews"',
  '  to = "/.netlify/functions/pulse-machine-entry?id=:id&kind=coaching&view=reviews"',
  '  status = 200',
  '[[redirects]]',
  '  from = "/coaching/:id/review"',
  '  to = "/.netlify/functions/pulse-machine-entry?id=:id&kind=coaching&view=reviews"',
  '  status = 200',
  '[[redirects]]',
  '  from = "/coaching/:id"',
  '  to = "/.netlify/functions/pulse-machine-entry?id=:id&kind=coaching"',
  '  status = 200',
  '[[redirects]]',
  '  from = "/coaching"',
  '  to = "/coaching.html"',
  '  status = 200',
  '[[redirects]]',
  '  from = "/coaching/"',
  '  to = "/coaching.html"',
  '  status = 200',
].join('\n');

// 4) Insert right after the movies trailing-slash rule (anchor on the working movies block).
const anchor = '  from = "/movies/"\n  to = "/movies.html"\n  status = 200\n';
if (!s.includes(anchor)) { console.error('FATAL: movies anchor not found; aborting, restoring backup'); fs.writeFileSync(P, before); process.exit(1); }
s = s.replace(anchor, anchor + block + '\n');

// 5) Validate: exactly one /coaching/:id, movies still present, no coachtest left.
const cgIdCount = (s.match(/from = "\/coaching\/:id"/g) || []).length;
const coachtest = (s.match(/coachtest/g) || []).length;
const moviesOk = s.includes('  from = "/movies/:id"');
if (cgIdCount !== 1 || coachtest !== 0 || !moviesOk) {
  console.error('FATAL validation: cgId=' + cgIdCount + ' coachtest=' + coachtest + ' moviesOk=' + moviesOk + ' — restoring backup');
  fs.writeFileSync(P, before); process.exit(1);
}
fs.writeFileSync(P, s);
console.log('OK: coaching routes rebuilt + relocated after movies. /coaching/:id count=' + cgIdCount + ', coachtest removed, movies intact. Backup at netlify.toml.bak');
