const {
  entryTopicKey,
  entryTopicQuery,
  sectionImageSearchQuery,
} = require('./netlify/functions/lib/entry-image-query');

const cases = [
  ['Best Noise Cancelling Headphones 2026', 'Sound Quality', 'noise cancelling headphones sound quality'],
  ['CRM Software for Realtors Annapolis MD', 'Pipeline Setup', 'crm software realtor pipeline setup'],
  ['CRM Software for Realtors Baltimore MD', 'Pipeline Setup', 'crm software realtor pipeline setup'],
];

let fails = 0;
for (const [title, sect, wantPrefix] of cases) {
  const key = entryTopicKey(title);
  const topic = entryTopicQuery(title);
  const q = sectionImageSearchQuery(title, sect);
  const ok = q.startsWith(wantPrefix.split(' ').slice(0, 3).join(' ').slice(0, wantPrefix.length - 5));
  const key2 = entryTopicKey('CRM Software for Realtors Baltimore MD');
  console.log('title:', title.slice(0, 40));
  console.log('  key:', key);
  console.log('  topic:', topic);
  console.log('  sectionQ:', q);
  if (title.includes('Annapolis') && key !== key2) { fails++; console.log('  FAIL clone key mismatch'); }
}
console.log('clone keys match:', entryTopicKey('crm-software-for-realtors-annapolis-md') === entryTopicKey('crm-software-for-realtors-baltimore-md'));
process.exit(fails ? 1 : 0);
