const url = 'https://pulserevops.com/estates';
fetch(url)
  .then((r) => r.text().then((h) => ({ status: r.status, h })))
  .then(({ status, h }) => {
    const title = (h.match(/<title>([^<]+)/) || [])[1];
    const desc = (h.match(/name="description" content="([^"]+)"/) || [])[1];
    const keywords = (h.match(/name="keywords" content="([^"]+)"/) || [])[1];
    const jsonLdBlocks = (h.match(/application\/ld\+json/g) || []).length;
    const faqPage = h.includes('FAQPage');
    const collectionPage = h.includes('CollectionPage');
    const itemList = h.includes('ItemList');
    console.log(
      JSON.stringify(
        {
          url,
          status,
          title,
          desc: desc && desc.slice(0, 120),
          keywordsLen: keywords ? keywords.length : 0,
          jsonLdBlocks,
          faqPage,
          collectionPage,
          itemList,
          seoPass: status === 200 && jsonLdBlocks >= 3 && faqPage,
        },
        null,
        2
      )
    );
  });
