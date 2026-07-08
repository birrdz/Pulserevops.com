// _pool10_new.js — pollinator 10-image face-card pool per TOPIC, two-stage with owner approval (owner 2026-07-07).
//   MODE=gen  ONLY_TOPIC=<t>  → generate 10 BRAND-NEW best pollinator images for topic t (no cooldown), email them, exit.
//   MODE=apply ONLY_TOPIC=<t> → overwrite ALL of topic t's face cards with a RANDOM one of the 10 (title baked), email done.
// Brand new every topic (gen wipes the topic's pool first). Serial. Stop: _pool10_stop.flag.
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const lib = require('./_ddg_facecard_lib');
const { storeGradedImage, coverPath, ensureDdgSectionImage } = lib;
const { fluxPromptUrl } = require('./_pollinator_flux_throttle');
const sharp = require('sharp');
const S = 760;
const POOL_DIR = WD + '/assets/pool10';
const STOP = WD + '/_pool10_stop.flag';
const PTOK = process.env.POLLINATOR_API_KEY || process.env.POLLINATIONS_TOKEN || process.env.POLLINATIONS_API_KEY || '';
const HDR = PTOK ? { Authorization: 'Bearer ' + PTOK } : {};
const RESEND_KEY = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
const RECIP = 'koryjordanwhite@gmail.com';
const COOL_MS = parseInt(process.env.POOL10_COOL_MS || '0', 10); // no cooldown by default (owner)
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = m => console.log(new Date().toISOString().slice(11, 19) + ' ' + m);
async function email(subject, html, attachments) { try { if (!RESEND_KEY) return; await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIP], subject, html, attachments: attachments || [] }) }); } catch (e) {} }

