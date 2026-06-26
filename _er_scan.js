// One-off: scan every er#### entry, report which lack @@PRODUCT image/link cards.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
const num = id => parseInt(String(id).match(/\d+/)[0], 10);

(async () => {
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const ids = (idx.entries || []).map(e => e.id).filter(id => /^er\d+$/.test(id)).sort((a, b) => num(a) - num(b));
  const missing = [], hasCards = [], noBody = [], fewItems = [];
  let done = 0;
  for (const id of ids) {
    let e;
    try { e = await s.get('answers/' + id + '.json', { type: 'json' }); } catch (err) { noBody.push(id); continue; }
    if (!e || !e.answer) { noBody.push(id); continue; }
    if (/@@PRODUCT/.test(e.answer)) { hasCards.push(id); continue; }
    // count ## N. items
    const items = (e.answer.match(/^##\s+\d+\.\s+/gm) || []).length;
    if (items < 5) { fewItems.push(id + '(' + items + ')'); continue; }
    missing.push(id);
    done++;
    if (done % 50 === 0) process.stderr.write('.scanned ' + done + '\n');
  }
  console.log(JSON.stringify({
    total: ids.length,
    hasCards: hasCards.length,
    missing: missing.length,
    noBody: noBody.length,
    fewItems: fewItems.length,
    missingIds: missing,
    fewItemsIds: fewItems,
    noBodyIds: noBody,
  }, null, 0));
})();
