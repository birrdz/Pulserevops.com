// Ensure every ca#### body includes the price disclaimer in ## Direct Answer
// and stamp hub/entry UI is separate (pulse-machine-entry.js + cars.html).
//
// Usage: node _ca_price_disclaimer_audit.js
//        node _ca_price_disclaimer_backfill.js [--dry-run]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');

const DISCLAIMER =
  "*Note: Prices vary significantly based on condition and market; these are representative of the model's typical market positioning.*";

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const DRY = process.argv.includes('--dry-run');
const SKIP_INDEX = process.argv.includes('--no-indexnow');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

function hasDisclaimer(text) {
  return /Prices vary significantly based on condition and market/i.test(String(text || ''));
}

function injectDisclaimer(answer) {
  if (hasDisclaimer(answer)) return answer;
  const m = answer.match(/(## Direct Answer[\s\S]*?)(?=\n## )/);
  if (m) {
    const block = m[1].trimEnd();
    return answer.replace(m[1], `${block}\n\n${DISCLAIMER}\n\n`);
  }
  // fallback: after first paragraph following H1
  const lines = answer.split(/\r?\n/);
  let h1 = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^#\s+/.test(lines[i])) { h1 = i; break; }
  }
  if (h1 >= 0) {
    let insertAt = h1 + 1;
    while (insertAt < lines.length && !lines[insertAt].trim()) insertAt++;
    while (insertAt < lines.length && lines[insertAt].trim() && !/^##\s/.test(lines[insertAt])) insertAt++;
    lines.splice(insertAt, 0, '', DISCLAIMER, '');
    return lines.join('\n');
  }
  return `${DISCLAIMER}\n\n${answer}`;
}

(async () => {
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const ids = (idx.entries || []).filter((e) => e && /^ca\d+$/i.test(e.id)).map((e) => e.id);
  let have = 0, need = 0, fixed = 0;
  const missing = [];

  for (const id of ids) {
    const e = await store.get(`answers/${id}.json`, { type: 'json' });
    if (!e || !e.answer) continue;
    if (hasDisclaimer(e.answer)) {
      have++;
    } else {
      need++;
      missing.push(id);
      if (!DRY) {
        const answer = injectDisclaimer(e.answer);
        if (answer !== e.answer) {
          await store.setJSON(`answers/${id}.json`, { ...e, answer, ts: Date.now(), polished_at: Date.now() });
          fixed++;
          if (!SKIP_INDEX) {
            try {
              await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }),
                signal: AbortSignal.timeout(8000),
              });
            } catch (_) {}
          }
          if (fixed % 50 === 0) console.log(`fixed ${fixed}/${need}…`);
        }
      }
    }
  }

  const report = { total: ids.length, have, need, fixed: DRY ? 0 : fixed, missing: missing.slice(0, 50), dryRun: DRY };
  fs.writeFileSync('C:/Users/koryj/website/_ca_price_disclaimer_report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
})().catch((e) => { console.error(e); process.exit(1); });
