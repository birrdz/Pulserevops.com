// new/generate.js — THE NEW PIPELINE (2026-07-15). Clean-room rebuild. No images, no titles baked.
// Takes ONE question → writes a 2500-word golden Q&A with Claude Max → scores it to 3/3
// (① unique  ② quality 10/10  ③ gate 13/13 text). Stores a clean text-only entry.
// The owner finishes it to 5/5 in the Block Builder (face card, page-2 layout, body images).
'use strict';
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
let claudeChat = null; try { ({ claudeChat } = require('../_claude_chat')); } catch (e) {}
let dsChat = null; try { ({ dsChat } = require('../_ds_lib')); } catch (e) {}

const DIR = __dirname + '/entries';
fs.mkdirSync(DIR, { recursive: true });
const GATE = 'http://localhost:8899/gate-publish';
// image/media checks the gate waives — the NEW pipeline is TEXT-ONLY; images are the owner's manual step
const WAIVE = new Set(['heroImage', 'faceCardApplicable', 'pollinatorFaceCover', 'pollinatorInternalFlux', 'media3to10', 'imagesLaw', 'top10Images', 'rankingListMaster', 'score12']);

const SYS = [
  'You are a senior RevOps editor writing a golden-standard Q&A essay for pulserevops.com. Output COMPLETE markdown ONLY — no preamble, no code fence, NO image markdown at all (images are added later by hand). Structure, in this exact order:',
  '## Direct Answer', '<2-4 sentences, 160+ chars, answering directly>', '<one intro paragraph>',
  '## <depth section 1 as a searchable sub-question>', '<2+ paragraphs>',
  '(4-6 total "## " depth sections. Place EXACTLY 2 ```mermaid diagrams inside two of them. Weave 2-3 links to https://pulserevops.com/knowledge/<id>.)',
  '## Related questions', '### <question>?', '<=50-word answer', '(3-5 pairs)',
  '## FAQ', '**<question>?**', '<answer>', '(AT LEAST 6 pairs)',
  '## Sources', '- [name](https://url)', '(5-10 real named sources)',
  '## Related on PULSE', '- [related](https://pulserevops.com/knowledge/<id>)', '(3-5 links)',
  'MERMAID SAFETY (critical — the gate rejects broken diagrams): inside [ ] node labels use PLAIN text only — letters, numbers, spaces. NEVER put / ( ) ~ + : ; " or other punctuation inside a node label (they break the parser). Say "and" not "/", "approx" not "~", "plus" not "+". Keep each diagram simple and valid.',
  'HARD RULES: minimum 2500 words of genuine substance. Never fabricate prices/stats/vendors. Output only markdown starting at "## Direct Answer".',
].join('\n');
// TOP-10 golden template (aq1158 shape) — comparison essay, NOT a raw ranked product list
const SYS_TOP10 = [
  'You are a senior editor writing a golden Top-10 for pulserevops.com — match your voice to the TOPIC (boats, cars, tools, whatever it is), not a fixed niche. Output COMPLETE markdown ONLY — no preamble, no code fence, NO image markdown (images are added later by hand). Structure, in this exact order:',
  '## Direct Answer', '<2-4 sentences, 160+ chars, naming the overall best pick + runner-up and why>', '<intro paragraph>',
  '## The Top 10',
  '<A numbered list of EXACTLY 10 REAL, specifically-named items — real organizations/brands/products, never placeholders. Each line EXACTLY: "N. **Real Name** — one-sentence why it ranks here." Rank #1 best to #10. These names are shown to the editor to attach images, so they MUST be real and specific.>',
  '## How we chose', '<criteria prose>',
  '(Then 3-4 "## " depth sections comparing the field. Place EXACTLY 2 ```mermaid diagrams inside depth sections. Weave 2-3 links to https://pulserevops.com/knowledge/<id>.)',
  '## Related questions', '### <question>?', '<=50-word answer', '(3-5 pairs)',
  '## FAQ', '**<question>?**', '<answer>', '(AT LEAST 6 pairs)',
  '## Sources', '- [name](https://url)', '(5-10 real named sources)',
  '## Related on PULSE', '- [related](https://pulserevops.com/knowledge/<id>)', '(3-5 links)',
  'MERMAID SAFETY (critical — the gate rejects broken diagrams): inside [ ] node labels use PLAIN text only — letters, numbers, spaces. NEVER put / ( ) ~ + : ; " or other punctuation inside a node label. Keep each diagram simple and valid.',
  'HARD RULES: minimum 2500 words. Exactly 10 real named items (never Top 20/50/100, never placeholders like "Company A"). Never fabricate prices/stats. Output only markdown starting at "## Direct Answer".',
].join('\n');
const CHECK_HELP = { faq6: 'FAQ needs 6+ **bold question?** pairs.', mermaid2: 'Include EXACTLY 2 ```mermaid diagrams.', mermaidClean: 'Close both mermaid blocks.', sources5: 'Sources needs 5-10 real named links.', relatedPulse: 'Add "## Related on PULSE" 3-5 links.', directAnswer: 'Keep "## Direct Answer" first.', directAnswerFull: 'Direct Answer 2+ sentences, 160+ chars.', qaGoldOutline: 'Order: Direct Answer → depth → Related questions → FAQ → Sources → Related on PULSE.', words2000: 'Expand to 2500+ words.', linksClean: 'Well-formed knowledge links.' };
// live pipeline status the Block Builder dashboard reads (shows entries going through 1-2-3)
const STATUS_F = __dirname + '/pipeline_status.json';
function setStatus(o) { try { const cur = (() => { try { return JSON.parse(fs.readFileSync(STATUS_F, 'utf8')); } catch (e) { return { active: [] }; } })(); cur.active = (cur.active || []).filter(x => x.id !== o.id); if (!o.done) cur.active.unshift(o); cur.updated = new Date().toISOString(); fs.writeFileSync(STATUS_F, JSON.stringify(cur, null, 1)); } catch (e) {} }

