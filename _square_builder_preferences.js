'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = process.env.PULSE_ROOT || __dirname;
const PREF_FILE = process.env.SQUARE_BUILDER_PREFERENCES || path.join(ROOT, '_square_builder_preferences.json');

function emptyState() {
  return { version: 1, face: { samples: 0, rankTotal: 0, aspectTotal: 0 }, body: { samples: 0, rankTotal: 0, aspectTotal: 0 }, recent: [], updatedAt: null };
}
function readPreferences() {
  try {
    const value = JSON.parse(fs.readFileSync(PREF_FILE, 'utf8'));
    return Object.assign(emptyState(), value, {
      face: Object.assign(emptyState().face, value.face || {}),
      body: Object.assign(emptyState().body, value.body || {}),
      recent: Array.isArray(value.recent) ? value.recent : [],
    });
  } catch (e) { return emptyState(); }
}
function writePreferences(value) {
  value.updatedAt = new Date().toISOString();
  const tmp = PREF_FILE + '.tmp-' + process.pid;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  try { fs.renameSync(tmp, PREF_FILE); }
  catch (error) { fs.rmSync(PREF_FILE, { force: true }); fs.renameSync(tmp, PREF_FILE); }
  return value;
}
function slotType(value) { return String(value || '').toLowerCase() === 'face' ? 'face' : 'body'; }
function imageAspect(value) {
  const width = Math.max(0, Number(value && value.width) || 0), height = Math.max(0, Number(value && value.height) || 0);
  return width && height ? width / height : 1;
}
function preferenceProfile(state, type) {
  state = state || readPreferences(); type = slotType(type);
  const row = state[type] || {}, samples = Math.max(0, Number(row.samples) || 0);
  return { slotType: type, samples, preferredRank: samples ? row.rankTotal / samples : 0, preferredAspect: samples ? row.aspectTotal / samples : (type === 'face' ? 1 : 16 / 9) };
}
function recordPreference(choice) {
  choice = choice || {};
  const type = slotType(choice.slotType), rank = Math.max(0, Math.min(11, Number(choice.rank) || 0));
  const aspect = Math.max(0.3, Math.min(3.5, imageAspect(choice))), state = readPreferences();
  state[type].samples++; state[type].rankTotal += rank; state[type].aspectTotal += aspect;
  state.recent.unshift({ slotType: type, rank, aspect, query: String(choice.query || '').trim().slice(0, 180), selectedAt: new Date().toISOString() });
  state.recent = state.recent.slice(0, 100); writePreferences(state);
  return preferenceProfile(state, type);
}
function choosePreferredResult(results, type, usedUrls) {
  const candidates = (results || []).filter(item => item && (item.image || item.thumb));
  if (!candidates.length) return null;
  const used = usedUrls instanceof Set ? usedUrls : new Set(usedUrls || []), profile = preferenceProfile(readPreferences(), type);
  let best = null;
  candidates.forEach((item, rank) => {
    const url = item.image || item.thumb;
    if (used.has(url)) return;
    const score = Math.abs(rank - profile.preferredRank) * 1.4 + Math.abs(imageAspect(item) - profile.preferredAspect) * 3;
    if (!best || score < best.score) best = { item, rank, score, profile };
  });
  return best;
}

module.exports = { PREF_FILE, readPreferences, recordPreference, preferenceProfile, choosePreferredResult };
