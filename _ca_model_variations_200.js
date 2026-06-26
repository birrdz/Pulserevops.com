// 200 automotive model variations by body style — iconic, popular, and modern.
// Each entry: Model + Type (body style) + Decade(s) for Pulse Cars semantic SEO.
// Used by _ca_compete_semantic_keywords.js, cars.html JSON-LD, and ca#### tags.

const BODY_TYPE_LABELS = {
  sedans_compact_mid: 'Compact & Mid-Size Sedan',
  sedans_fullsize_luxury: 'Full-Size & Luxury Sedan',
  suvs_compact_crossover: 'Compact SUV & Crossover',
  suvs_midsize: 'Mid-Size SUV',
  suvs_fullsize_3row: 'Full-Size & 3-Row SUV',
  pickup_trucks: 'Pickup Truck',
  electric_vehicles: 'Electric Vehicle',
  hybrid_plug_in: 'Hybrid & Plug-In Hybrid',
  sports_performance: 'Sports & Performance',
  minivans: 'Minivan',
  hatchbacks_wagons: 'Hatchback & Wagon',
  coupes_convertibles: 'Coupe & Convertible',
  off_road_specialty: 'Off-Road & Specialty SUV',
};

const MODEL_VARIATIONS_BY_BODY = {
  sedans_compact_mid: [
    'Toyota Camry', 'Honda Accord', 'Honda Civic', 'Toyota Corolla', 'Nissan Altima',
    'Hyundai Sonata', 'Hyundai Elantra', 'Kia K5', 'Kia Forte', 'Mazda Mazda3',
    'Mazda Mazda6', 'Volkswagen Jetta', 'Subaru Legacy', 'Subaru Impreza', 'Nissan Sentra',
    'Tesla Model 3', 'Toyota Crown', 'Dodge Charger', 'Subaru WRX', 'Volkswagen Passat',
  ],
  sedans_fullsize_luxury: [
    'BMW 3 Series', 'BMW 5 Series', 'Mercedes-Benz C-Class', 'Mercedes-Benz E-Class',
    'Audi A4', 'Audi A6', 'Lexus ES', 'Lexus IS', 'Genesis G70', 'Genesis G80',
    'Cadillac CT5', 'Lincoln Continental', 'Chrysler 300', 'Volvo S60', 'Volvo S90',
  ],
  suvs_compact_crossover: [
    'Toyota RAV4', 'Honda CR-V', 'Nissan Rogue', 'Hyundai Tucson', 'Kia Sportage',
    'Mazda CX-5', 'Mazda CX-30', 'Mazda CX-50', 'Subaru Forester', 'Subaru Crosstrek',
    'Volkswagen Tiguan', 'Volkswagen Taos', 'Chevrolet Equinox', 'GMC Terrain', 'Ford Escape',
    'Ford Bronco Sport', 'Honda HR-V', 'Toyota Corolla Cross', 'Hyundai Kona', 'Kia Seltos',
    'Jeep Compass', 'Nissan Kicks', 'Mitsubishi Outlander Sport', 'Buick Encore GX', 'Honda Prologue',
  ],
  suvs_midsize: [
    'Toyota Highlander', 'Honda Pilot', 'Kia Telluride', 'Hyundai Palisade', 'Jeep Grand Cherokee',
    'Toyota 4Runner', 'Honda Passport', 'Nissan Murano', 'Ford Edge', 'Ford Explorer',
    'Chevrolet Blazer', 'Chevrolet Traverse', 'Volkswagen Atlas', 'Hyundai Santa Fe', 'Kia Sorento',
    'Nissan Pathfinder', 'Dodge Durango', 'BMW X3', 'Mercedes-Benz GLC', 'Audi Q5',
    'Volvo XC60', 'Lincoln Nautilus', 'Acura MDX', 'Toyota Grand Highlander', 'Genesis GV70',
  ],
  suvs_fullsize_3row: [
    'Chevrolet Tahoe', 'Chevrolet Suburban', 'GMC Yukon', 'Cadillac Escalade', 'Ford Expedition',
    'Jeep Wagoneer', 'Toyota Sequoia', 'Toyota Land Cruiser', 'Lexus LX', 'Lincoln Navigator',
    'Nissan Armada', 'Lexus GX', 'Lexus TX', 'Subaru Ascent', 'Buick Enclave',
    'Infiniti QX80', 'BMW X7', 'Mercedes-Benz GLS', 'Audi Q7', 'Rivian R1S',
  ],
  pickup_trucks: [
    'Ford F-150', 'Chevrolet Silverado 1500', 'GMC Sierra 1500', 'Ram 1500', 'Toyota Tundra',
    'Toyota Tacoma', 'Ford Ranger', 'Chevrolet Colorado', 'GMC Canyon', 'Nissan Frontier',
    'Ford Maverick', 'Hyundai Santa Cruz', 'Tesla Cybertruck', 'Ford F-150 Lightning',
    'Chevrolet Silverado EV', 'Rivian R1T', 'Ford F-250 Super Duty', 'Ram 2500', 'Jeep Gladiator', 'Honda Ridgeline',
  ],
  electric_vehicles: [
    'Tesla Model Y', 'Tesla Model S', 'Tesla Model X', 'Ford Mustang Mach-E',
    'Hyundai Ioniq 5', 'Hyundai Ioniq 6', 'Kia EV6', 'Chevrolet Bolt EUV', 'Chevrolet Bolt EV',
    'Nissan Leaf', 'Volkswagen ID.4', 'Chevrolet Blazer EV', 'Chevrolet Equinox EV', 'Cadillac Lyriq',
    'BMW iX', 'BMW i4', 'Mercedes-Benz EQS', 'Lucid Air', 'Polestar 2', 'GMC Hummer EV',
  ],
  hybrid_plug_in: [
    'Toyota Prius', 'Toyota Prius Prime', 'Toyota RAV4 Hybrid', 'Toyota Camry Hybrid', 'Honda Accord Hybrid',
    'Honda CR-V Hybrid', 'Hyundai Tucson Hybrid', 'Kia Sorento PHEV', 'Ford Escape Hybrid', 'Lexus RX Hybrid',
    'BMW X5 xDrive50e', 'Jeep Wrangler 4xe', 'Mitsubishi Outlander PHEV', 'Kia Niro', 'Toyota Sienna Hybrid',
  ],
  sports_performance: [
    'Chevrolet Corvette', 'Ford Mustang', 'Chevrolet Camaro', 'Dodge Challenger', 'Mazda MX-5 Miata',
    'Toyota GR Supra', 'Porsche 911', 'Porsche Cayman', 'Porsche Boxster',
    'BMW M3', 'Nissan Z', 'Toyota GR86', 'Subaru BRZ',
  ],
  minivans: [
    'Honda Odyssey', 'Toyota Sienna', 'Chrysler Pacifica', 'Kia Carnival',
    'Mercedes-Benz Metris', 'Toyota Sienna Woodland', 'Chrysler Pacifica PHEV',
  ],
  hatchbacks_wagons: [
    'Volkswagen Golf GTI', 'Volkswagen Golf R', 'Hyundai Veloster', 'Honda Fit',
    'Mazda Mazda3 Hatchback', 'MINI Cooper', 'Volvo V60', 'Volkswagen Golf Alltrack',
  ],
  coupes_convertibles: [
    'Ford Mustang Convertible', 'Chevrolet Camaro Convertible', 'Chevrolet Corvette Convertible', 'BMW 4 Series',
    'Mercedes-Benz CLE', 'Audi A5', 'Jaguar F-Type', 'Mercedes-AMG SL', 'Lexus LC',
  ],
  off_road_specialty: [
    'Jeep Wrangler', 'Ford Bronco', 'Mercedes-Benz G-Class',
  ],
};

