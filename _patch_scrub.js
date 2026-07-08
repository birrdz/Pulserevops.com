const fs=require('fs');
const f='C:/Users/koryj/website/_scrub_button_server.js';
let s=fs.readFileSync(f,'utf8');
if(!s.includes('/gen-reset-stop')) {
  const needle = "if (u.pathname === '/gen-stop' && req.method === 'POST') {";
  const ins = `  if (u.pathname === '/gen-reset-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => { let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {} if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); } genJob.stop = false; saveGen(); res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{"ok":true,"stop":false}'); });
    return;
  }
  ` + needle;
  if(!s.includes(needle)) throw new Error('gen-stop anchor missing');
  s=s.replace(needle, ins);
}
if(!s.includes('genJob.stop = false; // urgent/generateOne')) {
  s=s.replace(
    'async function generateOne(pillar, question){',
    'async function generateOne(pillar, question, genOpts){\n  genOpts = genOpts || {};\n  genJob.stop = false; // urgent/generateOne\n  const essayOnly = genOpts.essayOnly !== false;'
  );
  const reshapeBlock = `  if (essayOnly) {
    try {
      const { reshapeQaGoldBody } = require('./_qa_gold_template');
      body = reshapeQaGoldBody(body);
      await saveBody(id, body);
      genLog('essay reshape Q&A gold (strip ranking artifacts) · ' + id);
    } catch (e) {}
  }
  const goldRoute = pickGoldTemplate(id, body, question);`;
  if(!s.includes('essay reshape Q&A gold')) {
    s=s.replace(
      /  const goldRoute = pickGoldTemplate\(id, body, question\);/,
      reshapeBlock
    );
  }
}
if(!s.includes('essayOnly: d.essayOnly')) {
  s=s.replace(
    'try { const r = await generateOne(pillar, question);',
    'try { const r = await generateOne(pillar, question, { essayOnly: d.essayOnly !== false });'
  );
}
fs.writeFileSync(f,s);
console.log('scrub server patched');
