// Current Events (ce) — full PULSE template: hero → Direct Answer → 6+ H2s → 2 mermaid → FAQ → Sources → Related.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const { fillEntryMissingImages } = require('./_ddg_facecard_lib');
const { searchRealPhoto } = require('./netlify/functions/lib/img-search-lib');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { prepareEntryForPublish } = require('./_write_lib');
const { formatFixEntry, contentRubricAudit, ensureDirectAnswerAfterHero, wordCount, WORD_FLOOR, directAnswerFull } = require('./_format_fixer_lib');
const { fixEntry, genDirectAnswer } = require('./_v2_components');
const { dsChat } = require('./_ds_lib');
const { stripAllCroFromBody } = require('./_cro_strip_lib');
const { isKoryCroImg } = require('./_img_flux_lib');

const FORMAT_V_CE = '2026-07-ce-complete';
const CE_GOLD_ID = 'ce0023';
const MIN_GRADE = 13;
const BAD_ESSAY_FORMAT = '2026-07-answer-occasional-imgs';
const BAD_ORDER_FORMAT = '2026-07-ce-news-order';
const OLD_CE_FORMATS = new Set([BAD_ESSAY_FORMAT, BAD_ORDER_FORMAT, '2026-07-ce-template', '2026-07-ce-news-order']);

const CE_WRITE_SYS = `You write ONE complete PULSE Current Events answer in Markdown. Follow this EXACT structure:
- First line: hero image markdown ![caption](url) — use /assets/qa/{ENTRY_ID}.jpg if you do not have another URL.
- "## Direct Answer" then a SUBSTANTIAL 2-3 FULL sentence honest direct answer.
- 6+ "## " H2 sections that thoroughly answer the question (operator-grade, specific, useful). Put a blank line then an image markdown line after several sections to break up text.
- EXACTLY 2 fenced \`\`\`mermaid flowchart TD diagrams, VALID syntax only: "flowchart TD" then simple "A[Label] --> B[Label]" lines. NO parentheses, quotes, colons, or <> inside node labels.
- "## FAQ" with 6 Q&As — each is "**A natural question?**" on its own line, then a 1-2 sentence answer.
- "## Sources" with 5 to 8 REAL, general, well-known references — name real organizations, reputable sites, or publications.
- End with "## Related on PULSE" then one line: "- Explore more in the PULSE library."
- About 2000 words. Bold key terms with **double asterisks** generously — at least 25 bolded phrases.
- NEVER invent specific statistics, prices, or fabricated studies. Keep it qualitative and honest.
Output ONLY the Markdown body — no preamble, no wrapping code fence.`;