// THEME drives the SUBJECT; VARIETY only varies angle/lighting (NOT the setting) so it never forces an office.
const THEME = {
  mv: 'a dramatic movie theater and cinema, film premiere with a red carpet and marquee lights, an iconic cinematic movie still, popcorn and the big screen',
  hf: 'American football, high school and college football game on the gridiron, players in helmets and pads, quarterback throwing, packed stadium under lights, touchdown celebration', gm: 'video games and gaming — an esports arena packed with fans, pro gamers competing on stage, epic colorful video-game worlds and characters, an RGB-lit gaming battlestation, a retro arcade',
  ga: 'fun outdoor games and backyard activities — friends playing lawn games like cornhole, bocce, giant Jenga, croquet, ladder toss and ring toss, frisbee and disc golf, group party games in a sunny park or backyard, festive summer game day',
  sw: 'business software and SaaS analytics — a crisp ultra-sharp high-resolution clean modern dashboard UI full of colorful charts and graphs on a laptop and monitor screen, CRM and data visualization, sleek tech workspace, cloud software interface, pixel-perfect sharp focus',
  ev: 'elegant event and party celebrations — beautifully decorated banquet venues, string lights and floral centerpieces, festive joyful gatherings, wedding birthday and retirement party halls',
  sk: 'a professional sales training and coaching workshop — a diverse team practicing role-play, a facilitator at a whiteboard, engaged business people in a bright modern training room',
  wl: 'health and wellness — a WIDE VARIETY of distinct scenes: colorful fresh nutritious food and smoothies, gym strength training and yoga, meditation and breathwork, jogging and hiking outdoors, restful sleep in a cozy bedroom, a relaxing spa and self-care, hydration and vitamins, a healthy family cooking together, mental wellbeing and mindfulness, a fitness tracking app on a phone',
  lv: 'beautiful American towns and relaxed retirement living — scenic small-town main streets, charming tree-lined neighborhoods, cozy welcoming homes, mountain and lakeside vistas',
  tn: 'charming American towns and cities to live in — picturesque downtown main streets, walkable neighborhoods, a city skyline at golden hour, lake towns and college towns, welcoming community',
  q: 'a group of diverse corporate revenue operations professionals in a modern office', tl: 'a group of diverse corporate revenue executives and leadership team in a boardroom',
  ik: 'diverse corporate executives reviewing business results', st: 'a corporate sales training workshop with a diverse team',
  cg: 'a corporate sales coaching session', tk: 'a diverse corporate technology team at work', gp: 'a corporate go-to-market strategy meeting', ra: 'a corporate revenue operations strategy team',
  cro: 'a modern corporate boardroom and executive leadership meeting — diverse business leaders around a sleek boardroom table, a confident Chief Revenue Officer presenting revenue growth charts on a big screen, a glass-walled boardroom with city views, professional executive strategy session',
};
const themeOf = p => THEME[p] || 'a group of diverse corporate business executives and a professional leadership team in a modern office';
// PER-SLOT SUBJECTS (owner 2026-07-07): one distinct SINGLE scene per slot → variety across the set, never a
// multi-panel collage within one image. If a topic has a list here, each slot uses one item; else falls back to themeOf.
const SUBJECTS = {
  wl: [
    'a single bowl of colorful healthy salad with fresh vegetables', 'one person doing yoga in a bright airy studio',
    'a person lifting dumbbells in a modern gym', 'one person meditating peacefully at sunrise',
    'a jogger running alone on a scenic forest trail', 'a cozy tidy bedroom set for restful sleep',
    'a serene spa setting with candles and towels', 'a single glass of green smoothie with fresh fruit',
    'a family cooking one healthy meal together in a kitchen', 'a fitness tracking app on a single smartphone screen',
    'one hiker on a mountain trail with a view', 'a glass of water with lemon and cucumber',
    'one person doing breathwork outdoors in nature', 'a healthy breakfast bowl of oats and berries',
    'one person stretching on a pilates mat', 'a neat arrangement of vitamins and supplements on a table',
  ],
  lv: [
    'a charming small-town main street lined with local shops', 'a cozy retirement home with a welcoming front porch',
    'a serene lakeside house at golden hour', 'a mountain town with autumn foliage',
    'a sunny coastal beach town boardwalk', 'active retirees walking together in a green park',
    'a warm desert retirement community with palm trees', 'a historic downtown square with a fountain',
    'a manicured golf course community in morning light', 'a peaceful riverside walking trail',
    'a southern neighborhood with grand oak trees', 'a scenic overlook of rolling green hills',
    'a lively small-town farmers market', 'a quiet suburban street of tidy homes',
    'a retired couple relaxing on a porch swing', 'a town park with a white gazebo',
  ],
  tn: [
    'a lake town with waterfront homes and boat docks', 'a modern city skyline at golden hour',
    'a lively college town main street', 'an affordable leafy suburban neighborhood',
    'young professionals at a trendy downtown cafe', 'a mountain town nestled in the hills',
    'a coastal city waterfront with sailboats', 'a historic downtown district of brick buildings',
    'a riverfront park with a walking path', 'a vibrant restaurant and nightlife district at dusk',
    'a gleaming tech-city glass office district', 'an arts district with colorful murals',
    'a farmers market in a walkable town center', 'a residential street lined with front porches',
    'a bustling town square with shops and cafes', 'a scenic overlook of a growing city',
  ],
  co: [
    'a display of vintage baseball trading cards', 'a collection of rare gold and silver coins',
    'a stack of classic vintage comic books', 'vintage vinyl records in a wooden crate',
    'antique tin wind-up toys on a shelf', 'a rare postage stamp collection album',
    'signed sports memorabilia jerseys and balls', 'retro video game cartridges and a console',
    'vintage action figures in original packaging', 'a collection of antique pocket watches',
    'classic diecast toy cars on display', 'vintage movie posters framed on a wall',
    'a display case of fine jewelry and gemstones', 'antique porcelain figurines on a mantel',
    'a shelf of vintage film cameras', 'rare first-edition hardcover books on a shelf',
  ],
  cl: [
    'an elegant glass cologne bottle on a marble surface', 'a luxury fragrance bottle in soft studio lighting',
    'a close-up of a man applying cologne from a bottle', 'a collection of designer cologne bottles on a shelf',
    'a fragrance bottle surrounded by fresh citrus and botanicals', 'an amber cologne bottle with warm backlighting',
    'a sleek modern perfume bottle on a bathroom counter', 'a cologne bottle with cedar spice and cinnamon notes',
    'a crystal fragrance bottle releasing a fine mist', 'a premium cologne gift set with its box',
    'a fragrance bottle among fresh green leaves and dew', 'a sophisticated black cologne bottle on dark stone',
  ],
  mv: [
    'a grand cinema marquee glowing brightly at night', 'a bright movie theater auditorium with rows of red seats',
    'a big bucket of buttered popcorn and soda at the cinema', 'a projector beam cutting through a bright theater',
    'a red carpet premiere entrance with velvet ropes and lights', 'vintage film reels and a clapperboard on a table',
    'a huge glowing cinema screen in a bright theater', 'a colorful movie theater concession stand',
    'a wall of classic framed film posters', 'a cozy luxury home theater with a large screen',
    'an IMAX theater with a giant curved screen', 'a drive-in movie theater at golden dusk',
  ],
  hf: [
    'a packed football stadium under bright daylight', 'a football resting on the green field at the yard line',
    'a row of football helmets on the sideline bench', 'stadium goalposts and a bright scoreboard',
    'an aerial view of a football field with crisp yard lines', 'football cleats and shoulder pads on the turf',
    'a stadium tunnel opening to a bright green field', 'a football spiraling through the air toward the end zone',
    'colorful stadium seats filled with fans in daylight', 'a football locker room with jerseys hanging',
    'a night stadium glowing under bright floodlights', 'a football and pompoms on fresh green turf',
  ],
  gm: [
    'a vibrant esports arena stage with big screens and neon lights', 'an RGB-lit gaming battlestation with triple monitors',
    'a colorful retro arcade full of glowing cabinets', 'a sleek modern game controller glowing on a desk',
    'an epic bright fantasy video game landscape', 'a neon cyberpunk game city skyline',
    'a cozy gaming setup with a big monitor and LED strips', 'a shelf of colorful video game boxes',
    'a racing game cockpit with a steering wheel rig', 'a bright console and controllers on a living room table',
    'a huge esports crowd lit by glowing phone screens', 'a vivid pixel-art retro game scene',
  ],
  sw: [
    'a colorful analytics dashboard full of charts on a laptop screen', 'a CRM sales pipeline board on a bright monitor',
    'a data visualization with graphs and KPIs on a screen', 'a sleek SaaS app interface on a tablet',
    'a glowing cloud software network diagram', 'a modern tech workspace with dual monitors showing dashboards',
    'a mobile app dashboard on a smartphone', 'a bar and line chart report on a desktop screen',
    'a kanban project board on a screen', 'a code editor with colorful syntax on a monitor',
    'a sales funnel diagram on a big bright display', 'a clean office desk with a laptop showing software',
  ],
  ev: [
    'an elegant wedding reception hall with warm string lights', 'a decorated banquet table with floral centerpieces',
    'a birthday party venue with balloons and bright decor', 'an outdoor garden party setup at golden hour',
    'a ballroom set for a gala with round tables', 'a rooftop event space with city views at dusk',
    'a rustic barn wedding venue with fairy lights', 'a champagne toast table setting close-up',
    'a festive celebration with confetti and colorful decorations', 'a candle-lit elegant dinner event table',
    'a bright tent reception with warm lighting', 'a stage and dance floor set for a party',
  ],
  sk: [
    'a bright training room with a whiteboard full of notes', 'a conference room set for a workshop with notebooks',
    'a flip chart with sales strategy diagrams', 'a seminar room with rows of chairs and a screen',
    'colorful sticky notes and markers on a glass wall', 'a laptop and workbook on a training table',
    'a presentation slide on a projector screen', 'a coffee and notebook setup at a business seminar',
    'a modern classroom with a large bright monitor', 'a desk with sales playbooks and a headset',
    'a whiteboard with a sales funnel drawn on it', 'an organized workshop table with materials',
  ],
  ga: [
    'a cornhole board and bean bags on a sunny green lawn', 'a bocce ball set on a grassy court',
    'a giant Jenga tower on a bright backyard patio', 'colorful croquet mallets and balls on a lawn',
    'a ladder toss game set up in a sunny backyard', 'frisbees and a disc golf basket in a green park',
    'a horseshoe pit in a bright grassy yard', 'a badminton net set up on a sunlit lawn',
    'a spikeball net on fresh green grass', 'a ring toss game on a wooden post in a backyard',
    'a picnic table with colorful lawn games in summer', 'a bright park lawn set up for outdoor games',
  ],
  tv: [
    'a cozy living room with a large TV showing a bright show', 'a home theater setup with a big glowing screen',
    'a TV remote and popcorn on a couch', 'a wall-mounted TV in a modern living room',
    'a streaming menu on a smart TV', 'a cinematic TV scene glowing in a cozy room',
    'a family room set up for a binge-watch night', 'a retro TV set with warm vintage vibes',
    'a TV screen with colorful show graphics', 'a sleek OLED TV on a media console',
    'a blanket, remote, and snacks for TV night', 'a bright living room with a large flatscreen',
  ],
  bo: [
    'a modern commercial office buildout with clean finishes', 'a newly renovated retail storefront interior',
    'blueprints and a hard hat on a table', 'a bright open-plan office space buildout',
    'a commercial construction site with steel framing', 'a finished modern restaurant buildout interior',
    'a sleek commercial lobby with glass and stone', 'a bright warehouse interior space',
    'a renovated industrial loft with big windows', 'a construction crane against a blue sky',
    'a modern medical office interior', 'a polished retail buildout with display shelving',
  ],
  bs: [
    'a neat stack of hardcover books on a wooden desk', 'an open book beside a cup of coffee',
    'a cozy reading nook with a full bookshelf', 'a stack of business books with a small plant',
    'an open book under warm lamp light', 'a library shelf full of colorful book spines',
    'a book and reading glasses on a clean table', 'a flat-lay of a book, coffee, and notebook',
    'a bright bookstore interior with shelves', 'a single book standing on a clean surface',
    'an e-reader beside a stack of books', 'a classic leather-bound book collection',
  ],
  nl: [
    'a luxury beach club with white daybeds and turquoise sea', 'an infinity pool overlooking the bright ocean',
    'a chic beachfront lounge with cabanas and palm trees', 'a sunset cocktail bar on the beach',
    'a Mediterranean beach club terrace with loungers', 'a tropical beach club pool with a DJ booth',
    'colorful cocktails on a sunny beachside table', 'a rooftop beach club pool at golden hour',
    'a white-sand beach with luxury umbrellas and loungers', 'a stylish poolside cabana with ocean views',
    'a vibrant beach club scene at dusk', 'a yacht anchored near a bright beach club',
  ],
  rs: [
    'a tropical overwater bungalow resort in a turquoise lagoon', 'a luxury resort infinity pool at sunset',
    'a palm-lined resort beach with loungers', 'a serene spa resort with a reflecting pool',
    'a mountain resort lodge with a scenic view', 'an all-inclusive resort poolside bar',
    'a beachfront resort villa with a private deck', 'a desert oasis resort with palm trees',
    'a resort garden courtyard with fountains', 'a tropical resort beach at golden hour',
    'a poolside cabana at a luxury resort', 'a resort beach with hammocks and clear water',
  ],
  tc: [
    'a modern smartphone with a colorful screen on a desk', 'a sleek phone showing full 5G signal bars',
    'a display of the latest smartphones in a bright store', 'a phone with a data usage dashboard on screen',
    'a cell tower against a clear blue sky', 'a smartphone and SIM card on a clean table',
    'a bright phone store interior with devices', 'a phone charging on a fast charger',
    'a smartphone showing a world map for travel roaming', 'a stack of modern phones in different colors',
    'a phone with a video call on the screen', 'a sleek foldable phone on a desk',
  ],
  sp: [
    'a wooden podium with a microphone on a bright stage', 'a conference stage with a lectern and spotlight',
    'a microphone close-up under warm stage lights', 'a bright auditorium with rows of seats facing a stage',
    'a wedding toast with raised champagne glasses', 'a modern talk stage with a round spotlight',
    'index cards and a glass of water on a lectern', 'a graduation stage with a podium and banners',
    'a spotlight on a stage microphone', 'a business conference stage with a big bright screen',
    'a cozy event hall set for a speech', 'a lectern and microphone in a bright hall',
  ],
  es: [
    'a beautiful horse in a green pasture with white fences', 'an equestrian estate with a stable and paddock',
    'a luxury ranch home with horses grazing', 'a horse and rider in a bright arena',
    'a scenic horse farm at golden hour', 'a stately barn with horses and rolling hills',
    'a modern luxury condo building facade', 'a horse trotting in a sunny paddock',
    'an elegant equestrian community entrance', 'a white-fenced horse pasture under blue sky',
    'a luxury home with a pool and manicured lawn', 'a clean stable interior with groomed horses',
  ],
  dn: [
    'a beautifully plated gourmet dish on a restaurant table', 'a cozy restaurant interior with warm lighting',
    'a colorful brunch spread on a bright table', 'a bright modern restaurant kitchen',
    'a fine dining table setting with wine glasses', 'a rustic farm-to-table meal outdoors',
    'a vibrant sushi platter close-up', 'a bustling bistro with outdoor seating',
    'a stack of gourmet pancakes with fresh berries', 'a steak dinner beautifully plated with sides',
    'a modern restaurant bar with colorful cocktails', 'an elegant plated dessert',
  ],
  bt: [
    'a sleek foiling boat gliding over blue water', 'a wakeboard boat throwing a big wake on a lake',
    'a bass boat on a calm morning lake', 'a luxury yacht anchored in turquoise water',
    'a speedboat cutting through ocean waves', 'a pontoon boat on a sunny lake',
    'a sailboat with white sails on the bright sea', 'a fishing boat at a lakeside dock',
    'a center-console boat on clear water', 'a marina full of boats at golden hour',
    'a wakeboarder spraying water behind a boat', 'a boat cruising past a scenic coastline',
  ],
  sc: [
    'a beautiful university campus quad in autumn', 'a bright modern college library interior',
    'a clean classroom with desks and a whiteboard', 'graduation caps tossed against a blue sky',
    'a college lecture hall with tiered seats', 'a campus building with ivy and columns',
    'a sunny campus walkway lined with trees', 'a science lab with beakers and equipment',
    'a stainless-steel culinary school kitchen', 'a stack of textbooks and a graduation cap',
    'a campus courtyard with a fountain', 'a bright study space with laptops and books',
  ],
  er: [
    'a high-performance CPU cooler with RGB fans', 'a sleek laser printer on a bright office desk',
    'a digital photo frame displaying a vivid photo', 'a modern gadget flat-lay on a clean white desk',
    'a gaming PC with glowing internal components', 'a close-up of a circuit board with tiny lights',
    'a row of tech gadgets on a white surface', 'a mechanical keyboard with colorful backlighting',
    'a smart home speaker on a shelf', 'open wireless earbuds in their case on a table',
    'a monitor displaying vivid colors on a desk', 'a neat desk setup with tech gadgets',
  ],
  pt: [
    'a happy golden retriever in a sunny park', 'a cute kitten playing with a toy',
    'a dog running joyfully on a green lawn', 'a fluffy cat lounging in a sunbeam',
    'a puppy with a wagging tail outdoors', 'pet supplies and toys neatly arranged',
    'a parrot with bright feathers on a perch', 'a rabbit in a grassy sunny yard',
    'a dog at a bright grooming salon', 'a bowl of pet food beside a happy dog',
    'a cat curled up in a cozy bed', 'a dog catching a frisbee in the air',
  ],
  ca: [
    'a sleek sports car on an open road', 'a luxury sedan in a bright modern showroom',
    'an electric SUV charging at a station', 'a classic muscle car at golden hour',
    'a rugged off-road truck on a scenic trail', 'a modern car interior with a glowing dashboard',
    'a red convertible on a coastal highway', 'a row of new cars in a bright dealership',
    'a detailed car engine bay', 'a family SUV parked by a scenic overlook',
    'a pickup truck hauling gear outdoors', 'a gleaming freshly detailed car',
  ],
  aq: [
    'a vibrant planted freshwater aquarium', 'a colorful reef aquarium with tropical fish',
    'a betta fish with flowing fins close-up', 'an aquascaped tank with driftwood and plants',
    'a school of neon tetras in a bright tank', 'a saltwater tank with coral and clownfish',
    'a large display aquarium in a bright room', 'clean aquarium equipment and a planted tank',
    'a nano aquarium on a desk', 'a glowing jellyfish tank',
    'a goldfish in a clear bright bowl', 'a lush green aquascape with shrimp',
  ],
  fr: [
    'a bright fast-food franchise storefront', 'a busy coffee shop franchise interior',
    'a franchise restaurant sign glowing at dusk', 'a retail franchise store with tidy displays',
    'a colorful food truck on a street', 'a gym franchise interior with equipment',
    'a fresh franchise counter with menu boards', 'a franchise drive-thru at golden hour',
    'a clean bright franchise kitchen', 'a franchise storefront with an open sign',
    'a smoothie franchise counter with fresh fruit', 'a modern franchise cafe with seating',
  ],
  sy: [
    'a flat-lay of a stylish menswear outfit', 'a flat-lay of a chic womenswear outfit',
    'a rack of fashionable clothing in a bright boutique', 'stylish shoes and accessories arranged neatly',
    'a mens outfit styled on a mannequin', 'a womens outfit on a dress form',
    'a curated capsule wardrobe flat-lay', 'designer handbags and accessories on display',
    'a seasonal outfit board with fabric swatches', 'a boutique window with styled mannequins',
    'folded sweaters and accessories on a shelf', 'a sharp suit and tie flat-lay',
  ],
  ai: [
    'a modern data center with rows of servers', 'glowing blue server racks in a data center',
    'a GPU cluster with cool lighting', 'an abstract neural network visualization',
    'a glowing cloud computing network diagram', 'a circuit board with a bright AI chip',
    'a futuristic data center corridor', 'a dashboard of AI metrics on a screen',
    'fiber optic cables glowing in a server room', 'a high-tech control room with screens',
    'an abstract digital brain made of light', 'a bright cooling system in a data center',
  ],
  tk: [
    'a software architecture diagram on a bright screen', 'a dashboard of integrated business tools',
    'a developer workspace with code on monitors', 'a colorful app integration flow diagram',
    'a modern SaaS dashboard on a laptop', 'a grid of software tool icons on a screen',
    'a glowing data pipeline visualization', 'a cloud platform dashboard on a monitor',
    'a tech workspace with dual screens and charts', 'an API connection diagram on a display',
    'a bright analytics dashboard with graphs', 'a CRM and tools dashboard on a screen',
  ],
  gb: [
    'an abstract colorful geometric graphic', 'a clean flat-design illustration with shapes',
    'a vibrant gradient background with shapes', 'a set of minimalist vector icons',
    'an abstract data visualization graphic', 'a colorful isometric illustration',
    'a modern infographic layout', 'a bold abstract pattern of shapes',
    'a clean line-art illustration on white', 'a bright color palette swatch layout',
    'a geometric mark on a clean background', 'an abstract 3D shape render in bright colors',
  ],
  gp: [
    'a go-to-market strategy whiteboard with diagrams', 'a sales pipeline funnel chart on a screen',
    'a launch planning board with colorful sticky notes', 'a bright strategy room with a big screen',
    'a marketing plan drawn on a whiteboard', 'a growth chart trending up on a monitor',
    'a customer journey map on a wall', 'a market segmentation diagram on a screen',
    'a launch roadmap timeline on a display', 'a clean business strategy flowchart',
    'a sticky-note workshop wall', 'a bright conference room set for strategy',
  ],
  ra: [
    'a revenue operations flow diagram on a screen', 'an org chart on a bright display',
    'a business process flowchart on a whiteboard', 'a bright dashboard of revenue metrics',
    'a glowing systems architecture diagram', 'a funnel and pipeline diagram on a monitor',
    'a strategy blueprint on a large table', 'a data flow diagram on a screen',
    'a bright ops center with dashboards', 'a connected systems diagram on a display',
    'a revenue growth chart on a monitor', 'a clean modern operations workspace',
  ],
  ik: [
    'a colorful KPI dashboard with charts', 'a business metrics report on a bright screen',
    'a bar and line chart on a monitor', 'a scorecard of key metrics on a display',
    'a data analytics dashboard on a laptop', 'a glowing growth chart trending up',
    'gauge and metric widgets on a screen', 'a quarterly results chart on a big display',
    'a clean financial dashboard with graphs', 'a heatmap visualization on a monitor',
    'a benchmark comparison chart on a screen', 'a bright analytics workspace with charts',
  ],
  cg: [
    'a coaching notebook and pen on a bright desk', 'a whiteboard with goal-setting notes',
    'a one-on-one meeting table set with coffee', 'a motivational goal board with sticky notes',
    'a laptop and journal for a coaching call', 'a bright office set for a mentoring session',
    'a checklist and planner on a clean desk', 'a whiteboard with a growth framework drawn',
    'a cozy meeting nook with two chairs', 'a headset and notebook for a virtual call',
    'a planner with goals and a coffee cup', 'a bright room set for a coaching workshop',
  ],
  st: [
    'a sales training workshop room with a projector', 'a whiteboard with a sales process diagram',
    'a training binder and notes on a table', 'a bright seminar room with rows of chairs',
    'a flip chart with sales tips', 'a laptop showing a sales training slide',
    'sticky notes on a glass wall for role-play', 'a headset and script for call training',
    'a modern classroom with a big bright screen', 'a coffee and workbook at a sales seminar',
    'a sales playbook open on a desk', 'an organized training table with materials',
  ],
  ed: [
    'a professional advisory table with documents', 'a bright boardroom set for an advisory session',
    'a laptop and financial charts on a desk', 'a strategy document and pen on a table',
    'a modern consulting office interior', 'an advisory desk with a printed report',
    'a whiteboard with an advisory framework', 'coffee and business documents on a table',
    'a bright meeting room with a big screen', 'a planner and reports for an advisory call',
    'a clean executive desk with a laptop', 'a consulting workspace with charts',
  ],
  q: [
    'a diverse modern office with dashboards on screens', 'a bright open-plan office workspace',
    'a laptop showing analytics on a clean desk', 'a modern conference room with a big screen',
    'a revenue operations dashboard on a monitor', 'a collaborative workspace with charts on a wall',
    'a bright coworking space with laptops', 'a strategy whiteboard in a modern office',
    'a clean desk with a laptop and coffee', 'a glowing data dashboard on a screen',
    'a modern office lounge with soft lighting', 'a bright meeting pod with a monitor',
  ],
  tl: [
    'a colorful software tools dashboard on a screen', 'a laptop showing a productivity app',
    'a grid of app icons on a bright screen', 'a CRM tool dashboard on a monitor',
    'an automation workflow diagram on a display', 'a bright workspace with software on dual monitors',
    'a mobile app interface on a smartphone', 'a data dashboard with charts and widgets',
    'a sleek SaaS interface on a tablet', 'a toolkit of digital app icons arranged',
    'a project management board on a screen', 'a bright analytics tool on a laptop',
  ],
};
const subjectOf = (p, s) => (SUBJECTS[p] ? SUBJECTS[p][s % SUBJECTS[p].length] : themeOf(p));
// pure angle/lighting variety — no setting words
const SLOTS = ['wide establishing shot', 'dramatic close-up', 'golden-hour warm lighting', 'vibrant bold colors', 'cinematic wide angle', 'moody atmospheric lighting', 'bright and lively', 'epic grand scale', 'rich detailed foreground', 'high-contrast dramatic lighting'];
const QUAL = 'professional editorial photograph, sharp focus, realistic, cinematic, high detail, 4k, no text, no watermark';

