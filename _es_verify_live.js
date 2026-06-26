const id = process.argv[2] || 'es0001';
const url = `https://pulserevops.com/estates/${id}`;
fetch(url)
  .then((r) => r.text().then((h) => ({ status: r.status, h })))
  .then(({ status, h }) => {
    const title = (h.match(/<title>([^<]+)/) || [])[1];
    const desc = (h.match(/name="description" content="([^"]+)"/) || [])[1];
    const keywords = (h.match(/name="keywords" content="([^"]+)"/) || [])[1];
    const canonical = (h.match(/rel="canonical" href="([^"]+)"/) || [])[1];
    const jsonLdBlocks = (h.match(/application\/ld\+json/g) || []).length;
    const hasPulseEstates = /Pulse Estates/i.test(h);
    const hasSemanticFaq = /seo_semantic|Semantic Search: Luxury Estate FAQ|luxury estate/i.test(h);
    console.log(
      JSON.stringify(
        {
          url,
          status,
          title,
          desc: desc && desc.slice(0, 140),
          keywords: keywords && keywords.slice(0, 100),
          canonical,
          jsonLdBlocks,
          hasPulseEstates,
          seoPass: status === 200 && title && desc && canonical,
        },
        null,
        2
      )
    );
  })
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
