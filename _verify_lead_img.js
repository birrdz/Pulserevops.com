const urls = process.argv.slice(2);
if (!urls.length) {
  console.error('usage: node _verify_lead_img.js <url> ...');
  process.exit(1);
}
(async () => {
  for (const url of urls) {
    try {
      const r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000) });
      const html = await r.text();
      const imgs = [...html.matchAll(/<img[^>]+src="([^"]+)"/gi)].slice(0, 8).map((m) => m[1]);
      const hasPhoto = imgs.some((u) => !u.includes('.svg') && !u.includes('placeholder'));
      console.log(JSON.stringify({ url, status: r.status, imgCount: imgs.length, firstImgs: imgs.slice(0, 3), hasPhotoLead: hasPhoto }));
    } catch (e) {
      console.log(JSON.stringify({ url, error: String(e.message || e) }));
    }
  }
})();
