/* ═══════════════════════════════════════════════════════════════════════════
   PULSE IG IMAGE GENERATOR
   Screenshots the live press release article and downloads it as PNG.
   Used by the "📷 Generate IG Image" buttons on all press release pages.

   Usage:
     generatePulseIGImage({
       slug: 'revenue-architect-spotlight',
       button: e.currentTarget   // optional — updates button state while working
     });
   ═══════════════════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  var H2C_URL = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  var _h2cLoaded = false;

  function loadHtml2Canvas(cb) {
    if (window.html2canvas) { _h2cLoaded = true; cb(); return; }
    if (_h2cLoaded) { cb(); return; }
    var s = document.createElement('script');
    s.src = H2C_URL;
    s.onload = function() { _h2cLoaded = true; cb(); };
    s.onerror = function() { alert('Could not load image generator. Check your internet connection.'); };
    document.head.appendChild(s);
  }

  function findTarget() {
    return document.querySelector('.press-wrap') ||
           document.querySelector('article') ||
           document.querySelector('main') ||
           document.body;
  }

  function downloadCanvas(canvas, filename) {
    canvas.toBlob(function(blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function() { URL.revokeObjectURL(url); }, 100);
    }, 'image/png');
  }

  window.generatePulseIGImage = function(opts) {
    opts = opts || {};
    var btn = opts.button || null;
    var origBtnText = btn ? btn.innerHTML : '';
    if (btn) { btn.innerHTML = '⏳ Generating...'; btn.disabled = true; }

    loadHtml2Canvas(function() {
      var target = findTarget();
      // Temporarily ensure the target is fully visible (un-cropped by viewport)
      var prevOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'visible';

      setTimeout(function() {
        window.html2canvas(target, {
          backgroundColor: '#111518',
          scale: 2,              // Retina-quality screenshot
          useCORS: true,
          logging: false,
          windowWidth: document.documentElement.scrollWidth,
          windowHeight: target.scrollHeight + 100
        }).then(function(canvas) {
          document.documentElement.style.overflow = prevOverflow;
          downloadCanvas(canvas, 'pulse-' + (opts.slug || 'press') + '-screenshot.png');
          if (btn) {
            btn.innerHTML = '✓ Downloaded!';
            setTimeout(function() { btn.innerHTML = origBtnText; btn.disabled = false; }, 2400);
          }
        }).catch(function(err) {
          document.documentElement.style.overflow = prevOverflow;
          alert('Could not generate image: ' + err.message);
          if (btn) { btn.innerHTML = origBtnText; btn.disabled = false; }
        });
      }, 80);
    });
  };
})();
