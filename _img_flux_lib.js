// _img_flux_lib.js — Pollinator flux (cover + sections). Topics-page look via buildFlux*Query + storeGradedImage.
const fs = require('fs');
const { runFluxJob, fetchFluxPrompt } = require('./_pollinator_flux_throttle');
const { storeGradedImage, buildFluxFaceQuery, buildFluxSectionQuery, gradeFaceCardFromBuffer } = require('./_ddg_facecard_lib');
const WD = 'C:/Users/koryj/website', QDIR = WD + '/assets/qa';
if (!fs.existsSync(QDIR)) fs.mkdirSync(QDIR, { recursive: true });
const S = 760;
const clean = s => String(s || '').replace(/[#*_`>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220);
const hash = id => { let s = 0; for (const c of String(id)) s = (s * 31 + c.charCodeAt(0)) >>> 0; return s; };
const coverFileOk = id => { try { return fs.statSync(QDIR + '/' + id + '.jpg').size > 40000; } catch (e) { return false; } };

async function makeCover(id, q) {
  if (coverFileOk(id)) return true;
  return runFluxJob(async () => {
    const prompt = buildFluxFaceQuery(id, clean(q) || id, 0);
    const b = await fetchFluxPrompt(prompt, hash(id), { pool: true });
    if (!b) return false;
    await gradeFaceCardFromBuffer(b, QDIR + '/' + id + '.jpg', { question: clean(q) || id });
    return true;
  }, 'cover:' + id);
}
async function makeContent(id, n, alt) {
  return runFluxJob(async () => {
    const prompt = buildFluxSectionQuery(id, alt, n, 0);
    const b = await fetchFluxPrompt(prompt, hash(id) + n * 101, { pool: true });
    if (!b) return null;
    await storeGradedImage(b, QDIR + '/' + id + '-' + n + '.jpg', { width: 1024, bright: false });
    return '/assets/qa/' + id + '-' + n + '.jpg';
  }, 'img:' + id + '-' + n);
}
async function replaceAsync(str, re, fn) { const parts = []; let last = 0, m; re.lastIndex = 0; while ((m = re.exec(str))) { parts.push(str.slice(last, m.index)); parts.push(await fn(m)); last = m.index + m[0].length; if (m[0] === '') re.lastIndex++; } parts.push(str.slice(last)); return parts.join(''); }

// kory-white.jpg is NOT a body image — CRO widget only (render time).
const KORY_CRO_IMG = '/assets/kory-white.jpg';
function isKoryCroImg(u) { return u === KORY_CRO_IMG; }

function countCoverFluxJobs(id, coverSrc) {
  const needCover = !coverFileOk(id);
  return { needCover, internal: 0, total: needCover ? 1 : 0 };
}

// PRODUCE: face-card cover only — internal images stay external (DDG).
async function fluxifyCoverOnly(id, question, body, coverSrc, onProgress, shouldAbort) {
  const abort = () => { if (shouldAbort && shouldAbort()) { const e = new Error('SCRUB_STOP'); e.code = 'SCRUB_STOP'; throw e; } };
  const plan = countCoverFluxJobs(id, coverSrc);
  let done = 0;
  const tick = (label) => {
    if (onProgress) onProgress({ done, total: plan.total, label, detail: done + ' of ' + plan.total + ' flux jobs' });
  };
  try {
    if (plan.needCover) {
      abort();
      tick('face-card cover');
      await makeCover(id, question);
      done++;
      tick('face-card cover');
    }
    let n = 0;
    body = await replaceAsync(body, /!\[([^\]]*)\]\(([^)\s]+)\)/g, async (m) => {
      n++;
      if (n === 1) return '![' + (m[1] || question).replace(/[\[\]]/g, '') + '](/assets/qa/' + id + '.jpg)';
      return m[0];
    });
    return { body, allFlux: bodyImagesAllFlux(body), fluxDone: done, fluxTotal: plan.total };
  } catch (e) { return { body, allFlux: bodyImagesAllFlux(body), fluxDone: done, fluxTotal: plan.total }; }
}

