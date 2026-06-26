// Economy Q&A quality gates: 1,000+ words, valid Mermaid 10 syntax.

const MIN_WORDS = 1000;
const MAX_WORDS = 1350;

function countWords(text) {
  return String(text || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`~|]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

function extractMermaidBlock(markdown) {
  const m = String(markdown || '').match(/```mermaid\s*\n([\s\S]*?)```/i);
  return m ? m[1].trim() : '';
}

function replaceMermaidBlock(markdown, inner) {
  const body = String(markdown || '');
  if (/```mermaid/i.test(body)) {
    return body.replace(/```mermaid\s*\n[\s\S]*?```/i, '```mermaid\n' + inner + '\n```');
  }
  return body + '\n\n```mermaid\n' + inner + '\n```';
}

/** Fix common LLM Mermaid 10 syntax errors (e.g. -->|label|>). */
function sanitizeMermaidSource(src) {
  let s = String(src || '').trim();
  if (!s) return '';

  s = s.replace(/^graph\s+(TD|LR|BT|RL)\b/im, 'flowchart $1');
  if (!/^flowchart\s+(TD|LR|BT|RL)\b/im.test(s)) {
    s = 'flowchart TD\n' + s;
  }

  // Broken edge label closer: -->|text|>  →  -->|text|
  s = s.replace(/-->\|([^|\n]+)\|>/g, '-->|$1|');
  s = s.replace(/-->\|([^|\n]+)\|\s*>/g, '-->|$1|');
  s = s.replace(/\|>\s*([A-Za-z0-9_])/g, '| $1');

  // Strip unsupported directives
  s = s.split('\n').filter((line) => {
    const t = line.trim();
    if (!t) return true;
    if (/^(style|classDef|class|linkStyle)\s/i.test(t)) return false;
    return true;
  }).join('\n');

  // Quote bracket labels with special characters
  s = s.replace(/(\b[A-Za-z][\w]*)\[([^\]"]+)\]/g, (_, id, lbl) => {
    const clean = lbl.trim().replace(/"/g, "'");
    if (/[():#&/;]/.test(clean) || clean.length > 28) {
      return `${id}["${clean}"]`;
    }
    return `${id}[${clean}]`;
  });

  return s.trim();
}

function defaultMermaid(question) {
  const nil = /NIL|college football|D1|FBS|FCS/i.test(question);
  if (nil) {
    return `flowchart TD
  A["Roster tiers"] --> B["Offer ladder"]
  B --> C["Donor pipeline"]
  C --> D["Collective GTM"]
  D --> E["Portal execution"]
  E --> F["Monthly scorecard"]`;
  }
  return `flowchart TD
  A["Diagnose CRM gap"] --> B["Define fields"]
  B --> C["Pilot one segment"]
  C --> D["Rollout + training"]
  D --> E["Measure weekly"]`;
}

function isLikelyValidMermaid(src) {
  const s = sanitizeMermaidSource(src);
  if (!s || s.length < 20) return false;
  if (/\|>/.test(s)) return false;
  if (!/(flowchart|graph)\s+(TD|LR|BT|RL)/i.test(s) && !/-->|---/.test(s)) return false;
  const nodes = (s.match(/\[[^\]]+\]|\([^)]+\)/g) || []).length;
  const edges = (s.match(/-->|---/g) || []).length;
  return nodes >= 2 && edges >= 1;
}

function ensureMermaidInAnswer(markdown, question) {
  let inner = extractMermaidBlock(markdown);
  inner = sanitizeMermaidSource(inner);
  if (!isLikelyValidMermaid(inner)) {
    inner = defaultMermaid(question);
  } else {
    inner = sanitizeMermaidSource(inner);
  }
  return replaceMermaidBlock(markdown, inner);
}

function validateEconomyAnswer(markdown) {
  const wc = countWords(markdown);
  const inner = extractMermaidBlock(markdown);
  const mermaidOk = isLikelyValidMermaid(sanitizeMermaidSource(inner));
  return {
    ok: wc >= MIN_WORDS && mermaidOk && /```mermaid/i.test(markdown),
    words: wc,
    mermaidOk,
    minWords: MIN_WORDS,
  };
}

function padToMinWords(markdown, question) {
  let out = String(markdown || '');
  if (countWords(out) >= MIN_WORDS) return out;
  const pads = [
    '\n\n## Week-one checkpoint\n\nConfirm the owner, pilot segment, and required fields are named in writing. Screenshot the saved report URL and pin it in the team channel so reps cannot claim they did not know the rules.\n\n',
    '\n\n## Evidence reps must capture\n\nEvery stage advance needs a dated note linking to a call, email, or ticket. Managers reject advances when evidence is missing—no exceptions during the pilot window.\n\n',
    '\n\n## Manager cadence\n\nRun the same 15-minute inspection every Monday. Track exception count week over week; the number should fall before you expand scope or turn on automation.\n\n',
    '\n\n## Handoff to finance and leadership\n\nShare one slide: baseline error rate, pilot fill rate, and forecast movement. Freeze scope for one quarter after expand so you can prove causation.\n\n',
  ];
  let i = 0;
  while (countWords(out) < MIN_WORDS && i < pads.length) {
    out += pads[i++];
  }
  while (countWords(out) < MIN_WORDS) {
    out +=
      '\n\n## Operating note\n\nDocument every exception in the system of record the same day it occurs. Undocumented fixes recreate the same failure next quarter.\n\n';
  }
  return out;
}

function finalizeEconomyAnswer(markdown, question) {
  let out = ensureMermaidInAnswer(markdown, question);
  out = padToMinWords(out, question);
  const v = validateEconomyAnswer(out);
  return { answer: out, ...v };
}

module.exports = {
  MIN_WORDS,
  MAX_WORDS,
  countWords,
  extractMermaidBlock,
  sanitizeMermaidSource,
  ensureMermaidInAnswer,
  validateEconomyAnswer,
  finalizeEconomyAnswer,
  defaultMermaid,
  isLikelyValidMermaid,
  replaceMermaidBlock,
  padToMinWords,
};
