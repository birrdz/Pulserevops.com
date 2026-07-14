#!/usr/bin/env node
/**
 * Stop Format Fixer (if running) and hand all content-passers to Square Builder.
 *
 * Usage (scrub server must be up — same port as Format Fixer UI):
 *   node _handoff_fixer_to_square.js
 *   node _handoff_fixer_to_square.js --base=http://127.0.0.1:8902
 *   node _handoff_fixer_to_square.js --base=http://127.0.0.1:8899 --key=4444
 */
'use strict';

const args = process.argv.slice(2);
function arg(name, def) {
  const hit = args.find((a) => a.startsWith('--' + name + '='));
  return hit ? hit.slice(name.length + 3) : def;
}
const BASE = String(arg('base', process.env.SCRUB_BTN_BASE || 'http://127.0.0.1:8902')).replace(/\/$/, '');
const KEY = arg('key', '4444');

async function post(path, body) {
  const r = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.assign({ key: KEY }, body || {})),
  });
  const t = await r.text();
  let j = {};
  try { j = JSON.parse(t || '{}'); } catch (e) { j = { raw: t }; }
  return { status: r.status, j };
}

async function get(path) {
  const r = await fetch(BASE + path + (path.includes('?') ? '&' : '?') + 'key=' + encodeURIComponent(KEY));
  const t = await r.text();
  let j = {};
  try { j = JSON.parse(t || '{}'); } catch (e) { j = { raw: t }; }
  return { status: r.status, j };
}

(async () => {
  console.log('Handoff Fixer → Square Builder @', BASE);
  let st;
  try {
    st = await get('/format-fixer-status');
  } catch (e) {
    console.error('Cannot reach scrub server at', BASE, '—', e.message);
    console.error('Start it first: _start_format_fixer_portal.bat  (or SCRUB_BTN_PORT=8902 node _scrub_button_server.js)');
    process.exit(2);
  }
  if (st.status === 401) {
    console.error('Unauthorized — check --key=4444');
    process.exit(1);
  }
  console.log('Fixer status:', {
    running: st.j.running,
    phase: st.j.phase,
    pillar: st.j.pillar,
    entriesPass: st.j.entriesPass,
    done: st.j.done,
    total: st.j.total,
  });

  const hand = await post('/fixer-to-square', {});
  console.log('fixer-to-square →', hand.status, hand.j);

  // If API missing (old server), fall back to force-stop + face-hero-start
  if (hand.status === 404 || (hand.j && hand.j.raw && /Cannot POST|Not Found/i.test(String(hand.j.raw)))) {
    console.log('API missing — fallback force-stop + face-hero-start…');
    const stop = await post('/format-fixer-force-stop', {});
    console.log('force-stop →', stop.j);
    const pillar = (st.j && st.j.pillar) || arg('pillar', '');
    if (!pillar) {
      console.error('No pillar on fixer status — pass --pillar=tl (etc.)');
      process.exit(1);
    }
    await new Promise((r) => setTimeout(r, 500));
    const start = await post('/face-hero-start', {
      pillar,
      autoApprove: true,
      forceRestart: true,
      passersOnly: true,
      guideKeywords: '',
    });
    console.log('face-hero-start →', start.j);
  }

  await new Promise((r) => setTimeout(r, 600));
  const sq = await get('/face-hero-status');
  console.log('Square Builder:', {
    running: sq.j.running,
    phase: sq.j.phase,
    pillar: sq.j.pillar,
    done: sq.j.done,
    total: sq.j.total,
    coversGenerated: sq.j.coversGenerated,
    skippedFixerGate: sq.j.skippedFixerGate,
  });
  console.log('Open: ' + BASE + '/face-card-top-image-generator');
})().catch((e) => {
  console.error(e);
  process.exit(2);
});
