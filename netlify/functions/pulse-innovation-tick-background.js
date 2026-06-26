// pulse-innovation-tick — every 5 min, one site-wide UX/visual improvement.
// Rotates through many modes (look + use), writes pulse-innovation/state.json.
// No LLM spend. Deploy when this file or pulse-signal.js changes; ticks = blobs only.

const https = require('https');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const { capitalizeQuestion } = require('./lib/text-capitalize');

const SITE = 'https://pulserevops.com';
const STATE_KEY = 'pulse-innovation/state.json';
const HISTORY_KEY = 'pulse-innovation/history.json';
const INDEXNOW_KEY = 'pulsemachine-writer-2026';
const MAX_HISTORY = 96;

const OPERATOR_TIPS = [
  'Pipeline truth beats pipeline theater — if CRM stage duration is zero, your forecast is fiction.',
  'Hire the RevOps layer before you hire the tenth AE. Coverage without process is expensive noise.',
  'Fractional CRO works when the board wants speed and the team needs a decision owner, not another deck.',
  'Index your answers, not your activity — one indexed proof page beats fifty internal slides.',
  'When churn rises on enterprise accounts, fix expansion mechanics before you rebrand the pitch.',
  'On /knowledge press / to jump straight into search — no mouse hunt through 2,600+ cards.',
  'Use j and k on the library grid to walk cards; Enter opens the highlighted answer.',
];

const MACHINE_WHISPERS = [
  'The Machine heard a question about CRO timing. The library already has the answer.',
  'Three monitors. One heartbeat. Your next hire decision is in the index.',
  'Cobwebs on the glass. Fresh signal underneath. Ask the box.',
  'It is always listening. Today it is surfacing fractional CRO paths.',
];

// Each tick picks the next mode — long list so every 5 min feels like a new idea.
const MODES = [
  'spotlight',
  'ask-machine',
  'deep-cut',
  'search-shortcut',
  'operator-pulse',
  'pillar-hop',
  'tag-voyage',
  'trainings-door',
  'gold-path',
  'machine-whisper',
  'kpi-door',
  'library-velocity',
  'keyboard-tour',
  'discover-roulette',
  'hidden-gem',
  'war-room',
  'readability-teal',
  'almost-done',
  'visitor-ask',
  'indexnow-nudge',
  'skim-top',
  'cross-link-cro',
  'readability-gold',
  'site-tour',
];

const THEMES = {
  warm: { accent: '#E8710A', badge: 'PULSE SIGNAL' },
  teal: { accent: '#2DD4BF', badge: 'TIP' },
  gold: { accent: '#FFD740', badge: 'GOLD PATH' },
  green: { accent: '#39FF14', badge: 'LIVE' },
  violet: { accent: '#B388FF', badge: 'DEEP CUT' },
};

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

function postJSON(url, body) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
      timeout: 12000,
    }, (res) => {
      let buf = '';
      res.on('data', (c) => { buf += c; });
      res.on('end', () => resolve({ status: res.statusCode, body: buf.slice(0, 300) }));
    });
    req.on('error', (e) => resolve({ status: 0, body: String(e.message) }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: 'timeout' }); });
    req.write(data);
    req.end();
  });
}

function routeFor(entry) {
  if (!entry) return '/knowledge/';
  if (Array.isArray(entry.tags) && entry.tags.includes('sales-training')) return '/sales-trainings/';
  if (/^st\d+$/i.test(entry.id || '')) return '/sales-trainings/';
  if (Array.isArray(entry.tags) && entry.tags.includes('industry-kpi')) return '/industry-kpis/';
  if (/^ik\d+$/i.test(entry.id || '')) return '/industry-kpis/';
  return '/knowledge/';
}

function qNum(id) {
  const m = /^q0*(\d+)$/.exec(id || '');
  return m ? parseInt(m[1], 10) : 0;
}

