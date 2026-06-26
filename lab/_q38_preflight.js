const body = require('./polish-q38-v7-t115-p2-body.js');
const raw = body.split(/\s+/).filter(Boolean).length;
const clean = body
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/https?:\/\/\S+/g, ' ')
  .replace(/[#>*_`~|\-=]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .split(' ')
  .filter(Boolean).length;
console.log('raw words:', raw, '/ hard cap 10500');
console.log('clean words:', clean, '/ target 8500-10500');
console.log('chars:', body.length);
console.log('H2 banners:', (body.match(/^## /gm) || []).length);
console.log('numbered ### subs:', (body.match(/^### \d+\. /gm) || []).length);
console.log('bold bullets:', (body.match(/^- \*\*[^*]+\*\*/gm) || []).length);
console.log('inline links:', (body.match(/\[[^\]]+\]\(https?:\/\/[^)]+\)/g) || []).length);
console.log('Direct Answer H3:', /^### Direct Answer/m.test(body));
console.log('Sources H2:', /^## Sources/m.test(body));
console.log('TLDR bolded:', /^### Direct Answer\s*\n\n\*\*[\s\S]{200,}?\*\*/m.test(body));
