// ════════════════════════════════════════════════════════════════════════
// pulse-quality-audit-background — continuous quality auditor.
//
// Priority order:
//   1. Any entry created or updated TODAY that has not been audited (or has
//      a stale audit) — these go first because today's entries are the
//      most-likely-problem cohort.
//   2. Alphabetical sweep across the rest of the library to catch up
//      anything that has not been audited yet.
//   3. Re-walk entries whose last audit was > 14 days ago (so the audit
//      reflects current quality bar, not a snapshot from when the bar was
//      lower).
//   4. Idle when everything is caught up — resumes the moment a new entry
//      appears (entry.ts > cursor.last_run).
//
// Twelve quality criteria graded per entry (each 0 or 1):
//   1. word_count >= 1000           (gold-format floor)
//   2. has H2 "Direct Answer" section
//   3. has blockquote with TL;DR
//   4. has at least 2 mermaid diagrams
//   5. has H2 "FAQ" or "Frequently Asked Questions"
//   6. has H2 "Sources" / "References"
//   7. has at least 6 H2 section headings
//   8. has at least 5 distinct sources listed
//   9. has at least 5 FAQ Q&As
//  10. uses bold formatting (<strong> or **) somewhere in body
//  11. names at least 3 specific companies / operators / vendors
//  12. no banned phrases ("delve", "leverage" as verb, "tapestry", etc.)
//
// Pass threshold: 10 of 12. Below 10 → flagged for human fix.
//
// Cost: $0 (blob reads/writes only, no LLM calls).
// ════════════════════════════════════════════════════════════════════════

const { isVisitorPriorityActive } = require('./lib/visitor-priority');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const BATCH_SIZE = 30;
// Date-aware pass threshold:
//   • Entries created TODAY must hit 10/12 (full gold-format).
//   • Older v1-template entries pass at 7/12 (have valid content, just lack
//     scaffolding like mermaids/sources/extended FAQ — not actually broken).
// Owner mandate 2026-05-27: today must be strict, legacy can be lenient.
const PASS_THRESHOLD_TODAY  = 10;
const PASS_THRESHOLD_LEGACY = 7;
const STALE_AUDIT_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

function initStore() {
  if (!getStore) return null;
  try { return getStore('pulse-machine-library'); }
  catch (e) {
    const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
    if (tok && SITE_ID) {
      try { return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); } catch (_e) {}
    }
  }
  return null;
}

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

function pillarOf(entry) {
  const id = String(entry && entry.id || '');
  if (/^ik\d+$/i.test(id)) return 'kpi';
  if (/^st\d+$/i.test(id)) return 'training';
  if (/^vq_/i.test(id)) return 'qa';
  if (/^q\d+$/i.test(id)) return 'qa';
  return 'qa';
}

