// Shared gold-format grader used by both the continuous quality auditor
// (pulse-quality-audit-background.js) and the at-write-time gate in the
// writer scripts (_write_q.js, _write_ik.js, _write_st.js, _write_vq.js).
//
// Twelve+ criteria graded per entry. 10/12 = gold-format pass.
// Image LAW (images_law): Top-10 needs cover + 10 @@PRODUCT img=; essays need
// a non-weak leading cover. Failing images_law caps score at 9 (publish gate).
const { checkImagesLaw } = require('./ensure-entry-images');
const { auditRankingListMaster, expectedRankCount, isRankingListBody, entryTitle } = require('../../../_ranking_list_master_law');

const BANNED_PHRASES = [
  /\bdelve(?:\s+into)?\b/i,
  /\btapestry\b/i,
  /\blandscape\b/i,
  /\bholistic\b/i,
  /\bin\s+today'?s\b/i,
  /\bever-?evolving\b/i,
  /\bsynerg(?:y|ies|istic)\b/i,
  /\bparadigm\s+shift\b/i,
  /\bgame-?changer\b/i,
  /\bcutting-?edge\b/i,
  /\bstate-?of-?the-?art\b/i,
  /\bseamless\s+integration\b/i,
  /\bdrive\s+growth\b/i,
  /\bunlock\s+(value|potential)\b/i,
  /\bneedless\s+to\s+say\b/i,
  /\bit'?s\s+worth\s+noting\b/i,
  /\bit'?s\s+important\s+to\s+note\b/i,
];

