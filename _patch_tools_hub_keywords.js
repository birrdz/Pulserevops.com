const fs = require('fs');
const { CRO_BRAND_KEYWORDS } = require('./netlify/functions/lib/cro-seo-keywords');

function appendMetaKeywords(html, phrases) {
  return html.replace(
    /(<meta name="keywords" content=")([^"]*)(" *\/?>)/i,
    (full, pre, content, post) => {
      const existing = new Set(
        content
          .split(',')
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      );
      const added = [];
      for (const kw of phrases) {
        const k = String(kw).trim();
        if (!k || existing.has(k.toLowerCase())) continue;
        added.push(k);
        existing.add(k.toLowerCase());
      }
      if (!added.length) return full;
      const sep = content.trim().endsWith(',') || !content.trim() ? ' ' : ', ';
      return `${pre}${content}${sep}${added.join(', ')}${post}`;
    }
  );
}

const p = 'tools.html';
const before = fs.readFileSync(p, 'utf8');
const after = appendMetaKeywords(before, CRO_BRAND_KEYWORDS);
fs.writeFileSync(p, after);
const m = after.match(/name="keywords" content="([^"]+)"/i);
console.log(JSON.stringify({ updated: after !== before, keywordLen: m ? m[1].length : 0 }));
