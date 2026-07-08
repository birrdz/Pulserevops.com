// vs-expert-verify.js — deepest-layer verification for comparison / "vs." answers.
// Topic-routed expert panels audit structure + render-readiness before publish.
const { pillarOf } = require('./grade-entry');

const VS_TITLE_RE = /\bvs\.?\b|\bversus\b/i;
// A numbered rank heading ("## 9. Plants vs. Zombies") is NOT a comparison section — a ranked item can
// legitimately be named "X vs. Y". Only a compare block or a NON-ranked "A vs B" heading signals a versus entry.
const VS_BODY_RE = /```compare\b|^#{2,3}\s+(?!\d+\.\s)[^\n]*\bvs\.?\b/im;

/** Topic → expert panel (different team per pillar, not one generic grader). */
const EXPERT_PANELS = {
  qa: {
    team: 'RevOps & GTM operators',
    focus: 'vendor fit, implementation reality, TCO, integration risk, when each wins',
  },
  revenuearchitecture: {
    team: 'Revenue architecture strategists',
    focus: 'system design tradeoffs, data model, stage-gate fit, org maturity',
  },
  gtmplaybook: {
    team: 'GTM playbook leads',
    focus: 'motion design, channel economics, pipeline math, rollout sequencing',
  },
  kpi: {
    team: 'KPI & analytics leads',
    focus: 'metric definitions, attribution, benchmark validity, dashboard design',
  },
  training: {
    team: 'Enablement & L&D architects',
    focus: 'curriculum design, skill transfer, certification paths, adoption',
  },
  electronicreview: {
    team: 'Category reviewers & buyers',
    focus: 'feature parity, price/value, use-case fit, durability/support',
  },
  speech: {
    team: 'Speechwriters & executive comms coaches',
    focus: 'rhetoric, audience fit, memorability, delivery constraints',
  },
  style: {
    team: 'Professional style editors',
    focus: 'dress code context, brand signals, climate/venue, gender-neutral guidance',
  },
  booksummary: {
    team: 'Business book analysts',
    focus: 'thesis accuracy, evidence quality, actionable takeaways vs hype',
  },
};

function pillarPrefix(id) {
  const m = String(id || '').match(/^([a-z]+)/i);
  return m ? m[1].toLowerCase() : 'q';
}

function expertPanelFor(id, title, body) {
  const pillar = pillarOf(id, body);
  const panel = EXPERT_PANELS[pillar] || EXPERT_PANELS.qa;
  const prefix = pillarPrefix(id);
  const domainLabels = {
    mv: 'Film critics & cinephiles',
    aq: 'Aquarium hobbyists & marine biologists',
    ca: 'Automotive journalists',
    sw: 'SaaS buyers & IT leads',
    ai: 'AI infrastructure architects',
    tc: 'Telecom analysts',
    hf: 'College recruiting analysts',
    sp: 'Speech coaches',
    sy: 'Style editors',
  };
  if (domainLabels[prefix]) {
    return {
      team: domainLabels[prefix],
      focus: panel.focus + '; category-specific buyer criteria for ' + prefix + ' pillar',
      pillar,
      prefix,
    };
  }
  return { ...panel, pillar, prefix };
}

function isComparisonEntry(id, title, body) {
  const t = String(title || '');
  const b = String(body || '');
  if (VS_TITLE_RE.test(t)) return true;
  if (VS_BODY_RE.test(b)) return true;
  if (/\bcompare\b/i.test(t) && /\bvs\.?\b/i.test(t)) return true;
  return false;
}

/** Parse ```compare block — same shape as pulse-machine-entry.js renderMd. */
function parseCompareBlock(body) {
  const m = String(body || '').match(/```compare\b([\s\S]*?)```/i);
  if (!m) return null;
  const lines = m[1].split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  let a = 'Option A';
  let b = 'Option B';
  const rows = [];
  for (const s of lines) {
    const ma = s.match(/^a:\s*(.+)$/i);
    if (ma) { a = ma[1].trim(); continue; }
    const mb = s.match(/^b:\s*(.+)$/i);
    if (mb) { b = mb[1].trim(); continue; }
    const it = s.replace(/^[-•*]\s*/, '').split('|').map((x) => x.trim());
    if (it.length >= 3) rows.push({ label: it[0], colA: it[1], colB: it[2] });
  }
  return { a, b, rows };
}

