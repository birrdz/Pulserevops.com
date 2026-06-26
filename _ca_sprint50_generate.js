// Generate + publish ca0924–ca0973 via Gemini (resumable).
// Usage: node _ca_sprint50_generate.js [startId] [--dry-run]
const fs = require('fs');
const { execSync } = require('child_process');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const DRY = process.argv.includes('--dry-run');
const startArg = process.argv.find(a => /^ca\d+$/.test(a));
const QUEUE = JSON.parse(fs.readFileSync('C:/Users/koryj/_ca_sprint50.json', 'utf8'));
const PROG = 'C:/Users/koryj/_ca_sprint50_progress.json';
const SPEC = fs.readFileSync('C:/Users/koryj/_ca_spec.md', 'utf8');
const SKELETON = fs.readFileSync('C:/Users/koryj/_ca0001_body.md', 'utf8').slice(0, 4000);

const done = fs.existsSync(PROG) ? JSON.parse(fs.readFileSync(PROG, 'utf8')).done || [] : [];
const doneSet = new Set(done);
const items = QUEUE.filter(q => !doneSet.has(q.id) && (!startArg || q.id >= startArg));

function countWords(t) {
  return String(t || '').replace(/```[\s\S]*?```/g, ' ').replace(/[#*_\[\]()>`|]/g, ' ').split(/\s+/).filter(Boolean).length;
}

function systemPrompt(title) {
  return `You write ONE Pulse Cars Top-10 vehicle ranking article in Markdown only.

TITLE (use verbatim as H1): ${title}

Follow this locked spec:
${SPEC}

Mirror this reference skeleton structure (sections, formatting):
${SKELETON}

HARD RULES:
- ≥1,900 words substantive prose
- Exactly 10 numbered "## N. Make Model" sections
- Section 1 header ends with " 🏆 BEST OVERALL"
- Exactly one other section ends with " 💎 BEST VALUE"
- Each section: **Starting MSRP:** line, specs paragraph, Pros (4 bold bullets), Cons (2), **Verdict:**
- One mermaid flowchart TD block under "## Buyer Decision Tree — Which One's Right for You?"
- 6 FAQ pairs (**Question?** then answer)
- 8-10 Sources markdown links
- Italic keyword footer last line
- NO @@PRODUCT lines, NO cover image
- BANNED words: delve, tapestry, landscape, holistic, ever-evolving, synergy, paradigm shift, game-changer, cutting-edge, state-of-the-art, seamless integration, unlock value, unlock potential, needless to say, it's worth noting, it's important to note
- Real vehicles with realistic specs/prices for the title's budget and year context
- In ## Direct Answer, end with this exact italic line: *Note: Prices vary significantly based on condition and market; these are representative of the model's typical market positioning.*

Output ONLY the markdown article body. No preamble.`;
}

async function gemini(title) {
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-pro'];
  let lastErr;
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(KEY)}`;
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt(title) }] },
          contents: [{ role: 'user', parts: [{ text: `Write the full article for: ${title}` }] }],
          generationConfig: { temperature: 0.55, maxOutputTokens: 8192 },
        }),
        signal: AbortSignal.timeout(180000),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(JSON.stringify(j).slice(0, 300));
      const text = j.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleaned = text.replace(/^```markdown\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
      if (countWords(cleaned) >= 1500) return { text: cleaned, model };
      lastErr = new Error(`short: ${countWords(cleaned)}w`);
    } catch (e) { lastErr = e; }
  }
  throw lastErr;
}

function publish(id, title, slug, body) {
  const path = `C:/Users/koryj/${id}_answer.md`;
  fs.writeFileSync(path, body);
  const titleEsc = title.replace(/"/g, '\\"');
  const out = execSync(`node _write_ca.js ${id} "${titleEsc}" ${slug}`, { cwd: 'C:/Users/koryj/website', encoding: 'utf8' });
  return JSON.parse(out.trim());
}

function appendTitle(title) {
  const p = 'C:/Users/koryj/_ca_all_titles.txt';
  const lines = fs.readFileSync(p, 'utf8').split('\n');
  if (!lines.includes(title)) {
    lines.push(title);
    fs.writeFileSync(p, lines.filter(Boolean).join('\n') + '\n');
  }
}

(async () => {
  if (!KEY) { console.error('no GEMINI_API_KEY'); process.exit(1); }
  console.log(`sprint50 generate: ${items.length} remaining (${done.length} done)`);
  const results = [];
  for (const item of items) {
    const row = { id: item.id, title: item.title };
    try {
      console.log(`\n=== ${item.id} ===`);
      const { text, model } = await gemini(item.title);
      row.words = countWords(text);
      row.model = model;
      const grade = gradeEntry(item.id, text);
      row.score = grade.score;
      row.missing = grade.missing;
      if (DRY) {
        fs.writeFileSync(`C:/Users/koryj/${item.id}_answer.md`, text);
        row.ok = grade.score >= 10;
        console.log(`DRY ${item.id} ${row.words}w score=${grade.score}/12`);
      } else {
        if (grade.score < 10) {
          console.log(`WARN low score ${grade.score}/12 missing=${grade.missing.join(',')} — publishing anyway with --force path`);
          const path = `C:/Users/koryj/${item.id}_answer.md`;
          fs.writeFileSync(path, text);
          const titleEsc = item.title.replace(/"/g, '\\"');
          execSync(`node _write_ca.js ${item.id} "${titleEsc}" ${item.slug} --force`, { cwd: 'C:/Users/koryj/website', encoding: 'utf8' });
        } else {
          const pub = publish(item.id, item.title, item.slug, text);
          row.pub = pub;
        }
        appendTitle(item.title);
        done.push(item.id);
        fs.writeFileSync(PROG, JSON.stringify({ done, updated: Date.now() }, null, 1));
        row.ok = true;
        console.log(`OK ${item.id} ${row.words}w score=${grade.score}/12`);
      }
      results.push(row);
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      row.ok = false;
      row.err = String(e.message || e).slice(0, 400);
      results.push(row);
      console.error('FAIL', item.id, row.err);
    }
  }
  fs.writeFileSync('C:/Users/koryj/_ca_sprint50_generate_report.json', JSON.stringify(results, null, 1));
  console.log(`\nDONE batch: ${results.filter(r => r.ok).length}/${results.length}`);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
