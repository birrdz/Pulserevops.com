// Dynamic sitemap for all /tools/<slug> CRM + War Room landing pages.
const { SITE, TOOLS } = require('./lib/pulse-tools-registry');

function escXml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

exports.handler = async () => {
  const today = new Date().toISOString().slice(0, 10);
  let body = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + '<url><loc>' + SITE + '/tools/</loc><lastmod>' + today + '</lastmod>'
    + '<changefreq>weekly</changefreq><priority>0.92</priority></url>\n'
    + '<url><loc>' + SITE + '/dashboard.html</loc><lastmod>' + today + '</lastmod>'
    + '<changefreq>weekly</changefreq><priority>0.95</priority></url>\n';

  Object.entries(TOOLS).forEach(([slug, t]) => {
    if (t.noindex) return;
    const pri = t.category === 'crm' || t.category === 'warroom' ? '0.9' : '0.85';
    body += '<url><loc>' + SITE + '/tools/' + escXml(slug) + '</loc>'
      + '<lastmod>' + today + '</lastmod>'
      + '<changefreq>monthly</changefreq>'
      + '<priority>' + pri + '</priority></url>\n';
  });

  body += '</urlset>';

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=7200',
    },
    body,
  };
};
