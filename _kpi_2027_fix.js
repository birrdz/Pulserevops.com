// _kpi_2027_fix.js — ensure EVERY Pulse Industry KPIs (ik) question ends with " in 2027".
// Owner law: KPI pillar date suffix. Updates index question + blob (question, H1 echo, alt).
// Idempotent. Usage: node _kpi_2027_fix.js [--dry] [--audit]
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

try {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const PILLAR = 'ik';
const DRY = process.argv.includes('--dry');
const AUDIT_ONLY = process.argv.includes('--audit');

function endsIn2027(q) {
  return /\bin 2027\??\s*$/i.test(String(q || '').trim());
}

// Normalize ANY trailing-year form to a clean "... in 2027" suffix.
function yearize(q0) {
  let q = String(q0 || '').trim();
  if (!q) return q0;
  const hadQ = /\?\s*$/.test(q);
  if (hadQ) q = q.replace(/\?\s*$/, '').trim();
  if (/\bin 2027$/i.test(q)) return q0;
  q = q.replace(/[\s,;:–—-]*\(?(?:for\s+|in\s+)?(?:19|20)\d\d\)?\s*$/i, '').trim();
  q = q + ' in 2027';
  return hadQ ? q + '?' : q;
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const all = idx.entries.filter((e) => e && e.id && new RegExp(`^${PILLAR}\\d+$`, 'i').test(e.id));
  const alreadyOk = all.filter((e) => endsIn2027(e.question));
  const needsFix = all.filter((e) => !endsIn2027(e.question));

  const samples = [];
  const changed = [];
  let fixed = 0;
  let blobMissing = 0;

  for (const e of needsFix) {
    const oldQ = e.question || '';
    const newQ = yearize(oldQ);
    if (newQ === oldQ) continue;
    if (samples.length < 8) samples.push({ id: e.id, before: oldQ, after: newQ });

    if (AUDIT_ONLY) {
      fixed++;
      continue;
    }

    const a = await store.get(`answers/${e.id}.json`, { type: 'json' });
    if (a) {
      a.question = newQ;
      if (a.answer && oldQ) a.answer = a.answer.split(oldQ).join(newQ);
      a.kpi_2027_fix_at = Date.now();
      if (!DRY) await store.setJSON(`answers/${e.id}.json`, a);
    } else {
      blobMissing++;
    }
    e.question = newQ;
    changed.push(e.id);
    fixed++;
    if (!DRY && fixed % 50 === 0) console.log(`  …fixed ${fixed}`);
  }

  if (!DRY && !AUDIT_ONLY && fixed) await store.setJSON('_index.json', idx);
  if (!DRY && !AUDIT_ONLY && changed.length) {
    fs.writeFileSync('_kpi_2027_fixed_ids.json', JSON.stringify(changed, null, 0));
  }

  const report = {
    pillar: PILLAR,
    pillarName: 'Pulse Industry KPIs',
    dry: DRY,
    auditOnly: AUDIT_ONLY,
    totalEntries: all.length,
    alreadyOk: alreadyOk.length,
    needingFix: needsFix.length,
    fixed,
    blobMissing,
    indexWritten: !DRY && !AUDIT_ONLY && fixed > 0,
    samples,
  };
  console.log(JSON.stringify(report, null, 2));
})().catch((e) => {
  console.error('ERR', e && e.message);
  process.exit(1);
});
