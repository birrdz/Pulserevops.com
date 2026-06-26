// pulse-machine-feed — Atom 1.0 feed of the 50 most recent library entries.
// Discoverable via <link rel="alternate" type="application/rss+xml"> on every
// entry page. Bing, Yandex, Feedly, RSS readers all consume it.
// Mounted at /feed.xml via netlify.toml redirect.

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const SITE = 'https://pulserevops.com';

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

exports.handler = async () => {
  const store = initStore();
  if (!store) return { statusCode: 503, body: 'no store' };
  let idx;
  try { idx = await store.get('_index.json', { type: 'json' }); } catch (e) { return { statusCode: 500, body: 'idx err' }; }
  if (!idx || !idx.entries) return { statusCode: 500, body: 'no entries' };

  // 50 newest — sort by polished_at desc, fall back to ts. Includes both
  // /knowledge/q### entries and /sales-trainings/st### entries so a single
  // subscription surfaces everything new from Pulse RevOps.
  const isTrainingEntry = e => (Array.isArray(e.tags) && e.tags.includes('sales-training')) || /^st\d+$/i.test(e.id || '');
  const recent = idx.entries
    .filter(e => e && e.id && (/^q\d+$/.test(e.id) || /^st\d+$/i.test(e.id)))
    .sort((a, b) => (b.polished_at || b.ts || 0) - (a.polished_at || a.ts || 0))
    .slice(0, 50);

  const updated = recent.length ? new Date(recent[0].polished_at || recent[0].ts || Date.now()).toISOString() : new Date().toISOString();

  const entries = recent.map(e => {
    const prefix = isTrainingEntry(e) ? '/sales-trainings/' : '/knowledge/';
    const u = SITE + prefix + e.id;
    const published = new Date(e.ts || Date.now()).toISOString();
    const modified = new Date(e.polished_at || e.ts || Date.now()).toISOString();
    const tags = (e.tags || []).map(t => `<category term="${esc(t)}"/>`).join('');
    const summary = 'Researched answer: ' + (e.tags || []).slice(0, 3).join(', ');
    return `  <entry>
    <id>${u}</id>
    <link rel="alternate" type="text/html" href="${u}"/>
    <title>${esc(e.question || '')}</title>
    <published>${published}</published>
    <updated>${modified}</updated>
    <author><name>Pulse RevOps · The Machine</name></author>
    <summary>${esc(summary)}</summary>
    ${tags}
  </entry>`;
  }).join('\n');

  const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${SITE}/feed.xml</id>
  <title>Pulse Knowledge Library</title>
  <subtitle>Autonomously researched sales / GTM / SaaS / leadership answers, sourced and cited.</subtitle>
  <link rel="self" type="application/atom+xml" href="${SITE}/feed.xml"/>
  <link rel="alternate" type="text/html" href="${SITE}/knowledge.html"/>
  <updated>${updated}</updated>
  <author><name>Pulse RevOps</name><uri>${SITE}</uri></author>
  <generator uri="${SITE}" version="1.0">pulse-machine-feed</generator>
${entries}
</feed>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=900, s-maxage=1800',
    },
    body: feed,
  };
};
