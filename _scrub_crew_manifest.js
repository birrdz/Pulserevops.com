// ═══════════════════════════════════════════════════════════════════════════
// SCRUB CREW MANIFEST — owner law, single source of truth (2026-07-03)
// "Claude Code" = owner's "quad code" (headless claude.exe on 20× Max plan, NOT API)
// Default crew (2026-07-04): 2 DeepSeek writers + Cursor auto-auditors (DS skeptics — not human approval pile)
// Image law: Pollinator flux hero ONLY · DDG section images · gold title CSS overlay
// ═══════════════════════════════════════════════════════════════════════════
'use strict';

function envInt(k, d) { return parseInt(process.env[k] || String(d), 10); }
function envStr(k, d) { return String(process.env[k] || d).toLowerCase().trim(); }

const LANE_CONTENT_WRITERS = Math.min(2, Math.max(1, envInt('LANE_CONTENT_WRITERS', envInt('DS_WRITER_COUNT', 2))));
const GEN_WRITERS = Math.min(2, Math.max(1, envInt('GEN_WRITERS', LANE_CONTENT_WRITERS)));
const LANE_AUDITOR_MODE = envStr('LANE_AUDITOR_MODE', 'cursor'); // cursor | human | owner | claude | claude+ds | ds

function isHumanAuditorMode(mode) {
  mode = envStr('LANE_AUDITOR_MODE', mode || LANE_AUDITOR_MODE);
  return mode === 'human' || mode === 'owner';
}

/** Per-article auditor headcount for the active mode. */
function resolveAuditorCounts(mode) {
  mode = envStr('LANE_AUDITOR_MODE', mode || LANE_AUDITOR_MODE);
  if (isHumanAuditorMode(mode)) {
    return {
      claudeCodePerArticle: 0,
      deepseekPerArticle: 0,
      deepseekFallbackOnCliError: 0,
      label: 'You audit — approval pile only (no auto auditors)',
      recommended: true,
    };
  }
  const ccCount = Math.min(2, Math.max(1, envInt('LANE_CC_AUDITORS', 2)));
  const dsOnly = Math.min(2, Math.max(1, envInt('LANE_CONTENT_AUDITORS', 2)));
  if (mode === 'cursor' || mode === 'ds') {
    return {
      claudeCodePerArticle: 0,
      deepseekPerArticle: dsOnly,
      deepseekFallbackOnCliError: 0,
      label: mode === 'cursor'
        ? ('Cursor audit — ' + dsOnly + ' DeepSeek skeptic' + (dsOnly > 1 ? 's' : '') + ' (auto · no human gate)')
        : (dsOnly + ' DeepSeek skeptic' + (dsOnly > 1 ? 's' : '') + ' (both must pass · CC auditors off)'),
      recommended: true,
    };
  }
  if (mode === 'claude+ds') {
    return {
      claudeCodePerArticle: ccCount,
      deepseekPerArticle: dsOnly,
      deepseekFallbackOnCliError: 0,
      label: ccCount + ' Claude Code + ' + dsOnly + ' DeepSeek skeptic' + (dsOnly > 1 ? 's' : '') + ' (all must pass)',
      recommended: true,
    };
  }
  // claude — 2 CC auditors, DS fallback only when claude.exe errors (per call).
  // NO_DEEPSEEK=1 (owner 2026-07-08 "we aren't using deepseek") removes the DS fallback entirely.
  const dsFallback = process.env.NO_DEEPSEEK === '1' ? 0 : 1;
  return {
    claudeCodePerArticle: ccCount,
    deepseekPerArticle: 0,
    deepseekFallbackOnCliError: dsFallback,
      label: ccCount + ' Claude Code auditor' + (ccCount > 1 ? 's' : '') + ' (both must pass · 1 DeepSeek fallback ONLY if claude.exe errors)',
      recommended: false,
  };
}

const IMAGE_LANE_LABEL = process.env.INTERNAL_IMAGES_DDG === '1' ? 'rotate flux/DDG' : 'Pollinator flux all';

