import { C, MONO, W, esc, n, shell, wrap } from '../theme.mjs';

const H = 360;

// Typewriter built on SMIL so it also runs in Safari: one clip rect per role, stepped in
// character-width increments, plus a cursor that follows the same timeline.
function typewriter(roles, { x, y, size, cw }) {
  const TYPE = 75, HOLD = 2100, DEL = 32, GAP = 420;
  const frames = [];
  let t = 0;
  roles.forEach((role, i) => {
    for (let c = 1; c <= role.length; c++) { frames.push({ t, i, c }); t += TYPE; }
    t += HOLD;
    for (let c = role.length - 1; c >= 0; c--) { frames.push({ t, i, c }); t += DEL; }
    t += GAP;
  });
  const total = t;
  const dur = `${n(total / 1000)}s`;
  const key = (f) => String(+(f.t / total).toFixed(5));

  let defs = '';
  let body = '';
  roles.forEach((role, i) => {
    const mine = frames.filter((f) => f.i === i);
    const seq = mine[0].t > 0 ? [{ t: 0, c: 0 }, ...mine] : mine;
    const full = n(role.length * cw);
    defs += `<clipPath id="role${i}"><rect x="${x}" y="${y - size}" height="${n(size * 1.45)}" width="${i === 0 ? full : 0}"><animate attributeName="width" calcMode="discrete" dur="${dur}" repeatCount="indefinite" keyTimes="${seq.map(key).join(';')}" values="${seq.map((f) => n(f.c * cw)).join(';')}"/></rect></clipPath>`;
    body += `<text x="${x}" y="${y}" font-family="${MONO}" font-size="${size}" font-weight="600" fill="${C.cyan}" textLength="${full}" lengthAdjust="spacingAndGlyphs" clip-path="url(#role${i})">${esc(role)}</text>`;
  });
  body += `<rect class="cursor" x="${n(x + roles[0].length * cw + 3)}" y="${n(y - size * 0.86)}" width="${n(cw * 0.82)}" height="${n(size * 1.08)}" rx="1.5" fill="${C.cyan}"><animate attributeName="x" calcMode="discrete" dur="${dur}" repeatCount="indefinite" keyTimes="${frames.map(key).join(';')}" values="${frames.map((f) => n(x + f.c * cw + 3)).join(';')}"/></rect>`;
  return { defs, body };
}

function orbits(labels) {
  const cx = 630, cy = 178, tilt = -18, zoom = 1.12;
  const rings = [
    { rx: 74, ry: 28, dur: 15, color: C.cyan },
    { rx: 116, ry: 45, dur: 23, color: C.violet },
    { rx: 158, ry: 62, dur: 34, color: C.pink },
  ];
  let defs = '';
  let back = '';
  let sats = '';
  rings.forEach((r, i) => {
    const d = `M${-r.rx} 0a${r.rx} ${r.ry} 0 1 1 ${2 * r.rx} 0a${r.rx} ${r.ry} 0 1 1 ${-2 * r.rx} 0`;
    defs += `<path id="orbit${i}" d="${d}"/>`;
    back += `<use xlink:href="#orbit${i}" href="#orbit${i}" fill="none" stroke="${r.color}" stroke-opacity=".3" stroke-width="1" stroke-dasharray="2 6"/>`;
    [0, 1].forEach((k) => {
      const label = labels[i * 2 + k];
      if (!label) return;
      const begin = -n(r.dur * (k * 0.5 + i * 0.17));
      sats += `<g><animateMotion dur="${r.dur}s" begin="${begin}s" repeatCount="indefinite"><mpath xlink:href="#orbit${i}" href="#orbit${i}"/></animateMotion><g transform="rotate(${-tilt})"><circle r="8" fill="${r.color}" opacity=".18"/><circle r="3.4" fill="${r.color}"/><circle r="1.3" fill="#fff"/><text y="19" text-anchor="middle" font-family="${MONO}" font-size="10.5" fill="${C.text}" opacity=".82">${esc(label)}</text></g></g>`;
    });
  });

  defs += `
  <radialGradient id="planet" cx=".34" cy=".3" r=".8"><stop offset="0" stop-color="#ede9fe"/><stop offset=".28" stop-color="#a78bfa"/><stop offset=".68" stop-color="#5b21b6"/><stop offset="1" stop-color="#1e1b4b"/></radialGradient>
  <radialGradient id="halo"><stop offset=".35" stop-color="#8b5cf6" stop-opacity=".5"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></radialGradient>
  <clipPath id="disc"><circle r="30"/></clipPath>`;

  const body = `
  <g transform="translate(${cx} ${cy}) scale(${zoom}) rotate(${tilt})">
    <circle r="78" fill="url(#halo)"/>
    <circle r="30" fill="none" stroke="${C.cyan}" stroke-width="1.2"><animate attributeName="r" values="30;96" dur="4.6s" repeatCount="indefinite"/><animate attributeName="opacity" values=".55;0" dur="4.6s" repeatCount="indefinite"/></circle>
    <circle r="30" fill="none" stroke="${C.violet}" stroke-width="1.2"><animate attributeName="r" values="30;96" dur="4.6s" begin="-2.3s" repeatCount="indefinite"/><animate attributeName="opacity" values=".55;0" dur="4.6s" begin="-2.3s" repeatCount="indefinite"/></circle>
    ${back}
    <ellipse rx="50" ry="12.5" fill="none" stroke="url(#spectrum)" stroke-width="3.2" opacity=".85"/>
    <circle r="30" fill="url(#planet)"/>
    <g clip-path="url(#disc)" opacity=".22" stroke="#1e1b4b" stroke-width="3" fill="none">
      <path d="M-34 -9q34 9 68 0"/><path d="M-34 5q34 10 68 0"/><path d="M-34 17q34 8 68 0"/>
    </g>
    <path d="M-50 0A50 12.5 0 0 0 50 0" fill="none" stroke="url(#spectrum)" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M-50 0A50 12.5 0 0 0 50 0" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/>
    ${sats}
  </g>`;
  return { defs, body };
}

