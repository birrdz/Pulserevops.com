// Reads CRO tl entries from the blob for auditing. Usage: node _cro_audit_read.js <startId> <count>
const fs = require('fs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const { getStore } = require('@netlify/blobs');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

(async () => {
  const start = parseInt(process.argv[2], 10);
  const count = parseInt(process.argv[3] || '40', 10);
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK, consistency: 'strong' });
  const outDir = process.argv[4] || 'C:/Users/koryj/AppData/Local/Temp/claude/cro_audit';
  fs.mkdirSync(outDir, { recursive: true });
  const summary = [];
  for (let i = 0; i < count; i++) {
    const id = 'tl' + (start + i);
    let entry;
    try { entry = await store.get('answers/' + id + '.json', { type: 'json' }); } catch (e) { entry = null; }
    if (!entry) { summary.push({ id, exists: false }); continue; }
    const body = entry.answer || '';
    fs.writeFileSync(outDir + '/' + id + '.md', body, 'utf8');
    // quick checks
    const lines = body.split(/\r?\n/);
    const line1 = (lines[0] || '').trim();
    const title = entry.question || entry.title || '';
    summary.push({
      id, exists: true,
      title,
      titleYear: /in 2027\b/i.test(title),
      line1Image: /^!\[/.test(line1),
      hasAnswerCard: /```answer/.test(body),
      hasSteps: /```steps/.test(body),
      hasCompare: /```compare/.test(body),
      calloutCount: (body.match(/```callout/g) || []).length,
      banned: (body.match(/\b(landscape|delve|dive into|tapestry|seamless|cutting-edge|state-of-the-art)\b/gi) || []),
      croSyndicate: /crosyndicate\.com/i.test(body),
      words: body.split(/\s+/).filter(Boolean).length,
    });
  }
  fs.writeFileSync(outDir + '/_summary.json', JSON.stringify(summary, null, 2), 'utf8');
  console.log(JSON.stringify(summary, null, 1));
})();
