const https = require('https');
const fs = require('fs');
https.get('https://pulserevops.com/.netlify/functions/pulse-machine-entry?id=q463', res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const re = /"text":"((?:[^"\\]|\\.)*)"/g;
    let m, longest = '';
    while ((m = re.exec(b)) !== null) {
      if (m[1].length > longest.length) longest = m[1];
    }
    let txt = longest
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      .replace(/\\u003c/g, '<')
      .replace(/\\u003e/g, '>')
      .replace(/\\u0026/g, '&');
    console.log('chars:', txt.length, 'words:', txt.trim().split(/\s+/).length);
    fs.writeFileSync('_q463_current.txt', txt);
    console.log('--- first 1500 ---');
    console.log(txt.slice(0, 1500));
    console.log('--- last 800 ---');
    console.log(txt.slice(-800));
  });
}).on('error', e => console.error('ERR', e.message));
