// Registry: pillar prefix → keyword stack files for publish-time SEO stamping.
// Add a row here when you ship _XX_compete_semantic_keywords.js for a new pillar.
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname);

/** @type {Record<string, { phrasesPath: string|null, competeModule: string, hubPath: string|null, keywordPhrasesExport?: string }>} */
const PILLAR_SEO_REGISTRY = {
  aq: {
    phrasesPath: '_aq_keyword_phrases.json',
    competeModule: '_aq_compete_semantic_keywords.js',
    hubPath: '_aq_seo_sync_hub.js',
    keywordPhrasesExport: 'AQ_KEYWORD_PHRASES',
  },
  ai: {
    phrasesPath: '_ai_keyword_phrases.json',
    competeModule: '_ai_compete_semantic_keywords.js',
    hubPath: '_ai_seo_sync_hub.js',
    keywordPhrasesExport: 'AI_KEYWORD_PHRASES',
  },
  bt: {
    phrasesPath: '_bt_keyword_phrases.json',
    competeModule: '_bt_compete_semantic_keywords.js',
    hubPath: '_bt_seo_sync_hub.js',
    keywordPhrasesExport: 'BT_KEYWORD_PHRASES',
  },
  bs: {
    phrasesPath: '_bs_keyword_phrases.json',
    competeModule: '_bs_compete_semantic_keywords.js',
    hubPath: '_bs_seo_sync_hub.js',
    keywordPhrasesExport: 'BS_KEYWORD_PHRASES',
  },
  bo: {
    phrasesPath: '_bo_keyword_phrases.json',
    competeModule: '_bo_compete_semantic_keywords.js',
    hubPath: '_bo_seo_sync_hub.js',
    keywordPhrasesExport: 'BO_KEYWORD_PHRASES',
  },
  cg: {
    phrasesPath: '_cg_keyword_phrases.json',
    competeModule: '_cg_compete_semantic_keywords.js',
    hubPath: '_cg_seo_sync_hub.js',
    keywordPhrasesExport: 'CG_KEYWORD_PHRASES',
  },
  co: {
    phrasesPath: '_co_keyword_phrases.json',
    competeModule: '_co_compete_semantic_keywords.js',
    hubPath: '_co_seo_sync_hub.js',
    keywordPhrasesExport: 'CO_KEYWORD_PHRASES',
  },
  dn: {
    phrasesPath: '_dn_keyword_phrases.json',
    competeModule: '_dn_compete_semantic_keywords.js',
    hubPath: '_dn_seo_sync_hub.js',
    keywordPhrasesExport: 'DN_KEYWORD_PHRASES',
  },
  er: {
    phrasesPath: '_er_keyword_phrases.json',
    competeModule: '_er_compete_semantic_keywords.js',
    hubPath: '_er_seo_sync_hub.js',
    keywordPhrasesExport: 'ER_KEYWORD_PHRASES',
  },
  rs: {
    phrasesPath: '_rs_keyword_phrases.json',
    competeModule: '_rs_compete_semantic_keywords.js',
    hubPath: '_rs_seo_sync_hub.js',
    keywordPhrasesExport: 'RS_KEYWORD_PHRASES',
  },
  es: {
    phrasesPath: '_es_keyword_phrases.json',
    competeModule: '_es_compete_semantic_keywords.js',
    hubPath: '_es_seo_sync_hub.js',
    keywordPhrasesExport: 'ES_KEYWORD_PHRASES',
  },
  ev: {
    phrasesPath: '_ev_keyword_phrases.json',
    competeModule: '_ev_compete_semantic_keywords.js',
    hubPath: '_ev_seo_sync_hub.js',
    keywordPhrasesExport: 'EV_KEYWORD_PHRASES',
  },
  fr: {
    phrasesPath: '_fr_keyword_phrases.json',
    competeModule: '_fr_compete_semantic_keywords.js',
    hubPath: '_fr_seo_sync_hub.js',
    keywordPhrasesExport: 'FR_KEYWORD_PHRASES',
  },
  ga: {
    phrasesPath: '_ga_keyword_phrases.json',
    competeModule: '_ga_compete_semantic_keywords.js',
    hubPath: '_ga_seo_sync_hub.js',
    keywordPhrasesExport: 'GA_KEYWORD_PHRASES',
  },
  gm: {
    phrasesPath: '_gm_keyword_phrases.json',
    competeModule: '_gm_compete_semantic_keywords.js',
    hubPath: '_gm_seo_sync_hub.js',
    keywordPhrasesExport: 'GM_KEYWORD_PHRASES',
  },
  gp: {
    phrasesPath: '_gp_keyword_phrases.json',
    competeModule: '_gp_compete_semantic_keywords.js',
    hubPath: '_gp_seo_sync_hub.js',
    keywordPhrasesExport: 'GP_KEYWORD_PHRASES',
  },
  cl: {
    phrasesPath: '_cl_keyword_phrases.json',
    competeModule: '_cl_compete_semantic_keywords.js',
    hubPath: '_cl_seo_sync_hub.js',
    keywordPhrasesExport: 'CL_KEYWORD_PHRASES',
  },
  ca: {
    phrasesPath: null,
    competeModule: '_ca_compete_semantic_keywords.js',
    hubPath: '_ca_seo_sync_hub.js',
  },
  nl: {
    phrasesPath: '_nl_keyword_phrases.json',
    competeModule: '_nl_compete_semantic_keywords.js',
    hubPath: '_nl_seo_sync_hub.js',
    keywordPhrasesExport: 'NL_KEYWORD_PHRASES',
  },
  st: {
    phrasesPath: '_st_keyword_phrases.json',
    competeModule: '_st_compete_semantic_keywords.js',
    hubPath: '_st_seo_sync_hub.js',
    keywordPhrasesExport: 'ST_KEYWORD_PHRASES',
  },
  hf: {
    phrasesPath: '_hf_keyword_phrases.json',
    competeModule: '_hf_compete_semantic_keywords.js',
    hubPath: '_hf_seo_sync_hub.js',
    keywordPhrasesExport: 'HF_KEYWORD_PHRASES',
  },
  ik: {
    phrasesPath: '_ik_keyword_phrases.json',
    competeModule: '_ik_compete_semantic_keywords.js',
    hubPath: '_ik_seo_sync_hub.js',
    keywordPhrasesExport: 'IK_KEYWORD_PHRASES',
  },
  lv: {
    phrasesPath: '_lv_keyword_phrases.json',
    competeModule: '_lv_compete_semantic_keywords.js',
    hubPath: '_lv_seo_sync_hub.js',
    keywordPhrasesExport: 'LV_KEYWORD_PHRASES',
  },
  mv: {
    phrasesPath: '_mv_keyword_phrases.json',
    competeModule: '_mv_compete_semantic_keywords.js',
    hubPath: '_mv_seo_sync_hub.js',
    keywordPhrasesExport: 'MV_KEYWORD_PHRASES',
  },
  ra: {
    phrasesPath: '_ra_keyword_phrases.json',
    competeModule: '_ra_compete_semantic_keywords.js',
    hubPath: '_ra_seo_sync_hub.js',
    keywordPhrasesExport: 'RA_KEYWORD_PHRASES',
  },
  sc: {
    phrasesPath: '_sc_keyword_phrases.json',
    competeModule: '_sc_compete_semantic_keywords.js',
    hubPath: '_sc_seo_sync_hub.js',
    keywordPhrasesExport: 'SC_KEYWORD_PHRASES',
  },
  sk: {
    phrasesPath: '_sk_keyword_phrases.json',
    competeModule: '_sk_compete_semantic_keywords.js',
    hubPath: '_sk_seo_sync_hub.js',
    keywordPhrasesExport: 'SK_KEYWORD_PHRASES',
  },
  sp: {
    phrasesPath: '_sp_keyword_phrases.json',
    competeModule: '_sp_compete_semantic_keywords.js',
    hubPath: '_sp_seo_sync_hub.js',
    keywordPhrasesExport: 'SP_KEYWORD_PHRASES',
  },
  sy: {
    phrasesPath: '_sy_keyword_phrases.json',
    competeModule: '_sy_compete_semantic_keywords.js',
    hubPath: '_sy_seo_sync_hub.js',
    keywordPhrasesExport: 'SY_KEYWORD_PHRASES',
  },
  tk: {
    phrasesPath: '_tk_keyword_phrases.json',
    competeModule: '_tk_compete_semantic_keywords.js',
    hubPath: '_tk_seo_sync_hub.js',
    keywordPhrasesExport: 'TK_KEYWORD_PHRASES',
  },
  tl: {
    phrasesPath: '_tl_keyword_phrases.json',
    competeModule: '_tl_compete_semantic_keywords.js',
    hubPath: '_tl_seo_sync_hub.js',
    keywordPhrasesExport: 'TL_KEYWORD_PHRASES',
  },
  tn: {
    phrasesPath: '_tn_keyword_phrases.json',
    competeModule: '_tn_compete_semantic_keywords.js',
    hubPath: '_tn_seo_sync_hub.js',
    keywordPhrasesExport: 'TN_KEYWORD_PHRASES',
  },
  tv: {
    phrasesPath: '_tv_keyword_phrases.json',
    competeModule: '_tv_compete_semantic_keywords.js',
    hubPath: '_tv_seo_sync_hub.js',
    keywordPhrasesExport: 'TV_KEYWORD_PHRASES',
  },
  wl: {
    phrasesPath: '_wl_keyword_phrases.json',
    competeModule: '_wl_compete_semantic_keywords.js',
    hubPath: '_wl_seo_sync_hub.js',
    keywordPhrasesExport: 'WL_KEYWORD_PHRASES',
  },
};

