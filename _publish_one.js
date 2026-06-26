// _publish_one.js — publish a single regenerated entry from its .md file.
// Reads C:/Users/koryj/<id>_answer.md, grades it, and on score>=10 overwrites
// the entry blob with a fresh record (NO noindex field → regen auto-clears the
// noindex flag) + updates the index. Used by the grounded-regeneration agents.
//   node _publish_one.js <id> "<exact title/question>"
require('./_ds_lib'); // loads .env.local creds
const { publishTextFirst } = require('./_ds_publish');
const id = process.argv[2];
const title = process.argv[3];
if (!id || !title) { console.error('usage: node _publish_one.js <id> "<title>"'); process.exit(1); }
publishTextFirst(id, title)
  .then((r) => { console.log(JSON.stringify(r)); process.exit(r.ok ? 0 : 2); })
  .catch((e) => { console.error('ERR', e && e.message); process.exit(1); });
