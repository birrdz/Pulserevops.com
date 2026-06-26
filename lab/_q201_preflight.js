const body = require('./polish-q201-v7-t115-p2-body.js');
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

const probes = {
  'Gong':                /\bGong\b/.test(body),
  'Salesforce':          /\bSalesforce\b/.test(body),
  'HubSpot':             /\bHubSpot\b/.test(body),
  'Clari':               /\bClari\b/.test(body),
  'Outreach':            /\bOutreach\b/.test(body),
  'Salesloft':           /[Ss]alesloft/.test(body),
  'Pavilion':            /\bPavilion\b/.test(body),
  'Force Management':    /Force Management/.test(body),
  'Sandler':             /\bSandler\b/.test(body),
  'Winning by Design':   /Winning by Design/.test(body),
  'Challenger':          /Challenger/.test(body),
  'MEDDICC':             /MEDDICC|MEDDPICC/.test(body),
  'Bessemer':            /Bessemer|BVP/.test(body),
  'ICONIQ':              /ICONIQ/.test(body),
  'OpenView':            /OpenView/.test(body),
  'SaaStr':              /SaaStr/.test(body),
  'RepVue':              /RepVue/.test(body),
  'Xactly':              /Xactly/.test(body),
  'CaptivateIQ':         /CaptivateIQ/.test(body),
  'Spiff':               /Spiff/.test(body),
  'Gartner':             /Gartner/.test(body),
  'Forrester':           /Forrester/.test(body),
  'CRM ticker':          /NYSE:CRM/.test(body),
  'HUBS ticker':         /NYSE:HUBS/.test(body),
  'ZoomInfo':            /ZoomInfo/.test(body),
  'LinkedIn':            /Sales Navigator|LinkedIn/.test(body),
};
const hit = Object.values(probes).filter(Boolean).length;
console.log('probes hit:', hit, '/', Object.keys(probes).length);
for (const [k, v] of Object.entries(probes)) if (!v) console.log('  MISS:', k);