const _moduleCache = Object.create(null);
const _loggedSkip = new Set();

function listRegisteredPrefixes() {
  return Object.keys(PILLAR_SEO_REGISTRY);
}

function getPillarRegistry(prefix) {
  if (!prefix) return null;
  return PILLAR_SEO_REGISTRY[String(prefix).toLowerCase()] || null;
}

function loadCompeteModule(prefix) {
  const key = String(prefix || '').toLowerCase();
  const reg = getPillarRegistry(key);
  if (!reg) return null;
  if (_moduleCache[key]) return _moduleCache[key];
  const fullPath = path.join(ROOT, reg.competeModule);
  if (!fs.existsSync(fullPath)) return null;
  // eslint-disable-next-line import/no-dynamic-require, global-require
  _moduleCache[key] = require(fullPath);
  return _moduleCache[key];
}

function keywordPhraseCount(mod, reg) {
  if (!mod) return 0;
  if (reg && reg.keywordPhrasesExport && Array.isArray(mod[reg.keywordPhrasesExport])) {
    return mod[reg.keywordPhrasesExport].length;
  }
  const phraseKey = Object.keys(mod).find((k) => k.endsWith('_KEYWORD_PHRASES'));
  if (phraseKey && Array.isArray(mod[phraseKey])) return mod[phraseKey].length;
  if (typeof mod.MODEL_COUNT === 'number') return mod.MODEL_COUNT;
  return 0;
}

function logSkipOnce(prefix, reason) {
  const key = `${prefix}:${reason}`;
  if (_loggedSkip.has(key)) return;
  _loggedSkip.add(key);
  console.log(`[pillar-seo] skip prefix "${prefix}" — ${reason}`);
}

module.exports = {
  PILLAR_SEO_REGISTRY,
  listRegisteredPrefixes,
  getPillarRegistry,
  loadCompeteModule,
  keywordPhraseCount,
  logSkipOnce,
};