const wc = b => String(b || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
async function write(msgs) {
  if (claudeChat) { try { const r = await claudeChat(msgs, { timeoutMs: 200000 }); const t = typeof r === 'string' ? r : (r && (r.content || r.text)) || ''; if (t && t.length > 400) return t; } catch (e) { console.log('  (claude:', e.message + ')'); } }
  if (dsChat) { try { const r = await dsChat(msgs, { max_tokens: 8000, temperature: 0.75 }); return (r && r.content) || ''; } catch (e) {} }
  return '';
}
async function gate(id, body, question) {
  const r = await fetch(GATE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: '4444', id, body, title: question, question, simMode: true, dryRun: true }), signal: AbortSignal.timeout(120000) });
  return await r.json();
}
const contentOk = g => g && g.ok !== false && (g.pass || ((g.failed || []).length > 0 && (g.failed || []).every(c => WAIVE.has(c))));
// SECOND GATE (owner 2026-07-16): a real read-through so no FAKE 3/3 slips past the structural gate.
// Claude actually reads it for typos, grammar, broken markdown, cut-off sentences, placeholder text,
// fabricated stats. Returns { clean, issues[] }. Only clean + gate-pass earns 3/3.
async function auditClean(question, body) {
  const sys = 'You are a strict copy editor doing a final proofread of a published Q&A article. Report ONLY genuine defects: spelling/typos, grammar errors, broken or malformed markdown, unclosed ```mermaid blocks, sentences that are cut off or incomplete, leftover placeholder text (e.g. "Company A", "[insert]", "TODO", "lorem"), or clearly fabricated/implausible specific stats. Do NOT nitpick style. Output ONLY JSON: {"clean": true|false, "issues": ["short issue", ...]}. If it reads clean and publish-ready, return clean:true with an empty issues array.';
  const user = 'QUESTION: ' + question + '\n\nARTICLE:\n' + String(body || '');
  let t = '';
  try { if (claudeChat) { const r = await claudeChat([{ role: 'system', content: sys }, { role: 'user', content: user }], { timeoutMs: 120000 }); t = typeof r === 'string' ? r : (r && (r.content || r.text)) || ''; } } catch (e) { console.log('  (audit claude:', e.message + ')'); }
  if (!t && dsChat) { try { const r = await dsChat([{ role: 'system', content: sys }, { role: 'user', content: user }], { max_tokens: 500, temperature: 0.1 }); t = (r && r.content) || ''; } catch (e) {} }
  try { const m = t.match(/\{[\s\S]*\}/); if (m) { const o = JSON.parse(m[0]); return { clean: !!o.clean, issues: Array.isArray(o.issues) ? o.issues : [], ran: true }; } } catch (e) {}
  return { clean: false, issues: ['proofread audit could not run — needs human review'], ran: false }; // strict: no audit = not a clean 3/3
}
const typeOf = q => /\btop\s*\d|\bbest\b|\branked\b|\blist\b/i.test(String(q || '')) ? 'top10' : 'essay';

