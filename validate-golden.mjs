#!/usr/bin/env node
/**
 * validate-golden.mjs — golden-template SPEC doc structural validator
 *
 * Validates that `GOLDEN_TEMPLATE_QA.md` (--type qa) or
 * `GOLDEN_TEMPLATE_TOP10.md` (--type top10) — the two sole doc sources of
 * truth (see CURSOR_GOLDEN_TEMPLATES.md, AGENTS.md) — still define a
 * complete quality gate: full numbered Pass-condition table, full numbered
 * checklist, gold-audit hook, word-count floor, schema law, CRO
 * render-only law, Forbidden list, and companion cross-reference.
 *
 * NOT in scope: grading a generated entry/blob. That remains
 * `auditQaGoldTemplate()` / `auditTop10GoldTemplate()` / `rubricSignOff()`
 * at pipeline runtime (see `.cursor/rules/pipeline-template-law.mdc`). A
 * prior `validate-golden.mjs` (14/14, HTML-skeleton era) is documented as
 * deleted/superseded in both golden docs' "Superseded" tables — this is a
 * new, doc-focused conformance check, not a resurrection of that gate.
 *
 * Usage:
 *   node validate-golden.mjs --type qa GOLDEN_TEMPLATE_QA.md
 *   node validate-golden.mjs --type top10 GOLDEN_TEMPLATE_TOP10.md
 *
 * Exit 0 only on a full 13/13 pass. Exit 1 otherwise (prints score + every
 * failing check with a reason).
 */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const TOTAL_CHECKS = 13;

const TYPES = {
  qa: {
    label: 'Q&A essay',
    goldId: 'q11133',
    companionFile: 'GOLDEN_TEMPLATE_TOP10.md',
    companionGoldId: 'aq1158',
    gateHeadingRegex: /^##\s*6\.\s*QUALITY GATE/m,
    gateLabel: '§6',
    passConditionRows: 18,
    numberedChecklistHeadingRegex: /^###\s*Numbered checklist\s*—\s*Q&A essay/m,
    expectedNumberedItems: 19,
    wordFloor: 600,
    auditFn: 'auditQaGoldTemplate',
    schemaMustInclude: [/`QAPage`/, /`TechArticle`/],
    schemaExclusionPhrase: /no\s*`ItemList`/i,
    requiredChecks: [
      'Title',
      'Meta description',
      'H1',
      'Direct answer',
      'Depth sections',
      'Related questions',
      'Schema',
      'Sources',
      'Word count',
      'Internal links',
      'Author + dateModified',
      'Rendering',
      'Image fallbacks',
      'CRO card',
    ],
  },
  top10: {
    label: 'Top 10 ranking list',
    goldId: 'aq1158',
    companionFile: 'GOLDEN_TEMPLATE_QA.md',
    companionGoldId: 'q11133',
    gateHeadingRegex: /^##\s*7\.\s*QUALITY GATE/m,
    gateLabel: '§7',
    passConditionRows: 18,
    numberedChecklistHeadingRegex: /^###\s*Numbered checklist\s*—\s*Top 10 ranking list/m,
    expectedNumberedItems: 20,
    wordFloor: 800,
    auditFn: 'auditTop10GoldTemplate',
    schemaMustInclude: [/`ItemList`/, /`TechArticle`/],
    schemaExclusionPhrase: /no\s*`QAPage`/i,
    requiredChecks: [
      'Title',
      'Meta description',
      'H1',
      'Direct answer',
      'H2 count',
      'Item quality',
      'ItemList schema',
      'Unique data',
      'Word count',
      'Internal links',
      'Author + dateModified',
      'Rendering',
      'Image fallbacks',
      'CRO card',
    ],
  },
};

function parseArgs(argv) {
  let type = null;
  let file = null;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--type') {
      type = argv[++i];
    } else if (arg.startsWith('--type=')) {
      type = arg.slice('--type='.length);
    } else if (!arg.startsWith('--')) {
      file = arg;
    }
  }
  return { type, file };
}

/** Extracts a markdown table's numbered data rows given a header-line regex. */
function extractNumberedTable(text, headerRegex) {
  const lines = text.split(/\r?\n/);
  const headerIdx = lines.findIndex((l) => headerRegex.test(l));
  if (headerIdx === -1) return null;
  const rows = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim().startsWith('|')) break;
    const cells = line
      .split('|')
      .map((c) => c.trim())
      .filter((c, idx, arr) => !(idx === 0 && c === '') && !(idx === arr.length - 1 && c === ''));
    if (!cells.length || /^-+$/.test(cells[0])) continue; // separator row
    const num = parseInt(cells[0], 10);
    if (!Number.isNaN(num)) {
      rows.push({ num, check: cells[1] || '', condition: cells[2] || '' });
    }
  }
  return rows;
}

