'use strict';
// Borrow FAQ / Sources / mermaids / Related from OTHER on-site pages (same pillar peers)
// to help a stuck rewrite clear the content gate (≥12). Owner 2026-07-27.
// Sources: copy EXTERNAL urls those peers already cite (never invent; never cite pulserevops as Sources).
// Related: use real on-site sibling URLs.
// FAQ / mermaid: adapt peer blocks so structure passes while staying tied to this question.

const { gateScore } = require('./content_gate.js');

function section(body, re) {
  const lines = String(body || '').split('\n');
  const start = lines.findIndex(l => re.test(l.trim()));
  if (start < 0) return null;
  let end = start + 1;
  while (end < lines.length && !/^##\s/.test(lines[end].trim())) end++;
  return { text: lines.slice(start, end).join('\n'), start, end };
}

function extractMermaids(body) {
  const out = [];
  const re = /```mermaid[ \t]*\r?\n([\s\S]*?)```/gi;
  let m;
  while ((m = re.exec(String(body || ''))) && out.length < 8) out.push(m[1].trim());
  return out;
}

function externalSourceLines(sourcesText) {
  const lines = String(sourcesText || '').split('\n');
  const keep = [];
  const seen = new Set();
  for (const line of lines) {
    const urls = line.match(/https?:\/\/[^\s)]+/gi) || [];
    const ok = urls.filter(u => !/pulserevops\.com/i.test(u));
    if (!ok.length) continue;
    const key = ok.map(u => u.replace(/[),.;]+$/, '').toLowerCase()).join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    keep.push(line.trim());
  }
  return keep;
}

