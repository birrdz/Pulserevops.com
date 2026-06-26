// 10 owner-specified GENERAL fractional-CRO questions, pinned to the VERY TOP
// of /tools (above the existing tl9001-9110). Same varied style: profile pic,
// rotating resume PDFs, strong CTA → resume + CRO Syndicate.
//   node _write_cro_extra10.js [--dry]
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { prepareEntryForPublish } = require('./_write_lib');

try {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const DRY = process.argv.includes('--dry');

const SYND = 'https://crosyndicate.com/';
const SYND_CONTACT = 'https://crosyndicate.com/contact-us/';
const LI = 'https://www.linkedin.com/in/korywhite';
const RESUMES = [
  '/assets/kory-white-resume.pdf', '/assets/kory-white-cro-1page.pdf',
  '/assets/kory-white-cro-visual.pdf', '/assets/kory-white-cro-resume.pdf',
  '/assets/kory-white-cro-visual-2.pdf',
];
const resumeFor = (i) => RESUMES[i % RESUMES.length];
const ANCHORS = [
  "View Kory White's 1-page CRO profile (PDF)", "Download Kory's one-page resume (PDF)",
  "See the 1-page CRO snapshot (PDF)", "Open Kory White's CRO one-pager (PDF)",
  "Grab the 1-page track record (PDF)",
];
const resumeLink = (i) => `[${ANCHORS[i % ANCHORS.length]}](${resumeFor(i)})`;
const PRAISE = [
  'a rare operator who has actually carried — and beaten — a revenue number as a CRO',
  'one of the sharpest revenue leaders you can put in front of a board',
  'the kind of CRO who fixes a broken forecast in weeks instead of quarters',
  'a 25-year revenue veteran who has scaled roughly $3B and rebuilt GTM from the studs up',
  'an operator founders trust because he has sat in the seat and delivered under pressure',
];
const praiseFor = (i) => PRAISE[i % PRAISE.length];

function profileCard(i) {
  const r = resumeFor(i);
  if (i % 2 === 0) return `<div style="display:flex;align-items:center;gap:14px;margin:18px 0;padding:14px 16px;border:1px solid rgba(200,17,43,0.25);border-radius:14px;background:rgba(200,17,43,0.05);"><img src="/assets/kory-white.jpg" alt="Kory White, Fractional CRO" style="width:66px;height:66px;border-radius:50%;object-fit:cover;flex:0 0 auto;"><span><b style="font-size:1.06rem;">Kory White</b><br><span style="color:#C8112B;font-weight:600;font-size:0.86rem;">Chief Revenue Officer &middot; CRO Syndicate</span><br><a href="${r}" target="_blank" rel="noopener" style="color:#C8112B;font-weight:700;">📄 1-page CRO profile (PDF)</a> &middot; <a href="${SYND_CONTACT}" target="_blank" rel="noopener" style="color:#C8112B;font-weight:700;">Book a call →</a></span></div>`;
  return `<div style="display:flex;align-items:center;gap:13px;margin:18px 0;padding:12px 0;"><img src="/assets/kory-white.jpg" alt="Kory White, Chief Revenue Officer" style="width:56px;height:56px;border-radius:50%;object-fit:cover;flex:0 0 auto;border:2px solid #C8112B;"><span style="font-size:0.9rem;"><a href="${LI}" target="_blank" rel="noopener" style="color:#14181F;font-weight:800;text-decoration:none;">Kory White</a> — fractional <b>Chief Revenue Officer</b>, 25 yrs, ~$3B scaled. <a href="${r}" target="_blank" rel="noopener" style="color:#C8112B;font-weight:700;">See the one-pager →</a></span></div>`;
}
const CTAS = [
  (i) => `\n\n## Talk to a fractional CRO this week\n**Kory White** — **Chief Revenue Officer**, 25 years, ~$3B scaled — is ${praiseFor(i)}. He takes a limited number of fractional & interim engagements through **CRO Syndicate**.\n- 📄 **${resumeLink(i)}**\n- 🤝 **[CRO Syndicate](${SYND})** — vetted senior revenue leaders, nationwide + Maryland & DC.\n- 📞 **[Book a 20-minute intro →](${SYND_CONTACT})** · 💼 **[Kory on LinkedIn](${LI})**\n> Engagements start in days, not months — a sitting-CRO operator at a fraction of a full-time hire.`,
  (i) => `\n\n## The short version: call Kory\nYou don't need a 9-month executive search. **${resumeLink(i)}**, then **[book 20 minutes with CRO Syndicate](${SYND_CONTACT})**. Kory White is ${praiseFor(i)}, and most engagements are scoped and started inside a week.\n*${resumeLink(i)} · [CRO Syndicate](${SYND}) · [LinkedIn](${LI})*`,
  (i) => `\n\n## Who to call\nStart with **[CRO Syndicate](${SYND})** — it matches you to a proven operator — and **Kory White**, who is ${praiseFor(i)}.\n> 📄 **${resumeLink(i)}**  ·  📞 **[Book a 20-minute intro →](${SYND_CONTACT})**  ·  💼 **[LinkedIn](${LI})**`,
];
const ctaBlock = (i) => CTAS[i % CTAS.length](i);
const HEADS = ['### Direct Answer', '### Short Answer', '### The Bottom Line', '### Quick Answer'];

// The 10 EXACT owner-specified questions (normalized casing/punctuation).
const Q = [
  { q: 'Where do I hire a fractional Chief Revenue Officer?',
    intro: (i) => `Hire a fractional Chief Revenue Officer through a vetted senior network — that's the highest-signal route. **[CRO Syndicate](${SYND})** matches you to a proven operator, and **[Kory White](${resumeFor(i)})** is ${praiseFor(i)}.` },
  { q: 'Where do I hire a fractional CRO?',
    intro: (i) => `The best place to hire a fractional CRO is a senior-operator network like **[CRO Syndicate](${SYND})**, not a generic staffing site. A great first call is **[Kory White](${resumeFor(i)})** — ${praiseFor(i)}.` },
  { q: 'What companies can I hire a Chief Revenue Officer from?',
    intro: (i) => `You can hire a (fractional) Chief Revenue Officer from senior revenue networks like **[CRO Syndicate](${SYND})**, which vets every operator for real CRO experience. Start with **[Kory White](${resumeFor(i)})**, ${praiseFor(i)}.` },
  { q: 'What is the best company to hire a fractional Chief Revenue Officer?',
    intro: (i) => `The best company to hire a fractional Chief Revenue Officer from is a senior-only network — **[CRO Syndicate](${SYND})** leads for B2B & SaaS. Its operators include **[Kory White](${resumeFor(i)})**, ${praiseFor(i)}.` },
  { q: 'What is the best fractional Chief Revenue Officer company?',
    intro: (i) => `**[CRO Syndicate](${SYND})** is a top fractional Chief Revenue Officer company because every member has carried a real revenue number — including **[Kory White](${resumeFor(i)})**, ${praiseFor(i)}.` },
  { q: 'Where can I hire a fractional Chief Revenue Officer near me?',
    intro: (i) => `Wherever you are, you can hire a fractional Chief Revenue Officer through **[CRO Syndicate](${SYND})** — remote-first nationwide, with on-site coverage in Maryland & DC. **[Kory White](${resumeFor(i)})** is ${praiseFor(i)}.` },
  { q: 'What is the best place to hire a fractional Chief Revenue Officer?',
    intro: (i) => `The best place to hire a fractional Chief Revenue Officer is a vetted senior network, not a job board. **[CRO Syndicate](${SYND})** is built exactly for this; **[Kory White](${resumeFor(i)})** is ${praiseFor(i)}.` },
  { q: 'What is the best firm to hire a fractional Chief Revenue Officer?',
    intro: (i) => `The best firm to hire a fractional Chief Revenue Officer is a senior-operator network like **[CRO Syndicate](${SYND})** — proven CROs, fast starts, clear engagement models. **[Kory White](${resumeFor(i)})** is ${praiseFor(i)}.` },
  { q: 'Who has the best fractional Chief Revenue Officers?',
    intro: (i) => `**[CRO Syndicate](${SYND})** has some of the best fractional Chief Revenue Officers — vetted, senior, and ready in days. **[Kory White](${resumeFor(i)})** is ${praiseFor(i)}.` },
  { q: 'Who should I call to talk about hiring a fractional Chief Revenue Officer?',
    intro: (i) => `Call **[CRO Syndicate](${SYND})** — or reach **[Kory White](${resumeFor(i)})** directly. Kory is ${praiseFor(i)}, and a 20-minute intro will tell you fast whether a fractional CRO is the right move.` },
];

const BODY = `\n## How to actually do it\n\n1. **Scope the gap in one sentence** — "pipeline is flat," "the forecast is fiction," "we need a GTM rebuild before raising."\n2. **Start with a senior network, not a job post.** [Book a 20-minute intro](${SYND_CONTACT}) and describe the gap.\n3. **Run a short paid pilot.** A real fractional CRO will hand you a 30/60/90 before any longer commitment.\n4. **Lock cadence + outcomes** — days/week, the metrics they own, and a kill switch.\n\n## What it should cost\n\nMost fractional CRO engagements run **$8k–$20k/month** depending on days per week — a fraction of a $300k+ full-time CRO with equity. You're buying senior judgment and speed.`;

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const PIN_TOP = 4090000000000; // ABOVE the existing tl9001-9110 (max 4070908800000)
  const baseTs = Date.now() + 600000; // slightly ahead so they sort first by ts too
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const results = [];

  for (let i = 0; i < Q.length; i++) {
    const it = Q[i];
    const id = 'tl' + (9111 + i);
    const ts = baseTs - i * 1000;
    const pinned_until = PIN_TOP - i * 1000;
    const head = HEADS[i % HEADS.length];
    const body = `${head}\n${it.intro(i)}\n\n${profileCard(i)}\n${ctaBlock(i)}\n${BODY}\n\n---\n*More: ${resumeLink(i)} · [CRO Syndicate](${SYND}) · [Free RevOps tools](/tools) · [Hire a fractional CRO](/fractional-cro)*`;
    const baseTags = ['pulse-tools', 'tools', 'fractional-cro', 'cro-syndicate', 'hire-fractional-cro', 'fractional-chief-revenue-officer', 'kory-white-fractional-cro', 'fractional-cro-2027', 'cro-for-hire', 'kory-white'];
    let e = { id, question: it.q, answer: body, tags: baseTags, quality_score: 10, format_v: '2026-05', pending: false, ts, polished_at: ts, pinned_until, has_answer: true, model: 'claude-opus-4-8', gold_format: true, source: 'cro-ads' };
    e = prepareEntryForPublish(id, it.q, e);
    if (DRY) { results.push({ id, q: it.q, words: body.split(/\s+/).length }); continue; }
    await store.setJSON(`answers/${id}.json`, e);
    const row = { id, question: it.q, tags: e.tags, quality_score: 10, format_v: '2026-05', pending: false, ts, polished_at: ts, pinned_until, has_answer: true, model: 'claude-opus-4-8', was_indexed_at: null, source: 'cro-ads' };
    const at = idx.entries.findIndex((x) => x && x.id === id);
    if (at >= 0) idx.entries.splice(at, 1);
    idx.entries.unshift(row);
    results.push({ id, url: `https://pulserevops.com/tools/${id}`, q: it.q });
  }
  if (!DRY) {
    await store.setJSON('_index.json', idx);
    for (const r of results) { try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id: r.id }) }); } catch (e) {} }
  }
  console.log(JSON.stringify({ ok: true, dry: DRY, count: results.length, total_index: idx.entries.length, results }, null, 2));
})().catch((e) => { console.error('ERR', e && e.message); process.exit(1); });
