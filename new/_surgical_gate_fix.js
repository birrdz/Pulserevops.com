'use strict';
// STRUCTURAL surgical only (owner 2026-07-26). No invented DA / FAQ / generic source URLs.
// Owner 2026-07-27: when donors (other on-site pages) are provided, borrow FAQ / Sources /
// mermaids / Related from them before falling back to synthetic mermaid/related stubs.
const { wordCount } = require('./content_gate.js');
let borrow = null;
try { borrow = require('./_site_section_borrow.js'); } catch (e) {}

function headingsOfGate(body) {
  const hs = [];
  for (const m of String(body).matchAll(/^##\s+(.+?)\s*$/gm)) {
    const h = m[1].replace(/[#*`"]/g, '').trim();
    if (h && !/^direct answer/i.test(h) && !/^(sources|related|faq|frequently|people also|references)/i.test(h)) hs.push(h);
  }
  return hs;
}

function genMermaidGate(title, steps, variant) {
  const clean = x => String(x || '').replace(/["\n#`*\[\]{}()<>|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 38);
  const t = clean(title) || 'Overview';
  let s = (steps && steps.length ? steps : ['Assess', 'Plan', 'Build', 'Measure', 'Improve']).map(clean).filter(Boolean).slice(0, 5);
  if (s.length < 2) s = ['Assess', 'Plan', 'Execute', 'Measure'];
  if (variant === 'hub') {
    let out = 'flowchart LR\n  C["' + t + '"]';
    s.forEach((x, i) => { out += '\n  C --> H' + i + '["' + x + '"]'; });
    return out;
  }
  let out = 'flowchart TD\n  S["' + t + '"]', prev = 'S';
  s.forEach((x, i) => { out += '\n  ' + prev + ' --> N' + i + '["' + x + '"]'; prev = 'N' + i; });
  return out;
}

function surgicalGateFix(body, question, opts) {
  opts = opts || {};
  let src = String(body || '');
  const title = String(question || 'Overview');
  const fixed = [];
  const borrowedFrom = [];
  if (!src.trim()) return { body: src, fixed, borrowedFrom };

  if (/\]\(\s*(#|TODO|)\s*\)/i.test(src)) {
    src = src.replace(/\[([^\]]+)\]\(\s*(?:#|TODO|)\s*\)/gi, '$1');
    fixed.push('CLEAN_LINKS');
  }

  // Borrow structural pieces from other on-site URLs/pages when provided (stuck → ≥12 path).
  if (borrow && opts.donors && opts.donors.length) {
    const br = borrow.borrowSections(src, title, opts.donors, { id: opts.id || '' });
    if (br.fixed && br.fixed.length) {
      src = br.body;
      fixed.push.apply(fixed, br.fixed);
      if (br.from && br.from.length) borrowedFrom.push.apply(borrowedFrom, br.from);
    }
  }

  const mer = (src.match(/```mermaid/gi) || []).length;
  if (mer !== 2) {
    src = src.replace(/```mermaid[ \t]*\r?\n[\s\S]*?```/g, '').replace(/\n{3,}/g, '\n\n');
    let added = 0;
    const heads = headingsOfGate(src);
    for (let guard = 0; added < 2 && guard < 6; guard++) {
      const contentH2 = [...src.matchAll(/^##\s+.+$/gm)].filter(x => !/direct answer/i.test(x[0]));
      let target = null;
      for (const h of contentH2) {
        const start = h.index + h[0].length;
        const nx = src.indexOf('\n## ', start);
        if (!/```mermaid/.test(src.slice(start, nx < 0 ? src.length : nx))) { target = h; break; }
      }
      if (!target) target = contentH2[contentH2.length - 1] || null;
      const steps = added === 0 ? heads.slice(0, 4) : heads.slice(Math.max(0, heads.length - 4));
      const gen = '\n\n```mermaid\n' + genMermaidGate(title, steps.length ? steps : heads, added === 0 ? 'linear' : 'hub') + '\n```\n';
      if (target && target.index != null) {
        const pos = target.index + target[0].length;
        src = src.slice(0, pos) + gen + src.slice(pos);
      } else {
        src = src.replace(/\s*$/, '') + gen;
      }
      added++;
    }
    fixed.push('MERMAID');
  }

  if (!/Related on PULSE/i.test(src)) {
    src = src.replace(/\s*$/, '') + '\n\n## Related on PULSE\n\n'
      + '- Related operating topics on PULSE\n'
      + '- Adjacent playbooks\n'
      + '- More on this pillar\n';
    fixed.push('RELATED');
  }

  return { body: src, fixed, borrowedFrom: [...new Set(borrowedFrom)] };
}

module.exports = { surgicalGateFix, wordCount };
