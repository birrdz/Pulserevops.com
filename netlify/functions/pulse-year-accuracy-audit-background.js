// pulse-year-accuracy-audit-background — CONTINUOUS site-wide year-accuracy
// audit. LAW (passcode 4444, 2026-06-21): the whole library must always read
// as accurate for the CURRENT year or the NEXT year. This cron walks every
// entry on a rolling cursor and FLAGS any entry that presents a PAST year as
// the current/buying year, then emails the owner a digest and appends the IDs
// to _year_audit_queue.json. It does NOT rewrite content (4444 law: cron makes
// no Anthropic writes) — Claude Code/Opus drains the queue and fixes entries.
//
// $0: blob reads/writes only, no LLM calls. Self-advancing: the target year is
// derived from the clock every run, so it rolls to 2027/2028/... automatically.
//
// State blobs:
//   _year_audit_state.json  = { cursor, pass, flaggedThisPass, lastEmail, year }
//   _year_audit_queue.json  = { current_year, next_year, updated_at, count, ids:[{id,pillar,reason,url}] }
const { getStore } = require('@netlify/blobs');

const RECIPIENT = 'koryjordanwhite@gmail.com';
const BATCH = 250;                 // entries scanned per run
const EMAIL_EVERY_MS = 6 * 60 * 60 * 1000; // digest at most every 6h
const PILLAR_PATH = { q:'knowledge', er:'electronic-reviews', ca:'cars', sc:'schools', dn:'dining', bt:'boats', mv:'movies', wl:'wellness', tv:'travel', rs:'resorts', es:'estates', cl:'clubs', lv:'living', ev:'events', ga:'gatherings', gm:'gaming', nl:'nightlife', tl:'tools', tn:'towns', co:'collectibles', ai:'ai-infrastructure', aq:'aquariums', hf:'highschool-football-recruiting', fr:'franchises', ik:'industry-kpis', st:'sales-trainings', tk:'tech-stacks', sy:'style', gb:'graphics', sp:'speeches', ra:'knowledge', gp:'knowledge', bs:'knowledge', sk:'skills', tc:'telco' };

function store() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  return (tok && sid) ? getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }) : getStore('pulse-machine-library');
}
const prefixOf = (id) => { const m = String(id).match(/^([a-z]+)/i); return m ? m[1].toLowerCase() : null; };
const urlFor = (id) => { const p = prefixOf(id); const seg = PILLAR_PATH[p] || 'knowledge'; return `https://pulserevops.com/${seg}/${id}`; };

async function emailOwner(subject, html) {
  const rs = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
  const from = process.env.ALERT_FROM_EMAIL || process.env.alert_from_email || 'onboarding@resend.dev';
  if (!rs) return;
  try {
    await fetch('https://api.resend.com/emails', { method: 'POST',
      headers: { Authorization: 'Bearer ' + rs, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [RECIPIENT], subject, html }) });
  } catch (e) {}
}

// Heuristic: does this entry present a PAST year as the current/buying year?
// CURRENT/NEXT are derived from the clock. Returns a reason string or ''.
function staleYearReason(title, body, CURRENT, NEXT) {
  const text = (title + '\n' + body);
  // 1) Deliberate archive: title explicitly stamped with a 4-digit year
  //    (e.g. "Top 10 Mid-Size SUVs 2025") => intentional model-year list, skip.
  const titleYearM = title.match(/\b(20\d\d)\b/);
  if (titleYearM) return ''; // year-stamped titles are intentional; leave them.

  // Collect every plausible content year (2015..NEXT) mentioned in the body.
  const years = (body.match(/\b20\d\d\b/g) || []).map(Number).filter(y => y >= 2015 && y <= NEXT + 1);
  const mentionsCurrentOrNext = years.some(y => y === CURRENT || y === NEXT);

  // 2) Present-tense buying advice tied to a PAST year, e.g. "best ... in 2024",
  //    "for 2024", "2024's best", "as of 2024", with no current/next anchor.
  const presentPast = text.match(/\b(?:in|for|of|as of|by)\s+(20\d\d)\b/ig) || [];
  for (const ph of presentPast) {
    const y = Number((ph.match(/20\d\d/) || [])[0]);
    if (y && y < CURRENT && !mentionsCurrentOrNext) {
      return `presents ${y} as current ("${ph.trim()}"); no ${CURRENT}/${NEXT} reference`;
    }
  }
  // 3) Dateline / "updated" stuck on a past year with no current/next mention.
  const upd = text.match(/\b(?:updated|published|last\s+reviewed)[^\n]{0,24}?\b(20\d\d)\b/i);
  if (upd) { const y = Number((upd[0].match(/20\d\d/g) || []).pop()); if (y && y < CURRENT && !mentionsCurrentOrNext) return `dateline year ${y} behind current ${CURRENT}`; }

  // 4) The entry references year(s) but the LATEST is behind current, and never
  //    mentions current/next — likely written for an old cycle, never refreshed.
  if (years.length && !mentionsCurrentOrNext) {
    const maxY = Math.max(...years);
    if (maxY < CURRENT) return `latest year referenced is ${maxY}; behind current ${CURRENT}/${NEXT}`;
  }
  return '';
}