async function fluxFetch(prompt, seed) {
  for (let a = 0; a < 8; a++) {
    if (fs.existsSync(STOP)) return null;
    try {
      const u = fluxPromptUrl(prompt, seed + a * 13, { pool: true });
      const r = await fetch(u, { headers: HDR, signal: AbortSignal.timeout(120000) });
      if (r.status === 429 || r.status === 503) { await sleep(6000 + a * 3000); continue; }
      if (r.ok && (r.headers.get('content-type') || '').startsWith('image')) { const b = Buffer.from(await r.arrayBuffer()); if (b.length > 4000) return b; }
    } catch (e) {}
    await sleep(2000);
  }
  return null;
}
// BLUR GATE (owner 2026-07-07): reject soft/upscaled images. Metric = variance of the Laplacian on a 320px
// greyscale copy (scale-normalized). Calibrated: blurry DDG venue shots ~140-175, sharp flux/photos 380-1070.
const BLUR_MIN = parseInt(process.env.POOL10_BLUR_MIN || '210', 10);
const BRIGHT_MIN = parseInt(process.env.POOL10_BRIGHT_MIN || '82', 10);   // reject dark/murky images (0-255 mean luminance)
async function quality(buf) {
  try {
    const m = await sharp(buf).metadata();
    if (!(Math.min(m.width || 0, m.height || 0) >= 500)) return { ok: false, score: 0 };   // tiny source → will upscale blurry
    const st = await sharp(buf).greyscale().stats();
    const bright = (st.channels[0] && st.channels[0].mean) || 0;
    const g = await sharp(buf).greyscale().resize(320, 320, { fit: 'inside' }).convolve({ width: 3, height: 3, kernel: [0, -1, 0, -1, 4, -1, 0, -1, 0] }).raw().toBuffer();
    let sum = 0, sum2 = 0, n = g.length; for (let i = 0; i < n; i++) { const v = g[i]; sum += v; sum2 += v * v; }
    const mean = sum / n, varr = sum2 / n - mean * mean;
    return { ok: varr >= BLUR_MIN && bright >= BRIGHT_MIN, score: varr };   // must be sharp AND bright
  } catch (e) { return { ok: true, score: 999 }; }   // can't measure → don't block the pipeline
}
// Fetch up to `tries` candidates, take the FIRST that clears the blur gate; if none do, keep the sharpest seen.
async function bestSharp(fetchFn, tries) {
  let best = null, bestScore = -1;
  for (let t = 0; t < tries; t++) {
    if (fs.existsSync(STOP)) break;
    const buf = await fetchFn(t);
    if (!buf) continue;
    const q = await quality(buf);
    if (q.ok) return buf;
    if (q.score > bestScore) { best = buf; bestScore = q.score; }
  }
  // Default: REFUSE (skip soft slot). SOFT_OK=1 → keep the sharpest seen so the pool never starves (e.g. portraits with bokeh).
  return (process.env.POOL10_SOFT_OK === '1') ? best : null;
}

