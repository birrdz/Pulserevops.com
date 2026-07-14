// _publish_cover.js — stamp a LIVE cover URL + bake local face-card after text-first publish.
// Live CDN needs a URL that already exists (topic hero or pool-*). Face JPG is written to
// assets/qa/<id>.jpg for the next assets deploy; index.img uses a live URL so recent/pillar
// mosaics show an image immediately.
'use strict';
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';

const TOPIC_IMG = {
  q: '/assets/topics/current-events.jpg', ce: '/assets/topics/current-events.jpg',
  st: '/assets/topics/sales-trainings.jpg', ik: '/assets/topics/industry-kpis.jpg',
  tk: '/assets/topics/tech-stacks.jpg', gb: '/assets/topics/graphics.jpg',
  bs: '/assets/topics/sales-book-summaries.jpg', er: '/assets/topics/electronic-reviews.jpg',
  ra: '/assets/topics/revenue-architecture.jpg', gp: '/assets/topics/go-to-market-playbooks.jpg',
  fr: '/assets/topics/franchises.jpg', ca: '/assets/topics/cars.jpg', tn: '/assets/topics/towns.jpg',
  sc: '/assets/topics/towns.jpg', nl: '/assets/topics/nightlife.jpg', dn: '/assets/topics/dining.jpg',
  bt: '/assets/topics/boats.jpg', mv: '/assets/topics/movies.jpg', wl: '/assets/topics/wellness.jpg',
  dr: '/assets/topics/drills.jpg', tv: '/assets/topics/travel.jpg', rs: '/assets/topics/resorts.jpg',
  es: '/assets/topics/estates.jpg', cl: '/assets/topics/clubs.jpg', lv: '/assets/topics/living.jpg',
  ev: '/assets/topics/events.jpg', sy: '/assets/topics/style.jpg', ga: '/assets/topics/events.jpg',
  gm: '/assets/topics/gaming.jpg', sk: '/assets/topics/skills.jpg', sp: '/assets/topics/speeches.jpg',
  tl: '/assets/topics/tools.jpg', cg: '/assets/topics/coaching.jpg', co: '/assets/topics/collectibles.jpg',
  aq: '/assets/topics/aquariums.jpg', hf: '/assets/topics/highschool-football-recruiting.jpg',
  ai: '/assets/topics/ai-infrastructure.jpg', bo: '/assets/topics/buildouts.jpg',
  cd: '/assets/topics/contracts.jpg', tc: '/assets/topics/telco.jpg', pt: '/assets/topics/pets.jpg',
  sw: '/assets/topics/software.jpg', cr: '/assets/topics/fish-and-crabs-crab.jpg',
  fs: '/assets/topics/fish-and-crabs-fish.jpg',
};

const ROUTE = {
  q: 'knowledge', ce: 'knowledge', st: 'sales-trainings', ik: 'industry-kpis', tk: 'tech-stacks',
  gb: 'graphics', bs: 'sales-book-summaries', er: 'electronic-reviews', ra: 'revenue-architecture',
  gp: 'go-to-market-playbooks', fr: 'franchises', ca: 'cars', tn: 'towns', sc: 'schools',
  nl: 'nightlife', dn: 'dining', bt: 'boats', mv: 'movies', wl: 'wellness', dr: 'drills',
  tv: 'travel', rs: 'resorts', es: 'estates', cl: 'clubs', lv: 'living', ev: 'events',
  sy: 'style', ga: 'gatherings', gm: 'gaming', sk: 'skills', sp: 'speeches', tl: 'tools',
  cg: 'coaching', co: 'collectibles', aq: 'aquariums', hf: 'highschool-football-recruiting',
  ai: 'ai-infrastructure', bo: 'buildouts', cd: 'contracts', tc: 'telco', pt: 'pets',
  sw: 'software', cr: 'crabbing', fs: 'fishing',
};