exports.handler = async () => {
  const s = store();
  const now = Date.now();
  const CURRENT = new Date().getUTCFullYear();
  const NEXT = CURRENT + 1;

  const idx = await s.get('_index.json', { type: 'json' }).catch(() => null);
  if (!idx || !Array.isArray(idx.entries)) return { statusCode: 200, body: 'no index' };
  const entries = idx.entries.filter(e => e && e.id);
  const total = entries.length;

  let st = await s.get('_year_audit_state.json', { type: 'json' }).catch(() => null);
  if (!st || st.year !== CURRENT) st = { cursor: 0, pass: 0, flaggedThisPass: 0, lastEmail: 0, year: CURRENT };
  if (st.cursor >= total) st.cursor = 0;

  let q = await s.get('_year_audit_queue.json', { type: 'json' }).catch(() => null);
  if (!q || q.current_year !== CURRENT) q = { current_year: CURRENT, next_year: NEXT, updated_at: now, count: 0, ids: [] };
  const known = new Set(q.ids.map(x => x.id));

  const start = st.cursor;
  const end = Math.min(start + BATCH, total);
  let newlyFlagged = 0;
  for (let i = start; i < end; i++) {
    const e = entries[i];
    const rec = await s.get('answers/' + e.id + '.json', { type: 'json' }).catch(() => null);
    if (!rec || !rec.answer) continue;
    const reason = staleYearReason(e.question || rec.question || '', rec.answer, CURRENT, NEXT);
    if (reason) {
      if (!known.has(e.id)) { q.ids.push({ id: e.id, pillar: prefixOf(e.id), reason, url: urlFor(e.id), flagged_at: now }); known.add(e.id); newlyFlagged++; }
    } else if (known.has(e.id)) {
      // entry was fixed since last flag — drop it from the queue
      q.ids = q.ids.filter(x => x.id !== e.id); known.delete(e.id);
    }
  }
  st.cursor = end;
  st.flaggedThisPass += newlyFlagged;
  q.count = q.ids.length; q.updated_at = now;
  await s.setJSON('_year_audit_queue.json', q);

  // End of a full pass → email a digest, reset pass counters.
  let emailed = false;
  if (st.cursor >= total) {
    st.pass = (st.pass || 0) + 1;
    if (q.ids.length && (now - (st.lastEmail || 0) > EMAIL_EVERY_MS)) {
      const sample = q.ids.slice(0, 40).map(x => `<li><a href="${x.url}">${x.id}</a> — ${x.reason}</li>`).join('');
      await emailOwner(
        `PULSE year-accuracy audit: ${q.ids.length} entries need ${CURRENT}/${NEXT} refresh`,
        `<p>Continuous year-accuracy audit completed pass #${st.pass} over ${total} entries.</p>
         <p><b>${q.ids.length}</b> entries currently flagged as presenting a past year as current (target: ${CURRENT} or ${NEXT}).</p>
         <ul>${sample}</ul>
         <p>Full machine-readable queue: <code>_year_audit_queue.json</code> (Claude Code drains + fixes per the 4444 law).</p>`);
      st.lastEmail = now; emailed = true;
    }
    st.flaggedThisPass = 0;
  }
  await s.setJSON('_year_audit_state.json', st);

  return { statusCode: 200, body: JSON.stringify({ ok: true, year: CURRENT, scanned: `${start}-${end}/${total}`, newlyFlagged, queued: q.ids.length, pass: st.pass, emailed }) };
};