/** Iconic / modern decade bands per model (for semantic SEO) */
function decadesForModel(name, typeKey) {
  const n = String(name).toLowerCase();
  if (/tesla|ioniq|ev6|bolt|id\.4|lyriq|rivian|lucid|polestar|cybertruck|prologue|mach-e|lightning|silverado ev|equinox ev|blazer ev|hummer ev|leaf/i.test(n)) {
    return ['2010s', '2020s'];
  }
  if (/grand highlander|taos|bronco sport|corolla cross|kicks|prologue|sienna woodland|cle|gv70|tx\b|z\b|gr86|gr supra|maverick|santa cruz/i.test(n)) {
    return ['2010s', '2020s'];
  }
  if (/prius|camry|accord|civic|corolla|f-150|silverado|mustang|wrangler|4runner|tacoma|tundra|highlander|cr-v|rav4|explorer|tahoe|suburban|911|miata|charger|challenger|camaro|corvette|land cruiser|sequoia/i.test(n)) {
    return ['1990s', '2000s', '2010s', '2020s'];
  }
  if (/continental|300\b|passat|jetta|legacy|impreza|pilot|pathfinder|armada|frontier|ridgeline|odyssey|sienna|pacifica/i.test(n)) {
    return ['2000s', '2010s', '2020s'];
  }
  if (typeKey === 'electric_vehicles' || typeKey === 'hybrid_plug_in') {
    return ['2010s', '2020s'];
  }
  if (typeKey === 'sports_performance' || typeKey === 'coupes_convertibles') {
    return ['1990s', '2000s', '2010s', '2020s'];
  }
  return ['2000s', '2010s', '2020s'];
}

