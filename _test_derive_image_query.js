const { deriveImageSearchQuery, queryCacheKey } = require('./netlify/functions/lib/derive-image-search-query');

const cases = [
  ['best-noise-cancelling-headphones-2026', 'noise cancelling headphones'],
  ['crm-software-for-realtors-annapolis-md', 'crm software realtor'],
  ['best-crm-software-for-realtors-baltimore-md', 'crm software realtor'],
  ['top-10-hybrid-suvs-2027', 'hybrid suvs'],
];

let fails = 0;
for (const [slug, want] of cases) {
  const got = deriveImageSearchQuery(slug);
  const key = queryCacheKey(slug);
  const ok = got === want;
  if (!ok) fails++;
  console.log((ok ? 'PASS' : 'FAIL'), slug);
  console.log('  got:  ', got);
  console.log('  want: ', want);
  console.log('  key:  ', key);
}
// clone family: annapolis + baltimore should share query key
const k1 = queryCacheKey('crm-software-for-realtors-annapolis-md');
const k2 = queryCacheKey('crm-software-for-realtors-baltimore-md');
console.log('\nclone family same key:', k1 === k2, k1);
process.exit(fails || k1 !== k2 ? 1 : 0);
