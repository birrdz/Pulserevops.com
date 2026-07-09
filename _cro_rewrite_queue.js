// _cro_rewrite_queue.js — PHASE 1 FULL near-dup rewrite (346 = 218 Phase-0 + 128 original).
// Situation-anchored rewrite -> 2,000+ words real substance -> re-uniqueness check (30% gate vs the
// in-batch rewritten corpus) -> SPEC2 editorial layer (Kory block) -> gate -> publish to blobs (NO deploy).
// Un-clearable (can't hit 2,000w or can't clear 30% after a retry) -> 301 manifest (owner approves the
// list before any redirect ships; nothing is redirected here). Resume-safe registry + dashboard breadcrumbs.
// Facts-discipline: no invented company/person names, stats, %, $, dates, laws, superlatives.
const { dsChat } = require('./_ds_lib.js');
const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const loadJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const saveJSON = (f, o) => { try { fs.writeFileSync(f, JSON.stringify(o)); } catch (e) {} };
// QUEUE=neardup (default, the 346) or QUEUE=stubs (Phase 2, the 416 short entries -> full writes)
const QUEUE = process.env.QUEUE === 'stubs' ? 'stubs' : 'neardup';
const SFX = QUEUE === 'stubs' ? '_stub' : '';
const DONE_F = WD + '/_cro_rewrite' + SFX + '_done.json';
const REDIR_F = WD + '/_cro_redirect' + SFX + '_manifest.json';
const DEFER_F = WD + '/_cro_rewrite' + SFX + '_deferred.json';
const PROG_F = '_cro_rewrite' + SFX + '_progress.txt';
const PHASE_LABEL = QUEUE === 'stubs' ? 'STUB WRITES' : 'NEAR-DUP REWRITE';

// ---------- SPEC2 editorial layer (mirrors _fcro_spec2_batch.js) ----------
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