function pickRandom(arr, n, exclude) {
  const ex = new Set(exclude || []);
  const pool = arr.filter((x) => x && !ex.has(x.id));
  const out = [];
  while (out.length < n && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

function linkCard(id, label, url, tag) {
  return { id: id || 'nav', question: label, url, tag: tag || 'nav' };
}

function spotlightCards(entries) {
  return entries.slice(0, 5).map((e) => ({
    id: e.id,
    question: capitalizeQuestion((e.question || '').slice(0, 120)),
    url: SITE + routeFor(e) + e.id,
    tag: ((e.tags || [])[0] || 'revops'),
  }));
}

function isGoldEntry(e) {
  if (!e || (e.quality_score || 0) < 10) return false;
  const id = String(e.id || '');
  return e.format_v === '2026-05' || /^st\d+$/i.test(id) || /^ik\d+$/i.test(id) || qNum(id) >= 9501;
}

function pickMode(prev, tick) {
  const i = (tick - 1) % MODES.length;
  let mode = MODES[i];
  if (prev.mode && mode === prev.mode && MODES.length > 1) {
    mode = MODES[(tick) % MODES.length];
  }
  return mode;
}

function nextModeName(tick) {
  return MODES[tick % MODES.length];
}

async function appendCronLog(store, tick, summary, ids) {
  try {
    const raw = (await store.get('_cron_events.json', { type: 'json' })) || { events: [] };
    const events = Array.isArray(raw.events) ? raw.events : [];
    events.unshift({
      ts: Date.now(),
      task: 'innovation',
      tick,
      summary: String(summary).slice(0, 800),
      ids: (ids || []).slice(0, 8),
    });
    await store.setJSON('_cron_events.json', { events: events.slice(0, 600) });
  } catch (e) { /* non-fatal */ }
}

async function runInnovationTick(store) {
  const prev = (await store.get(STATE_KEY, { type: 'json' })) || {};
  const tick = (typeof prev.tick === 'number' ? prev.tick : 0) + 1;
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const entries = (idx.entries || []).filter((e) => e && e.id);
  const qAll = entries.filter((e) => /^q\d+$/i.test(e.id));
  const stAll = entries.filter((e) => /^st\d+$/i.test(e.id));
  const ikAll = entries.filter((e) => /^ik\d+$/i.test(e.id));
  const sorted = [...qAll].sort((a, b) => (b.ts || 0) - (a.ts || 0));
  const lastIds = prev.lastSpotlightIds || [];
  const mode = pickMode(prev, tick);

  let report = '';
  let action = { type: mode };
  let cards = [];
  let marquee = '';
  let theme = 'warm';
  let accent = THEMES.warm.accent;
  let badgeLabel = THEMES.warm.badge;
  const libraryTotal = qAll.length;

  const setTheme = (name) => {
    theme = name;
    accent = (THEMES[name] || THEMES.warm).accent;
    badgeLabel = (THEMES[name] || THEMES.warm).badge;
  };

  if (mode === 'spotlight') {
    const picks = sorted.slice(0, 3);
    cards = spotlightCards(picks);
    marquee = 'Newest research first — three fresh answers at the top of the library.';
    report = `Tick ${tick} · SPOTLIGHT — Newest Q&As in the bar: ${picks.map((p) => p.id).join(', ')}. Helps visitors start where The Machine just published.`;
    action.ids = picks.map((p) => p.id);
  } else if (mode === 'ask-machine') {
    setTheme('green');
    cards = [
      linkCard('ask', 'Ask The Machine a question →', SITE + '/themachine', 'machine'),
      linkCard('lib', 'Browse the knowledge library', SITE + '/knowledge', 'nav'),
      linkCard('agents', 'Watch the hive (live status)', SITE + '/agents', 'nav'),
    ];
    marquee = 'Need an answer? Ask on /themachine — visitor questions get researched and published.';
    report = `Tick ${tick} · ASK-MACHINE — Bar promotes /themachine + library + agents for faster paths.`;
  } else if (mode === 'deep-cut') {
    setTheme('violet');
    const tags = ['cro', 'fractional-cro', 'revops', 'economy-mode', 'revops-100'];
    const pool = qAll.filter((e) => (e.tags || []).some((t) => tags.includes(t)));
    const picks = pickRandom(pool.length ? pool : sorted, 3, lastIds);
    cards = spotlightCards(picks);
    marquee = 'Deep cut — CRO & RevOps answers worth reading before your next board meeting.';
    report = `Tick ${tick} · DEEP-CUT — CRO/RevOps picks: ${picks.map((p) => p.id).join(', ')}.`;
    action.ids = picks.map((p) => p.id);
  } else if (mode === 'search-shortcut') {
    setTheme('teal');
    cards = [
      linkCard('search', 'Open library search (press / there)', SITE + '/knowledge', 'nav'),
      ...spotlightCards(sorted.slice(0, 2)),
    ];
    marquee = 'Tip: on /knowledge press / to focus search — skim 2,600+ answers without scrolling forever.';
    report = `Tick ${tick} · SEARCH-SHORTCUT — Usability nudge for / keyboard search on the library.`;
  } else if (mode === 'operator-pulse') {
    const tip = OPERATOR_TIPS[(tick - 1) % OPERATOR_TIPS.length];
    cards = spotlightCards(sorted.slice(0, 2));
    marquee = tip;
    report = `Tick ${tick} · OPERATOR-PULSE — Operator tip in marquee + 2 fresh links.`;
    action.tip = tip;
  } else if (mode === 'pillar-hop') {
    const stPick = pickRandom(stAll, 1, lastIds)[0];
    const ikPick = pickRandom(ikAll, 1, lastIds)[0];
    const qPick = sorted[0];
    cards = [
      linkCard('know', 'Q&A library (' + libraryTotal.toLocaleString('en-US') + ' answers)', SITE + '/knowledge', 'nav'),
    ];
    if (stPick) cards.push(...spotlightCards([stPick]));
    else if (qPick) cards.push(...spotlightCards([qPick]));
    if (ikPick) cards.push(...spotlightCards([ikPick]));
    if (cards.length < 3 && qPick) cards.push(...spotlightCards([qPick]));
    cards = cards.slice(0, 3);
    marquee = 'Three pillars — Q&A, sales trainings, and industry KPI guides — one hop each.';
    report = `Tick ${tick} · PILLAR-HOP — Cross-links Q&A + trainings + KPIs for site-wide discovery.`;
  } else if (mode === 'tag-voyage') {
    const tagCounts = {};
    qAll.forEach((e) => {
      const t = (e.tags || [])[0] || 'revops';
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
    const keys = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
    const tag = keys[tick % Math.max(1, keys.length)] || 'revops';
    const pool = qAll.filter((e) => (e.tags || []).includes(tag));
    const picks = pickRandom(pool.length ? pool : sorted, 3, lastIds);
    cards = spotlightCards(picks);
    marquee = `Explore #${tag} — ${(tagCounts[tag] || 0).toLocaleString('en-US')} answers tagged this way.`;
    report = `Tick ${tick} · TAG-VOYAGE — Tag “${tag}”: ${picks.map((p) => p.id).join(', ')}.`;
    action.tag = tag;
  } else if (mode === 'trainings-door') {
    setTheme('gold');
    const picks = pickRandom(stAll.length ? stAll : sorted.slice(0, 20), 2, lastIds);
    cards = [
      linkCard('st', 'All sales trainings →', SITE + '/sales-trainings', 'training'),
      ...spotlightCards(picks),
    ];
    marquee = 'Sales meeting playbooks live under /sales-trainings — objection handling, frameworks, personas.';
    report = `Tick ${tick} · TRAININGS-DOOR — Routes visitors to sales trainings (${picks.map((p) => p.id).join(', ') || 'index'}).`;
  } else if (mode === 'gold-path') {
    setTheme('gold');
    const pool = qAll.filter(isGoldEntry);
    const picks = pickRandom(pool.length ? pool : sorted.filter((e) => (e.quality_score || 0) >= 10), 3, lastIds);
    cards = spotlightCards(picks);
    marquee = 'Gold path — citation-ready 10/10 answers (polished format). Start here for board-ready reads.';
    report = `Tick ${tick} · GOLD-PATH — Polished picks: ${picks.map((p) => p.id).join(', ')}.`;
    action.ids = picks.map((p) => p.id);
  } else if (mode === 'machine-whisper') {
    const whisper = MACHINE_WHISPERS[(tick - 1) % MACHINE_WHISPERS.length];
    cards = [linkCard('themachine', whisper, SITE + '/themachine', 'machine')];
    marquee = whisper;
    report = `Tick ${tick} · MACHINE-WHISPER — Points bar to /themachine.`;
  } else if (mode === 'kpi-door') {
    setTheme('teal');
    const picks = pickRandom(ikAll.length ? ikAll : sorted.slice(0, 20), 2, lastIds);
    cards = [
      linkCard('ik', 'Industry KPI guides →', SITE + '/industry-kpis', 'kpi'),
      ...spotlightCards(picks),
    ];
    marquee = 'Benchmarks & KPI playbooks — /industry-kpis — vertical metrics without the consultant deck.';
    report = `Tick ${tick} · KPI-DOOR — Surfaces industry KPI section (${picks.map((p) => p.id).join(', ') || 'hub'}).`;
  } else if (mode === 'library-velocity') {
    const dayAgo = Date.now() - 86400000;
    const last24 = qAll.filter((e) => (e.ts || 0) >= dayAgo).length;
    cards = spotlightCards(sorted.slice(0, 3));
    marquee = `${libraryTotal.toLocaleString('en-US')} answers live · ${last24} added in 24h — library is compounding.`;
    report = `Tick ${tick} · LIBRARY-VELOCITY — Size ${libraryTotal}, 24h ${last24}. Cards: ${cards.map((c) => c.id).join(', ')}.`;
    action.last24 = last24;
  } else if (mode === 'keyboard-tour') {
    setTheme('teal');
    cards = [
      linkCard('kb', 'Library: / search · j/k cards · s starred · r random', SITE + '/knowledge', 'nav'),
      linkCard('rnd', 'Try Random on the library filter row', SITE + '/knowledge', 'nav'),
      ...spotlightCards(sorted.slice(0, 1)),
    ];
    marquee = 'Power use: / search, j/k move cards, Enter open, s starred, r random, c clear filters, ? shortcuts.';
    report = `Tick ${tick} · KEYBOARD-TOUR — Teaches library keyboard shortcuts in the bar.`;
  } else if (mode === 'discover-roulette') {
    const picks = pickRandom(sorted, 3, lastIds);
    cards = spotlightCards(picks);
    marquee = 'Serendipity — three random answers. Different roll every 5 minutes.';
    report = `Tick ${tick} · DISCOVER-ROULETTE — ${picks.map((p) => p.id).join(', ')}.`;
    action.ids = picks.map((p) => p.id);
  } else if (mode === 'hidden-gem') {
    const old = qAll.filter((e) => qNum(e.id) > 0 && qNum(e.id) < 3000);
    const picks = pickRandom(old.length ? old : sorted, 3, lastIds);
    cards = spotlightCards(picks);
    marquee = 'Hidden gems — early library answers worth a second look (not just the newest IDs).';
    report = `Tick ${tick} · HIDDEN-GEM — Older picks: ${picks.map((p) => p.id).join(', ')}.`;
    action.ids = picks.map((p) => p.id);
  } else if (mode === 'war-room') {
    cards = [
      linkCard('dash', 'Operator dashboard →', SITE + '/dashboard', 'nav'),
      linkCard('agents', 'Hive / engine status →', SITE + '/agents', 'nav'),
      ...spotlightCards(sorted.slice(0, 1)),
    ];
    marquee = 'Running the business? Dashboard + hive show live engine activity and CRM pulse.';
    report = `Tick ${tick} · WAR-ROOM — Promotes /dashboard and /agents for operators.`;
  } else if (mode === 'readability-teal') {
    setTheme('teal');
    cards = spotlightCards(sorted.slice(0, 3));
    marquee = 'High-contrast tip bar — easier to scan while you scroll long answers.';
    report = `Tick ${tick} · READABILITY-TEAL — Teal accent on Pulse Signal for visual variety.`;
  } else if (mode === 'almost-done') {
    setTheme('green');
    const pool = qAll.filter((e) => {
      const s = e.quality_score || 0;
      return s >= 8 && s < 10;
    });
    const picks = pickRandom(pool.length ? pool : sorted.slice(50, 80), 3, lastIds);
    cards = spotlightCards(picks);
    marquee = 'Almost there — answers in the 8–9/10 polish band (watch them climb to 10).';
    report = `Tick ${tick} · ALMOST-DONE — Mid-polish: ${picks.map((p) => p.id).join(', ')}.`;
    action.ids = picks.map((p) => p.id);
  } else if (mode === 'visitor-ask') {
    setTheme('green');
    cards = [
      linkCard('vq', 'Ask your own question (free)', SITE + '/themachine', 'machine'),
      ...spotlightCards(sorted.slice(0, 2)),
    ];
    marquee = 'Visitors: drop a real question on /themachine — The Machine researches and publishes it.';
    report = `Tick ${tick} · VISITOR-ASK — Drives custom question flow on /themachine.`;
  } else if (mode === 'indexnow-nudge') {
    const unindexed = sorted.filter((e) => !e.was_indexed_at);
    const target = unindexed[0] || sorted[0];
    let ping = { status: 0, body: 'skip' };
    if (target) {
      ping = await postJSON(SITE + '/.netlify/functions/pulse-indexnow-target', { key: INDEXNOW_KEY, id: target.id });
    }
    cards = spotlightCards(target ? [target, ...sorted.slice(0, 2)] : sorted.slice(0, 3));
    marquee = target
      ? `SEO boost — telling search engines about ${target.id} (better discovery off-site).`
      : 'Library fully indexed — showing newest answers instead.';
    report = `Tick ${tick} · INDEXNOW-NUDGE — ${target ? target.id : 'none'} HTTP ${ping.status}.`;
    action.indexed = target ? target.id : null;
    action.pingStatus = ping.status;
  } else if (mode === 'skim-top') {
    cards = [
      linkCard('p1', 'Page 1 — newest entries', SITE + '/knowledge', 'nav'),
      ...spotlightCards(sorted.slice(0, 2)),
    ];
    marquee = 'Skim tip: newest drops sit on page 1 of /knowledge — sort is by publish time.';
    report = `Tick ${tick} · SKIM-TOP — Usability: start at page 1 for fresh research.`;
  } else if (mode === 'cross-link-cro') {
    setTheme('violet');
    const pool = qAll.filter((e) => /cro|chief revenue|fractional/i.test((e.question || '') + (e.tags || []).join(' ')));
    const picks = pickRandom(pool.length ? pool : sorted, 3, lastIds);
    cards = spotlightCards(picks);
    marquee = 'CRO cluster — hiring, timing, and fractional chief revenue officer paths.';
    report = `Tick ${tick} · CROSS-LINK-CRO — ${picks.map((p) => p.id).join(', ')}.`;
    action.ids = picks.map((p) => p.id);
  } else if (mode === 'readability-gold') {
    setTheme('gold');
    cards = spotlightCards(sorted.slice(0, 3));
    marquee = 'Gold accent bar — highlights premium polished answers this rotation.';
    report = `Tick ${tick} · READABILITY-GOLD — Gold-themed signal bar for visual refresh.`;
  } else if (mode === 'site-tour') {
    cards = [
      linkCard('home', 'Home', SITE + '/', 'nav'),
      linkCard('know', 'Knowledge', SITE + '/knowledge', 'nav'),
      linkCard('tm', 'The Machine', SITE + '/themachine', 'machine'),
    ];
    marquee = 'Site map — Home · Knowledge · The Machine — three front doors, pick your path.';
    report = `Tick ${tick} · SITE-TOUR — Navigation tour in the bottom bar.`;
  } else {
    cards = spotlightCards(sorted.slice(0, 3));
    marquee = 'Pulse Signal — live library updates every 5 minutes.';
    report = `Tick ${tick} · FALLBACK — Default spotlight.`;
  }

  const state = {
    tick,
    ts: Date.now(),
    mode,
    theme,
    accent,
    badgeLabel,
    marquee,
    cards: cards.slice(0, 3),
    libraryTotal,
    report,
    uxFocus: true,
    lastSpotlightIds: cards.map((c) => c.id).filter((id) => /^q\d+$/i.test(id)),
    nextMode: nextModeName(tick),
  };

  await store.setJSON(STATE_KEY, state);

  const hist = (await store.get(HISTORY_KEY, { type: 'json' })) || { improvements: [] };
  const improvements = Array.isArray(hist.improvements) ? hist.improvements : [];
  improvements.unshift({ tick, ts: state.ts, mode, report });
  await store.setJSON(HISTORY_KEY, { improvements: improvements.slice(0, MAX_HISTORY) });

  await appendCronLog(store, tick, report, action.ids || (action.indexed ? [action.indexed] : []));

  return state;
}

const { isVisitorPriorityActive } = require('./lib/visitor-priority');

exports.handler = async (event) => {
  /* visitor-priority-injected */
  try {
    let __vp_getStore = null;
    try { __vp_getStore = require('@netlify/blobs').getStore; } catch (_e) {}
    if (__vp_getStore) {
      let __vp_store = null;
      try { __vp_store = __vp_getStore('pulse-machine-library'); }
      catch (_e) {
        const __vp_tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
        const __vp_sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
        if (__vp_tok && __vp_sid) {
          try { __vp_store = __vp_getStore({ name: 'pulse-machine-library', siteID: __vp_sid, token: __vp_tok }); } catch (_e2) {}
        }
      }
      if (__vp_store && await isVisitorPriorityActive(__vp_store)) {
        return { statusCode: 200, body: JSON.stringify({ ok: true, paused: 'visitor-priority' }) };
      }
    }
  } catch (_e) {}

  const store = initStore();
  if (!store) {
    console.log('[innovation-tick] no blob store');
    return { statusCode: 503, body: 'no store' };
  }

  try {
    const state = await runInnovationTick(store);
    console.log('[innovation-tick]', state.report);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, tick: state.tick, mode: state.mode, report: state.report }),
    };
  } catch (e) {
    console.error('[innovation-tick]', e);
    return { statusCode: 500, body: String(e.message) };
  }
};

if (require.main === module) {
  exports.handler({}).then((r) => {
    console.log(r.body);
    process.exit(r.statusCode === 200 ? 0 : 1);
  });
}
