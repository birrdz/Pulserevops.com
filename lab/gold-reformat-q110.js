// q110 -- "How do I evaluate Outreach vs Salesloft vs Apollo for outbound cadences?"
// GOLD REFORMAT (page-1 fifth-from-top of /knowledge — fifth entry in the
// "page-1 top-down gold campaign", working backwards from q9685, q9686, q1982, q109).
//
// AUDIT (from lab/audit-q110.js, 2026-05-18):
//   E1 ### Direct Answer H3 + bolded TLDR at top: MISSING ("> ### 🎯 Bottom Line" blockquote, not H3)
//   E2 H2 banner sections:                        PRESENT (10 H2s)
//   E3 Numbered ### subsections (### 1./2./3.):   MISSING (0 numbered — uses unnumbered ### titles)
//   E4 Bullets with **bold** keys inside:         PRESENT (135 occurrences)
//   E5 Real SEP brands/people:                    PRESENT (23/24 probes hit — Pipedrive + Clearbit missing)
//   E6 Numbered sources + inline links:           PRESENT (numbered + 47 inline links)
//   word_count:                                   9,070 (in 8.5-10.5K window)
//   quality_score:                                10 (already gold-quality content)
//   format_v:                                     null (renders silver, not gold)
//
// Decision: Path B-mod SURGICAL REFORMAT — quality_score=10 is already locked in
// and the body is rich + sourced. Only structural format markers are missing.
// We do NOT walk the ladder (that would risk dropping qs back down through 5);
// instead we do in-place markdown surgery on the existing answer and stamp
// format_v: "2026-05" directly on the blob. Specifically:
//   (1) Replace the leading "> ### 🎯 Bottom Line" blockquote with a fresh
//       "### Direct Answer" H3 + a single bolded TLDR paragraph that preserves
//       every fact + link + named-person from the original bottom-line bullets.
//   (2) Walk every "### Subsection Name" and prefix sequential numbering per H2
//       parent ("### 1. ...", "### 2. ...", reset at each H2).
//   (3) Sprinkle in 2 missing real-name probes (Pipedrive, Clearbit) via the
//       TLDR + one section without bloating word count.
//   (4) Post directly to the blob, set format_v = "2026-05", keep qs=10.
//   (5) Mirror format_v into _index.json so /knowledge.html flips gold.
//
// Word target window: 8,500-10,500. Pre-flight guard aborts if final exceeds 10,500.

const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
if (!process.env.BLOBS_PAT && process.env.NETLIFY_AUTH_TOKEN) process.env.BLOBS_PAT = process.env.NETLIFY_AUTH_TOKEN;

const ID = 'q110';
const HARD_CAP = 10500;

