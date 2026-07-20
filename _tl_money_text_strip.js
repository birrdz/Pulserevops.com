#!/usr/bin/env node
/**
 * Strip money/pricing figures from tl answer bodies (blob-only).
 * Does NOT change index question titles / sitemaps / SEO URLs.
 *
 *   PILOT=tl9495,tl15711 node _tl_money_text_strip.js
 *   node _tl_money_text_strip.js          # all tl with $
 *   LIMIT=200 node _tl_money_text_strip.js
 */
const fs = require('fs');
const { getStore } = require('/workspace/node_modules/@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const LOG = '/tmp/tl-money-text-strip.log';
const REPORT = '/tmp/tl-money-text-strip-report.json';
const STATE = '/tmp/tl-money-text-strip-state.json';

try {
  const envPath = '/tmp/aq-drip.env';
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  }
} catch (_e) {}

const cfg = require('/home/ubuntu/.config/netlify/config.json');
const token = Object.values(cfg.users || {})[0].auth.token;
const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token });

function log(s) {
  const line = `[${new Date().toISOString()}] ${s}`;
  console.log(line);
  fs.appendFileSync(LOG, line + '\n');
}

/** Explicit compensation / fee phrases (month, annualized, salary, etc.). */
const PRICE_PHRASE_RE =
  /\$\s?\d[\d,]*(?:\.\d+)?(?:\s*[kKmMbB])?(?:\s*[–—\-to]+\s*\$?\s?\d[\d,]*(?:\.\d+)?(?:\s*[kKmMbB])?)?\s*(?:\/\s*(?:mo(?:nth)?|yr|year|hr|hour)|per\s+(?:month|year|hour)|annualized|a\s+year|\/year|\/yr|per\s+year|base\s+salary(?:\s*\+\s*benefits(?:\s*\+\s*equity)?)?|total\s+compensation)/gi;

/** Dollar amounts with thousands separators — almost always price/comp, not ARR bands. */
const PRICE_COMMA_RE =
  /\$\s?\d{1,3}(?:,\d{3})+(?:\.\d+)?(?:\s*[–—\-to]+\s*\$?\s?\d{1,3}(?:,\d{3})+(?:\.\d+)?)?/g;

/** Bare $ before numbers (ARR bands like $10M, bio $3 billion) — drop only $. */
const BARE_DOLLAR_RE = /\$(\d)/g;

function stripMoneyText(answer) {
  let s = String(answer || '');
  const before = (s.match(/\$/g) || []).length;
  if (!before) return { next: s, removed: 0, before: 0, after: 0 };

  // 1) remove fee/comp phrases
  s = s.replace(PRICE_PHRASE_RE, 'a retainer');
  // 2) remove comma-formatted currency amounts / ranges
  s = s.replace(PRICE_COMMA_RE, 'a retainer');
  // 3) collapse duplicate retainer tokens
  s = s.replace(/(?:a retainer\s*){2,}/gi, 'a retainer ');
  s = s.replace(/between\s+a retainer\s+and\s+a retainer/gi, 'a retainer');
  s = s.replace(/from\s+a retainer\s+to\s+a retainer/gi, 'a retainer');
  s = s.replace(/a retainer\s*[–—\-]\s*a retainer/gi, 'a retainer');
  // 4) remaining $digits → digits (keep 10M–50M ARR readable)
  s = s.replace(BARE_DOLLAR_RE, '$1');

  // 5) cleanup
  s = s
    .replace(/\*\*\s*\*\*/g, '')
    .replace(/\*\*(a retainer)\*\*/gi, '$1')
    .replace(/\(\s*\)/g, '')
    .replace(/\[\s*\]/g, '')
    .replace(/\ba retainer\s+annualized\b/gi, 'a retainer')
    .replace(/\btypically\s+costs?\s+\*\*a retainer\*\*/gi, 'is typically scoped as a retainer')
    .replace(/\bcosts?\s+between,\s*/gi, 'is scoped as ')
    .replace(/\bcosts?\s+a retainer\b/gi, 'is scoped as a retainer')
    .replace(/\bis typically scoped as a retainer annualized\b/gi, 'is typically scoped as a retainer')
    .replace(/\btypically\s+is scoped\b/gi, 'is typically scoped')
    .replace(/\bexpect\s+a retainer\s+for\b/gi, 'expect a retainer engagement for')
    .replace(/\btypically\s+a retainer\b/gi, 'typically a retainer')
    .replace(/\bpay\s+a retainer\b/gi, 'budget a retainer')
    .replace(/\bflat\s+a retainer\b/gi, 'a flat retainer')
    .replace(/\bafford\s+a retainer\+?\/month\b/gi, 'afford a full-time hire')
    .replace(/\bfor a ARR\b/gi, 'for an ARR')
    .replace(/\bAt ARR\b/g, 'At higher ARR')
    .replace(/\s{2,}/g, ' ')
    .replace(/ +([,.;:])/g, '$1')
    .replace(/([.!?])\s*\./g, '$1')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');

  const after = (s.match(/\$/g) || []).length;
  return { next: s, removed: before - after, before, after };
}

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE, 'utf8'));
  } catch {
    return { done: [], fixed: [], skipped: [], errors: [] };
  }
}

