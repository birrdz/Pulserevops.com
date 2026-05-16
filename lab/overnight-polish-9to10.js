// Polish loop — walks 9/10 entries to 10/10 via independent Groq grader.
// For each 9/10 entry: call pulse-grader-groq (free Llama 3.3 70B), and
// only on verdict=pass post the 9→10 bump with SUBAGENT_VERIFIED in the
// polish_note. No content additions at this rung — it's a fact-check gate.
//
// Pace: 180s between attempts = 20/hr. Idles 10 min when queue empty.

const { getStore } = require('@netlify/blobs');
const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }
const KEY = 'pulsemachine-writer-2026';
const GRADER_URL = 'https://pulserevops.com/.netlify/functions/pulse-grader-groq';
const POLISH_URL = 'https://pulserevops.com/.netlify/functions/pulse-blob-polish';
const PACE_MS = 180_000;
const MAX_ITER = 600;

const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

let iter = 0, okCount = 0, failCount = 0, gradeRejectCount = 0;

const REJECT_COOLDOWN_MS = 24 * 60 * 60 * 1000;

async function pickNext() {
  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries)) return null;
  const rejects = (await store.get('_grader_rejects.json', { type: 'json' })) || { entries: {} };
  const now = Date.now();
  const nines = idx.entries.filter(e => {
    const s = typeof e.quality_score === 'number' ? e.quality_score : 5;
    if (s !== 9 || !/^q\d+$/.test(String(e.id))) return false;
    const rej = rejects.entries && rejects.entries[e.id];
    if (rej && rej.ts && (now - rej.ts) < REJECT_COOLDOWN_MS) return false;
    return true;
  });
  if (!nines.length) return null;
  nines.sort((a, b) => {
    const na = parseInt(String(a.id).match(/\d+/)[0], 10);
    const nb = parseInt(String(b.id).match(/\d+/)[0], 10);
    return nb - na;
  });
  return nines[0];
}

async function gradeOne(id) {
  const r = await fetch(GRADER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: KEY, id }),
  });
  const j = await r.json().catch(() => ({}));
  return { status: r.status, body: j };
}

async function bumpOne(id, grade) {
  const note = 'SUBAGENT_VERIFIED — independent Groq Llama 3.3 70B grader returned verdict=pass score=' + (grade.score || 10) + (Array.isArray(grade.issues) && grade.issues.length ? ' issues=[' + grade.issues.slice(0, 3).join(' | ').slice(0, 200) + ']' : ' issues=none') + '. 9/10 to 10/10 fact-check gate.';
  const r = await fetch(POLISH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: KEY, id, polish_note: note }),
  });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok && j.ok, body: j, status: r.status };
}

(async () => {
  console.log('[' + new Date().toISOString() + '] overnight-polish-9to10 starting · pace=' + (PACE_MS/1000) + 's · max=' + MAX_ITER);
  while (iter < MAX_ITER) {
    iter++;
    try {
      const target = await pickNext();
      if (!target) {
        console.log('[' + new Date().toISOString() + '] no 9/10 entries · pausing 10 min');
        await sleep(10 * 60 * 1000);
        continue;
      }
      const grade = await gradeOne(target.id);
      if (!grade.body || !grade.body.ok) {
        failCount++;
        console.log('[' + new Date().toISOString() + '] iter ' + iter + ' · ' + target.id + ' GRADER FAIL · status ' + grade.status + ' · ' + (grade.body && grade.body.reason || ''));
      } else if (grade.body.verdict !== 'pass') {
        gradeRejectCount++;
        console.log('[' + new Date().toISOString() + '] iter ' + iter + ' · ' + target.id + ' GRADER REJECT · score=' + grade.body.score + ' · issues=' + (Array.isArray(grade.body.issues) ? grade.body.issues.slice(0, 3).join(' | ') : ''));
        // stays at 9/10 — but on next iteration we'd just re-grade the same one.
        // Park it: nothing in our control to bump score, so move on by writing a
        // marker that pickNext can use to skip recently-rejected entries.
        try {
          const blocked = (await store.get('_grader_rejects.json', { type: 'json' })) || { entries: {} };
          blocked.entries[target.id] = { ts: Date.now(), issues: grade.body.issues || [] };
          await store.setJSON('_grader_rejects.json', blocked);
        } catch (_e) {}
      } else {
        const r = await bumpOne(target.id, grade.body);
        if (r.ok) {
          okCount++;
          console.log('[' + new Date().toISOString() + '] iter ' + iter + ' · ' + target.id + ' 9->10 OK · totals ok=' + okCount + ' fail=' + failCount + ' reject=' + gradeRejectCount);
        } else {
          failCount++;
          console.log('[' + new Date().toISOString() + '] iter ' + iter + ' · ' + target.id + ' BUMP FAIL · ' + (r.body && r.body.reason || ('status ' + r.status)));
        }
      }
    } catch (e) { failCount++; console.error('iter ' + iter + ' ERR ' + e.message); }
    await sleep(PACE_MS);
  }
  console.log('=== 9->10 LOOP STOPPED === iter=' + iter + ' ok=' + okCount + ' fail=' + failCount + ' reject=' + gradeRejectCount);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
