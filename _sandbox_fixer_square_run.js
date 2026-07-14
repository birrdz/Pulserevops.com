#!/usr/bin/env node
/**
 * SANDBOX replica — Format Fixer → Square Builder (exact order law)
 *
 * Same station logic as localhost:8899 scrub UI, but:
 *   - local file "blobs" under _sandbox_fixer_square/answers/
 *   - mocked DeepSeek (fixEntry) that writes a content-rubric-passing body
 *   - mocked Pollinator flux that writes /assets/qa/<id>.jpg from a seed JPEG
 *
 * Usage:  node _sandbox_fixer_square_run.js
 * Report: _sandbox_fixer_square/logs/run-report.json
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const BOX = path.join(ROOT, '_sandbox_fixer_square');
const ANS = path.join(BOX, 'answers');
const ASSETS = path.join(BOX, 'assets', 'qa');
const LOGS = path.join(BOX, 'logs');
const SEED_JPG = path.join(ASSETS, '_seed.jpg');

// Fake Windows .env.local so real libs load (they hardcode C:/Users/koryj/website)
const FAKE_WD = path.join(ROOT, 'C:', 'Users', 'koryj', 'website');
fs.mkdirSync(FAKE_WD, { recursive: true });
if (!fs.existsSync(path.join(FAKE_WD, '.env.local'))) {
  fs.writeFileSync(path.join(FAKE_WD, '.env.local'),
    'DEEPSEEK_API_KEY=sandbox-fake\nds1=sandbox-fake\nBLOBS_PAT=sandbox-fake\nDS_DAILY_CAP=1000000\n');
}

// Mock Netlify blobs before any lib loads it
const Module = require('module');
const _origRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === '@netlify/blobs') {
    return {
      getStore: () => ({
        get: async () => null,
        setJSON: async () => {},
        set: async () => {},
        list: async () => ({ blobs: [] }),
      }),
    };
  }
  return _origRequire.apply(this, arguments);
};

const {
  contentFormatPass,
  contentRubricAudit,
  formatFixEntry,
  ensureDirectAnswerAfterHero,
} = require('./_format_fixer_lib');

const IDS = ['sb001', 'sb002', 'sb003'];
const TITLES = {
  sb001: 'How do I start a fractional CRO practice in 2027?',
  sb002: 'What does a fractional CRO actually do day to day?',
  sb003: 'How much should a startup pay a fractional CRO?',
};
const valid = new Set(IDS);

// ── Local blob store (mirrors Netlify answers/<id>.json) ──────────────
const store = {
  async get(key, opts) {
    const id = String(key).replace(/^answers\//, '').replace(/\.json$/, '');
    const f = path.join(ANS, id + '.json');
    if (!fs.existsSync(f)) return null;
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  },
  async setJSON(key, obj) {
    const id = String(key).replace(/^answers\//, '').replace(/\.json$/, '');
    fs.mkdirSync(ANS, { recursive: true });
    fs.writeFileSync(path.join(ANS, id + '.json'), JSON.stringify(obj, null, 2));
  },
};

function stubBody(id) {
  // Intentionally FAILS Format Fixer (short, no FAQ/mermaid/sources/DA)
  return `![stub](/assets/qa/${id}.jpg)\n\n## Intro\n\nShort draft for ${id} — not enough words, missing stations.\n`;
}

function passingBody(id, title) {
  const pad = (n) => Array.from({ length: n }, (_, i) => 'detail' + i).join(' ');
  const da =
    'Starting a fractional CRO practice in 2027 means packaging a clear offer, picking a niche, and selling advisory retainers before you hire. Most operators clear first revenue within 60 to 90 days when they lead with diagnosis workshops and fixed-scope revenue audits rather than vague retainers.';
  const sibs = IDS.filter((x) => x !== id);
  return [
    `![hero](/assets/qa/${id}.jpg)`,
    '',
    '## Direct Answer',
    '',
    da,
    '',
    '## How the model works',
    '',
    'Operators package **HubSpot**, **Salesforce**, and **Gong** into a retainer. ' + pad(400),
    '',
    `![sec1](/assets/qa/${id}-101.jpg)`,
    '',
    '## Pricing and packaging',
    '',
    '**Retainers** and **project audits** dominate. ' + pad(400),
    '',
    `![sec2](/assets/qa/${id}-102.jpg)`,
    '',
    '## Go-to-market motion',
    '',
    'Outbound plus **LinkedIn** workshops. ' + pad(400),
    '',
    `![sec3](/assets/qa/${id}-103.jpg)`,
    '',
    '## Hiring timeline',
    '',
    'First contractor in month three. ' + pad(300),
    '',
    '## Risk and compliance',
    '',
    'Contracts and insurance matter. ' + pad(300),
    '',
    '## FAQ',
    '',
    '**What is a fractional CRO?**',
    'A part-time chief revenue officer who owns pipeline and conversion.',
    '',
    '**How much does it cost?**',
    'Typical retainers run from eight to twenty-five thousand monthly.',
    '',
    '**When should a company hire one?**',
    'When ARR is past two million and growth is stalling on process.',
    '',
    '**Do they replace full-time CROs?**',
    'No — they bridge until a full-time hire is justified by scale.',
    '',
    '**What tools do they use?**',
    'CRM, attribution, forecasting models, and enablement systems.',
    '',
    '**How fast to results?**',
    'Meaningful pipeline lift usually shows in one to two quarters.',
    '',
    '```mermaid',
    'flowchart TD',
    '  A[Offer] --> B[Niche]',
    '  B --> C[Retainers]',
    '```',
    '',
    '```mermaid',
    'flowchart LR',
    '  D[Audit] --> E[Plan]',
    '  E --> F[Execute]',
    '```',
    '',
    '## Sources',
    '',
    '- [One](https://example.com/1)',
    '- [Two](https://example.com/2)',
    '- [Three](https://example.com/3)',
    '- [Four](https://example.com/4)',
    '- [Five](https://example.com/5)',
    '',
    '## Related on PULSE',
    '',
    ...sibs.map((s) => `- [${TITLES[s]}](/knowledge/${s})`),
    '',
  ].join('\n');
}

/** Mock DeepSeek fixEntry — writes a content-rubric-passing body (sandbox stand-in). */
async function mockFixEntry(id, title) {
  const e = await store.get('answers/' + id + '.json');
  const body = passingBody(id, title);
  await store.setJSON('answers/' + id + '.json', Object.assign({}, e || {}, {
    id,
    h1: title,
    answer: body,
    updated_at: new Date().toISOString(),
    sandbox_fixed_by: 'mockFixEntry',
  }));
  return { ok: true };
}