const N_IMAGES = parseInt(process.env.N_IMAGES || '50', 10); // candidates to show — owner picks favorite 10
// TWO DEDICATED LANES: a Pollinator lane and a DDG lane, each STRICTLY ONE-AT-A-TIME. They run concurrently, so at
// most 1 flux + 1 DDG are ever in flight — NEVER two of the same provider (owner rule). No cross-fallback.
async function saveImg(dir, s, buf, tag) {
  if (!buf) { log('  ✗ ' + s + ' ' + tag); return; }
  // SHARPEN (owner 2026-07-07): unsharp-mask every image to fix softness/upscale blur, then keep it.
  try { buf = await sharp(buf).sharpen({ sigma: 2, m1: 1.5, m2: 3 }).toBuffer(); } catch (e) {}
  try { await storeGradedImage(buf, dir + '/' + String(s).padStart(2, '0') + '.jpg', { square: S, bright: false, faceCard: true, cropPosition: (process.env.POOL10_CROP || 'attention') }); log('  ✓ ' + (s + 1) + '/' + N_IMAGES + ' [' + tag + ']'); } catch (e) { log('  ✗ store ' + s + ' ' + e.message); }
}
async function ddgBuf(p, s) { // DDG ONLY — never falls back to flux (keeps the flux lane the only pollinator)
  try { const pick = await ensureDdgSectionImage('pool10' + p, s, subjectOf(p, s) + ', ' + SLOTS[s % SLOTS.length], { minScore: 6 }); if (pick && String(pick).startsWith('/assets')) { const fp = WD + pick; if (fs.existsSync(fp)) return fs.readFileSync(fp); } } catch (e) {}
  return null;
}
async function buildPool(p) {
  const dir = POOL_DIR + '/' + p;
  // START_SLOT / NO_WIPE (owner 2026-07-08): append N MORE images to an existing pool
  // (e.g. +20 shared face cards) WITHOUT deleting the already-approved slots.
  const START = parseInt(process.env.POOL10_START_SLOT || '0', 10);
  const NO_WIPE = process.env.POOL10_NO_WIPE === '1' || START > 0;
  if (!NO_WIPE) { try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {} }
  fs.mkdirSync(dir, { recursive: true });
  // TWO LANES: Pollinator (even slots) + DDG (odd slots), each STRICTLY one-at-a-time, running concurrently →
  // at most 1 flux + 1 DDG in flight, never two of the same. ~2× throughput. (owner 2026-07-07)
  const DDG_ONLY = process.env.POOL10_DDG_ONLY === '1';   // real photos only — no flux, no melted faces
  const FLUX_ONLY = process.env.POOL10_FLUX_ONLY === '1'; // crisp AI renders only (faceless topics: no blurry DDG screenshots)
  // STAGGER (owner 2026-07-07): offset the DDG lane ~20s from the flux lane so the two providers never hit their
  // throttle/cooldown at the same instant → smoother, faster overall. Both lanes still one-at-a-time.
  const STAGGER_MS = parseInt(process.env.POOL10_STAGGER_MS || '20000', 10);
  const END = START + N_IMAGES;
  const fluxLane = async () => { if (DDG_ONLY) return; const step = FLUX_ONLY ? 1 : 2; for (let s = START; s < END; s += step) { if (fs.existsSync(STOP)) return; const seed0 = s * 131 + p.charCodeAt(0) * 7; const buf = await bestSharp(t => fluxFetch(subjectOf(p, s) + ', ' + SLOTS[s % SLOTS.length] + ' — ' + QUAL, seed0 + t * 997), 2); await saveImg(dir, s, buf, 'flux'); if (COOL_MS) await sleep(COOL_MS); } };
  const ddgLane = async () => { if (FLUX_ONLY) return; if (!DDG_ONLY && STAGGER_MS) await sleep(STAGGER_MS); const step = DDG_ONLY ? 1 : 2, start = DDG_ONLY ? START : START + 1; for (let s = start; s < END; s += step) { if (fs.existsSync(STOP)) return; const buf = await bestSharp(t => ddgBuf(p, s + t * 37), 3); await saveImg(dir, s, buf, 'ddg'); if (COOL_MS) await sleep(COOL_MS); } };
  await Promise.all([fluxLane(), ddgLane()]);
}
async function applyPool(p, entries, idx) {
  const dir = POOL_DIR + '/' + p;
  const srcs = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /\.jpg$/i.test(f)).map(f => dir + '/' + f) : [];
  if (!srcs.length) { log('  ✗ ' + p + ' no pool images'); return 0; }
  // BALANCED spread: each image used ~equally (≈10% each), shuffled, and never the same image twice in a row.
  const assign = []; for (let i = 0; i < entries.length; i++) assign.push(srcs[i % srcs.length]);
  for (let i = assign.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = assign[i]; assign[i] = assign[j]; assign[j] = t; }
  for (let i = 1; i < assign.length; i++) { if (assign[i] === assign[i - 1]) { for (let k = i + 1; k < assign.length; k++) { if (assign[k] !== assign[i - 1] && (k === 0 || assign[k] !== assign[i])) { const t = assign[i]; assign[i] = assign[k]; assign[k] = t; break; } } } }
  const byId = new Map((idx.entries || []).map(e => [e && e.id, e]));
  let done = 0, dirty = 0;
  const flush = async () => { if (dirty) { try { await store.setJSON('_index.json', idx); } catch (e) { log('  idx flush ' + e.message); } dirty = 0; } };
  for (let i = 0; i < entries.length; i++) {
    if (fs.existsSync(STOP)) break;
    const e = entries[i], src = assign[i];
    try {
      await storeGradedImage(fs.readFileSync(src), coverPath(e.id), { square: S, bright: false, goldTitle: e.question, faceCard: true, cropPosition: 'attention' });
      const row = byId.get(e.id); if (row) { row.img = '/assets/qa/' + e.id + '.jpg'; row.cover_src = 'flux'; row.face_title_baked = true; dirty++; }
      done++; if (dirty >= 50) await flush(); if (done % 300 === 0) log('  … ' + p + ' applied ' + done + '/' + entries.length);
    } catch (x) { log('  ✗ apply ' + e.id + ' ' + (x && x.message)); }
  }
  await flush();
  return done;
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ents = (idx.entries || []).filter(e => e && e.id && /^[a-z]+\d+$/.test(e.id) && e.question);
  const byP = {}; for (const e of ents) { const p = e.id.match(/^([a-z]+)\d+$/)[1]; (byP[p] = byP[p] || []).push(e); }
  const order = Object.entries(byP).sort((a, b) => a[1].length - b[1].length).map(x => x[0]); // smallest first
  const MODE = process.env.MODE || 'gen';
  const p = process.env.ONLY_TOPIC || order[0];
  const list = (byP[p] || []).slice().sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  log('POOL10 mode=' + MODE + ' topic=' + p + ' (' + list.length + ' entries) · order: ' + order.join(' '));
  if (MODE === 'gen') {
    log('▶▶ GEN ' + p + ' — 10 brand-new pollinator images (no cd)');
    await buildPool(p);
    const atts = []; for (let s = 0; s < 10; s++) { const sp = POOL_DIR + '/' + p + '/' + s + '.jpg'; try { if (fs.statSync(sp).size > 8000) atts.push({ filename: p + '-' + s + '.jpg', content: fs.readFileSync(sp).toString('base64') }); } catch (e) {} }
    await email('🎨 Topic ' + p + ' — ' + atts.length + ' images to APPROVE', '<div style="font-family:system-ui,Arial,sans-serif;font-size:14px;color:#15110d"><p>Topic <b>' + p + '</b>: <b>' + atts.length + '</b> brand-new pollinator images attached. Reply <b>"approved"</b> and I\'ll overwrite all <b>' + list.length + '</b> face cards in this topic with these (random of 10, title baked), then move to the next topic.</p></div>', atts);
    log('◀ GEN ' + p + ' — emailed ' + atts.length + ' images; awaiting approval');
  } else if (MODE === 'apply') {
    log('▶▶ APPLY ' + p + ' — overwriting ' + list.length + ' face cards');
    const applied = await applyPool(p, list, idx);
    log('◀ APPLY ' + p + ' — ' + applied + ' covers overwritten');
    await email('✅ Topic ' + p + ' DONE — ' + applied + ' face cards applied', '<div style="font-family:system-ui,Arial,sans-serif;font-size:14px;color:#15110d"><p>Topic <b>' + p + '</b>: all <b>' + applied + '</b> face cards overwritten with the approved 10 images (title baked). Ready for the next topic.</p></div>');
  }
  log('DONE mode=' + MODE + ' topic=' + p);
})().catch(e => { log('FATAL ' + (e && e.message)); process.exit(1); });
