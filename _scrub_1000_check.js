// _scrub_1000_check — owner 4444. Waits for the owner to Begin Scrub, counts to 1000 cooked, then
// STOPS the scrubber and spot-checks a sample for real 12/13 format + APPLICABLE images, and emails a
// report. Stop: _scrub_1000_stop.flag.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const TARGET = parseInt(process.env.CHECK_TARGET || '1000', 10);
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function jget(u) { try { const r = await fetch(u, { signal: AbortSignal.timeout(8000) }); return await r.json(); } catch (e) { return null; } }
async function email(subject, message) { try { await fetch('https://pulserevops.com/.netlify/functions/pulse-owner-notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', subject, message }) }); } catch (e) {} }

async function check(id) {
  const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  if (!e || !e.answer) return { id, ok: false, why: 'no blob' };
  const b = e.answer, p = pillarOf(id);
  const imgs = (b.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length + (b.match(/@@PRODUCT[^\n]* img=/g) || []).length;   // markdown + Top-10 product cards
  const merm = (b.match(/```mermaid/g) || []).length;
  const faq = (b.match(/\*\*[^*]+\?\*\*/g) || []).length;
  const words = b.replace(/[#*`>\-]/g, ' ').split(/\s+/).filter(Boolean).length;
  const src = /##\s*Sources|\[[^\]]+\]\(https?:/i.test(b);
  const da = /##\s*Direct Answer/i.test(b);
  const hero = (b.match(/!\[[^\]]*\]\(([^)]+)\)/) || [])[1] || '';
  const croCoverOnNonCro = p !== 'tl' && /cro-cover-/.test(hero);   // wrong: business photo on non-CRO
  const applicable = !!hero && !croCoverOnNonCro;
  const fmtOk = imgs >= 3 && merm >= 2 && faq >= 6 && words >= 2000 && src && da && !!hero;
  return { id, p, ok: fmtOk && applicable, fmtOk, applicable, imgs, merm, faq, words, croCoverOnNonCro, hero: hero.slice(0, 60) };
}

(async () => {
  console.log('[1000-check] armed · will stop the scrubber after ' + TARGET + ' cooked and spot-check');
  const seen = new Set(); let base = null, started = false;
  while (!fs.existsSync(WD + '/_scrub_1000_stop.flag')) {
    const s = await jget('http://localhost:8899/scrub-status?key=4444');
    if (s) {
      if (base === null && s.state) base = s.state.today || 0;
      // accumulate cooked ids from the live log
      (s.log || []).join(' ').match(/\b[a-z]{2,3}\d{3,6}\b/g)?.forEach(id => seen.add(id));
      const cooked = s.state ? (s.state.today - base) : 0;
      if (s.running) started = true;
      if (started && cooked >= TARGET) {
        await fetch('http://localhost:8899/scrub-auto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: '4444', action: 'stop' }) }).catch(() => {});
        console.log('[1000-check] hit ' + cooked + ' — stopped. auditing ALL certified this run…');
        // AUDIT ALL: green started at 0, so every id in _v2_approved.json is this run's output. Check each.
        let green = []; try { green = JSON.parse(fs.readFileSync(WD + '/_v2_approved.json', 'utf8')) || []; } catch (e) {}
        const res = [];
        for (const id of green) { res.push(await check(id)); if (res.length % 100 === 0) console.log('[1000-check] audited ' + res.length + '/' + green.length); }
        const good = res.filter(r => r.ok).length, badImg = res.filter(r => r.croCoverOnNonCro).length, badFmt = res.filter(r => !r.fmtOk).length;
        const fails = res.filter(r => !r.ok);
        // per-pillar tally
        const byP = {}; for (const r of res) { const t = byP[r.p] = byP[r.p] || { n: 0, ok: 0 }; t.n++; if (r.ok) t.ok++; }
        const pill = Object.entries(byP).sort((a, b) => b[1].n - a[1].n).map(([p, t]) => '  ' + p + ': ' + t.ok + '/' + t.n).join('\n');
        const failLines = fails.slice(0, 40).map(r => '⚠️ ' + r.id + ' [' + r.p + '] imgs=' + r.imgs + ' merm=' + r.merm + ' faq=' + r.faq + ' w=' + r.words + (r.croCoverOnNonCro ? ' ⛔CRO-cover-on-' + r.p : '') + (!r.fmtOk ? ' ⛔fmt' : ''));
        const msg = '✅ Scrubber auto-paused at ' + cooked + ' certified (owner asked for 1000).\n\n' +
          'FULL AUDIT of ALL ' + res.length + ' certified this run:\n' +
          '  ' + good + ' fully clean (' + (res.length ? Math.round(good / res.length * 100) : 0) + '%) · ' + badFmt + ' format-short · ' + badImg + ' wrong CRO-cover-on-non-CRO.\n\n' +
          'By pillar (clean/total):\n' + pill + '\n\n' +
          (fails.length ? ('Failures (' + fails.length + ', first 40):\n' + failLines.join('\n')) : 'No failures — all clean. 🎉') +
          '\n\nScrubber is STOPPED. Hit Begin Scrub to resume.';
        await email('✅ Scrub checkpoint — ' + cooked + ' done, ' + good + '/' + res.length + ' clean (full audit)', msg);
        console.log('[1000-check] full-audit report emailed · ' + good + '/' + res.length + ' clean');
        return;
      }
    }
    await sleep(15000);
  }
})().catch(e => { console.log('[1000-check] FATAL', e && e.message); process.exit(1); });
