const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const e = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of e.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}
(async () => {
  const s = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN,
  });
  const st = (await s.get('_economy_cro_infinite_state.json', { type: 'json' })) || {};
  const hb = (await s.get('_economy_cro_infinite_heartbeat.json', { type: 'json' })) || {};
  console.log(JSON.stringify({
    posted: st.posted,
    nextId: st.nextId,
    topicGen: st.topicGen,
    cancelled: st.cancelled,
    queueRemaining: Math.max(0, (st.queue?.length || 0) - (st.cursor || 0)),
    lastId: st.lastId,
    hbOk: hb.ok,
    hbId: hb.id,
    hbStId: hb.stId,
    hbTs: hb.ts ? new Date(hb.ts).toISOString() : null,
    hbSeo: hb.seo?.seoOk,
    hbIndex: hb.index?.ok,
  }, null, 2));
})();
