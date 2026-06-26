const fs = require('fs');
const h = fs.readFileSync('C:\\Users\\koryj\\website\\lab\\_q2146_current.json', 'utf8');
const m = h.match(/<textarea id="raw-md"[^>]*>([\s\S]*?)<\/textarea>/);
if (!m) { console.log('NO raw-md textarea found'); process.exit(1); }
let ans = m[1];
// unescape HTML entities
ans = ans.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
console.log('answer words=' + ans.trim().split(/\s+/).length + ' chars=' + ans.length);
fs.writeFileSync('C:\\Users\\koryj\\website\\lab\\_q2146_answer_full.md', ans);
console.log('saved.');
console.log('--- first 600 ---');
console.log(ans.slice(0, 600));
