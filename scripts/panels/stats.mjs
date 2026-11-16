import { C, MONO, W, esc, header, n, shell, visible } from '../theme.mjs';

// Dim dust to bright star: one hue ramp, monotone in lightness.
const HEAT = ['#1a2148', '#2c4a94', '#3b82f6', '#22d3ee', '#cffafe'];
const RADIUS = [1.9, 3.3, 4, 4.6, 5];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function stats(cfg, data) {
  const fmt = (v) => v.toLocaleString('en-US');
  const metrics = [
    { v: fmt(data.contributions), l: 'contributions · 12 mo' },
    { v: fmt(data.activeDays), l: 'active days' },
    { v: `${fmt(data.longestStreak)}d`, l: 'longest streak' },
    { v: fmt(data.stars), l: 'stars earned' },
  ];
  const colW = (W - 64) / metrics.length;
  const top = metrics
    .map(
      (m, i) => `
  <text x="${n(32 + i * colW)}" y="108" font-size="30" font-weight="800" letter-spacing="-.5" fill="url(#num)">${esc(m.v)}</text>
  <text x="${n(32 + i * colW)}" y="127" font-family="${MONO}" font-size="10.5" fill="${C.dim}" letter-spacing=".6">${esc(m.l.toUpperCase())}</text>`,
    )
    .join('');

  // Contribution calendar as a field of stars: brighter and bigger the busier the day.
  const pitch = 14;
  const weeks = data.weeks.slice(-53);
  // GitHub's own levels are scaled to the single busiest day, which flattens everything else.
  // Rank the active days instead so the field has real contrast.
  const active = weeks.flat().map((d) => d.count).filter((c) => c > 0).sort((a, b) => a - b);
  const cut = [0.4, 0.7, 0.92].map((q) => active[Math.min(active.length - 1, Math.floor(active.length * q))] ?? 0);
  const levelOf = (c) => (c <= 0 ? 0 : c <= cut[0] ? 1 : c <= cut[1] ? 2 : c <= cut[2] ? 3 : 4);
  const gx = n((W - weeks.length * pitch) / 2 + pitch / 2);
  const gy = 178;
  let grid = '';
  let labels = '';
  let lastMonth = -1;
  let lastLabelX = -100;
  weeks.forEach((week, wi) => {
    const x = n(gx + wi * pitch);
    const first = week[0];
    const month = +first.date.slice(5, 7) - 1;
    if (month !== lastMonth) {
      // Skip a label that would collide with the previous one (partial first column).
      if (x - lastLabelX > 30 && wi < weeks.length - 1) {
        labels += `<text x="${n(x - 4)}" y="${gy - 14}" font-family="${MONO}" font-size="10" fill="${C.dim}">${MONTHS[month]}</text>`;
        lastLabelX = x;
      }
      lastMonth = month;
    }
    let col = '';
    for (const d of week) {
      const lv = levelOf(d.count);
      const y = gy + d.weekday * pitch;
      if (lv === 4) col += `<circle cx="${x}" cy="${y}" r="7.5" fill="${C.cyan}" opacity=".2"/>`;
      col += `<circle cx="${x}" cy="${y}" r="${RADIUS[lv]}" fill="${HEAT[lv]}"/>`;
    }
    grid += `<g class="col" style="animation-delay:${n(-5.5 + wi * 0.075)}s">${col}</g>`;
  });

  // Languages across public, non-fork repos.
  const barY = gy + 7 * pitch + 16;
  const barW = W - 64;
  const langs = data.languages.slice(0, 6);
  const sum = langs.reduce((s, l) => s + l.size, 0) || 1;
  let bx = 32;
  let segs = '';
  let legend = '';
  let lx = 32;
  langs.forEach((l, i) => {
    const w = (l.size / sum) * barW;
    const color = visible(l.color ?? '#8b93b8');
    segs += `<rect x="${n(bx)}" y="${barY}" width="${n(Math.max(w - 2, 1))}" height="8" rx="4" fill="${color}"/>`;
    bx += w;
    const pct = `${((l.size / sum) * 100).toFixed(l.size / sum < 0.1 ? 1 : 0)}%`;
    legend += `<circle cx="${n(lx + 4)}" cy="${barY + 27}" r="4" fill="${color}"/><text x="${n(lx + 14)}" y="${barY + 31}" font-size="11.5" fill="${C.mute}">${esc(l.name)} <tspan font-family="${MONO}" font-size="10.5" fill="${C.dim}">${pct}</tspan></text>`;
    lx += 14 + l.name.length * 6.7 + pct.length * 6.6 + 22;
  });

  const defs = `<linearGradient id="num" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#a5b4fc"/></linearGradient>`;
  const css = `
.col{animation:sweep 5.5s ease-in-out infinite}
@keyframes sweep{0%,70%,100%{opacity:.72}82%{opacity:1}}
`;

  return shell({
    h: barY + 58,
    title: `GitHub activity: ${metrics.map((m) => `${m.v} ${m.l}`).join(', ')}. Top languages: ${langs.map((l) => l.name).join(', ')}.`,
    defs,
    css,
    seed: 55,
    stars: 30,
    glow: 0.7,
    body: `${header({ index: '04', title: 'TELEMETRY', sub: 'live from the GitHub API · rebuilt daily' })}${top}${labels}${grid}${segs}${legend}`,
  });
}
