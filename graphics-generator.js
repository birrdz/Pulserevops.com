/* Browser-side graphic/wallpaper generator for the /graphics "make your own"
   panel. Composes three independent axes over a themeable, un-branded SVG:
     - background theme  (plain / city / grid / dots / arrows / waves / circuit /
       topo / rays / graph / mesh / hexagons / pulse / confetti)
     - text layout       (left / centered / quote / accent-bar)
     - palette + base bg  (CSS vars, shared with graphics-palettes.js)
   Also exposes parse() for natural-language prompts ("pink line with a city
   background"). window.GG. Client-side only — no AI/API. */
(function (root) {
  var FONT = "'Inter','Segoe UI',system-ui,Arial,sans-serif";
  var FORMATS = {
    banner:    { w: 1584, h: 396,  label: 'LinkedIn banner (1584×396)' },
    wallpaper: { w: 1920, h: 1080, label: 'Wallpaper / slide (1920×1080)' },
    square:    { w: 1080, h: 1080, label: 'Square post (1080×1080)' },
    portrait:  { w: 1080, h: 1350, label: 'Portrait (1080×1350)' },
  };
  var LAYOUTS = [
    { id: 'spotlight', label: 'Left' },
    { id: 'centered',  label: 'Centered' },
    { id: 'quote',     label: 'Quote' },
    { id: 'bar',       label: 'Accent bar' },
  ];
  var THEMES = [
    { id: 'none',     label: 'Plain' },
    { id: 'city',     label: 'City skyline' },
    { id: 'grid',     label: 'Grid' },
    { id: 'dots',     label: 'Dot matrix' },
    { id: 'arrows',   label: 'Arrows' },
    { id: 'waves',    label: 'Waves' },
    { id: 'circuit',  label: 'Circuit' },
    { id: 'topo',     label: 'Topographic' },
    { id: 'rays',     label: 'Rays' },
    { id: 'graph',    label: 'Graph' },
    { id: 'mesh',     label: 'Gradient mesh' },
    { id: 'hex',      label: 'Hexagons' },
    { id: 'pulse',    label: 'Pulse lines' },
    { id: 'confetti', label: 'Confetti' },
  ];

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function fit(text, maxW, maxSize, factor) { factor = factor || 0.58; var len = String(text).length || 1; return Math.max(10, Math.min(maxSize, Math.floor(maxW / (len * factor)))); }
  function wrap(text, maxChars) {
    var words = String(text || '').trim().split(/\s+/), lines = [], cur = '';
    for (var i = 0; i < words.length; i++) { var t = cur ? cur + ' ' + words[i] : words[i]; if (t.length > maxChars && cur) { lines.push(cur); cur = words[i]; } else cur = t; }
    if (cur) lines.push(cur); return lines.length ? lines : [''];
  }
  function ekg(x0, x1, y, amp) {
    var w = x1 - x0, pts = [[0, 0], [0.28, 0], [0.32, -0.35], [0.385, 1], [0.45, -0.7], [0.5, 0], [0.64, 0], [0.68, -0.35], [0.745, 1], [0.81, -0.7], [0.86, 0], [1, 0]];
    return pts.map(function (p) { return Math.round(x0 + p[0] * w) + ',' + Math.round(y - p[1] * amp); }).join(' ');
  }
  function wavePath(W, H, yMid, amp, waves, phase, close) {
    var d = 'M0,' + yMid.toFixed(1), steps = 48;
    for (var i = 1; i <= steps; i++) { var x = W * i / steps, y = yMid + amp * Math.sin(phase + (i / steps) * waves * 2 * Math.PI); d += ' L' + x.toFixed(1) + ',' + y.toFixed(1); }
    if (close) d += ' L' + W + ',' + H + ' L0,' + H + ' Z'; return d;
  }
  function txt(x, y, anchor, size, weight, fill, ls, s, shadow) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + anchor + '" font-family="' + FONT + '" font-size="' + size + '" font-weight="' + weight + '"' + (ls ? ' letter-spacing="' + ls + '"' : '') + (shadow ? ' filter="url(#tsh)"' : '') + ' fill="' + fill + '">' + esc(s) + '</text>';
  }

  // ── background themes ──────────────────────────────────────────────────────
  var SEED_A = [0.4, 0.7, 0.5, 0.85, 0.55, 0.75, 0.45, 0.9, 0.6, 0.7, 0.5, 0.8, 0.45, 0.65, 0.88, 0.5, 0.72, 0.52, 0.66, 0.8];
  var SEED_B = [0.6, 0.45, 0.8, 0.5, 0.7, 0.55, 0.9, 0.5, 0.72, 0.6, 0.78, 0.48, 0.64, 0.55, 0.7, 0.5, 0.82, 0.46, 0.6, 0.74];
  var SEED_C = [0.55, 0.85, 0.5, 0.7, 0.95, 0.6, 0.78, 0.5, 0.88, 0.62, 0.74, 0.5, 0.8, 0.58, 0.7, 0.92, 0.54, 0.68, 0.6, 0.86];
  function cityLayer(W, baseY, maxH, fill, seed, win, op) {
    var s = '', x = -12, i = 0, opAttr = (op && op < 1) ? ' opacity="' + op + '"' : '';
    while (x < W) {
      var bw = (0.5 + seed[i % seed.length] * 1.0) * (W * 0.05);
      var h = (0.32 + seed[(i * 5 + 3) % seed.length] * 0.68) * maxH;
      var y = baseY - h;
      s += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (bw + 1).toFixed(1) + '" height="' + (h + 4).toFixed(1) + '" fill="' + fill + '"' + opAttr + '/>';
      if (win) {
        s += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (bw + 1).toFixed(1) + '" height="' + h.toFixed(1) + '" fill="url(#win)"/>';
        s += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (bw + 1).toFixed(1) + '" height="3" style="fill:var(--c3,#FFD740)" opacity="0.65"/>';
      }
      x += bw + 3; i++;
    }
    return s;
  }
  function themeDefs(t) {
    if (t === 'dots') return '<pattern id="P_dots" width="34" height="34" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="3" style="fill:var(--c1,#FF8C1A)" fill-opacity="0.18"/></pattern>';
    if (t === 'grid') return '<pattern id="P_grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" fill="none" style="stroke:var(--c4,#22d3ee)" stroke-opacity="0.2" stroke-width="1.2"/></pattern>';
    if (t === 'arrows') return '<pattern id="P_arr" width="46" height="40" patternUnits="userSpaceOnUse"><path d="M6 28 L23 12 L40 28" fill="none" style="stroke:var(--c1,#FF8C1A)" stroke-opacity="0.18" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></pattern>';
    if (t === 'hex') return '<pattern id="P_hex" width="56" height="48" patternUnits="userSpaceOnUse"><path d="M14 0 L42 0 L56 24 L42 48 L14 48 L0 24 Z" fill="none" style="stroke:var(--c4,#22d3ee)" stroke-opacity="0.16" stroke-width="1.4"/></pattern>';
    if (t === 'mesh') return '<radialGradient id="b1" cx="0.2" cy="0.3" r="0.5"><stop offset="0" style="stop-color:var(--c1,#FF8C1A)" stop-opacity="0.3"/><stop offset="1" style="stop-color:var(--c1,#FF8C1A)" stop-opacity="0"/></radialGradient><radialGradient id="b2" cx="0.85" cy="0.7" r="0.5"><stop offset="0" style="stop-color:var(--c4,#22d3ee)" stop-opacity="0.24"/><stop offset="1" style="stop-color:var(--c4,#22d3ee)" stop-opacity="0"/></radialGradient><radialGradient id="b3" cx="0.6" cy="0.15" r="0.4"><stop offset="0" style="stop-color:var(--c3,#FFD740)" stop-opacity="0.22"/><stop offset="1" style="stop-color:var(--c3,#FFD740)" stop-opacity="0"/></radialGradient>';
    if (t === 'city') return ''
      + '<linearGradient id="bldgF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--c1,#FF8C1A)" stop-opacity="0.95"/><stop offset="1" style="stop-color:var(--c2,#E8710A)" stop-opacity="0.45"/></linearGradient>'
      + '<linearGradient id="bldgM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--c2,#E8710A)" stop-opacity="0.6"/><stop offset="1" style="stop-color:var(--c2,#E8710A)" stop-opacity="0.18"/></linearGradient>'
      + '<linearGradient id="horizon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--c1,#FF8C1A)" stop-opacity="0"/><stop offset="1" style="stop-color:var(--c1,#FF8C1A)" stop-opacity="0.30"/></linearGradient>'
      + '<radialGradient id="cityGlow" cx="0.5" cy="1" r="0.7"><stop offset="0" style="stop-color:var(--c3,#FFD740)" stop-opacity="0.28"/><stop offset="1" style="stop-color:var(--c3,#FFD740)" stop-opacity="0"/></radialGradient>'
      + '<pattern id="win" width="15" height="20" patternUnits="userSpaceOnUse"><rect x="3" y="4" width="6" height="9" style="fill:var(--c3,#FFD740)" opacity="0.55"/></pattern>';
    return '';
  }
  function themeBody(t, W, H) {
    var s = '', i, j, x, y, h, a;
    if (t === 'dots') return '<rect width="' + W + '" height="' + H + '" fill="url(#P_dots)"/>';
    if (t === 'grid') return '<rect width="' + W + '" height="' + H + '" fill="url(#P_grid)"/>';
    if (t === 'arrows') return '<rect width="' + W + '" height="' + H + '" fill="url(#P_arr)"/>';
    if (t === 'hex') return '<rect width="' + W + '" height="' + H + '" fill="url(#P_hex)"/>';
    if (t === 'mesh') return '<rect width="' + W + '" height="' + H + '" fill="url(#b1)"/><rect width="' + W + '" height="' + H + '" fill="url(#b2)"/><rect width="' + W + '" height="' + H + '" fill="url(#b3)"/>';
    if (t === 'waves') return '<path d="' + wavePath(W, H, H * 0.62, H * 0.12, 2.2, 0, true) + '" fill="url(#accent)" opacity="0.14"/><path d="' + wavePath(W, H, H * 0.72, H * 0.13, 1.8, 1.6, true) + '" fill="url(#accent2)" opacity="0.1"/><path d="' + wavePath(W, H, H * 0.5, H * 0.1, 2.6, 3, false) + '" fill="none" stroke="url(#accent)" stroke-width="' + Math.max(3, H * 0.005) + '" opacity="0.7"/>';
    if (t === 'pulse') { for (i = 0; i < 6; i++) s += '<polyline points="' + ekg(0, W, H * (0.12 + i * 0.15), H * 0.06) + '" stroke="url(#accent2)" fill="none" stroke-width="2" opacity="0.1"/>'; s += '<polyline points="' + ekg(0, W, H * 0.5, H * 0.16) + '" stroke="url(#accent)" fill="none" stroke-width="' + Math.max(4, H * 0.012) + '" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>'; return s; }
    if (t === 'city') {
      s += '<rect x="0" y="' + (H * 0.38).toFixed(0) + '" width="' + W + '" height="' + (H * 0.62).toFixed(0) + '" fill="url(#horizon)"/>';
      s += '<rect x="0" y="' + (H * 0.5).toFixed(0) + '" width="' + W + '" height="' + (H * 0.5).toFixed(0) + '" fill="url(#cityGlow)"/>';
      s += cityLayer(W, H * 0.96, H * 0.34, 'var(--c2,#E8710A)', SEED_A, false, 0.18);
      s += cityLayer(W, H * 0.99, H * 0.52, 'url(#bldgM)', SEED_B, false, 1);
      s += cityLayer(W, H * 1.02, H * 0.7, 'url(#bldgF)', SEED_C, true, 1);
      return s;
    }
    if (t === 'rays') { var cx = W * 0.85, cy = H * 0.18, N = 18; for (i = 0; i < N; i++) { a = (i / N) * Math.PI * 2; s += '<line x1="' + cx.toFixed(0) + '" y1="' + cy.toFixed(0) + '" x2="' + (cx + Math.cos(a) * W * 1.3).toFixed(0) + '" y2="' + (cy + Math.sin(a) * W * 1.3).toFixed(0) + '" stroke="url(#accent)" stroke-width="' + (i % 2 ? 2 : 8) + '" opacity="0.1"/>'; } return s + '<circle cx="' + cx.toFixed(0) + '" cy="' + cy.toFixed(0) + '" r="' + (H * 0.14).toFixed(0) + '" fill="url(#glow)"/>'; }
    if (t === 'topo') { var tx = W * 0.32, ty = H * 0.58; for (var r = 30; r < W; r += Math.max(40, W * 0.03)) s += '<ellipse cx="' + tx.toFixed(0) + '" cy="' + ty.toFixed(0) + '" rx="' + r + '" ry="' + (r * 0.7).toFixed(0) + '" fill="none" stroke="url(#accent2)" stroke-width="1.5" opacity="0.14"/>'; return s; }
    if (t === 'graph') { var n = 8, pts = []; for (i = 0; i <= n; i++) { pts.push((W * i / n).toFixed(0) + ',' + (H * 0.82 - (i / n) * H * 0.55 - (i % 2 ? H * 0.05 : 0)).toFixed(0)); } for (i = 0; i < n; i++) { h = (0.18 + (i / n) * 0.5) * H; s += '<rect x="' + (W * i / n + 6).toFixed(0) + '" y="' + (H - h).toFixed(0) + '" width="' + (W / n - 12).toFixed(0) + '" height="' + h.toFixed(0) + '" style="fill:var(--c1,#FF8C1A)" opacity="0.1"/>'; } return s + '<polyline points="' + pts.join(' ') + '" fill="none" stroke="url(#accent)" stroke-width="5" opacity="0.6" stroke-linecap="round" stroke-linejoin="round"/>'; }
    if (t === 'circuit') { var nodes = [[0.1, 0.3], [0.25, 0.62], [0.4, 0.2], [0.55, 0.72], [0.7, 0.35], [0.82, 0.66], [0.92, 0.25], [0.5, 0.45], [0.3, 0.85], [0.66, 0.14]], edges = [[0, 1], [1, 7], [7, 4], [2, 7], [3, 7], [4, 5], [5, 6], [2, 9], [1, 8], [3, 5], [4, 6]]; edges.forEach(function (e) { var p = nodes[e[0]], q = nodes[e[1]]; s += '<line x1="' + (p[0] * W).toFixed(0) + '" y1="' + (p[1] * H).toFixed(0) + '" x2="' + (q[0] * W).toFixed(0) + '" y2="' + (q[1] * H).toFixed(0) + '" stroke="url(#accent2)" stroke-width="1.5" opacity="0.25"/>'; }); nodes.forEach(function (p, k) { s += '<circle cx="' + (p[0] * W).toFixed(0) + '" cy="' + (p[1] * H).toFixed(0) + '" r="' + (k % 3 ? 5 : 9) + '" style="fill:var(--c1,#FF8C1A)" opacity="0.7"/>'; }); return s; }
    if (t === 'confetti') { var seq = [0.08, 0.8, 0.3, 0.52, 0.9, 0.2, 0.62, 0.4, 0.75, 0.14, 0.55, 0.34, 0.86, 0.25, 0.66, 0.46, 0.05, 0.7, 0.5, 0.95, 0.18, 0.62, 0.38, 0.88]; for (i = 0; i < seq.length; i++) { x = seq[i] * W; y = seq[(i * 7) % seq.length] * H; if (i % 3 === 0) s += '<rect x="' + x.toFixed(0) + '" y="' + y.toFixed(0) + '" width="14" height="14" style="fill:var(--c1,#FF8C1A)" opacity="0.5" transform="rotate(20 ' + x.toFixed(0) + ' ' + y.toFixed(0) + ')"/>'; else if (i % 3 === 1) s += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="7" style="fill:var(--c4,#22d3ee)" opacity="0.5"/>'; else s += '<path d="M' + x.toFixed(0) + ' ' + (y - 8).toFixed(0) + ' l8 14 l-16 0 z" style="fill:var(--c3,#FFD740)" opacity="0.5"/>'; } return s; }
    return '';
  }

  // ── text layouts ───────────────────────────────────────────────────────────
  function layoutBody(layout, W, H, head, sub, eyebrow, busy) {
    var s = '', i, CX = W / 2, fs, lines;
    if (layout === 'centered' || layout === 'quote') {
      if (busy) s += '<rect width="' + W + '" height="' + H + '" fill="#0b0f17" opacity="0.3"/>';
      if (layout === 'quote') s += '<text x="' + CX + '" y="' + Math.round(H * 0.3) + '" text-anchor="middle" font-family="' + FONT + '" font-size="' + Math.round(H * 0.24) + '" font-weight="900" fill="url(#accent)" opacity="0.85">&#8220;</text>';
      fs = fit(head, W * 0.86, H * 0.2, 0.56); lines = wrap(head, Math.floor(W * 0.82 / (fs * 0.56)));
      var bh = lines.length * fs * 1.08, y = H / 2 - bh / 2 + fs * 0.8;
      if (eyebrow) s += txt(CX, Math.round(y - fs - H * 0.03), 'middle', Math.round(H * 0.05), 800, 'url(#accent)', 8, eyebrow.toUpperCase(), true);
      for (i = 0; i < lines.length; i++) s += txt(CX, Math.round(y + i * fs * 1.08), 'middle', fs, 900, (layout === 'quote' && i === lines.length - 1 ? 'url(#accent)' : '#FFFFFF'), 0, lines[i], true);
      if (sub) s += txt(CX, Math.round(y + bh + H * 0.06), 'middle', Math.round(H * 0.055), 700, '#EDE5D8', (layout === 'quote' ? 6 : 0), (layout === 'quote' ? sub.toUpperCase() : sub), true);
      return s;
    }
    // spotlight / bar — left aligned
    var lx = layout === 'bar' ? W * 0.085 : W * 0.055;
    if (busy) s += '<rect width="' + (W * 0.66).toFixed(0) + '" height="' + H + '" fill="url(#scrimL)"/>';
    if (layout === 'bar') s += '<rect x="0" y="0" width="' + Math.max(14, W * 0.016).toFixed(0) + '" height="' + H + '" fill="url(#accent)"/>';
    fs = fit(head, W * 0.86, H * 0.22, 0.56); lines = wrap(head, Math.floor(W * 0.82 / (fs * 0.56)));
    if (eyebrow) s += txt(lx, H * 0.32, 'start', Math.round(H * 0.055), 700, '#94a3b8', 6, eyebrow.toUpperCase(), true);
    var y2 = eyebrow ? H * 0.32 + fs : H * 0.4;
    for (i = 0; i < lines.length; i++) s += txt(lx, Math.round(y2 + i * fs * 1.04), 'start', fs, 900, '#FFFFFF', 0, lines[i], true);
    if (sub) s += txt(lx, Math.round(y2 + lines.length * fs * 1.04 + H * 0.05), 'start', Math.round(H * 0.06), 700, '#EDE5D8', 0, sub, true);
    return s;
  }

  function render(o) {
    var fmt = FORMATS[o.fmt] || FORMATS.banner, W = fmt.w, H = fmt.h;
    var head = (o.text != null && String(o.text).trim()) ? String(o.text).trim() : 'Your headline here';
    var sub = (o.sub || '').trim(), eyebrow = (o.eyebrow || '').trim();
    var layout = o.layout || 'spotlight', theme = o.theme || 'none';
    var busy = theme !== 'none';
    var defs = '<defs>'
      + '<linearGradient id="bg" x1="0" y1="0" x2="' + W + '" y2="' + H + '" gradientUnits="userSpaceOnUse"><stop offset="0" style="stop-color:var(--bg1,#0b0f17)"/><stop offset="1" style="stop-color:var(--bg2,#0f172a)"/></linearGradient>'
      + '<linearGradient id="accent" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--c1,#FF8C1A)"/><stop offset="0.55" style="stop-color:var(--c2,#E8710A)"/><stop offset="1" style="stop-color:var(--c3,#FFD740)"/></linearGradient>'
      + '<linearGradient id="accent2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--c4,#22d3ee)"/><stop offset="1" style="stop-color:var(--c4b,#67e8f9)"/></linearGradient>'
      + '<radialGradient id="glow" cx="0.5" cy="0.3" r="0.6"><stop offset="0" style="stop-color:var(--c1,#FF8C1A)" stop-opacity="0.16"/><stop offset="1" style="stop-color:var(--c1,#FF8C1A)" stop-opacity="0"/></radialGradient>'
      + '<linearGradient id="scrimL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--bg1,#0b0f17)" stop-opacity="0.85"/><stop offset="1" style="stop-color:var(--bg1,#0b0f17)" stop-opacity="0"/></linearGradient>'
      + '<filter id="tsh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#000000" flood-opacity="0.55"/></filter>'
      + '<radialGradient id="vig" cx="0.5" cy="0.42" r="0.78"><stop offset="0.55" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.34"/></radialGradient>'
      + '<linearGradient id="toplight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.05"/><stop offset="0.3" stop-color="#ffffff" stop-opacity="0"/></linearGradient>'
      + themeDefs(theme) + '</defs>';
    var styleVars = '';
    if (o.palette) styleVars += '--c1:' + o.palette.c1 + ';--c2:' + o.palette.c2 + ';--c3:' + o.palette.c3 + ';--c4:' + o.palette.c4 + ';--c4b:' + o.palette.c4b + ';--ink:' + o.palette.ink + ';';
    if (o.bg) styleVars += '--bg1:' + o.bg[0] + ';--bg2:' + o.bg[1] + ';';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">'
      + (styleVars ? '<style>svg{' + styleVars + '}</style>' : '')
      + defs
      + '<rect width="' + W + '" height="' + H + '" fill="url(#bg)"/><rect width="' + W + '" height="' + H + '" fill="url(#glow)"/>'
      + themeBody(theme, W, H)
      + '<rect width="' + W + '" height="' + H + '" fill="url(#vig)"/><rect width="' + W + '" height="' + H + '" fill="url(#toplight)"/>'
      + layoutBody(layout, W, H, head, sub, eyebrow, busy)
      + '</svg>';
  }

  // ── natural-language prompt parsing ─────────────────────────────────────────
  var COLOR_WORDS = {
    pink: 'rose', rose: 'rose', salmon: 'rose', blush: 'rose',
    blue: 'ocean', navy: 'indigo', cobalt: 'ocean', sky: 'sky', azure: 'sky',
    green: 'emerald', emerald: 'emerald', mint: 'mint', forest: 'emerald',
    teal: 'teal', cyan: 'aqua', aqua: 'aqua', turquoise: 'aqua',
    purple: 'violet', violet: 'violet', lavender: 'violet', indigo: 'indigo',
    magenta: 'fuchsia', fuchsia: 'fuchsia', berry: 'berry',
    red: 'crimson', crimson: 'crimson', ruby: 'crimson', scarlet: 'crimson',
    orange: 'coral', coral: 'coral', amber: 'amber', tangerine: 'coral',
    gold: 'gold', golden: 'gold', yellow: 'gold', lime: 'lime',
    gray: 'steel', grey: 'steel', silver: 'steel', steel: 'steel',
    white: 'graphite', mono: 'graphite', monochrome: 'graphite', lava: 'magma', magma: 'magma', sunset: 'sunset',
  };
  var THEME_WORDS = {
    city: 'city', skyline: 'city', building: 'city', buildings: 'city', urban: 'city', downtown: 'city',
    grid: 'grid', graph: 'graph', chart: 'graph', stonks: 'graph',
    dot: 'dots', dots: 'dots', matrix: 'dots', polka: 'dots',
    arrow: 'arrows', arrows: 'arrows', chevron: 'arrows',
    wave: 'waves', waves: 'waves', water: 'waves', ocean: 'waves',
    circuit: 'circuit', network: 'circuit', tech: 'circuit', node: 'circuit', nodes: 'circuit',
    topo: 'topo', topographic: 'topo', contour: 'topo', terrain: 'topo',
    ray: 'rays', rays: 'rays', burst: 'rays', sun: 'rays', sunburst: 'rays',
    mesh: 'mesh', gradient: 'mesh', blob: 'mesh', blobs: 'mesh',
    hex: 'hex', hexagon: 'hex', honeycomb: 'hex',
    line: 'pulse', lines: 'pulse', pulse: 'pulse', heartbeat: 'pulse', ekg: 'pulse',
    confetti: 'confetti', party: 'confetti', celebrate: 'confetti', sprinkle: 'confetti',
  };
  function parse(prompt) {
    var lc = String(prompt || '').toLowerCase(), out = {}, k;
    var PAL = (root.GP && root.GP.PALETTES) || [];
    var has = function (w) { return new RegExp('\\b' + w + '\\b').test(lc); };
    for (k in COLOR_WORDS) if (COLOR_WORDS.hasOwnProperty(k) && has(k)) { for (var i = 0; i < PAL.length; i++) if (PAL[i].id === COLOR_WORDS[k]) { out.palette = PAL[i]; break; } if (out.palette) break; }
    for (k in THEME_WORDS) if (THEME_WORDS.hasOwnProperty(k) && has(k)) { out.theme = THEME_WORDS[k]; break; }
    if (/\bquote\b/.test(lc)) out.layout = 'quote'; else if (/\b(center|centered|middle)\b/.test(lc)) out.layout = 'centered'; else if (/\bleft\b/.test(lc)) out.layout = 'spotlight';
    var q = String(prompt || '').match(/[“"']([^“”"']{2,80})[”"']/);
    if (q) out.text = q[1];
    return out;
  }

  root.GG = { render: render, parse: parse, FORMATS: FORMATS, LAYOUTS: LAYOUTS, THEMES: THEMES };
})(typeof window !== 'undefined' ? window : this);