/** Lightweight render simulation — confirms compare table would render. */
function simulateCompareRender(body) {
  const parsed = parseCompareBlock(body);
  if (!parsed) return { renders: false, html: '', reason: 'no_compare_block' };
  if (!parsed.rows.length) return { renders: false, html: '', reason: 'compare_empty_rows' };
  const html =
    '<div class="v2-compare">' +
    parsed.rows.map((r) => `<div>${r.label}|${r.colA}|${r.colB}</div>`).join('') +
    '</div>';
  return { renders: true, html, reason: null, rowCount: parsed.rows.length, options: [parsed.a, parsed.b] };
}

function titleNamesOptions(title, parsed) {
  if (!parsed) return { match: false, note: 'no_compare_block' };
  const t = String(title || '').toLowerCase();
  const a = parsed.a.toLowerCase();
  const b = parsed.b.toLowerCase();
  const aHit = a.length > 2 && t.includes(a.slice(0, Math.min(12, a.length)));
  const bHit = b.length > 2 && t.includes(b.slice(0, Math.min(12, b.length)));
  return { match: aHit && bHit, aHit, bHit };
}

/**
 * Structural audit (deterministic, no LLM) — runs on blob + simulated render.
 * Returns gaps[] for spot-check / grade-entry integration.
 */
function auditComparisonEntry(id, title, body) {
  const isComparison = isComparisonEntry(id, title, body);
  if (!isComparison) {
    return { isComparison: false, structuralPass: true, gaps: [], panel: null, render: null };
  }
  const panel = expertPanelFor(id, title, body);
  const parsed = parseCompareBlock(body);
  const render = simulateCompareRender(body);
  const gaps = [];
  const hasDirectAnswer = /^#{2,3}\s+Direct\s+Answer/im.test(body) || /<h[23][^>]*>\s*Direct\s+Answer/i.test(body);

  if (!parsed) gaps.push('vs_missing_compare_block');
  else {
    if (!parsed.a || !parsed.b || parsed.a === 'Option A' || parsed.b === 'Option B') {
      gaps.push('vs_unnamed_options');
    }
    if (parsed.rows.length < 4) gaps.push('vs_compare_min_rows');
    const emptyCells = parsed.rows.filter((r) => !r.colA || !r.colB || !r.label);
    if (emptyCells.length) gaps.push('vs_compare_empty_cells');
    const titleMatch = titleNamesOptions(title, parsed);
    if (!titleMatch.match) gaps.push('vs_title_option_mismatch');
  }
  if (!render.renders) gaps.push('vs_compare_wont_render');
  if (!hasDirectAnswer) gaps.push('vs_missing_direct_answer');

  const mermaidCount = (String(body).match(/```mermaid\b/g) || []).length;
  if (mermaidCount < 1) gaps.push('vs_missing_mermaid');

  return {
    isComparison: true,
    structuralPass: gaps.length === 0,
    gaps,
    panel,
    render,
    parsed,
    directAnswersBothSides: !!(parsed && parsed.rows.length >= 4),
  };
}

/** Expert audit system prompt for Stage-2 / scrub (topic-specific team). */
function expertAuditSystem(panel) {
  return `You are the ${panel.team} verification panel for PULSE. Your job: confirm a "vs." comparison answer is honest, balanced, and useful.

FOCUS: ${panel.focus}

HARD FAIL if:
- One side is clearly favored without evidence, or the comparison is one-sided marketing copy.
- The Direct Answer does not state who should pick which option and why.
- The compare table is missing, has fewer than 4 rows, or has empty cells.
- Options in the title do not match the a:/b: headers in the compare block.
- Fabricated stats, prices, or vendor capabilities.

PASS when: both sides get fair treatment, tradeoffs are specific, recommendation is conditional (best for X vs best for Y), and structure matches standards.

Reply ONE line:
VERDICT=PASS|notes=...
or
VERDICT=FAIL|notes=<specific defect>`;
}

module.exports = {
  EXPERT_PANELS,
  expertPanelFor,
  isComparisonEntry,
  parseCompareBlock,
  simulateCompareRender,
  auditComparisonEntry,
  expertAuditSystem,
};
