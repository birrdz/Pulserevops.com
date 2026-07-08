// _audit_green — PERSONAL audit of every certified (green) entry against the REAL grader (owner 4444).
// Reads _v2_approved.json, deep-grades each with gradeEntry (full, images NOT deferred), and reports
// exactly which are a true 12/13+ and which aren't (with reasons). Optionally re-queues the imperfect
// ones for re-scrub:  node _audit_green.js requeue
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];   // RAW id prefix (tl, wl…), NOT the grader ruleset
const { auditImages } = require('./netlify/functions/lib/ensure-entry-images');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const REQUEUE = process.argv.includes('requeue');
const MIN = 12;

(async () => {
  let green = []; try { green = JSON.parse(fs.readFileSync(WD + '/_v2_approved.json', 'utf8')) || []; } catch (e) {}
  console.log('[audit] certified (green) = ' + green.length + (REQUEUE ? '  · REQUEUE mode' : ''));
  const res = [];
  for (let i = 0; i < green.length; i++) {
    const id = green[i];
    const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (!e || !e.answer) { res.push({ id, ok: false, why: ['no blob'] }); continue; }
    const g = gradeEntry(id, e.answer, {});   // FULL grade — images_law + media enforced
    const why = [];
    if (g.score < MIN) why.push('score ' + g.score + '/13:' + (g.missing || []).join(','));
    const hero = (e.answer.match(/!\[[^\]]*\]\(([^)]+)\)/) || [])[1] || '';
    if (!hero) why.push('no hero');
    if (pillarOf(id) !== 'tl' && /cro-cover-/.test(hero)) why.push('CRO-cover-on-' + pillarOf(id));
    const ia = auditImages(id, e.answer);
    if (ia.top10 && !ia.compliant) why.push('top10 imgs ' + ia.productImgs + '/10');
    res.push({ id, p: pillarOf(id), ok: why.length === 0, score: g.score, why });
    if ((i + 1) % 100 === 0) console.log('[audit] ' + (i + 1) + '/' + green.length + ' …');
  }
  const good = res.filter(r => r.ok), bad = res.filter(r => !r.ok);
  const byP = {}; for (const r of res) { const t = byP[r.p] = byP[r.p] || { n: 0, ok: 0 }; t.n++; if (r.ok) t.ok++; }
  console.log('\n===== AUDIT RESULT =====');
  console.log('PERFECT (true ' + MIN + '/13+): ' + good.length + '/' + res.length + '  (' + (res.length ? Math.round(good.length / res.length * 100) : 0) + '%)');
  console.log('IMPERFECT: ' + bad.length);
  console.log('\nby pillar (perfect/total):');
  console.log(Object.entries(byP).sort((a, b) => b[1].n - a[1].n).map(([p, t]) => '  ' + p + ': ' + t.ok + '/' + t.n).join('\n'));
  if (bad.length) { console.log('\nimperfect (first 60):'); bad.slice(0, 60).forEach(r => console.log('  ⚠️ ' + r.id + ' [' + r.p + '] ' + r.why.join(' | '))); }
  fs.writeFileSync(WD + '/_audit_green_result.json', JSON.stringify({ at: new Date().toISOString(), total: res.length, perfect: good.length, imperfect: bad.map(b => ({ id: b.id, why: b.why })) }, null, 2));
  if (REQUEUE && bad.length) {
    const QUEUE = WD + '/_scrub_button_queue.json', AP = WD + '/_v2_approved.json';
    const badIds = new Set(bad.map(b => b.id));
    let q = []; try { q = JSON.parse(fs.readFileSync(QUEUE, 'utf8')) || []; } catch (e) {}
    const front = bad.map(b => b.id).filter(id => !q.includes(id));
    fs.writeFileSync(QUEUE, JSON.stringify([...front, ...q]));   // imperfect go to FRONT of red queue
    fs.writeFileSync(AP, JSON.stringify(green.filter(id => !badIds.has(id))));   // pull them OUT of green
    console.log('\n[requeue] moved ' + front.length + ' imperfect back to RED (front of queue) + out of green');
  }
})().catch(e => { console.log('FATAL', e && e.stack); process.exit(1); });