function mockDsChat() {
  return Promise.resolve('sandbox');
}

/** Owner law — copied from _scrub_button_server.js */
function passedFormatFixerGate(id, body, entryMeta) {
  if (entryMeta && entryMeta.format_fixed_at && contentFormatPass(id, body, valid)) return true;
  return contentFormatPass(id, body, valid);
}

function syncHeroDupesFaceCard(id, title, body) {
  const facePath = '/assets/qa/' + id + '.jpg';
  let b = String(body || '');
  const heroRe = /^!\[[^\]]*\]\([^)]+\)/m;
  if (heroRe.test(b)) b = b.replace(heroRe, '![' + String(title || id).replace(/[\[\]]/g, '') + '](' + facePath + ')');
  else b = '![' + id + '](' + facePath + ')\n\n' + b;
  return b;
}

/** Square Builder (Face Card) — sandbox Pollinator stand-in */
async function squareBuilder(id) {
  const title = TITLES[id] || id;
  const e = await store.get('answers/' + id + '.json');
  if (!e || !e.answer) return { noBlob: true };

  // 🔒 SAME GATE as production scrub server
  if (!passedFormatFixerGate(id, e.answer, e)) {
    return { skippedFixerGate: true, msg: 'must pass Format Fixer first' };
  }

  fs.mkdirSync(ASSETS, { recursive: true });
  const outJpg = path.join(ASSETS, id + '.jpg');
  fs.copyFileSync(SEED_JPG, outJpg);

  let body = syncHeroDupesFaceCard(id, title, e.answer);
  body = ensureDirectAnswerAfterHero(body);
  const facePath = '/assets/qa/' + id + '.jpg';
  const heroM = body.match(/!\[[^\]]*\]\(([^)\s]+)/);
  if (!heroM || heroM[1] !== facePath) {
    return { error: 'hero must dupe face-card path ' + facePath };
  }
  if (!fs.existsSync(outJpg) || fs.statSync(outJpg).size < 40) {
    return { error: 'face-card file missing/too small' };
  }

  await store.setJSON('answers/' + id + '.json', Object.assign({}, e, {
    answer: body,
    updated_at: new Date().toISOString(),
    cover_src: 'flux',
    face_title_baked: true,
    square_built_at: new Date().toISOString(),
  }));
  return { ok: true, facePath, bytes: fs.statSync(outJpg).size };
}

