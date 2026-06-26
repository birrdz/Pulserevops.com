// Render the live site at a phone viewport and report computed opacity for
// every pill/pillar element, to confirm the 50% opacity rules apply on mobile.
const puppeteer = require('puppeteer');

const SELECTORS_LANDING = ['.hdr-pill', '.hero-eyebrow', '.filter-chip:not(.is-active)', '.filter-chip.is-active', '.card-pillar', '.card-qs', '.footer-pill', '.footer-pillars span'];
const SELECTORS_HOME = ['.live-pill', '.hs-pill', '.lib-pill', '.pcard'];

async function check(page, url, selectors, waitFor) {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
  if (waitFor) { try { await page.waitForSelector(waitFor, { timeout: 15000 }); } catch (e) {} }
  await new Promise(r => setTimeout(r, 1500));
  const out = await page.evaluate((sels) => sels.map(sel => {
    const el = document.querySelector(sel);
    if (!el) return { sel, found: false };
    const op = getComputedStyle(el).opacity;
    return { sel, found: true, opacity: op };
  }), selectors);
  return out;
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');

  console.log('=== LANDING (pulserevops.com/cars) @ 390x844 mobile ===');
  const land = await check(page, 'https://pulserevops.com/cars', SELECTORS_LANDING, '.filter-chip');
  land.forEach(r => console.log('  ' + r.sel.padEnd(28) + (r.found ? 'opacity=' + r.opacity : 'NOT FOUND')));
  await page.screenshot({ path: 'C:/Users/koryj/website/_mobile_cars.png', fullPage: false });

  console.log('\n=== HOME (pulserevops.com) @ 390x844 mobile ===');
  const home = await check(page, 'https://pulserevops.com/', SELECTORS_HOME, '.pcard');
  home.forEach(r => console.log('  ' + r.sel.padEnd(28) + (r.found ? 'opacity=' + r.opacity : 'NOT FOUND')));
  await page.screenshot({ path: 'C:/Users/koryj/website/_mobile_home.png', fullPage: false });

  await browser.close();
  console.log('\nscreenshots: _mobile_cars.png, _mobile_home.png');
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
