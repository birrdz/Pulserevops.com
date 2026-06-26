/* Shared color palettes for the Graphics pillar — one source of truth used by
   the Node generators, the entry-page customizer, and the live generator.
   UMD: works via require() in Node and as a <script> in the browser (window.GP).
   Each palette themes the CSS vars baked into every graphic SVG:
     --c1/--c2/--c3  primary accent gradient (light -> deep -> light)
     --c4/--c4b      secondary accent pair
     --ink           text colour used on top of accent fills
   Backgrounds (--bg1/--bg2) are controlled separately (dark / transparent). */
(function (root) {
  var PALETTES = [
    { id: 'sunset',   name: 'Sunset',     c1: '#FF8C1A', c2: '#E8710A', c3: '#FFD740', c4: '#22d3ee', c4b: '#67e8f9', ink: '#0b0f17' },
    { id: 'ocean',    name: 'Ocean',      c1: '#38bdf8', c2: '#2563eb', c3: '#7dd3fc', c4: '#818cf8', c4b: '#c7d2fe', ink: '#06121f' },
    { id: 'emerald',  name: 'Emerald',    c1: '#34d399', c2: '#059669', c3: '#a7f3d0', c4: '#fbbf24', c4b: '#fde68a', ink: '#03130d' },
    { id: 'violet',   name: 'Violet',     c1: '#a78bfa', c2: '#7c3aed', c3: '#d8b4fe', c4: '#f472b6', c4b: '#fbcfe8', ink: '#120726' },
    { id: 'rose',     name: 'Rose',       c1: '#fb7185', c2: '#e11d48', c3: '#fda4af', c4: '#fbbf24', c4b: '#fde68a', ink: '#1f0510' },
    { id: 'teal',     name: 'Teal',       c1: '#2dd4bf', c2: '#0f766e', c3: '#99f6e4', c4: '#fbbf24', c4b: '#fde68a', ink: '#03130f' },
    { id: 'crimson',  name: 'Crimson',    c1: '#f87171', c2: '#dc2626', c3: '#fca5a5', c4: '#fbbf24', c4b: '#fde68a', ink: '#1a0606' },
    { id: 'indigo',   name: 'Indigo',     c1: '#818cf8', c2: '#4f46e5', c3: '#c7d2fe', c4: '#22d3ee', c4b: '#a5f3fc', ink: '#0a0a23' },
    { id: 'lime',     name: 'Lime',       c1: '#a3e635', c2: '#65a30d', c3: '#d9f99d', c4: '#22d3ee', c4b: '#a5f3fc', ink: '#0d1403' },
    { id: 'amber',    name: 'Amber',      c1: '#fbbf24', c2: '#d97706', c3: '#fde68a', c4: '#fb7185', c4b: '#fecdd3', ink: '#1a1203' },
    { id: 'sky',      name: 'Sky',        c1: '#7dd3fc', c2: '#0284c7', c3: '#bae6fd', c4: '#a78bfa', c4b: '#ddd6fe', ink: '#04121d' },
    { id: 'fuchsia',  name: 'Fuchsia',    c1: '#e879f9', c2: '#c026d3', c3: '#f5d0fe', c4: '#22d3ee', c4b: '#a5f3fc', ink: '#1a0420' },
    { id: 'steel',    name: 'Steel',      c1: '#94a3b8', c2: '#475569', c3: '#cbd5e1', c4: '#38bdf8', c4b: '#bae6fd', ink: '#0b1220' },
    { id: 'gold',     name: 'Gold',       c1: '#FFD740', c2: '#b8860b', c3: '#fff3c4', c4: '#e8710a', c4b: '#ffb066', ink: '#1a1403' },
    { id: 'mint',     name: 'Mint',       c1: '#6ee7b7', c2: '#10b981', c3: '#d1fae5', c4: '#60a5fa', c4b: '#bfdbfe', ink: '#03130d' },
    { id: 'coral',    name: 'Coral',      c1: '#fb923c', c2: '#ea580c', c3: '#fed7aa', c4: '#22d3ee', c4b: '#a5f3fc', ink: '#1a0a03' },
    { id: 'berry',    name: 'Berry',      c1: '#c084fc', c2: '#db2777', c3: '#f0abfc', c4: '#38bdf8', c4b: '#bae6fd', ink: '#1a0620' },
    { id: 'aqua',     name: 'Aqua',       c1: '#22d3ee', c2: '#0e7490', c3: '#a5f3fc', c4: '#34d399', c4b: '#a7f3d0', ink: '#04141a' },
    { id: 'slatepro', name: 'Graphite',   c1: '#e2e8f0', c2: '#64748b', c3: '#f8fafc', c4: '#fbbf24', c4b: '#fde68a', ink: '#0b1220' },
    { id: 'magma',    name: 'Magma',      c1: '#f97316', c2: '#b91c1c', c3: '#fdba74', c4: '#fbbf24', c4b: '#fde68a', ink: '#1a0603' },
  ];

  // CSS var declarations string for a palette (for the SVG's internal <style>).
  function paletteVars(p) {
    return '--c1:' + p.c1 + ';--c2:' + p.c2 + ';--c3:' + p.c3 + ';--c4:' + p.c4 + ';--c4b:' + p.c4b + ';--ink:' + p.ink + ';';
  }
  function byId(id) { for (var i = 0; i < PALETTES.length; i++) if (PALETTES[i].id === id) return PALETTES[i]; return PALETTES[0]; }

  var API = { PALETTES: PALETTES, paletteVars: paletteVars, byId: byId };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else { root.GP = API; }
})(typeof window !== 'undefined' ? window : this);
