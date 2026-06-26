// Dry-run: load rewrite-q9677-deep.js with stubbed netlify + polish-helper modules to read v9 word count
const Module = require('module');
const origLoad = Module._load;
Module._load = function(req, parent, isMain) {
  if (req === '@netlify/blobs') return { getStore: () => ({ setJSON: async()=>{}, get: async()=>null }) };
  if (req === './polish-helper') return { runPolish: async () => {} };
  return origLoad.call(this, req, parent, isMain);
};

// Patch main() to skip blob work and only run diagnostics
const fs = require('fs');
let src = fs.readFileSync('./lab/rewrite-q9677-deep.js','utf8');
src = src.replace(/main\(\)\.catch[\s\S]*?$/m, '');
// Re-emit with a synchronous diagnostic-only main:
src += `
const v5 = tldr + core;
const v6 = v5 + src;
const v7 = v6 + num;
const v8 = v7 + counter;
const v9 = v8 + links;
const h2BannerCount = (core.match(/^## /gm) || []).length;
const numberedSubsectionCount = (core.match(/^### \\d+\\. /gm) || []).length;
const boldInBullets = (core.match(/^- \\*\\*/gm) || []).length;
const sourceUrlCount = (src.match(/https?:\\/\\//g) || []).length;
const inlineUrlCount = (core.match(/https?:\\/\\//g) || []).length;
const mermaidCount = (core.match(/\`\`\`mermaid/g) || []).length;
const pipeTableCount = (num.match(/^\\|[\\s\\-:|]+\\|\\s*$/gm) || []).length;
const linkedIds = (links.match(/^- \\*\\*q\\d+|^- \\*\\*st\\d+/gm) || []).length;
const totalWords = v9.split(/\\s+/).filter(Boolean).length;
console.log('v9 words:', totalWords);
console.log('H2 banners:', h2BannerCount);
console.log('Numbered subs:', numberedSubsectionCount);
console.log('Bold bullets:', boldInBullets);
console.log('src URLs:', sourceUrlCount);
console.log('inline core URLs:', inlineUrlCount);
console.log('mermaid:', mermaidCount);
console.log('pipe tables:', pipeTableCount);
console.log('cross links:', linkedIds);
console.log('PASS 8500-10400:', totalWords >= 8500 && totalWords <= 10400);
console.log('PASS 8500-10500:', totalWords >= 8500 && totalWords <= 10500);
`;
eval(src);
