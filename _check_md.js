const fs = require('fs');
const body = fs.readFileSync('C:/Users/koryj/q10800_answer.md', 'utf8');
const mermaid = (body.match(/```mermaid/g) || []).length;
const flowchartTD = (body.match(/flowchart\s+TD/gi) || []).length;
const cleaned = body
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/^\|.*$/gm, ' ')
  .replace(/[#>*`_\[\]\(\)\-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const words = cleaned ? cleaned.split(' ').length : 0;
console.log('md prose words:', words, 'mermaid:', mermaid, 'flowchartTD:', flowchartTD);
console.log('first 200:', body.slice(0, 200));
console.log('last 200:', body.slice(-200));
