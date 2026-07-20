const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.join(__dirname, '..');
const { libraryEntryPublicUrl } = require('../netlify/functions/lib/library-entry-url');
const { _test: sitemap } = require('../netlify/functions/pulse-machine-sitemap');

test('all library entry kinds share the renderer canonical URL', () => {
  for (const id of ['q11133', 'aq1158', 'tl21749', 'st0073', 'ik0001', 'ca1107', 'ed1']) {
    assert.equal(libraryEntryPublicUrl({ id }), `https://pulserevops.com/knowledge/${id}`);
    assert.equal(sitemap.canonicalEntryUrl({ id }), `https://pulserevops.com/knowledge/${id}`);
  }
});

test('pillar sitemaps contain only their own entry IDs', () => {
  assert.equal(sitemap.entryMatchesPillar({ id: 'tl21749' }, 'tl'), true);
  assert.equal(sitemap.entryMatchesPillar({ id: 'aq1158' }, 'tl'), false);
  assert.equal(sitemap.entryMatchesPillar({ id: 'q11133' }, 'q'), true);
  assert.equal(sitemap.entryMatchesPillar({ id: 'vq_example' }, 'q'), true);
  assert.equal(sitemap.entryMatchesPillar({ id: 'ed1' }, 'q'), true);
  assert.equal(sitemap.entryMatchesPillar({ id: 'tl21749' }, 'q'), false);
});

test('sitemap lastmod uses the newest quality update timestamp', () => {
  assert.equal(sitemap.entryModifiedMs({
    ts: 100,
    polished_at: 400,
    updated_at: 300,
    last_modified_ms: 200,
  }), 400);
});

test('robots advertises only the sitemap index', () => {
  const robots = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
  const sitemapLines = robots.match(/^Sitemap:\s+\S+/gm) || [];
  assert.deepEqual(sitemapLines, ['Sitemap: https://pulserevops.com/sitemap-index.xml']);
});

test('sitemap index excludes obsolete duplicate and review sitemaps', () => {
  const index = fs.readFileSync(path.join(ROOT, 'sitemap-index.xml'), 'utf8');
  assert.doesNotMatch(index, /sitemap-reviews\.xml/);
  assert.doesNotMatch(index, /sitemap-knowledge-live\.xml/);
  assert.match(index, /sitemap-trending\.xml/);
  assert.match(index, /sitemap-drills\.xml/);
  assert.match(index, /sitemap-highschool-football-recruiting\.xml/);
});

test('specific sitemap recovery routes precede the generic splat', () => {
  const config = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
  const splat = config.indexOf('from = "/sitemap-*"');
  for (const route of [
    'from = "/sitemap-knowledge-live.xml"',
    'from = "/sitemap-reviews.xml"',
    'from = "/sitemap-trending.xml"',
  ]) {
    const position = config.indexOf(route);
    assert.notEqual(position, -1, `${route} is missing`);
    assert.ok(position < splat, `${route} must precede the generic sitemap route`);
  }
});
