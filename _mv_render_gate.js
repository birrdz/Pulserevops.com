// _mv_render_gate.js — RENDERED-HTML structural gate for mv entries (READ-ONLY).
// The blob audit (_mv_audit.js) can't see renderer-injected widgets/comments. This renders an entry through the
// SAME pipeline pulse-machine-entry.js uses, then asserts renderer-level structure the advisor specified:
//   C17a  no visible HTML comments (<!-- ... -->) in the rendered body
//   C17b  no two consecutive identical visible text lines (duplicated captions)
//   C17c  decision-tree mermaid renders as a diagram (mermaid-wrap), never leaks label strings as plain text
//   C18   no CRO/sponsored widget markup between an entry heading (## N.) and its "Director:" line
//
//   node _mv_render_gate.js mv0002        → check one entry, prints PASS/FAIL per criterion
//   node _mv_render_gate.js mv0001 mv0002 → check several
'use strict';
require('./_loadenv.js');
const fs = require('fs');
const vm = require('vm');
const { getStore } = require('@netlify/blobs');
const { RANKING_LIST_NO_TOP_HERO, isRankingListBody } = require('./_ranking_list_master_law');

const src = fs.readFileSync('netlify/functions/pulse-machine-entry.js', 'utf8');
const prelude = src.slice(src.indexOf('function escHtml'), src.indexOf('function findRelated'));
const ctx = { SITE: 'https://pulserevops.com', console };
vm.createContext(ctx);
vm.runInContext(prelude, ctx);

const WIDGET_MARKERS = /cro-mob-card|cro-ad-card|cro-ad\b|data-pulse-click="cro|CRO Syndicate|sponsored/i;
const MERMAID_LABELS = ['Set your mood', 'Best film', 'Best value', 'Pick #1 Best Overall', 'Pick #2 Best Value', 'Priority?'];

function renderEntry(entry, id) {
  const croStripped = ctx.stripBlobCro(entry.answer || '');
  const rankingList = RANKING_LIST_NO_TOP_HERO && isRankingListBody(croStripped, entry.question);
  let bodyForMd = rankingList ? ctx.stripLeadingCoverMarkdown(croStripped) : croStripped;
  bodyForMd = bodyForMd.replace(/<!--pillar-weave-->|<!--cro-weave-->/g, '');
  let html = ctx.wrapDirectAnswerGold(ctx.renderMd(bodyForMd, false, rankingList));
  html = ctx.insertCroAd(ctx.moveMermaidToBottom(html), id);
  return html;
}

// Strip tags to visible text, line by line, for the duplicate-line check.
function visibleLines(html) {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .split(/<\/(?:p|h1|h2|h3|h4|li|figcaption|div)>/i)
    .map((chunk) => chunk.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim())
    .filter((t) => t.length > 0);
}

function checkEntry(html) {
  const fails = [];

  // C17a — no HTML comments survive into rendered body.
  const comments = (html.match(/<!--(?!\[if)[\s\S]*?-->/g) || []).filter((c) => !/^<!--\s*(ok|noindex)/i.test(c));
  if (comments.length) fails.push('C17a_html_comment:' + comments.slice(0, 3).map((c) => c.slice(0, 24)).join('|'));

  // C17b — no consecutive duplicate visible text lines (doubled captions).
  const lines = visibleLines(html);
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === lines[i - 1] && lines[i].length > 12) { fails.push('C17b_dup_line:' + lines[i].slice(0, 32)); break; }
  }

  // C17c — mermaid must be a diagram, never leaked labels as plain text.
  if (/```mermaid/.test(html)) fails.push('C17c_raw_mermaid_fence_leak');
  const hasWrap = /mermaid-wrap/.test(html);
  // A leaked flowchart shows the label OUTSIDE any mermaid-wrap/svg. Remove wrap blocks, then look for labels.
  const outsideWrap = html.replace(/<div class="mermaid-wrap">[\s\S]*?<\/div><\/div>/g, ' ')
    .replace(/<div class="mermaid-wrap"[\s\S]*?<\/div>\s*<\/div>/g, ' ');
  for (const lbl of MERMAID_LABELS) {
    if (outsideWrap.includes(lbl)) { fails.push('C17c_label_as_plain_text:' + lbl); break; }
  }
  // A How-to-Choose section that references a flowchart but produced no wrap = mermaid didn't form.
  if (!hasWrap && MERMAID_LABELS.some((l) => html.includes(l))) fails.push('C17c_no_mermaid_wrap_but_labels_present');

  // C18 — no widget markup between an entry heading (## N.) and its Director: line.
  // Split on rank headings; within each, the segment before "Director:" must carry no widget markers.
  const parts = html.split(/(<h2[^>]*>\s*\d+\.\s)/);
  for (let i = 1; i < parts.length; i += 2) {
    const seg = (parts[i] || '') + (parts[i + 1] || '');
    const dir = seg.search(/Director:/i);
    if (dir === -1) continue;
    const head = seg.slice(0, dir);
    if (WIDGET_MARKERS.test(head)) { fails.push('C18_widget_before_director'); break; }
  }
  return fails;
}

(async () => {
  const ids = process.argv.slice(2).filter((a) => /^[a-z]+\d+$/i.test(a));
  if (!ids.length) ids.push('mv0002');
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  let anyFail = false;
  for (const id of ids) {
    let e; try { e = await store.get('answers/' + id + '.json', { type: 'json' }); } catch (x) { console.log('✗ ' + id + ' load error ' + x.message); anyFail = true; continue; }
    if (!e) { console.log('✗ ' + id + ' not found'); anyFail = true; continue; }
    const html = renderEntry(e, id);
    const fails = checkEntry(html);
    if (fails.length) { anyFail = true; console.log('✗ ' + id + ' ' + fails.join(', ')); }
    else console.log('✓ ' + id + ' render-gate PASS (C17a/C17b/C17c/C18)');
  }
  process.exitCode = anyFail ? 1 : 0;
})().catch((e) => { console.error('FATAL', e && e.message); process.exitCode = 2; });
