// _fcro_spec2_batch.js — apply the SPEC2 editorial layer across the fractional-CRO tl set.
// Idempotent (skips entries already passing), gate-verified (publishes only if result passes),
// preserves the unique similarity-tested body, skips short stubs (need full writing), NO deploy.
// Resume-safe via _fcro_transform_done.json. Batches with cooldown per CRO_PULSE_TOOLS_RUN.md.
const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const BANNED = ['delve', 'tapestry', 'holistic', 'ever-evolving', 'synergy', 'paradigm shift', 'game-changer', 'cutting-edge', 'state-of-the-art', 'seamless integration', 'needless to say', "in today's", "it's worth noting", "it's important to note"];
const DONE_F = WD + '/_fcro_transform_done.json';
const STUB_F = WD + '/_fcro_stubs.json';
const sleep = ms => new Promise(r => setTimeout(r, ms));

function gateProblems(a) {
  a = a || ''; const p = []; const w = a.split(/\s+/).filter(Boolean).length;
  if (w < 1600) p.push('words=' + w);
  if (!a.includes('/assets/kory-white.jpg')) p.push('noPhoto');
  if (!a.includes('/cro-syndicate-logo.png')) p.push('noLogo');
  if (!/From the CRO Syndicate network/.test(a)) p.push('noKoryBlock');
  if (!/crosyndicate\.com/i.test(a)) p.push('noSyndLink');
  if (!/\$3 billion/.test(a)) p.push('no$3B');
  if ((a.match(/^\*\*[^*\n]+\?\*\*\s*$/gm) || []).length !== 4) p.push('faq!=4');
  if (!/^##\s+Sources/m.test(a)) p.push('noSources');
  if (/—/.test(a)) p.push('emdash');
  const b = BANNED.filter(x => a.toLowerCase().includes(x)); if (b.length) p.push('banned');
  return p;
}
function angle(question) {
  const q = String(question || '').toLowerCase();
  const lead = 'For this exact situation, Kory is the profile worth calling first.';
  let body;
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
// robust line-based FAQ trim to exactly 4 (regex version mis-handled "**Q?**  " trailing-space format)
function trimFaq(a) {
  const lines = a.split('\n'); let faqLine = -1;
  for (let i = 0; i < lines.length; i++) { if (/^##\s+FAQ\s*$/.test(lines[i])) { faqLine = i; break; } }
  if (faqLine < 0) return a;
  let endLine = lines.length;
  for (let i = faqLine + 1; i < lines.length; i++) { if (/^##\s+/.test(lines[i])) { endLine = i; break; } }
  const q = []; for (let i = faqLine + 1; i < endLine; i++) { if (/^\*\*[^*\n]+\?\*\*\s*$/.test(lines[i])) q.push(i); }
  if (q.length <= 4) return a;
  return lines.slice(0, q[4]).concat(['']).concat(lines.slice(endLine)).join('\n');
}
function transform(body, question) {
  let a = body;
  a = a.replace(/\s*—\s*/g, ' - ');
  if (!/From the CRO Syndicate network/.test(a)) {
    const m = a.match(/(^##\s+Direct Answer[\s\S]*?)(\n##\s+)/m);
    if (m) a = a.replace(m[0], m[1] + '\n\n' + koryBlock(question) + m[2]);
    else a = a.replace(/^(#[^\n]*\n+(?:!\[[^\]]*\]\([^)]*\)\n+)?)/, '$1' + koryBlock(question) + '\n');
  }
  a = trimFaq(a);
  if (!/^##\s+Sources/m.test(a)) a = a.replace(/\s*$/, '\n\n## Sources\n\n' + SOURCES_LINE + '\n');
  else if (!a.includes('Kory White, fractional Chief Revenue Officer via CRO Syndicate')) a = a.replace(/(^##\s+Sources\s*\n+)/m, '$1' + SOURCES_LINE + '\n');
  return a;
}
const loadJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const saveJSON = (f, o) => { try { fs.writeFileSync(f, JSON.stringify(o)); } catch (e) {} };

(async () => {
  // UNIQUENESS SKIP-GATE (Q3): only entries that PASSED the similarity re-scan may be transformed.
  // Near-dups + short stubs are NEVER touched here — they go to the rewrite queue, not editorial polish.
  const uniq = loadJSON(WD + '/_fcro_unique.json', null);
  if (!uniq || !Array.isArray(uniq.uniqueIds)) { console.error('run _fcro_similarity_gate.js first — uniqueness allow-list required before transform'); process.exit(1); }
  const ids = uniq.uniqueIds;
  const done = new Set(loadJSON(DONE_F, []));
  const stubs = new Set(loadJSON(STUB_F, []));
  let ok = 0, skip = 0, stub = 0, fail = 0, n = 0;
  console.log('[fcro-spec2] ' + ids.length + ' CERTIFIED-UNIQUE candidates (near-dups excluded) · ' + done.size + ' already transformed · NO deploy');
  for (const id of ids) {
    n++;
    if (done.has(id) || stubs.has(id)) { skip++; continue; }
    try {
      const e = await store.get('answers/' + id + '.json', { type: 'json' });
      if (!e) { fail++; continue; }
      if (gateProblems(e.answer).length === 0) { done.add(id); ok++; continue; } // already SPEC2
      const out = transform(e.answer || '', e.question);
      const probs = gateProblems(out);
      if (probs.length) {
        // can't be fixed by transform alone (almost always a short stub needing full writing)
        stubs.add(id); stub++;
        if (probs.some(p => p.startsWith('words='))) { /* stub */ } else console.log('[fcro-spec2] ⚠ ' + id + ' residual ' + JSON.stringify(probs));
        continue;
      }
      await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: out, quality_score: Math.max(e.quality_score || 0, 13), updated_at: new Date().toISOString() }));
      done.add(id); ok++;
    } catch (x) { fail++; console.log('[fcro-spec2] ✖ ' + id + ' ' + (x && x.message)); }
    if (n % 25 === 0) { saveJSON(DONE_F, [...done]); saveJSON(STUB_F, [...stubs]); fs.writeFileSync(WD + '/_fcro_batch_progress.txt', n + '/' + ids.length + ' ok=' + ok + ' stub=' + stub + ' skip=' + skip + ' fail=' + fail); }
    if (n % 15 === 0) await sleep(400); // gentle cooldown between batches of 15
  }
  saveJSON(DONE_F, [...done]); saveJSON(STUB_F, [...stubs]);
  console.log('[fcro-spec2] DONE · transformed=' + ok + ' stubs(need full writing)=' + stub + ' skip=' + skip + ' fail=' + fail);
})().catch(x => { console.error('FATAL', x.message); process.exit(1); });
