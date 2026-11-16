// Shared look and helpers for every panel. Change a colour here and all panels follow.

export const W = 840;

export const C = {
  bg0: '#060817',
  bg1: '#0b0e25',
  card: '#0e1230',
  cardEdge: '#232b5c',
  text: '#eceeff',
  mute: '#9aa3cc',
  dim: '#5d668f',
  cyan: '#22d3ee',
  violet: '#a78bfa',
  pink: '#f472b6',
  amber: '#fbbf24',
  green: '#34d399',
};

export const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif`;
export const MONO = `ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace`;

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const n = (v) => +(+v).toFixed(2);

// Brand and language colours are often near-black; lift those so they read on the dark panels.
export function visible(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  if (lum >= 0.25) return `#${h}`;
  if (lum < 0.03) return '#e8ebff';
  const t = lum < 0.1 ? 0.55 : 0.32;
  const mix = (c) => Math.round(c + (255 - c) * t).toString(16).padStart(2, '0');
  return `#${mix(r)}${mix(g)}${mix(b)}`;
}

// Small seeded PRNG so the starfields are identical on every build (no noisy diffs).
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function starfield({ w, h, count, seed }) {
  const r = rng(seed);
  const tints = ['#dbe4ff', '#dbe4ff', '#dbe4ff', '#ffffff', '#a5f3fc', '#fde68a', '#ddd6fe'];
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = n(r() * w);
    const y = n(r() * h);
    const size = n(0.35 + Math.pow(r(), 2.4) * 1.25);
    const tint = tints[Math.floor(r() * tints.length)];
    const k = Math.floor(r() * 5); // 0-1 static, 2-4 twinkle
    const cls = k >= 2 ? ` class="s${k - 1}"` : '';
    const op = k >= 2 ? '' : ` opacity="${n(0.25 + r() * 0.45)}"`;
    out += `<circle${cls} cx="${x}" cy="${y}" r="${size}" fill="${tint}"${op}/>`;
  }
  return out;
}

// Greedy word wrap by approximate glyph width (system fonts differ, so this is conservative).
export function wrap(text, maxChars) {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && (line + ' ' + word).length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? line + ' ' + word : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function header({ index, title, sub = '', w = W, y = 48 }) {
  return `
  <text x="32" y="${y}" font-family="${MONO}" font-size="12" fill="${C.cyan}" letter-spacing="1.5">${esc(index)}</text>
  <text x="64" y="${y}" font-size="16" font-weight="700" fill="${C.text}" letter-spacing="2.2">${esc(title)}</text>
  <text x="${w - 32}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${C.dim}">${esc(sub)}</text>
  <rect x="32" y="${y + 16}" width="${w - 64}" height="1" fill="url(#hr)"/>
  <rect class="scan" x="32" y="${y + 15.5}" width="70" height="2" rx="1" fill="url(#scan)"/>`;
}

const BASE_CSS = `
.s1{animation:tw 3.4s ease-in-out infinite}
.s2{animation:tw 4.9s ease-in-out -1.7s infinite}
.s3{animation:tw 6.3s ease-in-out -3.1s infinite}
@keyframes tw{0%,100%{opacity:.18}50%{opacity:1}}
.neb{animation:drift 26s ease-in-out infinite alternate}
.neb2{animation:drift 34s ease-in-out -9s infinite alternate-reverse}
@keyframes drift{from{transform:translate(-18px,-8px)}to{transform:translate(22px,12px)}}
.scan{animation:scan 7s cubic-bezier(.45,0,.55,1) infinite}
@keyframes scan{0%{transform:translateX(0);opacity:0}8%{opacity:1}92%{opacity:1}100%{transform:translateX(var(--scan,706px));opacity:0}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`;

/**
 * The outer frame every panel shares: rounded deep-space card, soft nebula glow,
 * starfield and a thin gradient edge. Dark by design so it reads on both GitHub themes.
 */
export function shell({ w = W, h, title, body, defs = '', css = '', seed = 1, stars = 46, glow = 1 }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}" font-family="${FONT}">
<title>${esc(title)}</title>
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.bg0}"/><stop offset="1" stop-color="${C.bg1}"/></linearGradient>
  <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.cyan}" stop-opacity=".55"/><stop offset=".45" stop-color="${C.violet}" stop-opacity=".28"/><stop offset="1" stop-color="${C.pink}" stop-opacity=".5"/></linearGradient>
  <linearGradient id="hr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}" stop-opacity=".5"/><stop offset=".5" stop-color="${C.violet}" stop-opacity=".22"/><stop offset="1" stop-color="${C.pink}" stop-opacity="0"/></linearGradient>
  <linearGradient id="scan" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}" stop-opacity="0"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
  <linearGradient id="spectrum" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}"/><stop offset=".5" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.pink}"/></linearGradient>
  <radialGradient id="nv"><stop offset="0" stop-color="#7c3aed" stop-opacity="${n(0.34 * glow)}"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/></radialGradient>
  <radialGradient id="nc"><stop offset="0" stop-color="#0891b2" stop-opacity="${n(0.3 * glow)}"/><stop offset="1" stop-color="#0891b2" stop-opacity="0"/></radialGradient>
  <radialGradient id="np"><stop offset="0" stop-color="#db2777" stop-opacity="${n(0.2 * glow)}"/><stop offset="1" stop-color="#db2777" stop-opacity="0"/></radialGradient>
  <clipPath id="clip"><rect width="${w}" height="${h}" rx="18"/></clipPath>
  ${defs}
</defs>
<style>${BASE_CSS.replace('706px', `${w - 134}px`)}${css}</style>
<g clip-path="url(#clip)">
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <ellipse class="neb" cx="${n(w * 0.82)}" cy="${n(h * 0.1)}" rx="${n(w * 0.36)}" ry="${n(Math.max(150, h * 0.55))}" fill="url(#nv)"/>
  <ellipse class="neb2" cx="${n(w * 0.08)}" cy="${n(h * 0.95)}" rx="${n(w * 0.34)}" ry="${n(Math.max(140, h * 0.5))}" fill="url(#nc)"/>
  <ellipse class="neb" cx="${n(w * 0.5)}" cy="${n(h * 1.05)}" rx="${n(w * 0.3)}" ry="${n(Math.max(110, h * 0.4))}" fill="url(#np)"/>
  ${starfield({ w, h, count: stars, seed })}
  ${body}
</g>
<rect x=".75" y=".75" width="${w - 1.5}" height="${h - 1.5}" rx="17.25" fill="none" stroke="url(#edge)" stroke-width="1.5"/>
</svg>
`;
}
