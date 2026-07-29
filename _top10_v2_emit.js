// 🔒 TOP_LIST v2.2 EMITTER — converts an existing v1 markdown Top-10 entry into the
// v2.2 HTML skeleton. Reformatting, NOT rewriting: every fact, image and source is
// carried over from the existing body. Nothing is invented.
//
// SAFETY CONTRACT (this is the whole point):
//   • This module NEVER writes a blob, never publishes, never deploys.
//   • It returns { ok, html, missing[], report }. ok === true ONLY when the produced
//     HTML passes auditTop10V2() AND scores >= 12/13 on the live gate.
//   • Anything less returns ok:false and the caller must leave the live entry alone.
//   So a bad conversion is a no-op, never a downgrade. FAILURE ISOLATION by construction.

'use strict';

const V2 = require('./_top10_v2_template');

// ── markdown → inline HTML (links, bold, italic, code) ───────────────────────
function inline(md) {
  return String(md || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\W)\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .trim();
}

/** Block markdown → HTML paragraphs/lists. Drops images, @@PRODUCT lines and mermaid fences. */
function mdToHtml(md) {
  const lines = String(md || '')
    .replace(/```mermaid[\s\S]*?```/gi, '')
    .split('\n')
    .filter(l => !/^@@PRODUCT\b/.test(l.trim()))
    .filter(l => !/^!\[[^\]]*\]\([^)]*\)\s*$/.test(l.trim()))
    .filter(l => !/^\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)\s*$/.test(l.trim()));

  const out = [];
  let para = [];
  let list = [];
  const flushPara = () => { if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; } };
  const flushList = () => { if (list.length) { out.push('<ul>' + list.map(i => '<li>' + inline(i) + '</li>').join('') + '</ul>'); list = []; } };

  for (const raw of lines) {
    const l = raw.trim();
    if (!l) { flushPara(); flushList(); continue; }
    if (/^#{1,6}\s/.test(l)) continue;              // headings belong to the skeleton, not the body
    const bullet = l.match(/^[-*]\s+(.*)$/);
    if (bullet) { flushPara(); list.push(bullet[1]); continue; }
    flushList();
    para.push(l);
  }
  flushPara(); flushList();
  return out.join('\n');
}

