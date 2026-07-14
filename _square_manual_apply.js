#!/usr/bin/env node
// Drain Square Builder apply queue — DELETE old face JPG(s), WRITE brand-new graded /assets/qa/<id>.jpg with baked gold title.
// Do NOT layer a new title over old titled pixels (stuck old-title bug). Law: CLAUDE.md TITLE / FACE-CARD LAW.
// Usage: node _square_manual_apply.js            # drain all ready
//        node _square_manual_apply.js aq9999     # one id
//        node _square_manual_apply.js --watch    # poll every 4s

const BASE = process.env.SQUARE_BASE || 'http://127.0.0.1:' + (process.env.SCRUB_BTN_PORT || '3229');
const KEY = process.env.SQUARE_KEY || '4444';

async function post(path, body) {
  const r = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.assign({ key: KEY }, body || {})),
  });
  return r.json();
}
async function get(path) {
  const r = await fetch(BASE + path + (path.includes('?') ? '&' : '?') + 'key=' + encodeURIComponent(KEY));
  return r.json();
}

async function once(id) {
  if (id) {
    const r = await post('/square-apply-now', { id });
    console.log(JSON.stringify(r));
    return r;
  }
  const r = await post('/square-apply-now', {});
  console.log(JSON.stringify(r));
  return r;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--watch')) {
    console.log('[square-manual] watching queue at', BASE);
    for (;;) {
      try {
        const q = await get('/square-apply-queue');
        const ready = (q.items || []).filter(x => x && x.status === 'ready');
        if (ready.length) {
          console.log('[square-manual] draining', ready.length);
          await once();
        }
      } catch (e) {
        console.error('[square-manual]', e.message || e);
      }
      await new Promise(r => setTimeout(r, 4000));
    }
  }
  const id = args.find(a => !a.startsWith('-'));
  await once(id);
}

main().catch(e => { console.error(e); process.exit(1); });