export function hero(cfg, data) {
  const x = 48;
  const type = typewriter(cfg.roles, { x: x + 25, y: 190, size: 19, cw: 11.5 });
  const orb = orbits(cfg.orbit);
  const lines = wrap(cfg.tagline, 50);
  const fmt = (v) => v.toLocaleString('en-US');
  const statline = `${fmt(data.contributions)} contributions this year  ·  ${fmt(data.stars)} stars  ·  ${fmt(data.publicRepos)} public repos`;

  const defs = `
  <linearGradient id="name" gradientUnits="userSpaceOnUse" x1="${x}" y1="0" x2="460" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#ddd6fe"/><stop offset="1" stop-color="#67e8f9"/></linearGradient>
  <linearGradient id="shoot" gradientUnits="userSpaceOnUse" x1="-120" y1="-42" x2="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>
  ${type.defs}${orb.defs}`;

  const css = `
.cursor{animation:blink 1.05s steps(1) infinite}
@keyframes blink{0%,55%{opacity:1}56%,100%{opacity:0}}
.sh1{animation:sh1 9s linear infinite}
.sh2{animation:sh2 13s linear -5s infinite}
@keyframes sh1{0%{transform:translate(210px,-20px);opacity:0}1.5%{opacity:1}9%{transform:translate(560px,102px);opacity:0}100%{transform:translate(560px,102px);opacity:0}}
@keyframes sh2{0%{transform:translate(520px,180px);opacity:0}1.5%{opacity:.9}7%{transform:translate(800px,278px);opacity:0}100%{transform:translate(800px,278px);opacity:0}}
.live{animation:live 2.2s ease-in-out infinite}
@keyframes live{0%,100%{opacity:1}50%{opacity:.3}}
`;

  const body = `
  <g class="sh1" opacity="0"><line x1="-120" y1="-42" x2="0" y2="0" stroke="url(#shoot)" stroke-width="1.6" stroke-linecap="round"/><circle r="1.6" fill="#fff"/></g>
  <g class="sh2" opacity="0"><line x1="-120" y1="-42" x2="0" y2="0" stroke="url(#shoot)" stroke-width="1.3" stroke-linecap="round"/><circle r="1.3" fill="#fff"/></g>
  ${orb.body}
  <text x="${x}" y="84" font-family="${MONO}" font-size="13" fill="${C.dim}"><tspan fill="${C.green}">$</tspan> whoami</text>
  <text x="${x - 2}" y="142" font-size="50" font-weight="800" letter-spacing="-1" fill="url(#name)">${esc(cfg.name)}</text>
  <text x="${x}" y="190" font-family="${MONO}" font-size="19" font-weight="600" fill="${C.pink}">&gt;</text>
  ${type.body}
  ${lines.map((l, i) => `<text x="${x}" y="${236 + i * 22}" font-size="14.5" fill="${C.mute}">${esc(l)}</text>`).join('')}
  <circle class="live" cx="${x + 4}" cy="${H - 39.5}" r="3.5" fill="${C.green}"/>
  <text x="${x + 16}" y="${H - 35}" font-family="${MONO}" font-size="11.5" fill="${C.dim}">${esc(statline)}</text>`;

  return shell({
    h: H,
    title: `${cfg.name}: ${cfg.roles.join(', ')}`,
    defs,
    css,
    body,
    seed: 7,
    stars: 120,
    glow: 1.15,
  });
}
