#!/usr/bin/env node
/**
 * Remove WHOLE money/pricing SECTIONS from tl answers — owner screenshots.
 * Targets heading blocks + tables + key cost sentences (not just $ glyphs).
 *
 * SAFETY: refuse to run unless ALLOW_MONEY_SECTION_STRIP=1 (paused while tl finish drip runs).
 * Never strip Direct Answer / CRO Businesses / FAQ / Sources / Related.
 *
 *   ALLOW_MONEY_SECTION_STRIP=1 LIMIT=1200 node _tl_money_section_strip.js
 *   ALLOW_MONEY_SECTION_STRIP=1 PILOT=tl10740,tl9495,tl15711 node _tl_money_section_strip.js
 */
const fs = require('fs');
const { getStore } = require('/workspace/node_modules/@netlify/blobs');
const { lockTlAnswerEntry } = require('/workspace/_tl_cover_lock_lib');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const LOG = '/tmp/tl-money-section-strip.log';
const REPORT = '/tmp/tl-money-section-strip-report.json';
const STATE = '/tmp/tl-money-section-strip-state.json';

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

/** Protected structural headings — never enter section-skip on these. */
const PROTECTED_HEAD_RE =
  /^(?:Direct Answer|CRO Businesses Near You|FAQ|Sources|Related(?: on PULSE)?|How to Vet|Why .+|What to Look For|The Remote vs\.? Local|How to Structure)\b/i;

