import { C, FONT, MONO, W, esc, n, shell, visible } from '../theme.mjs';
import { glyph } from '../glyphs.mjs';

// Slim banner that introduces the project grid (the cards are separate, linkable images).
export function sectionBar({ index, title, sub }) {
  const body = `
  <text x="32" y="35" font-family="${MONO}" font-size="12" fill="${C.cyan}" letter-spacing="1.5">${esc(index)}</text>
  <text x="64" y="35" font-size="16" font-weight="700" fill="${C.text}" letter-spacing="2.2">${esc(title)}</text>
  <text x="${W - 32}" y="35" text-anchor="end" font-family="${MONO}" font-size="11" fill="${C.dim}">${esc(sub)}</text>`;
  return shell({ h: 56, title, body, seed: 44, stars: 22, glow: 0.5 });
}

// Closing panel: a planet horizon with the motto above it.
export function footer(cfg) {
  const H = 170;
  const defs = `
  <radialGradient id="world" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#1b1f4d"/><stop offset=".5" stop-color="#0b0e25"/><stop offset="1" stop-color="#05060f"/></radialGradient>
  <radialGradient id="dawn" cx=".5" cy="1" r=".9"><stop offset="0" stop-color="${C.cyan}" stop-opacity=".42"/><stop offset=".45" stop-color="${C.violet}" stop-opacity=".16"/><stop offset="1" stop-color="${C.violet}" stop-opacity="0"/></radialGradient>
  <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}" stop-opacity="0"/><stop offset=".3" stop-color="${C.cyan}"/><stop offset=".5" stop-color="#ffffff"/><stop offset=".7" stop-color="${C.pink}"/><stop offset="1" stop-color="${C.pink}" stop-opacity="0"/></linearGradient>
  <path id="pass" d="M-40 118Q420 28 880 118"/>`;
  const css = `
.dawn{animation:dawn 7s ease-in-out infinite}
@keyframes dawn{0%,100%{opacity:.65}50%{opacity:1}}
`;
  const body = `
  <ellipse class="dawn" cx="${W / 2}" cy="${H - 22}" rx="390" ry="84" fill="url(#dawn)"/>
  <ellipse cx="${W / 2}" cy="${H + 268}" rx="1100" ry="300" fill="url(#world)"/>
  <path d="M40 ${H - 14}Q${W / 2} ${H - 50} ${W - 40} ${H - 14}" fill="none" stroke="url(#rim)" stroke-width="1.6"/>
  <g><animateMotion dur="16s" repeatCount="indefinite" rotate="auto"><mpath xlink:href="#pass" href="#pass"/></animateMotion><rect x="-22" y="-.6" width="22" height="1.2" fill="url(#scan)"/><circle r="2" fill="#fff"/><circle r="5" fill="${C.cyan}" opacity=".3"/></g>
  <text x="${W / 2}" y="68" text-anchor="middle" font-size="19" font-weight="600" font-style="italic" fill="${C.text}">“${esc(cfg.motto)}”</text>
  <text x="${W / 2}" y="94" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${C.dim}" letter-spacing="1">END OF TRANSMISSION · THANKS FOR STOPPING BY</text>`;
  return shell({ h: H, title: cfg.motto, defs, css, body, seed: 88, stars: 60, glow: 0.4 });
}

// Pill-shaped link button.
export function button(link, icons) {
  const h = 42;
  const w = Math.round(46 + link.label.length * 8.5 + 34);
  let art;
  if (link.icon) art = `<path transform="translate(17 12) scale(.75)" d="${icons[link.icon].path}" fill="${visible(icons[link.icon].hex)}"/>`;
  else art = glyph(link.glyph, { x: 17, y: 12, size: 18, color: C.text });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(link.label)}" font-family="${FONT}">
<title>${esc(link.label)}</title>
<defs>
  <linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0c1030"/><stop offset="1" stop-color="#141a44"/></linearGradient>
  <linearGradient id="e" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}"/><stop offset=".5" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.pink}"/></linearGradient>
  <linearGradient id="sh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <clipPath id="c"><rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${h / 2 - 1}"/></clipPath>
</defs>
<style>.sh{animation:sh 4.5s ease-in-out infinite}@keyframes sh{0%,55%{transform:translateX(-70px)}100%{transform:translateX(${w + 10}px)}}@media (prefers-reduced-motion:reduce){.sh{animation:none;opacity:0}}</style>
<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${h / 2 - 1}" fill="url(#b)" stroke="url(#e)" stroke-width="1.4"/>
<g clip-path="url(#c)"><rect class="sh" x="0" y="0" width="60" height="${h}" fill="url(#sh)" transform="skewX(-20)"/></g>
${art}
<text x="43" y="${n(h / 2 + 4.6)}" font-size="13.5" font-weight="600" fill="${C.text}">${esc(link.label)}</text>
<path d="M${w - 22} ${h / 2 + 3.5}l6-6m-4.6 0h4.6v4.6" fill="none" stroke="${C.mute}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
}