// GATE (legacy all-flux mode): every image is /assets/qa/ or cro-cover or Kory.
function bodyImagesAllFlux(body) {
  const s = String(body || '');
  const urls = [];
  let m; const md = /!\[[^\]]*\]\(([^)\s]+)\)/g; while ((m = md.exec(s))) urls.push(m[1]);
  const pr = /@@PRODUCT\b[^\n]*?\bimg="([^"]+)"/g; while ((m = pr.exec(s))) urls.push(m[1]);
  if (!urls.length) return false;
  return urls.every(u => /^\/assets\/qa\//.test(u) || /^\/assets\/cro-cover-/.test(u) || isKoryCroImg(u));
}

// PRODUCE: convert an entry's cover (skip if flux) + all internal images to flux (gap-fill smart).
// Images are built strictly one-at-a-time — each makeCover/makeContent waits for the prior to finish.
// onProgress({ done, total, label, detail }) fires before each image job.
function countFluxJobs(id, body, coverSrc) {
  const needCover = !coverFileOk(id);
  let internal = 0;
  let m, first = true;
  const md = /!\[[^\]]*\]\(([^)\s]+)\)/g;
  while ((m = md.exec(String(body || '')))) {
    if (first) { first = false; continue; }
    if (!/^\/assets\/qa\//.test(m[1]) && !/^\/assets\/cro-cover-/.test(m[1]) && !isKoryCroImg(m[1])) internal++;
  }
  const pr = /@@PRODUCT\b[^\n]*?\bimg="([^"]+)"/g;
  while ((m = pr.exec(String(body || '')))) {
    if (!/^\/assets\/qa\//.test(m[1])) internal++;
  }
  return { needCover, internal, total: (needCover ? 1 : 0) + internal };
}

async function fluxifyBody(id, question, body, coverSrc, onProgress, shouldAbort) {
  const abort = () => { if (shouldAbort && shouldAbort()) { const e = new Error('SCRUB_STOP'); e.code = 'SCRUB_STOP'; throw e; } };
  const plan = countFluxJobs(id, body, coverSrc);
  let done = 0;
  const tick = (label) => {
    if (onProgress) onProgress({ done, total: plan.total, label, detail: done + ' of ' + plan.total + ' images created' });
  };
  try {
    if (plan.needCover) {
      abort();
      tick('face-card cover');
      await makeCover(id, question);
      done++;
      tick('face-card cover');
    }
    let n = 0;
    body = await replaceAsync(body, /!\[([^\]]*)\]\(([^)\s]+)\)/g, async (m) => {
      abort();
      n++;
      if (n === 1) return '![' + (m[1] || question).replace(/[\[\]]/g, '') + '](/assets/qa/' + id + '.jpg)';
      if (/^\/assets\/qa\//.test(m[2]) || isKoryCroImg(m[2])) return m[0];
      tick('image ' + (done + 1));
      const p = await makeContent(id, n, m[1] || question);
      done++;
      tick(p ? ('image ' + done) : 'image failed');
      return p ? '![' + (m[1] || '').replace(/[\[\]]/g, '') + '](' + p + ')' : m[0];
    });
    body = await replaceAsync(body, /(@@PRODUCT\b[^\n]*?\bimg=")([^"]+)(")/g, async (m) => {
      abort();
      n++;
      if (/^\/assets\/qa\//.test(m[2])) return m[0];
      tick('product image ' + (done + 1));
      const nm = (m[0].match(/name="([^"]+)"/) || [])[1] || (m[0].match(/title="([^"]+)"/) || [])[1] || question;
      const p = await makeContent(id, n, nm);
      done++;
      tick(p ? ('product image ' + done) : 'product image failed');
      return p ? m[1] + p + m[3] : m[0];
    });
    return { body, allFlux: bodyImagesAllFlux(body), fluxDone: done, fluxTotal: plan.total };
  } catch (e) { return { body, allFlux: bodyImagesAllFlux(body), fluxDone: done, fluxTotal: plan.total }; }
}
module.exports = { fluxifyBody, fluxifyCoverOnly, bodyImagesAllFlux, makeCover, makeContent, countFluxJobs, countCoverFluxJobs, KORY_CRO_IMG, isKoryCroImg };
