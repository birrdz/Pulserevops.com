// ════════════════════════════════════════════════════════════════════════
// pulse-max-plan-widget.js — DISABLED 2026-06-03 per owner directive
// ("remove the progress bar on the bottom right corner ... on all pages").
//
// Old behavior: rendered a sitewide compact "Max Plan 5-hour-block" usage
// pill at bottom-right showing the rolling 5h Anthropic Max usage block.
//
// New behavior: no-op. The file remains so existing <script src> tags on
// every page (~25+ files) keep returning 200 — but nothing is rendered.
// Belt-and-suspenders: also remove any pre-existing widget node if it was
// added by a stale cached copy of this script.
// ════════════════════════════════════════════════════════════════════════
(function(){
  'use strict';
  function purge(){
    try {
      var ids = ['pulse-max-plan-pill', 'pmpp', 'pulse-max-widget', 'pmpp-root', 'max-plan-pill', 'spend-pace-pill'];
      ids.forEach(function(id){
        var el = document.getElementById(id);
        if (el && el.parentNode) el.parentNode.removeChild(el);
      });
      var sels = ['.pulse-max-plan-pill','.pulse-max-widget','.pmpp','.max-plan-pill','.spend-pace','.spend-pace-pill'];
      sels.forEach(function(s){
        var nodes = document.querySelectorAll(s);
        nodes.forEach(function(n){ if (n.parentNode) n.parentNode.removeChild(n); });
      });
    } catch(_e) {}
  }
  // Run immediately + after DOM ready + once more after 1s to catch any
  // late-inserted widget from a previously cached version of this script.
  purge();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', purge, { once: true });
  }
  setTimeout(purge, 1000);
})();
