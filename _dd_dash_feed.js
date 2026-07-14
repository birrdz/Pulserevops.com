'use strict';
/**
 * Push a published Q&A onto the Daily Driver dash feed (gen/run_status.json + today_stats).
 * Used by scrubber certify + any publish path that should show on DD.
 */
const fs = require('fs');
const path = require('path');

const WD = path.join(__dirname);
const GEN = path.join(WD, 'gen');
const STATUS_F = path.join(GEN, 'run_status.json');
const TODAY_F = path.join(GEN, 'today_stats.json');

const PNAMES = {
  tl: 'Pulse Tools', ca: 'Cars', bt: 'Boats', aq: 'Aquariums', ik: 'Industry KPIs',
  tk: 'Tech Stacks', bs: 'Book Summaries', st: 'Sales Trainings', fr: 'Franchises',
  co: 'Collectibles', ai: 'AI Infra', gb: 'Graphics', bo: 'Buildouts', sy: 'Style',
  gp: 'GTM Playbooks', ra: 'Rev Architecture', pt: 'Pets', es: 'Espresso', tv: 'TVs',
  rs: 'Resorts', cl: 'Cologne', lv: 'Lux Vacations', ev: 'Events', ga: 'Gatherings',
  gm: 'Gaming', mv: 'Movies', wl: 'Wellness', dn: 'Dining', nl: 'Nightlife', tn: 'Towns',
  sc: 'Schools', tc: 'Telco', er: 'Electronics', q: 'Q&A', hf: 'Home & Family',
  sw: 'Software', sk: 'Skill Drills', sp: 'Sports', dr: 'Drills',
};

function etDateKey(d) {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d || new Date());
  } catch (e) {
    return new Date().toISOString().slice(0, 10);
  }
}

function readJSON(f, d) {
  try {
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch (e) {
    return d;
  }
}
function writeJSON(f, obj) {
  try {
    fs.mkdirSync(path.dirname(f), { recursive: true });
  } catch (e) {}
  fs.writeFileSync(f, JSON.stringify(obj, null, 2));
}

function pillarOfId(id) {
  const m = String(id || '').match(/^([a-z]+)/i);
  return m ? m[1].toLowerCase() : '';
}

function liveUrlFor(id) {
  const p = pillarOfId(id);
  if (p === 'aq') return 'https://pulserevops.com/aquariums/' + id;
  return 'https://pulserevops.com/knowledge/' + id;
}

/**
 * @param {object} opts
 * @param {string} opts.id
 * @param {string} [opts.title]
 * @param {number} [opts.score]
 * @param {boolean} [opts.published=true]
 * @param {boolean} [opts.pass=true]
 * @param {string} [opts.source] scrub|dd|fixer
 * @param {boolean} [opts.bumpDone] also bump today done/passed (default false for scrub)
 */
function notifyDdDashPublished(opts) {
  opts = opts || {};
  const id = String(opts.id || '').trim();
  if (!id) return { ok: false, error: 'no id' };

  const pillar = opts.pillar || pillarOfId(id);
  const summary = {
    id,
    pillar,
    pillarName: opts.pillarName || PNAMES[pillar] || pillar,
    title: String(opts.title || id).trim(),
    kind: opts.kind || null,
    score: opts.score != null ? Number(opts.score) : null,
    pass: opts.pass !== false,
    published: opts.published !== false,
    url: opts.url || liveUrlFor(id),
    error: opts.error || null,
    source: opts.source || 'publish',
    at: new Date().toISOString(),
  };

  const st = readJSON(STATUS_F, {});
  const recent = Array.isArray(st.recentResults) ? st.recentResults.slice() : [];
  // de-dupe same id if re-certified within feed window
  const filtered = recent.filter((r) => !(r && r.id === id));
  filtered.push(summary);
  while (filtered.length > 24) filtered.shift();

  const sessionPublished = (Number(st.sessionPublished) || 0) + (summary.published ? 1 : 0);
  const sessionPassed = (Number(st.sessionPassed) || 0) + (summary.pass ? 1 : 0);

  writeJSON(
    STATUS_F,
    Object.assign({}, st, {
      lastResult: summary,
      recentResults: filtered,
      sessionPublished,
      sessionPassed,
      phase: summary.published
        ? '✓ published ' + id + (summary.source ? ' · ' + summary.source : '')
        : st.phase,
      note: summary.published ? ('last publish · ' + id) : st.note,
    })
  );

  // today counters
  const key = etDateKey();
  let today = readJSON(TODAY_F, { date: key, done: 0, passed: 0, published: 0 });
  if (today.date !== key) today = { date: key, done: 0, passed: 0, published: 0 };
  if (opts.bumpDone) today.done = (Number(today.done) || 0) + 1;
  if (opts.bumpDone && summary.pass) today.passed = (Number(today.passed) || 0) + 1;
  if (summary.published) today.published = (Number(today.published) || 0) + 1;
  writeJSON(TODAY_F, today);

  return { ok: true, summary, today };
}

module.exports = { notifyDdDashPublished, pillarOfId, liveUrlFor, PNAMES };
