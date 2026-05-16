const { getStore } = require('@netlify/blobs');
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOKEN = process.env.BLOBS_PAT;
(async () => {
  const store = getStore({ name: 'visit-alerts', siteID: SITE_ID, token: TOKEN });
  const list = await store.list();
  console.log('blobs in visit-alerts:', list.blobs ? list.blobs.length : 0);
  if (list.blobs && list.blobs.length) {
    list.blobs.slice(0, 30).forEach(b => console.log(' ', b.key, '·', b.size, 'bytes'));
  }
})().catch(e => console.error(e.message));
