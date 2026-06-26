// Deep audit of all st#### sales-training entries.
// Read-only. Outputs JSON rows + bail-out point + summary stats.
const fs = require("fs");

const env = fs.readFileSync(".env.local", "utf8");
for (const l of env.split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const { getStore } = require("@netlify/blobs");

const ids = JSON.parse(fs.readFileSync("_audit_st_ids.json", "utf8"));

const BANNED = [
  "delve", "tapestry", "landscape", "holistic",
  "in today's", "in today’s", "ever-evolving", "ever evolving",
  "synergy", "synergies", "paradigm shift", "game-changer", "game changer",
  "cutting-edge", "cutting edge", "state-of-the-art", "state of the art",
  "seamless integration", "drive growth", "unlock value",
  "needless to say", "it's worth noting", "it’s worth noting",
  "it's important to note", "it’s important to note"
];

// Real analyst orgs we expect to see cited in healthy entries.
const ANALYST_ORGS = [
  "Forrester", "Gartner", "Pavilion", "ScaleVP", "Bessemer", "McKinsey",
  "Bain", "Deloitte", "IDC", "451 Research", "Constellation Research",
  "G2", "TrustRadius", "Capterra", "BCG", "OpenView", "RevOpsCoOp",
  "TOPO", "Sirius Decisions", "SiriusDecisions", "ICONIQ", "Insight Partners",
  "Sequoia", "Tomasz Tunguz", "Lenny Rachitsky", "Jason Lemkin", "SaaStr",
  "HubSpot Research", "Salesforce Research", "LinkedIn"
];

// Real vendor name signals (mix of SaaS sales/CRM/RevOps tooling).
const VENDOR_BRANDS = [
  "Salesforce", "HubSpot", "Pipedrive", "Outreach", "Salesloft", "Apollo",
  "ZoomInfo", "Cognism", "Lusha", "Clari", "Gong", "Chorus", "Aviso",
  "BoostUp", "Mediafly", "Highspot", "Seismic", "Showpad", "MindTickle",
  "Lessonly", "Spekit", "Walnut", "Reprise", "Consensus", "Vidyard",
  "Loom", "Calendly", "Chili Piper", "Drift", "Intercom", "Qualified",
  "6sense", "Demandbase", "Bombora", "LeanData", "Default", "Common Room",
  "RingCentral", "Aircall", "Dialpad", "Five9", "Genesys", "NICE",
  "Asana", "Monday", "ClickUp", "Notion", "Linear", "Jira",
  "Slack", "Teams", "Zoom", "Webex", "Google Meet",
  "Stripe", "Chargebee", "Recurly", "Zuora", "NetSuite", "QuickBooks",
  "Marketo", "Pardot", "Eloqua", "ActiveCampaign", "Mailchimp", "Klaviyo",
  "Snowflake", "Databricks", "BigQuery", "Looker", "Tableau", "Power BI",
  "Segment", "Hightouch", "Census", "RudderStack",
  "DocuSign", "PandaDoc", "Conga", "Ironclad",
  "Gainsight", "Totango", "ChurnZero", "Catalyst",
  "Lattice", "Culture Amp", "15Five",
  "Workday", "BambooHR", "Rippling", "Gusto"
];

function lower(s) { return (s || "").toLowerCase(); }

function deepAuditEntry(id, qs, body) {
  const text = String(body || "");
  const lc = lower(text);

  // structural counts
  const words = (text.replace(/```[\s\S]*?```/g, " ").match(/\b[A-Za-z][A-Za-z0-9'’-]*\b/g) || []).length;
  const mermaids = (text.match(/```mermaid/gi) || []).length;
  const h2All = (text.match(/^##\s+/gm) || []).length;
  // st213 template uses "## Section N — Title (X min)" — accept that OR "## N. Title"
  const numberedH2 = (text.match(/^##\s+(Section\s+\d+|\d+\.)\b/gmi) || []).length;
  const h3 = (text.match(/^###\s+/gm) || []).length;
  const bold = (text.match(/\*\*[^*\n]{2,}?\*\*/g) || []).length;

  const hasDirectAnswer = /direct answer/i.test(text);
  const hasFAQ = /(^|\n)#{2,3}\s*(FAQ|Frequently Asked)/i.test(text);
  const hasBottomLine = /(^|\n)#{2,3}\s*Bottom Line/i.test(text);
  const hasSources = /(^|\n)#{2,3}\s*Sources?/i.test(text);
  const hasTimeAlloc = /\(\s*\d{1,3}\s*(min|minutes)\s*\)/i.test(text) || /\b\d{1,3}\s*min\b/i.test(text);

  // banned phrases
  const bannedHits = [];
  for (const p of BANNED) {
    if (lc.includes(p)) bannedHits.push(p);
  }

  // vendors + analysts mentioned (deduped)
  const vendorsFound = [];
  for (const v of VENDOR_BRANDS) {
    const re = new RegExp("\\b" + v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
    if (re.test(text)) vendorsFound.push(v);
  }
  const analystsFound = [];
  for (const a of ANALYST_ORGS) {
    const re = new RegExp("\\b" + a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
    if (re.test(text)) analystsFound.push(a);
  }

  // real prices ($X or $X/seat/mo etc.)
  const priceMatches = text.match(/\$\s?\d[\d,]*(?:\.\d+)?(?:\s*\/\s*(?:seat|user|month|mo|year|yr))?/gi) || [];
  const distinctPrices = Array.from(new Set(priceMatches.map(s => s.replace(/\s+/g, " ").trim()))).slice(0, 50);

  // citations / year refs (2024-2027) co-located with %
  const pctYearHits = (text.match(/\d{1,3}\s?%[^.\n]{0,80}\b20(2[3-7])\b/g) || []).length
                    + (text.match(/\b20(2[3-7])\b[^.\n]{0,80}\d{1,3}\s?%/g) || []).length;

  // mermaid content reality — pull each mermaid block and check for at least 3 distinct named nodes that aren't 1-letter labels
  const mermaidBlocks = text.match(/```mermaid[\s\S]*?```/gi) || [];
  let mermaidsRealNamed = 0;
  for (const mb of mermaidBlocks) {
    const labels = mb.match(/\[[^\]]{4,}\]/g) || [];
    const distinct = new Set(labels.map(l => l.toLowerCase()));
    // "Real" if >=4 distinct labels, each >=4 chars, none are generic ("step 1", "node a", etc.)
    const generic = ["step 1", "step 2", "step 3", "node a", "node b", "process", "start", "end", "decision"];
    const meaningful = [...distinct].filter(l => {
      const cleaned = l.replace(/^\[|\]$/g, "").trim();
      if (cleaned.length < 4) return false;
      if (generic.includes(cleaned)) return false;
      return true;
    });
    if (meaningful.length >= 4) mermaidsRealNamed++;
  }

  // title-body consistency: pull title (first # heading) and check overlap with body words
  const titleM = text.match(/^#\s+(.+)$/m);
  const title = titleM ? titleM[1] : "";
  const titleWords = (title.toLowerCase().match(/\b[a-z]{4,}\b/g) || [])
    .filter(w => !["with", "from", "that", "this", "your", "what", "which", "when", "where", "their", "have", "into", "about", "they", "them", "these", "those", "training", "trainings", "meeting", "session"].includes(w));
  let titleOverlap = 0;
  if (titleWords.length > 0) {
    for (const w of titleWords) {
      if (lc.includes(w)) titleOverlap++;
    }
  }
  const titleConsistencyOk = titleWords.length === 0 || (titleOverlap / titleWords.length) >= 0.6;

  // generic boilerplate heuristic: extremely low vendor + low analyst + low price signals AND not industry-specific
  const industrySignal = /\b(SaaS|fintech|healthcare|insurance|legal|manufacturing|logistics|real estate|HVAC|plumbing|construction|automotive|hospitality|restaurant|retail|e-commerce|ecommerce|marketing agency|consulting|cybersecurity|biotech|pharma|edtech|proptech|insurtech|martech|adtech)\b/i.test(text);
  const looksGeneric = vendorsFound.length < 3 && analystsFound.length < 1 && distinctPrices.length < 2 && !industrySignal;

  // fabricated vendor heuristic — body claims to "recommend" or "use" Vendor X but Vendor X is not in known list AND looks made-up (CamelCase 2-word with no real-world signal). Hard to perfect; we'll just flag if there are many CamelCase proper-noun candidates that didn't match the known vendor list.
  const properNounCandidates = text.match(/\b[A-Z][a-z]{2,}(?:[A-Z][a-z]{2,}){0,2}\b/g) || [];
  const knownLower = new Set(VENDOR_BRANDS.concat(ANALYST_ORGS).map(s => s.toLowerCase()));
  const unknownProper = properNounCandidates.filter(n => !knownLower.has(n.toLowerCase()));
  // We don't flag fabrications hard — instead we count vendorsFound and require >=5 for a strong pass.

  // PASS criteria
  const passWord = words >= 1500;
  const passMermaid = mermaids >= 2;
  const passFAQ = hasFAQ;
  const passSources = hasSources;
  const passNumberedH2 = numberedH2 >= 6;
  const passDirect = hasDirectAnswer;
  const passBold = bold >= 30;
  const passQS = (typeof qs === "number" ? qs : 0) >= 10;
  const passBanned = bannedHits.length === 0;
  const passVendors = vendorsFound.length >= 5;
  const passAnalysts = analystsFound.length >= 1;
  const passMermaidReal = mermaidsRealNamed >= 2;
  const passTitleBody = titleConsistencyOk;
  const passNotGeneric = !looksGeneric;

  const failReasons = [];
  if (!passWord) failReasons.push("under-1500-words");
  if (!passMermaid) failReasons.push("under-2-mermaids");
  if (!passFAQ) failReasons.push("no-faq");
  if (!passSources) failReasons.push("no-sources");
  if (!passNumberedH2) failReasons.push("missing-numbered-h2");
  if (!passDirect) failReasons.push("no-direct-answer");
  if (!passBold) failReasons.push("low-bold");
  if (!passQS) failReasons.push("qs-under-10");
  if (!passBanned) failReasons.push("banned:" + bannedHits.slice(0, 3).join("|"));
  if (!passVendors) failReasons.push("few-real-vendors");
  if (!passAnalysts) failReasons.push("no-analyst-citation");
  if (!passMermaidReal) failReasons.push("generic-mermaid");
  if (!passTitleBody) failReasons.push("title-body-mismatch");
  if (!passNotGeneric) failReasons.push("generic-boilerplate");

  const pass = failReasons.length === 0;

  return {
    id, qs, words, mermaids, numberedH2, h2All, h3, bold,
    hasDirectAnswer, hasFAQ, hasBottomLine, hasSources, hasTimeAlloc,
    vendors: vendorsFound.length,
    analysts: analystsFound.length,
    prices: distinctPrices.length,
    pctYearHits,
    mermaidsRealNamed,
    titleOverlap, titleWordsCount: titleWords.length,
    bannedHits,
    pass, failReasons
  };
}

async function workerChunk(store, chunkIds, label) {
  const rows = [];
  for (const id of chunkIds) {
    try {
      const full = await store.get("answers/" + id + ".json", { type: "json" });
      if (!full) { rows.push({ id, missing: true, pass: false, failReasons: ["entry-missing"] }); continue; }
      const body = full.answer || full.body || "";
      const qs = typeof full.quality_score === "number" ? full.quality_score : (typeof full.qs === "number" ? full.qs : 0);
      rows.push(deepAuditEntry(id, qs, body));
    } catch (e) {
      rows.push({ id, error: String(e.message || e), pass: false, failReasons: ["fetch-error"] });
    }
  }
  process.stderr.write(`[${label}] done ${rows.length}\n`);
  return rows;
}

(async () => {
  const store = getStore({
    name: "pulse-machine-library",
    siteID: "a2b74b30-a1ac-40e2-9622-aebfc2feb482",
    token: TOK
  });

  const N = ids.length;
  const chunkSize = Math.ceil(N / 6);
  const chunks = [];
  for (let i = 0; i < 6; i++) {
    chunks.push(ids.slice(i * chunkSize, Math.min((i + 1) * chunkSize, N)));
  }

  const results = await Promise.all(chunks.map((c, i) =>
    workerChunk(store, c, "W" + String.fromCharCode(65 + i))
  ));

  // newest-first merged list
  const merged = [].concat(...results);
  // re-sort defensively newest-first
  merged.sort((a, b) => {
    const an = parseInt(a.id.replace(/\D/g, ""), 10);
    const bn = parseInt(b.id.replace(/\D/g, ""), 10);
    return bn - an;
  });

  // bail-out walk
  let consec = 0;
  let bailoutAt = null;
  let walked = 0;
  for (const r of merged) {
    walked++;
    if (r.pass) {
      consec++;
      if (consec >= 10) { bailoutAt = r.id; break; }
    } else {
      consec = 0;
    }
  }

  const audited = merged.slice(0, walked);
  const passes = audited.filter(r => r.pass).length;
  const fails = audited.filter(r => !r.pass).length;

  // failure mode tallies (from DEEP)
  const tally = {};
  for (const r of audited) {
    if (!r.failReasons) continue;
    for (const reason of r.failReasons) {
      const key = reason.startsWith("banned:") ? "banned-phrase" : reason;
      tally[key] = tally[key] || { count: 0, ids: [] };
      tally[key].count++;
      if (tally[key].ids.length < 5) tally[key].ids.push(r.id);
    }
  }

  // template conformance: numberedH2>=6 AND hasTimeAlloc AND hasDirectAnswer AND mermaids>=2 AND hasFAQ AND hasSources
  let conformCount = 0;
  for (const r of audited) {
    if (r.numberedH2 >= 6 && r.hasTimeAlloc && r.hasDirectAnswer && r.mermaids >= 2 && r.hasFAQ && r.hasSources) conformCount++;
  }

  // best-shaped (rank by composite: vendors + analysts + prices + numberedH2 + mermaidsRealNamed + bold)
  const score = r => (r.vendors || 0) * 2 + (r.analysts || 0) * 3 + (r.prices || 0) + (r.numberedH2 || 0) + (r.mermaidsRealNamed || 0) * 2 + Math.min(60, r.bold || 0) / 4;
  const bestShaped = [...audited].filter(r => r.pass).sort((a, b) => score(b) - score(a)).slice(0, 5);
  const worstShaped = [...audited].filter(r => !r.pass).sort((a, b) => (a.words || 0) - (b.words || 0)).slice(0, 5);

  const output = {
    total_st: merged.length,
    walked,
    bailout_at: bailoutAt,
    pass_count: passes,
    fail_count: fails,
    pass_pct: walked ? (passes / walked * 100).toFixed(1) : "0",
    template_conformance_pct: walked ? (conformCount / walked * 100).toFixed(1) : "0",
    failure_modes: Object.entries(tally).sort((a, b) => b[1].count - a[1].count).map(([k, v]) => ({ reason: k, count: v.count, examples: v.ids })),
    best_shaped: bestShaped.map(r => ({ id: r.id, words: r.words, vendors: r.vendors, analysts: r.analysts, prices: r.prices, numberedH2: r.numberedH2, bold: r.bold })),
    worst_shaped: worstShaped.map(r => ({ id: r.id, words: r.words, reasons: r.failReasons })),
    sample_first_30: merged.slice(0, 30).map(r => ({ id: r.id, pass: r.pass, words: r.words, mermaids: r.mermaids, numberedH2: r.numberedH2, bold: r.bold, vendors: r.vendors, analysts: r.analysts, reasons: r.failReasons }))
  };

  fs.writeFileSync("_audit_st_results.json", JSON.stringify(merged, null, 2));
  fs.writeFileSync("_audit_st_summary.json", JSON.stringify(output, null, 2));
  console.log(JSON.stringify(output, null, 2));
})();