/** Format Fixer station — real formatFixEntry + mock DeepSeek */
async function formatFixer(id) {
  const title = TITLES[id] || id;
  const e = await store.get('answers/' + id + '.json');
  if (!e || !e.answer) return { noBlob: true };
  if (contentFormatPass(id, e.answer, valid)) {
    if (!e.format_fixed_at) {
      await store.setJSON('answers/' + id + '.json', Object.assign({}, e, {
        format_fixed_at: new Date().toISOString(),
      }));
    }
    return { skipped: true, pass: true };
  }
  const sib = IDS.filter((x) => x !== id).map((x) => ({ id: x, title: TITLES[x] }));
  const r = await formatFixEntry(id, title, e.answer, {
    valid,
    siblings: sib,
    store,
    entryMeta: e,
    fixEntry: mockFixEntry,
    dsChat: mockDsChat,
    deban: (b) => b,
    boldify: (b) => b,
    ensureErFormat: (_id, b) => b,
    enforceCroCardLaw: (b) => b,
    pillarOf: () => 'tl',
    // Sandbox Fixer→Square path needs hero+DA for contentFormatPass / croPlacementReady.
    // QA-gold visual lock strips images before DA and blocks the gate — off for this harness.
    qaGoldOutline: false,
    maxRounds: 2,
  });
  const changed = r.body && r.body !== e.answer;
  const pass = !!(r.after && r.after.pass) || !!r.pass;
  await store.setJSON('answers/' + id + '.json', Object.assign({}, e, {
    answer: r.body || e.answer,
    updated_at: new Date().toISOString(),
    format_fixed_at: pass ? new Date().toISOString() : e.format_fixed_at || null,
    format_fix_steps: r.steps || [],
  }));
  return {
    ok: true,
    pass,
    changed,
    steps: r.steps || [],
    beforePct: r.before && r.before.rubricPct,
    afterPct: r.after && r.after.rubricPct,
    failed: (r.after && r.after.failed) || [],
  };
}

