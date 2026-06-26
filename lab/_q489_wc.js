const fs = require('fs');
const t = fs.readFileSync('C:/Users/koryj/website/lab/_q489_answer.md', 'utf8');
const raw = t.trim().split(/\s+/).length;
const clean = t
  .replace(/```[\s\S]*?```/g, '')
  .replace(/\[[^\]]+\]\([^)]+\)/g, '')
  .replace(/[#*_>\-]/g, ' ')
  .trim().split(/\s+/).length;
console.log('raw words:', raw);
console.log('clean words:', clean);
console.log('char len:', t.length);

// real-name probe
const names = ['Sara Larsen','Truman Tang','Maria Pergolino','Camille Trent','Anna Talerico','Maja Voje','Lori Wizdo','Drew Neisser','Sangram Vajre','Mary Shea','Allyson Havener','Maria Tribble'];
const hits = names.filter(n => t.includes(n));
console.log('real-name hits:', hits.length, '/', names.length, '->', hits.join(', '));
const tickers = ['NYSE: CRM','NYSE: HUBS','ASX: BTH','NASDAQ: MNTV','NASDAQ: ADBE'];
const thits = tickers.filter(n => t.includes(n));
console.log('ticker hits:', thits.length, '/', tickers.length, '->', thits.join(', '));