const BAN_MAP = [[/\bdelve(?:\s+into)?\b/gi, 'examine'], [/\btapestry\b/gi, 'mix'], [/\blandscape\b/gi, 'market'], [/\bholistic\b/gi, 'complete'], [/\bin\s+today'?s\b/gi, 'in the'], [/\bever-?evolving\b/gi, 'changing'], [/\bsynerg(?:y|ies|istic)\b/gi, 'fit'], [/\bparadigm\s+shift\b/gi, 'shift'], [/\bgame-?changer\b/gi, 'major change'], [/\bcutting-?edge\b/gi, 'modern'], [/\bstate-?of-?the-?art\b/gi, 'modern'], [/\bseamless\s+integration\b/gi, 'integration'], [/\bdrive\s+growth\b/gi, 'grow revenue'], [/\bunlock\s+(value|potential)\b/gi, 'capture $1'], [/\bneedless\s+to\s+say,?\s*/gi, ''], [/\bit'?s\s+worth\s+noting\s+that\s*/gi, ''], [/\bit'?s\s+important\s+to\s+note\s+that\s*/gi, '']];

function deban(body) {
  let b = String(body);
  for (const [re, rep] of BAN_MAP) b = b.replace(re, rep);
  return b;
}

function boldify(body, target) {
  let b = String(body);
  const count = () => (b.match(/\*\*[^*\n]+\*\*/gi) || []).length;
  if (count() >= target) return b;
  b = b.replace(/^(\s*[-*]\s+)([A-Z][^:\n*]{2,46}):\s/gm, (m, p, lead) => count() >= target ? m : `${p}**${lead.trim()}:** `);
  if (count() >= target) return b;
  b = b.split(/\n/).map(line => {
    if (count() >= target) return line;
    if (/^[#>`|!\-*\d]/.test(line.trim()) || !line.trim()) return line;
    return line.replace(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\b/, (m) => `**${m}**`);
  }).join('\n');
  return b;
}

function enforceCroCardLaw(body) {
  if (!body) return body;
  let b = stripAllCroFromBody(body);
  return b.split('\n').filter(line => {
    const m = line.match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
    return !(m && isKoryCroImg(m[2]));
  }).join('\n');
}

function countInlineImages(body) {
  return (String(body || '').match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
}

function hasDirectAnswer(body) {
  return /^##\s+Direct\s+Answer/im.test(String(body || ''));
}

function directAnswerEmpty(body) {
  const m = String(body || '').match(/##\s+Direct Answer\s*\n+([\s\S]*?)(?=\n##\s|\n```|$)/i);
  if (!m) return true;
  return !String(m[1] || '').replace(/\s+/g, ' ').trim();
}

function heroPath(id) {
  return '/assets/qa/' + id + '.jpg';
}

function heroExists(id) {
  try { return fs.existsSync(WD + heroPath(id)); } catch (e) { return false; }
}

function stripLeadingH1(lines) {
  const out = [];
  let pastHero = false;
  for (const line of lines) {
    const t = line.trim();
    if (!pastHero && /^!\[[^\]]*\]\([^)]+\)\s*$/.test(t)) {
      out.push(line);
      pastHero = true;
      continue;
    }
    if (/^#\s+/.test(t) && !/^##/.test(t)) continue;
    out.push(line);
  }
  return out;
}

function extractSection(body, heading) {
  const re = new RegExp('(##\\s+' + heading + '\\s*\\n[\\s\\S]*?)(?=\\n##\\s|$)', 'i');
  const m = String(body || '').match(re);
  if (!m) return { block: '', rest: String(body || '') };
  return { block: m[1].trim(), rest: String(body || '').replace(m[0], '').replace(/\n{3,}/g, '\n\n').trim() };
}

/** FAQ → Sources → Related must trail body sections (gold ce0023 order). */
function normalizeCeSectionOrder(body) {
  let b = String(body || '').replace(/\r\n/g, '\n').trim();
  const chunks = [];
  for (const h of ['FAQ', 'Sources', 'Related on PULSE']) {
    const ex = extractSection(b, h.replace(/ /g, '\\s+'));
    if (ex.block) {
      chunks.push(ex.block);
      b = ex.rest;
    }
  }
  if (!chunks.length) return b + '\n';
  return (b.trim() + '\n\n' + chunks.join('\n\n')).replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/** Old broken passes put mermaid/code inside ## Direct Answer — repair before rewrite. */
function repairBrokenDirectAnswer(body) {
  let b = String(body || '');
  const daRe = /##\s+Direct\s+Answer\s*\n+([\s\S]*?)(?=\n##\s|$)/i;
  const m = b.match(daRe);
  if (!m) return b;
  const inner = m[1];
  const orphanMermaid = (inner.match(/```mermaid[\s\S]*?```/g) || []);
  const textOnly = inner.replace(/```[\s\S]*?```/g, '').replace(/!\[[^\]]*\]\([^)]+\)/g, '').replace(/[#*`>_]/g, '').trim();
  const sentences = (textOnly.match(/[.!?](?:\s|$)/g) || []).length;
  if (textOnly.length >= 140 && sentences >= 2) return b;
  let rest = b.replace(daRe, '').replace(/\n{3,}/g, '\n\n').trim();
  const daStub = '## Direct Answer\n\n';
  const insert = orphanMermaid.length ? '\n\n' + orphanMermaid.join('\n\n') : '';
  const heroM = rest.match(/^!\[[^\]]*\]\([^)]+\)/m);
  if (heroM) {
    const idx = rest.indexOf(heroM[0]) + heroM[0].length;
    rest = rest.slice(0, idx).trimEnd() + '\n\n' + daStub.trimEnd() + insert + '\n\n' + rest.slice(idx).trimStart();
  } else {
    rest = daStub + insert + '\n\n' + rest;
  }
  return rest.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

async function ensureDirectAnswerText(id, title, body) {
  let b = repairBrokenDirectAnswer(body);
  b = ensureDirectAnswerAfterHero(enforceCroCardLaw(normalizeCeBodyOrder(b, title, id)));
  if (directAnswerFull(b)) return b;
  const daBlock = await genDirectAnswer(title, dsChat);
  const daRe = /##\s+Direct\s+Answer\s*\n+[\s\S]*?(?=\n##\s|$)/i;
  if (daRe.test(b)) b = b.replace(daRe, daBlock.trim());
  else {
    const heroM = b.match(/^!\[[^\]]*\]\([^)]+\)/m);
    if (heroM) {
      const idx = b.indexOf(heroM[0]) + heroM[0].length;
      b = b.slice(0, idx).trimEnd() + '\n\n' + daBlock.trim() + '\n\n' + b.slice(idx).trimStart();
    } else {
      b = daBlock.trim() + '\n\n' + b;
    }
  }
  return ensureDirectAnswerAfterHero(enforceCroCardLaw(normalizeCeBodyOrder(b, title, id)));
}

function gradeCeEntry(id, body, opts) {
  return gradeEntry(id, body, opts || {});
}

function needsGrade13(id, body) {
  return gradeCeEntry(id, body).score < MIN_GRADE;
}

function normalizeCeBodyOrder(body, title, id) {
  let lines = stripLeadingH1(String(body || '').split('\n'));
  const heroLines = [];
  let i = 0;
  while (i < lines.length) {
    const t = lines[i].trim();
    if (!t) { i++; continue; }
    if (/^!\[[^\]]*\]\([^)]+\)\s*$/.test(t)) {
      heroLines.push(lines[i]);
      i++;
      continue;
    }
    break;
  }
  let rest = lines.slice(i);
  while (rest.length && !rest[0].trim()) rest.shift();
  const daIdx = rest.findIndex(l => /^##\s+Direct\s+Answer/i.test(l));
  if (daIdx < 0) {
    const out = heroLines.length ? heroLines.concat([''], rest) : rest;
    return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  }
  const tail = rest.slice(daIdx);
  if (!heroLines.length && heroExists(id)) {
    heroLines.push('![' + String(title || id).replace(/[\[\]"]/g, '').slice(0, 80) + '](' + heroPath(id) + ')');
  }
  const out = [];
  if (heroLines.length) out.push(...heroLines, '');
  out.push(...tail);
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

async function ensureCeHero(id, title, body) {
  if (/^!\[[^\]]*\]\([^)]+\)/m.test(String(body || '').split('\n').slice(0, 8).join('\n'))) return body;
  const hp = heroPath(id);
  if (heroExists(id)) {
    return '![' + String(title || id).replace(/[\[\]"]/g, '').slice(0, 80) + '](' + hp + ')\n\n' + body;
  }
  for (let t = 0; t < 6; t++) {
    const pick = await searchRealPhoto(String(title || id).replace(/[\[\]"]/g, '').slice(0, 72), id, {
      suffix: 'news photo current events',
      salt: 'ce-hero-' + t,
      skipRefine: t > 2,
    });
    if (pick && pick.img) {
      return '![' + String(title || id).replace(/[\[\]"]/g, '').slice(0, 80) + '](' + pick.img + ')\n\n' + body;
    }
  }
  return body;
}

function heroFromBody(body, id) {
  const m = String(body || '').match(/^!\[[^\]]*\]\(([^)]+)\)/m);
  if (m && m[1]) return m[1];
  if (heroExists(id)) return heroPath(id);
  return '';
}

function isCeIncomplete(body, id) {
  if (directAnswerEmpty(body)) return true;
  if (!directAnswerFull(body)) return true;
  if (wordCount(body) < WORD_FLOOR) return true;
  const h2 = (String(body || '').match(/^##\s+/gm) || []).length;
  if (h2 < 6) return true;
  const audit = contentRubricAudit(id || 'ce0000', body, { valid: new Set() });
  if (!audit.pass) return true;
  if (id && needsGrade13(id, body)) return true;
  return false;
}

async function loadCeGoldTemplate(store) {
  try {
    const e = await store.get('answers/' + CE_GOLD_ID + '.json', { type: 'json' });
    return e && e.answer ? String(e.answer).slice(0, 14000) : '';
  } catch (err) {
    return '';
  }
}

async function fullCeRewrite(id, title, opts) {
  opts = opts || {};
  const ex = opts.templateExample
    ? '\n\nMATCH THE EXACT STRUCTURE & FORMAT of this approved Current Events entry (hero first, ## Direct Answer, 6+ sections, 2 mermaid, FAQ, Sources, Related — write NEW content for the new question):\n"""\n' + opts.templateExample + '\n"""'
    : '';
  const { content } = await dsChat([
    { role: 'system', content: CE_WRITE_SYS.replace('{ENTRY_ID}', id) + ex },
    { role: 'user', content: 'Question: "' + title + '"\nEntry id: ' + id + '\nPULSE section: Current Events\nWrite the COMPLETE ~2000 word answer now.' },
  ]);
  let b = String(content || '').replace(/^```[a-z]*\s*|\s*```$/g, '').trim();
  if (b.length < 900) throw new Error('Full rewrite too short (' + b.length + ' chars)');
  b = await ensureCeHero(id, title, b);
  b = boldify(deban(b), 25);
  return b;
}

async function completeCeComponents(id, title, body, opts) {
  const valid = opts.valid || new Set();
  const siblings = opts.siblings || [];
  let b = body;
  await opts.store.setJSON('answers/' + id + '.json', Object.assign({}, opts.entryMeta || {}, { id, question: title, answer: b, updated_at: new Date().toISOString() }));
  let last = null;
  for (let round = 0; round < 4; round++) {
    last = await fixEntry(id, title, siblings, valid, dsChat);
    if (last.skipped) break;
    try {
      const e = await opts.store.get('answers/' + id + '.json', { type: 'json' });
      if (e && e.answer) b = e.answer;
    } catch (err) {}
    b = ensureDirectAnswerAfterHero(enforceCroCardLaw(normalizeCeBodyOrder(b, title, id)));
    const audit = contentRubricAudit(id, b, { valid });
    if (last.approved && audit.pass && wordCount(b) >= WORD_FLOOR) return b;
    await opts.store.setJSON('answers/' + id + '.json', Object.assign({}, opts.entryMeta || {}, { id, question: title, answer: b, updated_at: new Date().toISOString() }));
  }
  return b;
}

function needsCeFix(id, body, title, entry, forceAll) {
  if (!/^ce/i.test(id)) return false;
  if (id === CE_GOLD_ID) return false;
  if (forceAll) return true;
  if (isCeIncomplete(body, id)) return true;
  if (needsGrade13(id, body)) return true;
  if (entry && entry.format_v && OLD_CE_FORMATS.has(entry.format_v)) return true;
  if (entry && entry.format_v !== FORMAT_V_CE) return true;
  if (entry && entry.cover_src === 'no-hero') return true;
  if (entry && (entry.quality_score || 0) < MIN_GRADE) return true;
  return false;
}

async function rebuildCeEntry(id, title, body, opts) {
  opts = opts || {};
  if (!opts.store) throw new Error('rebuildCeEntry requires opts.store');

  let b = repairBrokenDirectAnswer(String(body || ''));
  if (isCeIncomplete(b, id) || wordCount(b) < 1200) {
    if (opts.onProgress) opts.onProgress({ label: 'full rewrite' });
    b = await fullCeRewrite(id, title, { templateExample: opts.templateExample });
    await opts.store.setJSON('answers/' + id + '.json', Object.assign({}, opts.entryMeta || {}, { id, question: title, answer: b, updated_at: new Date().toISOString() }));
  }

  b = normalizeCeBodyOrder(b, title, id);
  b = normalizeCeSectionOrder(b);
  b = await ensureCeHero(id, title, b);
  b = await ensureDirectAnswerText(id, title, b);
  b = ensureDirectAnswerAfterHero(enforceCroCardLaw(b));

  if (opts.onProgress) opts.onProgress({ label: 'component fix' });
  b = await completeCeComponents(id, title, b, opts);

  const r = await formatFixEntry(id, title, b, {
    valid: opts.valid || new Set(),
    siblings: opts.siblings || [],
    store: opts.store,
    entryMeta: opts.entryMeta || { id, question: title, answer: b },
    fixEntry,
    dsChat,
    deban,
    boldify,
    enforceCroCardLaw,
    maxRounds: 4,
    onProgress: opts.onProgress,
  });
  b = r.body || b;
  if (!directAnswerFull(b)) {
    if (opts.onProgress) opts.onProgress({ label: 'direct answer fix' });
    b = await ensureDirectAnswerText(id, title, b);
  }
  b = normalizeCeSectionOrder(normalizeCeBodyOrder(b, title, id));
  b = ensureDirectAnswerAfterHero(enforceCroCardLaw(b));

  const filled = await fillEntryMissingImages(id, title, b, {
    onProgress: opts.onProgress,
    upgradeMode: true,
    pollinatorPrefer: true,
  });
  b = filled.body || b;
  b = normalizeCeSectionOrder(normalizeCeBodyOrder(b, title, id));
  b = ensureDirectAnswerAfterHero(enforceCroCardLaw(b));
  if (!directAnswerFull(b)) b = await ensureDirectAnswerText(id, title, b);

  const audit = contentRubricAudit(id, b, { valid: opts.valid || new Set() });
  const wc = wordCount(b);
  const grade = gradeCeEntry(id, b);
  if (!audit.pass || wc < WORD_FLOOR) {
    throw new Error('Incomplete: ' + wc + 'w · ' + (audit.failed || []).join(', '));
  }
  if (grade.score < MIN_GRADE) {
    throw new Error('Grade ' + grade.score + '/13: ' + (grade.missing || []).join(', '));
  }
  return { body: b, audit, grade: grade.score, formatSteps: r.steps || [], words: wc, missing: grade.missing };
}

async function auditAllCeEntries(store, idx, opts) {
  opts = opts || {};
  const rows = (idx.entries || []).filter(e => e && /^ce/i.test(e.id));
  const failing = [];
  let passing = 0;
  for (const row of rows) {
    if (row.id === CE_GOLD_ID && opts.skipGold) {
      passing++;
      continue;
    }
    let body = '';
    try {
      const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
      body = e && e.answer ? e.answer : '';
    } catch (err) {
      failing.push({ id: row.id, title: row.question, score: 0, missing: ['missing blob'] });
      continue;
    }
    const g = gradeCeEntry(row.id, body);
    if (g.score >= MIN_GRADE && !isCeIncomplete(body, row.id)) passing++;
    else failing.push({ id: row.id, title: row.question, score: g.score, missing: g.missing || [], words: wordCount(body) });
  }
  return { total: rows.length, passing, failing, allPass: failing.length === 0 };
}

async function saveCeEntry(store, idx, id, title, body, existing, meta) {
  meta = meta || {};
  const grade = gradeCeEntry(id, body);
  if (grade.score < MIN_GRADE) {
    throw new Error('Refusing save ' + id + ': grade ' + grade.score + '/13 · ' + (grade.missing || []).join(', '));
  }
  const now = Date.now();
  const hp = heroFromBody(body, id) || heroPath(id);
  const img = hp || '';
  const entry = prepareEntryForPublish(id, title, {
    id, question: title, answer: body, tags: (existing && existing.tags) || ['ce', 'current-events'],
    quality_score: MIN_GRADE,
    format_v: FORMAT_V_CE,
    pending: false,
    ts: existing && existing.ts ? existing.ts : now,
    polished_at: now,
    cover_src: img ? ((existing && existing.cover_src && existing.cover_src !== 'no-hero') ? existing.cover_src : 'flux') : 'qa',
    face_title_baked: existing && existing.face_title_baked,
    ce_complete_at: now,
  });
  await store.setJSON('answers/' + id + '.json', entry);
  const i = (idx.entries || []).findIndex(e => e && e.id === id);
  const row = {
    id, question: title, format_v: FORMAT_V_CE,
    cover_src: entry.cover_src, img, polished_at: now,
    tags: entry.tags, quality_score: entry.quality_score,
  };
  if (i >= 0) idx.entries[i] = Object.assign({}, idx.entries[i], row);
  return {
    grade: grade.score,
    imgs: countInlineImages(body),
    img,
    words: meta.words || wordCount(body),
    rubricPct: meta.audit && meta.audit.rubricPct,
  };
}

module.exports = {
  FORMAT_V_CE,
  CE_GOLD_ID,
  MIN_GRADE,
  BAD_ESSAY_FORMAT,
  BAD_ORDER_FORMAT,
  OLD_CE_FORMATS,
  normalizeCeBodyOrder,
  normalizeCeSectionOrder,
  repairBrokenDirectAnswer,
  ensureDirectAnswerText,
  needsCeFix,
  isCeIncomplete,
  needsGrade13,
  gradeCeEntry,
  loadCeGoldTemplate,
  rebuildCeEntry,
  saveCeEntry,
  auditAllCeEntries,
  directAnswerEmpty,
  directAnswerFull,
  hasDirectAnswer,
  countInlineImages,
  contentRubricAudit,
  ensureDirectAnswerAfterHero,
  wordCount,
  WORD_FLOOR,
};
