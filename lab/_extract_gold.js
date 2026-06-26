const fs = require('fs');
const h = fs.readFileSync('C:\\Users\\koryj\\website\\lab\\_q1982_gold.json', 'utf8');
const m = h.match(/<textarea id="raw-md"[^>]*>([\s\S]*?)<\/textarea>/);
let ans = m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
console.log('words=' + ans.trim().split(/\s+/).length);
fs.writeFileSync('C:\\Users\\koryj\\website\\lab\\_q1982_gold.md', ans);