// ---------- uniqueness ----------
function normSentence(s) { return s.toLowerCase().replace(/https?:\/\/\S+/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[[^\]]*\]\([^)]*\)/g, ' ').replace(/[*_`#>|]/g, ' ').replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function sentenceSet(body) { const out = new Set(); const text = String(body || '').replace(/```[\s\S]*?```/g, ' '); for (const raw of text.split(/(?<=[.!?])\s+|\n+/)) { const n = normSentence(raw); if (n && n.split(' ').length >= 8) out.add(n); } return out; }
// exclude the boilerplate Kory-block sentences so the shared block never inflates overlap
const KORY_SET = sentenceSet(koryBlock('x') + ' ' + SOURCES_LINE);
function bodySet(body) { const s = sentenceSet(body); for (const k of KORY_SET) s.delete(k); return s; }
function maxOverlap(set, index) { // index: Map<sentence,count of docs>; returns best single-doc overlap approx
  let best = 0; const perDoc = new Map();
  for (const s of set) { const holders = index.get(s); if (holders) for (const id of holders) perDoc.set(id, (perDoc.get(id) || 0) + 1); }
  for (const [, c] of perDoc) { const ov = c / (set.size || 1); if (ov > best) best = ov; }
  return best;
}

const SYS = 'You are a senior revenue-operations writer for PULSE RevOps. STRICT FACTUAL DISCIPLINE: never invent company names, person names, statistics, percentages, dollar figures, dates, laws, or regulations. No superlatives (best, leading, top, world-class, cutting-edge). Only qualitative dynamics a working revenue leader recognizes as generally true. No em-dashes; use " - ". Real operating substance, never padding or repetition.';
function rewritePrompt(question, hint) {
  return 'Write a completely UNIQUE answer to this question - it must share no templated sentences with sibling questions in its family.\n\n' +
    'QUESTION: ' + question + '\n\n' +
    'First identify the single specific situation, company stage, place, industry, or niche named in the question - that is the ANCHOR' + (hint ? ' (here: ' + hint + ')' : '') + '. The ENTIRE answer must be driven by that exact anchor so it could ONLY have been written about it. Cover, specific to this anchor:\n' +
    '- BUYING DYNAMICS: who is on the buying committee, typical deal size and shape, how budget gets approved, what the buyer evaluates, where deals stall.\n' +
    '- SALES-CYCLE IMPLICATIONS: the motion this situation forces, ramp and forecast behavior, pipeline shape, where the leaks are.\n' +
    '- WHAT A FRACTIONAL / INTERIM / FULL-TIME REVENUE LEADER LOOKS LIKE HERE: the first 90 days, operating cadence, what they own vs advise, the signals to convert to full-time or not.\n\n' +
    'STRUCTURE: "## Direct Answer" (2-3 sentences), then 5-7 "## " H2 sections of concrete situation-specific substance, then "## FAQ" with exactly 4 "**A question?**" items each answered in 2-4 sentences. Then STOP - do NOT write a Sources section. 2,100-2,600 words. No generic advice that would fit any company.';
}
async function writeOne(question, hint) {
  let r = await dsChat([{ role: 'system', content: SYS }, { role: 'user', content: rewritePrompt(question, hint) }], { temperature: 0.7, max_tokens: 12000 });
  let body = r.content.trim(); let wc = body.split(/\s+/).filter(Boolean).length;
  if (wc < 2000) {
    const r2 = await dsChat([{ role: 'system', content: SYS }, { role: 'user', content: rewritePrompt(question, hint) + '\n\nYour previous draft was ' + wc + ' words - under the 2,000 floor. Add more anchor-specific operating substance to clear 2,200 words. No padding.' }], { temperature: 0.65, max_tokens: 12000 });
    const b2 = r2.content.trim(), w2 = b2.split(/\s+/).filter(Boolean).length; if (w2 > wc) { body = b2; wc = w2; }
  }
  return { body, wc };
}
function anchorHint(q) { const m = String(q || '').match(/right for (?:a |an )?([^?]+?)(?: when | company| companies|\?|$)/i) || String(q || '').match(/\bin ([A-Z][A-Za-z.'-]+(?: [A-Z][A-Za-z.'-]+){0,3})/); return m ? m[1].trim().slice(0, 80) : ''; }

const stat = (f, v) => { try { fs.writeFileSync(WD + '/' + f, v); } catch (e) {} };
const ev = (msg) => { try { const a = loadJSON(WD + '/_run_events.json', []); a.unshift({ t: Date.now(), msg }); saveJSON(WD + '/_run_events.json', a.slice(0, 50)); } catch (e) {} };

(async () => {
  // 346 near-dup ids: Phase-0 nearDupList (218) + original nearDup (128)
  const p0 = loadJSON(WD + '/_cro_phase0_unique.json', {});
  const orig = loadJSON(WD + '/_fcro_unique.json', {});
  const ids = []; const seen = new Set();
  const push = id => { if (id && !seen.has(id)) { seen.add(id); ids.push(id); } };
  if (QUEUE === 'stubs') {
    for (const id of (p0.stubIds || [])) push(typeof id === 'string' ? id : (id && id.id));
    for (const id of (orig.stubIds || orig.stubs || [])) push(typeof id === 'string' ? id : (id && id.id));
  } else {
    for (const d of (p0.nearDupList || [])) push(d && d.id);
    for (const d of (orig.nearDup || orig.nearDupList || [])) push(d && d.id);
  }

  const done = new Set(loadJSON(DONE_F, []));
  const redir = loadJSON(REDIR_F, []); const redirSet = new Set(redir.map(r => r.id));
  const defer = new Set(loadJSON(DEFER_F, []));
  const index = new Map(); // sentence -> [ids] of already-published rewrites this run (for uniqueness)

  let n = 0, pub = 0, red = 0, def = 0, fail = 0;
  stat('_run_phase.txt', 'NEAR-DUP REWRITE');
  ev('Phase 1 launched: ' + ids.length + ' near-dup rewrites (situation-anchored, 2000w+, facts-discipline).');
  console.log('[rewrite] ' + ids.length + ' near-dups · ' + done.size + ' already done · NO deploy');

  const queue = ids.filter(id => !done.has(id) && !redirSet.has(id) && !defer.has(id));
  async function worker() {
    while (queue.length) {
      const id = queue.shift(); n++;
      try {
        const e = await store.get('answers/' + id + '.json', { type: 'json' });
        if (!e) { fail++; continue; }
        stat('_run_current.txt', id + ' — ' + String(e.question || '').slice(0, 62));
        const hint = anchorHint(e.question);
        let { body, wc } = await writeOne(e.question, hint);
        // uniqueness vs in-batch corpus
        let set = bodySet(body);
        let ov = maxOverlap(set, index);
        if (ov > 0.30) { // one retry with a stronger divergence nudge
          const r = await writeOne(e.question + ' (make the framing, examples, and structure clearly distinct from any sibling question)', hint);
          if (r.wc >= 2000) { body = r.body; wc = r.wc; set = bodySet(body); ov = maxOverlap(set, index); }
        }
        if (wc < 2000 || ov > 0.30) {
          // un-clearable -> 301 manifest (owner approves before any redirect ships)
          redir.push({ id, question: e.question, reason: wc < 2000 ? 'under-2000w(' + wc + ')' : 'overlap(' + Math.round(ov * 100) + '%)', suggestedTarget: 'canonical sibling in cluster (owner to confirm)' });
          saveJSON(REDIR_F, redir); red++;
          console.log('[rewrite] ↪ 301-tier ' + id + ' (' + (wc < 2000 ? wc + 'w' : Math.round(ov * 100) + '%') + ')');
          continue;
        }
        // SPEC2 editorial layer + gate
        const out = transform(body, e.question);
        const probs = gateProblems(out);
        if (probs.length) { defer.add(id); saveJSON(DEFER_F, [...defer]); def++; console.log('[rewrite] ⚠ defer ' + id + ' ' + JSON.stringify(probs)); continue; }
        await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: out, quality_score: Math.max(e.quality_score || 0, 13), updated_at: new Date().toISOString() }));
        for (const s of set) { let arr = index.get(s); if (!arr) { arr = []; index.set(s, arr); } arr.push(id); }
        done.add(id); pub++;
      } catch (x) { fail++; console.log('[rewrite] ✖ ' + id + ' ' + (x && x.message)); }
      if (n % 5 === 0) { saveJSON(DONE_F, [...done]); stat('_cro_rewrite_progress.txt', (pub + red + def + fail) + '/' + ids.length + ' pub=' + pub + ' redirect=' + red + ' defer=' + def + ' fail=' + fail); }
    }
  }
  await Promise.all([worker(), worker()]); // DeepSeek 2-parallel per the concurrency law
  saveJSON(DONE_F, [...done]);
  stat('_cro_rewrite_progress.txt', (pub + red + def + fail) + '/' + ids.length + ' pub=' + pub + ' redirect=' + red + ' defer=' + def + ' fail=' + fail);
  stat('_run_phase.txt', 'NEAR-DUP REWRITE COMPLETE'); stat('_run_current.txt', 'queue complete');
  ev('Phase 1 complete: ' + pub + ' published, ' + red + ' -> 301 manifest, ' + def + ' deferred, ' + fail + ' fail.');
  console.log('\n[rewrite] DONE · published=' + pub + ' · 301-manifest=' + red + ' · deferred=' + def + ' · fail=' + fail);
})().catch(x => { console.error('FATAL', x.message); process.exit(1); });