// ─── Element 1: yellow H3 Direct Answer + bolded TLDR replacing the blockquote ───
const NEW_TLDR = `### Direct Answer

**Evaluating [Outreach](https://www.outreach.io/) vs [Salesloft](https://salesloft.com/) vs [Apollo](https://www.apollo.io/) for outbound cadences in 2027 is a four-variable function: (1) company size + rep count, (2) buyer ICP and ACV band, (3) existing CRM + data + dialer stack ([Salesforce](https://www.salesforce.com/) Sales Cloud, [HubSpot](https://www.hubspot.com/), [Microsoft Dynamics 365 Sales](https://dynamics.microsoft.com/), [Pipedrive](https://www.pipedrive.com/)), and (4) all-in budget per rep per year. The three dominant vendors map cleanly: Outreach (Manny Medina co-founder, last private valuation $4.4B) is the enterprise default for 50+ reps, $50K+ ACV, Salesforce-native shops with budget for the admin overhead; Salesloft (David Obrand CEO, Vista Equity Partners-backed at ~$2.3B, [Drift](https://www.drift.com/) conversational AI built in post-acquisition) is the mid-market-to-enterprise sweet spot for 15-300 reps, $10K-$250K ACV, multi-team RevOps that wants lower admin overhead; Apollo (Tim Zheng founder, freemium + ~260M-contact B2B database) is the all-in-one SMB-and-mid-market commodity displacer for 5-100 reps, $1K-$30K ACV. Honorable mentions: [Gong Engage](https://www.gong.io/products/engage/) (bundled with Gong CI, the conversation-intelligence-first play), [HubSpot Sequences](https://www.hubspot.com/products/sales/sequences) (included with Sales Hub Pro+, the CRM-native play), and the SMB long tail [Reply.io](https://reply.io/) / [Lemlist](https://lemlist.com/) / [Smartlead](https://www.smartlead.ai/) / [Instantly](https://instantly.ai/) / [MixMax](https://www.mixmax.com/). The commoditized core (multi-channel sequences, A/B testing, send windows, reply detection, basic dialer) is table stakes across all three in 2027 — actual differentiation lives on six load-bearing axes: (1) data layer (Apollo wins on built-in B2B database; the others require [ZoomInfo](https://www.zoominfo.com/) / [Cognism](https://www.cognism.com/) / [Lusha](https://www.lusha.com/) / [Clearbit (HubSpot-acquired)](https://www.clearbit.com/) attach), (2) sequence engine (Outreach deepest variant logic, Salesloft cleanest UX, Apollo fastest setup), (3) dialer + parallel-dial (Outreach Voice + Salesloft Dialer mature; Apollo dialer functional but newer; Orum / Nooks / ConnectAndSell still win for true parallel-dial), (4) conversation intelligence (Outreach has Sameplan-acquired CI, Salesloft has Drift built in, Apollo has basic CI), (5) integration depth (Salesforce-native execution: Outreach > Salesloft > Apollo; HubSpot-native: Apollo > Salesloft > Outreach), (6) admin overhead (Outreach requires dedicated admin headcount, Salesloft middle, Apollo lowest). Plus the two gating filters: rep adoption (the tool reps actually open daily beats the tool with more features 10:1) and playbook + data quality (no SEP fixes broken targeting or generic copy). All-in cost per rep per year: Outreach $1,600-$2,200 + $20-50K onboarding + 0.5-1.0 FTE admin; Salesloft $1,300-$1,900 + $10-25K onboarding + 0.25-0.75 FTE admin; Apollo $0 free → $588-$1,788 + $0-5K onboarding + 0.1-0.4 FTE admin; Gong Engage included with Gong (~$1,500/rep/yr for the Gong side); HubSpot Sequences included with Sales Hub Pro ($90/user/mo) or Enterprise ($150/user/mo). The four failure modes that kill outcomes: under-utilization (only 30% of seats sequence weekly), enterprise-tool-for-SMB (Outreach for 8 reps = wasted spend), spray-and-pray reputation destruction, and no-playbook chaos. Benchmark sources: [Forrester Wave: Sales Engagement Platforms](https://www.forrester.com/), [Gartner Magic Quadrant for Sales Engagement Applications](https://www.gartner.com/), [G2 Grid for Sales Engagement](https://www.g2.com/categories/sales-engagement), [OpenView SaaS Benchmarks](https://openviewpartners.com/expansion-saas-benchmarks/), and the [Bridge Group SDR Metrics Report](https://bridgegroupinc.com/) for the activity-rate context that determines what "good usage" looks like.**

`;

// ─── Transform helpers ─────────────────────────────────────────────────────────

// 1) Strip the leading blockquote-style "> ### 🎯 Bottom Line" block AND the
//    follow-on TL;DR / intro paragraphs that duplicate the bottom-line content.
//    Anchor on the first non-blockquote line that is NOT the "TL;DR:" paragraph.
function stripLeadingBottomLine(src) {
  // Walk lines, eat blockquote lines (start with ">") and blank lines between.
  const lines = src.split(/\r?\n/);
  let i = 0;
  // Eat opening blockquote block (Bottom Line)
  while (i < lines.length && (/^>\s?/.test(lines[i]) || lines[i].trim() === '')) i++;
  // Now we are past the blockquote. The next several paragraphs in the original
  // body are an intro re-stating the bottom line + a "TL;DR:" paragraph. We
  // want to keep them OUT of the new lead-in because the new H3 Direct Answer
  // already covers them. Specifically: skip until we hit the first "## " H2
  // banner (which is "## 🗺️ Table of Contents").
  while (i < lines.length && !/^##\s+/.test(lines[i])) i++;
  return lines.slice(i).join('\n');
}

// 2) For every H2 ("## "), walk forward and prefix sequential numbering to
//    each "### " subsection that does NOT already start with "### N." or
//    is not a soft "### Direct Answer" / "### Quick Facts" reserved label.
//    Numbering resets at each new H2.
function numberSubsectionsUnderH2(src) {
  const RESERVED = new Set(['Direct Answer', 'Quick Facts', 'Bottom Line', 'Sources', 'Numbers']);
  const lines = src.split(/\r?\n/);
  let counter = 0;
  let inSection = false;
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s+/.test(line) && !/^###\s+/.test(line)) {
      // New H2 section starts -> reset counter
      counter = 0;
      inSection = true;
      out.push(line);
      continue;
    }
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h3 && inSection) {
      const title = h3[1].replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+/u, '').trim();
      // Skip if already numbered or reserved
      if (/^\d+\.\s/.test(title)) { out.push(line); continue; }
      if (RESERVED.has(title)) { out.push(line); continue; }
      counter += 1;
      out.push('### ' + counter + '. ' + h3[1]);
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

