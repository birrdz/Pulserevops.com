// Wire the 8 chosen images into the /hire tiles (image + dark scrim + white text). Saves picks too.
const fs = require('fs');
const picks = { BOOK: 1, HIRE: 1, RESUME: 2, LINKEDIN: 2, SYNDICATE: 4, ABOUT: 3, CONTACT: 2, TOOLS: 1 };
const markers = {
  BOOK: 'data-pulse-click="hire-cro"', HIRE: 'href="/coaching"', RESUME: 'data-pulse-click="resume"',
  LINKEDIN: 'data-pulse-click="curator"', SYNDICATE: 'data-pulse-click="cro-syndicate"',
  ABOUT: 'data-pulse-click="cro-syndicate-about"', CONTACT: 'data-pulse-click="cro-syndicate-contact"', TOOLS: 'href="/tools"'
};
let html = fs.readFileSync('hire.html', 'utf8');
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ref = {};
for (const tag of Object.keys(picks)) {
  const img = picks[tag];
  const src = `assets/qa/_prev/hire-${tag}-${img}.jpg`;
  const dest = `assets/hire-tile-${tag.toLowerCase()}.jpg`;
  if (fs.existsSync(src)) fs.copyFileSync(src, dest); else { console.log('MISSING ' + src); continue; }
  ref[tag] = { img, file: '/' + dest };
  const newStyle = `background:linear-gradient(rgba(8,6,4,.30),rgba(8,6,4,.74)),url('/${dest}');background-size:cover;background-position:center;color:#fff`;
  const re = new RegExp('(<a class="t[^>]*?' + esc(markers[tag]) + '[^>]*?style=")[^"]*(")');
  const before = html;
  html = html.replace(re, '$1' + newStyle + '$2');
  console.log((before === html ? 'NO-MATCH ' : 'wired ') + tag + ' -> ' + dest);
}
// BOOK had dark inline text colors — make them light for readability over the image
html = html.replace(/color:#1a1206/g, 'color:#fff').replace(/color:#3a2a08/g, 'color:#f0e6d0');
fs.writeFileSync('hire.html', html);
fs.writeFileSync('_hire_reference.json', JSON.stringify(ref, null, 2));
console.log('DONE — 8 tiles wired. Preview: http://localhost:8891/hire.html');
