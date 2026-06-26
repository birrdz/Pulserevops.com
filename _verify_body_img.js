const urls = process.argv.slice(2);
(async () => {
  for (const url of urls) {
    const r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000) });
    const html = await r.text();
    const bodyImgs = [...html.matchAll(/<img[^>]+src="([^"]+)"[^>]*class="[^"]*entry[^"]*"/gi)];
    const allContent = [...html.matchAll(/<img[^>]+src="(https?:\/\/[^"]+)"/gi)].map((m) => m[1]);
    const entrySection = html.split('entry-body')[1] || html.split('class="answer"')[1] || '';
    const inBody = [...entrySection.slice(0, 8000).matchAll(/src="(https?:\/\/[^"]+)"/gi)].map((m) => m[1]);
    console.log(JSON.stringify({ url, status: r.status, bodyHttpsImgs: inBody.slice(0, 3), anyHttpsInPage: allContent.slice(0, 5) }));
  }
})();
