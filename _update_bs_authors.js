// One-off: inject "by AUTHOR" into the title (question field) of the 51 BS
// entries that are missing author attribution. In-place blob update — does NOT
// touch body. Re-pings IndexNow afterward.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');

const env = fs.readFileSync('.env.local', 'utf8');
for (const l of env.split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

// 51 entries → author
const AUTHORS = {
  bs0184: 'Sam Walton',
  bs0244: 'Matthew Dixon & Brent Adamson',
  bs0245: 'Neil Rackham',
  bs0246: 'Aaron Ross & Marylou Tyler',
  bs0247: 'Keenan',
  bs0248: 'Chris Voss',
  bs0249: 'Daniel Pink',
  bs0250: 'Robert Cialdini',
  bs0251: 'Robert Cialdini',
  bs0252: 'Jeb Blount',
  bs0253: 'Jeb Blount',
  bs0254: 'Jeb Blount',
  bs0255: 'Mark Roberge',
  bs0256: 'Mike Weinberg',
  bs0257: 'Mike Weinberg',
  bs0258: 'Oren Klaff',
  bs0259: 'Oren Klaff',
  bs0260: 'David Sandler',
  bs0261: 'Michael Bosworth',
  bs0262: 'Mike Schultz & John Doerr',
  bs0263: 'Robert Miller & Stephen Heiman',
  bs0264: 'Robert Miller, Stephen Heiman & Tad Tuleja',
  bs0265: 'Robert Miller & Stephen Heiman',
  bs0266: 'David Maister, Charles Green & Robert Galford',
  bs0267: 'Aaron Ross & Jason Lemkin',
  bs0268: 'Jill Konrath',
  bs0269: 'Jill Konrath',
  bs0270: 'Jill Konrath',
  bs0271: 'Jill Konrath',
  bs0272: 'Anthony Iannarino',
  bs0273: 'Anthony Iannarino',
  bs0274: 'Anthony Iannarino',
  bs0275: 'Jeffrey Gitomer',
  bs0276: 'Jeffrey Gitomer',
  bs0277: 'Art Sobczak',
  bs0278: 'Dale Carnegie',
  bs0279: 'Grant Cardone',
  bs0280: 'Grant Cardone',
  bs0281: 'Jordan Belfort',
  bs0282: 'Brian Tracy',
  bs0283: 'Og Mandino',
  bs0284: 'Stu Heinecke',
  bs0285: 'Josiane Feigon',
  bs0286: 'Mark Hunter',
  bs0287: 'Tony Hughes',
  bs0288: 'Brent Adamson, Matthew Dixon, Pat Spenner & Nick Toman',
  bs0289: 'Thomas Williams & Thomas Saine',
  bs0290: 'Eliyahu M. Goldratt',
  bs0291: 'Geoffrey A. Moore',
  bs0292: 'Geoffrey A. Moore',
  bs0293: 'Neil Rackham',
};

function injectAuthor(title, author) {
  // Title patterns we've seen:
  //   "<Book Title> — Cliff Notes Summary"
  //   "<Book Title> — Cliff Notes Summary for Sellers"
  // Insert " by AUTHOR" before the em-dash. Preserve everything else.
  const m = title.match(/^(.+?)\s+(—|–|--)\s+(.+)$/);
  if (!m) {
    // No em-dash — just append " by AUTHOR" at the end
    return title.trim() + ' by ' + author;
  }
  const [_, bookTitle, dash, suffix] = m;
  // Already has " by " in book title? skip injection
  if (/\sby\s[A-Z]/.test(bookTitle)) return title;
  return `${bookTitle.trim()} by ${author} ${dash} ${suffix.trim()}`;
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOK });
  let updated = 0;
  const updatedUrls = [];

  for (const id of Object.keys(AUTHORS)) {
    const author = AUTHORS[id];
    let blob;
    try {
      blob = await store.get(`answers/${id}.json`, { type: 'json' });
    } catch (e) {
      console.log('  ERR ', id, 'fetch failed:', e.message);
      continue;
    }
    if (!blob) {
      console.log('  SKIP', id, '— blob not found at answers/' + id + '.json');
      continue;
    }
    const oldTitle = blob.question || blob.title || '';
    const newTitle = injectAuthor(oldTitle, author);
    if (newTitle === oldTitle) {
      console.log('  SKIP', id, '— already has author or no change ("' + oldTitle + '")');
      continue;
    }
    blob.question = newTitle;
    if (blob.title) blob.title = newTitle;
    await store.setJSON(`answers/${id}.json`, blob);
    updated++;
    updatedUrls.push('https://pulserevops.com/sales-book-summaries/' + id);
    console.log('  OK  ', id, '←', newTitle);
  }
  console.log('\nUpdated', updated, 'of', Object.keys(AUTHORS).length, 'blobs.');

  // IndexNow ping for the updated URLs
  if (updatedUrls.length) {
    const KEY = process.env.INDEXNOW_KEY || '79b1c0a8e2f44e3b9d6f4a3b8c9d0e1f';
    const body = JSON.stringify({
      host: 'pulserevops.com',
      key: KEY,
      keyLocation: 'https://pulserevops.com/' + KEY + '.txt',
      urlList: updatedUrls,
    });
    const engines = [
      'https://api.indexnow.org/IndexNow',
      'https://www.bing.com/IndexNow',
      'https://yandex.com/indexnow',
      'https://searchadvisor.naver.com/indexnow',
      'https://search.seznam.cz/indexnow',
    ];
    for (const url of engines) {
      try {
        const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body });
        console.log('  IndexNow', url, '→', r.status);
      } catch (e) {
        console.log('  IndexNow', url, 'ERR:', e.message);
      }
    }
  }

  console.log('\nDone. Updated:', updated, '/ Expected: 51');
})();
