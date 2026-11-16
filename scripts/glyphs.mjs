// Hand-drawn 24x24 line glyphs, used where a brand has no Simple Icons entry
// and for the non-brand illustrations on the focus cards.
// `fill: true` glyphs are solid shapes, the rest are stroked.

export const GLYPHS = {
  spark: { fill: true, d: 'M12 1.5l2.2 7.3a2 2 0 0 0 1.3 1.3L22.5 12l-7 1.9a2 2 0 0 0-1.3 1.3L12 22.5l-2.2-7.3a2 2 0 0 0-1.3-1.3L1.5 12l7-1.9a2 2 0 0 0 1.3-1.3z' },
  bolt: { fill: true, d: 'M13.6 1.5 4 13.4h6.3L9 22.5l10-12.4h-6.4z' },
  chip: { d: 'M7 7h10v10H7zM10 10h4v4h-4zM9.5 3v4M14.5 3v4M9.5 17v4M14.5 17v4M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4' },
  wave: { d: 'M3 10.5v3M7 7v10M11 3.5v17M15 8v8M19 5.5v13M22 11v2' },
  scan: { d: 'M3.5 8V5.5a2 2 0 0 1 2-2H8M16 3.5h2.5a2 2 0 0 1 2 2V8M20.5 16v2.5a2 2 0 0 1-2 2H16M8 20.5H5.5a2 2 0 0 1-2-2V16M7 9.5h10M7 12.5h10M7 15.5h6' },
  trace: { d: 'M3 5.5h9M7 10h11M10 14.5h6M13 19h8' },
  terminal: { d: 'M4.5 4h15a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5v-13A1.5 1.5 0 0 1 4.5 4zM7 9.5l3.5 2.7L7 15M12.5 15.5H17' },
  window: { d: 'M4.5 4h15a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5v-13A1.5 1.5 0 0 1 4.5 4zM3 9h18M6.2 6.6h.1M9 6.6h.1M11.8 6.6h.1' },
  cloud: { d: 'M7.2 19a4.7 4.7 0 0 1-.7-9.35A6.3 6.3 0 0 1 18.6 10.6 4.25 4.25 0 0 1 17.8 19z' },
  globe: { d: 'M12 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4zM2.8 12h18.4M12 2.8c2.6 2.5 3.9 5.6 3.9 9.2s-1.3 6.7-3.9 9.2c-2.6-2.5-3.9-5.6-3.9-9.2S9.4 5.3 12 2.8z' },
  in: { fill: true, d: 'M4.2 8.6h3.3V20H4.2zM5.85 3.2a1.95 1.95 0 1 1 0 3.9 1.95 1.95 0 0 1 0-3.9zM9.7 8.6h3.15v1.56h.05c.44-.83 1.5-1.7 3.1-1.7 3.32 0 3.93 2.18 3.93 5.02V20h-3.28v-5.78c0-1.38-.03-3.15-1.92-3.15-1.92 0-2.22 1.5-2.22 3.05V20H9.7z' },
  star: { fill: true, d: 'M12 2.6l2.75 5.9 6.45.8-4.75 4.45 1.25 6.4L12 17l-5.7 3.15 1.25-6.4L2.8 9.3l6.45-.8z' },
};

export function glyph(name, { x, y, size = 24, color }) {
  const g = GLYPHS[name];
  if (!g) throw new Error(`Unknown glyph "${name}"`);
  const s = +(size / 24).toFixed(4);
  const paint = g.fill
    ? `fill="${color}"`
    : `fill="none" stroke="${color}" stroke-width="${+(1.7 / Math.max(s, 0.75)).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"`;
  return `<path transform="translate(${x} ${y}) scale(${s})" d="${g.d}" ${paint}/>`;
}
