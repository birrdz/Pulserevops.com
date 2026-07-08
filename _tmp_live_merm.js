'use strict';
const https = require('https');
https.get('https://pulserevops.com/aquariums/aq1160', (r) => {
  let d = '';
  r.on('data', (c) => (d += c));
  r.on('end', () => {
    const body = (d.match(/<div class="body">([\s\S]*?)<\/div>\s*<div class="entry-sources"/) || [])[1] || '';
    let pos = 0;
    let i = 0;
    while ((pos = body.indexOf('flowchart TD', pos)) >= 0) {
      const inMerm = body.slice(Math.max(0, pos - 80), pos).includes('class="mermaid"');
      console.log('--- hit', i, 'inMermaid:', inMerm, '---');
      console.log(body.slice(Math.max(0, pos - 100), pos + 200).replace(/\s+/g, ' ').slice(0, 350));
      pos += 12;
      i++;
    }
    console.log('total mermaid-wrap:', (body.match(/mermaid-wrap/g) || []).length);
  });
});