/** Extracts the text of a section from a heading regex to the next heading of any level. */
function extractSection(text, startRegex) {
  const lines = text.split(/\r?\n/);
  const startIdx = lines.findIndex((l) => startRegex.test(l));
  if (startIdx === -1) return null;
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (/^#{1,6}\s/.test(lines[i])) {
      endIdx = i;
      break;
    }
  }
  return lines.slice(startIdx, endIdx).join('\n');
}

function isSequential(nums, expectedCount) {
  if (nums.length !== expectedCount) return false;
  const sorted = [...nums].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] !== i + 1) return false;
  }
  return true;
}

function runChecks(type, filePath) {
  const cfg = TYPES[type];
  const results = [];
  const record = (name, pass, detail) => results.push({ name, pass, detail });

  // 1. File readable & non-trivial
  let text = '';
  let fileOk = existsSync(filePath);
  if (fileOk) {
    try {
      text = readFileSync(filePath, 'utf8');
      fileOk = text.trim().length > 1000;
    } catch {
      fileOk = false;
    }
  }
  record('File readable & substantial', fileOk, fileOk ? `${statSync(filePath).size} bytes` : `cannot read ${filePath}`);
  if (!fileOk) {
    // Short-circuit — every remaining check depends on file content.
    for (let i = results.length; i < TOTAL_CHECKS; i++) {
      record(`(skipped — file unreadable)`, false, '');
    }
    return results;
  }

  // 2. Gold reference ID + companion cross-reference present
  const goldIdRegex = new RegExp('`?' + cfg.goldId + '`?');
  const companionIdRegex = new RegExp('`?' + cfg.companionGoldId + '`?');
  const goldIdOk = goldIdRegex.test(text) && companionIdRegex.test(text);
  record(
    'Gold reference ID + companion ID present',
    goldIdOk,
    goldIdOk ? `${cfg.goldId} + ${cfg.companionGoldId} found` : `missing ${cfg.goldId} and/or ${cfg.companionGoldId}`
  );

  // 3. Quality gate heading present
  const gateHeadingOk = cfg.gateHeadingRegex.test(text);
  record('Quality gate heading present', gateHeadingOk, gateHeadingOk ? `${cfg.gateLabel} found` : `no "${cfg.gateLabel} QUALITY GATE" heading`);

  // 4. Pass-condition table present
  const tableHeaderRegex = /^\|\s*#\s*\|\s*Check\s*\|\s*Pass condition\s*\|/;
  const rows = extractNumberedTable(text, tableHeaderRegex);
  const tableOk = Array.isArray(rows) && rows.length > 0;
  record('Pass-condition table present', tableOk, tableOk ? `${rows.length} rows found` : 'no "| # | Check | Pass condition |" table found');

  // 5. Pass-condition table has the expected, gap-free row count
  const rowCountOk = tableOk && isSequential(rows.map((r) => r.num), cfg.passConditionRows);
  record(
    'Pass-condition table row count correct',
    rowCountOk,
    tableOk ? `expected ${cfg.passConditionRows} sequential rows (1-${cfg.passConditionRows}), found ${rows.length}` : 'no table to count'
  );

  // 6. All required checks present in the table
  const checkText = tableOk ? rows.map((r) => r.check).join(' | ') : '';
  const missingChecks = cfg.requiredChecks.filter((name) => !new RegExp(escapeRegex(name), 'i').test(checkText));
  const requiredChecksOk = tableOk && missingChecks.length === 0;
  record(
    'Required check rows present (Title/Meta/H1/…/CRO card)',
    requiredChecksOk,
    requiredChecksOk ? `all ${cfg.requiredChecks.length} required checks found` : `missing: ${missingChecks.join(', ') || 'n/a'}`
  );

  // 7. Numbered checklist heading present
  const numberedHeadingOk = cfg.numberedChecklistHeadingRegex.test(text);
  record('Numbered checklist heading present', numberedHeadingOk, numberedHeadingOk ? 'found' : 'no "### Numbered checklist — …" heading');

  // 8. Numbered checklist item count correct
  const checklistSection = numberedHeadingOk ? extractSection(text, cfg.numberedChecklistHeadingRegex) : null;
  const itemNums = checklistSection
    ? [...checklistSection.matchAll(/^(\d+)\.\s+\*\*/gm)].map((m) => parseInt(m[1], 10))
    : [];
  const itemCountOk = isSequential(itemNums, cfg.expectedNumberedItems);
  record(
    'Numbered checklist item count correct',
    itemCountOk,
    `expected ${cfg.expectedNumberedItems} sequential items (1-${cfg.expectedNumberedItems}), found ${itemNums.length}`
  );

  // 9. Forbidden section present
  const forbiddenOk = /^##\s*Forbidden/m.test(text);
  record('Forbidden (without passcode) section present', forbiddenOk, forbiddenOk ? 'found' : 'no "## Forbidden" heading');

  // 10. Gate tier reference table present + names the audit fn
  const gateTierSection = extractSection(text, /^###\s*Gate tier reference/m);
  const gateTierOk = !!gateTierSection && gateTierSection.includes(cfg.auditFn);
  record(
    'Gate tier reference table present',
    gateTierOk,
    gateTierOk ? 'found + references audit fn' : 'missing "### Gate tier reference" section or audit fn not cross-referenced'
  );

  // 11. Gold audit function referenced (module-level, outside the gate-tier table too)
  const auditFnOk = (text.match(new RegExp(escapeRegex(cfg.auditFn), 'g')) || []).length >= 2;
  record('Gold audit function referenced', auditFnOk, auditFnOk ? `${cfg.auditFn} referenced` : `${cfg.auditFn} referenced fewer than 2 times`);

  // 12. Word-count floor correctly stated (and 2,000-word legacy floor explicitly waived)
  const floorRegex = new RegExp('\\u2265\\s*' + cfg.wordFloor + '\\s*words', 'i');
  const legacyWaivedRegex = /2,000[^\n]{0,80}not required|not required[^\n]{0,80}2,000/i;
  const wordFloorOk = floorRegex.test(text) && legacyWaivedRegex.test(text);
  record(
    'Word-count floor correct + legacy 2,000-word floor waived',
    wordFloorOk,
    wordFloorOk ? `≥${cfg.wordFloor} words floor confirmed; 2,000-word floor explicitly not required` : 'floor statement or 2,000-word waiver text not found'
  );

  // 13. Schema law + CRO render-only law + companion cross-reference
  const schemaIncludeOk = cfg.schemaMustInclude.every((re) => re.test(text));
  const schemaExcludeOk = cfg.schemaExclusionPhrase.test(text);
  const croRenderOnlyOk = /never\s+in\s+blob|render-time only|renderer-injected|injected at render/i.test(text);
  const companionRefOk = text.includes(cfg.companionFile);
  const crossCuttingOk = schemaIncludeOk && schemaExcludeOk && croRenderOnlyOk && companionRefOk;
  record(
    'Schema + CRO render-only law + companion cross-reference',
    crossCuttingOk,
    crossCuttingOk
      ? 'schema types, exclusion phrase, CRO render-only law, and companion file all present'
      : `schemaInclude=${schemaIncludeOk} schemaExclude=${schemaExcludeOk} croRenderOnly=${croRenderOnlyOk} companionRef=${companionRefOk}`
  );

  return results;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function main() {
  const { type, file } = parseArgs(process.argv.slice(2));

  if (!type || !TYPES[type]) {
    console.error(`Usage: node validate-golden.mjs --type <qa|top10> <file>`);
    console.error(`  Got --type=${type ?? '(none)'}`);
    process.exit(1);
  }
  if (!file) {
    console.error(`Usage: node validate-golden.mjs --type <qa|top10> <file>`);
    console.error(`  Missing file argument`);
    process.exit(1);
  }

  const filePath = resolve(process.cwd(), file);
  const cfg = TYPES[type];
  const results = runChecks(type, filePath);
  const score = results.filter((r) => r.pass).length;

  console.log(`\nvalidate-golden.mjs — ${cfg.label} (${cfg.goldId}) — ${filePath}\n`);
  results.forEach((r, i) => {
    console.log(`${r.pass ? '✓' : '✗'} ${i + 1}. ${r.name}${r.detail ? ` — ${r.detail}` : ''}`);
  });

  console.log(`\nSCORE: ${score}/${TOTAL_CHECKS}`);

  if (score === TOTAL_CHECKS) {
    console.log(`PASS — ${cfg.label} spec is structurally complete.\n`);
    process.exit(0);
  }

  const failing = results.filter((r) => !r.pass);
  console.log(`FAIL — ${failing.length} failing check(s):`);
  failing.forEach((r) => console.log(`  - ${r.name}: ${r.detail}`));
  console.log('');
  process.exit(1);
}

main();
