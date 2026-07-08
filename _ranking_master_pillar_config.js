// Pillar config for ranking-list master batch + progress email chains.
// Top 10 GOLD template reference (site-wide): aq1158 — https://pulserevops.com/aquariums/aq1158
module.exports = {
  aq: {
    key: 'aq',
    prefix: 'aq',
    idRe: /^aq\d+$/i,
    hub: 'aquariums',
    label: 'Aquariums',
    emoji: '🐠',
    sampleId: 'aq1158', // GOLD Top 10 template — site-wide shape lock (_ranking_top10_gold_template.js)
    progressF: '_aq_ranking_master_progress.json',
    stateF: '_aq_ranking_master_batch_state.json',
    logF: '_aq_ranking_master_batch.log',
    stopF: '_aq_ranking_master_batch_stop.flag',
    emailStopF: '_aq_ranking_master_progress_email_stop.flag',
    emailLogF: '_aq_ranking_master_progress_email.log',
  },
  sw: {
    key: 'sw',
    prefix: 'sw',
    idRe: /^sw\d+$/i,
    hub: 'software',
    label: 'Software',
    emoji: '💻',
    sampleId: 'sw0001',
    progressF: '_sw_ranking_master_progress.json',
    stateF: '_sw_ranking_master_batch_state.json',
    logF: '_sw_ranking_master_batch.log',
    stopF: '_sw_ranking_master_batch_stop.flag',
    emailStopF: '_sw_ranking_master_progress_email_stop.flag',
    emailLogF: '_sw_ranking_master_progress_email.log',
  },
};