// ── section extraction from the v1 markdown body ─────────────────────────────
function sectionBody(body, headingRe) {
  const lines = String(body || '').split('\n');
  const start = lines.findIndex(l => /^##\s/.test(l.trim()) && headingRe.test(l.trim().replace(/^##\s*/, '')));
  if (start < 0) return null;
  let end = start + 1;
  while (end < lines.length && !/^##\s/.test(lines[end].trim())) end++;
  return lines.slice(start + 1, end).join('\n').trim();
}

function extractRanks(body) {
  const b = String(body || '');
  const ranks = [];
  const re = /^##\s+(\d+)\.\s+(.+)$/gm;
  const heads = [];
  let m;
  while ((m = re.exec(b)) !== null) heads.push({ rank: parseInt(m[1], 10), title: m[2].trim(), at: m.index, len: m[0].length });
  for (let i = 0; i < heads.length; i++) {
    const h = heads[i];
    const blockStart = h.at + h.len;
    const blockEnd = i + 1 < heads.length ? heads[i + 1].at : (() => {
      const rest = b.slice(blockStart);
      const nx = rest.search(/\n##\s/);
      return nx < 0 ? b.length : blockStart + nx;
    })();
    const block = b.slice(blockStart, blockEnd);
    const prod = block.match(/^@@PRODUCT\s+([^\n]*)$/m);
    const attrs = prod ? prod[1] : '';
    // Image: @@PRODUCT img="…" is the v1 norm, but older entries carry a plain or
    // linked markdown image instead. Accept either — the URL is the fact we need.
    const mdImg = (block.match(/!\[[^\]]*\]\(([^)\s]+)/) || [])[1] || '';
    ranks.push({
      rank: h.rank,
      // strip the v1 pills — v2.2 headings are plain "#n: Name"
      name: h.title.replace(/[🏆💎]/g, '').replace(/\bBEST\s+(?:OVERALL|VALUE)\b/gi, '').replace(/[—–-]\s*$/, '').replace(/\s{2,}/g, ' ').trim(),
      img: (attrs.match(/\bimg="([^"]*)"/) || [])[1] || mdImg,
      site: (attrs.match(/\bsite="([^"]*)"/) || [])[1] || '',
      block,
    });
  }
  return ranks;
}

/** The item's key stat: prefer an explicit Verdict/Price line, else the first line carrying a number. */
function extractStat(block) {
  const verdict = block.match(/^\s*\*\*Verdict:?\*\*\s*(.+)$/mi);
  if (verdict) return inline(verdict[1].trim());
  const price = block.match(/^\s*[-*]?\s*\*\*Price:?\*\*\s*(.+)$/mi);
  if (price) return inline('Price: ' + price[1].trim());
  const plain = block.split('\n').map(l => l.trim())
    .filter(l => l && !/^@@PRODUCT/.test(l) && !/^#{1,6}\s/.test(l) && !/^!\[/.test(l) && !/^```/.test(l));
  // Prefer a line carrying a figure; otherwise the item's opening sentence. This slot is a
  // pull-quote, not a claim — it restates the item's own text and invents nothing.
  const numeric = plain.find(l => /\d/.test(l) && l.length > 30);
  const first = numeric || plain.find(l => l.length > 40) || plain[0] || '';
  const sentence = (String(first).match(/^.{40,240}?[.!?](?=\s|$)/) || [first])[0];
  return sentence ? inline(String(sentence).replace(/^[-*]\s*/, '').trim()) : '';
}

function extractFaq(body) {
  const faq = sectionBody(body, /^(FAQ|Frequently Asked)/i);
  if (!faq) return [];
  const pairs = [];
  const lines = faq.split('\n');
  let q = null, a = [];
  const flush = () => { if (q) { pairs.push({ q, a: a.join(' ').trim() }); q = null; a = []; } };
  for (const raw of lines) {
    const l = raw.trim();
    if (!l) continue;
    const qm = l.match(/^\*\*(.+?\?)\*\*\s*(.*)$/) || l.match(/^###\s+(.+?\??)\s*$/);
    if (qm) { flush(); q = qm[1].trim(); if (qm[2]) a.push(qm[2]); continue; }
    if (q) a.push(l);
  }
  flush();
  return pairs;
}

function extractSources(body) {
  const src = sectionBody(body, /^(Sources|References)/i);
  if (!src) return [];
  const urls = (src.match(/https?:\/\/[^\s)\]"'<]+/gi) || [])
    .map(u => u.replace(/[.,;]+$/, ''))
    .filter(u => !/pulserevops\.com/i.test(u));
  return [...new Set(urls)];
}

function extractRelated(body) {
  const b = String(body || '');
  const idx = b.search(/^##\s*Related on PULSE/im);
  if (idx < 0) return [];
  const rest = b.slice(idx);
  const nx = rest.slice(3).search(/^##\s/m);
  const block = nx < 0 ? rest : rest.slice(0, nx + 3);
  const links = Array.from(block.matchAll(/\[([^\]]+)\]\((\/[^)]+)\)/g)).map(m => ({ text: m[1], href: m[2] }));
  const seen = new Set();
  return links.filter(l => !seen.has(l.href) && seen.add(l.href));
}

function extractMermaids(body) {
  return Array.from(String(body || '').matchAll(/```mermaid[\s\S]*?```/gi)).map(m => m[0]);
}

function readMinutes(words) { return String(Math.max(1, Math.round(words / 225))); }

/**
 * Convert one entry. `entry` = { id, title, body/answer, img/facecard, pillar }.
 * `opts.extraImage` — a hero URL/alt to fill IMG_1 (v1 bodies carry only 10 images).
 * `opts.extraMermaid` — a second ```mermaid block (v1 bodies carry only 1).
 * `opts.gateScore` — inject the gate fn (avoids a hard dependency here).
 */
function emitTop10V2(entry, opts) {
  const o = opts || {};
  const body = String((entry && (entry.body || entry.answer)) || '');
  const title = String((entry && entry.title) || (body.match(/^#\s+(.+)$/m) || [])[1] || '').trim();
  const missing = [];

  const ranks = extractRanks(body);
  if (ranks.length !== 10) {
    return { ok: false, html: null, missing: ['rank_count_' + ranks.length + '_expected_10'], report: { id: entry && entry.id, reason: 'not a clean 10-item list' } };
  }

  const direct = sectionBody(body, /^Direct\s+Answer/i);
  const method = sectionBody(body, /^How\s+We\s+Ranked/i);
  const faq = extractFaq(body);
  const sources = extractSources(body);
  const related = extractRelated(body);
  const mermaids = extractMermaids(body);

  if (!direct) missing.push('direct_answer');
  if (!method) missing.push('how_we_ranked');
  if (faq.length < 5) missing.push('faq_have_' + faq.length + '_need_5');
  if (sources.length < 5) missing.push('sources_have_' + sources.length + '_need_5');
  if (related.length < 3) missing.push('related_have_' + related.length + '_need_3');

  // v1 carries exactly 10 images (one per rank) and bans a hero → IMG_1 must come from outside.
  const heroUrl = o.extraImage && o.extraImage.url;
  if (!heroUrl) missing.push('hero_image');
  const itemImgs = ranks.map(r => r.img).filter(Boolean);
  if (itemImgs.length !== 10) missing.push('item_images_have_' + itemImgs.length + '_need_10');
  if (new Set(itemImgs).size !== itemImgs.length) missing.push('duplicate_item_images');

  // v1 carries exactly 1 mermaid; v2.2 needs 2 unique.
  const m2 = o.extraMermaid || mermaids[1];
  if (!mermaids[0]) missing.push('mermaid_1');
  if (!m2) missing.push('mermaid_2');
  if (mermaids[0] && m2 && mermaids[0].trim() === String(m2).trim()) missing.push('mermaid_duplicate');

  const stats = ranks.map(r => extractStat(r.block));
  stats.forEach((s, i) => { if (!s) missing.push('item_' + (i + 1) + '_stat'); });

  if (missing.length) {
    return { ok: false, html: null, missing, report: { id: entry && entry.id, title, ranks: ranks.length } };
  }

  // ── all inputs present: pour into the skeleton ──
  const now = o.now ? new Date(o.now) : new Date(entry.updated_at || entry.published_at || Date.now());
  const iso = now.toISOString().slice(0, 10);
  const human = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const slots = {
    TITLE: title,
    META_DESC: (entry.meta_description || '').trim() ||
      (title + ' — ' + ranks[0].name + ' leads our ranking, with all ten picks compared on price, features and value.').slice(0, 160),
    READ_MIN: readMinutes(V2.v2WordCount(body)),
    UPDATED_ISO: iso,
    UPDATED_HUMAN: human,
    FACECARD_URL: entry.facecard || entry.img || (o.facecard && o.facecard.url) || '',
    FACECARD_ALT: (o.facecard && o.facecard.alt) || (title + ' — face card'),
    DIRECT_ANSWER: mdToHtml(direct),
    HOW_WE_RANKED: mdToHtml(method),
    MERMAID_1: mermaids[0],
    MERMAID_2: m2,
    QUICK_TABLE_ROWS: ranks.map((r, i) =>
      '<tr><td>' + (i + 1) + '</td><td>' + inline(r.name) + '</td><td>' +
      inline((r.block.split('\n').map(x => x.trim()).find(x => x && !/^@@PRODUCT/.test(x) && !/^[-*]/.test(x)) || '').slice(0, 90)) +
      '</td><td>' + stats[i].replace(/<[^>]+>/g, '').slice(0, 70) + '</td></tr>').join('\n'),
    SOURCES_LIST: sources.slice(0, 6).map(u => '<li><a href="' + u + '">' + u.replace(/^https?:\/\//, '').slice(0, 80) + '</a></li>').join('\n'),
    RELATED_LINKS: related.slice(0, 6).map(l => '<a href="' + l.href + '">' + inline(l.text) + '</a>').join('\n'),
    IMG_1_URL: heroUrl,
    IMG_1_ALT: (o.extraImage && o.extraImage.alt) || (title + ' overview'),
  };
  if (!slots.FACECARD_URL) return { ok: false, html: null, missing: ['facecard'], report: { id: entry && entry.id, title } };

  ranks.forEach((r, i) => {
    const n = i + 1;
    slots['ITEM_' + n + '_NAME'] = inline(r.name);
    slots['ITEM_' + n + '_BODY'] = mdToHtml(r.block);
    slots['ITEM_' + n + '_STAT'] = stats[i];
    slots['IMG_' + (n + 1) + '_URL'] = r.img;
    slots['IMG_' + (n + 1) + '_ALT'] = r.name + ' — ' + title;
  });
  faq.slice(0, 5).forEach((p, i) => {
    slots['FAQ_Q' + (i + 1)] = inline(p.q);
    slots['FAQ_A' + (i + 1)] = inline(p.a);
  });

  const html = V2.renderTop10V2(slots);

  // ── self-check: refuse to return anything that would not publish ──
  const audit = V2.auditTop10V2(html);
  const gate = typeof o.gateScore === 'function' ? o.gateScore({ body: html }) : null;
  const gateOk = !gate || gate.score >= 12;
  const auditOk = audit.compliant || audit.nonWaivable.length === 0;

  return {
    ok: auditOk && gateOk,
    html,
    missing: audit.issues,
    report: {
      id: entry && entry.id,
      title,
      words: audit.wordCount,
      images: audit.bodyImages,
      mermaids: audit.mermaids,
      gate: gate ? gate.score + '/13' : 'n/a',
      auditIssues: audit.issues,
      waivable: audit.waivable,
      nonWaivable: audit.nonWaivable,
    },
  };
}

module.exports = { emitTop10V2, mdToHtml, extractRanks, extractFaq, extractSources, extractRelated, extractMermaids };
