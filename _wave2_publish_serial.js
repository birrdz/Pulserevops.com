// Serial publisher: takes ids as args, publishes each in series via _ds_publish.
// Looks up exact title from _held_queue.json. Prints one JSON line per id.
// Never runs two publishes concurrently (awaits each).
require('./_ds_lib');
const fs = require('fs');
const { publishTextFirst } = require('./_ds_publish');
const q = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_held_queue.json', 'utf8'));
const titleOf = {};
for (const e of q) titleOf[e.id] = e.question;
const ids = process.argv.slice(2);

(async () => {
  const ok = [], rej = [];
  for (const id of ids) {
    const title = titleOf[id];
    if (!title) { console.log(JSON.stringify({ id, ok: false, reason: 'not_in_queue' })); rej.push({ id, reason: 'not_in_queue' }); continue; }
    try {
      const r = await publishTextFirst(id, title);
      console.log(JSON.stringify({ id, ok: r.ok, score: r.score, words: r.words, reason: r.reason || null }));
      if (r.ok) ok.push(id); else rej.push({ id, reason: r.reason || 'score<10 (' + r.score + ')' });
    } catch (e) {
      console.log(JSON.stringify({ id, ok: false, reason: 'ERR:' + (e && e.message) }));
      rej.push({ id, reason: 'ERR:' + (e && e.message) });
    }
  }
  console.log('SUMMARY ' + JSON.stringify({ ok, rej }));
})();
