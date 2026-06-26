// Top up the coaching test run to a target count with FRESH replacement topics
// (covers entries skipped as duplicates). Text-first via DeepSeek, same as the
// main driver. Assigns sequential IDs from --start (default next free after 805).
// Usage: node _cg_fill.js --need=N [--start=806]
const fs = require('fs');
const { execSync } = require('child_process');
const { generateGradedBody } = require('./_cg_ds_gen');

// Fresh, distinct coaching Q&A topics held in reserve for dup replacement.
const REPLACEMENTS = [
  "How do you coach a rep who only sells to one type of buyer?",
  "How do you coach a rep who won't ask for referrals?",
  "How do you coach a rep who gives up after the first no?",
  "How do you coach a rep who struggles with time management?",
  "How do you coach a rep who can't tell a compelling customer story?",
  "How do you coach a rep who underprepares for big meetings?",
  "How do you coach a rep who won't role-play with you?",
  "How do you coach a rep who is afraid of enterprise deals?",
];

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

const needArg = process.argv.find((a) => /^--need=\d+$/.test(a));
const startArg = process.argv.find((a) => /^--start=\d+$/.test(a));
const need = needArg ? parseInt(needArg.split('=')[1], 10) : 0;
let n = startArg ? parseInt(startArg.split('=')[1], 10) : 806;
if (!need) { console.error('usage: node _cg_fill.js --need=N [--start=806]'); process.exit(1); }

const seen = new Set(JSON.parse(fs.readFileSync('C:/Users/koryj/website/_cg_all_titles_norm.json', 'utf8')));

(async () => {
  let pub = 0, i = 0;
  while (pub < need && i < REPLACEMENTS.length) {
    const title = REPLACEMENTS[i++];
    if (seen.has(norm(title))) continue;
    const id = `cg${String(n++).padStart(4, '0')}`;
    try {
      const { body, grade } = await generateGradedBody(id, title, 'qa', { maxTries: 3 });
      const ok = grade.banned_hits.length === 0 && grade.missing.every((m) => m === 'images_law');
      if (!ok) { console.log(`REJ ${id} ${grade.missing.join('|')}`); n--; continue; }
      fs.writeFileSync(`C:/Users/koryj/${id}_answer.md`, body);
      const out = execSync(`node _write_cg.js ${id} "${title.replace(/"/g, '\\"')}" ${slug(title)} --text-first`,
        { cwd: 'C:/Users/koryj/website', encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
      const r = JSON.parse(out.trim().split('\n').pop());
      if (r.ok) { pub++; seen.add(norm(title)); console.log(`OK ${id} ${r.score}/12 ${r.words}w ${r.url}`); }
      else { console.log(`REJ pub ${id}`); n--; }
    } catch (e) { console.log(`ERR ${id} ${e.message}`); n--; }
  }
  console.log(`FILL done published=${pub} (needed ${need})`);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