function pillarOf(id, body) {
  // DUAL pillars (LAW 2026-06-23): every Q&A-group pillar runs a 1:1 mix of
  // Top-10 entries + regular single-answer entries. Detect by body shape — a
  // Top-10 ranking has many numbered "## N." sections (>=8) and grades under the
  // electronicreview ruleset; otherwise the entry grades under the pillar's own
  // regular ruleset. With no body (index/empty contexts) the prefix map below
  // gives the regular ruleset. (Mirrors the style-pillar dual precedent.)
  const DUAL = { q: 'qa', cg: 'qa', tk: 'qa', ra: 'revenuearchitecture', gp: 'gtmplaybook', ik: 'kpi', st: 'training', pt: 'qa', sw: 'qa', ai: 'qa', aq: 'qa', tl: 'qa', tc: 'qa', ga: 'qa', gm: 'qa' };
  const dm = String(id).match(/^([a-z]+)\d+$/i);
  if (dm && DUAL[dm[1].toLowerCase()] && typeof body === 'string' && body) {
    const numbered = (body.match(/^#{2,3}\s+(?:\d+\.|#?\d+\s+[—-])/gm) || []).length;
    // A DUAL-pillar entry is a Top-10 ONLY if it ALSO carries ranking markers (Best Overall/Value or @@PRODUCT).
    // A Q&A that merely uses numbered lists must NOT be judged by the 10-product ruleset — that was mis-parking
    // real Q&As on heavy_bold(ER pills) + images_law(10 product imgs). (owner fix 2026-07-01)
    const hasRankMarkers = /(?:🏆|\bBEST\s+OVERALL\b|💎|\bBEST\s+VALUE\b|@@PRODUCT)/i.test(body);
    return (numbered >= 8 && hasRankMarkers) ? 'electronicreview' : DUAL[dm[1].toLowerCase()];
  }
  if (/^ik\d+$/i.test(id)) return 'kpi';
  if (/^st\d+$/i.test(id)) {
    const n = parseInt(String(id).slice(2), 10);
    if (n >= 499) return 'electronicreview'; // Sales Trainings Top-10 sprint (st0499+)
    return 'training';
  }
  if (/^bs\d+$/i.test(id)) return 'booksummary';
  if (/^er\d+$/i.test(id)) return 'electronicreview';
  if (/^ca\d+$/i.test(id)) return 'electronicreview'; // Cars pillar reuses the er Top-10 ruleset
  if (/^tn\d+$/i.test(id)) return 'electronicreview'; // Towns pillar — Top-10 ruleset
  if (/^sc\d+$/i.test(id)) return 'electronicreview'; // Schools pillar — Top-10 ruleset
  if (/^nl\d+$/i.test(id)) return 'electronicreview'; // Nightlife pillar — Top-10 ruleset
  if (/^dn\d+$/i.test(id)) return 'electronicreview'; // Dining pillar — Top-10 ruleset
  if (/^bt\d+$/i.test(id)) return 'electronicreview'; // Boats pillar — Top-10 ruleset
  if (/^mv\d+$/i.test(id)) return 'electronicreview'; // Movies pillar — Top-10 ruleset
  if (/^wl\d+$/i.test(id)) return 'electronicreview'; // Wellness pillar — Top-10 ruleset
  if (/^dr\d+$/i.test(id)) return 'electronicreview'; // Drills pillar (unused — Skill Drills live under sk/skills)
  if (/^tv\d+$/i.test(id)) return 'electronicreview'; // Travel pillar — Top-10 ruleset
  if (/^rs\d+$/i.test(id)) return 'electronicreview'; // Resorts pillar — Top-10 ruleset
  if (/^es\d+$/i.test(id)) return 'electronicreview'; // Estates pillar — Top-10 ruleset
  if (/^cl\d+$/i.test(id)) return 'electronicreview'; // Clubs pillar — Top-10 ruleset
  if (/^lv\d+$/i.test(id)) return 'electronicreview'; // Living pillar — Top-10 ruleset
  if (/^ev\d+$/i.test(id)) return 'electronicreview'; // Events pillar — Top-10 ruleset
  if (/^sy\d+$/i.test(id)) return 'style'; // Style pillar — dual: Top-10 rankings + Q&A/outfit guides
  if (/^ga\d+$/i.test(id)) return 'electronicreview'; // Gatherings pillar — Top-10 ruleset
  if (/^gm\d+$/i.test(id)) return 'electronicreview'; // Gaming pillar — Top-10 ruleset
  if (/^tl\d+$/i.test(id)) return 'electronicreview'; // Tools pillar — Direct-Answer + Top-10 tools ruleset
  if (/^co\d+$/i.test(id)) return 'electronicreview'; // Collectibles pillar — Top-10 ruleset
  if (/^aq\d+$/i.test(id)) return 'electronicreview'; // Aquariums pillar — Top-10 ruleset
  if (/^hf\d+$/i.test(id)) return 'electronicreview'; // HS Football Recruiting pillar — Top-10 ruleset
  if (/^ai\d+$/i.test(id)) return 'electronicreview'; // AI Infrastructure pillar — Top-10 ruleset
  if (/^tc\d+$/i.test(id)) return 'electronicreview'; // Telco pillar — Top-10 ruleset (best carrier by state)
  if (/^cg\d+$/i.test(id)) return 'electronicreview'; // Coaching pillar — Top-10 ruleset (cg0518+)
  if (/^sk\d+$/i.test(id)) return 'training'; // Skills pillar — workshop/drill ruleset
  if (/^sp\d+$/i.test(id)) return 'speech'; // Speeches pillar — ready-to-deliver speech/toast ruleset
  if (/^ra\d+$/i.test(id)) return 'revenuearchitecture';
  if (/^gp\d+$/i.test(id)) return 'gtmplaybook';
  if (/^vq_/i.test(id)) return 'qa';
  if (/^q\d+$/i.test(id)) return 'qa';
  return 'qa';
}

function gradeEntry(idOrEntry, maybeBody, opts = {}) {
  // Accept either (entry object) or (id, body string).
  let id, body, imagesDeferred = !!opts.imagesDeferred;
  let entryTitleStr = String(opts.title || opts.question || '');
  if (typeof idOrEntry === 'object') {
    id = idOrEntry && idOrEntry.id;
    body = String(idOrEntry && idOrEntry.answer || '');
    if (!entryTitleStr) entryTitleStr = String((idOrEntry && (idOrEntry.question || idOrEntry.title)) || '');
    if (idOrEntry && idOrEntry.images_deferred_at) imagesDeferred = true;
  } else {
    id = idOrEntry;
    body = String(maybeBody || '');
  }
  if (!body) return { pillar: pillarOf(id), score: 0, criteria: {}, word_count: 0, missing: ['empty body'], banned_hits: [] };

  const pillar = pillarOf(id, body);
  const wordFloor = pillar === 'kpi' ? 1500
                  : pillar === 'training' ? 1500
                  : pillar === 'booksummary' ? 1500
                  : pillar === 'electronicreview' ? 1800
                  : pillar === 'revenuearchitecture' ? 1800
                  : pillar === 'gtmplaybook' ? 1800
                  : pillar === 'speech' ? 700
                  : pillar === 'style' ? 1100
                  : 1100;

  const plain = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  const wordCount = plain.split(/\s+/).filter(Boolean).length;

  const h2HtmlCount = (body.match(/<h2[^>]*>/gi) || []).length;
  const h3HtmlCount = (body.match(/<h3[^>]*>/gi) || []).length;
  const h2MdCount   = (body.match(/^##\s+/gm) || []).length;
  const h3MdCount   = (body.match(/^###\s+/gm) || []).length;
  const h2Count = h2HtmlCount + h3HtmlCount + h2MdCount + h3MdCount;

  const mermaidCount = (body.match(/```mermaid\b/g) || []).length;

  const faqHeading = /<h[23][^>]*>[^<]*(?:FAQ|Frequently\s+Asked\s+Questions)/i.test(body)
                  || /^#{2,3}\s+(?:FAQ|Frequently\s+Asked\s+Questions)/im.test(body);

  const faqQACount = ((body.match(/<p>\s*<strong>[\s\S]*?\?<\/strong>/gi) || []).length)
                   + ((body.match(/^\*\*[^*]+\?\*\*/gm) || []).length);

  let sourceCount = 0;
  const srcMatch = body.match(/<h2[^>]*>\s*Sources[\s\S]*?(?=<h2|$)/i) || body.match(/##\s+Sources[\s\S]*?(?=##|$)/i);
  if (srcMatch) {
    sourceCount = (srcMatch[0].match(/<li>/gi) || []).length + (srcMatch[0].match(/^[-*]\s+/gm) || []).length;
  }

  const companyHits = (plain.match(/\b[A-Z][a-z]+(?:[A-Z][a-z]+|\s[A-Z][a-z]+)+\b/g) || []);
  const uniqueCompanies = new Set(companyHits.map(s => s.trim())).size;

  const tldrPresent =
       /<blockquote[^>]*>[\s\S]*?TL;?DR/i.test(body)
    || /<aside[^>]*class="[^"]*tldr[^"]*"/i.test(body)
    || /^>\s*\*?\*?TL;?DR/im.test(body)
    || /\*\*TL;?DR\*?\*?\s*[:—-]/i.test(body)
    || /<strong>\s*TL;?DR/i.test(body)
    || /^#{2,3}\s+TL;?DR/im.test(body)
    || /<h[23][^>]*>\s*TL;?DR/i.test(body);

  const boldSpans = (body.match(/<strong>[^<]*<\/strong>|<b>[^<]*<\/b>|\*\*[^*\n]+\*\*/gi) || []).length;

  const bannedHits = [];
  for (const re of BANNED_PHRASES) {
    const m = plain.match(re);
    if (m) bannedHits.push(m[0]);
  }

  // Per-pillar criteria.
  //   • Q&A (matching q11133 gold reference): NO TL;DR, lighter bold requirement.
  //     The Direct Answer paragraph + numbered sections do the work.
  //   • Training (matching st213 LOCKED template, 2026-05-27): NO TL;DR — the
  //     Direct Answer callout replaces it. Trainings have time-boxed H2 sections
  //     with verbatim scripts; heavy bold is satisfied by section markers.
  //   • KPI (matching ik0035 LOCKED template, 2026-05-27): keeps TL;DR + heavy
  //     bold; ALSO requires the 8 distinctive ik0035 H2 sections (Why X / The 9
  //     KPIs In Depth / Real Operators / Failure Modes / Reporting Cadence /
  //     30-60-90 / FAQ / Sources). Replaces h2_six_plus check for KPI.
  const isQA = pillar === 'qa';
  const isST = pillar === 'training';
  const isKPI = pillar === 'kpi';
  const isBS = pillar === 'booksummary';
  const isER = pillar === 'electronicreview';
  const erTitle = entryTitle(body);
  const erRankExpected = isER ? expectedRankCount(body, erTitle) : 10;
  const erRankAudit = isER ? auditRankingListMaster(body, erTitle) : null;
  let qaGoldAudit = null;
  try {
    const { auditQaGoldTemplate, appliesQaGold } = require('../../../_qa_gold_template');
    if (appliesQaGold(id, body, { title: erTitle })) {
      qaGoldAudit = auditQaGoldTemplate(body, erTitle, id);
    }
  } catch (e) { qaGoldAudit = null; }
  const isRA = pillar === 'revenuearchitecture';
  const isGP = pillar === 'gtmplaybook';
  // ER pillar: detect the two highlight markers — Best Overall + Best Value pills.
  // Authors mark them with the 🏆 / 💎 emojis in product H2 headers (e.g.
  // "## 1. Sony BDP-S6700 🏆 BEST OVERALL"), enforcing the user-set rule that
  // every top-10 list highlights both a Best Overall AND a Best Value pick.
  const erBestOverall = /(?:🏆|\bBEST\s+OVERALL\b)/i.test(body);
  const erBestValue   = /(?:💎|\bBEST\s+VALUE\b)/i.test(body);
  // ER pillar: count product H2/H3 headings — a top-10 ranking must have ≥10
  // numbered product sections (in addition to intro/FAQ/Sources sections).
  // Permissive: matches "## 1." / "## 2." / "### 1." numbering through 10+.
  const erProductSections = (body.match(/^#{2,3}\s+(?:\d+\.|#?\d+\s+[—-])/gm) || []).length;
  // ST pillar checks for the section-time-allocation pattern that st213 uses
  // (e.g., "Section 2 — Setup (15 min)" or "(5 min)" in headers).
  const stTimeAllocations = (body.match(/\(\s*\d+\s*min\s*\)/gi) || []).length;
  // KPI pillar: detect each of the 6 distinctive ik0035 H2 section headers.
  // The other 2 (FAQ, Sources) are already checked by faq_section / sources_section.
  function ikHas(re) {
    return new RegExp('(?:<h[23][^>]*>\\s*' + re + ')|(?:^#{2,3}\\s+' + re + ')', 'im').test(body);
  }
  // ik0035 section detection — permissive on heading wording, strict on
  // structural intent. Accept common equivalent phrasings so entries that
  // follow the template structure with slightly different headers still pass.
  const ikWhyDifferently   = ikHas('Why\\s+[^<\\n]{0,80}?(?:Work|Operates|Behaves|Runs?|Sells?|Differs?|Different)');
  // The in-depth KPI section. Accept the SEO-friendly "best/top/key/most important
  // KPIs" framing (2026-06-18 owner change: drop the literal "9" — hurts search
  // intent) as well as any "<N> KPIs In Depth / That Matter / to Track" heading
  // and the legacy "9/Nine KPIs" wording.
  const ikNineKpis         = ikHas('(?:The\\s+)?(?:\\d+|Nine|Ten|Best|Top|Key|Essential|Core|Most\\s+Important)?[-\\s]*KPIs?\\s+(?:In\\s+Depth|That\\s+Matter|to\\s+Track|Explained|Defined|Breakdown)')
                          || ikHas('(?:Best|Top|Key|Essential|Core|Most\\s+Important|\\d+|Nine|Ten)[-\\s]+KPIs?');
  // "Real Operators" or "Operator-Grade Context" or "Operator Context"
  const ikRealOperators    = ikHas('(?:Real\\s+Operators?|Operator[-\\s]?Grade\\s+Context|Operator\\s+Context|Named\\s+Operators?)');
  const ikFailureModes     = ikHas('Failure\\s+Modes?');
  const ikReportingCadence = ikHas('Reporting\\s+Cadence');
  // "30/60/90" or "30-60-90" or "30 60 90"
  const ik306090           = ikHas('30[\\s/-]?60[\\s/-]?90');
  const ikSectionCount = [ikWhyDifferently, ikNineKpis, ikRealOperators, ikFailureModes, ikReportingCadence, ik306090].filter(Boolean).length;
  let checks = {
    word_count_floor: wordCount >= wordFloor,
    direct_answer: /<h[23][^>]*>\s*Direct\s+Answer/i.test(body) || /^#{2,3}\s+Direct\s+Answer/im.test(body),
    // Q&A, ST, BS, ER, RA, and GP skip TL;DR (Direct Answer replaces it in those pillars). KPI keeps it.
    tldr_present: (isQA || isST || isBS || isER || isRA || isGP) ? true : tldrPresent,
    // ER pillar: 1 mermaid is fine (decision tree only) — top-10 product reviews
    // don't naturally benefit from two flowcharts. Other pillars stay at 2+.
    two_mermaids: isER ? mermaidCount >= 1 : mermaidCount >= 2,
    faq_section: faqHeading,
    sources_section: /<h[23][^>]*>\s*(?:Sources|References)/i.test(body) || /^#{2,3}\s+(?:Sources|References)/im.test(body),
    // KPI: enforce the ik0035 6 distinctive section headers (require 5+ of 6).
    // ER: require 10+ numbered product sections (the top-10 list itself).
    // Other pillars: keep the original h2_six_plus check.
    h2_six_plus: isKPI ? ikSectionCount >= 5 : isER ? erProductSections >= erRankExpected : h2Count >= 6,
    ranking_list_master: !isER || !erRankAudit || !erRankAudit.applies || erRankAudit.compliant,
    qa_gold_outline: !qaGoldAudit || !qaGoldAudit.applies || qaGoldAudit.compliant,
    sources_five_plus: sourceCount >= 5,
    faq_five_plus: faqQACount >= 4,
    // ST: time-allocation tokens in headers count toward "heavy bold" criterion
    // since the section-time markers are the ST-specific structural signal.
    // ER: enforce BOTH highlight pills (Best Overall + Best Value) instead of
    // mermaid-count; the heavy_bold criterion stays at 25+ which top-10
    // reviews easily clear (product names, specs, pros/cons all bolded).
    heavy_bold_formatting: isQA ? boldSpans >= 8 : isST ? (boldSpans >= 15 || stTimeAllocations >= 4) : isER ? (boldSpans >= 25 && erBestOverall && erBestValue) : boldSpans >= 25,
    named_companies_three_plus: uniqueCompanies >= 3,
    no_banned_phrases: bannedHits.length === 0,
  };

  // Speeches pillar — ready-to-deliver speeches/toasts + famous-speech archive.
  // Different shape from every other pillar: no mermaids, no Sources, no Top-10.
  // One ruleset serves BOTH an original-speech entry (setup → The Speech → Make
  // It Yours → Delivery → Variations → Bottom Line) AND a famous-speech entry
  // (context → text/key passages → why it endures → what you can borrow).
  if (pillar === 'speech') {
    const headSp = (re) => new RegExp('(?:<h[23][^>]*>\\s*[^<\\n]*' + re + ')|(?:^#{2,3}\\s+[^\\n]*' + re + ')', 'im').test(body);
    const placeholders = (body.match(/\[[^\]\n]{1,40}\]/g) || []).length;
    const blockquotes = (body.match(/<blockquote/gi) || []).length + (body.match(/^>\s+/gm) || []).length;
    checks = {
      word_count_floor: wordCount >= wordFloor,
      intro_or_context: checks.direct_answer || headSp('(?:Setup|Context|Background|The Occasion|Who This Is For|About)'),
      the_speech: headSp('(?:The Speech|The Toast|Full Text|Key Passages?|Notable (?:Lines?|Excerpts?|Passages?)|Excerpt|Transcript)'),
      delivery_or_why: headSp('(?:Deliver|Why It (?:Works?|Lands?|Lasts?|Endures?)|What (?:Made|Makes) (?:It|This)|How to (?:Deliver|Read|Give))'),
      takeaway: headSp('(?:Make It Yours|What You Can Borrow|Personali[sz]e|Customi[sz]e|Steal This|Lessons?|Takeaways?)'),
      variations_or_speaker: headSp('(?:Variation|Shorter|Longer|Version|About the Speaker|The Speaker|Background)'),
      bottom_line: headSp('Bottom Line'),
      h2_five_plus: h2Count >= 5,
      no_tldr: !tldrPresent,
      length_marker: /\b\d+\s*(?:min|minute)/i.test(body) || /~?\s*\d{2,4}\s*words/i.test(body),
      speech_body_present: blockquotes >= 1 || placeholders >= 2,
      no_banned_phrases: bannedHits.length === 0,
    };
  }

  // Style pillar — work/business attire. DUAL format, auto-detected:
  //   • Top-10 ranking (≥8 numbered product sections) → review-style checks.
  //   • Q&A / outfit guide ("What to wear to X", "What does business casual mean")
  //     → guide checks (Direct Answer + What to Wear + pieces + do/don't + FAQ).
  if (pillar === 'style') {
    const headSy = (re) => new RegExp('(?:<h[23][^>]*>\\s*[^<\\n]*' + re + ')|(?:^#{2,3}\\s+[^\\n]*' + re + ')', 'im').test(body);
    const isTop10 = isRankingListBody(body, erTitle);
    if (isTop10) {
      const syRankN = expectedRankCount(body, erTitle);
      checks = {
        word_count_floor: wordCount >= 1800,
        direct_answer: checks.direct_answer,
        ten_sections: erProductSections >= syRankN,
        ranking_list_master: auditRankingListMaster(body, erTitle).compliant,
        best_overall: erBestOverall,
        best_value: erBestValue,
        faq_section: faqHeading,
        sources_section: /<h[23][^>]*>\s*(?:Sources|References)/i.test(body) || /^#{2,3}\s+(?:Sources|References)/im.test(body),
        one_mermaid: mermaidCount >= 1,
        faq_five_plus: faqQACount >= 4,
        heavy_bold_formatting: boldSpans >= 25,
        named_brands_three_plus: uniqueCompanies >= 3,
        no_banned_phrases: bannedHits.length === 0,
      };
    } else {
      checks = {
        word_count_floor: wordCount >= wordFloor,
        direct_answer: checks.direct_answer,
        what_to_wear: headSy('(?:What to Wear|The Outfit|The Look|Dress Code|What .* Means?|The Rules|Build the Outfit|Core Pieces?)'),
        pieces_or_brands: uniqueCompanies >= 2,
        dos_and_donts: headSy('(?:Do(?:’|\'|)s? (?:&|and) Don|Avoid|Mistakes?|Never Wear|What Not to Wear|Pitfalls?)'),
        faq_section: faqHeading,
        bottom_line: headSy('Bottom Line'),
        h2_five_plus: h2Count >= 5,
        no_tldr: !tldrPresent,
        faq_three_plus: faqQACount >= 3,
        heavy_bold_formatting: boldSpans >= 12,
        no_banned_phrases: bannedHits.length === 0,
      };
    }
  }

  // Image LAW — applies to every pillar/format.
  checks.images_law = checkImagesLaw(body).compliant;

  let vsAudit = null;
  try {
    const { auditComparisonEntry } = require('./vs-expert-verify');
    vsAudit = auditComparisonEntry(id, entryTitleStr || erTitle, body);
    if (vsAudit.isComparison) checks.vs_compare_valid = vsAudit.structuralPass;
  } catch (_e) {}

  let score = Object.values(checks).filter(Boolean).length;
  if (!checks.images_law && !imagesDeferred) score = Math.min(score, 9);
  // MEDIA LAW (owner 2026-07-01): every page must break up its text with media — MIN 3, MAX 10
  // images. A GATE (not a scored criterion, to keep the /13 scale): without >=3 media it can NOT
  // be certified 12/13. imagesDeferred bypasses it (the crew enforces media via stationsOk).
  // MEDIA = markdown images PLUS Top-10 @@PRODUCT img= cards (they render as images and break up
  // the page just the same). A compliant Top-10 = hero cover + 10 product cards → 11 media. (owner 2026-07-02)
  const mediaCount = (body.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length + (body.match(/@@PRODUCT[^\n]* img=/g) || []).length;
  if (mediaCount < 3 && !imagesDeferred) score = Math.min(score, 11);
  const missing = Object.entries(checks).filter(([_, v]) => !v).map(([k]) => k);
  if (mediaCount < 3) missing.push('media_images(min3)');
  if (vsAudit && vsAudit.isComparison && !vsAudit.structuralPass) {
    score = Math.min(score, 11);
    missing.push(...vsAudit.gaps.map(g => 'vs:' + g));
  }

  return {
    pillar,
    score,
    criteria: checks,
    word_count: wordCount,
    word_floor: wordFloor,
    h2_count: h2Count,
    mermaid_count: mermaidCount,
    faq_qa_count: faqQACount,
    source_count: sourceCount,
    named_companies: uniqueCompanies,
    bold_spans: boldSpans,
    banned_hits: bannedHits,
    ik_section_count: isKPI ? ikSectionCount : null,
    images_law: checks.images_law,
    image_audit: checkImagesLaw(body),
    missing,
    vs_audit: vsAudit,
  };
}

module.exports = { gradeEntry, BANNED_PHRASES, pillarOf };
