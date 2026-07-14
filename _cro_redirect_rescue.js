// _cro_redirect_rescue.js — RESCUE the 8 "301-tier" near-dups from _cro_redirect_manifest.json.
// They were shunted to the manifest ONLY for landing a hair under the 2,000w floor (1875-1986w),
// with NO resolved redirect target ("owner to confirm"). Keeping+expanding them preserves 8 indexed
// pages, needs no target, and ships deploy-free (blob answer rewrite only; ids already in _index.json).
// Mirrors _cro_rewrite_queue.js EXACTLY (SYS, rewritePrompt, SPEC2 transform, gateProblems) but with a
// hard up-to-6-attempt word-floor + expansion loop so each clears 2,000w and the publish gate.
const { dsChat } = require('./_ds_lib.js');
const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const loadJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const saveJSON = (f, o) => { try { fs.writeFileSync(f, JSON.stringify(o, null, 1)); } catch (e) {} };
const REDIR_F = WD + '/_cro_redirect_manifest.json';
const RESCUE_F = WD + '/_cro_redirect_rescued.json';

// ---------- SPEC2 editorial layer (verbatim from _cro_rewrite_queue.js) ----------
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

// ---------- generation (verbatim SYS/rewritePrompt + hard word-floor loop) ----------
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

async function writeStrong(question) {
  const hint = anchorHint(question);
  let r = await dsChat([{ role: 'system', content: SYS }, { role: 'user', content: rewritePrompt(question, hint) }], { temperature: 0.7, max_tokens: 12000 });
  let body = r.content.trim(); let n = wc(body);
  // up to 5 expansion passes toward a 2,300w cushion so SPEC2 trims never drop below the 2,000 floor
  for (let i = 0; i < 5 && n < 2300; i++) {
    const r2 = await dsChat([{ role: 'system', content: SYS }, { role: 'user', content: rewritePrompt(question, hint) + '\n\nYour previous draft was ' + n + ' words - below the 2,300-word target. DEEPEN each section with more anchor-specific operating substance (buying committee mechanics, deal shape, forecast behavior, first-90-day cadence). Do not pad, repeat, or restate. Keep the same structure and the exactly-4-FAQ rule.\n\nDRAFT TO DEEPEN:\n' + body }], { temperature: 0.65, max_tokens: 12000 });
    const b2 = r2.content.trim(), w2 = wc(b2);
    if (w2 > n) { body = b2; n = w2; }
  }
  return { body, n };
}

(async () => {
  const manifest = loadJSON(REDIR_F, []);
  if (!Array.isArray(manifest) || !manifest.length) { console.log('[rescue] manifest empty - nothing to do'); return; }
  const rescued = loadJSON(RESCUE_F, []); const rescuedSet = new Set(rescued.map(r => r.id));
  const remaining = [];
  console.log('[rescue] ' + manifest.length + ' redirect-tier entries -> expand+keep (deploy-free, blob only)');
  for (const item of manifest) {
    const id = item.id;
    if (rescuedSet.has(id)) continue;
    try {
      const e = await store.get('answers/' + id + '.json', { type: 'json' });
      if (!e) { console.log('[rescue] ✖ ' + id + ' no blob'); remaining.push(item); continue; }
      const q = e.question || item.question;
      const { body, n } = await writeStrong(q);
      const out = transform(body, q);
      const probs = gateProblems(out);
      if (probs.length) { console.log('[rescue] ⚠ ' + id + ' STILL failing gate ' + JSON.stringify(probs) + ' (raw ' + n + 'w) - kept in manifest'); remaining.push(item); continue; }
      await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: out, quality_score: Math.max(e.quality_score || 0, 13), updated_at: new Date().toISOString() }));
      const finalW = out.split(/\s+/).filter(Boolean).length;
      rescued.push({ id, question: q, words: finalW, was: item.reason });
      saveJSON(RESCUE_F, rescued);
      console.log('[rescue] ✓ ' + id + ' published ' + finalW + 'w (was ' + item.reason + ')');
    } catch (x) { console.log('[rescue] ✖ ' + id + ' ' + (x && x.message)); remaining.push(item); }
  }
  saveJSON(REDIR_F, remaining);
  console.log('\n[rescue] DONE · rescued=' + rescued.length + ' · still-in-manifest=' + remaining.length);
})().catch(x => { console.error('FATAL', x.message); process.exit(1); });
