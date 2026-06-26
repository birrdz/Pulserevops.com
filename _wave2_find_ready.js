// Finds ready-to-publish wave2 files for rs/er.
// Ready = matches ^(rs|er)\d+_answer.md, id IS in _held_queue.json,
//         file contains "## Sources", and mtime is older than 15s.
const fs = require('fs');
const dir = 'C:/Users/koryj';
const q = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_held_queue.json', 'utf8'));
const inQ = new Set(q.filter(e => /^(rs|er)\d+$/.test(e.id)).map(e => e.id));
const now = Date.now();
const ready = [];
const notReady = [];
for (const f of fs.readdirSync(dir)) {
  const m = f.match(/^((rs|er)\d+)_answer\.md$/);
  if (!m) continue;
  const id = m[1];
  if (!inQ.has(id)) continue; // not held => already published, skip
  const fp = dir + '/' + f;
  let st;
  try { st = fs.statSync(fp); } catch (e) { continue; }
  const ageMs = now - st.mtimeMs;
  let body = '';
  try { body = fs.readFileSync(fp, 'utf8'); } catch (e) { continue; }
  const hasSources = /##\s*Sources/i.test(body);
  if (hasSources && ageMs > 15000) ready.push(id);
  else notReady.push({ id, hasSources, ageSec: Math.round(ageMs / 1000) });
}
ready.sort();
console.log(JSON.stringify({ readyCount: ready.length, ready, notReady }));
