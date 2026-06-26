const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const accents = {
  '/ai-infrastructure': '#0284C7', '/aquariums': '#0E8FA8', '/boats': '#0E8FA8',
  '/sales-book-summaries': '#B45309', '/buildouts': '#D97706', '/cars': '#DC2626',
  '/clubs': '#166534', '/coaching': '#16A34A', '/collectibles': '#92400E',
  '/dining': '#9F1239', '/estates': '#1E3A5F', '/events': '#DB2777',
  '/franchises': '#16A34A', '/gaming': '#9333EA', '/gatherings': '#CA8A04',
  '/go-to-market-playbooks': '#0D9488', '/highschool-football-recruiting': '#1C7A3E',
  '/industry-kpis': '#D97706', '/knowledge': '#2D6A4F', '/living': '#B45309',
  '/movies': '#9333EA', '/nightlife': '#7C3AED', '/resorts': '#E8710A',
  '/revenue-architecture': '#059669', '/electronic-reviews': '#0891B2',
  '/sales-trainings': '#2563EB', '/schools': '#1E40AF', '/skills': '#DC2626',
  '/speeches': '#D97706', '/sports': '#166534', '/style': '#BE185D',
  '/tech-stacks': '#475569', '/tools': '#475569', '/towns': '#5B7553',
  '/travel': '#0284C7', '/wellness': '#059669',
};
const out = html.replace(/<a class="pcard" href="([^"]+)"/g, (m, href) => {
  const c = accents[href];
  if (!c || m.includes('--pc-accent')) return m;
  return `<a class="pcard" href="${href}" style="--pc-accent:${c}"`;
});
fs.writeFileSync('index.html', out);
console.log('patched index pcard accents');
