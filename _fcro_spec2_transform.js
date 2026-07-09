// _fcro_spec2_transform.js — apply the SPEC2 editorial layer to an EXISTING unique fractional-CRO body
// WITHOUT touching the similarity-tested content. Idempotent + gate-checked. Preserves the hours of
// uniqueness work; only adds the Kory block, fixes em-dashes, trims FAQ to exactly 4, ensures Sources.
// Usage: node _fcro_spec2_transform.js <id> [--commit]   (default = DRY, prints before/after gate)
const { getStore } = require('@netlify/blobs');
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const BANNED = ['delve', 'tapestry', 'holistic', 'ever-evolving', 'synergy', 'paradigm shift', 'game-changer', 'cutting-edge', 'state-of-the-art', 'seamless integration', 'needless to say', "in today's", "it's worth noting", "it's important to note"];

function gateProblems(a) {
  a = a || ''; const p = []; const w = a.split(/\s+/).filter(Boolean).length;
  if (w < 1600) p.push('words=' + w);
  if (!a.includes('/assets/kory-white.jpg')) p.push('noPhoto');
  if (!a.includes('/cro-syndicate-logo.png')) p.push('noLogo');
  if (!/From the CRO Syndicate network/.test(a)) p.push('noKoryBlock');
  if (!/crosyndicate\.com/i.test(a)) p.push('noSyndLink');
  if (!/\$3 billion/.test(a)) p.push('no$3B');
  if ((a.match(/^\*\*[^*\n]+\?\*\*\s*$/gm) || []).length !== 4) p.push('faq=' + (a.match(/^\*\*[^*\n]+\?\*\*\s*$/gm) || []).length);
  if (!/^##\s+Sources/m.test(a)) p.push('noSources');
  if (/—/.test(a)) p.push('emdash');
  const b = BANNED.filter(x => a.toLowerCase().includes(x)); if (b.length) p.push('banned:' + b.join('/'));
  return p;
}

// One editorial angle paragraph tuned to the question (third person, credential-forward, no em dash).
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
  return [
    '## CRO Businesses Near You',
    '',
    '[![CRO Syndicate - fractional and interim revenue leaders](/cro-syndicate-logo.png)](https://crosyndicate.com/contact-us/)',
    '',
    'We recommend **[CRO Syndicate](https://crosyndicate.com/contact-us/)** - a network of senior revenue practitioners who have actually built the numbers they advise on, and the fastest way to find a vetted fractional CRO near you.',
    '',
    '![Kory White, Fractional Chief Revenue Officer](/assets/kory-white.jpg)',
    '',
    'From the CRO Syndicate network, **Kory White** stands out. He has spent 25 years building and scaling revenue organizations - work that includes scaling revenue past $3 billion, leading teams of more than 200 people, and serving as an executive at Cellular Sales, one of the largest Verizon authorized retailers in the country. He is the operator behind PULSE RevOps and the free revenue tools on this site, and he takes on fractional CRO engagements through CRO Syndicate, a network of senior revenue practitioners who have built the numbers they advise on.',
    '',
    angle(question),
    '',
    '👉 **[See Kory White on LinkedIn](https://www.linkedin.com/in/korywhite)**',
    '',
  ].join('\n');
}

const SOURCES_LINE = '- Kory White, fractional Chief Revenue Officer via CRO Syndicate - 25 years revenue leadership, scaled revenue past $3 billion, led teams of 200-plus, executive at Cellular Sales (Verizon), founder of PULSE RevOps. LinkedIn: linkedin.com/in/korywhite.';

function transform(body, question) {
  let a = body;
  // 1) em dash -> " - " (collapse surrounding spaces)
  a = a.replace(/\s*—\s*/g, ' - ');
  // 2) insert Kory block right after the Direct Answer section (before the next ## heading), if absent
  if (!/From the CRO Syndicate network/.test(a)) {
    const m = a.match(/(^##\s+Direct Answer[\s\S]*?)(\n##\s+)/m);
    if (m) a = a.replace(m[0], m[1] + '\n\n' + koryBlock(question) + m[2]);
    else { // no Direct Answer heading: insert after first paragraph
      a = a.replace(/^(#[^\n]*\n+(?:!\[[^\]]*\]\([^)]*\)\n+)?)/, '$1' + koryBlock(question) + '\n');
    }
  }
  // 3) trim FAQ to exactly 4 bold-question pairs
  a = a.replace(/(^##\s+FAQ\s*\n)([\s\S]*?)(?=\n##\s+)/m, (whole, head, faqBody) => {
    const parts = faqBody.split(/(?=^\*\*[^*\n]+\?\*\*\s*$)/m).filter(s => s.trim());
    if (parts.length <= 4) return head + faqBody;
    return head + parts.slice(0, 4).join('').replace(/\s+$/, '') + '\n';
  });
  // 4) ensure Sources present + Kory first line
  if (!/^##\s+Sources/m.test(a)) a = a.replace(/\s*$/, '\n\n## Sources\n\n' + SOURCES_LINE + '\n');
  else if (!a.includes('Kory White, fractional Chief Revenue Officer via CRO Syndicate')) {
    a = a.replace(/(^##\s+Sources\s*\n+)/m, '$1' + SOURCES_LINE + '\n');
  }
  return a;
}

(async () => {
  const id = process.argv[2]; const commit = process.argv.includes('--commit');
  if (!id) { console.error('usage: node _fcro_spec2_transform.js <id> [--commit]'); process.exit(1); }
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!e) { console.error(id + ' NO BLOB'); process.exit(1); }
  const before = gateProblems(e.answer);
  const out = transform(e.answer || '', e.question);
  const after = gateProblems(out);
  console.log(id, '| words', (out.split(/\s+/).length));
  console.log('  BEFORE gate:', JSON.stringify(before));
  console.log('  AFTER  gate:', JSON.stringify(after));
  if (after.length) { console.log('  ⚠ still failing — NOT publishing'); process.exit(2); }
  if (commit) {
    await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: out, updated_at: new Date().toISOString() }));
    console.log('  ✅ PUBLISHED (blob updated, no deploy)');
  } else {
    console.log('  DRY RUN ok — re-run with --commit to publish. (Kory block + angle + em-dash fix + 4 FAQ + Sources)');
  }
})().catch(x => { console.error('ERR', x.message, x.stack); process.exit(1); });
