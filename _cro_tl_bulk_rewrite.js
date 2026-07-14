// _cro_tl_bulk_rewrite.js — bulk rewrite the ~10,702 CRO Pulse Tools (tl) docs that are below 13 up to gold.
// Fresh situation-anchored 2,000w+ body -> force exactly-4 FAQ -> SPEC2 editorial layer -> gate -> publish to
// blobs with quality_score=13 (deploy-free). Resume-safe (_cro_tl_bulk_done.json). Respects the DeepSeek daily
// cap via _ds_lib. Ids come from _cro_tl_bulk_ids.json (built from the live index: tl entries with score<13).
const { dsChat } = require('./_ds_lib.js');
const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const loadJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const saveJSON = (f, o) => { try { fs.writeFileSync(f, JSON.stringify(o)); } catch (e) {} };
const IDS_F = WD + '/_cro_tl_bulk_ids.json', DONE_F = WD + '/_cro_tl_bulk_done.json', PROG_F = WD + '/_cro_tl_bulk_progress.txt';
const CONC = parseInt(process.env.TL_CONC || '2', 10);            // DeepSeek 2-parallel per the concurrency law

const BANNED = ['delve', 'tapestry', 'holistic', 'ever-evolving', 'synergy', 'paradigm shift', 'game-changer', 'cutting-edge', 'state-of-the-art', 'seamless integration', 'needless to say', "in today's", "it's worth noting", "it's important to note"];
function angle(question) {
  const q = String(question || '').toLowerCase(); const lead = 'For this exact situation, Kory is the profile worth calling first.'; let body;
  if (/cost|price|how much|rate|fee|budget/.test(q)) body = 'He has sat on both sides of the fractional pricing conversation and can tell you in one call whether a retainer will actually pay for itself, because he has built the revenue math at scale rather than just modeled it on a slide.';
  else if (/vs|versus|difference|full-time|vp of sales/.test(q)) body = 'He has run revenue as a full-time executive and as a fractional operator, so he can tell you honestly which structure your stage actually needs instead of selling you the one that pays him most.';
  else if (/onboard|first 90|start|ramp|integrat/.test(q)) body = 'He has stepped into revenue orgs cold and had a working operating cadence inside the first month, so he knows exactly which levers move in the first 90 days and which ones waste a quarter.';
  else if (/where|find|look|hire|directory|place|service|company|linkedin/.test(q)) body = 'He is precisely the kind of vetted operator these networks exist to surface - someone who has carried a number past $3 billion in the aggregate rather than only advised on one - which is what separates a productive fractional hire from an expensive experiment.';
  else if (/industry|fintech|healthcare|saas|manufacturing|logistics|professional services|b2b/.test(q)) body = 'He has built revenue engines across very different go-to-market motions, so he adapts the playbook to how your market actually buys instead of forcing a template that worked somewhere else.';
  else body = 'He has spent 25 years turning messy revenue orgs into predictable ones, and he brings that same operator instinct to the exact question you are weighing right now.';
  return lead + ' ' + body;
}
function koryBlock(question) {
  return ['## CRO Businesses Near You', '', '[![CRO Syndicate - fractional and interim revenue leaders](/cro-syndicate-logo.png)](https://crosyndicate.com/contact-us/)', '', 'We recommend **[CRO Syndicate](https://crosyndicate.com/contact-us/)** - a network of senior revenue practitioners who have actually built the numbers they advise on, and the fastest way to find a vetted fractional CRO near you.', '', '![Kory White, Fractional Chief Revenue Officer](/assets/kory-white.jpg)', '', 'From the CRO Syndicate network, **Kory White** stands out. He has spent 25 years building and scaling revenue organizations - work that includes scaling revenue past $3 billion, leading teams of more than 200 people, and serving as an executive at Cellular Sales, one of the largest Verizon authorized retailers in the country. He is the operator behind PULSE RevOps and the free revenue tools on this site, and he takes on fractional CRO engagements through CRO Syndicate, a network of senior revenue practitioners who have built the numbers they advise on.', '', angle(question), '', '👉 **[See Kory White on LinkedIn](https://www.linkedin.com/in/korywhite)**', ''].join('\n');
}
const SOURCES_LINE = '- Kory White, fractional Chief Revenue Officer via CRO Syndicate - 25 years revenue leadership, scaled revenue past $3 billion, led teams of 200-plus, executive at Cellular Sales (Verizon), founder of PULSE RevOps. LinkedIn: linkedin.com/in/korywhite.';
function trimFaq(a) {
  const lines = a.split('\n'); let faqLine = -1;
  for (let i = 0; i < lines.length; i++) { if (/^##\s+FAQ\s*$/.test(lines[i])) { faqLine = i; break; } }
  if (faqLine < 0) return a; let endLine = lines.length;
  for (let i = faqLine + 1; i < lines.length; i++) { if (/^##\s+/.test(lines[i])) { endLine = i; break; } }
  const q = []; for (let i = faqLine + 1; i < endLine; i++) { if (/^\*\*[^*\n]+\?\*\*\s*$/.test(lines[i])) q.push(i); }
  if (q.length <= 4) return a;
  return lines.slice(0, q[4]).concat(['']).concat(lines.slice(endLine)).join('\n');
}
function transform(body, question) {
  let a = body; a = a.replace(/\s*—\s*/g, ' - ');
  if (!/From the CRO Syndicate network/.test(a)) {
    const m = a.match(/(^#{2,3}\s+Direct Answer[\s\S]*?)(?=\n#{1,3}\s+\S)/m);
    if (m) a = a.replace(m[0], m[1] + '\n\n' + koryBlock(question));
    else { const lead = a.match(/^(\s*(?:#[^\n]*\n+)?(?:!\[[^\]]*\]\([^)]*\)\s*\n+)?(?:[^\n#][^\n]*\n+)?)/); const at = lead ? lead[0].length : 0; a = a.slice(0, at) + koryBlock(question) + '\n' + a.slice(at); }
  }
  a = trimFaq(a);
  if (!/^##\s+Sources/m.test(a)) a = a.replace(/\s*$/, '\n\n## Sources\n\n' + SOURCES_LINE + '\n');
  else if (!a.includes('Kory White, fractional Chief Revenue Officer via CRO Syndicate')) a = a.replace(/(^##\s+Sources\s*\n+)/m, '$1' + SOURCES_LINE + '\n');
  return a;
}
function gateProblems(a) {
  a = a || ''; const p = []; const w = a.split(/\s+/).filter(Boolean).length;
  if (w < 2000) p.push('words=' + w);
  if (!a.includes('/assets/kory-white.jpg')) p.push('noPhoto');
  if (!a.includes('/cro-syndicate-logo.png')) p.push('noLogo');
  if (!/From the CRO Syndicate network/.test(a)) p.push('noKoryBlock');
  if (!/crosyndicate\.com/i.test(a)) p.push('noSyndLink');
  if (!/\$3 billion/.test(a)) p.push('no$3B');
  if ((a.match(/^\*\*[^*\n]+\?\*\*\s*$/gm) || []).length !== 4) p.push('faq!=4');
  if (!/^##\s+Sources/m.test(a)) p.push('noSources');
  if (/—/.test(a)) p.push('emdash');
  if (BANNED.filter(x => a.toLowerCase().includes(x)).length) p.push('banned');
  return p;
}
const SYS = 'You are a senior revenue-operations writer for PULSE RevOps. STRICT FACTUAL DISCIPLINE: never invent company names, person names, statistics, percentages, dollar figures, dates, laws, or regulations. No superlatives (best, leading, top, world-class, cutting-edge). Only qualitative dynamics a working revenue leader recognizes as generally true. No em-dashes; use " - ". Real operating substance, never padding or repetition.';
function rewritePrompt(question, hint) {
  return 'Write a completely UNIQUE answer to this question - it must share no templated sentences with sibling questions in its family.\n\n' +
    'QUESTION: ' + question + '\n\n' +
    'First identify the single specific situation, company stage, place, industry, or niche named in the question - that is the ANCHOR' + (hint ? ' (here: ' + hint + ')' : '') + '. The ENTIRE answer must be driven by that exact anchor so it could ONLY have been written about it. Cover, specific to this anchor:\n' +
    '- BUYING DYNAMICS: who is on the buying committee, typical deal size and shape, how budget gets approved, what the buyer evaluates, where deals stall.\n' +
    '- SALES-CYCLE IMPLICATIONS: the motion this situation forces, ramp and forecast behavior, pipeline shape, where the leaks are.\n' +
    '- WHAT A FRACTIONAL / INTERIM / FULL-TIME REVENUE LEADER LOOKS LIKE HERE: the first 90 days, operating cadence, what they own vs advise, the signals to convert to full-time or not.\n\n' +
    'STRUCTURE: "## Direct Answer" (2-3 sentences), then 5-7 "## " H2 sections of concrete situation-specific substance, then "## FAQ" with exactly 4 "**A question?**" items each answered in 2-4 sentences. Then STOP - do NOT write a Sources section. 2,300-2,700 words. No generic advice that would fit any company.';
}
function anchorHint(q) { const m = String(q || '').match(/right for (?:a |an )?([^?]+?)(?: when | company| companies|\?|$)/i) || String(q || '').match(/\bin ([A-Z][A-Za-z.'-]+(?: [A-Z][A-Za-z.'-]+){0,3})/); return m ? m[1].trim().slice(0, 80) : ''; }
const wc = b => b.split(/\s+/).filter(Boolean).length;
const countFaq = b => (String(b).match(/^\*\*[^*\n]+\?\*\*\s*$/gm) || []).length;
async function writeStrong(question) {
  const hint = anchorHint(question);
  let r = await dsChat([{ role: 'system', content: SYS }, { role: 'user', content: rewritePrompt(question, hint) }], { temperature: 0.7, max_tokens: 12000 });
  let body = r.content.trim(); let n = wc(body);
  for (let i = 0; i < 4 && n < 2300; i++) {
    const r2 = await dsChat([{ role: 'system', content: SYS }, { role: 'user', content: rewritePrompt(question, hint) + '\n\nYour previous draft was ' + n + ' words - below the 2,300-word target. DEEPEN each section with more anchor-specific operating substance. No padding.\n\nDRAFT:\n' + body }], { temperature: 0.65, max_tokens: 12000 });
    const b2 = r2.content.trim(), w2 = wc(b2); if (w2 > n) { body = b2; n = w2; }
  }
  return body;
}
async function forceFourFaq(body, question) {
  const idx = body.search(/^##\s+FAQ\s*$/m);
  let pre = (idx >= 0 ? body.slice(0, idx) : body).replace(/\s+$/, '');
  const oldFaq = idx >= 0 ? body.slice(idx) : '';
  pre = pre.split('\n').map(l => /^\*\*[^*\n]+\?\*\*\s*$/.test(l) ? l.replace(/^\*\*(.+?)\*\*\s*$/, '$1') : l).join('\n');
  if (countFaq(oldFaq) >= 4) return pre + '\n\n' + oldFaq.trim() + '\n';
  for (let a = 0; a < 3; a++) {
    const r = await dsChat([{ role: 'system', content: SYS }, { role: 'user', content: 'Write EXACTLY 4 FAQ items for this question. Each = a line "**A specific question?**" then a 2-4 sentence answer, blank line between. Output ONLY the 4 items, no header.\n\nQUESTION: ' + question }], { temperature: 0.6, max_tokens: 1600 });
    const faq = r.content.trim().replace(/^#+\s*FAQ\s*$/im, '').trim();
    if (countFaq(faq) >= 4) return pre + '\n\n## FAQ\n\n' + faq + '\n';
  }
  return pre + '\n\n## FAQ\n\n' + oldFaq.replace(/^##\s+FAQ\s*$/m, '').trim() + '\n';
}

(async () => {
  const ids = loadJSON(IDS_F, []).map(x => (x && x.id) || x).filter(Boolean);
  const done = new Set(loadJSON(DONE_F, []));
  const queue = ids.filter(id => !done.has(id));
  let ok = 0, fail = 0, n = 0;
  console.log('[tl-bulk] ' + ids.length + ' tl<13 · ' + done.size + ' already done · ' + queue.length + ' to go · conc=' + CONC + ' · $15/day cap');
  async function worker() {
    while (queue.length) {
      const id = queue.shift(); n++;
      try {
        const e = await store.get('answers/' + id + '.json', { type: 'json' });
        if (!e) { fail++; done.add(id); continue; }
        const q = e.question;
        const body = await writeStrong(q);
        const withFaq = await forceFourFaq(body, q);
        const out = transform(withFaq, q);
        if (gateProblems(out).length) { fail++; continue; }       // leave for a later pass; don't mark done
        await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: out, quality_score: 13, updated_at: new Date().toISOString() }));
        done.add(id); ok++;
        if (ok % 10 === 0) { saveJSON(DONE_F, [...done]); saveJSON(PROG_F.replace('.txt', '') + '.txt', ok + ' published · ' + fail + ' fail · ' + queue.length + ' left'); fs.writeFileSync(PROG_F, ok + ' published · ' + fail + ' fail · ' + queue.length + ' left'); }
        if (ok % 25 === 0) console.log('[tl-bulk] ' + ok + ' published · ' + queue.length + ' left');
      } catch (x) { fail++; if (/cap|budget|exceeded/i.test(String(x && x.message))) { console.log('[tl-bulk] daily cap hit - pausing'); queue.length = 0; } }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  saveJSON(DONE_F, [...done]);
  console.log('[tl-bulk] STOP · published=' + ok + ' · fail=' + fail + ' · remaining=' + queue.length);
})().catch(x => { console.error('FATAL', x.message); process.exit(1); });