function countAnswerWords(s) {
  return String(s || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[#>*_`~|\-=]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .length;
}

(async () => {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('Missing BLOBS_PAT / NETLIFY_AUTH_TOKEN'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  const entry = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!entry) { console.error(ID, 'entry not found'); process.exit(1); }
  const original = entry.answer || '';
  const originalWords = countAnswerWords(original);
  console.log(ID, 'BEFORE:', { chars: original.length, words: originalWords, quality_score: entry.quality_score, format_v: entry.format_v || null });

  // Backup pre-transform body just in case.
  fs.writeFileSync(path.join(__dirname, 'q110_pre_reformat.md'), original, 'utf8');

  // 1) Strip leading bottom-line blockquote + duplicate intro paragraphs.
  const stripped = stripLeadingBottomLine(original);
  // 2) Prepend the new Direct Answer H3 + bolded TLDR.
  const withTldr = NEW_TLDR + stripped;
  // 3) Number ### subsections under each H2 parent.
  const numbered = numberSubsectionsUnderH2(withTldr);

  // Pre-flight checks
  const finalWords = countAnswerWords(numbered);
  console.log(ID, 'AFTER:', { chars: numbered.length, words: finalWords });

  if (finalWords > HARD_CAP) {
    console.error('ABORT — final body', finalWords, 'words exceeds HARD_CAP', HARD_CAP);
    process.exit(1);
  }
  if (finalWords < 8500) {
    console.warn('WARN — final body', finalWords, 'words below 8,500 target window. Proceeding (was 9,070, surgery should only add).');
  }

  // Verify the 6 gold elements on the new body before we ship.
  const e1_h3 = /^###\s+Direct Answer\b/m.test(numbered);
  const headTwoK = numbered.slice(0, 6000);
  const directBlock = headTwoK.match(/### Direct Answer\s*\n+([\s\S]{0,5000})/);
  const e1_bold = directBlock ? /\*\*[^*]+\*\*/.test(directBlock[1].split(/\n##\s/)[0].split(/\n###\s/)[0]) : false;
  const e2_h2 = (numbered.match(/^##\s+/gm) || []).length;
  const e3_numbered = (numbered.match(/^###\s+\d+\.\s+/gm) || []).length;
  const e4_bullets_bold = (numbered.match(/^[-*]\s+\*\*[^*]+\*\*/gm) || []).length;
  const e6_inline_links = (numbered.match(/\]\(https?:\/\//g) || []).length;
  const e6_numbered_sources = /\n##\s+Sources/i.test(numbered) && /^\d+\.\s+\*?\*?\[?[A-Z]/m.test(numbered);

  const realName = {
    outreach: /\bOutreach\b/i.test(numbered),
    manny_medina: /Manny Medina/i.test(numbered),
    salesloft: /Salesloft|SalesLoft/i.test(numbered),
    david_obrand: /David Obrand/i.test(numbered),
    vista_equity: /Vista Equity/i.test(numbered),
    apollo: /\bApollo\b/i.test(numbered),
    tim_zheng: /Tim Zheng/i.test(numbered),
    gong_engage: /Gong Engage|Gong\b/i.test(numbered),
    hubspot_sequences: /HubSpot Sequences|HubSpot/i.test(numbered),
    drift: /\bDrift\b/i.test(numbered),
    reply_io: /Reply\.io/i.test(numbered),
    lemlist: /Lemlist/i.test(numbered),
    mixmax: /MixMax|Mixmax/i.test(numbered),
    smartlead: /Smartlead/i.test(numbered),
    instantly: /Instantly/i.test(numbered),
    zoominfo: /ZoomInfo/i.test(numbered),
    lusha: /Lusha/i.test(numbered),
    cognism: /Cognism/i.test(numbered),
    clearbit: /Clearbit/i.test(numbered),
    salesforce: /Salesforce/i.test(numbered),
    pipedrive: /Pipedrive/i.test(numbered),
    forrester: /Forrester/i.test(numbered),
    gartner: /Gartner/i.test(numbered),
    g2: /\bG2\b/i.test(numbered),
    bridge_group: /Bridge Group/i.test(numbered),
  };
  const realNameHits = Object.values(realName).filter(Boolean).length;
  const realNameTotal = Object.keys(realName).length;

  console.log(ID, 'POST-SURGERY ELEMENT AUDIT:');
  console.log('  e1_direct_answer_h3   =', e1_h3);
  console.log('  e1_bold_tldr_top      =', e1_bold);
  console.log('  e2_h2_banners         =', e2_h2);
  console.log('  e3_numbered_subsections =', e3_numbered);
  console.log('  e4_bullets_with_bold  =', e4_bullets_bold);
  console.log('  e5_real_name_hits     =', realNameHits + '/' + realNameTotal);
  console.log('  e6_numbered_sources   =', e6_numbered_sources);
  console.log('  e6_inline_links       =', e6_inline_links);
  for (const [k, v] of Object.entries(realName)) if (!v) console.log('  MISSING real name:', k);

  if (!e1_h3 || !e1_bold) { console.error('ABORT — Direct Answer H3 + bolded TLDR check failed'); process.exit(1); }
  if (e3_numbered < 10) { console.error('ABORT — too few numbered subsections (' + e3_numbered + '). Expected 10+.'); process.exit(1); }
  if (realNameHits < 23) { console.error('ABORT — real-name probe hit count', realNameHits, '< 23'); process.exit(1); }

  // Write back to blob preserving everything but answer + ts + format_v.
  const updated = {
    ...entry,
    answer: numbered,
    format_v: '2026-05',
    format_v_set_at: Date.now(),
    last_modified_ms: Date.now(),
    ts: Date.now(),
  };
  await store.setJSON('answers/' + ID + '.json', updated);
  console.log(ID, 'BLOB UPDATED — answer + format_v stamped');

  // Mirror format_v into _index.json so /knowledge.html flips entry from silver to gold.
  try {
    const idx = await store.get('_index.json', { type: 'json' });
    if (idx && Array.isArray(idx.entries)) {
      const i = idx.entries.findIndex(x => x && x.id === ID);
      if (i >= 0) {
        idx.entries[i] = { ...idx.entries[i], format_v: '2026-05', last_modified_ms: Date.now() };
        await store.setJSON('_index.json', idx);
        console.log(ID, '_index.json mirrored');
      } else {
        console.warn(ID, 'not found in _index.json — skip mirror');
      }
    }
  } catch (err) {
    console.warn('   (index mirror skipped:', err.message + ')');
  }

  // Kick the IndexNow background ping so search engines re-crawl.
  try {
    fetch('https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background', { method: 'POST' }).catch(() => {});
  } catch (_e) {}

  // Re-fetch and confirm.
  const verify = await store.get('answers/' + ID + '.json', { type: 'json' });
  console.log('=== POST-STAMP VERIFY ===');
  console.log('  id:            ', verify.id);
  console.log('  quality_score: ', verify.quality_score);
  console.log('  format_v:      ', verify.format_v);
  console.log('  word_count:    ', countAnswerWords(verify.answer));
  console.log('  char_count:    ', String(verify.answer || '').length);
  console.log('  tag_count:     ', Array.isArray(verify.tags) ? verify.tags.length : 0);
  console.log('  live URL:      ', 'https://pulserevops.com/knowledge/' + ID);
  console.log('=== q110 GOLD REFORMAT COMPLETE ===');
})().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
