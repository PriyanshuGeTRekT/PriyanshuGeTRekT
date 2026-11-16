import { C, MONO, esc, header, n, shell, visible } from '../theme.mjs';
import { glyph } from '../glyphs.mjs';

const ACCENTS = [C.cyan, C.violet, C.pink, C.amber, C.green, C.cyan, C.violet];

export function stack(cfg, icons) {
  const top = 84, pitchY = 78, tileW = 71.5, tileH = 64, x0 = 190, pitchX = 77.5;
  const css = `
.ic{animation:glint 6s ease-in-out infinite}
@keyframes glint{0%,78%,100%{opacity:.78}86%{opacity:1}}
.bar{animation:bar 6s ease-in-out infinite}
@keyframes bar{0%,100%{opacity:.5}50%{opacity:1}}
`;
  let rows = '';
  cfg.stack.forEach((row, r) => {
    const y = top + r * pitchY;
    const a = ACCENTS[r % ACCENTS.length];
    rows += `
  <rect class="bar" style="animation-delay:${n(-r * 0.7)}s" x="32" y="${y + 14}" width="3" height="36" rx="1.5" fill="${a}"/>
  <text x="46" y="${y + 29}" font-size="12.5" font-weight="700" fill="${C.text}">${esc(row.label)}</text>
  <text x="46" y="${y + 46}" font-family="${MONO}" font-size="10" fill="${C.dim}">${String(r + 1).padStart(2, '0')} / ${String(row.items.length).padStart(2, '0')} tools</text>`;
    row.items.forEach((item, i) => {
      const x = n(x0 + i * pitchX);
      const ix = n(x + tileW / 2 - 12);
      const iy = y + 11;
      let art;
      if (item.icon) {
        const ic = icons[item.icon];
        if (!ic) throw new Error(`No icon "${item.icon}" in scripts/icons.json`);
        art = `<path transform="translate(${ix} ${iy})" d="${ic.path}" fill="${visible(ic.hex)}"/>`;
      } else {
        art = glyph(item.glyph, { x: ix, y: iy, color: a });
      }
      const long = item.name.length > 11 ? ` textLength="${tileW - 9}" lengthAdjust="spacingAndGlyphs"` : '';
      rows += `
  <rect x="${x}" y="${y}" width="${tileW}" height="${tileH}" rx="10" fill="${C.card}" fill-opacity=".72" stroke="${C.cardEdge}"/>
  <g class="ic" style="animation-delay:${n(-6 + (i + r) * 0.28)}s">${art}</g>
  <text x="${n(x + tileW / 2)}" y="${y + 53}" text-anchor="middle" font-size="10.5" fill="${C.mute}"${long}>${esc(item.name)}</text>`;
    });
  });

  const h = top + cfg.stack.length * pitchY - (pitchY - tileH) + 30;
  return shell({
    h,
    title: `Tech stack. ${cfg.stack.map((r) => `${r.label}: ${r.items.map((i) => i.name).join(', ')}`).join('. ')}`,
    css,
    seed: 33,
    stars: 70,
    glow: 0.75,
    body: `${header({ index: '02', title: 'TECH STACK', sub: 'what I reach for in 2026' })}${rows}`,
  });
}
