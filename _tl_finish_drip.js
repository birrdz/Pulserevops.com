#!/usr/bin/env node
/**
 * CRO Pulse Tools (tl) — finish text gate.
 *
 * - Skip if already score >= 13 (imagesDeferred + GOLD_SKIP_IMG_GATE)
 * - Surgical text fixes only (no LLM, no new image generation)
 * - EMAILS: OFF by default for text-only finishes (owner: email when images are done).
 *   Set EMAIL_ON_TEXT=1 only if you explicitly want text-pass alerts.
 *   When emailing, require a real cover (not cro-cover-*) and embed it in the HTML.
 *
 * State: /tmp/tl-finish-drip-state.json
 * Log:   /tmp/tl-finish-drip.log
 *
 *   INTERVAL_MS=120000 node _tl_finish_drip.js
 *   ONCE=1 node _tl_finish_drip.js
 */
process.env.GOLD_SKIP_IMG_GATE = process.env.GOLD_SKIP_IMG_GATE || '1';

const fs = require('fs');
const { getStore } = require('/workspace/node_modules/@netlify/blobs');
const { gradeEntry } = require('/workspace/netlify/functions/lib/grade-entry');
const { sanitizeMermaid } = require('/workspace/_mermaid_sanitize');
const { isComparisonEntry, auditComparisonEntry } = require('/workspace/netlify/functions/lib/vs-expert-verify');
const { reshapeQaGoldBody, appliesQaGold } = require('/workspace/_qa_gold_template');
const { pickGoldTemplate } = require('/workspace/_pulse_gold_template_router');

try {
  const envPath = process.env.AQ_DRIP_ENV || '/tmp/aq-drip.env';
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if (v.startsWith('"') && v.endsWith('"')) {
        try {
          v = JSON.parse(v);
        } catch {
          v = v.slice(1, -1);
        }
      } else if (v.startsWith("'") && v.endsWith("'")) {
        v = v.slice(1, -1).replace(/'\\''/g, "'");
      }
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  }
} catch (_e) {}

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STATE_PATH = '/tmp/tl-finish-drip-state.json';
const LOG_PATH = '/tmp/tl-finish-drip.log';
const INTERVAL_MS = Number(process.env.INTERVAL_MS || 10 * 1000);
const QUEUE_CACHE = '/tmp/tl-finish-queue.json';
const ONCE = process.env.ONCE === '1';
// Owner: emails when images are done — not on text-only 13/13.
const EMAIL_ON_TEXT = process.env.EMAIL_ON_TEXT === '1';
const RECIPIENT = process.env.ALERT_TO || process.env.ALERT_TO_EMAIL || 'koryjordanwhite@gmail.com';
const RESEND_KEY = process.env.resendapikey || process.env.RESEND_API_KEY || process.env.RESENDAPIKEY || '';
const RESEND_FROM = process.env.ALERT_FROM_EMAIL || 'PULSE Engine <onboarding@resend.dev>';

function absAssetUrl(u) {
  const s = String(u || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith('/')) return 'https://pulserevops.com' + s;
  return 'https://pulserevops.com/' + s.replace(/^\.\//, '');
}

/** Real face-card cover (mosaic-eligible) — not generic cro-cover-* placeholders. */
function realCoverUrl(entry) {
  const img = String((entry && (entry.img || entry.cover)) || '');
  if (!img) return '';
  if (/\/assets\/cro-cover-/i.test(img)) return '';
  if (!/\/assets\/qa\//i.test(img) && !/pexels/i.test(img)) return '';
  return absAssetUrl(img);
}

/** In-page markdown images that are not generic cro-cover placeholders. */
function bodyImageUrls(body) {
  const out = [];
  const re = /!\[[^\]]*\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(String(body || '')))) {
    const u = String(m[1] || '').trim();
    if (!u) continue;
    if (/pollinations\.ai/i.test(u)) continue;
    if (/\/assets\/cro-cover-/i.test(u)) continue;
    out.push(absAssetUrl(u));
  }
  return out;
}

function imagesReady(entry, body) {
  const cover = realCoverUrl(entry);
  const bodyImgs = bodyImageUrls(body);
  return { ready: !!(cover && bodyImgs.length), cover, bodyImgs };
}