function buildCatalog() {
  const catalog = [];
  for (const [typeKey, models] of Object.entries(MODEL_VARIATIONS_BY_BODY)) {
    for (const model of models) {
      catalog.push({
        model,
        type: typeKey,
        typeLabel: BODY_TYPE_LABELS[typeKey] || typeKey.replace(/_/g, ' '),
        decades: decadesForModel(model, typeKey),
      });
    }
  }
  return catalog;
}

const MODEL_CATALOG = buildCatalog();

function slugifyModel(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function allModelsFlat() {
  return MODEL_CATALOG.map((r) => r.model);
}

/** Semantic phrases: Model + Type + Decade for hub meta / compete keywords */
function modelTypeDecadeKeywords() {
  const phrases = [
    '200 automotive model variations by body style',
    'Iconic popular and modern car models',
    'Pulse Cars model type decade rankings',
  ];
  for (const row of MODEL_CATALOG) {
    phrases.push(`${row.model} review`);
    phrases.push(`Best ${row.model} model years`);
    phrases.push(`${row.typeLabel}: ${row.model}`);
    for (const d of row.decades) {
      phrases.push(`${d} ${row.model}`);
      phrases.push(`Best ${row.model} ${d}`);
    }
  }
  for (const [key, label] of Object.entries(BODY_TYPE_LABELS)) {
    phrases.push(`Body Style: ${label}`);
    phrases.push(`Best ${label} 2027`);
  }
  return Array.from(new Set(phrases.map((s) => String(s).trim()).filter(Boolean)));
}

/** Slug tags for ca#### blobs */
function modelSlugTags() {
  const tags = [];
  for (const row of MODEL_CATALOG) {
    tags.push(slugifyModel(row.type));
    tags.push(slugifyModel(row.model));
    tags.push(slugifyModel(`${row.model} review`));
    for (const d of row.decades) {
      tags.push(slugifyModel(`${d}-${row.model}`));
    }
  }
  return Array.from(new Set(tags.filter(Boolean)));
}

function modelsMatchingText(text) {
  const t = String(text || '').toLowerCase();
  const hits = [];
  const matchedRows = [];

  for (const row of MODEL_CATALOG) {
    const m = row.model;
    const parts = m.toLowerCase().split(/\s+/).filter((p) => p.length > 2);
    const core = parts.slice(-2).join(' ');
    const modelHit = t.includes(m.toLowerCase()) || (core.length > 4 && t.includes(core));
    if (modelHit) {
      matchedRows.push(row);
      hits.push(slugifyModel(m), slugifyModel(`${m} review`), slugifyModel(row.type));
      for (const d of row.decades) hits.push(slugifyModel(`${d}-${m}`));
    }
    if (t.includes(row.typeLabel.toLowerCase()) || t.includes(row.type.replace(/_/g, ' '))) {
      hits.push(slugifyModel(row.type));
    }
  }

  const decadeMatch = t.match(/\b(19|20)\d{2}s?\b/);
  if (decadeMatch) {
    const yr = parseInt(decadeMatch[0], 10);
    const era = Number.isFinite(yr)
      ? `${Math.floor(yr / 10) * 10}s`
      : (decadeMatch[0].endsWith('s') ? decadeMatch[0] : `${decadeMatch[0]}s`);
    hits.push(slugifyModel(era));
    for (const row of matchedRows) {
      if (row.decades.includes(era)) hits.push(slugifyModel(`${era}-${row.model}`));
    }
  }

  return Array.from(new Set(hits));
}

/** ItemList JSON-LD for cars.html — 200 models with type + decade */
function hubModelItemListJsonLd(hubUrl = 'https://pulserevops.com/cars') {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${hubUrl}#model-catalog-200`,
    name: '200 Automotive Variations: Model, Type, and Decade',
    description:
      'Consolidated catalog of 200 iconic, popular, and modern vehicles categorized by body style (Type), with decade bands (1990s–2020s) for Pulse Cars semantic search.',
    numberOfItems: MODEL_CATALOG.length,
    itemListElement: MODEL_CATALOG.map((row, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: row.model,
        category: row.typeLabel,
        description: `${row.typeLabel} — ${row.model} (${row.decades.join(', ')})`,
        additionalProperty: row.decades.map((d) => ({
          '@type': 'PropertyValue',
          name: 'Model Decade',
          value: d,
        })),
      },
    })),
  };
}

const MODEL_COUNT = MODEL_CATALOG.length;

module.exports = {
  BODY_TYPE_LABELS,
  MODEL_VARIATIONS_BY_BODY,
  MODEL_CATALOG,
  MODEL_COUNT,
  allModelsFlat,
  modelTypeDecadeKeywords,
  modelSlugTags,
  modelsMatchingText,
  hubModelItemListJsonLd,
  slugifyModel,
  decadesForModel,
};