function prefixOf(id) {
  return (String(id).match(/^([a-z]+)/i) || ['', 'q'])[1].toLowerCase();
}
function topicImgFor(id) {
  return TOPIC_IMG[prefixOf(id)] || '/assets/topics/current-events.jpg';
}
function routeSegFor(id) {
  return ROUTE[prefixOf(id)] || 'knowledge';
}
function publicUrlFor(id) {
  return 'https://pulserevops.com/' + routeSegFor(id) + '/' + id;
}
function hashPick(id, n) {
  let h = 0;
  for (let i = 0; i < String(id).length; i++) h = (h * 31 + String(id).charCodeAt(i)) >>> 0;
  return n ? h % n : h;
}

function listDonors(prefix) {
  const out = [];
  const walk = (dir) => {
    try {
      for (const n of fs.readdirSync(dir)) {
        const p = path.join(dir, n);
        try {
          if (fs.statSync(p).isDirectory()) walk(p);
          else if (/\.jpe?g$/i.test(n) && fs.statSync(p).size > 3000) out.push(p);
        } catch (e) {}
      }
    } catch (e) {}
  };
  // Prefer pillar-scoped facecard pool, then approved Pexels library.
  const pillarPool = path.join(WD, '_facecard_pool', prefix);
  if (fs.existsSync(pillarPool)) walk(pillarPool);
  walk(path.join(WD, 'assets', 'qa', '_pexels_stored'));
  if (!out.length) walk(path.join(WD, '_facecard_pool'));
  return out;
}

/** Pick a live CDN cover: prefer existing pool-<prefix>-NNN.jpg, else topic hero. */
function liveCoverUrl(id) {
  const pfx = prefixOf(id);
  const poolDir = path.join(WD, 'assets', 'qa');
  const slots = [];
  try {
    for (const n of fs.readdirSync(poolDir)) {
      const m = n.match(new RegExp('^pool-' + pfx + '-(\\d+)\\.jpe?g$', 'i'));
      if (m) slots.push({ n: Number(m[1]), file: n });
    }
  } catch (e) {}
  if (slots.length) {
    slots.sort((a, b) => a.n - b.n);
    const pick = slots[hashPick(id, slots.length)];
    return '/assets/qa/' + pick.file;
  }
  return topicImgFor(id);
}

/**
 * After publishTextFirst: bake local face-card + stamp index/blob with a LIVE img URL.
 * @returns {{ ok, img, faceLocal, cover_src }}
 */
async function attachPublishCover(store, id, title) {
  const liveImg = liveCoverUrl(id);
  let faceLocal = false;
  let coverSrc = liveImg.startsWith('/assets/topics/') ? 'topic-interim' : 'pool-interim';

  try {
    const flib = require('./_ddg_facecard_lib');
    const donors = listDonors(prefixOf(id));
    if (donors.length) {
      const buf = fs.readFileSync(donors[hashPick(id, donors.length)]);
      await flib.gradeFaceCardFromBuffer(buf, flib.coverPath(id), {
        question: title,
        goldTitle: title,
      });
      faceLocal = true;
      coverSrc = 'pexels-stored';
      // Prefer the dedicated face URL once the file exists locally — live site
      // still 404s until assets deploy, so keep liveImg as the stamped CDN URL.
    }
  } catch (e) {
    // non-fatal — live topic/pool cover still stamps
  }

  const patch = {
    img: liveImg,
    cover_src: coverSrc,
    face_title_baked: faceLocal,
    face_local_ready: faceLocal,
    face_path: '/assets/qa/' + id + '.jpg',
    images_pending: !faceLocal,
  };

  try {
    const blob = await store.get('answers/' + id + '.json', { type: 'json' });
    if (blob) await store.setJSON('answers/' + id + '.json', Object.assign({}, blob, patch));
  } catch (e) {}

  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' }) || { entries: [] };
    const ent = (idx.entries || []).find((e) => e && e.id === id);
    if (ent) {
      Object.assign(ent, {
        img: liveImg,
        cover_src: coverSrc,
        face_title_baked: faceLocal,
        images_pending: !faceLocal,
      });
      await store.setJSON('_index.json', idx);
    }
  } catch (e) {}

  return { ok: true, img: liveImg, faceLocal, cover_src: coverSrc };
}

module.exports = {
  TOPIC_IMG, ROUTE, prefixOf, topicImgFor, routeSegFor, publicUrlFor,
  liveCoverUrl, attachPublishCover, listDonors,
};