(async () => {
  const question = process.argv.slice(2).join(' ') || 'How do you structure OTE for a 6-person SDR team in 2027?';
  const id = process.env.GEN_FORCE_ID || ('new' + Date.now().toString(36));   // in-place upgrade → reuse existing id
  const fmt = (process.env.GEN_FORCE_FORMAT === 'essay' || process.env.GEN_FORCE_FORMAT === 'top10') ? process.env.GEN_FORCE_FORMAT : typeOf(question); // force overrides auto-detect
  const sys = fmt === 'top10' ? SYS_TOP10 : SYS;
  console.log('▶ NEW PIPELINE · id', id, '· format', fmt, '\n  Q:', question);
  const stg = { unique: 'done', quality: 'active', gate: 'pending' };   // unique = fresh question, passes at birth
  setStatus({ id, question, format: fmt, stage: 'writing', stages: stg });

  // ① write (golden template for the format)
  console.log('① writing golden', fmt, 'page (Claude Max)…');
  let body = await write([{ role: 'system', content: sys }, { role: 'user', content: 'Write the complete golden ' + fmt + ' page for: "' + question + '". Return only the markdown.' }]);
  if (!body || body.length < 800) { console.log('✗ generation failed/short'); setStatus({ id, done: true }); process.exit(1); }
  console.log('  ', wc(body), 'words');
  setStatus({ id, question, format: fmt, stage: 'scoring', stages: stg });

  // ② + ③ gate to 13/13 (content); repair loop up to 4
  console.log('②③ scoring quality 10/10 + gate 13/13…');
  let g = await gate(id, body, question), tries = 0;
  while ((!contentOk(g) || wc(body) < 2500) && tries < 4) {
    tries++;
    const need = (g.failed || []).filter(c => !WAIVE.has(c)).map(c => '- ' + (CHECK_HELP[c] || c));
    if (wc(body) < 2500) need.push('- Expand to 2500+ words.');
    console.log('  repair', tries, '· fixing:', (g.failed || []).filter(c => !WAIVE.has(c)).join(',') || 'length');
    setStatus({ id, question, format: fmt, stage: 'repair ' + tries, stages: stg });
    const nb = await write([{ role: 'system', content: sys }, { role: 'user', content: 'Fix EXACTLY these, keep everything else, never shorten:\n' + need.join('\n') + '\n\nQUESTION: "' + question + '"\n\nPAGE:\n' + body }]);
    if (nb && nb.length > body.length * 0.9) body = nb;
    g = await gate(id, body, question);
  }

  const gateOk = contentOk(g) && wc(body) >= 2500;
  // SECOND GATE — real read-through. One repair on issues, then re-audit. No clean read = no 3/3.
  let audit = { clean: false, issues: [], ran: false };
  if (gateOk) {
    console.log('④ proofreading audit (Claude read-through)…');
    audit = await auditClean(question, body);
    if (audit.ran && !audit.clean && audit.issues.length) {
      console.log('   audit found:', audit.issues.slice(0, 4).join(' · '));
      const nb = await write([{ role: 'system', content: sys }, { role: 'user', content: 'Fix ONLY these proofreading defects, change nothing else, never shorten:\n- ' + audit.issues.join('\n- ') + '\n\nARTICLE:\n' + body }]);
      if (nb && nb.length > body.length * 0.85) { body = nb; g = await gate(id, body, question); }
      audit = await auditClean(question, body);
    }
  }
  const pass = gateOk && audit.clean;
  stg.quality = pass ? 'done' : 'failed'; stg.gate = pass ? 'done' : 'failed';
  setStatus({ id, done: true });                         // leaves the live "in pipeline" list; entry drops into the queue
  const entry = { id, question, format: typeOf(question), body, words: wc(body), gate_score: g.score, status: pass ? '3/3' : 'needs-review', audit: { clean: audit.clean, issues: audit.issues || [] }, stages: { unique: true, quality: contentOk(g), gate: contentOk(g), proofread: audit.clean }, needs: { faceCard: true, pageLayout: true, bodyImages: typeOf(question) === 'top10' ? 10 : 3 }, created: new Date().toISOString(), inPlace: !!process.env.GEN_INPLACE, upgradeId: process.env.GEN_INPLACE ? id : undefined };
  fs.writeFileSync(DIR + '/' + id + '.json', JSON.stringify(entry, null, 1));
  console.log('\n' + (pass ? '✅ 3/3 — gate + proofread clean' : '⚠️ NOT 3/3 (needs-review · ' + (audit.issues || []).slice(0, 3).join('; ') + ')'), '· ' + wc(body) + ' words · format ' + entry.format);
  console.log('   saved new/entries/' + id + '.json');
  console.log('   → Block Builder: you add face card + ' + entry.needs.bodyImages + ' body images + page-2 layout → 5/5');
})().catch(e => { console.log('ERROR', e.message); process.exit(1); });
