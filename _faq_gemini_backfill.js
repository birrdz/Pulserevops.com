// FAST FAQ backfill via Gemini 2.5-flash (owner-authorized 2026-06-19 to speed
// up the campaign). Scans the LIVE index for entries of the given prefixes that
// have NO FAQ in any form, asks Gemini for a 5-pair "## FAQ" specific to each
// entry's body, validates (>=5 bold-question pairs, no banned words), inserts
// before ## Sources, re-grades (skips on regression), saves to blob, pings
// IndexNow. Resumable + idempotent (skips entries that already gained a FAQ).
//
// Usage: node _faq_gemini_backfill.js <prefixCSV> [limit]   e.g. node _faq_gemini_backfill.js q 200
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const GKEY = process.env.GEMINI_API_KEY;
if (!GKEY) { console.error('GEMINI_API_KEY not set'); process.exit(1); }
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
const PRE = (process.argv[2] || 'q').split(',').map(x => x.trim().toLowerCase());
const LIMIT = parseInt(process.argv[3] || '999999', 10);
const CONC = 1;                 // owner: run Gemini at half production
const PACE_MS = 6000;           // extra delay between entries (slow by half)
const ROUTE = { q: '/knowledge/', ik: '/industry-kpis/', st: '/sales-trainings/', gb: '/graphics/', sp: '/speeches/', fr: '/franchises/', ra: '/revenue-architecture/', gp: '/go-to-market-playbooks/', tk: '/tech-stacks/' };
async function emailOwner(subject, html) {
  try { await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, html }), signal: AbortSignal.timeout(12000) }); } catch (e) {}
}
const prefixOf = id => { const m = String(id).match(/^([a-z]+)/i); return m ? m[1].toLowerCase() : '?'; };
const hasFAQ = a => /^#{2,4}\s*(\d+[.)]\s*)?(FAQ|Frequently Asked)/im.test(a);
const BANNED = /\b(delve|tapestry|landscape|holistic|ever-evolving|synerg|paradigm shift|game-changer|cutting-edge|state-of-the-art|seamless integration|drive growth|unlock (value|potential)|needless to say)\b|in today's|it's worth noting|it's important to note/i;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function gemini(prompt, attempt = 0) {
  try {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GKEY, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.6, maxOutputTokens: 2600, thinkingConfig: { thinkingBudget: 0 } } }),
      signal: AbortSignal.timeout(45000)
    });
    if (r.status === 429 || r.status === 503) { if (attempt < 7) { await sleep(8000 + attempt * 7000); return gemini(prompt, attempt + 1); } return null; }
    const j = await r.json();
    const t = j && j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts && j.candidates[0].content.parts[0] && j.candidates[0].content.parts[0].text;
    return t || null;
  } catch (e) { if (attempt < 3) { await sleep(2500); return gemini(prompt, attempt + 1); } return null; }
}

