import { C, MONO, esc, n, shell, visible, wrap } from '../theme.mjs';
import { glyph } from '../glyphs.mjs';

const CW = 410, CH = 190;

export function projectCard(p, live, seed) {
  const a = C[p.accent] ?? C.cyan;
  const lang = live?.language;
  const stars = live?.stars ?? 0;
  const lines = wrap(p.desc, 55).slice(0, 3);

  let tx = 24;
  const tags = p.tags
    .map((t) => {
      const w = n(t.length * 6.6 + 18);
      const out = `<rect x="${tx}" y="${CH - 46}" width="${w}" height="22" rx="11" fill="${a}" fill-opacity=".08" stroke="${a}" stroke-opacity=".38"/><text x="${n(tx + w / 2)}" y="${CH - 31}" text-anchor="middle" font-family="${MONO}" font-size="10.5" fill="${C.text}" opacity=".9">${esc(t)}</text>`;
      tx = n(tx + w + 7);
      return out;
    })
    .join('');

  const css = `
.comet{animation:comet 5.5s cubic-bezier(.45,0,.55,1) infinite}
@keyframes comet{0%{transform:translateX(-90px);opacity:0}12%{opacity:1}88%{opacity:1}100%{transform:translateX(${CW}px);opacity:0}}
.go{animation:go 2.6s ease-in-out infinite}
@keyframes go{0%,100%{transform:translate(0,0)}50%{transform:translate(2px,-2px)}}
`;
  const defs = `
  <linearGradient id="cm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${a}" stop-opacity="0"/><stop offset="1" stop-color="${a}"/></linearGradient>
  <radialGradient id="corner"><stop offset="0" stop-color="${a}" stop-opacity=".26"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></radialGradient>`;

  const body = `
  <circle cx="${CW - 20}" cy="14" r="130" fill="url(#corner)"/>
  <rect class="comet" x="0" y="0" width="90" height="2.5" fill="url(#cm)"/>
  ${lang ? `<circle cx="29" cy="30.5" r="4.5" fill="${visible(lang.color ?? '#8b93b8')}"/><text x="40" y="34.5" font-family="${MONO}" font-size="11" fill="${C.mute}">${esc(lang.name)}</text>` : ''}
  ${stars > 0 ? `${glyph('star', { x: CW - 24 - 14 - String(stars).length * 7.4 - 5, y: 23.5, size: 14, color: C.amber })}<text x="${CW - 24}" y="35" text-anchor="end" font-family="${MONO}" font-size="12" font-weight="700" fill="${C.amber}">${stars}</text>` : ''}
  <text x="24" y="70" font-size="18.5" font-weight="700" fill="${C.text}">${esc(p.title)}</text>
  ${lines.map((l, i) => `<text x="24" y="${94 + i * 18}" font-size="12.5" fill="${C.mute}">${esc(l)}</text>`).join('')}
  ${tags}
  <g class="go"><path d="M${CW - 38} ${CH - 28}l9-9m-7 0h7v7" fill="none" stroke="${a}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></g>`;

  return shell({
    w: CW,
    h: CH,
    title: `${p.title}: ${p.desc}`,
    defs,
    css,
    body,
    seed,
    stars: 16,
    glow: 0.55,
  });
}
