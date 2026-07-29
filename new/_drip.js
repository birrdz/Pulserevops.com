'use strict';
/**
 * _drip.js — 🩸 THE DRIP (owner 2026-07-28)
 *
 * ONE slow worker that walks the ENTIRE library (36k+ URLs), oldest first, and lifts every page
 * to the publish bar (12/13 or higher). When it reaches the end it wraps around to the start and
 * runs the whole library again — FOREVER.
 *
 * ── FOUR ROLES ─────────────────────────────────────────────────────────────────────────────
 *   ✍️  WRITER      CC-DOMINANT. Surgical $0 first, then Claude Code (primary), and DeepSeek is
 *                  brought in only when CC cannot reach 12/13. (owner: "make drip cc dominant",
 *                  "bring in ds when cannot reach 12/13")
 *   🔍 AUDITOR     Independent re-score of whatever the writer produced: 13-point gate + golden
 *                  SHAPE check. A body that games the score but breaks the q11133 shape is
 *                  REJECTED — the gate alone is blind to shape.
 *   🧭 SUPERVISOR  Per-page decision engine. Reads the auditor verdict + the attempt history and
 *                  rules: RETRY · ESCALATE · BRING_IN_DS · PUBLISH · DEFER. Owns the ladder.
 *   📋 MANAGER     Run level: cursor, pacing, wrap-around, counters, per-URL email, state file,
 *                  and the stop flag the hub button writes.
 *
 * TEXT ONLY. The drip never places, generates, or touches an image — image placement is
 * human-only (IMAGE_PLACEMENT_LAW.md). It rewrites body prose and republishes. Nothing else.
 *
 * CONTROL
 *   node new/_drip.js                      start (hub normally spawns it)
 *   touch new/imagebank/_drip_off.flag     stop after the current page (the hub OFF button)
 *   http://localhost:7951/                 live status page
 *   http://localhost:7951/api/status       JSON for the hub
 *
 * ENV
 *   DRIP_PORT=7951  DRIP_PACE_MS=45000  GATE_MIN=12  DRIP_CC_TRIES=3  DRIP_DS_TRIES=2
 *   DRIP_EMAIL=1    CLAUDE_OK=1
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const STD = require('./_image_standards');   // 🔒 SHARED IMAGE STANDARDS — same module the crew uses

const WD = path.join(__dirname, '..');
try {
  for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

// CC is the drip's primary writer — make sure the bench never silences it here.
if (!process.env.CLAUDE_BENCHED) process.env.CLAUDE_OK = '1';

// 🔒🔒 MAX-PLAN ONLY (owner law: "cc drip should be 200 max plan not api").
// Claude Code must run on the owner's $200 Max subscription — NEVER metered pay-as-you-go API
// billing. .env.local carries an ANTHROPIC_API_KEY for other tools; if it is present in this
// process the CLI bills that (depleted) balance and returns "Credit balance is too low", which
// has previously been saved into entry bodies. Strip every metered credential from the drip
// process itself, so no child it spawns can inherit one. runClaude strips them again at the
// spawn boundary — two layers, because a metered call is unrecoverable once made.
for (const k of ['ANTHROPIC_API_KEY', 'ANTHROPIC_AUTH_TOKEN', 'CLAUDE_API_KEY', 'ANTHROPIC_BASE_URL']) delete process.env[k];

const { getStore } = require('@netlify/blobs');
const { rebuildToGate, surgicalGateFix, gateScore, goldShapeOK, runWriter } = require('./improve_content');
const { publishContentBody, publishBodySlot } = require('./publish_core');

const PORT       = parseInt(process.env.DRIP_PORT || '7951', 10);
// Gap between pages. 0 = no cooldown (owner 2026-07-28) — go straight to the next page.
// This does NOT put the Max plan at risk: spend is governed by the CC token bucket below, not by
// the pace. With no cooldown the cheap rungs churn through already-good pages fast, while CC is
// still hard-capped at 20/hour and 200/day.
const PACE_MS    = Math.max(0, parseInt(process.env.DRIP_PACE_MS || '0', 10));
const GATE_MIN   = parseInt(process.env.GATE_MIN || '12', 10);
// ✍️ WRITERS: Claude Code ONLY (owner 2026-07-28: "cc only", "don't use cursor").
// ⭐ ALL WRITERS (owner 2026-07-28 — reverses the earlier "CC-only" setting on the owner's instruction to
// "bring in cc cursor ds etc to push to 12/13"). DeepSeek and Cursor are back in the ladder: DS_TRIES now
// defaults to 2 (was 0, which compiled the DeepSeek rungs out entirely) and Cursor is wired for the first time.
// Same values the hub passes, so running the drip standalone behaves identically to running it
// from the hub button. 4 CC attempts: measured misses were dominated by QA pages short on
// DIRECT_ANSWER / FAQ / SOURCES, which surgical refuses to fabricate and only a writer can fix.
const CC_TRIES     = parseInt(process.env.DRIP_CC_TRIES || '4', 10);
const DS_TRIES     = parseInt(process.env.DRIP_DS_TRIES || '2', 10);
const CURSOR_TRIES = parseInt(process.env.DRIP_CURSOR_TRIES || '2', 10);
const CC_FINAL     = parseInt(process.env.DRIP_CC_FINAL || '1', 10);   // one more CC pass after the others
// Cursor has never had a key in .env.local. Attempting it anyway is not free — it costs a rung and a timeout
// per page and returns nothing — so the ladder omits it entirely rather than failing through it.
const CURSOR_OK    = !!String(process.env.CURSOR_API_KEY || '').trim();
// The $0 rungs still carry every page whenever the CC budget is paused, and DeepSeek now backs them up, so a
// closed CC hour no longer ends the ladder with writers left unused.
let IMPROVE_CC_OK = true;   // may this page spend CC? false during a polish pass on a tight budget
const EMAIL_ON   = process.env.DRIP_EMAIL !== '0';
// 📧 What counts as "finishing a URL" for the email (owner: "email me after every finishing").
//   all (default)  — one email for EVERY page the drip finishes, including the ones already at the
//                    bar that needed no writing. Owner asked for this explicitly ("send emails even
//                    when no writing"). Note the volume: a large share of the library is already at
//                    the bar, so most of these say "no work needed".
//   work           — only pages actually rewritten or attempted-and-short; already-at-bar pages
//                    roll into a digest every DRIP_SKIP_DIGEST instead. Set DRIP_EMAIL_MODE=work.
// Default 'work' — one email per actual FIX, which is what "email after every fix" means and is
// also the safer volume. Sending on every page (mode 'all') meant ~60 messages an hour from a
// shared sandbox sender, roughly 10x what the other machines send in a day; that is the pattern
// mail providers filter. Every completion is still recorded locally in _DRIP_FINISHED.md.
const EMAIL_MODE = String(process.env.DRIP_EMAIL_MODE || 'work').toLowerCase();
const SKIP_DIGEST_EVERY = parseInt(process.env.DRIP_SKIP_DIGEST || '250', 10);   // skips per summary email

// 🎯 PILLAR FILTER (owner 2026-07-28) — restrict the drip to one or more pillars.
//   DRIP_PILLARS=tl            → only tl####
//   DRIP_PILLARS=tl,gp,st      → those three
//   DRIP_PILLARS= (unset/all)  → the whole library
const PILLARS = String(process.env.DRIP_PILLARS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
const pillarOf = id => (String(id).match(/^([a-z]+)/) || [, ''])[1];

// 🚫 JUNK IDS. The library carries a handful of corrupted ids — qmpxdrp…, qmpsyfv723pdz,
// qmpxdrimmpcde… — left over from a bad write. They have no route (every one 404s) and the SEO
// audit already flagged them as unreachable. Ordering by "smallest pillar first" put them at the
// very front, so the drip was about to spend CC calls and image slots on pages nobody can load.
// Real pillar prefixes are short: q, aq, nil, tl, gp, st … nothing legitimate runs past 3 letters.
// Prefixes that exist in the index but are NOT published pages, so they have no URL to improve:
//   vq  — visitor-question queue records
const NOT_PUBLISHED = new Set(['vq']);
const isRealPillar = id => {
  const p = pillarOf(id);
  return !!p && p.length <= 3 && !NOT_PUBLISHED.has(p) && !/_/.test(String(id));
};
const inScope = id => isRealPillar(id) && (!PILLARS.length || PILLARS.includes(pillarOf(id)));

// 📏 WORD FLOOR (owner 2026-07-28: "words should be 2k or more"). A rewrite is never published
// below this — a shorter body loses depth even when it satisfies the 13-point rubric.
// ── 🖼 IMAGES-ONLY MODE (owner 2026-07-29, authorized with 4444) ────────────────────────────
// "change the drip to a super smart image auditor that slowly drips through all the URLs and makes sure the
// images align with the title… full autonomy to swap them out… images only… target the ones I've already
// fixed so I'm not changing images and then writing over it."
//
// DRIP_MODE=images turns the drip into an image-only pass:
//   • NO text work at all — the writer ladder, the gate and publishContentBody are skipped entirely, so it can
//     never overwrite prose a crew just wrote. That is the "don't write over it" requirement.
//   • Only pages ALREADY AT THE BAR are eligible (gate_score >= GATE_MIN). A page still being fixed keeps its
//     images untouched until its text is finished, so the two machines never fight over the same entry.
//   • Mismatched images are replaced autonomously (Pexels → DDG ladder), then the page is re-verified.
//
// ⚠️ This mode is the sanctioned exception to IMAGE_PLACEMENT_LAW.md, granted by the owner with code 4444 on
// 2026-07-29. Outside this mode the drip still places nothing. Face cards stay on the non-generative ladder —
// the generative rung is what produced the fake logo, and lifting the law did not un-learn that.
// Turned on EITHER by the env var OR by a flag file. The flag exists because the env var kept getting lost:
// launching from the hub button spawns a bare `node _drip.js` with no DRIP_MODE, which silently dropped BOTH
// guarantees — the finished-pages-only filter and the never-touch-text guard — while still looking like an
// image run. A file on disk survives every launch path, so the mode can't be forgotten.
//   ON  : new/imagebank/_drip_images_only.flag exists
//   OFF : delete that file (and don't set DRIP_MODE=images)
const IMAGES_ONLY_FLAG = path.join(__dirname, 'imagebank', '_drip_images_only.flag');
// 🖼 IMAGES-ONLY IS NOW THE DEFAULT (owner 2026-07-29: "just set it up, that's the only way that it works,
// but it only runs 12 out of 13"). It was opt-in via an env var, then via a flag file, and both kept getting
// lost — a hub launch spawns a bare `node _drip.js` and silently reverted to the text drip, which then worked
// unfinished pages and rewrote prose. Inverting the default removes the failure mode entirely: there is no
// longer a way to *forget* to turn it on.
//
// The drip now ALWAYS: works only pages at 12/13 or higher, and never touches text.
// Opt out deliberately with DRIP_MODE=text (or by creating _drip_text_mode.flag) if the old text drip is ever
// wanted back — that is now the choice you have to make on purpose, which is the right way round.
const TEXT_MODE_FLAG = path.join(__dirname, 'imagebank', '_drip_text_mode.flag');
function IMAGES_ONLY_ACTIVE() {
  if (String(process.env.DRIP_MODE || '').toLowerCase() === 'text') return false;
  try { if (fs.existsSync(TEXT_MODE_FLAG)) return false; } catch (e) {}
  return true;                       // default: images only, finished pages only
}
const IMAGES_ONLY = IMAGES_ONLY_ACTIVE();
// 🌸 Pollinations = third rung of the image ladder (Pexels → DDG → Pollinations → local pool). Body slots only.
const POLLINATE_ON = String(process.env.DRIP_POLLINATE || '1') === '1';

const MIN_WORDS = parseInt(process.env.DRIP_MIN_WORDS || '2000', 10);
// Ceiling as well as a floor (owner 2026-07-28: "needs to be lowered to 2k-3k total words").
// There was only a floor before, which is how nl0204 reached 76 paragraphs — nothing capped it.
const MAX_WORDS = parseInt(process.env.DRIP_MAX_WORDS || '3000', 10);
// Longest a single URL may occupy the drip before it is abandoned so the next one can start.
// Generous: a full page can legitimately need ~2 min of image placement plus 3 CC rewrites.
const PAGE_TIMEOUT_MS = parseInt(process.env.DRIP_PAGE_TIMEOUT_MS || '900000', 10);   // 15 min
const wordCount = b => String(b || '').replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;

const IB         = path.join(WD, 'new', 'imagebank');

// ── 💸 ECONOMY GOVERNOR ────────────────────────────────────────────────────────────────────
// Owner law: economy cadence — must never risk overage or burn the Max allowance early.
// Claude's Max plans meter on a WEEKLY window as well as short-term ones, so an hourly + daily
// cap alone is not protection: 200/day sustained is ~1,400/week and would exhaust the week in a
// couple of days. Four defences:
//   1. Free rungs first. A page already at the bar costs one local score and zero model calls,
//      and most of the library is in that state.
//   2. Hard ceilings per hour / day / WEEK.
//   3. EVEN PACING across the week — the real protection against "early". CC may only be as far
//      through the weekly allowance as the week itself is, plus a small burst. Front-loading is
//      refused even when the weekly total has room left.
//   4. DeepSeek is the fallback precisely because it does not touch the Max allowance, so when CC
//      is paused the drip keeps working at zero Max cost instead of stalling.
const CC_PER_HOUR = parseInt(process.env.DRIP_CC_PER_HOUR || '60', 10);
const CC_PER_DAY  = parseInt(process.env.DRIP_CC_PER_DAY  || '150', 10);
const CC_PER_WEEK = parseInt(process.env.DRIP_CC_PER_WEEK || '350', 10);
// Burst: how far ahead of the even-pace line CC may run. 25 was far too tight — it blocked the
// writer on day one of a window while the weekly total was barely touched. 120 still cannot
// exceed the weekly ceiling, it just stops the pacing guard from being the binding constraint.
const CC_BURST    = parseInt(process.env.DRIP_CC_BURST || '120', 10);
const WEEK_MS = 7 * 86400000;

// PERSISTED. This was an in-memory array, which meant every restart silently reset the budget to
// zero — during this session alone the drip restarted ~8 times, so the caps were never actually
// binding. A budget that forgets is not a budget.
const CC_BUDGET_F = path.join(IB, '_drip_cc_budget.json');
const CC_ANCHOR_F = path.join(IB, '_drip_cc_window.json');   // start of the current 7-day window
let CC_CALLS = [];
try { CC_CALLS = (JSON.parse(fs.readFileSync(CC_BUDGET_F, 'utf8')) || []).filter(t => Number.isFinite(t)); } catch (e) { CC_CALLS = []; }

function ccBudget() {
  const now = Date.now();
  CC_CALLS = CC_CALLS.filter(t => now - t <= WEEK_MS);          // rolling 7-day window
  const hour = CC_CALLS.filter(t => now - t <= 3600000).length;
  const day  = CC_CALLS.filter(t => now - t <= 86400000).length;
  const week = CC_CALLS.length;

  // Even pacing across a FIXED window, anchored on disk — not on "the oldest call in the buffer".
  // That older measure made elapsed time tiny right after a fresh start, so a legitimate 45 calls
  // read as "ahead of pace" against an allowance of ~27 and the writer was skipped on pages that
  // genuinely needed it (tr12 missed at 1,246 words because CC never ran). The window now advances
  // on real calendar time and rolls over every 7 days.
  let anchor = 0;
  try { anchor = JSON.parse(fs.readFileSync(CC_ANCHOR_F, 'utf8')).ts || 0; } catch (e) {}
  if (!anchor || now - anchor >= WEEK_MS) {
    anchor = now;
    try { fs.writeFileSync(CC_ANCHOR_F, JSON.stringify({ ts: anchor })); } catch (e) {}
    CC_CALLS.length = 0;                       // new window, fresh allowance
  }
  const elapsed = Math.min(WEEK_MS, Math.max(0, now - anchor));
  const allowedByNow = Math.ceil(CC_PER_WEEK * (elapsed / WEEK_MS)) + CC_BURST;
  const onPace = week < allowedByNow;

  return {
    hour, day, week,
    hourLeft: Math.max(0, CC_PER_HOUR - hour),
    dayLeft:  Math.max(0, CC_PER_DAY - day),
    weekLeft: Math.max(0, CC_PER_WEEK - week),
    allowedByNow, onPace,
    ok: hour < CC_PER_HOUR && day < CC_PER_DAY && week < CC_PER_WEEK && onPace,
    why: hour >= CC_PER_HOUR ? 'hourly cap' : day >= CC_PER_DAY ? 'daily cap'
       : week >= CC_PER_WEEK ? 'weekly cap' : !onPace ? 'ahead of weekly pace' : '',
  };
}
function ccSpend() {
  CC_CALLS.push(Date.now());
  try { fs.writeFileSync(CC_BUDGET_F, JSON.stringify(CC_CALLS)); } catch (e) {}
}
const QUEUEF     = path.join(IB, '_drip_queue.json');
const STATEF     = path.join(IB, '_drip_state.json');
const OFF_FLAG   = path.join(IB, '_drip_off.flag');
const LOGF       = path.join(WD, '_drip.out.log');

const sleep = ms => new Promise(r => setTimeout(r, ms));
// Same net-retry the crews use — the blob connection drops often enough that a single failed
// read/write must not discard finished work.
const isNetErr = e => /fetch failed|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|socket hang up|network|timeout|not found in blob/i
  .test(String((e && e.message) || e));
async function retryNet(fn, tries) {
  tries = tries || 5;
  for (let i = 0; i < tries; i++) {
    try { return await fn(); }
    catch (e) { if (i === tries - 1 || !isNetErr(e)) throw e; await sleep(1200 * (i + 1)); }
  }
}
function log(m) {
  const line = new Date().toISOString() + ' ' + m;
  try { fs.appendFileSync(LOGF, line + '\n'); } catch (e) {}
  try { console.log(line); } catch (e) {}
}
function theStore() {
  return getStore({
    name: 'pulse-machine-library',
    siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN,
  });
}

// ── 📋 MANAGER: state ──────────────────────────────────────────────────────────────────────
const DEFAULT_STATE = {
  cursor: 0, lap: 1, startedAt: Date.now(),
  fixed: 0, alreadyOk: 0, missed: 0, errors: 0,   // this lap
  totalFixed: 0, totalSeen: 0,                     // all laps
  ccWins: 0, dsRescues: 0, surgicalWins: 0, imageFlagged: 0, imagesPlaced: 0, heroesWritten: 0, heroesDeleted: 0,
  lastId: '', lastScore: null, lastEngine: '', lastAt: 0,
  sinceGen: 0, generated: 0,   // 🆕 urls finished since the last new-question generation · total new Q&As seeded
};
let STATE = Object.assign({}, DEFAULT_STATE);
try { STATE = Object.assign({}, DEFAULT_STATE, JSON.parse(fs.readFileSync(STATEF, 'utf8'))); } catch (e) {}
function saveState() { try { fs.writeFileSync(STATEF, JSON.stringify(STATE, null, 1)); } catch (e) {} }

let QUEUE = [];
function loadQueue() {
  try {
    const q = JSON.parse(fs.readFileSync(QUEUEF, 'utf8'));
    // The saved queue carries the scope it was built for. Loading it blindly meant a run that had
    // once been filtered to a single pillar kept that filter forever — the drip came back up
    // scoped to `tr` (22 pages) while asking for the whole library, and quietly worked 22 URLs.
    const savedPillars = (q && q.pillars) || [];
    const same = savedPillars.length === PILLARS.length && savedPillars.every(p => PILLARS.includes(p));
    if (!same) {
      log('📋 saved queue scope [' + (savedPillars.join(',') || 'all') + '] ≠ requested ['
        + (PILLARS.join(',') || 'all') + '] — rebuilding');
      QUEUE = [];
      return 0;
    }
    QUEUE = (q && q.ids) || [];
  } catch (e) { QUEUE = []; }
  return QUEUE.length;
}

// Rebuild the queue from the live index — run at boot and at every wrap-around so pages added
// since the last lap join the rotation.
async function refreshQueue() {
  for (let i = 0; i < 6; i++) {
    try {
      const idx = await theStore().get('_index.json', { type: 'json', consistency: 'strong' });
      if (idx && idx.entries && idx.entries.length > 1000) {
        let scoped = idx.entries.filter(e => e && e.id && inScope(e.id));
        // 🖼 IMAGES-ONLY: restrict to pages that are ALREADY FIXED. A page still under the writers keeps its
        // images alone until its text is done, so this pass can never land on an entry a crew is mid-way
        // through. `pending` seeds are excluded for the same reason — they have no body yet.
        if (IMAGES_ONLY) {
          const before = scoped.length;
          // "Finished" = 12/13 or higher (owner 2026-07-29). Pinned to its own constant rather than reusing
          // GATE_MIN: GATE_MIN is env-tunable and used for other decisions, so if it were ever lowered this
          // filter would silently start touching unfinished pages. This threshold means one thing only.
          const FINISHED_MIN = Math.max(1, parseInt(process.env.DRIP_IMAGES_MIN_GATE || '12', 10));
          scoped = scoped.filter(e => e.pending !== true && (e.gate_score || 0) >= FINISHED_MIN);
          // 🕒 RECENTLY FINISHED ONLY (owner 2026-07-29: "change it to recently finished is the ones it goes
          // after"). 6,894 pages sit at 12/13+, but most were finished weeks ago and already carry images —
          // re-imaging all of them buries the pages a crew just wrote. Restricting to a recent window means the
          // drip follows the crews rather than grinding the whole archive, which is what makes the two machines
          // feel connected. Window is in hours; DRIP_RECENT_HOURS=0 restores "every finished page".
          let RECENT_H = Math.max(0, parseInt(process.env.DRIP_RECENT_HOURS || '24', 10));
          // 🔄 A pillar the owner just reset is exempt from the recency window — "reset" has to mean the whole
          // pillar goes back on the list, not just the part finished in the last day. One-shot: the marker is
          // consumed here so the window returns to normal on the next rebuild.
          try {
            const ff = path.join(IB, '_drip_full_pillar.json');
            const full = JSON.parse(fs.readFileSync(ff, 'utf8')) || {};
            const hit = PILLARS.filter(p => full[p]);
            if (hit.length) {
              RECENT_H = 0;
              for (const p of hit) delete full[p];
              fs.writeFileSync(ff, JSON.stringify(full));
              log('🔄 reset marker on ' + hit.join(',') + ' — taking the WHOLE pillar, ignoring the recency window');
            }
          } catch (e) {}
          if (RECENT_H) {
            const cut = Date.now() - RECENT_H * 3600000;
            const all = scoped.length;
            const recent = scoped.filter(e => Math.max(e.polished_at || 0, e.ts || 0) >= cut);
            // never let the window empty the queue — if nothing is recent, fall back to everything finished
            if (recent.length) {
              scoped = recent;
              log('🕒 recently-finished window: last ' + RECENT_H + 'h → ' + recent.length + ' of ' + all + ' finished pages');
            } else {
              log('🕒 nothing finished in the last ' + RECENT_H + 'h — falling back to all ' + all + ' finished pages');
            }
          }
          const skipped = before - scoped.length;
          log('🖼 images-only — ' + scoped.length + ' page(s) eligible at ' + FINISHED_MIN + '/13 or higher · skipped '
            + skipped + ' (unfinished, unscored, pending or older than the window)');
        }
        // 🎯 WORST FIRST. Ordering purely oldest-first meant the drip opened on a long run of
        // already-good q15xx pages: real work (and therefore any email) was hundreds of pages
        // away. Order by NEED instead, oldest-first inside each band:
        //   1. proven below the bar  — a crew scored it under 12. Definitely broken.
        //   2. never gate-scored     — unproven; most of the library, and where the wins are.
        //   3. already at the bar    — cheap re-verify, costs one local score and no model call.
        // Still the whole library, still wrapping forever — just broken things first.
        const band = e => (e.gate_score == null ? 1 : (e.gate_score < GATE_MIN ? 0 : 2));
        // 📦 LOW-INVENTORY PILLARS FIRST (owner 2026-07-28) — finish the small pillars off rather
        // than nibbling at the huge ones, matching the smallest-first rotation law. Within a
        // pillar the worst-first banding still applies, then oldest-first.
        const sizes = new Map();
        for (const e of scoped) { const p = pillarOf(e.id); sizes.set(p, (sizes.get(p) || 0) + 1); }
        const ids = scoped.slice().sort((a, b) =>
          ((sizes.get(pillarOf(a.id)) || 0) - (sizes.get(pillarOf(b.id)) || 0))
          || (band(a) - band(b))
          || ((a.ts || 0) - (b.ts || 0))
        ).map(e => e.id);
        const order = [...sizes.entries()].sort((x, y) => x[1] - y[1]).slice(0, 6)
          .map(([p, n]) => p + '(' + n + ')').join(' → ');
        log('📦 pillar order, smallest first: ' + order + ' …');
        const below = scoped.filter(e => e.gate_score != null && e.gate_score < GATE_MIN).length;
        const unscored = scoped.filter(e => e.gate_score == null).length;
        fs.writeFileSync(QUEUEF, JSON.stringify({ ts: Date.now(), min: GATE_MIN, pillars: PILLARS, total: ids.length, below, unscored, ids }));
        QUEUE = ids;
        log('📋 MANAGER queue refreshed — ' + ids.length + ' urls'
          + (PILLARS.length ? ' [pillars: ' + PILLARS.join(',') + ']' : ' [whole library]')
          + ' · WORST FIRST: ' + below + ' proven <' + GATE_MIN + ', then ' + unscored + ' never scored, then '
          + (ids.length - below - unscored) + ' at bar');
        return ids.length;
      }
    } catch (e) {}
    await sleep(900);
  }
  return loadQueue();   // network flaky → keep walking the queue we already have
}

// ── 📧 MANAGER: per-URL email with finished / left counts ──────────────────────────────────
//
// 🔔 EMAIL KILL-SWITCH SCOPE (owner 2026-07-28)
// The site-wide `_emails_off.flag` silences the crews and every other machine. The drip is
// EXEMPT: the owner asked specifically and repeatedly for an email after each finished URL
// ("make sure drip emails me after every finishing"), and honouring the global flag meant the
// drip ran completely silently — every send was skipped before it was attempted.
// The drip's own switch is `_drip_email_off.flag`, so it can still be silenced on its own
// without turning the other machines' emails back on.
const DRIP_EMAIL_OFF = path.join(IB, '_drip_email_off.flag');
function emailBlocked() {
  if (!EMAIL_ON) return 'DRIP_EMAIL=0';
  if (fs.existsSync(DRIP_EMAIL_OFF)) return '_drip_email_off.flag';
  return '';
}

// Actually deliver, and REPORT what happened. The first version fired and forgot: it never
// checked the response, so a rejected key or a 4xx from Resend looked exactly like success.
// A local, always-visible record of every completion. Email delivery is outside my control once
// Resend accepts a message, so this guarantees you can see what finished regardless of what the
// inbox does. One line per URL, newest at the bottom: tail it or open it in the editor.
const DONE_FEED = path.join(WD, '_DRIP_FINISHED.md');
function appendFeed(rec) {
  try {
    if (!fs.existsSync(DONE_FEED)) {
      fs.writeFileSync(DONE_FEED, '# DRIP — finished URLs (live)\n\n'
        + '| when | id | score | writer | images | url |\n|---|---|---|---|---|---|\n');
    }
    const imgs = rec.img ? ((rec.img.placed || 0) + ' placed / ' + (rec.img.bodyCount || 0) + ' had') : '';
    fs.appendFileSync(DONE_FEED, '| ' + new Date().toISOString().slice(11, 19)
      + ' | `' + rec.id + '` | ' + rec.before + '→' + rec.score + '/13'
      + ' | ' + (rec.engine || '') + ' | ' + imgs + ' | ' + rec.url + ' |\n');
  } catch (e) {}
}

async function sendMail(subject, html, tag) {
  const blocked = emailBlocked();
  if (blocked) { log('📧 SKIPPED ' + tag + ' — ' + blocked); return false; }
  const k = resendKey();
  if (!k) { log('📧 FAILED ' + tag + ' — no Resend key in env or .env.local'); return false; }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + k, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'PULSE Drip <onboarding@resend.dev>', to: ['koryjordanwhite@gmail.com'], subject, html }),
      signal: AbortSignal.timeout(15000),
    });
    const txt = await r.text().catch(() => '');
    if (!r.ok) { log('📧 FAILED ' + tag + ' — HTTP ' + r.status + ' ' + txt.slice(0, 200)); return false; }
    let mid = '';
    try { mid = (JSON.parse(txt) || {}).id || ''; } catch (e) {}
    log('📧 SENT ' + tag + (mid ? ' · id ' + mid : ''));
    return true;
  } catch (e) {
    log('📧 FAILED ' + tag + ' — ' + ((e && e.message) || e));
    return false;
  }
}

function resendKey() {
  let k = process.env.RESEND_API_KEY || process.env.resendapikey;
  if (k) return k;
  try {
    for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
      const m = l.match(/^\s*(resendapikey|RESEND_API_KEY)\s*=\s*(.*)\s*$/i);
      if (m) return m[2].replace(/^["']|["']$/g, '');
    }
  } catch (e) {}
  return '';
}
async function emailResult(rec) {
  const left = Math.max(0, QUEUE.length - STATE.cursor);
  const pct = QUEUE.length ? ((STATE.cursor / QUEUE.length) * 100).toFixed(1) : '0';
  // 🖼 IMAGES-ONLY EMAIL (owner: "email me after every one, whether it fixes it or not").
  // A gate score means nothing on an image pass, so this reports what was actually looked at and what changed.
  // Sent for EVERY page including clean ones — a "checked, all good" result is still a result you asked for.
  if (rec.imagesOnly) {
    const im = rec.img || {};
    const issues = (im.issues || []);
    const swapped = im.placed || 0;
    const clean = !issues.length && !swapped;
    const mark = swapped ? '🖼🔁 IMAGES SWAPPED ' : (issues.length ? '🖼⚠️ IMAGE ISSUES ' : '🖼✓ IMAGES OK ');
    const subject = mark + rec.id + ' · ' + STATE.cursor + ' checked / ' + left + ' left';
    const html = '<div style="font-family:system-ui,Arial;font-size:16px;line-height:1.55;color:#111">'
      + '<h2 style="margin:0 0 6px;color:' + (swapped ? '#b3121f' : clean ? '#2e7d32' : '#a86500') + '">'
      + (swapped ? 'Images replaced' : clean ? 'Images checked — all good' : 'Image issues found') + '</h2>'
      + '<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#888">' + rec.id + '</p>'
      + '<p style="margin:0 0 14px;font-size:18px;font-weight:700">' + String(rec.question || '').replace(/</g, '&lt;').slice(0, 200) + '</p>'
      + '<table style="border-collapse:collapse;font-size:14px;color:#444">'
      + '<tr><td style="padding:2px 14px 2px 0">Face card</td><td><b>' + (im.face ? 'present' : 'MISSING') + '</b></td></tr>'
      + '<tr><td style="padding:2px 14px 2px 0">Body images</td><td><b>' + (im.bodyCount || 0) + '</b></td></tr>'
      + '<tr><td style="padding:2px 14px 2px 0">Replaced this pass</td><td><b>' + swapped + '</b></td></tr>'
      + '<tr><td style="padding:2px 14px 2px 0">Text</td><td><b>untouched</b> (images-only mode)</td></tr>'
      + '</table>'
      + (issues.length ? '<p style="margin:12px 0 0;color:#a86500"><b>Findings:</b> ' + issues.join('; ').replace(/</g, '&lt;') + '</p>' : '')
      + '<p style="margin:16px 0"><a href="' + (rec.url || '') + '" style="background:#b3121f;color:#fff;text-decoration:none;padding:11px 18px;border-radius:8px;font-weight:800;display:inline-block">Open ' + rec.id + ' &rarr;</a></p>'
      + '<p style="font-size:12px;color:#888;margin-top:14px">' + STATE.cursor + ' of ' + QUEUE.length + ' checked (' + pct + '%). '
      + 'Create _drip_email_off.flag to silence.</p></div>';
    return sendMail(subject, html, 'images ' + rec.id);
  }
  const hit = rec.score >= GATE_MIN;
  // Three distinct outcomes — an already-good page must not read like a rewrite that never happened.
  const kind = rec.skipped ? 'ok' : (hit ? 'fixed' : 'miss');
  const mark = kind === 'ok' ? '🩸✓ DRIP OK ' : (kind === 'fixed' ? '🩸✅ DRIP FIXED ' : '🩸📉 DRIP MISS ');
  const head = kind === 'ok' ? '✓ Already good — no work needed'
             : (kind === 'fixed' ? '✅ Fixed' : '📉 Missed');
  const subject = mark + rec.score + '/13 — ' + rec.id + ' · ' + STATE.cursor + ' done / ' + left + ' left';
  const html = [
    '<div style="font:14px/1.5 system-ui,Segoe UI,Arial;color:#1b1b1b">',
    '<h2 style="margin:0 0 4px">' + head + ' — <code>' + rec.id + '</code></h2>',
    '<p style="margin:0 0 14px;color:#666">' + (rec.question || '') + '</p>',
    '<table cellpadding=6 style="border-collapse:collapse;font-size:13px">',
    '<tr><td><b>Gate score</b></td><td>' + rec.before + '/13 → <b>' + rec.score + '/13</b> (bar ' + GATE_MIN + ')</td></tr>',
    '<tr><td><b>Writer</b></td><td>' + rec.engine + '</td></tr>',
    '<tr><td><b>Auditor</b></td><td>' + rec.audit + '</td></tr>',
    '<tr><td><b>Attempts</b></td><td>' + rec.attempts + '</td></tr>',
    '</table>',
    // 🖼 image audit — verification only. The drip never places an image; this tells the human
    // exactly what to click through at the block builder.
    (function () {
      const im = rec.img;
      if (!im) return '';
      const placed = im.placed || 0;
      // The drip places BODY slots itself (4444). It does NOT place face cards — publishFaceImageOnly
      // reads a prepared local file, so a missing face is still genuinely yours to place.
      // A deliberately deleted hero is not an outstanding task — don't ask for a pick for it.
      const faceTodo = !im.face && !im.heroDeleted;
      if (im.heroDeleted) rows.push('<li style="color:#666">🗑 hero card removed (page falls back to the logo)</li>');
      const rows = [];
      if (placed) rows.push('<li style="color:#1b5e20">✅ placed <b>' + placed + '</b> body image' + (placed === 1 ? '' : 's') + ' automatically — DOM-verified</li>');
      // Never ask the owner to pick — the drip places the hero itself now. If a page still has no
      // hero it means every ladder rung failed, which is a retry, not a request for manual work.
      if (faceTodo) rows.push('<li style="color:#B91C3F">Hero not placed this pass — the drip retries it on the next lap (no action needed)</li>');
      const leftover = (im.issues || []).filter(i => !/^only \d+ body images/.test(i) && !/face/i.test(i));
      for (const i of leftover) rows.push('<li>' + i + '</li>');
      if (!rows.length) {
        return '<p style="margin:10px 0;color:#2e7d32">🖼 Images OK — face ✓, ' + im.bodyCount + ' body</p>';
      }
      const needsYou = faceTodo;
      return '<div style="margin:14px 0;padding:10px 12px;background:' + (needsYou ? '#fff6f6' : '#f3fbf4')
        + ';border-left:3px solid ' + (needsYou ? '#B91C3F' : '#2e7d32') + '">'
        + '<b>🖼 Images</b><ul style="margin:6px 0 0;padding-left:18px">' + rows.join('') + '</ul></div>';
    })(),
    '<p style="margin:14px 0"><a href="' + rec.url + '" style="display:inline-block;padding:10px 16px;background:#15110d;color:#EAC15C;text-decoration:none;border-radius:4px;font-weight:700">Open the page →</a></p>',
    '<p style="margin:0 0 6px;color:#666;font-size:12px">' + rec.url + '</p>',
    '<h3 style="margin:18px 0 6px">Library progress — lap ' + STATE.lap + '</h3>',
    '<table cellpadding=6 style="border-collapse:collapse;font-size:13px;background:#faf7f0">',
    '<tr><td><b>Finished this lap</b></td><td>' + STATE.cursor + ' of ' + QUEUE.length + ' (' + pct + '%)</td></tr>',
    '<tr><td><b>Left to complete</b></td><td><b>' + left + '</b></td></tr>',
    '<tr><td>Rewritten to ' + GATE_MIN + '+</td><td>' + STATE.fixed + '</td></tr>',
    '<tr><td>Already at bar (skipped)</td><td>' + STATE.alreadyOk + '</td></tr>',
    '<tr><td>Still short</td><td>' + STATE.missed + '</td></tr>',
    '<tr><td>CC wins / DS rescues / surgical</td><td>' + STATE.ccWins + ' / ' + STATE.dsRescues + ' / ' + STATE.surgicalWins + '</td></tr>',
    '</table>',
    '<p style="margin:16px 0 0;color:#888;font-size:12px">The drip runs the whole library forever — at the end of a lap it starts over.</p>',
    '</div>',
  ].join('');
  return sendMail(subject, html, rec.id + ' ' + rec.score + '/13');
}

// Public URL for an entry. The pillar prefix decides the path segment — hardcoding /knowledge/
// produced dead links for every ranking / tools / pillar-specific entry in the emails.
const PILLAR_PATH = {
  q: 'knowledge', nil: 'knowledge', bs: 'knowledge', tl: 'tools', st: 'sales-trainings',
  ik: 'industry-kpis', tk: 'tech-stacks', gb: 'graphics', er: 'electronic-reviews',
  ra: 'revenue-architecture', gp: 'go-to-market-playbooks', fr: 'franchises', ca: 'cars',
  tw: 'towns', sc: 'schools', nl: 'nightlife', dn: 'dining', bt: 'boats', mv: 'movies',
  wl: 'wellness', tv: 'travel', rs: 'resorts', es: 'estates', cl: 'clubs', lv: 'living',
  ev: 'events', sy: 'style', ga: 'gatherings', gm: 'gaming', sk: 'skills', sp: 'speeches',
  cg: 'coaching', co: 'collectibles', ai: 'ai-infrastructure', aq: 'aquariums', bo: 'buildouts',
  pt: 'pets', sw: 'software', tc: 'telco', hf: 'highschool-football-recruiting',
};
function entryUrl(id) {
  const seg = PILLAR_PATH[pillarOf(id)] || 'knowledge';
  return 'https://pulserevops.com/' + seg + '/' + id;
}

// 📧 Digest for the already-at-bar run — sent every SKIP_DIGEST_EVERY skips so the drip's
// progress is still visible while it walks a long stretch of pages that need no work.
async function emailDigest() {
  const left = Math.max(0, QUEUE.length - STATE.cursor);
  const pct = QUEUE.length ? ((STATE.cursor / QUEUE.length) * 100).toFixed(1) : '0';
  const subject = '🩸 DRIP progress — ' + STATE.cursor + ' done / ' + left + ' left (lap ' + STATE.lap + ')';
  const html = [
    '<div style="font:14px/1.5 system-ui,Segoe UI,Arial;color:#1b1b1b">',
    '<h2 style="margin:0 0 10px">🩸 Drip progress — lap ' + STATE.lap + '</h2>',
    '<table cellpadding=6 style="border-collapse:collapse;font-size:13px;background:#faf7f0">',
    '<tr><td><b>Finished</b></td><td>' + STATE.cursor + ' of ' + QUEUE.length + ' (' + pct + '%)</td></tr>',
    '<tr><td><b>Left to complete</b></td><td><b>' + left + '</b></td></tr>',
    '<tr><td>Rewritten to ' + GATE_MIN + '+</td><td>' + STATE.fixed + '</td></tr>',
    '<tr><td>Already at bar</td><td>' + STATE.alreadyOk + '</td></tr>',
    '<tr><td>Still short</td><td>' + STATE.missed + '</td></tr>',
    '<tr><td>CC wins / DS rescues / surgical</td><td>' + STATE.ccWins + ' / ' + STATE.dsRescues + ' / ' + STATE.surgicalWins + '</td></tr>',
    '</table>',
    '<p style="margin:14px 0 0;color:#888;font-size:12px">Every rewritten or missed URL gets its own email. This summary covers the stretch that needed no work.</p>',
    '</div>',
  ].join('');
  return sendMail(subject, html, 'digest ' + STATE.cursor + ' done / ' + left + ' left');
}

// ── 🖼 IMAGE SAFETY (owner 2026-07-28: "old images must not return") ───────────────────────
// The drip is TEXT ONLY. Three guarantees, in order of how they bite:
//  1. It never writes a face card, hero, or qa-bin/ blob — publishContentBody only rewrites
//     `blob.answer`. Image placement stays human-only (IMAGE_PLACEMENT_LAW.md).
//  2. Any image markdown the WRITER invents is stripped here, before publish. Without this a
//     model could echo a stale `![](/assets/qa/<old>.jpg)` out of the body it was shown and
//     re-embed a retired image as prose.
//  3. publishContentBody → embedImages then strips every remaining image-only line and
//     re-derives the body set from the LIVE `qa-bin/<id>-b*.jpg` listing — so the rendered set
//     is always what is actually in the blob store now, never what an old body remembered.
// Q&A law also allows no body images except the face card, so stripping is the correct shape.
function stripWriterImages(body) {
  let out = String(body || '');
  out = out.replace(/^[ \t]*!\[[^\]]*\]\([^)]*\)[ \t]*$/gm, '');   // image-only lines
  out = out.replace(/!\[[^\]]*\]\([^)]*\)/g, '');                  // inline images mid-paragraph
  out = out.replace(/<img\b[^>]*>/gi, '');                         // raw <img> tags
  return out.replace(/\n{3,}/g, '\n\n');
}
const imageCount = b => (String(b || '').match(/!\[[^\]]*\]\([^)]*\)|<img\b/gi) || []).length;

// ── 🔧 SHAPE REPAIR ($0, no model call) ────────────────────────────────────────────────────
// A page can score 13/13 and still break the LOCKED q11133 shape. The commonest violation by far
// is an over-long Direct Answer (golden is 40-60 words; goldShapeOK rejects over 80) — e.g. gp515
// sat at 13/13 with a 161-word DA.
//
// This is NOT reachable through rebuildToGate: that function early-exits with `surgicalOnly` as
// soon as the gate score is at target, so a shape-only defect never gets a writer call at all.
// Hence a dedicated rung, ahead of the writers, that fixes it mechanically and for free.
//
// The fix moves text, it never deletes it: the DA keeps its leading sentences up to ~60 words
// (always at least one), and the remainder is pushed to the top of the following section as its
// own paragraph. No content is lost, the answer still opens with a real direct answer, and the
// page stops failing the shape check. Only if this cannot resolve it do we spend a writer call.
const daWords = s => String(s).replace(/[#>*`_\[\]()-]/g, ' ').split(/\s+/).filter(Boolean).length;

function shapeFix(body) {
  let out = String(body || '');
  const fixed = [];

  const m = out.match(/(##\s*Direct Answer[^\n]*\n)([\s\S]*?)(?=\n##\s|$)/i);
  if (m) {
    const head = m[1], da = m[2];
    // Budget: goldShapeOK rejects over 80 words, and the 13-point gate's DIRECT_ANSWER_COMPLETE
    // check requires at least 40 — so the keep-window is 40..70, not "as short as possible".
    // An earlier cut to 35 words satisfied the shape rule and immediately failed the gate rule.
    if (daWords(da) > 80 && !/```mermaid/.test(da)) {
      const sentences = da.trim().match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || [];
      if (sentences.length > 1) {
        const keep = [];
        let n = 0;
        for (const s of sentences) {
          const w = daWords(s);
          if (n >= 40 && n + w > 70) break;      // enough for the gate, stop before breaking shape
          keep.push(s); n += w;
          if (n >= 70) break;
        }
        const rest = sentences.slice(keep.length).join('').trim();
        if (rest && n >= 40 && n <= 80) {
          const newDa = head + '\n' + keep.join('').trim() + '\n';
          // Push the overflow to the top of the FOLLOWING section. `after` starts with the
          // newline before the next "## " heading, so match that leading newline too —
          // anchoring on /^##/ silently missed and injected a stray "## Overview" heading.
          const after = out.slice(m.index + m[0].length);
          const nextH = after.match(/^(\s*\n##\s+[^\n]+\n)/);
          if (nextH) {
            out = out.slice(0, m.index) + newDa + after.replace(/^(\s*\n##\s+[^\n]+\n)/, '$1\n' + rest + '\n');
            fixed.push('direct-answer ' + daWords(da) + 'w → ' + n + 'w (overflow moved into the next section, nothing dropped)');
          }
        }
      }
    }
  }
  return { body: out, fixed };
}

// 🤖 CC SHAPE REWRITE — the writer-backed shape repair.
// rebuildToGate cannot be used here: it returns `surgicalOnly` without calling any model once the
// gate score is at target, so a page that is 13/13 but malformed never reaches a writer through it.
// This calls the writer DIRECTLY with a tight, cheap prompt that rewrites only the Direct Answer,
// then splices the paragraph back in — the rest of the page is untouched.
function ccShapeRewrite(body, question, engine) {
  const m = String(body).match(/(##\s*Direct Answer[^\n]*\n)([\s\S]*?)(?=\n##\s|$)/i);
  if (!m) return null;
  const prompt = [
    'Rewrite ONLY the opening "Direct Answer" paragraph of a Q&A article.',
    '',
    'QUESTION: ' + question,
    '',
    'CURRENT DIRECT ANSWER (too long at ' + daWords(m[2]) + ' words):',
    m[2].trim(),
    '',
    'RULES:',
    '- Answer the question directly and completely, in ONE paragraph.',
    '- Between 45 and 60 words. This is a hard requirement.',
    '- No heading, no bullets, no diagram, no markdown formatting, no preamble.',
    '- Keep every factual claim already present. Invent nothing new.',
    '',
    'Return ONLY the rewritten paragraph text.',
  ].join('\n');

  const prev = process.env.WRITER_ENGINE;
  process.env.WRITER_ENGINE = engine || 'claude';
  let r = null;
  // raw:true — we want ONE paragraph back, so bypass the router's full-article validation
  // (it requires "## " headings and 400+ chars, which a 50-word paragraph can never satisfy).
  try { r = runWriter(prompt, 120000, undefined, { raw: true }); }
  catch (e) { r = null; }
  finally { if (prev == null) delete process.env.WRITER_ENGINE; else process.env.WRITER_ENGINE = prev; }
  if (!r || !r.ok || !r.text) return null;

  let para = String(r.text).trim().replace(/^```[a-z]*\n?|\n?```$/g, '').trim();
  para = para.split(/\n{2,}/)[0].trim();
  const w = daWords(para);
  if (!para || w < 35 || w > 85) return null;
  return { body: String(body).slice(0, m.index) + m[1] + '\n' + para + '\n' + String(body).slice(m.index + m[0].length), words: w };
}

// ── 🖼 IMAGE AUDIT (verify only — NEVER place) ─────────────────────────────────────────────
// Owner asked the drip to "audit and fix images". It AUDITS. It does not fix, and it must not:
// IMAGE_PLACEMENT_LAW.md forbids Claude placing/generating/inserting an image onto a face card or
// answer page by ANY script or autonomous action — the human places by clicking in the block
// builder, and Claude's sanctioned role is verification. So this reports precisely what is wrong
// per entry and accumulates a worklist for the picker; it writes no image, ever.
//
// Checks per entry, straight against the blob store (the field the template actually reads):
//   • face/hero  qa-bin/<id>.jpg present and non-trivial in size
//   • body slots qa-bin/<id>-b1..b6.jpg — how many exist
//   • Top-10 pages: whether every rank block carries an img= (10 expected)
// ── 👁 VISION RELEVANCE JUDGE (owner 2026-07-29) ───────────────────────────────────────────
// The actual problem: "they all look really good but it'll be boats and it'll be like sales training images."
// Nothing stored describes what is IN an image — the alt text is generated from the page title
// ("Top 10 River Jet Boats 2027 — figure 1"), so it says the image matches even when it doesn't. The only way
// to catch a wrong-but-pretty photo is to look at it.
//
// Gemini 2.5-flash does the looking: one image per call, sequential, cheap. It returns a 0-10 relevance score
// and the subject it actually sees, so the log/email can say WHY a swap happened ("shows a conference room,
// page is about river jet boats"). Anything at or below VISION_MIN is treated as a mismatch and replaced.
// Gemini-first matches the existing cheap-model law; no Anthropic call is made here.
const VISION_ON = String(process.env.DRIP_VISION || '1') === '1';
const VISION_MIN = Math.max(0, Math.min(10, parseInt(process.env.DRIP_VISION_MIN || '5', 10)));
const VISION_MODEL = process.env.DRIP_VISION_MODEL || 'gemini-2.5-flash';
function geminiKey() {
  return process.env.GEMINI_API_KEY || process.env.gemini_api_key || '';
}
// Returns {score 0-10, subject, why} or null when the check could not run (no key, fetch fail, bad JSON).
// null means "unknown" and is deliberately NOT treated as a mismatch — never delete an image on a failed check.
async function judgeImage(imgBuf, title, itemText) {
  const key = geminiKey();
  if (!key || !imgBuf || !imgBuf.byteLength) return null;
  const prompt = 'You are auditing whether a photo belongs on a web page.\n'
    + 'PAGE TITLE: "' + String(title || '').slice(0, 180) + '"\n'
    + (itemText ? 'THIS IMAGE ILLUSTRATES THIS LIST ITEM: "' + String(itemText).slice(0, 140) + '"\n' : '')
    + 'Look at the image. Reply with ONLY a JSON object, no prose:\n'
    + '{"subject":"<3-6 words for what the photo literally shows>","score":<0-10 how well it fits the page>,'
    + '"why":"<one short clause>"}\n'
    + 'Score 8-10 = clearly the right subject. 4-7 = generic/loosely related. 0-3 = wrong subject entirely.';
  try {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + VISION_MODEL + ':generateContent?key=' + key, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [
          { text: prompt },
          { inline_data: { mime_type: 'image/jpeg', data: Buffer.from(imgBuf).toString('base64') } },
        ] }],
        generationConfig: { temperature: 0, maxOutputTokens: 200 },
      }),
      signal: AbortSignal.timeout(45000),
    });
    if (!r.ok) return null;
    const j = await r.json();
    const txt = (((j.candidates || [])[0] || {}).content || {}).parts?.[0]?.text || '';
    const m = txt.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const o = JSON.parse(m[0]);
    const score = Number(o.score);
    if (!isFinite(score)) return null;
    return { score, subject: String(o.subject || '').slice(0, 60), why: String(o.why || '').slice(0, 90) };
  } catch (e) { return null; }
}

// Looks at every image currently on a page and returns the ones that do not belong.
// ONE image at a time — no parallel calls, per owner instruction.
async function judgePageImages(id, question) {
  const out = { checked: 0, bad: [], unknown: 0 };
  if (!VISION_ON || !geminiKey()) return out;
  const s = theStore();
  const keys = ['qa-bin/' + id + '.jpg'];
  try {
    const lst = await s.list({ prefix: 'qa-bin/' + id + '-b' });
    for (const b of (lst.blobs || [])) if (/-b\d+\.jpg$/i.test(b.key)) keys.push(b.key);
  } catch (e) {}
  for (const k of keys) {
    let buf = null;
    try { buf = await s.get(k, { type: 'arrayBuffer' }); } catch (e) {}
    if (!buf || buf.byteLength < MIN_IMG_BYTES) continue;
    const v = await judgeImage(buf, question, '');
    out.checked++;
    if (!v) { out.unknown++; }
    else if (v.score <= VISION_MIN) {
      out.bad.push({ key: k, score: v.score, subject: v.subject, why: v.why });
      log(id + ' 👁 MISMATCH ' + k.replace('qa-bin/', '') + ' — shows "' + v.subject + '" (' + v.score + '/10) · ' + v.why);
    } else {
      log(id + ' 👁 ok ' + k.replace('qa-bin/', '') + ' — "' + v.subject + '" (' + v.score + '/10)');
    }
    await sleep(500);            // sequential, one image at a time
  }
  return out;
}

const IMG_REPORT = path.join(WD, '_DRIP_IMAGE_AUDIT.md');
const IMG_WORKLIST = path.join(IB, '_drip_image_worklist.json');
const MIN_IMG_BYTES = 3000;   // below this it is a placeholder/broken stub, not a real photo
// Owner standard (2026-07-28): "every url has 6 or more images equally spaced", then
// "1 image for every paragraph". So 6 is the FLOOR and the paragraph count is the target,
// clamped to the publisher's slot ceiling (PULSE_MAX_BODY_IMAGES, now 20).
const MIN_BODY_IMGS = parseInt(process.env.DRIP_MIN_BODY_IMGS || '6', 10);
const MAX_BODY_IMGS = parseInt(process.env.PULSE_MAX_BODY_IMAGES || '10', 10);

// How many body paragraphs does this article actually have? Mirrors imageSlotIndices(): count
// paragraphs between the first real H2 and the FAQ/Sources/Related tail, since those are the
// positions an image can be placed after.
function paragraphCount(body) {
  const lines = String(body || '').split('\n');
  let stop = lines.length;
  for (let i = 0; i < lines.length; i++) if (/^##\s+(Related questions|FAQ|Sources|Related on PULSE)/i.test(lines[i].trim())) { stop = i; break; }
  let start = 0;
  for (let i = 0; i < stop; i++) { const t = lines[i].trim(); if (/^##\s/.test(t) && !/Direct Answer/i.test(t)) { start = i + 1; break; } }
  const isBreak = l => l.trim() === '' || /^#{1,6}\s/.test(l.trim()) || /^```/.test(l.trim()) || /^!\[/.test(l.trim());
  let n = 0, inPara = false;
  for (let i = start; i < stop; i++) { const brk = isBreak(lines[i]); if (!brk) inPara = true; else if (inPara) { n++; inPara = false; } }
  if (inPara) n++;
  return n;
}
// Target = one per paragraph, never below the 6 floor, never above the publisher's ceiling.
const imageTarget = body => Math.min(MAX_BODY_IMGS, Math.max(MIN_BODY_IMGS, paragraphCount(body)));

// Are the body images spread through the article, or clumped at the top? Compares the gaps
// between successive image positions; flags when the largest gap is more than 2.5x the smallest.
function spacingIssue(body) {
  const at = [];
  const re = /!\[[^\]]*\]\([^)]*\)/g;
  let m;
  while ((m = re.exec(String(body)))) at.push(m.index);
  if (at.length < 3) return null;                       // too few to judge spacing
  const len = String(body).length;
  const pts = [0, ...at, len];
  const gaps = [];
  for (let i = 1; i < pts.length; i++) gaps.push(pts[i] - pts[i - 1]);
  const max = Math.max(...gaps), min = Math.min(...gaps);
  if (min > 0 && max / min > 2.5) return 'images unevenly spaced (largest gap ' + (max / min).toFixed(1) + 'x the smallest)';
  return null;
}

// LAW-DOM: the renderer builds the hero URL as `/assets/qa/<id>.jpg` and ignores blob.img,
// _index.json and the pool. So the ONLY honest test of "does this page have an image" is fetching
// what the page actually serves. Auditing the `qa-bin/` blob listing instead reported "no face
// image" for q1524 and ra0056 while both were serving a real 129KB / 35KB JPEG — every one of
// those flags was a false alarm, and auto-replacing on top of them would have overwritten images
// that were already fine.
const LIVE = 'https://pulserevops.com';
// HEAD, not GET. The first version downloaded every image in full just to learn its size — up to
// 7 images per page across 36k pages, which is enormous wasted bandwidth and was the main reason
// a page that needs NO work still took seconds. content-length + content-type answer the same
// question for a few hundred bytes. Only fall back to GET if HEAD gives no length.
async function liveImage(url) {
  try {
    let r = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(12000) });
    if (!r.ok) return { ok: false, status: r.status, bytes: 0 };
    const ct = String(r.headers.get('content-type') || '');
    let bytes = parseInt(r.headers.get('content-length') || '0', 10);
    if (!bytes) {                                        // no length header → measure it properly
      const g = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!g.ok) return { ok: false, status: g.status, bytes: 0 };
      bytes = (await g.arrayBuffer()).byteLength;
    }
    // The renderer falls back to the Pulse logo SVG when the jpg is missing — that is NOT an image
    // for our purposes, it is the failure mode this whole check exists to catch.
    const isSvg = /svg/i.test(ct);
    return { ok: !isSvg && /image/i.test(ct) && bytes >= MIN_IMG_BYTES, status: r.status, bytes, ct, isSvg };
  } catch (e) {
    return { ok: false, status: 0, bytes: 0, err: String((e && e.message) || e) };
  }
}

async function auditImages(id, body, tpl) {
  const out = { id, face: false, faceBytes: 0, bodyCount: 0, issues: [] };
  try {
    // One parallel batch instead of 7 sequential round trips — the face and every body slot are
    // independent URLs, so serialising them just multiplied the latency of every single page.
    const urls = [LIVE + '/assets/qa/' + id + '.jpg'];
    for (let i = 1; i <= MIN_BODY_IMGS; i++) urls.push(LIVE + '/assets/qa/' + id + '-b' + i + '.jpg');
    const res = await Promise.all(urls.map(u => liveImage(u)));

    const face = res[0];
    out.face = face.ok;
    out.faceBytes = face.bytes;
    if (!face.ok) {
      out.issues.push(face.isSvg ? 'face image falling back to the logo SVG'
        : (face.status === 200 ? 'face image only ' + face.bytes + 'b (placeholder/broken)'
                               : 'no face/hero image (HTTP ' + face.status + ')'));
    }
    // Slots fill in order, so the run ends at the first gap.
    let n = 0;
    for (let i = 1; i <= MIN_BODY_IMGS; i++) { if (res[i] && res[i].ok) n++; else break; }
    out.bodyCount = n;
    out.paragraphs = paragraphCount(body);
    out.target = imageTarget(body);
    out.ranks = tpl === 'top10' ? rankTitles(body) : [];   // slot N ↔ rank N sourcing
    // 🏆 ONE IMAGE PER RANKING on ranked pages (owner 2026-07-29: "can u tell it 1 image per ranking").
    // The default target is one image per PARAGRAPH, which is right for an essay but wrong for a Top-10: a
    // 66-paragraph ranking page asked for a paragraph-derived count that had nothing to do with the 10 items,
    // so slots and ranks drifted apart and the extra slots got filled from the page-level pool — which is
    // where generic and product-on-white shots creep in. On a ranked page the correct number is exactly the
    // number of ranked items, so slot N always means item N.
    if (out.ranks.length) {
      out.target = Math.min(MAX_BODY_IMGS, out.ranks.length);
      out.perRank = true;
    }
    if (n < out.target) {
      out.issues.push('only ' + n + ' body images — need ' + out.target
        + ' (1 per paragraph · ' + out.paragraphs + ' paragraphs · floor ' + MIN_BODY_IMGS + ')');
    }
    const sp = spacingIssue(body);
    if (sp) out.issues.push(sp);
    if (tpl === 'top10') {
      // Top-10 gold expects an image on each of the 10 rank blocks.
      const withImg = (String(body).match(/img="/g) || []).length;
      if (withImg < 10) out.issues.push('top-10 rank images ' + withImg + '/10');
    }
  } catch (e) {
    out.issues.push('image check failed — ' + ((e && e.message) || e));
  }
  return out;
}

// ── 🎯 CANDIDATE IMAGES — propose only, the human places ───────────────────────────────────
// Owner 2026-07-28: "you make the picks/links for images" → resolved as PROPOSE, not place.
// This finds and ranks candidates and writes their URLs into a queue the picker reads. It does
// NOT download, embed, or write any image anywhere: no file lands in an image dir, no blob is
// written, no receipt is forged. IMAGE_PLACEMENT_LAW.md stays intact — the human still clicks.
//
// Follows the IMAGE ACQUISITION CONTRACT: a 2-4 word concrete-noun query (never the title
// verbatim — an airplane article gets an airplane photo), top candidates scored on alt-text
// overlap with the topic nouns, zero overlap rejected, and HD only (>=1600px long edge, taken
// from src.original/large2x, never medium/small).
const CAND_QUEUE = path.join(IB, '_drip_image_candidates.json');
const CANDIDATES_ON = process.env.DRIP_CANDIDATES !== '0';
const STOP_WORDS = new Set(('what which where when how why who is are the a an of for to in on at and or '
  + 'do does did you your best top guide need needs should can with from that this these those '
  + 'it its by as be been being have has had will would could about into over under more most '
  + 'through during before after between out off then than there here they them their we our us '
  + 'in 2026 2027 2028').split(/\s+/));

// 🎯 PILLAR CONTEXT — what an entry in this pillar is actually ABOUT. Two jobs:
//  1. anchors the search so a short/ambiguous topic still returns on-subject photos;
//  2. widens what counts as relevant, because stock captions describe the SUBJECT rather than the
//     proper noun — a Land Cruiser is captioned "white suv parked", which shares nothing with
//     "toyota land cruiser" and was being rejected, dropping the slot back to the generic pool.
const PILLAR_CONTEXT = STD.PILLAR_CONTEXT;   // 🔒 shared — see new/_image_standards.js

function imageQuery(topic, id) {
  const words = String(topic || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));
  const seen = new Set();
  const picked = [];
  for (const w of words) { if (seen.has(w)) continue; seen.add(w); picked.push(w); if (picked.length === 3) break; }
  const ctx = PILLAR_CONTEXT[pillarOf(id || '')] || [];
  // Context words count as relevant, so a subject-accurate photo is not thrown away over wording.
  const nouns = new Set([...words, ...ctx]);
  return { query: picked.join(' '), nouns, ctx };
}

// ── 🔑 PEXELS CLIENT: cached + rate-limited ────────────────────────────────────────────────
// The drip was firing ~100 searches per page — every rank ran its own multi-variant search, plus
// the hero ladder — against a 200/hour quota. Pexels returned 429 for everything, which surfaced
// as "every ladder rung failed" and pages left with no hero and a white space. Two fixes:
//   • CACHE every query result on disk; the same nouns recur constantly across a pillar.
//   • BUDGET live calls per hour, and on a 429 stop calling for a cool-off instead of hammering.
const PX_CACHE_F = path.join(IB, '_pexels_cache.json');
const PX_TTL = 7 * 86400000;                 // a week — stock photo results barely move
const PX_PER_HOUR = parseInt(process.env.DRIP_PEXELS_PER_HOUR || '150', 10);
let PX_CACHE = {};
try { PX_CACHE = JSON.parse(fs.readFileSync(PX_CACHE_F, 'utf8')) || {}; } catch (e) { PX_CACHE = {}; }
let pxCalls = [], pxCoolUntil = 0, pxDirty = 0;
function pxSave() { if (++pxDirty % 10) return; try { fs.writeFileSync(PX_CACHE_F, JSON.stringify(PX_CACHE)); } catch (e) {} }

// 🔒 ONE AT A TIME (standing owner law). Every Pexels request goes through this single chain, so
// there is never more than one in flight — no Promise.all, no concurrent lanes — with a minimum
// gap between them. A cross-process lock file keeps the picture machines from firing at the same
// moment as the drip, since they share the one account quota.
const PX_LOCK = path.join(IB, '_pexels.lock');
const PX_MIN_GAP_MS = parseInt(process.env.DRIP_PEXELS_GAP_MS || '1500', 10);
let pxChain = Promise.resolve();
let pxLast = 0;

function pxAcquire() {
  // stale lock (crashed holder) is broken after 30s
  for (let i = 0; i < 200; i++) {
    try {
      fs.writeFileSync(PX_LOCK, String(process.pid), { flag: 'wx' });
      return true;
    } catch (e) {
      try { const st = fs.statSync(PX_LOCK); if (Date.now() - st.mtimeMs > 30000) { fs.unlinkSync(PX_LOCK); continue; } } catch (e2) {}
      return false;   // someone else holds it — caller waits and retries
    }
  }
  return false;
}
function pxRelease() { try { fs.unlinkSync(PX_LOCK); } catch (e) {} }

function pexels(key, query) {
  // serialise: each call waits for the previous one to finish
  pxChain = pxChain.then(() => pexelsOne(key, query)).catch(() => []);
  return pxChain;
}

async function pexelsOne(key, query) {
  const k = String(query).toLowerCase().trim();
  const hit = PX_CACHE[k];
  if (hit && (Date.now() - hit.at) < PX_TTL) return hit.p || [];   // cache hit costs no request

  if (Date.now() < pxCoolUntil) return [];                       // in 429 cool-off — cache only
  const now = Date.now();
  pxCalls = pxCalls.filter(t => now - t < 3600000);
  if (pxCalls.length >= PX_PER_HOUR) return [];                  // hourly budget spent

  // pace + cross-process lock
  const gap = PX_MIN_GAP_MS - (Date.now() - pxLast);
  if (gap > 0) await sleep(gap);
  let held = false;
  for (let i = 0; i < 40 && !held; i++) { held = pxAcquire(); if (!held) await sleep(500); }

  try {
    pxLast = Date.now();
    pxCalls.push(pxLast);
    const r = await fetch('https://api.pexels.com/v1/search?per_page=40&orientation=landscape&query='
      + encodeURIComponent(query), { headers: { Authorization: key }, signal: AbortSignal.timeout(15000) });
    if (r.status === 429) {
      pxCoolUntil = Date.now() + 15 * 60000;                     // back off, never hammer
      log('🔑 Pexels 429 — backing off 15 min, serving from cache (' + Object.keys(PX_CACHE).length + ' cached queries)');
      return [];
    }
    if (!r.ok) return [];
    const photos = ((await r.json()).photos) || [];
    PX_CACHE[k] = { at: Date.now(), p: photos };
    pxSave();
    return photos;
  } finally { if (held) pxRelease(); }
}

// 🏆 RANKED ITEM TITLES — for a Top-10 page, slot N's image must match RANK N, not the page title.
// The acquisition contract is explicit that list-item images derive their query from each item's
// own text; sourcing all ten from one page-level query is how a Grady-White section ends up with a
// generic boat photo. Headings look like "## 1. Grady-White Canyon 336 🏆 BEST OVERALL".
function rankTitles(body) {
  const out = [];
  const re = /^##\s*(\d{1,2})[.)]\s+(.+)$/gm;
  let m;
  while ((m = re.exec(String(body || '')))) {
    const rank = parseInt(m[1], 10);
    const name = m[2]
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ')      // strip 🏆 💎 etc
      .replace(/\b(BEST OVERALL|BEST VALUE|RUNNER[- ]UP|TOP PICK|EDITOR'?S CHOICE)\b/gi, ' ')
      .replace(/\s+/g, ' ').trim();
    if (name && rank >= 1 && rank <= 20) out[rank - 1] = name;
  }
  return out.filter(Boolean);
}

// ── 🦆 DDG: keyless image search, one request at a time ────────────────────────────────────
// Pexels hit its 25,000/month ceiling on 2026-07-28 with 10 days to the reset, which is what left
// pages heroless. DuckDuckGo needs no key and no quota. Same discipline as Pexels: ONE request in
// flight, a hard gap between them, and results cached — the library has 203k images already, so
// most of what we need is a cache or reuse away rather than a fresh search.
// ⏱ Gap between DuckDuckGo searches. Was 20s, which was THE bottleneck once rank-matching made every slot do
// its own search: ~7s of real work then a 20s wait, ~33s per image, ~5.5 min for a 10-image page (owner
// 2026-07-29: "is there anything you can do to get the time faster on the images").
// 5s is still one request every five seconds from a single client — well inside anything DDG would object to,
// and it cuts a 10-image page from ~5.5 min to ~2 min. The vqd token is cached 15 min so this is one request
// per search, not two. Raise it again with DRIP_DDG_GAP_MS if DDG ever starts refusing.
const DDG_GAP_MS = parseInt(process.env.DRIP_DDG_GAP_MS || '5000', 10);
let ddgChain = Promise.resolve(), ddgLast = 0, ddgToken = { t: '', at: 0 };

async function ddgSearch(query) {
  ddgChain = ddgChain.then(() => ddgOne(query)).catch(() => []);
  return ddgChain;
}
async function ddgOne(query) {
  const k = 'ddg:' + String(query).toLowerCase().trim();
  const hit = PX_CACHE[k];
  if (hit && (Date.now() - hit.at) < PX_TTL) return hit.p || [];

  const gap = DDG_GAP_MS - (Date.now() - ddgLast);
  if (gap > 0) await sleep(gap);
  ddgLast = Date.now();
  try {
    // DDG needs a short-lived vqd token from the HTML endpoint before the image API will answer.
    if (!ddgToken.t || Date.now() - ddgToken.at > 900000) {
      const h = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(query),
        { headers: { 'user-agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(20000) });
      const txt = await h.text();
      const m = txt.match(/vqd=["']?([-\d]+)["']?/) || txt.match(/vqd=([^&"']+)/);
      if (!m) return [];
      ddgToken = { t: m[1], at: Date.now() };
      await sleep(1200);
    }
    const u = 'https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(query)
      + '&vqd=' + encodeURIComponent(ddgToken.t) + '&f=,,,size:Large,,&p=1';
    const r = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0', referer: 'https://duckduckgo.com/' }, signal: AbortSignal.timeout(20000) });
    if (!r.ok) { if (r.status === 403) ddgToken = { t: '', at: 0 }; return []; }
    const j = await r.json();
    const out = (j.results || []).map(x => ({
      url: x.image, alt: x.title || '', w: x.width || 0, h: x.height || 0,
      by: x.source || 'ddg', page: x.url || '',
    })).filter(x => x.url && x.w >= 1200);
    PX_CACHE[k] = { at: Date.now(), p: out };
    pxSave();
    return out;
  } catch (e) { return []; }
}

// ── 🏦 LOCAL BANKED POOL — the owner's own inventory, zero API calls ───────────────────────
// 7,953 curated images sit in assets/qa/_pexels_stored (3.3GB), plus 4,441 approved CDN URLs in
// new/_booster_approved.json. The Pexels 429 is on api.pexels.com (SEARCH); serving a file off
// disk costs nothing at all and works while the monthly quota is exhausted.
//
// These have no per-image keywords, so they cannot be topic-matched. That is acceptable under the
// owner's rule: "dupes are ok site wide but no dupes allowed in body of url" — the bar is that a
// page never repeats an image, not that the pool is unique across the site. Topic-matched sources
// (cached Pexels, then DDG) are still tried FIRST; this pool is what guarantees a page is never
// left with a blank hero or a short image set.
const POOL_DIRS = [
  path.join(WD, 'assets', 'qa', '_pexels_stored'),
  path.join(WD, 'assets', 'qa', '_gp_pool'),
  path.join(WD, 'assets', 'pool10'),
];
let POOL_FILES = null;
function poolFiles() {
  if (POOL_FILES) return POOL_FILES;
  POOL_FILES = [];
  for (const d of POOL_DIRS) {
    try {
      for (const f of fs.readdirSync(d)) if (/\.(jpe?g|png|webp)$/i.test(f)) POOL_FILES.push(path.join(d, f));
    } catch (e) {}
  }
  log('🏦 local image pool: ' + POOL_FILES.length + ' banked images across ' + POOL_DIRS.length + ' folders');
  return POOL_FILES;
}
// Deterministic per-entry offset so the same page keeps a stable look across laps, while
// different pages start at different points in the pool.
function poolPick(id, n) {
  const files = poolFiles();
  if (!files.length) return [];
  let h = 0;
  for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const out = [];
  for (let i = 0; i < n; i++) out.push({ file: files[(h + i * 7919) % files.length], local: true });
  return out;
}

// 📝 PER-PILLAR IMAGE NOTES (owner 2026-07-29: "put individual notes for each pillar so it'll know what it
// should be looking for"). Plain JSON at new/imagebank/_pillar_image_notes.json, re-read every 60s so the
// owner can edit it live without restarting the daemon.
//   look_for → extra query terms, so a pillar searches in its own vocabulary
//   avoid    → hard veto on the candidate's alt text / filename
// The veto is the part PILLAR_CONTEXT never had. "Skill Drill" matched a soccer photo on the word "drill"
// and nothing could overrule it; now `avoid: ["soccer","football",…]` kills it outright.
const NOTES_F = path.join(IB, '_pillar_image_notes.json');
let NOTES_CACHE = null, NOTES_AT = 0;
const pillarNotes = STD.pillarNotes;   // 🔒 shared — see new/_image_standards.js
const vetoed = STD.vetoed;             // 🔒 shared

// 🚫 AMBIGUOUS MATCH WORDS (owner incident 2026-07-29 — soccer photos on a sales page).
// Each of these means something different in a stock-photo library than it does on a business page:
// a "drill" is a power tool or a sports exercise, "training" and "practice" are athletic, a "pitch" is
// a field, a "coach" is a bus. Matching on one of them alone is not evidence the photo belongs.
const AMBIGUOUS_MATCH = STD.AMBIGUOUS_MATCH;   // 🔒 shared — see new/_image_standards.js
const altOverlapOk = STD.altOverlapOk;         // 🔒 shared

async function candidateImages(id, topic, want) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return { ok: false, err: 'no PEXELS_API_KEY', candidates: [] };
  const { query, nouns, ctx } = imageQuery(topic, id);
  if (!query) return { ok: false, err: 'no usable query from "' + String(topic).slice(0, 40) + '"', candidates: [] };

  // The contract says try the next query VARIANT rather than accept an irrelevant photo. A single
  // 3-word query returned only 2 usable hits for a 7-image need, so walk progressively broader
  // variants and keep collecting until there are enough — relevance rules stay identical.
  // Widen the NET, never the relevance bar. The earlier version let broad fallbacks contribute
  // photos with zero alt-text overlap, which is how an off-topic image could reach a page — the
  // acquisition contract exists precisely to stop that ("an airplane article gets an airplane
  // photo"). Now every variant is still built from the entry's own topic nouns, and every
  // candidate must match at least one of them regardless of which variant found it.
  const parts = query.split(' ');
  const anchor = ctx[0] ? ' ' + ctx[0] : '';   // e.g. " car" on a ca#### url, " boat" on bt####
  const variants = [
    query + anchor,                            // most specific: topic + what this pillar IS
    query,
  ];
  if (parts.length > 2) variants.push(parts[0] + ' ' + parts[2] + anchor);
  if (parts.length > 1) variants.push(parts.slice(0, 2).join(' ') + anchor);
  for (const p of parts) variants.push(p + anchor);   // single topic noun, still pillar-anchored
  for (const c of ctx.slice(0, 3)) variants.push(parts[0] + ' ' + c);

  const target = Math.max(want || 6, 6) + 4;
  const seenSrc = new Set();
  const scored = [];
  let used = [];
  // Cap the variants actually tried. Walking all of them for every rank on every page is what
  // blew the API quota; the first two are the specific ones and carry nearly all the value.
  const MAX_VARIANTS = parseInt(process.env.DRIP_MAX_VARIANTS || '3', 10);
  try {
    // 🦆 DDG FIRST while Pexels is cooling (owner 2026-07-29). Leading with Pexels meant every page opened with
    // a 429 and a 15-minute back-off before anything useful happened. DDG is keyless, unmetered and — now that
    // it clears the same ambiguity guard — held to exactly the same relevance bar.
    if (DDG_FIRST) {
      for (const v of variants.slice(0, 2)) {
        if (scored.length >= target) break;
        const dd = await ddgSearch(v);
        for (const p of dd) {
          if (scored.length >= target) break;
          if (!p.url || seenSrc.has(p.url)) continue;
          const alt = String(p.alt || '').toLowerCase();
          if (!altOverlapOk(alt, nouns)) continue;
          { const v = vetoed(alt, pillarOf(id)); if (v) { log(id + ' 🚫 vetoed candidate — alt matches "' + v + '"'); continue; } }
        { const v = vetoed(alt, pillarOf(id)); if (v) { log(id + ' 🚫 vetoed candidate — alt matches "' + v + '"'); continue; } }
          seenSrc.add(p.url);
          scored.push({ url: p.url, alt: p.alt || '', w: p.w, h: p.h, by: p.by, page: p.page,
                        score: alt.split(/\s+/).filter(w => nouns.has(w)).length, via: 'ddg:' + v });
        }
      }
      if (scored.length) log(id + ' 🦆 DDG (first) supplied ' + scored.length + ' candidate(s)');
    }
    for (const v of variants.slice(0, MAX_VARIANTS)) {
      if (scored.length >= target) break;
      let photos = [];
      try { photos = await pexels(key, v); } catch (e) { continue; }
      used.push(v);
      for (const p of photos) {
        const long = Math.max(p.width || 0, p.height || 0);
        if (long < 1600) continue;                                // 🔒 HD law — no soft/low-res
        const url = (p.src && (p.src.original || p.src.large2x)) || '';
        if (!url || seenSrc.has(url)) continue;
        const alt = String(p.alt || '').toLowerCase();
        // 🔒 CONTEXTUAL CORRECTNESS: zero overlap is rejected outright, from EVERY query variant.
        // Fewer candidates is the right failure mode — a page short an image is recoverable, an
        // off-topic image on a published page is not.
        // 🔧 2026-07-29 — overlap on an AMBIGUOUS word alone is no longer enough. A soccer photo whose
        // alt says "football drill" shares "drill" with "Skill Drill: Giving Feedback" and used to pass
        // as on-topic. These words carry a different meaning in a stock library than on a business page,
        // so a match built only from them proves nothing; at least one specific word must also hit.
        if (!altOverlapOk(alt, nouns)) continue;
        { const v = vetoed(alt, pillarOf(id)); if (v) { log(id + ' 🚫 vetoed candidate — alt matches "' + v + '"'); continue; } }
        const overlap = alt.split(/\s+/).filter(w => nouns.has(w)).length;
        seenSrc.add(url);
        scored.push({ url, alt: p.alt || '', w: p.width, h: p.height, by: p.photographer, page: p.url,
                      score: overlap, via: v });
      }
    }
    // 🏦 LOCAL POOL BEFORE DDG (owner 2026-07-29: "pexels is on cooldown for a few more days, you may want to
    // swap that out for local library"). With Pexels 429'd, DDG was supplying essentially every image — and DDG
    // is where both bad image sets came from. The banked pool is pre-vetted, has no rate limit and no API cost,
    // so it is the better second source while Pexels is down. It still has to clear the same relevance bar via
    // the filename, so it cannot smuggle an off-topic image in either.
    if (scored.length < Math.min(3, target) && POOL_FIRST) {
      const need = target - scored.length;
      for (const p of poolPick(id + ':' + String(topic).slice(0, 24), need + 4)) {
        if (scored.length >= target) break;
        const keyf = 'file:' + p.file;
        if (seenSrc.has(keyf)) continue;
        const base = String(path.basename(p.file, path.extname(p.file))).replace(/[-_]+/g, ' ').toLowerCase();
        if (!altOverlapOk(base, nouns)) continue;      // same bar as every other source
        seenSrc.add(keyf);
        scored.push({ url: '', file: p.file, local: true, alt: base, score: 1, via: 'pool' });
      }
      if (scored.some(s => s.via === 'pool')) log(id + ' 🏦 local pool supplied ' + scored.filter(s => s.via === 'pool').length + ' candidate(s)');
    }
    // 🦆 Pexels dry (quota, 429, or just no relevant hits) → DuckDuckGo, keyless and unmetered.
    // Same relevance bar: a candidate must share a word with the topic or pillar context.
    if (scored.length < Math.min(3, target)) {
      for (const v of variants.slice(0, 2)) {
        if (scored.length >= target) break;
        const dd = await ddgSearch(v);
        for (const p of dd) {
          if (scored.length >= target) break;
          if (!p.url || seenSrc.has(p.url)) continue;
          const alt = String(p.alt || '').toLowerCase();
          // same ambiguity guard as the Pexels rung — DDG is where the soccer photos came from
          if (!altOverlapOk(alt, nouns)) continue;
          { const v = vetoed(alt, pillarOf(id)); if (v) { log(id + ' 🚫 vetoed candidate — alt matches "' + v + '"'); continue; } }
        { const v = vetoed(alt, pillarOf(id)); if (v) { log(id + ' 🚫 vetoed candidate — alt matches "' + v + '"'); continue; } }
          const overlap = alt.split(/\s+/).filter(w => nouns.has(w)).length;
          seenSrc.add(p.url);
          scored.push({ url: p.url, alt: p.alt || '', w: p.w, h: p.h, by: p.by, page: p.page, score: overlap, via: 'ddg:' + v });
        }
      }
      if (scored.length) log(id + ' 🦆 DDG supplied ' + scored.filter(s => /^ddg:/.test(s.via || '')).length + ' candidate(s)');
    }
    // 🌸 POLLINATIONS — third rung (owner 2026-07-29: "pollinnator ddg… between those three that should be
    // enough"). Generative, so it is always ON topic by construction: the prompt IS the page's own topic, which
    // is why the alt-text overlap test above does not apply to it — there is no third-party alt text to test.
    // Placed AFTER Pexels and DDG on purpose: a real photograph beats a generated one whenever a relevant real
    // photograph exists. ONE image per call, sequential, no parallel fetches.
    // ⚠️ Body slots only. Face cards stay off the generative rung — that path is what produced the fake logo,
    // and lifting the placement law did not make that failure less likely.
    // NOTE: `candidateImages(id, topic, want)` takes no opts — an earlier version of this line referenced
    // `opts.faceCard` and threw ReferenceError every time the Pollinations rung was reached, which the caller
    // swallowed as "no candidates". Pages needing the fallback silently got ZERO images.
    // Face cards are protected at the writeHero ladder instead, which never calls this rung.
    if (scored.length < target && POLLINATE_ON) {
      const need = Math.min(2, target - scored.length);
      for (let i = 0; i < need; i++) {
        const prompt = String(variants[0] || topic).slice(0, 120);
        const u = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt)
          + '?width=1600&height=1067&nologo=true&seed=' + (i + 1);
        if (seenSrc.has(u)) continue;
        seenSrc.add(u);
        scored.push({ url: u, alt: prompt, w: 1600, h: 1067, by: 'pollinations', page: '', score: 1, via: 'pollinations' });
        log(id + ' 🌸 pollinations candidate queued — "' + prompt.slice(0, 48) + '"');
        await sleep(400);                       // one at a time, never parallel
      }
    }
    // 🏦 Still short after cached-Pexels and DDG? Fall back to the banked local pool. This is the
    // backstop that means a page is never published with a blank hero or a half-filled image set.
    if (scored.length < target) {
      const need = target - scored.length;
      for (const p of poolPick(id + ':' + String(topic).slice(0, 24), need + 6)) {
        if (scored.length >= target) break;
        const keyf = 'file:' + p.file;
        if (seenSrc.has(keyf)) continue;
        seenSrc.add(keyf);
        scored.push({ url: p, alt: 'banked', w: 1800, h: 1200, by: 'library', page: '', score: 0, via: 'local pool', local: true });
      }
      log(id + ' 🏦 local pool supplied ' + scored.filter(s => s.local).length + ' image(s)');
    }
    scored.sort((a, b) => b.score - a.score || (b.w * b.h) - (a.w * a.h));
    return { ok: true, query, tried: used, candidates: scored.slice(0, target) };
  } catch (e) {
    return { ok: false, err: String((e && e.message) || e), candidates: [] };
  }
}

function queueCandidates(id, question, need, found) {
  if (!found.candidates.length) return;
  let q = {};
  try { q = JSON.parse(fs.readFileSync(CAND_QUEUE, 'utf8')); } catch (e) {}
  q[id] = { id, question, need, query: found.query, at: Date.now(), placed: false, candidates: found.candidates };
  try { fs.writeFileSync(CAND_QUEUE, JSON.stringify(q, null, 1)); } catch (e) {}
  log(id + ' 🎯 queued ' + found.candidates.length + ' candidate image link(s) for your picks (need ' + need + ')');
}

// ── 🖼 IMAGE APPLY (authorized by owner code 4444, 2026-07-28) ─────────────────────────────
// "make image changes and adds when needed 4444" — the sanctioned override. Built to
// `_IMAGE_FINISHER_SPEC.md`, whose core lesson is that automation failed before because it
// applied-and-forgot. So every apply here is verified against what the page actually serves:
//
//   • Writes ONLY through publishBodySlot() — the one choke-point that stamps qa-bin/<id>-bN.jpg
//     and re-embeds slot-accurately. No ad-hoc blob writes, no generative images ever.
//   • DOM RECEIPT: after each write, re-fetch the live URL. No 200/real-bytes = no receipt, and
//     the slot stays pending rather than being marked done.
//   • RATE LOCK: at most one apply per 30s. Trips off if exceeded.
//   • CIRCUIT BREAKER: 3 consecutive unverified applies halts image work for the run.
//   • "WHEN NEEDED" is decided by the DOM audit above, never by the blob listing — auditing
//     qa-bin/ produced false "missing image" flags on pages that were serving fine.
const APPLY_ON = String(process.env.DRIP_IMAGE_APPLY || '1') === '1';
// 🦸 HERO + FACE, back ON (owner 2026-07-28: "the drip needs to apply face and hero cards — same
// one for each"). writeHero() sources ONE image and writes it to both surfaces from the same
// buffer: qa-bin/<id>.jpg is the hero the renderer builds, qa-bin/<id>.sq.jpg is the square crop
// the tile grid / face card uses. Same photo, two shapes — they can never disagree.
// Both also get a -v<timestamp> copy and blob.img is repointed at it, because these assets are
// served immutable for a year and an in-place overwrite would never reach anyone.
const HERO_ON = String(process.env.DRIP_HERO || '1') === '1';
// Deleting heroes is now OFF — it was a deliberate earlier instruction, since reversed.
const HERO_DELETE = String(process.env.DRIP_DELETE_HERO || '0') === '1';
// Spacing between image applies. The spec's rail exists so a bad apply can't propagate across the
// library before anyone notices — but 30s meant a 6-image page took 3 minutes of pure waiting.
// The DOM receipt + circuit breaker are what actually catch a bad apply; the gap only needs to be
// long enough for the CDN to settle before the receipt check.
// 20s between image applies (owner: "I don't even care if you put a twenty second throttle in
// between the images"). This is the single biggest lever on the Pexels quota — the 429s that left
// pages heroless came from hammering it. Slow here costs nothing; the drip runs forever.
// ⏱ Per-image rate lock. Was 20s, which put a 10-image page at ~4 minutes and the whole library at weeks
// (owner 2026-07-29: "decrease wait times"). 4s still paces the image hosts politely and keeps the daemon
// well under any sane rate limit, while cutting a full page from ~4 minutes to well under one.
// Raise it again with DRIP_IMAGE_GAP_MS if a source starts 429-ing.
const APPLY_GAP_MS = parseInt(process.env.DRIP_IMAGE_GAP_MS || '4000', 10);
// 🏦 Use the banked local pool as a SECOND source, ahead of DDG, while Pexels is rate-limited (owner
// 2026-07-29). Set DRIP_POOL_FIRST=0 to restore the old order once Pexels is back.
const POOL_FIRST = String(process.env.DRIP_POOL_FIRST || '1') === '1';
// 🦆 Try DDG BEFORE Pexels (owner: "you can just make ddg first option"). Pexels is 429'd for days, so
// leading with it wasted a call and a back-off on every single page. DDG is keyless and unmetered.
// Pexels still runs after — it just is not the opener. DRIP_DDG_FIRST=0 restores Pexels-first.
const DDG_FIRST = String(process.env.DRIP_DDG_FIRST || '1') === '1';
const RECEIPTS = path.join(WD, 'sim', 'IMAGE_RECEIPTS.md');
let lastApply = 0, applyFails = 0, applyHalted = false;

// Pexels `src.original` is the full-resolution master — the first applies landed at 1.1-4.0 MB
// EACH, which is ~12 MB of images on a single page. That guts page-load speed and therefore the
// search performance this whole job exists to protect. Fetch the master (the HD law says never
// upscale a small source), then downscale ONCE to a sane web width before it is ever written.
const IMG_MAX_W = parseInt(process.env.DRIP_IMG_MAX_W || '1800', 10);
const IMG_QUALITY = parseInt(process.env.DRIP_IMG_QUALITY || '82', 10);

// A size check is NOT a validity check. "Over 3 KB" was the only test here, which passes for an
// HTML error page saved as .jpg, a truncated download, or a blank/near-white stock frame — all of
// which render as a white box on the page. Every candidate is now decoded and inspected before it
// can be written.
const fetchImage = STD.fetchImage;   // 🔒 shared — white/blank rejection, edge test, auto-focus crop

function writeReceipt(row) {
  try {
    fs.mkdirSync(path.dirname(RECEIPTS), { recursive: true });
    if (!fs.existsSync(RECEIPTS)) fs.writeFileSync(RECEIPTS, '# IMAGE RECEIPTS — drip applies, DOM-verified\n\n| id | slot | applied url | DOM src | bytes | when |\n|---|---|---|---|---|---|\n');
    fs.appendFileSync(RECEIPTS, '| `' + row.id + '` | b' + row.slot + ' | ' + row.src + ' | ' + row.dom + ' | ' + row.bytes + ' | ' + new Date().toISOString() + ' |\n');
  } catch (e) {}
}

// 🧹 STOP OLD IMAGES COMING BACK (owner, repeatedly).
// This is the mechanism that actually decides what shows: publishContentBody → embedImages strips
// every image line from the body and RE-EMBEDS one reference per `qa-bin/<id>-bN.jpg` blob that
// exists. So the body never resurrects an old image on its own — but a stale or broken blob left
// in qa-bin does, on the very next publish, forever. Same for publishBodySlot's `present` scan,
// which now walks slots 1..20 and will happily re-reference a dead legacy slot.
// So: before placing anything, delete any slot blob that is not a real, serving image. A blob that
// cannot render has no business being re-embedded.
// 🪞 ANTI-MIRROR — an 8x8 average hash. Two photos from the same shoot (different frame, different
// bytes, same scene) are visually duplicates; byte comparison never catches them. Hamming distance
// on the aHash does. Same technique publish_core uses for its internal-card mirror block.
async function aHash(buf) {
  try {
    const sharp = require('sharp');
    const px = await sharp(buf).resize(8, 8, { fit: 'fill' }).grayscale().raw().toBuffer();
    let sum = 0; for (const v of px) sum += v;
    const avg = sum / px.length;
    let h = 0n;
    for (let i = 0; i < px.length; i++) h = (h << 1n) | (px[i] >= avg ? 1n : 0n);
    return h;
  } catch (e) { return null; }
}
const hamming = (a, b) => { if (a == null || b == null) return 64; let x = a ^ b, c = 0; while (x) { c += Number(x & 1n); x >>= 1n; } return c; };

// 🧨 WIPE EVERY BODY IMAGE. Owner: "start by removing all images then applying all new images."
// Refilling only the empty slots left old photos sitting alongside new ones, which is what kept
// producing stale and mismatched sets. Every page the drip touches now gets a clean slate first,
// so the resulting set is entirely fresh, context-matched, validated and mirror-checked.
async function wipeAllSlots(id) {
  let removed = 0;
  try {
    const s = theStore();
    const lst = await s.list({ prefix: 'qa-bin/' + id + '-b' });
    for (const b of (lst.blobs || [])) {
      if (!/-b\d+\.jpg$/i.test(b.key)) continue;
      try { await s.delete(b.key); removed++; } catch (e) {}
    }
  } catch (e) {}
  if (removed) log(id + ' 🧨 wiped ' + removed + ' existing body image(s) — rebuilding the whole set');
  return removed;
}

async function purgeStaleSlots(id) {
  let removed = 0;
  try {
    const s = theStore();
    const lst = await s.list({ prefix: 'qa-bin/' + id + '-b' });
    for (const b of (lst.blobs || [])) {
      if (!/-b\d+\.jpg$/i.test(b.key)) continue;
      let bytes = b.size;
      if (bytes == null) {
        try { const buf = await s.get(b.key, { type: 'arrayBuffer' }); bytes = buf ? buf.byteLength : 0; } catch (e) { bytes = 0; }
      }
      if (bytes < MIN_IMG_BYTES) {                 // stub / truncated / dead — never re-embed it
        try { await s.delete(b.key); removed++; log(id + ' 🧹 purged stale slot blob ' + b.key + ' (' + bytes + 'b)'); } catch (e) {}
      }
    }
  } catch (e) {}
  return removed;
}

// 🦸 HERO CARD — rewritten on EVERY fix, no exceptions (owner 2026-07-28: "every fix needs a new
// hero image no matter what", "whether fixed or not you must write over hero card").
//
// The face URL `/assets/qa/<id>.jpg` is served `immutable, max-age=1yr`, so overwriting it in
// place would never reach anyone who had already loaded the page. publishFaceImageOnly solves that
// by ALSO writing a timestamped `-v<ts>` copy and pointing blob.img at it — a URL nobody has
// cached. This does the same, but from a sourced buffer instead of a local file.
async function writeHero(id, question, topic) {
  try {
    // 🪜 NEVER LEAVE IT BLANK, NEVER ASK. Owner: "I don't want to pick. I want you to pick."
    // The strict-relevance search returns nothing on plenty of topics, and the old code simply
    // gave up there — which is why most pages ended up with no hero and an email asking for a
    // manual pick. Walk the sanctioned face-card ladder instead: topic-matched Pexels first, then
    // progressively broader on-pillar queries. Generative images stay BANNED for face cards
    // (CLAUDE.md) — every rung here is a real photo, just a less specific one.
    const pillarCtx = PILLAR_CONTEXT[pillarOf(id)] || ['business'];
    const rungs = [
      topic || question,                 // rank name or the page's own question
      question,                          // the page question
      pillarCtx.slice(0, 2).join(' '),   // e.g. "car vehicle", "boat yacht"
      pillarCtx[0],                      // e.g. "car"
      // 🏛 LAST-RESORT DEFAULT (owner 2026-07-29: "if it doesn't know what to do, it's still buildings,
      // architecture and art"). Three progressively broader neutral rungs so a slot is never left empty and
      // never filled with something random — a handsome building or an art shot reads as intentional on any
      // page, where an unrelated photo of people or products reads as a mistake. All real photos; the
      // generative rung stays banned for face cards.
      'architecture building',
      'modern architecture facade',
      'fine art abstract',
    ];
    let buf = null, usedVia = '';
    for (const t of rungs) {
      if (!t) continue;
      const found = await candidateImages(id, t, 1);
      if (!found.ok || !found.candidates.length) continue;
      for (const c of found.candidates.slice(0, 4)) {
        buf = await fetchImage(c.url);          // validates: decodes, not tiny, not blank/white
        if (buf) { usedVia = t; break; }
      }
      if (buf) break;
    }
    if (!buf) { log(id + ' 🦸 hero — every ladder rung failed, will retry next lap'); return false; }
    log(id + ' 🦸 hero sourced via "' + String(usedVia).slice(0, 40) + '"');

    const s = theStore();
    const now = Date.now();
    const ver = '-v' + now;
    // square crop for the tile grid, same geometry publishFaceImageOnly uses
    // The square crop trims a fixed 34px border. Using the DEFAULTS (1200x675) when metadata is
    // missing would ask sharp to extract a region larger than the actual image — which either
    // throws or yields a padded, mostly-blank frame. Derive the border from the real dimensions
    // and skip the crop entirely if the image is too small to take it.
    let sq = buf;
    try {
      const sharp = require('sharp');
      const md = await sharp(buf).metadata();
      const W = md.width || 0, H = md.height || 0;
      const bw = Math.min(34, Math.floor(Math.min(W, H) * 0.05));
      if (W > 2 * bw + 100 && H > 2 * bw + 100) {
        sq = await sharp(buf).extract({ left: bw, top: bw, width: W - 2 * bw, height: H - 2 * bw })
          .jpeg({ quality: 86 }).toBuffer();
      }
    } catch (e) { sq = buf; }

    await s.set('qa-bin/' + id + '.jpg', buf, { metadata: { src: 'drip-hero' } });
    await s.set('qa-bin/' + id + '.sq.jpg', sq, { metadata: { src: 'drip-hero' } });
    await s.set('qa-bin/' + id + ver + '.jpg', buf, { metadata: { src: 'drip-hero' } });
    await s.set('qa-bin/' + id + ver + '.sq.jpg', sq, { metadata: { src: 'drip-hero' } });

    // Point the entry at the VERSIONED url so the year-long cache on the plain path cannot win.
    const blob = await s.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
    if (blob) {
      blob.img = '/assets/qa/' + id + ver + '.jpg';
      blob.updated_at = new Date(now).toISOString();
      await s.setJSON('answers/' + id + '.json', blob);
      try {
        const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
        const ex = idx && (idx.entries || []).find(e => e && e.id === id);
        if (ex) { ex.img = blob.img; await s.setJSON('_index.json', idx); }
      } catch (e) {}
    }
    STATE.heroesWritten++;
    log(id + ' 🦸 NEW HERO written · ' + Math.round(buf.length / 1024) + ' KB · ' + blob.img);
    return true;
  } catch (e) {
    log(id + ' 🦸 hero failed — ' + ((e && e.message) || e));
    return false;
  }
}

// 🗑 DELETE THE HERO CARD (owner 2026-07-28: "delete hero images each url").
// Removes the face card blobs and clears the entry's img pointer. Note the renderer builds
// `/assets/qa/<id>.jpg` unconditionally, so once this is gone that URL 404s and the page falls
// back to the Pulse logo SVG — the hero slot does not render empty, it renders the fallback.
// Body images are untouched. Off by default; DRIP_DELETE_HERO=1 arms it.
async function deleteHero(id) {
  let gone = 0;
  try {
    const s = theStore();
    // the live pair plus every archived -v<timestamp> copy
    const lst = await s.list({ prefix: 'qa-bin/' + id });
    for (const b of (lst.blobs || [])) {
      const k = b.key;
      if (!/^qa-bin\/[a-z]+\d+(-v\d+)?(\.sq)?\.jpg$/i.test(k)) continue;   // never match -bN body slots
      if (/-b\d+\.jpg$/i.test(k)) continue;
      try { await s.delete(k); gone++; } catch (e) {}
    }
    if (gone) {
      const blob = await s.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
      if (blob && blob.img) {
        delete blob.img;
        blob.updated_at = new Date().toISOString();
        await s.setJSON('answers/' + id + '.json', blob);
      }
      try {
        const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
        const ex = idx && (idx.entries || []).find(e => e && e.id === id);
        if (ex && ex.img) { delete ex.img; await s.setJSON('_index.json', idx); }
      } catch (e) {}
      STATE.heroesDeleted++;
      log(id + ' 🗑 hero card deleted (' + gone + ' blob(s)) — page will fall back to the logo');
    }
  } catch (e) { log(id + ' 🗑 hero delete failed — ' + ((e && e.message) || e)); }
  return gone;
}

// Rewrite the body's image references so they match the slots that actually exist in the store.
// A reference to a missing blob is exactly what renders as a white/broken image, so this is the
// backstop after any deletion.
async function resyncBody(id) {
  try {
    const s = theStore();
    const blob = await s.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
    if (!blob) return;
    const lst = await s.list({ prefix: 'qa-bin/' + id + '-b' });
    const slots = (lst.blobs || []).map(b => (b.key.match(/-b(\d+)\.jpg$/i) || [])[1])
      .filter(Boolean).map(Number).sort((a, b) => a - b);
    const question = blob.question || blob.h1 || '';
    const imgs = slots.map((s2, i) => ({ alt: question.replace(/\?+$/, '') + ' — figure ' + (i + 1) }));
    const { embedImages } = require('./publish_core');
    // strip every existing image line, then re-embed against the real slot numbers
    let body = String(blob.answer || '').split('\n').filter(l => !/^!\[[^\]]*\]\([^)]*\)$/.test(l.trim())).join('\n');
    if (imgs.length) {
      body = embedImages(body, id, imgs);
      // embedImages numbers sequentially; remap onto the real slot numbers when they differ
      let k = 0;
      body = body.replace(new RegExp('/assets/qa/' + id + '-b\\d+\\.jpg', 'g'), () => '/assets/qa/' + id + '-b' + slots[k++] + '.jpg');
    }
    blob.answer = body;
    blob.updated_at = new Date().toISOString();
    await s.setJSON('answers/' + id + '.json', blob);
    log(id + ' 🔗 body image references resynced to ' + slots.length + ' real slot(s)');
  } catch (e) { log(id + ' 🔗 resync failed — ' + ((e && e.message) || e)); }
}

async function applyImages(id, img, cands, opts) {
  if (!APPLY_ON || applyHalted || !cands || !cands.length) return { placed: 0, slots: [] };
  // 🔁 REPLACE IN PLACE — never delete before the replacement exists.
  //
  // This previously wiped all body slots up front, then placed a fresh set. That is what produced
  // the white images: the published body still referenced b1..b6, and if placement fell short
  // (rejected candidates, spent budget, tripped breaker) or the page missed and never republished,
  // those references pointed at blobs that no longer existed. Deleted blob + live reference =
  // broken image.
  //
  // Now every slot is OVERWRITTEN in place (publishBodySlot writes to the same key), so a
  // reference is never dangling — worst case a slot keeps its old, valid image. Surplus slots
  // beyond the new target are trimmed only AFTER the new set is down, in trimSurplusSlots below.
  const had = img.bodyCount || 0;
  const need = img.target || MIN_BODY_IMGS;
  if (!need) return { placed: 0, slots: [] };
  log(id + ' 🔁 rebuilding image set in place — ' + had + ' existing → ' + need + ' target (no gap left behind)');
  // Per-slot sourcing for ranked pages: slot N is filled from RANK N's own name, so the photo in
  // the "Grady-White Canyon 336" section is a Grady-White, not a generic boat. Falls back to the
  // page-level candidates when a rank has no usable name or returns nothing relevant.
  const ranks = img.ranks || [];
  let placed = 0;
  const placedSlots = [];      // exactly which slots got a verified image, for the pre-publish gate
  const triedRank = new Set(); // ranks already searched, so a miss never re-queries the same name
  const usedHashes = [];       // 🪞 aHash of every image placed on THIS page — blocks near-duplicates
  // Exact-URL dedupe. candidateImages dedupes within ONE search, but every rank runs its own
  // search, so rank 3 and rank 7 can independently return the same photo. Cheap to catch here,
  // before spending a download on it.
  const usedUrls = new Set();
  // Slot and candidate advance INDEPENDENTLY. They used to share one counter, so a candidate that
  // failed to download burned its slot — tl9467 ended up with b1,b3,b4,b5,b6 and a hole at b2.
  // A dead candidate should cost the candidate, never the slot.
  let ci = 0;
  // Start at slot 1 and overwrite forward — this is a full refresh, not a top-up.
  for (let slot = 1; slot <= MAX_BODY_IMGS && placed < need && ci < cands.length; ) {
    if (opts && opts.superseded && opts.superseded()) { log(id + ' ⏹ superseded — stopping image placement'); break; }
    const wait = APPLY_GAP_MS - (Date.now() - lastApply);
    if (wait > 0) await sleep(wait);                         // rate lock
    // 🏆 rank-matched first: slot N ↔ rank N. Only reach for the page-level pool if that rank has
    // no name or no relevant photo of its own.
    let cand = null, via = '';
    const rankName = ranks[slot - 1];
    if (rankName && !triedRank.has(slot)) {
      triedRank.add(slot);
      const rc = await candidateImages(id, rankName, 1);
      if (rc.ok && rc.candidates.length) { cand = rc.candidates[0]; via = 'rank ' + slot + ': ' + rankName.slice(0, 40); }
      else log(id + ' 🏆 rank ' + slot + ' ("' + rankName.slice(0, 40) + '") — no matching photo, using page pool');
    }
    if (!cand) {
      // advance past any page-pool candidate already used on this page
      while (ci < cands.length && usedUrls.has(cands[ci].url)) ci++;
      if (ci >= cands.length) break;
      cand = cands[ci++]; via = 'page topic';
    }
    // 🚫 NO DUPES WITHIN A PAGE (site-wide reuse is fine, per owner). A candidate is either a URL
    // string or a {file} object from the banked pool — key on whichever it is.
    const candKey = (cand.url && cand.url.local) ? 'file:' + cand.url.file : String(cand.url);
    if (usedUrls.has(candKey)) { log(id + ' 🖼 b' + slot + ' — same photo already on this page, next candidate'); continue; }
    usedUrls.add(candKey);
    // fetchImage now rejects anything that will not decode, is tiny, or is a flat/white frame.
    const buf = await fetchImage(cand.url);
    if (!buf) { log(id + ' 🖼 b' + slot + ' — candidate rejected (dead / blank / not an image), next'); continue; }

    // 🪞 anti-mirror: never place a near-duplicate of one already on THIS page.
    const h = await aHash(buf);
    if (h != null && usedHashes.some(u => hamming(h, u) <= 6)) {
      log(id + ' 🪞 b' + slot + ' — near-duplicate of an image already placed, skipping this candidate');
      continue;
    }
    try {
      await retryNet(() => publishBodySlot(id, buf, slot));
      lastApply = Date.now();
    } catch (e) { log(id + ' 🖼 b' + slot + ' write failed — ' + ((e && e.message) || e)); continue; }

    // DOM RECEIPT — the write is only real if the page serves it.
    await sleep(1500);
    const live = await liveImage(LIVE + '/assets/qa/' + id + '-b' + slot + '.jpg');
    if (live.ok) {
      placed++; applyFails = 0;
      placedSlots.push(slot);
      if (h != null) usedHashes.push(h);       // 🪞 remember it so nothing similar follows
      writeReceipt({ id, slot, src: candKey, dom: '/assets/qa/' + id + '-b' + slot + '.jpg', bytes: live.bytes });
      log(id + ' 🖼 ✓ PLACED b' + slot + ' · ' + live.bytes + 'b · DOM-verified · matched ' + via);
      slot++;                                    // only a VERIFIED slot advances the cursor
    } else {
      applyFails++;
      log(id + ' 🖼 ⚠ b' + slot + ' applied but NOT verified live (HTTP ' + live.status + ') — no receipt, left pending');
      if (applyFails >= 3) { applyHalted = true; log('🛑 IMAGE CIRCUIT BREAKER — 3 unverified applies in a row, image work halted for this run'); break; }
    }
  }
  // Trim only what the new set does not use, and only once it is verified in place. A slot above
  // the highest one we just wrote is genuinely surplus; deleting it cannot orphan a reference
  // because publishContentBody re-embeds from the slots that remain.
  let trimmed = 0;
  if (placed > 0) {
    const highest = Math.max(...placedSlots);
    try {
      const s = theStore();
      const lst = await s.list({ prefix: 'qa-bin/' + id + '-b' });
      for (const b of (lst.blobs || [])) {
        const m = b.key.match(/-b(\d+)\.jpg$/i);
        if (!m) continue;
        if (parseInt(m[1], 10) > highest) {
          try { await s.delete(b.key); trimmed++; log(id + ' 🧹 trimmed surplus slot b' + m[1] + ' (beyond the new set of ' + highest + ')'); } catch (e) {}
        }
      }
    } catch (e) {}
    // publishBodySlot re-embedded the body on its last write, BEFORE those trims — so the markdown
    // could still point at a slot we just removed. Resync the references to the slots that truly
    // exist. This is the last thing standing between a trim and a broken image.
    if (trimmed) await resyncBody(id);
  }
  if (placed) STATE.imagesPlaced += placed;
  return { placed, slots: placedSlots };
}

function recordImageWork(rec) {
  if (!rec || !rec.issues.length) return;
  let list = [];
  try { list = JSON.parse(fs.readFileSync(IMG_WORKLIST, 'utf8')); } catch (e) {}
  const i = list.findIndex(x => x && x.id === rec.id);
  const row = { id: rec.id, issues: rec.issues, face: rec.face, bodyCount: rec.bodyCount, at: Date.now() };
  if (i >= 0) list[i] = row; else list.push(row);
  try { fs.writeFileSync(IMG_WORKLIST, JSON.stringify(list)); } catch (e) {}
  try {
    if (!fs.existsSync(IMG_REPORT)) {
      fs.writeFileSync(IMG_REPORT, '# DRIP IMAGE AUDIT — verification only, no image is ever placed by the drip\n\n'
        + 'The human places images in the block builder (`new/bb_handshake.js`). This is the worklist.\n\n'
        + '| id | issues | face | body imgs | seen |\n|---|---|---|---|---|\n');
    }
    fs.appendFileSync(IMG_REPORT, '| `' + rec.id + '` | ' + rec.issues.join('; ') + ' | '
      + (rec.face ? '✓' : '✗') + ' | ' + rec.bodyCount + ' | ' + new Date().toISOString().slice(0, 16) + ' |\n');
  } catch (e) {}
}

// ── 🔍 AUDITOR ─────────────────────────────────────────────────────────────────────────────
// Independent of the writer. Re-scores the candidate body and checks the LOCKED golden shape.
// A body can hit 12/13 on the rubric and still be malformed (TL;DR, numbered H2s, mermaid above
// the Direct Answer) — the gate is blind to that, so the auditor is the thing that catches it.
// 🥇 TWO GOLDEN TEMPLATES, and the auditor must judge each page against the RIGHT one.
// goldShapeOK() encodes the q11133 Q&A-essay shape, which forbids numbered H2s — but a Top-10
// page (aq1158 gold) *requires* them. Judging "Top 10 Boats for the Pacific Coast 2027" by the
// Q&A shape rejected it at 13/13 forever, and would have done the same to every entry in the
// Top-10 pillars (ca/bt/co/es/tv/rs/cl/lv/ev/ga/gm…). Route by template, never by pillar guess.
let pickGoldTemplate = null, auditTop10 = null;
try { ({ pickGoldTemplate } = require('../_pulse_gold_template_router')); } catch (e) {}
try { ({ auditTop10GoldTemplate: auditTop10 } = require('../_ranking_top10_gold_template')); } catch (e) {}
let collapseToGold = null;
let ensureSingleMermaid = null;
try { ({ collapseToGoldStructure: collapseToGold, ensureSingleMermaidInHowToChoose: ensureSingleMermaid } = require('../_aq_top10_gold_fix_lib')); } catch (e) {}

function templateOf(id, body, question) {
  if (!pickGoldTemplate) return 'qa';
  try { return (pickGoldTemplate(id, body, question) || {}).template || 'qa'; } catch (e) { return 'qa'; }
}

// Image-related Top-10 issues are OUT OF SCOPE for the drip. Placing images on an entry is
// human-only (IMAGE_PLACEMENT_LAW.md), so a page missing a rank image can never be "fixed" here.
// Counting those as shape failures would make every Top-10 page MISS forever, on every lap.
// The drip judges TEXT compliance; the human's picks handle the rest.
const IMAGE_ISSUE = new RegExp([
  '_missing_img$', '_markdown_image$', '_duplicate_image$', '^unexpected_top_hero$',
  // The rank product line is the `img="…" name="…"` block the image-placement flow writes.
  // A text-only pass cannot author it, so these are not the drip's to fix either.
  '^rank\\d+_product_not_first_line$', '^rank\\d+_product_missing_name$', '^rank\\d+_product_missing_site$',
].join('|'));

// Codes the Top-10 gold reports that CONFLICT with another locked law. The cross-link law
// (feedback_cross_link_law) requires "## Related on PULSE" on every entry, while the Top-10 gold
// wants Sources last and flags anything after it. Both are locked, so the drip cannot satisfy
// both — it honours the cross-link law and treats this single code as advisory. Any OTHER
// "extra section after sources" is still a real failure and still blocks publication.
// ORDERING is advisory; MISSING is blocking. Measured over the first ~40 pages, 56% were held as
// MISS and almost every one was a Top-10 *section-order* complaint on a page already scoring 13/13
// on the real 13-point gate — "howToChoose should come before whatToLookFor", "rank 1 sits at
// index 2". collapseToGoldStructure cannot always resolve those, so the drip was refusing to
// publish good, complete, fully-imaged content over heading sequence. The publish bar is 12/13;
// ordering nits go to the worklist instead of blocking. Anything genuinely ABSENT — a missing
// How-to-Choose block, missing ranks, too few headings, no Direct Answer — still blocks.
const ADVISORY_ISSUE = new RegExp([
  '^extra_sections_after_sources_',      // conflicts with the cross-link law's Related on PULSE
  '^tail_out_of_order_',                 // section sequence, content all present
  '^rank_\\d+_out_of_order_at_index_',   // ranks present, order differs
].join('|'));

// Shape verdict for whichever gold applies. Returns {ok, why}.
function shapeVerdict(tpl, body, question) {
  if (tpl === 'top10') {
    if (!auditTop10) return { ok: true, why: 'top10 (no auditor available)' };
    let r = null;
    try { r = auditTop10(body, question); } catch (e) { return { ok: true, why: 'top10 (auditor threw)' }; }
    if (!r || r.applies === false) return { ok: true, why: 'top10 (gold not applicable)' };
    const textIssues = (r.issues || []).filter(i => !IMAGE_ISSUE.test(String(i)) && !ADVISORY_ISSUE.test(String(i)));
    if (!textIssues.length) return { ok: true, why: 'top10 gold ok (text)' };
    return { ok: false, why: 'top10 gold: ' + textIssues.slice(0, 3).map(s => String(s).slice(0, 60)).join(', ') };
  }
  if (tpl === 'style') return { ok: true, why: 'style gold (sy) — shape not enforced here' };
  return { ok: goldShapeOK(body), why: goldShapeOK(body) ? 'q11133 shape ok' : 'q11133 shape broken' };
}

function audit(body, question, id) {
  const g = gateScore({ body, question });
  const score = g.score || 0;
  const words = wordCount(body);
  const tpl = templateOf(id || '', body, question);
  const sv = shapeVerdict(tpl, body, question);
  const fails = (g.fails || []).map(f => (typeof f === 'string' ? f : (f && (f.label || f.name || f.id)) || '?'));
  const base = { score, shape: sv.ok, words, fails, tpl };
  if (score < GATE_MIN)  return Object.assign({ ok: false, verdict: 'BELOW BAR ' + score + '/13 [' + tpl + '] — ' + fails.slice(0, 4).join(', ') }, base);
  if (!sv.ok)            return Object.assign({ ok: false, verdict: 'REJECTED ' + score + '/13 [' + tpl + '] — ' + sv.why }, base);
  if (words < MIN_WORDS) return Object.assign({ ok: false, verdict: 'REJECTED ' + score + '/13 [' + tpl + '] — only ' + words + ' words (floor ' + MIN_WORDS + ')' }, base);
  // Over-length is FLAGGED, not blocked. Holding an otherwise-good page hostage until a writer can
  // condense it would strand thousands of pages behind the CC budget; the improve pass trims them
  // as budget allows, and the writer prompt now caps new work at 3,000.
  const longNote = words > MAX_WORDS ? ' ⚠ over ' + MAX_WORDS + 'w — queued to condense' : '';
  return Object.assign({ ok: true, overLong: words > MAX_WORDS,
    verdict: 'PASS ' + score + '/13 [' + tpl + '] · ' + sv.why + ' · ' + words + 'w' + longNote }, base);
}

// ── 🧭 SUPERVISOR ──────────────────────────────────────────────────────────────────────────
// Owns the ladder. CC-dominant, DS brought in only once CC has failed to reach the bar.
//   rung 0        surgical $0 (no model call)
//   rung 1..CC    Claude Code — primary writer, escalating (stuck/broaden after the first miss)
//   rung ..DS     DeepSeek — reinforcement, only after CC could not reach 12/13
// ⭐ PREMIUM LADDER — the same shape the crews got (owner 2026-07-28: "broaden scope plus bring in cc cursor ds
// etc to push to 12/13" · "make same change to drip"). Free rungs first, then every writer in turn, broadening
// scope as it climbs, so a page one model can't shape gets a genuinely different attempt instead of the same one
// again. Cheap-to-expensive ordering is unchanged — the $0 rungs still clear most pages before any spend.
//
// What changed: DeepSeek rungs used to be compiled out entirely (DRIP_DS_TRIES defaulted to 0, "CC-only by owner
// instruction"), so when CC hit its hourly cap the ladder simply ended and the page was recorded as a miss with
// writers still available. Cursor was never in the drip's ladder at all. Both are in now, and CC gets a final
// pass after them. Unavailable writers are skipped, not attempted — Cursor only when CURSOR_API_KEY exists.
//
// Dial any leg back with DRIP_CC_TRIES / DRIP_DS_TRIES / DRIP_CURSOR_TRIES=0.
function ladder() {
  const rungs = [
    { role: 'top10fix', engine: null, label: 'top10 gold ($0)' },  // Top-10 pages only
    { role: 'shape', engine: null, label: 'shape ($0)' },          // Q&A pages only, moves text
    { role: 'surgical', engine: null, tries: 1, label: 'surgical ($0)' },
    { role: 'ccshape', engine: 'claude', label: 'CC shape' },      // CC rewrites just the Direct Answer
  ];
  for (let i = 0; i < CC_TRIES; i++) rungs.push({ role: 'writer', engine: 'claude', stuck: i > 0, label: 'CC#' + (i + 1) });
  // DeepSeek — broadened rescue after CC. $0-adjacent (own key, no Max-plan spend) so it also carries the page
  // whenever the CC economy governor has closed the budget for the hour.
  for (let i = 0; i < DS_TRIES; i++) rungs.push({ role: 'rescue', engine: 'deepseek', stuck: true, label: 'DS#' + (i + 1) });
  if (DS_TRIES > 0) rungs.push({ role: 'ccshape', engine: 'deepseek', label: 'DS shape' });
  // Cursor — a third, genuinely different model. Skipped wholesale when the key is absent rather than burning
  // rungs on a writer that cannot run (that silent no-op is what wasted half the crews' rescue ladder).
  if (CURSOR_OK) for (let i = 0; i < CURSOR_TRIES; i++) rungs.push({ role: 'rescue', engine: 'cursor', stuck: true, label: 'Cursor#' + (i + 1) });
  // last word back to CC, now that the page has been through every other writer + broadened scope
  if ((DS_TRIES > 0 || CURSOR_OK) && CC_FINAL > 0) for (let i = 0; i < CC_FINAL; i++) rungs.push({ role: 'writer', engine: 'claude', stuck: true, label: 'CC final#' + (i + 1) });
  return rungs;
}

// ── ✍️ WRITER + the per-page run ───────────────────────────────────────────────────────────
// Incremented every time the manager moves on. A page abandoned by the watchdog keeps executing —
// Promise.race does not cancel the loser — so tr9 was still placing images while tr18 had already
// started. Each page captures the token and stops at the next checkpoint once it is superseded.
let RUN_TOKEN = 0;

async function processOne(id, opts) {
  opts = opts || {};
  const DRY = !!opts.dryRun;   // prove harness: run the REAL ladder, publish nothing
  const myToken = ++RUN_TOKEN;
  const superseded = () => RUN_TOKEN !== myToken;
  const store = theStore();
  let blob = null;
  try { blob = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' }); } catch (e) {}
  if (!blob) { STATE.errors++; log(id + ' — no blob, skip'); return null; }

  const question = blob.question || blob.h1 || '';
  const body0 = blob.answer || blob.body || '';
  const before = (gateScore({ body: body0, question }).score) || 0;
  // 🛡 BLOB HAS THE FINAL SAY (owner 2026-07-29). The queue filter reads the INDEX, and st827 slipped through
  // because it has no index row at all — its blob was pending with 0 words, so the drip started placing images
  // on an empty page. Index rows lag, get clobbered, or never land; the blob is the truth. Anything unwritten
  // is dropped here regardless of what the index claimed.
  if (IMAGES_ONLY) {
    const w = String(body0 || '').split(/\s+/).filter(Boolean).length;
    if (blob.pending === true || w < 200) {
      log(id + ' ⏭ skip — unwritten page (' + w + ' words' + (blob.pending ? ', pending' : '') + '), no images for an empty page');
      return null;
    }
  }
  CUR_Q = question; CUR_BEFORE = before; CUR_SINCE = Date.now(); setStage('scoring');

  // Cheap skip: already at the bar AND clean against ITS OWN gold template → one local score,
  // no model call. Uses the template-aware auditor, not goldShapeOK: judging a Top-10 page by
  // the Q&A shape rule made every ranking page look broken and denied it the cheap skip.
  const a0 = audit(body0, question, id);

  // 🖼 image audit runs on EVERY page, including the ones needing no text work — a page can be
  // 13/13 on prose and still be missing its face card. Verification only; nothing is placed.
  // 🧹 Purge dead slot blobs on EVERY page, not just ones we place into. embedImages re-derives the
  // body's images from whatever sits in qa-bin at publish time, so a broken legacy blob on a page
  // the drip only rewrites text for would still come back. Runs before the audit so the counts are
  // measured against what will actually be embedded.
  await purgeStaleSlots(id);
  // 🦸 Hero FIRST, then audit. The audit was running before the hero was written, so it reported
  // "no face/hero image" describing the state a second earlier — and that stale reading is what
  // generated the "needs your pick" emails on pages the drip had just given a hero.
  if (HERO_ON && !DRY && APPLY_ON) {
    const topRank0 = (a0.tpl === 'top10' ? (rankTitles(body0)[0] || '') : '');
    await writeHero(id, question, topRank0 || question);
    await sleep(1200);                     // let the write settle before we measure it
  }
  const img = await auditImages(id, body0, a0.tpl);

  // 🦸 HERO CARD — OFF (owner 2026-07-28: "remove hero card"). The drip no longer overwrites the
  // face/hero image. Existing heroes are left exactly as they are; nothing is deleted. Body images
  // are unaffected. Re-enable with DRIP_HERO=1 — writeHero() is kept intact for that.
  // (the hero is written ABOVE, before the audit, so img.face already reflects it)
  if (HERO_DELETE && !HERO_ON && !DRY && APPLY_ON) {
    if (await deleteHero(id)) { img.face = false; img.heroDeleted = true; }
  }
  // 🖼 UNCONDITIONAL REBUILD (owner: "create all new images on fixes regardless of if you're
  // fixing or not"). Not gated on the audit finding a fault — the audit still runs because its
  // paragraph count decides HOW MANY images the page should carry. applyImages wipes the existing
  // set first, so what lands is entirely new, context-matched, validated and mirror-checked.
  {
    if (img.issues.length) { recordImageWork(img); STATE.imageFlagged++; log(id + ' 🖼 AUDIT — ' + img.issues.join('; ')); }
    if (CANDIDATES_ON && !DRY && APPLY_ON) {
      const need = (img.target || MIN_BODY_IMGS) + 4;   // spare candidates for rejects + mirrors
      const found = await candidateImages(id, question, need);
      if (found.ok) {
        queueCandidates(id, question, need, found);
        img.candidates = found.candidates.length;
        // 4444-authorized apply. Rate-locked, DOM-verified, circuit-broken.
        const ap = await applyImages(id, img, found.candidates, { superseded });
        img.placed = ap.placed;
        img.placedSlots = ap.slots;
      }
      else log(id + ' 🎯 no candidates — ' + found.err);
    }
  }

  // 🔁 EVERY URL GETS AN ATTEMPT (owner 2026-07-28: "run every single URL to attempt to fix or
  // improve"). Passing the gate no longer means "skip" — a 12/13 page is publishable but not
  // finished, and the free rungs can often carry it to 13/13 for nothing.
  //
  // IMPROVE mode is the difference between fixing what is broken and polishing what already works:
  //   • BROKEN (below bar)  → the whole ladder, CC included.
  //   • IMPROVE (at bar, <13) → the $0 rungs always; CC only while the weekly budget has real slack
  //     (<60% used and on pace), so polishing can never eat the allowance that fixing needs.
  //   • PERFECT (13/13, clean, images fine) → nothing left to gain, recorded and moved on.
  const improving = a0.ok;
  // An over-length page is never "perfect" — it still needs condensing to the 2k-3k window.
  const perfect = a0.ok && a0.score >= 13 && !a0.overLong;
  // 🖼 IMAGES-ONLY NEVER TAKES THIS EXIT (owner 2026-07-29: "the drip is not doing images when it's already
  // 13/13 — I need it to do images, the new images might be better"). "Perfect" only ever meant the TEXT is
  // perfect. In images-only mode the text is irrelevant — a 13/13 page can still be carrying wrong or white
  // images, and those are exactly the pages worth re-imaging. Skipping them here meant the best pages in the
  // library were the only ones the image pass never touched.
  if (perfect && !IMAGES_ONLY) {
    STATE.alreadyOk++;
    log(id + ' ✓ 13/13 [' + a0.tpl + '] — nothing to improve ($0)');
    return { id, question, before, score: a0.score, engine: 'none (already 13/13)', audit: a0.verdict, attempts: 0, skipped: true, img, url: entryUrl(id) };
  }
  if (improving) {
    const b = ccBudget();
    IMPROVE_CC_OK = b.ok && b.week < Math.floor(CC_PER_WEEK * 0.6);
    log(id + ' ⤴ improve pass — ' + a0.score + '/13 [' + a0.tpl + '] is publishable, trying for 13'
      + (IMPROVE_CC_OK ? ' (CC allowed, budget has slack)' : ' ($0 rungs only, protecting the budget)'));
  } else {
    IMPROVE_CC_OK = true;
  }

  let bestBody = body0, bestScore = before, bestEngine = '', attempts = 0, lastVerdict = '';
  // 🖼 IMAGES-ONLY HARD STOP (owner: "make sure the drip doesn't try to rewrite any of it, just images").
  // The image work above this line has already run. Returning here means the writer ladder never executes,
  // no model is called for prose, and `publishContentBody` is never reached — bestBody stays identical to the
  // body we read, so there is nothing to write back even by accident.
  const rungs = IMAGES_ONLY ? [] : ladder();
  if (IMAGES_ONLY) {
    const rec = { id, question, before, score: before, engine: 'images-only', audit: 'image pass — text untouched',
                  attempts: 0, img, url: entryUrl(id), imagesOnly: true };
    log(id + ' 🖼 image pass done — text untouched (' + before + '/13 unchanged)');
    return rec;
  }

  for (const rung of rungs) {
    if (fs.existsSync(OFF_FLAG)) break;
    // watchdog already gave up on this page and the next one is running — stop doing work.
    if (superseded()) { log(id + ' ⏹ superseded by the next page, stopping here'); break; }
    // 💸 economy: skip Claude Code rungs once the hourly/daily bucket is spent. The $0 rungs and
    // the DeepSeek rungs still run, so the drip keeps working — just without Max-plan spend.
    if (rung.engine === 'claude') {
      // A polish pass on an already-publishable page must never spend CC that a broken page needs.
      if (!IMPROVE_CC_OK) { log(id + ' 💸 ' + rung.label + ' skipped — improve pass, budget reserved for broken pages'); continue; }
      const b = ccBudget();
      if (!b.ok) {
        log(id + ' 💸 ' + rung.label + ' skipped — ' + b.why
          + ' (' + b.hour + '/' + CC_PER_HOUR + ' hr · ' + b.day + '/' + CC_PER_DAY + ' day · '
          + b.week + '/' + CC_PER_WEEK + ' week, pace allows ' + b.allowedByNow + ') → DeepSeek/$0 continue');
        continue;
      }
    }
    setStage(rung.label || rung.role);

    if (rung.role === 'top10fix') {
      // 🥇 Top-10 gold structural repair ($0). collapseToGoldStructure re-orders the sections
      // into the aq1158 gold shape. Only for top10 pages — never touch a Q&A body with it.
      if (templateOf(id, bestBody, question) !== 'top10' || !collapseToGold) continue;
      let cand = null;
      try { cand = collapseToGold(bestBody, id, question); } catch (e) { continue; }
      if (!cand || cand === bestBody) continue;
      // The restructure rebuilds the section order and can drop the mermaid / Related block on
      // the way through (it took bt0172 from 12 to 11/13). Run the mechanical gate fixer over the
      // result immediately — restructure and repair are one step, not two competing candidates.
      try { const sx = surgicalGateFix(cand, question); if (sx && sx.fixed && sx.fixed.length) cand = sx.body; } catch (e) {}
      // surgicalGateFix enforces the Q&A rule of exactly 2 mermaids; the Top-10 gold wants exactly
      // ONE, inside "How to Choose". Re-normalise so the two machines stop undoing each other.
      if (ensureSingleMermaid) { try { cand = ensureSingleMermaid(cand, id); } catch (e) {} }
      cand = stripWriterImages(cand);
      const a = audit(cand, question, id);
      lastVerdict = a.verdict;
      log(id + ' 🥇 top10 gold restructure → ' + a.verdict);
      if (a.ok || a.score >= bestScore) { bestBody = cand; bestScore = a.score; bestEngine = 'top10 gold ($0)'; }
      if (a.ok) { STATE.surgicalWins++; break; }
      continue;
    }

    if (rung.role === 'shape') {
      // 🔧 $0 shape repair — the only path that can fix a shape-only defect, because
      // rebuildToGate refuses to call a writer once the gate score is already at target.
      // Q&A ONLY: the 40-80 word Direct Answer cap is a q11133 rule. Running it on a Top-10
      // body shuffled text into "How We Ranked" and broke the rank ordering.
      if (templateOf(id, bestBody, question) === 'top10') continue;
      let sf = null;
      try { sf = shapeFix(bestBody); } catch (e) { continue; }
      if (!sf || !sf.fixed.length) continue;
      // Strip here too. This rung reshapes the ORIGINAL body, which may carry legacy image
      // markdown; without the strip that markdown reached the pre-publish assertion and the
      // page failed with "still carries image markdown" after a successful $0 repair.
      const sfBody = stripWriterImages(sf.body);
      const a = audit(sfBody, question, id);
      lastVerdict = a.verdict;
      log(id + ' 🔧 shape: ' + sf.fixed.join('; ') + ' → ' + a.verdict);
      // shape repair changes no gate points, so accept it whenever it does not lose score
      if (a.ok || a.score >= bestScore) { bestBody = sfBody; bestScore = a.score; bestEngine = 'shape fix ($0)'; }
      if (a.ok) { STATE.surgicalWins++; break; }
      continue;
    }

    if (rung.role === 'ccshape') {
      // Only worth a model call when SHAPE is the sole thing standing between us and the bar.
      const a0 = audit(bestBody, question, id);
      if (a0.ok || a0.score < GATE_MIN || a0.words < MIN_WORDS) continue;
      attempts++;
      let out = null;
      if (rung.engine === 'claude') ccSpend();
      try { out = ccShapeRewrite(bestBody, question, rung.engine); } catch (e) {}
      if (!out) { log(id + ' ' + rung.label + ' no usable paragraph'); continue; }
      const cand = stripWriterImages(out.body);
      const a = audit(cand, question, id);
      lastVerdict = a.verdict;
      log(id + ' ' + rung.label + ' → DA ' + out.words + 'w · ' + a.verdict);
      if (a.ok || a.score >= bestScore) { bestBody = cand; bestScore = a.score; bestEngine = rung.label; }
      if (a.ok) { if (rung.engine === 'deepseek') STATE.dsRescues++; else STATE.ccWins++; break; }
      continue;
    }

    if (rung.role === 'surgical') {
      // rung 0 — mechanical, $0, no model. Clears most 11 → 12.
      let sx = null;
      try { sx = surgicalGateFix(bestBody, question); } catch (e) { continue; }
      if (!sx || !sx.fixed || !sx.fixed.length) continue;
      const sxBody = stripWriterImages(sx.body);   // (surgical rung — already stripped)
      const a = audit(sxBody, question, id);
      lastVerdict = a.verdict;
      if (a.ok || a.score > bestScore) { bestBody = sxBody; bestScore = a.score; bestEngine = 'surgical ($0)'; }
      if (a.ok) { STATE.surgicalWins++; log(id + ' 🔧 surgical → ' + a.score + '/13 ($0)'); break; }
      continue;
    }

    // rung 1+ — a real writer call. WRITER_ENGINE pins the engine for this attempt so the
    // supervisor, not the router's own fallback order, decides who writes.
    attempts++;
    if (rung.engine === 'claude') ccSpend();
    const prevEngine = process.env.WRITER_ENGINE;
    process.env.WRITER_ENGINE = rung.engine;
    let r = null;
    try {
      r = rebuildToGate(question, bestBody, {
        id, targetScore: GATE_MIN, maxAttempts: 1,
        stuck: rung.stuck, broaden: rung.stuck,
        // 🥇 write to THIS page's golden template — aq1158 for rankings, q11133 for essays.
        template: templateOf(id, bestBody, question),
      });
    } catch (e) {
      log(id + ' ' + rung.label + ' threw — ' + ((e && e.message) || e));
    } finally {
      if (prevEngine == null) delete process.env.WRITER_ENGINE; else process.env.WRITER_ENGINE = prevEngine;
    }
    if (!r || !r.ok || !r.body) { log(id + ' ' + rung.label + ' no usable body' + (r && r.err ? ' — ' + r.err : '')); continue; }

    // 🖼 strip before scoring — a body is only ever judged and published in its text-only form.
    const nImg = imageCount(r.body);
    let clean = stripWriterImages(r.body);
    // 🥇 Top-10 gold wants exactly ONE mermaid, inside "How to Choose"; the Q&A surgical pass adds
    // TWO. That collision showed up as 3 measured misses (how_to_choose_missing_mermaid +
    // mermaid_count_2_expected_1) on pages that were otherwise complete. Re-normalise after the
    // writer, not just after the restructure rung.
    if (ensureSingleMermaid && templateOf(id, clean, question) === 'top10') {
      try { clean = ensureSingleMermaid(clean, id); } catch (e) {}
    }
    if (nImg) log(id + ' 🖼 stripped ' + nImg + ' image ref(s) from ' + rung.label + ' output (text-only drip)');

    const a = audit(clean, question, id);
    lastVerdict = a.verdict;
    if (a.ok || a.score > bestScore) { bestBody = clean; bestScore = a.score; bestEngine = rung.label; }
    log(id + ' ' + rung.label + ' → ' + a.verdict);
    if (a.ok) {
      if (rung.role === 'rescue') { STATE.dsRescues++; log(id + ' 🆘 DS rescued after CC could not reach ' + GATE_MIN); }
      else STATE.ccWins++;
      break;
    }
  }

  // 🧭 SUPERVISOR final ruling — publish only at/above the bar with a clean audit.
  const finalAudit = audit(bestBody, question, id);
  const rec = {
    id, question, before, score: finalAudit.score,
    engine: bestEngine || 'none', audit: finalAudit.verdict || lastVerdict || 'n/a',
    attempts, img, url: entryUrl(id),
  };

  if (finalAudit.ok && bestBody !== body0) {
    try {
      setStage('publishing');
      // 🖼 hard assertion: nothing with an image reference is ever handed to the publisher.
      if (imageCount(bestBody)) throw new Error('refused — body still carries image markdown after strip');

      // 🖼 IMAGES MUST RENDER FIRST (owner 2026-07-28: "make sure images render in before
      // publishing"). publishContentBody rewrites blob.answer and re-embeds the body images from
      // the live qa-bin listing — so if a slot was written but is not yet SERVING, the page goes
      // out referencing an image the reader gets a 404 (or the logo fallback) for. CDN propagation
      // takes a few seconds after a write, so poll rather than assume, and hold the publish if it
      // never appears. Text-only pages with no images placed skip this entirely.
      if (!DRY && img && (img.placed || img.bodyCount)) {
        // Check the slots that ACTUALLY exist, never a 1..N range. A page can legitimately hold
        // b1,b3,b4 (a dead candidate leaves no slot), and assuming contiguity would hold a page
        // whose images are all perfectly fine.
        const slots = [];
        for (let i = 1; i <= (img.bodyCount || 0); i++) slots.push(i);        // pre-existing
        for (const s of (img.placedSlots || [])) if (!slots.includes(s)) slots.push(s);   // just placed
        slots.sort((a, b) => a - b);
        // Owner: "do not publish before confirming every image rendered and is valid and visible."
        // Each URL must return 200, an image/* content-type (a logo-SVG fallback is a FAILURE, not
        // an image), and real bytes. The face card is checked alongside the body slots — a broken
        // hero is just as visible as a broken figure.
        const urls = slots.map(s => ({ what: 'b' + s, url: LIVE + '/assets/qa/' + id + '-b' + s + '.jpg' }));
        if (img.face) urls.push({ what: 'face', url: LIVE + '/assets/qa/' + id + '.jpg' });
        let renderOk = urls.length === 0;
        for (let attempt = 1; attempt <= 4 && !renderOk; attempt++) {
          const res = await Promise.all(urls.map(u => liveImage(u.url)));
          const bad = res.map((r, i) => ({ r, u: urls[i] })).filter(x => !x.r.ok);
          if (!bad.length) { renderOk = true; break; }
          log(id + ' 🖼 ' + bad.length + '/' + res.length + ' image(s) not valid yet ['
            + bad.map(x => x.u.what + ':' + (x.r.isSvg ? 'svg-fallback' : 'HTTP ' + x.r.status)).join(', ')
            + '] — waiting (' + attempt + '/4)');
          await sleep(4000 * attempt);
        }
        if (!renderOk) {
          // Do NOT publish a page whose images do not resolve. Leave it for the next lap; the text
          // work already done is kept in the auditor's record and simply re-run.
          rec.audit = 'HELD — images not rendering, publish deferred to the next lap';
          log(id + ' ⏸ HELD — images still not rendering, not publishing this lap');
          STATE.missed++;
          return rec;
        }
        log(id + ' 🖼 all placed images render ✓ — safe to publish');
      }

      if (DRY) { log(id + ' 🧪 DRY RUN — would publish ' + finalAudit.score + '/13'); }
      // The blob connection is flaky: publishContentBody re-reads the entry and a transient empty
      // read surfaces as "entry not found in blob", throwing away a rewrite that already passed the
      // auditor (lost ra0056's 13/13 after a full CC write). Retry like the crews do.
      else await retryNet(() => publishContentBody(id, bestBody));
      STATE.fixed++; STATE.totalFixed++;
      log(id + (DRY ? ' 🧪 (dry run, nothing written) ' : ' 🏁 PUBLISHED ') + before + ' → ' + finalAudit.score + '/13 · ' + rec.engine);
    } catch (e) {
      STATE.errors++;
      rec.audit = 'publish failed — ' + ((e && e.message) || e);
      log(id + ' ⛔ publish failed — ' + ((e && e.message) || e));
    }
  } else if (finalAudit.ok) {
    STATE.alreadyOk++;   // nothing changed but it audits clean
  } else {
    STATE.missed++;
    log(id + ' 📉 MISS — best ' + finalAudit.score + '/13 after ' + attempts + ' writer attempt(s) · ' + finalAudit.verdict);
  }
  return rec;
}

// ── 📋 MANAGER: the forever loop ───────────────────────────────────────────────────────────
let RUNNING = false, STOPPED = false, CURRENT = '';
// 👁 REAL-TIME (owner: "make sure i can see real time what its working on") — the current page,
// its question, which rung is running right now, and a rolling feed of the last finished URLs.
let CUR_Q = '', CUR_STAGE = '', CUR_SINCE = 0, CUR_BEFORE = null;
const FEED = [];                     // newest first, capped
function setStage(s) { CUR_STAGE = s; }
function feedPush(rec) {
  FEED.unshift({ id: rec.id, q: String(rec.question || '').slice(0, 90), before: rec.before, score: rec.score,
                 engine: rec.engine, ok: rec.score >= GATE_MIN && !rec.skipped, skipped: !!rec.skipped, at: Date.now() });
  while (FEED.length > 40) FEED.pop();
}

// ── ➕ LIVE TOP-UP: pages the crews finish WHILE the drip is running ────────────────────────
// Owner 2026-07-29: "all the parts need to talk to each other — as I add more boats that are finished it needs
// to increase that number left to finish."
//
// The queue was built once at start and only rebuilt on a lap wrap, so a page a crew pushed to 12/13 five
// minutes ago sat invisible until the drip was restarted. The two machines were running blind to each other.
//
// This APPENDS newly-eligible ids rather than rebuilding: a rebuild would reorder the queue underneath the
// cursor, which silently skips or repeats pages. Appending keeps every position stable and simply makes the
// "left" number go up, which is exactly what the owner is watching for.
const TOPUP_MS = Math.max(60000, parseInt(process.env.DRIP_TOPUP_MS || '300000', 10));   // every 5 min
// hours a page may have been finished and still count as "recent" — shared by the queue build and the top-up
const RECENT_WINDOW_H = Math.max(0, parseInt(process.env.DRIP_RECENT_HOURS || '24', 10));
let lastTopUp = 0;
async function topUpQueue() {
  if (Date.now() - lastTopUp < TOPUP_MS) return 0;
  lastTopUp = Date.now();
  let idx = null;
  try { idx = await theStore().get('_index.json', { type: 'json', consistency: 'strong' }); } catch (e) {}
  if (!idx || !Array.isArray(idx.entries) || idx.entries.length < 1000) return 0;
  const FINISHED_MIN = Math.max(1, parseInt(process.env.DRIP_IMAGES_MIN_GATE || '12', 10));
  const have = new Set(QUEUE);
  const added = [];
  for (const e of idx.entries) {
    if (!e || !e.id || have.has(e.id)) continue;
    if (!inScope(e.id)) continue;
    if (IMAGES_ONLY && (e.pending === true || (e.gate_score || 0) < FINISHED_MIN)) continue;
    // same recency window as the initial queue build — without this the top-up would quietly pull the whole
    // 6,894-page archive back in over time and undo the "follow the crews" behaviour
    if (IMAGES_ONLY && RECENT_WINDOW_H && Math.max(e.polished_at || 0, e.ts || 0) < Date.now() - RECENT_WINDOW_H * 3600000) continue;
    added.push(e.id);
  }
  if (!added.length) return 0;
  // 🆕 PIPELINE Q&As GO FIRST within the jumped batch (owner 2026-07-29). Newly-finished pages all jump the
  // queue, but a brand-new pipeline question is the one that has never had a single image, so it outranks a
  // page that merely got rewritten. `pipeline_new` lives on the blob, not the index row, so this reads the
  // blobs for the added set only — normally a handful every 5 minutes, and capped so a large batch can never
  // turn the top-up into a long stall.
  if (added.length > 1) {
    const CAP = 40;
    const isPipeline = new Set();
    for (const id of added.slice(0, CAP)) {
      try {
        const b = await theStore().get('answers/' + id + '.json', { type: 'json' });
        if (b && b.pipeline_new) isPipeline.add(id);
      } catch (e) {}
    }
    if (isPipeline.size) {
      added.sort((a, b) => (isPipeline.has(b) ? 1 : 0) - (isPipeline.has(a) ? 1 : 0));
      log('🆕 ' + isPipeline.size + ' of them are new pipeline Q&As — those go first');
    }
  }
  // 🥇 JUMP THE QUEUE, don't append (owner 2026-07-29: "anytime the drip is running it prioritizes those with
  // the images after it's done with the multihub"). A page a crew just wrote is the one most likely to have no
  // images at all — appending put it behind ~6,700 others, so it would not get pictures for days. Splicing it
  // in right after the cursor means the drip images it within a page or two of the crew finishing it, which is
  // what makes the two machines feel connected rather than independent.
  QUEUE.splice(STATE.cursor + 1, 0, ...added);
  try { fs.writeFileSync(QUEUEF, JSON.stringify({ ts: Date.now(), min: GATE_MIN, pillars: PILLARS, total: QUEUE.length, ids: QUEUE })); } catch (e) {}
  log('🥇 ' + added.length + ' just-finished page(s) jumped the queue (next up) — ' + (QUEUE.length - STATE.cursor) + ' left to do');
  return added.length;
}

// ── 🔁 MISSED THE BAR → BACK OF ITS OWN PILLAR ─────────────────────────────────────────────
// Owner 2026-07-28: "when a url doesnt hit 12, put it back in inv in that same pillar to be run again at the
// back." Same rule the crews got. A page that ends below the bar is not dropped and not retried immediately —
// it is re-inserted behind the LAST page of its own pillar still ahead in the queue. The drip therefore spends
// its next hours on URLs it has never tried, and comes back to the stubborn one only once that pillar's fresh
// work is exhausted, instead of the page waiting a whole 36k-page lap.
function sendToBackOfPillar(id) {
  const p = pillarOf(id);
  // already queued ahead of us (an earlier miss, or the generator spliced it in) → leave it alone
  for (let i = STATE.cursor; i < QUEUE.length; i++) if (QUEUE[i] === id) return 0;
  let at = QUEUE.length;                       // default: the very end of the queue
  for (let i = QUEUE.length - 1; i >= STATE.cursor; i--) if (pillarOf(QUEUE[i]) === p) { at = i + 1; break; }
  QUEUE.splice(at, 0, id);
  try { fs.writeFileSync(QUEUEF, JSON.stringify({ ts: Date.now(), min: GATE_MIN, pillars: PILLARS, total: QUEUE.length, ids: QUEUE })); } catch (e) {}
  return at - STATE.cursor;                    // how many URLs it now sits behind
}

// ── 🆕 EVERY 20 URLS → ONE BRAND-NEW Q&A ───────────────────────────────────────────────────
// Owner 2026-07-28: "after finishing 20 urls create one new q and a — make sure not a dupe and
// base the q and a on the obvious new q and a of what's next from that pillar."
//
// The drip's job is repairing what already exists; this makes it GROW the library as it walks.
// After every GEN_EVERY finished URLs it hands the pillar of the page it just finished to
// `_pipeline_gen.js` and asks for exactly ONE question — the obvious next one a reader who just
// finished that page would ask.
//
// LAWS: the generator is DeepSeek-only text (never Anthropic), writes blobs only, never deploys
// and never touches an image. Dupe-proofing is NOT re-implemented here — the generator already
// runs the near-duplicate gate (cosine + shared-token) and topic fence against every existing
// question in the pillar, the same gate hub-generated questions pass. DRIP_GEN_EVERY=0 = off.
const GEN_EVERY   = Math.max(0, parseInt(process.env.DRIP_GEN_EVERY || '20', 10));
const GEN_SCRIPT  = path.join(WD, '_pipeline_gen.js');
const GEN_TIMEOUT = Math.max(30000, parseInt(process.env.DRIP_GEN_TIMEOUT_MS || '300000', 10));
let GEN_RUNNING = false;

// What "what's next" means, in the generator's own notes channel: the follow-on question, not a
// restatement. The recent finished questions in the pillar go in as context so the model can see
// where the pillar already is and step forward from there rather than sideways.
function nextQuestionNotes(pillar, question, recent) {
  const seen = recent.filter(Boolean).slice(0, 6).map(q => '  - ' + q).join('\n');
  return [
    'Write the ONE OBVIOUS NEXT question for this pillar.',
    '',
    'The page just finished was:',
    '  "' + String(question || '').slice(0, 200) + '"',
    seen ? ('\nOther questions recently finished in this pillar:\n' + seen) : '',
    '',
    'The new question must be the natural NEXT STEP a reader asks after reading that page — the',
    'follow-on decision, the next stage of the same job, or the obvious "ok, now what?" — while',
    'staying squarely inside this pillar\'s subject. It must be a genuinely NEW question, not a',
    'rewording, a narrower slice, or a synonym of anything that already exists.',
  ].filter(Boolean).join('\n');
}

// Runs the generator for a single question and returns the new ids it seeded (usually one).
function runGenerator(pillar, notes) {
  return new Promise(resolve => {
    let out = '';
    let child;
    try {
      child = require('child_process').spawn(process.execPath, [GEN_SCRIPT], {
        cwd: WD, windowsHide: true,
        env: Object.assign({}, process.env, { GEN_PILLAR: pillar, GEN_COUNT: '1', GEN_NOTES: notes }),
      });
    } catch (e) { return resolve({ ids: [], err: String((e && e.message) || e) }); }
    const kill = setTimeout(() => { try { child.kill(); } catch (e) {} }, GEN_TIMEOUT);
    const grab = d => { out += String(d); };
    child.stdout.on('data', grab); child.stderr.on('data', grab);
    child.on('error', e => { clearTimeout(kill); resolve({ ids: [], err: String((e && e.message) || e) }); });
    child.on('exit', () => {
      clearTimeout(kill);
      // keep the generator's own diagnostics where every other run writes them
      try { fs.appendFileSync(path.join(WD, '_pipeline_gen.detail.log'), out); } catch (e) {}
      const ids = [], qs = [];
      for (const l of out.split(/\r?\n/)) {
        const m = l.match(/^SEEDED\s+([a-z]+\d+)\s+::\s*(.*)$/);
        if (m) { ids.push(m[1]); qs.push(m[2]); }
      }
      const rej = (out.match(/near-dup rejects (\d+)/) || [, '0'])[1];
      resolve({ ids, qs, rejects: parseInt(rej, 10) || 0, err: ids.length ? '' : 'no unique question accepted' });
    });
  });
}

async function generateNextQuestion(pillar, question) {
  if (GEN_RUNNING || !pillar) return;
  GEN_RUNNING = true;
  try {
    const recent = FEED.filter(f => pillarOf(f.id) === pillar && f.q && f.q !== question).map(f => f.q);
    log('🆕 ' + GEN_EVERY + ' urls done → generating the next ' + pillar + ' question (dupe-gated)');
    const r = await runGenerator(pillar, nextQuestionNotes(pillar, question, recent));
    if (!r.ids.length) { log('🆕 no new ' + pillar + ' question this round — ' + (r.err || 'generator returned nothing')); return; }
    // 🎯 Work it NOW, not a lap from now. Splicing the fresh id in right behind the cursor means the
    // drip writes the brand-new question within the next few pages; left to the queue rebuild it would
    // sit unwritten for a full 36k-page lap.
    QUEUE.splice(STATE.cursor, 0, ...r.ids);
    try { fs.writeFileSync(QUEUEF, JSON.stringify({ ts: Date.now(), min: GATE_MIN, pillars: PILLARS, total: QUEUE.length, ids: QUEUE })); } catch (e) {}
    log('🆕 NEW ' + pillar.toUpperCase() + ' Q&A seeded: ' + r.ids.join(',') + ' :: ' + (r.qs[0] || '')
      + (r.rejects ? ' (' + r.rejects + ' near-dupe(s) rejected)' : '') + ' — queued next, the drip writes it');
    STATE.generated = (STATE.generated || 0) + r.ids.length;
    saveState();
  } catch (e) {
    log('🆕 generate err ' + ((e && e.message) || e));
  } finally { GEN_RUNNING = false; }
}

async function loop() {
  if (RUNNING) return;
  RUNNING = true;
  try {
    if (fs.existsSync(OFF_FLAG)) {
      if (!STOPPED) { STOPPED = true; log('⏸  OFF flag present — drip idle (remove the flag or press ON in the hub)'); }
      RUNNING = false; return setTimeout(loop, 5000);
    }
    if (STOPPED) { STOPPED = false; log('▶️  drip resumed'); }

    if (!QUEUE.length) { await refreshQueue(); if (!QUEUE.length) { RUNNING = false; return setTimeout(loop, 15000); } }

    // ➕ Pull in anything the crews finished since we started, BEFORE deciding the pillar is done. Running the
    // top-up after the completion check meant the drip would stop at the page count it booted with, even when
    // crews had pushed more pages to 12/13 in the meantime — the two machines never saw each other.
    try { await topUpQueue(); } catch (e) {}

    // 🛑 PILLAR FINISHED → STOP (owner 2026-07-28: "when a pillar ends, just stop the drip").
    // Only when the run is scoped to a pillar; a whole-library run still wraps and continues.
    if (PILLARS.length && STATE.cursor >= QUEUE.length) {
      log('🏁 pillar ' + PILLARS.join(',') + ' COMPLETE — ' + STATE.fixed + ' fixed · '
        + STATE.alreadyOk + ' already ok · ' + STATE.missed + ' short. Stopping (pick the next pillar in the hub).');
      try { fs.writeFileSync(OFF_FLAG, 'pillar complete ' + new Date().toISOString()); } catch (e) {}
      try { await emailDigest(); } catch (e) {}
      RUNNING = false;
      return setTimeout(loop, 5000);
    }

    // 🔁 wrap-around: end of the library → new lap, straight back to the start. Forever.
    if (STATE.cursor >= QUEUE.length) {
      log('🔁 LAP ' + STATE.lap + ' COMPLETE — ' + STATE.fixed + ' fixed · ' + STATE.alreadyOk + ' already ok · ' + STATE.missed + ' short. Starting over.');
      STATE.lap++; STATE.cursor = 0;
      STATE.fixed = 0; STATE.alreadyOk = 0; STATE.missed = 0; STATE.errors = 0;
      saveState();
      await refreshQueue();
    }

    const id = QUEUE[STATE.cursor];
    CURRENT = id;
    // ⏱ WATCHDOG — one page can never stall the run. Everything inside processOne is individually
    // bounded (fetch timeouts, spawn timeouts, capped retries), but a single unbounded await
    // anywhere would freeze the drip forever with no error and no next page. If a page overruns,
    // abandon it, log it, and advance — it comes back around on the next lap.
    const rec = await Promise.race([
      processOne(id),
      sleep(PAGE_TIMEOUT_MS).then(() => {
        log(id + ' ⏱ WATCHDOG — page exceeded ' + Math.round(PAGE_TIMEOUT_MS / 60000) + ' min, abandoning and moving to the next URL');
        STATE.errors++;
        return null;
      }),
    ]);
    setStage('idle'); CURRENT = '';
    STATE.cursor++; STATE.totalSeen++;
    // 🔁 below the bar → back of its own pillar (a skipped page was already at the bar, so it never applies)
    if (rec && !rec.skipped && (rec.score || 0) < GATE_MIN) {
      const behind = sendToBackOfPillar(rec.id);
      if (behind > 0) log(rec.id + ' 🔁 missed ' + rec.score + '/' + 13 + ' — back of ' + pillarOf(rec.id) + ', behind ' + behind.toLocaleString() + ' url(s)');
    }
    if (rec) {
      STATE.lastId = rec.id; STATE.lastScore = rec.score; STATE.lastEngine = rec.engine; STATE.lastAt = Date.now();
      feedPush(rec);
      appendFeed(rec);            // local record, independent of email delivery
      // 📧 one email per finished URL. Worked pages always email; already-at-bar skips email only
      // in DRIP_EMAIL_MODE=all, otherwise they roll up into a digest every SKIP_DIGEST_EVERY pages.
      if (!rec.skipped || EMAIL_MODE === 'all') {
        await emailResult(rec);
      } else if (SKIP_DIGEST_EVERY > 0 && STATE.alreadyOk > 0 && STATE.alreadyOk % SKIP_DIGEST_EVERY === 0) {
        await emailDigest();
      }
      // 🆕 every GEN_EVERY finished urls → one brand-new Q&A for the pillar we are standing in.
      // Counted on FINISHED urls (a watchdog-abandoned page returns no rec and does not count).
      if (GEN_EVERY) {
        STATE.sinceGen = (STATE.sinceGen || 0) + 1;
        if (STATE.sinceGen >= GEN_EVERY) {
          STATE.sinceGen = 0; saveState();
          await generateNextQuestion(pillarOf(rec.id), rec.question);
        }
      }
    }
    CURRENT = '';
    saveState();
  } catch (e) {
    log('loop err ' + ((e && e.stack) || e));
    STATE.errors++;
  }
  RUNNING = false;
  setTimeout(loop, PACE_MS);
}

// Exported so `_drip_prove.js` exercises the SAME ladder the daemon runs — a copied test
// harness drifts from the daemon and then proves the wrong thing.
module.exports = { writeHero, auditImages, emailResult, emailDigest, templateOf, shapeFix, ccShapeRewrite, audit, ladder, stripWriterImages, imageCount, processOne, wordCount };
if (require.main !== module) return;

// ── status server (hub reads this) ─────────────────────────────────────────────────────────
http.createServer((req, res) => {
  const left = Math.max(0, QUEUE.length - STATE.cursor);
  if (req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      on: !fs.existsSync(OFF_FLAG), current: CURRENT, port: PORT, pace: PACE_MS,
      // 👁 real time
      currentQ: CUR_Q, stage: CUR_STAGE, since: CUR_SINCE, currentBefore: CUR_BEFORE, feed: FEED,
      pillars: PILLARS, minWords: MIN_WORDS, ccBudget: ccBudget(), ccPerHour: CC_PER_HOUR, ccPerDay: CC_PER_DAY,
      gateMin: GATE_MIN, ccTries: CC_TRIES, dsTries: DS_TRIES,
      total: QUEUE.length, done: STATE.cursor, left,
      lap: STATE.lap, fixed: STATE.fixed, alreadyOk: STATE.alreadyOk, missed: STATE.missed, errors: STATE.errors,
      ccWins: STATE.ccWins, dsRescues: STATE.dsRescues, surgicalWins: STATE.surgicalWins,
      imageFlagged: STATE.imageFlagged, imagesPlaced: STATE.imagesPlaced,
      totalFixed: STATE.totalFixed, totalSeen: STATE.totalSeen,
      // 🆕 new-question generator: how many urls until the next one, and how many it has seeded
      genEvery: GEN_EVERY, sinceGen: STATE.sinceGen || 0, generated: STATE.generated || 0,
      lastId: STATE.lastId, lastScore: STATE.lastScore, lastEngine: STATE.lastEngine, lastAt: STATE.lastAt,
      // 🖼 images-only mode — reported live so the page can show a real toggle instead of a hidden file
      imagesOnly: IMAGES_ONLY_ACTIVE(),
      ts: Date.now(),
    }));
  }
  // 🖼 TOGGLE images-only from the page (owner 2026-07-29: "is it a flag like a toggle? I don't see anything").
  // It was a file on disk, which is invisible from the UI and therefore useless as a control. This flips the
  // same file so the button and the daemon can never disagree. Takes effect on the next queue refresh.
  if (req.url === '/api/imagesonly') {
    const want = !IMAGES_ONLY_ACTIVE();
    try {
      // images-only is the DEFAULT now, so the toggle works by creating/removing the TEXT-mode opt-out
      if (want) { try { fs.unlinkSync(TEXT_MODE_FLAG); } catch (e) {} }
      else fs.writeFileSync(TEXT_MODE_FLAG, 'text mode ON via drip page ' + new Date().toISOString());
    } catch (e) {}
    log('🖼 images-only toggled ' + (want ? 'ON — only finished pages (12/13+), text never touched' : 'OFF — normal drip'));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, imagesOnly: IMAGES_ONLY_ACTIVE() }));
  }
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<!doctype html><meta charset=utf-8><title>🩸 The Drip</title>'
    + '<body style="margin:0;background:#0b0a0c;color:#ece7ea;font:14px system-ui,Segoe UI,Arial;padding:20px;max-width:960px">'
    + '<h1 style="margin:0 0 4px">🩸 The Drip <span id=onoff></span></h1>'
    + '<p style="color:#9a8a72;margin:0 0 16px">CC-dominant · DS on rescue · bar ' + GATE_MIN + '/13 · ≥' + MIN_WORDS + ' words · '
    + (PILLARS.length ? 'pillars: <b>' + esc(PILLARS.join(', ')) + '</b>' : 'whole library') + ' · runs forever</p>'
    + '<div style="margin:0 0 14px"><button id=imgbtn onclick=toggleImages() style="font:700 14px system-ui;padding:10px 16px;border-radius:8px;border:1px solid #EAC15C;background:#1b1520;color:#EAC15C;cursor:pointer">🖼 …</button>'
    + '<span id=imgnote style="margin-left:10px;color:#9a8a72;font-size:12.5px"></span></div>'
    + '<div id=counts style="font-size:26px;font-weight:800;color:#EAC15C">…</div>'
    + '<p id=stats style="margin:14px 0 0"></p><p id=stats2></p>'
    + '<div id=now style="margin:16px 0;padding:12px 14px;border-radius:8px;background:#141118;border:1px solid #2a2430"></div>'
    + '<h3 style="margin:18px 0 6px;color:#EAC15C">Live feed — last 40 URLs</h3>'
    + '<div id=feed style="font-size:12.5px"></div>'
    + '<script>'
    + 'function ago(t){var s=Math.round((Date.now()-t)/1000);return s<60?s+"s":Math.round(s/60)+"m";}'
    + 'async function toggleImages(){var b=document.getElementById("imgbtn");b.disabled=true;'
    + ' try{await fetch("/api/imagesonly");}catch(e){} b.disabled=false; tick();}'
    + 'function paintImages(on){'
    + ' var b=document.getElementById("imgbtn"),n=document.getElementById("imgnote");'
    + ' if(on){b.textContent="🖼 IMAGES ONLY — ON";b.style.background="#1d2a1f";b.style.borderColor="#2ecc71";b.style.color="#8affb0";'
    + '   n.innerHTML="only finished pages (<b>12/13 or higher</b>) · text is never rewritten · click to turn off";}'
    + ' else {b.textContent="🖼 IMAGES ONLY — OFF";b.style.background="#2a1518";b.style.borderColor="#ff6a6a";b.style.color="#ff9a9a";'
    + '   n.innerHTML="normal drip — it WILL rewrite text and work unfinished pages · click to turn on";}}'
    + 'async function tick(){'
    + ' try{var d=await (await fetch("/api/status")).json();'
    + '  paintImages(!!d.imagesOnly);'
    + '  document.getElementById("onoff").innerHTML=d.on?"<span style=color:#2ecc71>● RUNNING</span>":"<span style=color:#888>○ STOPPED</span>";'
    + '  document.getElementById("counts").innerHTML=d.done.toLocaleString()+\' <span style="font-size:15px;color:#9a8a72">done</span> · \'+d.left.toLocaleString()+\' <span style="font-size:15px;color:#9a8a72">left</span> <span style="font-size:15px;color:#9a8a72">(lap \'+d.lap+\' · \'+(d.total?((d.done/d.total)*100).toFixed(1):0)+\'%)</span>\';'
    + '  document.getElementById("stats").innerHTML="✅ fixed <b>"+d.fixed+"</b> · ✓ already ok <b>"+d.alreadyOk+"</b> · 📉 short <b>"+d.missed+"</b> · ⛔ errors <b>"+d.errors+"</b>";'
    + '  document.getElementById("stats2").innerHTML="🤖 CC wins <b>"+d.ccWins+"</b> · 🆘 DS rescues <b>"+d.dsRescues+"</b> · 🔧 surgical <b>"+d.surgicalWins+"</b>";'
    + '  document.getElementById("now").innerHTML=d.current'
    + '    ?(\'<div style="color:#9a8a72;font-size:11px">WORKING ON NOW · \'+ago(d.since)+\'</div><div style="font-size:16px;font-weight:700;color:#EAC15C">\'+d.current+\'</div><div style="color:#ece7ea;margin:4px 0">\'+(d.currentQ||"")+\'</div><div style="color:#8ab4ff">stage: <b>\'+(d.stage||"")+\'</b> · started at \'+(d.currentBefore==null?"?":d.currentBefore)+\'/13</div>\')'
    + '    :\'<span style="color:#9a8a72">idle — waiting for the next page</span>\';'
    + '  document.getElementById("feed").innerHTML=(d.feed||[]).map(function(f){'
    + '    var c=f.skipped?"#9a8a72":(f.ok?"#8affb0":"#ff8fa8");var t=f.skipped?"✓ already ok":(f.ok?"✅ fixed":"📉 short");'
    + '    return \'<div style="padding:4px 0;border-bottom:1px solid #201c26"><span style="color:\'+c+\'">\'+t+\'</span> <b>\'+f.id+\'</b> \'+f.before+\'→\'+f.score+\'/13 <span style="color:#8ab4ff">\'+f.engine+\'</span> <span style="color:#9a8a72">\'+ago(f.at)+\' ago</span><div style="color:#9a8a72">\'+f.q+\'</div></div>\';'
    + '  }).join("")||\'<span style="color:#9a8a72">nothing yet</span>\';'
    + ' }catch(e){}'
    + '}tick();setInterval(tick,2000);'
    + '</script>');
}).on('error', e => {
  // 🔒 ONE DRIP ONLY (owner 2026-07-28). The port IS the lock: a second instance cannot bind it.
  // Without this the process died on an unhandled EADDRINUSE, or worse, a manual start alongside
  // the hub's could leave two workers walking the same queue and double-writing the same pages.
  if (e && e.code === 'EADDRINUSE') {
    log('⛔ another drip is already running on :' + PORT + ' — this one is exiting (one drip only)');
    process.exit(0);
  }
  log('server error — ' + ((e && e.message) || e));
  process.exit(1);
}).listen(PORT, () => {
  log('🩸 DRIP up on :' + PORT + ' · bar ' + GATE_MIN + '/13 · CC×' + CC_TRIES + ' then DS×' + DS_TRIES + ' · pace ' + Math.round(PACE_MS / 1000) + 's');
});

(async () => {
  loadQueue();
  if (!QUEUE.length) await refreshQueue();
  log('📋 MANAGER start — cursor ' + STATE.cursor + '/' + QUEUE.length + ' · lap ' + STATE.lap);
  loop();
})();