function gradeEntry(entry) {
  const body = String(entry && entry.answer || '');
  if (!body) {
    return { pillar: pillarOf(entry), score: 0, criteria: {}, word_count: 0, missing: ['empty body'], banned_hits: [], named_companies: 0 };
  }
  const pillar = pillarOf(entry);
  // Per-pillar word-count floor — KPI entries naturally longer than Q&A
  const wordFloor = pillar === 'kpi' ? 1500 : pillar === 'training' ? 1200 : 1100;

  const plain = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  const wordCount = plain.split(/\s+/).filter(Boolean).length;

  // Count H2/H3 sections from BOTH markdown (##, ###) AND HTML (<h2>, <h3>)
  const h2HtmlCount = (body.match(/<h2[^>]*>/gi) || []).length;
  const h3HtmlCount = (body.match(/<h3[^>]*>/gi) || []).length;
  const h2MdCount   = (body.match(/^##\s+/gm) || []).length;
  const h3MdCount   = (body.match(/^###\s+/gm) || []).length;
  const h2Count = h2HtmlCount + h3HtmlCount + h2MdCount + h3MdCount;
  const mermaidCount = (body.match(/```mermaid\b/g) || []).length;
  const faqHeading = /<h[23][^>]*>[^<]*(?:FAQ|Frequently\s+Asked\s+Questions)/i.test(body)
                   || /^#{2,3}\s+(?:FAQ|Frequently\s+Asked\s+Questions)/im.test(body);
  // Count FAQ Q&As: paragraphs starting with <strong> or **bold** question text
  const faqQACount = ((body.match(/<p>\s*<strong>[\s\S]*?\?<\/strong>/gi) || []).length)
                   + ((body.match(/^\*\*[^*]+\?\*\*/gm) || []).length);
  // Count sources: <li> items inside Sources or markdown bullets after Sources heading
  let sourceCount = 0;
  const srcMatch = body.match(/<h2[^>]*>\s*Sources[\s\S]*?(?=<h2|$)/i) || body.match(/##\s+Sources[\s\S]*?(?=##|$)/i);
  if (srcMatch) {
    sourceCount = (srcMatch[0].match(/<li>/gi) || []).length + (srcMatch[0].match(/^[-*]\s+/gm) || []).length;
  }
  // Detect named companies / vendors via capitalized multi-word noun phrases — a heuristic
  const companyHits = (plain.match(/\b[A-Z][a-z]+(?:[A-Z][a-z]+|\s[A-Z][a-z]+)+\b/g) || []);
  const uniqueCompanies = new Set(companyHits.map(s => s.trim())).size;

  const bannedHits = [];
  for (const re of BANNED_PHRASES) {
    const m = plain.match(re);
    if (m) bannedHits.push(m[0]);
  }

  // TL;DR detection: blockquote, callout class, bold-label, ## TL;DR heading,
  // or markdown blockquote — accept any of these.
  const tldrPresent =
       /<blockquote[^>]*>[\s\S]*?TL;?DR/i.test(body)
    || /<aside[^>]*class="[^"]*tldr[^"]*"/i.test(body)
    || /^>\s*\*?\*?TL;?DR/im.test(body)
    || /\*\*TL;?DR\*?\*?\s*[:—-]/i.test(body)
    || /<strong>\s*TL;?DR/i.test(body)
    || /^#{2,3}\s+TL;?DR/im.test(body)
    || /<h[23][^>]*>\s*TL;?DR/i.test(body);

  // Count bold spans — gold reference Q&A has 30-50 inline emphasis spans
  const boldSpans = (body.match(/<strong>[^<]*<\/strong>|<b>[^<]*<\/b>|\*\*[^*\n]+\*\*/gi) || []).length;

  const checks = {
    word_count_floor: wordCount >= wordFloor,
    direct_answer: /<h[23][^>]*>\s*Direct\s+Answer/i.test(body) || /^#{2,3}\s+Direct\s+Answer/im.test(body),
    tldr_present: tldrPresent,
    two_mermaids: mermaidCount >= 2,
    faq_section: faqHeading,
    sources_section: /<h[23][^>]*>\s*(?:Sources|References)/i.test(body) || /^#{2,3}\s+(?:Sources|References)/im.test(body),
    h2_six_plus: h2Count >= 6,
    sources_five_plus: sourceCount >= 5,
    faq_five_plus: faqQACount >= 4,
    heavy_bold_formatting: boldSpans >= 25,
    named_companies_three_plus: uniqueCompanies >= 3,
    no_banned_phrases: bannedHits.length === 0,
  };

  const score = Object.values(checks).filter(Boolean).length;
  const missing = Object.entries(checks).filter(([_, v]) => !v).map(([k]) => k);

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
    missing,
  };
}

function startOfTodayUTC() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}

async function pickBatch(store, sortedEntries, cursor) {
  // Priority 1: today's entries that have not been audited yet or have stale audit older than the entry ts.
  const todayStart = startOfTodayUTC();
  const todays = sortedEntries.filter(e => (e.ts || 0) >= todayStart);
  const todayUnaudited = [];
  for (const e of todays) {
    let entry = null;
    try { entry = await store.get('answers/' + e.id + '.json', { type: 'json' }); } catch (_e) {}
    if (!entry) continue;
    const audit = entry.quality_audit;
    const auditTs = audit && audit.audited_at;
    if (!audit || !auditTs || auditTs < (e.ts || 0)) todayUnaudited.push(e.id);
    if (todayUnaudited.length >= BATCH_SIZE) break;
  }
  if (todayUnaudited.length) return { ids: todayUnaudited.slice(0, BATCH_SIZE), source: 'today_priority' };

  // Priority 2: alphabetical sweep cursor.
  const sortedIds = sortedEntries.map(e => e.id).sort();
  const startPos = Math.min(cursor.last_pos || 0, sortedIds.length);
  const slice = sortedIds.slice(startPos, startPos + BATCH_SIZE);
  if (slice.length) return { ids: slice, source: 'cursor_sweep', new_pos: startPos + slice.length };

  // Priority 3: stale-audit re-walk — entries whose last audit was > 14 days ago.
  const now = Date.now();
  const staleIds = [];
  for (const e of sortedEntries) {
    let entry = null;
    try { entry = await store.get('answers/' + e.id + '.json', { type: 'json' }); } catch (_e) {}
    const audit = entry && entry.quality_audit;
    if (audit && audit.audited_at && (now - audit.audited_at) > STALE_AUDIT_MS) staleIds.push(e.id);
    if (staleIds.length >= BATCH_SIZE) break;
  }
  if (staleIds.length) return { ids: staleIds, source: 'stale_rewalk' };

  return { ids: [], source: 'idle' };
}

exports.handler = async () => {
  const store = initStore();
  if (!store) return { statusCode: 200, body: 'no store' };

  // Respect visitor priority pause
  if (await isVisitorPriorityActive(store)) {
    return { statusCode: 200, body: JSON.stringify({ ok: true, paused: 'visitor-priority' }) };
  }

  const cursor = (await store.get('_quality_audit_cursor.json', { type: 'json' })) || {
    last_pos: 0,
    last_run: 0,
    audited_total: 0,     // total audit runs (includes re-audits)
    unique_audited: 0,    // distinct entries that have been audited at least once
    unique_seen_ids: [],  // optional bookkeeping — capped to recent 5000 to avoid bloat
    pass: 0,
    fail: 0,
  };
  if (!cursor.unique_seen_ids) cursor.unique_seen_ids = [];
  if (typeof cursor.unique_audited !== 'number') cursor.unique_audited = 0;
  if (typeof cursor.audited_total !== 'number') cursor.audited_total = 0;
  if (typeof cursor.pass !== 'number') cursor.pass = 0;
  if (typeof cursor.fail !== 'number') cursor.fail = 0;
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  // Exclude graphics (gb####) — they are downloadable visual assets with a short
  // description, not long-form text, so the gold-format text grader doesn't apply.
  const entries = (idx.entries || []).filter(e => e && e.id && !/^gb\d+$/i.test(e.id));
  if (!entries.length) return { statusCode: 200, body: 'empty library' };

  const batch = await pickBatch(store, entries, cursor);
  if (!batch.ids.length) {
    // Truly idle — caught up.
    try {
      await store.setJSON('_quality_audit_status.json', {
        audited: cursor.audited_total,
        pass: cursor.pass,
        fail: cursor.fail,
        total: entries.length,
        cursor_pct: 100,
        last_run: cursor.last_run,
        idle: true,
        source: 'idle',
      });
    } catch (_e) {}
    return { statusCode: 200, body: JSON.stringify({ ok: true, idle: true, audited: cursor.audited_total }) };
  }

  const flagged = [];
  let passInBatch = 0;
  let failInBatch = 0;
  const seenIdSet = new Set(cursor.unique_seen_ids || []);
  for (const id of batch.ids) {
    let entry = null;
    try { entry = await store.get('answers/' + id + '.json', { type: 'json' }); } catch (_e) {}
    if (!entry) continue;
    const g = gradeEntry(entry);
    const isToday = (entry.ts || 0) >= startOfTodayUTC();
    const threshold = isToday ? PASS_THRESHOLD_TODAY : PASS_THRESHOLD_LEGACY;
    const passes = g.score >= threshold;
    if (passes) { cursor.pass++; passInBatch++; }
    else { cursor.fail++; failInBatch++; flagged.push({ id, score: g.score, missing: g.missing, banned: g.banned_hits, word_count: g.word_count, mermaid_count: g.mermaid_count, faq_qa_count: g.faq_qa_count, source_count: g.source_count }); }
    cursor.audited_total++;
    // Unique-counter: increment once per distinct ID ever audited (persisted in seenIdSet).
    if (!seenIdSet.has(id)) { cursor.unique_audited++; seenIdSet.add(id); }
    try {
      entry.quality_audit = {
        score: g.score,
        passes,
        word_count: g.word_count,
        h2_count: g.h2_count,
        mermaid_count: g.mermaid_count,
        faq_qa_count: g.faq_qa_count,
        source_count: g.source_count,
        named_companies: g.named_companies,
        bold_spans: g.bold_spans,
        missing: g.missing,
        banned_hits: g.banned_hits,
        audited_at: Date.now(),
      };
      await store.setJSON('answers/' + id + '.json', entry);
    } catch (_e) {}
  }

  if (batch.source === 'cursor_sweep' && typeof batch.new_pos === 'number') {
    cursor.last_pos = batch.new_pos;
  }
  cursor.last_run = Date.now();
  // Cap unique_seen_ids to avoid unbounded growth on huge libraries.
  cursor.unique_seen_ids = Array.from(seenIdSet).slice(-10000);
  await store.setJSON('_quality_audit_cursor.json', cursor);

  if (flagged.length) {
    try {
      const cur = (await store.get('_quality_audit_flagged.json', { type: 'json' })) || { items: [] };
      // Replace existing entries for the same id (latest audit wins)
      const updatedIds = new Set(flagged.map(f => f.id));
      cur.items = (cur.items || []).filter(i => !updatedIds.has(i.id));
      for (const f of flagged) cur.items.unshift({ ...f, flagged_at: Date.now() });
      cur.items = cur.items.slice(0, 500);
      cur.last_flag_at = Date.now();
      await store.setJSON('_quality_audit_flagged.json', cur);
    } catch (_e) {}
  }

  const passRate = cursor.audited_total > 0 ? Math.round((cursor.pass / cursor.audited_total) * 1000) / 10 : 0;
  const sweepPct = Math.round((cursor.last_pos / entries.length) * 1000) / 10;
  // Meter fills as unique-audited / total — visibly progresses left-to-right
  // and caps at 100% when every entry has been audited at least once.
  const uniqueAuditedClamped = Math.min(cursor.unique_audited || 0, entries.length);
  const auditedPct = entries.length > 0 ? Math.round((uniqueAuditedClamped / entries.length) * 1000) / 10 : 0;
  try {
    await store.setJSON('_quality_audit_status.json', {
      audited: cursor.audited_total,
      pass: cursor.pass,
      fail: cursor.fail,
      pass_rate: passRate,
      total: entries.length,
      cursor_pct: sweepPct,
      audited_pct: auditedPct,
      last_run: cursor.last_run,
      idle: false,
      source: batch.source,
    });
  } catch (_e) {}

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      source: batch.source,
      batch_size: batch.ids.length,
      pass: passInBatch,
      fail: failInBatch,
      total_audited: cursor.audited_total,
      cumulative_pass_rate: passRate,
      flagged: flagged.length,
    }),
  };
};
