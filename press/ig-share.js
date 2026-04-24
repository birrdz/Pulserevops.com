/* ═══════════════════════════════════════════════════════════════════════════
   PULSE IG IMAGE GENERATOR
   Builds a 1080×1080 PNG of a press release card and downloads it.
   Used by the "📷 Generate IG Image" buttons on all press release pages.

   Usage:
     generatePulseIGImage({
       headline: 'The Executive Review Breaks 16-Year Silicon Valley Tradition...',
       eyebrow:  'For Immediate Release · April 12, 2026',
       publisher:'EIN PRESSWIRE · THE EXECUTIVE REVIEW',
       slug:     'revenue-architect-spotlight'
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

  // Build a hidden 1080x1080 styled card off-screen, render it, return canvas
  function buildCard(opts) {
    var card = document.createElement('div');
    card.id = '_pulse-ig-card';
    card.style.cssText = [
      'position:fixed',
      'left:-99999px',
      'top:0',
      'width:1080px',
      'height:1080px',
      'background:linear-gradient(135deg,#0a0e12 0%,#111518 50%,#1a1f25 100%)',
      'color:#EDE5D8',
      'font-family:"Segoe UI",system-ui,sans-serif',
      'padding:90px 80px',
      'box-sizing:border-box',
      'display:flex',
      'flex-direction:column',
      'justify-content:space-between',
      'overflow:hidden'
    ].join(';');

    // Decorative honeycomb-style accent in top-right
    var accent = document.createElement('div');
    accent.style.cssText = 'position:absolute;top:-120px;right:-120px;width:480px;height:480px;border-radius:50%;background:radial-gradient(circle,rgba(232,113,10,0.18),transparent 70%);';
    card.appendChild(accent);

    var accent2 = document.createElement('div');
    accent2.style.cssText = 'position:absolute;bottom:-200px;left:-100px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(255,140,26,0.12),transparent 70%);';
    card.appendChild(accent2);

    // Top: PULSE wordmark + tag line
    var top = document.createElement('div');
    top.style.cssText = 'position:relative;z-index:2;';

    var brand = document.createElement('div');
    brand.style.cssText = 'display:flex;align-items:baseline;gap:18px;margin-bottom:20px;';
    brand.innerHTML =
      '<div style="font-size:64px;font-weight:900;letter-spacing:4px;color:#E8710A;line-height:1;">PULSE</div>' +
      '<div style="font-size:18px;font-weight:700;letter-spacing:2px;color:rgba(237,229,216,0.55);text-transform:uppercase;">RevOps</div>';
    top.appendChild(brand);

    var eyebrow = document.createElement('div');
    eyebrow.style.cssText = 'font-size:16px;font-weight:800;letter-spacing:3px;color:#E8710A;text-transform:uppercase;margin-bottom:14px;padding:10px 18px;background:rgba(232,113,10,0.12);border:1.5px solid rgba(232,113,10,0.4);border-radius:30px;display:inline-block;';
    eyebrow.textContent = '📰 ' + (opts.eyebrow || 'Press Release');
    top.appendChild(eyebrow);

    card.appendChild(top);

    // Middle: headline
    var middle = document.createElement('div');
    middle.style.cssText = 'position:relative;z-index:2;flex:1;display:flex;align-items:center;';

    var headline = document.createElement('div');
    var headlineText = opts.headline || 'PULSE RevOps Press Release';
    // Auto-size based on length
    var fontSize = headlineText.length > 120 ? '46px' : (headlineText.length > 80 ? '54px' : '64px');
    headline.style.cssText = 'font-size:' + fontSize + ';font-weight:900;line-height:1.15;color:#EDE5D8;letter-spacing:-0.5px;';
    headline.textContent = headlineText;
    middle.appendChild(headline);

    card.appendChild(middle);

    // Bottom: author + URL
    var bottom = document.createElement('div');
    bottom.style.cssText = 'position:relative;z-index:2;border-top:2px solid rgba(232,113,10,0.3);padding-top:32px;';

    var attribution = document.createElement('div');
    attribution.style.cssText = 'display:flex;align-items:center;justify-content:space-between;';
    attribution.innerHTML =
      '<div>' +
        '<div style="font-size:32px;font-weight:900;color:#EDE5D8;line-height:1.2;">Kory White</div>' +
        '<div style="font-size:18px;font-weight:600;color:rgba(237,229,216,0.65);margin-top:4px;">Chief Revenue Officer</div>' +
      '</div>' +
      '<div style="text-align:right;">' +
        '<div style="font-size:14px;font-weight:800;letter-spacing:2px;color:rgba(237,229,216,0.5);text-transform:uppercase;">Read full release at</div>' +
        '<div style="font-size:24px;font-weight:900;color:#FF8C1A;margin-top:4px;">pulserevops.com/press</div>' +
      '</div>';
    bottom.appendChild(attribution);

    if (opts.publisher) {
      var pub = document.createElement('div');
      pub.style.cssText = 'margin-top:24px;font-size:14px;font-weight:700;letter-spacing:2.5px;color:rgba(255,140,26,0.7);text-transform:uppercase;text-align:center;';
      pub.textContent = '· ' + opts.publisher + ' ·';
      bottom.appendChild(pub);
    }

    card.appendChild(bottom);
    document.body.appendChild(card);
    return card;
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
      var card = buildCard(opts);
      // Give the browser a tick to layout
      setTimeout(function() {
        window.html2canvas(card, {
          width: 1080,
          height: 1080,
          scale: 1,
          backgroundColor: null,
          logging: false
        }).then(function(canvas) {
          downloadCanvas(canvas, 'pulse-' + (opts.slug || 'press') + '-instagram.png');
          card.remove();
          if (btn) {
            btn.innerHTML = '✓ Downloaded!';
            setTimeout(function() { btn.innerHTML = origBtnText; btn.disabled = false; }, 2400);
          }
        }).catch(function(err) {
          card.remove();
          alert('Could not generate image: ' + err.message);
          if (btn) { btn.innerHTML = origBtnText; btn.disabled = false; }
        });
      }, 50);
    });
  };
})();
