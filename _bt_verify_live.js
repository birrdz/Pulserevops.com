(async () => {
  const [entryR, hubR, mapR] = await Promise.all([
    fetch('https://pulserevops.com/boats/bt0001'),
    fetch('https://pulserevops.com/boats'),
    fetch('https://pulserevops.com/.netlify/functions/pulse-machine-sitemap?pillar=bt'),
  ]);
  const h = await entryR.text();
  const hub = await hubR.text();
  const map = await mapR.text();
  const kw = (h.match(/meta name="keywords" content="([^"]*)"/i) || [])[1] || '';
  const hasPhrase = h.includes('Best Boats for Sale 2027');
  const hasFaq = h.includes('FAQPage') || hub.includes('FAQPage');
  const hasAlt = h.includes('alternateName');
  const btUrls = (map.match(/\/boats\/bt\d+/g) || []).length;
  const hubKw = (hub.match(/meta name="keywords" content="([^"]*)"/i) || [])[1] || '';
  console.log(
    JSON.stringify(
      {
        entry: { status: entryR.status, hasPhrase, hasFaq, hasAlt, metaKeywordsLen: kw.length, kwSample: kw.slice(0, 100) },
        hub: { status: hubR.status, metaKeywordsLen: hubKw.length, hasCollectionPage: hub.includes('CollectionPage') },
        sitemap: { status: mapR.status, btUrlCount: btUrls },
      },
      null,
      2
    )
  );
})();
