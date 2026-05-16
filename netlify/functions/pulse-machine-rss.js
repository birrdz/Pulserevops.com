// ════════════════════════════════════════════════════════════════════════
// pulse-machine-rss — RSS 2.0 feed of the autonomously researched library.
// Pulls the latest 50 entries from the live blob and emits valid RSS XML.
// Mounted at /rss.xml via netlify.toml redirect.
// ════════════════════════════════════════════════════════════════════════

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

function escXml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
function rfc822(ms) {
  const d = new Date(ms || Date.now());
  return d.toUTCString();
}

exports.handler = async () => {
  const store = initStore();
  const rssHeader = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">\n'
    + '<channel>\n'
    + '<title>Pulse Machine — Autonomous Sales Knowledge Library</title>\n'
    + '<link>' + SITE + '/knowledge.html</link>\n'
    + '<atom:link href="' + SITE + '/rss.xml" rel="self" type="application/rss+xml"/>\n'
    + '<description>Autonomously researched sales / GTM / SaaS / leadership answers. Updated hourly by an AI research agent — sourced and cited.</description>\n'
    + '<language>en-us</language>\n'
    + '<generator>Pulse Machine v1</generator>\n';

  if (!store) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
      body: rssHeader + '<lastBuildDate>' + rfc822() + '</lastBuildDate>\n</channel>\n</rss>',
    };
  }

  let entries = [];
  let latestTs = Date.now();
  try {
    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    entries = (idx.entries || []).slice(0, 50);
    if (entries.length && entries[0].ts) latestTs = entries[0].ts;
  } catch (e) {}

  // Fetch first 25 full answers for richer description
  const top = entries.slice(0, 25);
  const fullAnswers = await Promise.all(
    top.map(e => store.get('answers/' + e.id + '.json', { type: 'json' }).catch(() => null))
  );

  let body = rssHeader + '<lastBuildDate>' + rfc822(latestTs) + '</lastBuildDate>\n';

  fullAnswers.forEach((full, i) => {
    const e = top[i];
    if (!e) return;
    const url = SITE + '/knowledge/' + e.id;
    const desc = full && full.answer
      ? String(full.answer).replace(/\s+/g, ' ').slice(0, 480) + '…'
      : 'Researched answer in the Pulse Knowledge Library.';
    body += '<item>\n';
    body += '  <title>' + escXml(e.question) + '</title>\n';
    body += '  <link>' + url + '</link>\n';
    body += '  <guid isPermaLink="false">pulse-machine-' + e.id + '</guid>\n';
    body += '  <pubDate>' + rfc822(e.ts) + '</pubDate>\n';
    body += '  <dc:creator>Pulse Machine</dc:creator>\n';
    (e.tags || []).slice(0, 6).forEach(t => { body += '  <category>' + escXml(t) + '</category>\n'; });
    body += '  <description>' + escXml(desc) + '</description>\n';
    body += '</item>\n';
  });
  body += '</channel>\n</rss>';

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 min cache
    },
    body,
  };
};
