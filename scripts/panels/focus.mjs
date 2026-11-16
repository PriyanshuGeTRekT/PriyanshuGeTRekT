import { C, MONO, W, esc, header, shell } from '../theme.mjs';

// Small animated illustrations, drawn in a 38x38 box.
const ART = {
  agents: (a) => `
    <path d="M9 19 27 9M9 19l18 10M27 9v20" stroke="${a}" stroke-width="1.3" opacity=".55" fill="none"/>
    <circle cx="9" cy="19" r="3.8" fill="${a}"/>
    <circle cx="27" cy="9" r="3.2" fill="${C.card}" stroke="${a}" stroke-width="1.4"/>
    <circle cx="27" cy="29" r="3.2" fill="${C.card}" stroke="${a}" stroke-width="1.4"/>
    <circle r="1.9" fill="#fff"><animateMotion dur="3s" repeatCount="indefinite" path="M9 19 27 9V29Z"/></circle>`,
  evals: (a) => `
    <path d="M4 30h30" stroke="${a}" stroke-width="1" opacity=".35"/>
    <path class="pulse" d="M4 22h6l3-10 5 16 4-11 2.5 5H34" fill="none" stroke="${a}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="76"/>
    <circle cx="30.5" cy="9" r="5" fill="${C.card}" stroke="${a}" stroke-width="1.3"/>
    <path d="M28.2 9.1l1.6 1.6 3-3.2" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  stack: (a) => `
    <path class="l3" d="M19 18l13 6-13 6-13-6z" fill="${a}" opacity=".28"/>
    <path class="l2" d="M19 12l13 6-13 6-13-6z" fill="${a}" opacity=".55"/>
    <path class="l1" d="M19 6l13 6-13 6-13-6z" fill="${a}"/>`,
};

export function focus(cfg) {
  const cardW = 248, cardH = 164, gap = 16, top = 84;
  const css = `
.pulse{animation:pulse 3.2s ease-in-out infinite}
@keyframes pulse{0%{stroke-dashoffset:76}55%,100%{stroke-dashoffset:0}}
.l1{animation:float 3.6s ease-in-out infinite}
.l2{animation:float 3.6s ease-in-out -.5s infinite}
.l3{animation:float 3.6s ease-in-out -1s infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
`;
  let defs = '';
  let cards = '';
  cfg.focus.forEach((f, i) => {
    const a = C[f.accent];
    const x = 32 + i * (cardW + gap);
    defs += `<linearGradient id="top${i}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></linearGradient>`;
    cards += `
  <g transform="translate(${x} ${top})">
    <rect width="${cardW}" height="${cardH}" rx="14" fill="${C.card}" fill-opacity=".74" stroke="${C.cardEdge}"/>
    <rect x="16" y="0" width="${cardW - 80}" height="2" rx="1" fill="url(#top${i})"/>
    <rect x="16" y="18" width="38" height="38" rx="10" fill="${a}" fill-opacity=".1" stroke="${a}" stroke-opacity=".3"/>
    <g transform="translate(16 18)">${ART[f.glyph](a)}</g>
    <text x="66" y="34" font-size="15" font-weight="700" fill="${C.text}">${esc(f.title)}</text>
    <text x="66" y="51" font-size="11.5" fill="${a}">${esc(f.kicker)}</text>
    ${f.points
      .map(
        (p, k) =>
          `<rect x="19" y="${78 + k * 20}" width="5" height="5" rx="1" transform="rotate(45 21.5 ${80.5 + k * 20})" fill="${a}" opacity=".8"/><text x="33" y="${85 + k * 20}" font-size="12" fill="${C.mute}">${esc(p)}</text>`,
      )
      .join('')}
  </g>`;
  });

  return shell({
    h: top + cardH + 28,
    title: `What I build: ${cfg.focus.map((f) => `${f.title} (${f.points.join('; ')})`).join('. ')}`,
    defs,
    css,
    seed: 21,
    stars: 44,
    glow: 0.8,
    body: `${header({ index: '01', title: 'WHAT I BUILD', sub: 'agents · evals · products' })}${cards}`,
  });
}
