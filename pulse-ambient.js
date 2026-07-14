/* pulse-ambient.js — music + gesture audio unlock REMOVED (owner 2026-07-12).
 * Kept as a no-op stub so existing <script src="/pulse-ambient.js"> tags stay harmless.
 * Does NOT create AudioContext, does NOT arm pointer/scroll listeners, does NOT inject
 * face/mosaic/idle scripts (those were causing first-mouse lag on every page). */
(function () {
  if (window.__pulseAmbient) return;
  window.__pulseAmbient = true;
})();