function buildScrubCrewManifest() {
  const counts = resolveAuditorCounts();
  const ccPool = envInt('CC_MAX', 4);
  const contentSlots = LANE_CONTENT_WRITERS >= 2
    ? [
      { slot: 'content', count: 1, engine: 'DeepSeek API', job: 'fixEntry on Q&A A — one article per writer (never split one entry)' },
      { slot: 'content2', count: 1, engine: 'DeepSeek API', job: 'fixEntry on Q&A B — second article in parallel' },
    ]
    : [{ slot: 'content', count: 1, engine: 'DeepSeek API', job: 'fixEntry · boldify · deFab on audit fail' }];
  const workerTotal = contentSlots.length + 2; // + flux + ddg
  return {
    version: '2026-07-04',
    glossary: {
      claudeCode: 'Quad code = Claude Code CLI (claude.exe) on owner 20× Max plan — not pay-as-you-go API',
      imageLaw: 'Hero/face-card = Pollinator flux → /assets/qa/<id>.jpg (cover_src flux, >40KB). Sections = DDG self-hosted. Orange title = baked #FF8C1A on face-card.',
    },
    batch: {
      maxInFlight: envInt('SCRUB_LANE_MAX_JOBS', 48),
      refill: 'When one finishes, next red ID auto-fills its slot',
    },
    parallelWorkers: {
      total: workerTotal,
      rule: LANE_CONTENT_WRITERS + ' DeepSeek writers on ' + LANE_CONTENT_WRITERS + ' different Q&As at once (NOT two writers on one article) · image lanes ALTERNATE DDG ↔ Pollinator hero',
      imageRotate: { batch: 'IMAGE_ROTATE_BATCH (default 1)', schedule: 'DDG slice → Pollinator slice → DDG → …' },
      slots: contentSlots.concat([
        { slot: 'flux', count: 1, engine: 'Pollinator flux', job: 'face-card hero ONLY → /assets/qa/<id>.jpg (~10s freq)' },
        { slot: 'ddg', count: 1, engine: 'DuckDuckGo https', job: 'section images ONLY · top-10 · triple render verify' },
      ]),
    },
    writers: {
      deepseek: {
        count: LANE_CONTENT_WRITERS,
        concurrent: LANE_CONTENT_WRITERS,
        generateConcurrent: GEN_WRITERS,
        api: 'dsChat pay-as-you-go',
        roles: ['fixEntry', 'deFab', 'seedWrite (generate)'],
        parallelism: 'Each writer owns one full entry — scrub: content + content2 slots · generate: 2 workers × different questions',
      },
      claudeCodeWriters: { count: 0, note: 'Writing is DeepSeek only — Claude Code is audit-only' },
    },
    auditors: {
      activeMode: LANE_AUDITOR_MODE,
      envMode: 'LANE_AUDITOR_MODE=cursor (default) | human | owner | claude | claude+ds | ds',
      counts,
      claudeCodePoolMaxConcurrent: ccPool,
      poolNote: 'CC_MAX=' + ccPool + ' = max parallel claude.exe calls (need ≥2 when 2 content workers × 2 auditors)',
      passRule: 'Every auditor VERDICT=PASS and score >= 12/13',
      defabRoundsMax: 2,
      when: isHumanAuditorMode() ? 'Never — scrub runs to rubric, then stops at approval pile for you' : 'After DeepSeek fixEntry OR when content rubric blockers clear — before advancing to image_cover / images',
      onFail: isHumanAuditorMode() ? 'N/A — you ✓ or ✗ in approval pile' : 'deFab (DeepSeek) → re-audit; still fail → article STAYS in content phase (scrub) or parked (serial)',
      modes: {
        cursor: { claudeCode: 0, deepseek: 2, dsFallback: 0, default: true, note: 'ACTIVE DEFAULT — Cursor/DS auto auditors' },
        human: { claudeCode: 0, deepseek: 0, dsFallback: 0, note: 'Owner approval pile — you ✓ publish' },
        owner: { claudeCode: 0, deepseek: 0, dsFallback: 0, note: 'Alias for human' },
        claude: { claudeCode: 2, deepseek: 0, dsFallback: 1, default: false, note: 'When claude.exe works — 2 CC auditors' },
        'claude+ds': { claudeCode: 2, deepseek: 2, dsFallback: 0, note: 'Belt + suspenders' },
        ds: { claudeCode: 0, deepseek: 2, note: 'DeepSeek-only auto auditors (alias of cursor auditors)' },
      },
      flow: isHumanAuditorMode() ? [
        '1. DeepSeek fixEntry if score < MIN or content rubric blockers',
        '2. Pollinator flux hero + DDG sections + triple image verify',
        '3. rubricSignOff gate → approval pile — YOU audit (✓ publish · ✗ retarget)',
        '4. Within-page dupe sweep only — cross-page image reuse OK',
      ] : [
        '1. DeepSeek fixEntry if score < MIN or content rubric blockers',
        '2. ' + counts.label,
        '3. FAIL → DeepSeek deFab strips fabrication → re-audit (≤2 rounds)',
        '4. PASS → may advance to image_cover (Pollinator flux hero)',
        '5. DDG sections + triple image verify → rubricSignOff gate → approval pile',
        '6. Within-page dupe sweep — same photo twice on one Q&A → different image; reuse across Q&As OK',
      ],
      finalPublishGate: {
        automatedAuditor: !isHumanAuditorMode(),
        check: isHumanAuditorMode() ? 'rubricSignOff only' : 'rubricSignOff + DS/CC auditors',
        human: isHumanAuditorMode() ? 'Approval pile — owner ✓ publish' : 'Auto-publish when auditors pass; exceptions → approval pile',
      },
    },
    supervisor: {
      scrub: 'laneOrchestrate — 48-batch fill, dual content slots, DDG↔flux rotate, cooldown spread, daily cap',
      generate: 'genRun — ' + GEN_WRITERS + ' parallel factor-1 workers, fail cooldown, queue chain, generate↔scrub alt handoff',
      env: 'LANE_CONTENT_WRITERS · GEN_WRITERS · CC_MAX',
    },
    oneLiner: '48 batch · ' + workerTotal + ' workers (' + LANE_CONTENT_WRITERS + ' DS on ' + LANE_CONTENT_WRITERS + ' Q&As · ' + IMAGE_LANE_LABEL + ') · ' + counts.label + ' · supervisor',
  };
}

function crewOneLiner() {
  return buildScrubCrewManifest().oneLiner;
}

module.exports = {
  LANE_AUDITOR_MODE,
  LANE_CONTENT_WRITERS,
  GEN_WRITERS,
  isHumanAuditorMode,
  resolveAuditorCounts,
  buildScrubCrewManifest,
  crewOneLiner,
};