function cleanFaq(text) {
  let t = String(text || '').trim();
  t = t.replace(/^```(?:markdown)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const i = t.search(/^##\s*FAQ/im);
  if (i > 0) t = t.slice(i);
  if (!/^##\s*FAQ/im.test(t)) t = '## FAQ\n\n' + t;
  return t.trim();
}
function buildPrompt(title, body) {
  const snippet = body.slice(0, 6000);
  return `You are writing an FAQ for a specific article. Output ONLY a Markdown FAQ section, nothing else.

FORMAT (exactly):
## FAQ

**<question ending in a question mark>**
<2-4 sentence answer>

**<question>**
<answer>

... exactly 5 question/answer pairs total.

RULES:
- Each question is a **bold** line ending in "?"; the answer is plain text on the next line(s).
- The 5 questions must be REAL, specific follow-up questions a reader of THIS article would ask — drawn from its actual content (real tools, numbers, names, prices, roles mentioned). No generic filler. No duplicate questions.
- Answers must be concrete and consistent with the article. 2-4 sentences each.
- NEVER use these words/phrases: delve, tapestry, landscape, holistic, ever-evolving, synergy, paradigm shift, game-changer, cutting-edge, state-of-the-art, seamless integration, drive growth, unlock value, unlock potential, needless to say, "in today's", "it's worth noting", "it's important to note".
- Output ONLY the "## FAQ" section. Do not repeat the article. Do not add commentary or code fences.

ARTICLE TITLE: ${title}

ARTICLE BODY:
${snippet}`;
}
function insertFaq(body, faq) {
  const b = body.replace(/\s+$/, ''); const lines = b.split(/\r?\n/);
  let at = lines.findIndex(l => /^#{2,3}\s*Sources\b/i.test(l));
  if (at < 0) at = lines.findIndex(l => /^#{2,3}\s*Bottom Line\b/i.test(l));
  if (at < 0) return b + '\n\n' + faq + '\n';
  return lines.slice(0, at).join('\n').replace(/\s+$/, '') + '\n\n' + faq + '\n\n' + lines.slice(at).join('\n');
}

(async () => {
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const ids = (idx.entries || []).map(e => e.id).filter(id => PRE.includes(prefixOf(id)));
  console.log('Scanning', ids.length, 'entries for missing FAQ...');
  // find targets live (skip ones that already have a FAQ — incl. concurrent Claude work)
  const targets = []; let i = 0;
  async function scan() { while (i < ids.length && targets.length < LIMIT) { const id = ids[i++]; try { const e = await s.get('answers/' + id + '.json', { type: 'json' }); if (e && e.answer && !hasFAQ(e.answer)) targets.push(id); } catch (e) {} } }
  await Promise.all(Array.from({ length: 16 }, scan));
  console.log('Targets:', targets.length);
  let done = 0, skip = 0, fail = 0, j = 0;
  async function work() {
    while (j < targets.length) {
      const id = targets[j++];
      try {
        const e = await s.get('answers/' + id + '.json', { type: 'json' });
        if (!e || !e.answer) { fail++; continue; }
        if (hasFAQ(e.answer)) { skip++; continue; } // someone did it meanwhile
        let faq = null;
        for (let a = 0; a < 3 && !faq; a++) {
          const raw = await gemini(buildPrompt(e.question || id, e.answer));
          if (!raw) continue;
          const c = cleanFaq(raw);
          const pairs = (c.match(/^\s*\*\*[^*\n]+\?\*\*/gm) || []).length;
          if (pairs >= 5 && !BANNED.test(c)) faq = c;
        }
        if (!faq) { fail++; console.log('  FAIL', id); continue; }
        const before = gradeEntry(id, e.answer);
        const newBody = insertFaq(e.answer, faq);
        const after = gradeEntry(id, newBody);
        if (after.score < before.score) { skip++; console.log('  SKIP(regress)', id); continue; }
        e.answer = newBody; e.ts = Date.now(); e.polished_at = Date.now();
        await s.setJSON('answers/' + id + '.json', e);
        try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }), signal: AbortSignal.timeout(8000) }); } catch (e) {}
        done++;
        const left = targets.length - done;
        const url = 'https://pulserevops.com' + (ROUTE[prefixOf(id)] || '/knowledge/') + id;
        await emailOwner('FAQ added: ' + id + ' — ' + left + ' left', '<p><b>' + String(e.question || id).replace(/[<>]/g, '') + '</b></p><p>FAQ added (5 pairs), grade ' + before.score + ' &rarr; ' + after.score + '.</p><p><a href="' + url + '">' + url + '</a></p><p><b>Countdown:</b> ' + done + ' done, <b>' + left + ' remaining</b> in this run.</p>');
        console.log(`  [${done}/${targets.length}] ${id} ${before.score}->${after.score} | ${left} left`);
        await sleep(PACE_MS);
      } catch (err) { fail++; console.log('  ERR', id, err.message); }
    }
  }
  await Promise.all(Array.from({ length: CONC }, work));
  console.log(`GEMINI FAQ DONE prefixes=[${PRE}] targets=${targets.length} done=${done} skipped=${skip} failed=${fail}`);
  fs.writeFileSync('C:/Users/koryj/website/_faq_gemini_result.json', JSON.stringify({ pre: PRE, targets: targets.length, done, skip, fail, at: Date.now() }, null, 1));
})().catch(e => { console.error('FATAL', e && e.stack); process.exit(1); });