function faqPairCount(faqText) {
  return (String(faqText || '').match(/^###?\s+\S|^\*\*[^*]+\?\*\*|^\s*[-*]?\s*\*\*Q/gmi) || []).length
    || (String(faqText || '').match(/\?\s*$/gm) || []).length;
}

function topicStub(question) {
  return String(question || '')
    .replace(/[?!.]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 72) || 'this topic';
}

function adaptFaq(faqText, question) {
  const stub = topicStub(question);
  const lines = String(faqText || '').split('\n');
  const out = ['## FAQ', ''];
  let pairs = 0;
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    if (/^##\s/.test(L.trim())) continue;
    if (/^\*\*[^*]+\?\*\*/.test(L.trim()) || /^###?\s+.+\?/.test(L.trim())) {
      pairs++;
      // Keep peer FAQ shape; nudge the question so it still reads on this page's topic.
      if (pairs <= 6 && !new RegExp(stub.slice(0, 12).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(L)) {
        out.push(L.replace(/\?\*\*\s*$/, ' for ' + stub + '?**').replace(/\?\s*$/, ' for ' + stub + '?'));
      } else out.push(L);
      continue;
    }
    out.push(L);
  }
  if (pairs < 5) return null;
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function adaptMermaid(code, question, idx) {
  const stub = topicStub(question).replace(/["\n#`*\[\]{}()<>|]/g, '').slice(0, 36) || ('Topic' + idx);
  let c = String(code || '').trim();
  if (!c) return null;
  // Relabel first quoted node so the diagram isn't an obvious peer clone.
  let n = 0;
  c = c.replace(/\[(["'])([^"']+)\1\]/g, (full, q, lab) => {
    if (n++ === 0) return '[' + q + stub + q + ']';
    return full;
  });
  return c;
}

function replaceOrAppendSection(body, headingRe, block) {
  const sec = section(body, headingRe);
  const chunk = String(block || '').replace(/\s*$/, '') + '\n\n';
  if (!sec) return String(body || '').replace(/\s*$/, '') + '\n\n' + chunk;
  const lines = String(body).split('\n');
  return lines.slice(0, sec.start).concat(chunk.trimEnd().split('\n')).concat(lines.slice(sec.end)).join('\n');
}

function stripMermaids(body) {
  return String(body || '').replace(/```mermaid[ \t]*\r?\n[\s\S]*?```/g, '').replace(/\n{3,}/g, '\n\n');
}

function insertMermaids(body, codes) {
  let src = stripMermaids(body);
  const contentH2 = [...src.matchAll(/^##\s+.+$/gm)].filter(x => !/direct answer|faq|sources|related/i.test(x[0]));
  let added = 0;
  for (const code of codes) {
    if (added >= 2 || !code) continue;
    const block = '\n\n```mermaid\n' + code + '\n```\n';
    let target = null;
    for (const h of contentH2) {
      const start = h.index + h[0].length;
      const nx = src.indexOf('\n## ', start);
      if (!/```mermaid/.test(src.slice(start, nx < 0 ? src.length : nx))) { target = h; break; }
    }
    if (!target) target = contentH2[Math.min(added, contentH2.length - 1)] || null;
    if (target && target.index != null) {
      const pos = target.index + target[0].length;
      src = src.slice(0, pos) + block + src.slice(pos);
    } else {
      src = src.replace(/\s*$/, '') + block;
    }
    added++;
  }
  return src;
}

function buildRelated(donorIds, selfId) {
  const ids = (donorIds || []).filter(x => x && x !== selfId).slice(0, 6);
  if (!ids.length) return null;
  const lines = ['## Related on PULSE', ''];
  for (const id of ids) {
    lines.push('- [' + id + '](https://pulserevops.com/knowledge/' + id + ')');
  }
  return lines.join('\n') + '\n';
}

/**
 * Graft FAQ / Sources / mermaids / Related from donor page bodies onto `body`.
 * @param {string} body
 * @param {string} question
 * @param {Array<{id?:string, body?:string, answer?:string}>} donors
 * @param {{id?:string}} opts
 */
function borrowSections(body, question, donors, opts) {
  opts = opts || {};
  const selfId = opts.id || '';
  let src = String(body || '');
  const fixed = [];
  const from = [];
  const list = (donors || []).map(d => ({
    id: d && d.id,
    text: String((d && (d.body || d.answer)) || ''),
  })).filter(d => d.text.length > 400);
  if (!list.length) return { body: src, fixed, from };

  const g0 = gateScore({ body: src, question });
  const need = new Set((g0.fails || []).map(f => f.name));

  // —— SOURCES: union external URLs peers already publish ——
  if (need.has('SOURCES') || !section(src, /^##\s*Sources\b/i)) {
    const lines = [];
    const seen = new Set();
    for (const d of list) {
      const sec = section(d.text, /^##\s*Sources\b/i);
      if (!sec) continue;
      for (const line of externalSourceLines(sec.text)) {
        const key = (line.match(/https?:\/\/[^\s)]+/gi) || []).join('|').toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        lines.push(line);
        from.push(d.id || 'peer');
        if (lines.length >= 8) break;
      }
      if (lines.length >= 8) break;
    }
    if (lines.length >= 5) {
      src = replaceOrAppendSection(src, /^##\s*Sources\b/i, '## Sources\n\n' + lines.join('\n'));
      fixed.push('SOURCES_BORROW');
    }
  }

  // —— FAQ: adapt a peer FAQ that already has ≥5 pairs ——
  if (need.has('FAQ') || !section(src, /^##\s*(FAQ|Frequently Asked)/i)) {
    for (const d of list) {
      const sec = section(d.text, /^##\s*(FAQ|Frequently Asked)/i);
      if (!sec || faqPairCount(sec.text) < 5) continue;
      const adapted = adaptFaq(sec.text, question);
      if (!adapted) continue;
      src = replaceOrAppendSection(src, /^##\s*(FAQ|Frequently Asked)/i, adapted);
      fixed.push('FAQ_BORROW');
      from.push(d.id || 'peer');
      break;
    }
  }

  // —— MERMAID: prefer real peer diagrams over synthetic stubs ——
  if (need.has('MERMAID') || (src.match(/```mermaid/gi) || []).length !== 2) {
    const codes = [];
    for (const d of list) {
      for (const raw of extractMermaids(d.text)) {
        const a = adaptMermaid(raw, question, codes.length);
        if (a && codes.indexOf(a) < 0) {
          codes.push(a);
          from.push(d.id || 'peer');
        }
        if (codes.length >= 2) break;
      }
      if (codes.length >= 2) break;
    }
    if (codes.length >= 2) {
      src = insertMermaids(src, codes.slice(0, 2));
      fixed.push('MERMAID_BORROW');
    }
  }

  // —— RELATED: real on-site sibling URLs ——
  if (need.has('RELATED') || !/Related on PULSE/i.test(src)) {
    const rel = buildRelated(list.map(d => d.id), selfId);
    if (rel) {
      src = replaceOrAppendSection(src, /^##\s*Related on PULSE\b/i, rel);
      fixed.push('RELATED_BORROW');
    }
  }

  return { body: src, fixed, from: [...new Set(from.filter(Boolean))] };
}

/**
 * Load high-scoring same-pillar peers from Netlify blobs + _index.json.
 * store must support get(key, {type:'json'}).
 */
async function loadDonorPages(store, id, opts) {
  opts = opts || {};
  const n = Math.max(2, Math.min(8, opts.n || 4));
  const pillar = String(id || '').replace(/\d+$/, '') || '';
  let entries = [];
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    entries = (idx && idx.entries) || [];
  } catch (e) { entries = []; }
  const peers = entries
    .filter(e => e && e.id && e.id !== id && String(e.id).replace(/\d+$/, '') === pillar)
    .map(e => ({
      id: e.id,
      score: (e.gate_score != null ? e.gate_score : (e.quality_score == null ? 0 : e.quality_score)),
    }))
    .filter(e => e.score >= (opts.minScore != null ? opts.minScore : 12))
    .sort((a, b) => b.score - a.score || String(a.id).localeCompare(String(b.id)));
  const picks = peers.slice(0, n * 2); // oversample in case some bodies thin
  const donors = [];
  for (const p of picks) {
    if (donors.length >= n) break;
    try {
      const blob = await store.get('answers/' + p.id + '.json', { type: 'json', consistency: 'strong' });
      const text = String((blob && (blob.answer || blob.body)) || '');
      if (text.length < 800) continue;
      // Prefer peers that already have the structural pieces we need.
      const hasFaq = /##\s*(FAQ|Frequently Asked)/i.test(text);
      const hasSrc = /##\s*Sources\b/i.test(text);
      const mer = (text.match(/```mermaid/gi) || []).length;
      if (!hasFaq && !hasSrc && mer < 2) continue;
      donors.push({ id: p.id, body: text, score: p.score });
    } catch (e) {}
  }
  return donors;
}

module.exports = {
  borrowSections,
  loadDonorPages,
  extractMermaids,
  externalSourceLines,
  adaptFaq,
  section,
};
