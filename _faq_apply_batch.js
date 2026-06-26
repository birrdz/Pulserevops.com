// Apply Claude-authored FAQs to the live blob. Input: JSON map { id: "## FAQ\n\n**Q?**\nA\n..." }.
// Validates (>=5 bold-question pairs, no banned words), inserts before ## Sources,
// re-grades (skips on regression), saves to blob, pings IndexNow. Idempotent.
// Usage: node _faq_apply_batch.js <inputJson>
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
try { const e = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of e.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const IN = process.argv[2] || 'C:/Users/koryj/website/faq_out.json';
const prefixOf = id => { const m = String(id).match(/^([a-z]+)/i); return m ? m[1].toLowerCase() : '?'; };
const ROUTE = { q: '/knowledge/', ik: '/industry-kpis/', st: '/sales-trainings/', gb: '/graphics/', sp: '/speeches/', fr: '/franchises/', ra: '/revenue-architecture/', gp: '/go-to-market-playbooks/', tk: '/tech-stacks/' };
const hasFAQ = a => /^#{2,4}\s*(\d+[.)]\s*)?(FAQ|Frequently Asked)/im.test(a);
const BANNED = /\b(delve|tapestry|landscape|holistic|ever-evolving|synerg|paradigm shift|game-changer|cutting-edge|state-of-the-art|seamless integration|drive growth|unlock (value|potential)|needless to say)\b|in today's|it's worth noting|it's important to note/i;
function cleanFaq(text) { let t = String(text || '').trim(); t = t.replace(/^```(?:markdown)?\s*/i, '').replace(/```\s*$/i, '').trim(); const i = t.search(/^##\s*FAQ/im); if (i > 0) t = t.slice(i); if (!/^##\s*FAQ/im.test(t)) t = '## FAQ\n\n' + t; return t.trim(); }
function insertFaq(body, faq) { const b = body.replace(/\s+$/, ''); const lines = b.split(/\r?\n/); let at = lines.findIndex(l => /^#{2,3}\s*Sources\b/i.test(l)); if (at < 0) at = lines.findIndex(l => /^#{2,3}\s*Bottom Line\b/i.test(l)); if (at < 0) return b + '\n\n' + faq + '\n'; return lines.slice(0, at).join('\n').replace(/\s+$/, '') + '\n\n' + faq + '\n\n' + lines.slice(at).join('\n'); }
(async () => {
  const map = JSON.parse(fs.readFileSync(IN, 'utf8'));
  const ids = Object.keys(map);
  let done = 0, skip = 0, fail = 0;
  for (const id of ids) {
    try {
      const faqRaw = map[id];
      const c = cleanFaq(faqRaw);
      const pairs = (c.match(/^\s*\*\*[^*\n]+\?\*\*/gm) || []).length;
      if (pairs < 5) { fail++; console.log('  FAIL(pairs<5)', id); continue; }
      if (BANNED.test(c)) { fail++; console.log('  FAIL(banned)', id); continue; }
      const e = await s.get('answers/' + id + '.json', { type: 'json' });
      if (!e || !e.answer) { fail++; console.log('  FAIL(noentry)', id); continue; }
      if (hasFAQ(e.answer)) { skip++; console.log('  SKIP(hasFAQ)', id); continue; }
      const before = gradeEntry(id, e.answer);
      const newBody = insertFaq(e.answer, c);
      const after = gradeEntry(id, newBody);
      if (after.score < before.score) { skip++; console.log('  SKIP(regress)', id, before.score + '->' + after.score); continue; }
      e.answer = newBody; e.ts = Date.now(); e.polished_at = Date.now();
      await s.setJSON('answers/' + id + '.json', e);
      try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }), signal: AbortSignal.timeout(8000) }); } catch (e) {}
      done++;
      console.log(`  [ok] ${id} ${before.score}->${after.score}`);
    } catch (err) { fail++; console.log('  ERR', id, err.message); }
  }
  console.log(`APPLY DONE: done=${done} skip=${skip} fail=${fail} of ${ids.length}`);
  fs.appendFileSync('C:/Users/koryj/website/_faq_claude_progress.log', `${new Date().toISOString()} applied done=${done} skip=${skip} fail=${fail}\n`);
})().catch(e => { console.error('FATAL', e && e.stack); process.exit(1); });