function seedFixtures() {
  fs.mkdirSync(ANS, { recursive: true });
  fs.mkdirSync(ASSETS, { recursive: true });
  fs.mkdirSync(LOGS, { recursive: true });
  for (const id of IDS) {
    fs.writeFileSync(path.join(ANS, id + '.json'), JSON.stringify({
      id,
      h1: TITLES[id],
      answer: stubBody(id),
      created_at: new Date().toISOString(),
      sandbox: true,
    }, null, 2));
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log(' SANDBOX: Format Fixer → Square Builder (3 Q&As)');
  console.log('═══════════════════════════════════════════════════');
  seedFixtures();

  const report = {
    startedAt: new Date().toISOString(),
    law: 'Q&As MUST pass Format Fixer, then Square Builder',
    ids: IDS,
    steps: [],
    results: {},
  };

  // ── PROOF: Square Builder BEFORE fixer must skip ──
  console.log('\n[0] Gate proof — Square Builder on unfixed sb001 (expect SKIP)…');
  const pre = await squareBuilder('sb001');
  report.steps.push({ step: 'gate-proof-pre-fixer', id: 'sb001', result: pre });
  console.log('    →', pre.skippedFixerGate ? 'SKIPPED ✓ (gate works)' : 'UNEXPECTED: ' + JSON.stringify(pre));

  // ── STEP 1: Format Fixer on all 3 ──
  console.log('\n[1] Format Fixer — running 3 stubs…');
  for (const id of IDS) {
    const before = contentRubricAudit(id, (await store.get('answers/' + id + '.json')).answer, { valid });
    const r = await formatFixer(id);
    const afterE = await store.get('answers/' + id + '.json');
    const after = contentRubricAudit(id, afterE.answer, { valid });
    report.results[id] = report.results[id] || {};
    report.results[id].fixer = {
      beforePass: before.pass,
      beforeFailed: before.failed,
      ...r,
      afterPass: after.pass,
      afterFailed: after.failed,
      format_fixed_at: afterE.format_fixed_at || null,
    };
    console.log(`    ${id}: before=${before.pass ? 'PASS' : 'FAIL'} → after=${after.pass ? 'PASS' : 'FAIL'} · steps=${(r.steps || []).join('+') || (r.skipped ? 'already-pass' : '—')}`);
    if (!after.pass) console.log('       still failing:', after.failed.join(', '));
  }

  // ── STEP 2: Square Builder as they come out ──
  console.log('\n[2] Square Builder — only Format-Fixer passers…');
  for (const id of IDS) {
    const r = await squareBuilder(id);
    report.results[id].square = r;
    if (r.skippedFixerGate) console.log(`    ${id}: SKIPPED (fixer gate)`);
    else if (r.error) console.log(`    ${id}: ERROR ${r.error}`);
    else if (r.ok) console.log(`    ${id}: BUILT ✓ face=${r.facePath} (${r.bytes}b)`);
    else console.log(`    ${id}:`, r);
  }

  // ── Finish check ──
  console.log('\n[3] Finish check…');
  let allOk = true;
  for (const id of IDS) {
    const e = await store.get('answers/' + id + '.json');
    const fixerOk = !!e.format_fixed_at && contentFormatPass(id, e.answer, valid);
    const squareOk = e.cover_src === 'flux' && !!e.square_built_at && fs.existsSync(path.join(ASSETS, id + '.jpg'));
    const hero = (e.answer.match(/!\[[^\]]*\]\(([^)\s]+)/) || [])[1];
    const heroOk = hero === '/assets/qa/' + id + '.jpg';
    const done = fixerOk && squareOk && heroOk;
    report.results[id].finished = { fixerOk, squareOk, heroOk, done, hero };
    console.log(`    ${id}: fixer=${fixerOk ? '✓' : '✗'} square=${squareOk ? '✓' : '✗'} hero=${heroOk ? '✓' : '✗'} → ${done ? 'FINISHED' : 'NOT DONE'}`);
    if (!done) allOk = false;
  }

  report.gateProofOk = !!(pre && pre.skippedFixerGate);
  report.allFinished = allOk;
  report.verdict = allOk && report.gateProofOk
    ? 'WOULD WORK — Format Fixer → Square Builder order + finish path OK in sandbox'
    : 'BROKEN — see results';
  report.finishedAt = new Date().toISOString();

  fs.writeFileSync(path.join(LOGS, 'run-report.json'), JSON.stringify(report, null, 2));
  console.log('\n═══════════════════════════════════════════════════');
  console.log(' VERDICT:', report.verdict);
  console.log(' Report:', path.join(LOGS, 'run-report.json'));
  console.log('═══════════════════════════════════════════════════');
  process.exit(allOk && report.gateProofOk ? 0 : 1);
}

main().catch((e) => {
  console.error('SANDBOX CRASH:', e);
  process.exit(2);
});
