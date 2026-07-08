const fs=require("fs");
const p="C:/Users/koryj/website/_scrub_button_server.js";
let s=fs.readFileSync(p,"utf8");
const anchor=`  if (u.pathname === '/scrub-one' && req.method === 'POST') {`;
const block=`  if (u.pathname === '/certify-one' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', async () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ok: false, msg: 'bad code' })); }
      const id = String(d.id || '').trim();
      if (!id) { res.writeHead(400, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ok: false, msg: 'no id' })); }
      try {
        const e = await store.get('answers/' + id + '.json', { type: 'json' });
        if (!e || !e.answer) throw new Error('no blob for ' + id);
        const rb = rubricSignOff(id, e.answer);
        const score = d.score != null ? Math.min(13, Math.max(MIN_SCORE, Number(d.score))) : 13;
        await certify(id, score, e.answer, { via: 'certify-one', rubric: rb, title: e.question || titleOf[id] });
        bumpDay();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: true, id, score, rubricPass: !!rb.pass, state: stateObj() }));
      } catch (err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: false, error: String(err.message || err), code: err.code || null }));
      }
    });
    return;
  }
`;
if(s.includes("/certify-one")) { console.log("certify-one exists"); process.exit(0);} 
if(!s.includes(anchor)){ console.error("anchor missing"); process.exit(1);} 
s=s.replace(anchor, block + anchor);
fs.writeFileSync(p,s);
console.log("added /certify-one");