/** Headings that mean "nuke this whole section" (exact money titles only). */
const SECTION_HEAD_RE =
  /^(?:Cost Structure(?:\s*:\s*What You['’]?ll Actually Pay)?|What You['’]?ll Actually Pay|What You Actually Get for the Money|The cost breakdown you need to see|How to evaluate fractional CRO pricing(?: for your company)?|Fractional CRO pricing(?: in \d{4})?|Pricing(?: breakdown| guide| comparison)\b|Compensation(?: breakdown)?\b|Salary(?: vs\.? retainer)?\b|Cost comparison\b|Monthly cost\b|What does (?:a )?fractional CRO cost\b|Cost of a fractional CRO\b|Budget(?:ing)? for a fractional CRO\b|What is the typical monthly (?:cost|price) range\b)/i;

/** Fence/step blocks whose title is a money section. */
const FENCE_TITLE_RE =
  /(?:title|heading)\s*:\s*(?:How to evaluate fractional CRO pricing|Cost Structure|What You['’]?ll Actually Pay|cost breakdown|Monthly cost)\b/i;

/** Standalone paragraphs / table rows that are pure money talk. */
const KILL_LINE_RE =
  /(?:\$\s?\d|\b\d+\s*[kK]\s*[–—\-]\s*\d+\s*[kK]\b|\b\d{1,3}(?:,\d{3})+\s*[–—\-]\s*\d{1,3}(?:,\d{3})+\b).{0,40}(?:annualized|\/\s*mo(?:nth)?|per\s+month|per\s+year|base\s+salary|total\s+compensation)|^\s*[-*]\s*Monthly cost\b|^\s*\|\s*Monthly cost\b|Expect costs?\s+between\b|typically costs?\b|expect to pay\b|half the cost of a full-time|runs?\s+\$?\d|pay\s+\$?\d|budget\s+\$?\d/i;

function headingText(line) {
  return String(line || '')
    .trim()
    .replace(/^#{1,6}\s+/, '')
    .trim();
}

function isProtectedHead(line) {
  const t = String(line || '').trim();
  if (!/^#{1,4}\s+/.test(t)) return false;
  return PROTECTED_HEAD_RE.test(headingText(t));
}

function isSectionHead(line) {
  const t = String(line || '').trim();
  if (!/^#{2,4}\s+/.test(t)) return false;
  if (isProtectedHead(t)) return false;
  // Only pure heading lines (no body glued on) — max ~120 chars after hashes
  const ht = headingText(t);
  if (ht.length > 120) return false;
  return SECTION_HEAD_RE.test(ht);
}

function stripMoneySections(answer) {
  const src = String(answer || '').replace(/\r\n/g, '\n');
  const lines = src.split('\n');
  const out = [];
  const removed = [];
  let i = 0;
  let skipping = false;
  let skipHead = '';

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Enter skip on money heading
    if (!skipping && isSectionHead(line)) {
      skipping = true;
      skipHead = trimmed.slice(0, 80);
      removed.push('section:' + skipHead);
      i++;
      continue;
    }

    // Enter skip on ```steps / ``` block with money title on same or next lines
    if (!skipping && /^```/.test(trimmed)) {
      const fence = [line];
      let j = i + 1;
      let titleHit = FENCE_TITLE_RE.test(line);
      while (j < lines.length && !/^```/.test(lines[j].trim())) {
        fence.push(lines[j]);
        if (FENCE_TITLE_RE.test(lines[j]) || /evaluate fractional CRO pricing|Cost Structure|What You['’]?ll Actually Pay/i.test(lines[j])) {
          titleHit = true;
        }
        // also kill compare tables that are mostly Monthly cost / salary
        if (/Monthly cost|base salary|total compensation|\$\d.*\/month/i.test(lines[j])) titleHit = true;
        j++;
      }
      if (j < lines.length) fence.push(lines[j]);
      // Only drop fences that are clearly money-eval blocks (title/heading), not related-link lists
      const fenceText = fence.join('\n');
      const isMoneyFence =
        titleHit &&
        FENCE_TITLE_RE.test(fenceText) &&
        !/Related|FAQ|Sources|CRO Businesses/i.test(fence[0] || '');
      if (isMoneyFence) {
        removed.push('fence:' + (fence.find((l) => /title:|Cost Structure|pricing/i.test(l)) || 'money-fence').trim().slice(0, 80));
        i = j + 1;
        continue;
      }
    }

    if (skipping) {
      // stop at next same-or-higher heading, or thematic break, or new fence
      if ((/^#{1,3}\s+/.test(trimmed) && !isSectionHead(line)) || isProtectedHead(line)) {
        skipping = false;
        // fall through to keep this new heading
      } else if (/^---+$/.test(trimmed) || /^```/.test(trimmed)) {
        skipping = false;
        // fall through
      } else {
        i++;
        continue;
      }
    }

    // Kill individual money lines / table rows (keep structure otherwise)
    if (KILL_LINE_RE.test(line) && !/^#{1,6}\s+/.test(trimmed) && !/^```/.test(trimmed)) {
      removed.push('line:' + trimmed.slice(0, 70));
      i++;
      continue;
    }

    out.push(line);
    i++;
  }

  let next = out.join('\n');
  // collapse excess blanks
  next = next.replace(/\n{3,}/g, '\n\n').trim() + '\n';

  // Direct Answer: strip money sentences inside the lead block only
  next = next.replace(
    /(##\s*Direct Answer\b[^\n]*\n)([\s\S]*?)(?=\n##\s|\n```|\n---\s*\n|$)/i,
    (full, head, body) => {
      const sentences = body.split(/(?<=[.!?])\s+/);
      const kept = sentences.filter((s) => {
        if (/\$\s?\d|\b\d+\s*[kK]\s*[–—\-]\s*\d+\s*[kK]\b|annualized|per month|\/month|expect to pay|typically costs?|half the cost|retainer for a part-time|costs between/i.test(s)) {
          removed.push('da:' + s.slice(0, 70));
          return false;
        }
        return true;
      });
      const nb = kept.join(' ').replace(/\s{2,}/g, ' ').trim();
      return head + (nb ? nb + '\n\n' : '\n');
    }
  );

  next = next.replace(/\n{3,}/g, '\n\n').trim() + '\n';
  return { next, removed };
}

function looksMoneyPage(title, body) {
  const t = String(title || '') + '\n' + String(body || '').slice(0, 2500);
  return /cost|pric(?:e|ing)|how much|salary|compensat|retainer|annualized|\/month|hire a fractional|interim CRO|what (?:does|do).+cost/i.test(t);
}

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE, 'utf8'));
  } catch {
    return { done: [], fixed: [], skipped: [], errors: [] };
  }
}

function saveState(st) {
  fs.writeFileSync(STATE, JSON.stringify(st));
}

async function main() {
  if (process.env.ALLOW_MONEY_SECTION_STRIP !== '1') {
    console.error(
      'REFUSED: money section strip paused (owner pivot → CRO Pulse Tools tl finish). Set ALLOW_MONEY_SECTION_STRIP=1 to run.'
    );
    process.exit(2);
  }
  const pilot = String(process.env.PILOT || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const limit = Number(process.env.LIMIT || 0) || 0;
  const minFix = Number(process.env.MIN_FIX || 1000) || 1000;
  const st = loadState();
  const doneSet = new Set(st.done || []);

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let rows = (idx.entries || []).filter((e) => e && /^tl\d+$/i.test(e.id));

  // Prefer cost/hire/pricing titles first so we hit 1000+ money pages
  rows.sort((a, b) => {
    const score = (e) => {
      const q = String(e.question || '');
      let s = 0;
      if (/cost|how much|pric/i.test(q)) s += 5;
      if (/hire|interim|fractional CRO/i.test(q)) s += 3;
      if (/salary|compensat|budget/i.test(q)) s += 2;
      return -s;
    };
    return score(a) - score(b) || Number(String(a.id).slice(2)) - Number(String(b.id).slice(2));
  });

  let ids = rows.map((e) => e.id);
  if (pilot.length) ids = pilot;
  ids = ids.filter((id) => !doneSet.has(id));
  if (limit > 0) ids = ids.slice(0, limit);

  log(`START ids=${ids.length} minFix=${minFix} alreadyDone=${doneSet.size}`);

  const stats = { scanned: 0, fixed: 0, skipped: 0, errors: 0, sections: 0 };
  const titleOf = Object.fromEntries(rows.map((e) => [e.id, e.question]));

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

      const title = entry.question || titleOf[id] || '';
      if (!pilot.length && !looksMoneyPage(title, entry.answer)) {
        // still try strip — cheap — but only count if removed
      }

      const beforeLen = String(entry.answer || '').length;
      const { next, removed } = stripMoneySections(entry.answer);
      if (!removed.length || next === entry.answer) {
        st.skipped.push(id);
        st.done.push(id);
        stats.skipped++;
        if (stats.scanned % 500 === 0) log(`scan ${stats.scanned} fixed=${stats.fixed}`);
        saveState(st);
        continue;
      }
      // Never write a gutted body
      if (next.length < Math.min(800, Math.floor(beforeLen * 0.35))) {
        log(`SKIP_GUT ${id} before=${beforeLen} after=${next.length} removed=${removed.length}`);
        st.skipped.push(id);
        st.done.push(id);
        stats.skipped++;
        saveState(st);
        continue;
      }
      if (!/##\s*Direct Answer\b/i.test(next) && /##\s*Direct Answer\b/i.test(entry.answer)) {
        log(`SKIP_LOST_DA ${id}`);
        st.skipped.push(id);
        st.done.push(id);
        stats.skipped++;
        saveState(st);
        continue;
      }

      let save = Object.assign({}, entry, {
        answer: next,
        updated_at: new Date().toISOString(),
        money_section_stripped_at: new Date().toISOString(),
        money_sections_removed: removed.length,
      });
      try {
        save = lockTlAnswerEntry(save, id).entry;
      } catch (_e) {}

      await store.setJSON('answers/' + id + '.json', save);
      st.fixed.push({ id, n: removed.length, sample: removed.slice(0, 3) });
      st.done.push(id);
      stats.fixed++;
      stats.sections += removed.length;
      if (stats.fixed <= 15 || stats.fixed % 50 === 0) {
        log(`FIXED ${id} removed=${removed.length} · ${removed[0]}`);
      }
      saveState(st);

      if (!pilot.length && stats.fixed >= minFix && process.env.STOP_AT_MIN === '1') {
        log(`hit minFix=${minFix} — stopping early`);
        break;
      }
    } catch (e) {
      stats.errors++;
      st.errors.push({ id, err: String(e.message || e) });
      log('ERR ' + id + ' ' + (e.message || e));
      saveState(st);
    }
  }

  const report = {
    at: new Date().toISOString(),
    stats,
    sampleFixed: (st.fixed || []).slice(-30),
  };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  log('DONE ' + JSON.stringify(stats));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