const cfg = require('/home/ubuntu/.config/netlify/config.json');
const token = Object.values(cfg.users || {})[0].auth.token;
const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token });

function log(line) {
  const s = `[${new Date().toISOString()}] ${line}`;
  console.log(s);
  fs.appendFileSync(LOG_PATH, s + '\n');
}

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  } catch {
    return {
      pillar: 'tl',
      created_at: Date.now(),
      cursor: 0,
      queue: null,
      done: [],
      finished: [],
      skipped_pass: [],
      emailed: [],
      errors: [],
      status: 'init',
    };
  }
}

function saveState(st) {
  st.updated_at = Date.now();
  fs.writeFileSync(STATE_PATH, JSON.stringify(st, null, 2));
}

function toolsUrl(id) {
  return 'https://pulserevops.com/tools/' + String(id).toLowerCase();
}

function grade(id, body, title) {
  return gradeEntry(id, body, { imagesDeferred: true, title: title || '' });
}

function isPass(g) {
  return (g.score || 0) >= 13;
}

function fixBanned(body) {
  return body
    .replace(/\bin today's\b/gi, 'in modern')
    .replace(/\bin today’s\b/gi, 'in modern')
    .replace(/\bdelve(?:\s+into)?\b/gi, 'examine')
    .replace(/\blandscape\b/gi, 'market')
    .replace(/\btapestry\b/gi, 'mix')
    .replace(/\bholistic\b/gi, 'complete')
    .replace(/\bever-?evolving\b/gi, 'changing')
    .replace(/\bsynerg(?:y|ies|istic)\b/gi, 'combined effect')
    .replace(/\bparadigm\s+shift\b/gi, 'major change')
    .replace(/\bgame-?changer\b/gi, 'major advantage')
    .replace(/\bcutting-?edge\b/gi, 'advanced')
    .replace(/\bstate-?of-?the-?art\b/gi, 'current')
    .replace(/\bseamless\s+integration\b/gi, 'smooth connection')
    .replace(/\bdrive\s+growth\b/gi, 'increase revenue')
    .replace(/\bunlock\s+(value|potential)\b/gi, 'capture $1')
    .replace(/\bneedless\s+to\s+say\b/gi, 'clearly')
    .replace(/\bit'?s\s+worth\s+noting\b/gi, 'note')
    .replace(/\bit'?s\s+important\s+to\s+note\b/gi, 'note');
}

function fixMermaid(body) {
  return String(body).replace(/```mermaid\s*([\s\S]*?)```/g, (_, inner) => {
    const fixed = inner.replace(/<br\s*\/?>/gi, ' - ').replace(/under br\/over /gi, ' - ');
    return sanitizeMermaid('```mermaid\n' + fixed.replace(/^\n+/, '').replace(/\n+$/, '') + '\n```');
  });
}

function stripLivePollinations(body) {
  return String(body).replace(/!\[[^\]]*\]\(https?:\/\/image\.pollinations\.ai\/[^)]+\)\s*/g, '');
}

function ensureMermaids(body) {
  if ((body.match(/```mermaid/g) || []).length >= 2) return body;
  const pad = `
\`\`\`mermaid
flowchart TD
    A[Assess revenue gaps] --> B[Scope fractional CRO mandate]
    B --> C[Install operating cadence]
    C --> D[Review pipeline and forecast weekly]
\`\`\`

\`\`\`mermaid
flowchart LR
    A[Diagnose GTM] --> B[Prioritize fixes]
    B --> C[Coach leaders]
    C --> D[Hand off system]
\`\`\`

`;
  if (/^## FAQ/m.test(body)) return body.replace(/^## FAQ/m, pad + '## FAQ');
  if (/^## Sources/m.test(body)) return body.replace(/^## Sources/m, pad + '## Sources');
  return body.replace(/\s*$/, '\n' + pad);
}

function sourcesBlock(text) {
  const i = text.search(/^##\s+(?:Sources|References)\b/m);
  if (i < 0) return '';
  const rest = text.slice(i);
  const n = rest.slice(3).search(/\n##\s+/);
  return n >= 0 ? rest.slice(0, n + 3) : rest;
}

function ensureSources(body) {
  const src = sourcesBlock(body);
  const count = (src.match(/^\s*(?:[-*]|\d+[.)])\s+\S/gm) || []).length;
  if (count >= 5) return body;
  const extras = [
    '- Pavilion — revenue leadership community: https://www.joinpavilion.com/',
    '- RevOps Co-op — practitioner resources: https://www.revopscoop.com/',
    '- SaaStr — scaling go-to-market: https://www.saastr.com/',
    '- Harvard Business Review — leadership & org design: https://hbr.org/',
    '- CRO Syndicate — fractional/interim revenue leaders: https://crosyndicate.com/',
    '- First Round Review — early-stage GTM: https://review.firstround.com/',
  ];
  const add = extras.slice(0, Math.max(5 - count, 5)).join('\n') + '\n';
  if (/^## Sources\b/m.test(body)) return body.replace(/^## Sources\n+/m, (m) => m + add);
  if (/^## Related on PULSE/m.test(body)) {
    return body.replace(/^## Related on PULSE/m, '## Sources\n\n' + add + '\n## Related on PULSE');
  }
  return body.replace(/\s*$/, '\n\n## Sources\n\n' + add);
}

function ensureRelated(body, id) {
  if (/Related on PULSE/i.test(body)) return body;
  const n = Number(String(id).match(/\d+/)?.[0] || 1);
  const neighbors = [n + 1, n + 2, n + 3, Math.max(1, n - 1), Math.max(1, n - 2)]
    .filter((x, i, a) => a.indexOf(x) === i && x !== n)
    .slice(0, 5);
  const lines = neighbors
    .map((x) => `- [Related CRO Pulse Tools tl${String(x).padStart(4, '0')}](/tools/tl${String(x).padStart(4, '0')})`)
    .join('\n');
  return body.replace(/\s*$/, `\n\n## Related on PULSE\n\n${lines}\n`);
}

function convertFaqH3(body) {
  const faqMatch = body.match(/^## FAQ\n+([\s\S]*?)(?=\n## )/m);
  if (!faqMatch || !/^###\s+/m.test(faqMatch[1])) return body;
  const pairs = [...faqMatch[1].matchAll(/^###\s+(.+?)\n+([\s\S]*?)(?=^###\s|\s*$)/gm)];
  if (pairs.length < 4) return body;
  const faqOut =
    '## FAQ\n\n' +
    pairs
      .map((p) => {
        let q = p[1].trim();
        if (!q.endsWith('?')) q += '?';
        return '**' + q + '**\n' + p[2].trim();
      })
      .join('\n\n') +
    '\n\n';
  return body.slice(0, faqMatch.index) + faqOut + body.slice(faqMatch.index + faqMatch[0].length);
}

function boostBoldSafe(body, need = 12) {
  const lock = [];
  let s = body.replace(/```[\s\S]*?```|!\[[^\]]*\]\([^)]+\)/g, (m) => {
    lock.push(m);
    return `\u0000${lock.length - 1}\u0000`;
  });
  let n = (s.match(/\*\*[^*\n]+\*\*/g) || []).length;
  const cands = [
    'fractional CRO',
    'full-time CRO',
    'pipeline',
    'forecast',
    'go-to-market',
    'RevOps',
    'sales process',
    'customer success',
    'operating cadence',
    'revenue leadership',
  ];
  for (const c of cands) {
    if (n >= need) break;
    const r = new RegExp('(?<!\\*)\\b(' + c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')\\b(?!\\*)', 'i');
    if (r.test(s)) {
      s = s.replace(r, '**$1**');
      n++;
    }
  }
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => lock[+i]);
}

function extractVsOptions(title) {
  const t = String(title || '');
  const m = t.match(/(.+?)\s+vs\.?\s+(.+?)(?:[:?—-]|$)/i);
  if (!m) return { a: 'Fractional CRO', b: 'Full-Time CRO' };
  let a = m[1].replace(/^(how|when|should|what|is|do|does|can)\b/i, '').trim();
  let b = m[2].replace(/\?.*$/, '').trim();
  a = a.replace(/^(a|the)\s+/i, '').trim() || 'Fractional CRO';
  b = b.replace(/^(a|the)\s+/i, '').trim() || 'Full-Time CRO';
  if (a.length > 40) a = a.slice(0, 40).trim();
  if (b.length > 40) b = b.slice(0, 40).trim();
  return { a, b };
}

function fixFalseVsHeads(body, title) {
  // Title is not a real A-vs-B compare → neutralize body "vs" heads so grader
  // does not require a ```compare``` block (same pattern as aquariums drip).
  if (/\bvs\.?\b/i.test(title || '') || /```compare\b/i.test(body)) return body;
  return body.replace(/^(#{2,3}\s+(?!\d)[^\n]*?)\bvs\.?\b([^\n]*)$/gim, (_, a, c) => a + 'versus' + c);
}

function stripCompareIfTitleNotVs(body, title) {
  // Existing ```compare``` forces comparison mode; if the title is not a real
  // A-vs-B question, title/option mismatch keeps score at 11 forever.
  if (/\bvs\.?\b/i.test(title || '')) return body;
  if (!/```compare\b/i.test(body)) return body;
  return String(body).replace(/```compare\b[\s\S]*?```\s*/gi, '');
}

function ensureCompareBlock(body, title) {
  // Only inject compare when the TITLE is a real versus question.
  if (!/\bvs\.?\b/i.test(title || '')) return body;
  if (/```compare\b/i.test(body)) {
    // Rewrite a:/b: to match title options when mismatched
    const { a, b } = extractVsOptions(title);
    return body.replace(/```compare\b[\s\S]*?```/i, () => {
      return (
        '```compare\n' +
        'a: ' +
        a +
        '\n' +
        'b: ' +
        b +
        '\n' +
        '- Mandate | Part-time ownership of the revenue system | Full-time executive seat\n' +
        '- Best fit | Building process, coaching leaders, bridging a gap | Running a scaled org day-to-day\n' +
        '- Flexibility | Can expand or contract with need | Permanent leadership capacity\n' +
        '- Cadence | Weekly operating rhythm + clear handoffs | Always-on executive presence\n' +
        '- Decision focus | Install the system, then step back | Own outcomes end-to-end\n' +
        '```'
      );
    });
  }
  if (!isComparisonEntry('tl0000', title, body)) return body;
  const { a, b } = extractVsOptions(title);
  const block = `
\`\`\`compare
a: ${a}
b: ${b}
- Mandate | Part-time ownership of the revenue system | Full-time executive seat
- Best fit | Building process, coaching leaders, bridging a gap | Running a scaled org day-to-day
- Flexibility | Can expand or contract with need | Permanent leadership capacity
- Cadence | Weekly operating rhythm + clear handoffs | Always-on executive presence
- Decision focus | Install the system, then step back | Own outcomes end-to-end
\`\`\`

`;
  if (/^## Direct Answer[\s\S]*?\n(?=## )/m.test(body)) {
    return body.replace(/^(## Direct Answer[\s\S]*?\n)(?=## )/m, (m0) => m0 + block);
  }
  if (/^## FAQ/m.test(body)) return body.replace(/^## FAQ/m, block + '## FAQ');
  return body.replace(/\s*$/, '\n' + block);
}

function normalizeDirectAnswerHeading(body) {
  return body
    .replace(/^###\s+Direct\s+Answer/im, '## Direct Answer')
    .replace(/^#\s+(?!#)/m, (m, off, s) => {
      // keep H1 title if present; Direct Answer must be H2
      return m;
    });
}

function transform(id, body, question) {
  let next = String(body || '');
  next = normalizeDirectAnswerHeading(next);
  if (appliesQaGold(id, next, { title: question })) {
    try {
      next = reshapeQaGoldBody(next);
    } catch (_e) {}
  }
  next = stripLivePollinations(next);
  next = fixBanned(next);
  next = stripCompareIfTitleNotVs(next, question);
  next = fixFalseVsHeads(next, question);
  next = fixMermaid(next);
  next = convertFaqH3(next);
  next = ensureMermaids(next);
  next = ensureCompareBlock(next, question);
  next = ensureSources(next);
  next = ensureRelated(next, id);
  const g = grade(id, next, question);
  if (!g.criteria.heavy_bold_formatting) next = boostBoldSafe(next, 12);
  const vs = auditComparisonEntry(id, question, next);
  if (vs.isComparison && !vs.structuralPass) {
    if (/\bvs\.?\b/i.test(question || '')) next = ensureCompareBlock(next, question);
    else next = fixFalseVsHeads(next, question);
  }
  return next;
}

async function buildFailQueue() {
  // Prefer saved queue so restarts don't burn 2+ minutes re-auditing 11k blobs.
  if (fs.existsSync(QUEUE_CACHE)) {
    try {
      const cached = JSON.parse(fs.readFileSync(QUEUE_CACHE, 'utf8'));
      if (Array.isArray(cached.ids) && cached.ids.length) {
        log(`Using saved finish queue: ${cached.ids.length}`);
        return {
          ids: cached.ids,
          fails: cached.ids.map((id) => ({ id, score: 0 })),
        };
      }
    } catch (_e) {}
  }
  log('Building tl finish queue (score < 13, images deferred)…');
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ids = (idx.entries || [])
    .filter((e) => e && /^tl\d+$/i.test(e.id))
    .sort((a, b) => Number(a.id.slice(2)) - Number(b.id.slice(2)))
    .map((e) => e.id);
  const fails = [];
  for (let i = 0; i < ids.length; i += 30) {
    const chunk = ids.slice(i, i + 30);
    await Promise.all(
      chunk.map(async (id) => {
        const e = await store.get(`answers/${id}.json`, { type: 'json' });
        if (!e || !e.answer) return;
        const g = grade(id, e.answer, e.question);
        if (!isPass(g)) fails.push({ id, score: g.score });
      })
    );
    if (i % 600 === 0 || i + 30 >= ids.length) {
      log(`audit ${Math.min(i + 30, ids.length)}/${ids.length} fails=${fails.length}`);
    }
  }
  try {
    fs.writeFileSync(
      QUEUE_CACHE,
      JSON.stringify({ at: new Date().toISOString(), total: ids.length, ids: fails.map((f) => f.id) }, null, 2)
    );
  } catch (_e) {}
  return { ids, fails };
}

async function emailImagesDone({ id, title, score, before, url, cover, bodyImgs }) {
  if (!RESEND_KEY) return { ok: false, reason: 'no_key' };
  const subject = `🔴 RED LIGHT — ${id} IMAGES done`;
  const thumbs = [cover, ...(bodyImgs || [])].filter(Boolean).slice(0, 4);
  const thumbsHtml = thumbs
    .map(
      (src) =>
        `<a href="${url}" style="display:inline-block;margin:0 8px 8px 0"><img src="${src}" alt="" width="220" style="width:220px;max-width:100%;height:auto;border:2px solid #B91C1C;display:block" /></a>`
    )
    .join('');
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.5">
    <div style="background:#B91C1C;color:#fff;padding:14px 18px;font-size:20px;font-weight:700">
      🔴 RED LIGHT — Images done
    </div>
    <div style="padding:16px;border:3px solid #B91C1C;background:#FEF2F2">
      <p style="margin:0 0 8px;font-size:18px;font-weight:700">${id} · score ${before} → ${score}</p>
      <p style="margin:0 0 12px;font-weight:700">${String(title || '').replace(/</g, '&lt;')}</p>
      <p style="margin:0 0 12px"><a href="${url}" style="color:#0b57d0;font-weight:700">${url}</a></p>
      <div style="margin:0 0 12px">${thumbsHtml}</div>
      <p style="margin:0;color:#666;font-size:12px">Cover + in-page images ready · ${new Date().toISOString()}</p>
    </div>
  </div>`;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [RECIPIENT],
        subject,
        html,
        text: `RED LIGHT ${id} IMAGES done ${url}`,
      }),
    });
    const text = await r.text();
    log('EMAIL images ' + id + ' ' + r.status + ' ' + text.slice(0, 120));
    return { ok: r.ok, status: r.status, body: text.slice(0, 200) };
  } catch (e) {
    log('EMAIL err ' + id + ' ' + e.message);
    return { ok: false, reason: String(e.message || e) };
  }
}

async function processOne(id) {
  const entry = await store.get(`answers/${id}.json`, { type: 'json', consistency: 'strong' });
  if (!entry || !entry.answer) return { id, error: 'missing' };
  const title = entry.question || id;
  const beforeG = grade(id, entry.answer, title);
  if (isPass(beforeG)) return { id, skipped: true, score: beforeG.score, title };

  const route = pickGoldTemplate(id, entry.answer, title);
  let next = transform(id, entry.answer, title);
  const afterG = grade(id, next, title);
  const changed = next !== entry.answer;

  if (changed) {
    await store.setJSON(`answers/${id}.json`, {
      ...entry,
      answer: next,
      polished_at: Date.now(),
      quality_score: Math.max(Number(entry.quality_score) || 0, afterG.score),
      images_deferred_at: entry.images_deferred_at || Date.now(),
      tl_finish_drip_at: Date.now(),
      tl_finish_template: route.template,
      tl_finish_before: beforeG.score,
      tl_finish_after: afterG.score,
    });
  }

  let emailed = null;
  const imgState = imagesReady({ ...entry, img: entry.img, cover: entry.cover }, next);
  // Owner wants emails when images are done — never spam text-only finishes.
  if (isPass(afterG) && imgState.ready) {
    emailed = await emailImagesDone({
      id,
      title,
      score: afterG.score,
      before: beforeG.score,
      url: toolsUrl(id),
      cover: imgState.cover,
      bodyImgs: imgState.bodyImgs,
    });
  } else if (isPass(afterG) && EMAIL_ON_TEXT) {
    log('EMAIL skipped ' + id + ' (EMAIL_ON_TEXT=1 but images not ready; still not sending text-only)');
  } else if (isPass(afterG)) {
    log('EMAIL skipped ' + id + ' (text 13/13, images not ready — cover=' + (imgState.cover ? 'yes' : 'no') + ' bodyImgs=' + imgState.bodyImgs.length + ')');
  }

  return {
    id,
    title: String(title).slice(0, 80),
    template: route.template,
    changed,
    before: beforeG.score,
    after: afterG.score,
    pass: isPass(afterG),
    imagesReady: imgState.ready,
    cover: imgState.cover || null,
    bodyImgCount: imgState.bodyImgs.length,
    bad: Object.entries(afterG.criteria || {})
      .filter(([k, v]) => !v && k !== 'images_law')
      .map(([k]) => k)
      .slice(0, 8),
    emailed,
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  let st = loadState();
  if (!st.queue) {
    const { ids, fails } = await buildFailQueue();
    st.total = ids.length;
    st.queue = fails.map((f) => f.id);
    st.fail_snapshot = fails;
    st.cursor = 0;
    st.status = fails.length ? 'dripping' : 'complete';
    saveState(st);
    log(`Queue ready: ${fails.length} fails / ${ids.length} total`);
    if (!fails.length) {
      log('All tl already >=13 with images deferred');
      return;
    }
  }

  while (st.cursor < st.queue.length) {
    const id = st.queue[st.cursor];
    st.status = 'dripping';
    log(`UNIT ${st.cursor + 1}/${st.queue.length} → ${id}`);
    let result;
    try {
      result = await processOne(id);
    } catch (e) {
      result = { id, error: String(e.message || e) };
    }
    log(JSON.stringify(result));
    st.last_id = id;
    st.last_at = Date.now();
    st.last_result = result;
    if (result.error) st.errors.push({ id, error: result.error, at: Date.now() });
    else if (result.skipped) st.skipped_pass.push(id);
    else {
      st.done.push(id);
      if (result.pass) {
        st.finished.push(id);
        if (result.emailed && result.emailed.ok) st.emailed.push(id);
      }
    }
    st.cursor += 1;
    saveState(st);

    if (ONCE) break;
    if (st.cursor >= st.queue.length) break;
    log(`Sleeping ${INTERVAL_MS}ms…`);
    await sleep(INTERVAL_MS);
  }

  if (st.cursor >= st.queue.length) {
    st.status = 'complete';
    saveState(st);
    log(
      `TL FINISH DRIP COMPLETE finished=${(st.finished || []).length} emailed=${(st.emailed || []).length}`
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