function saveState(st) {
  fs.writeFileSync(STATE, JSON.stringify(st, null, 2));
}

async function main() {
  const pilot = String(process.env.PILOT || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const limit = Number(process.env.LIMIT || 0) || 0;
  const st = loadState();
  const doneSet = new Set(st.done || []);

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let ids = (idx.entries || [])
    .map((e) => e && e.id)
    .filter((id) => id && /^tl\d+$/i.test(id));

  if (pilot.length) ids = pilot;
  ids = ids.filter((id) => !doneSet.has(id));
  if (limit > 0) ids = ids.slice(0, limit);

  log(`START ids=${ids.length} pilot=${pilot.length || 'no'} alreadyDone=${doneSet.size}`);

  const stats = { scanned: 0, fixed: 0, skipped: 0, errors: 0, dollarsRemoved: 0 };

  for (const id of ids) {
    stats.scanned++;
    try {
      const entry = await store.get('answers/' + id + '.json', { type: 'json' });
      if (!entry || !entry.answer) {
        st.skipped.push(id);
        st.done.push(id);
        stats.skipped++;
        saveState(st);
        continue;
      }
      if (!String(entry.answer).includes('$')) {
        st.skipped.push(id);
        st.done.push(id);
        stats.skipped++;
        if (stats.scanned % 200 === 0) log(`scan ${stats.scanned}/${ids.length} fixed=${stats.fixed}`);
        saveState(st);
        continue;
      }

      const { next, removed, before, after } = stripMoneyText(entry.answer);
      if (removed <= 0 || next === entry.answer) {
        st.skipped.push(id);
        st.done.push(id);
        stats.skipped++;
        saveState(st);
        continue;
      }

      entry.answer = next;
      entry.updated_at = new Date().toISOString();
      entry.money_text_stripped_at = entry.updated_at;
      // Never revive title-baked flux covers while stripping money text.
      try {
        const { lockTlAnswerEntry } = require('/workspace/_tl_cover_lock_lib');
        const locked = lockTlAnswerEntry(entry, id);
        Object.assign(entry, locked.entry);
      } catch (_e) {}
      await store.setJSON('answers/' + id + '.json', entry);

      st.fixed.push({ id, before, after, removed });
      st.done.push(id);
      stats.fixed++;
      stats.dollarsRemoved += removed;
      if (stats.fixed <= 20 || stats.fixed % 50 === 0) {
        log(`FIXED ${id} $${before}→$${after} (−${removed})`);
      }
      saveState(st);
    } catch (e) {
      stats.errors++;
      st.errors.push({ id, err: String(e.message || e) });
      log(`ERR ${id} ${e.message || e}`);
      saveState(st);
    }
  }

  const report = { at: new Date().toISOString(), stats, sampleFixed: (st.fixed || []).slice(-20) };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  log(`DONE ${JSON.stringify(stats)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
