(async () => {
  const r = await fetch('https://pulserevops.com/aquariums/aq0001');
  const h = await r.text();
  const hasPhrase = h.includes('Top 10 aquarium fish for beginners');
  const hasFaq = h.includes('FAQPage');
  const hasAlt = h.includes('alternateName');
  const kwLen = (h.match(/meta name="keywords" content="([^"]*)"/i) || [])[1]?.length || 0;
  console.log(JSON.stringify({ status: r.status, hasPhrase, hasFaq, hasAlt, metaKeywordsLen: kwLen }));
})();
