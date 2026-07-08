const ids = ['mv0050', 'mv0049', 'mv0048', 'mv0047'];
(async () => {
  for (const id of ids) {
    const page = await fetch('https://pulserevops.com/knowledge/' + id);
    const html = await page.text();
    const path = '/assets/qa/' + id + '.jpg';
    console.log(id, 'page', page.status, 'refs', (html.match(new RegExp(id + '\\.jpg', 'g')) || []).length, 'hasPath', html.includes(path));
  }
})();
