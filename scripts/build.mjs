#!/usr/bin/env node
// Builds every image in assets/ and README.md from scripts/config.mjs plus live GitHub data.
// Zero dependencies. Run: node scripts/build.mjs   (needs GITHUB_TOKEN, or a logged-in `gh`)

import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import cfg from './config.mjs';
import { hero } from './panels/hero.mjs';
import { focus } from './panels/focus.mjs';
import { stack } from './panels/stack.mjs';
import { projectCard } from './panels/project.mjs';
import { stats } from './panels/stats.mjs';
import { button, footer, sectionBar } from './panels/extras.mjs';
import { projectFile, readme } from './readme.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const icons = JSON.parse(readFileSync(new URL('./icons.json', import.meta.url), 'utf8'));

function token() {
  const env = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (env) return env;
  try {
    return execSync('gh auth token', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    throw new Error('Set GITHUB_TOKEN, or log in with `gh auth login`.');
  }
}

const QUERY = `query($login:String!){
  user(login:$login){
    contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date weekday contributionCount contributionLevel}}}}
    repositories(first:100,ownerAffiliations:OWNER,isFork:false,privacy:PUBLIC,orderBy:{field:STARGAZERS,direction:DESC}){
      totalCount
      nodes{name url stargazerCount primaryLanguage{name color} languages(first:12,orderBy:{field:SIZE,direction:DESC}){edges{size node{name color}}}}
    }
  }
}`;

async function fetchData() {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { authorization: `bearer ${token()}`, 'content-type': 'application/json', 'user-agent': 'profile-readme-build' },
    body: JSON.stringify({ query: QUERY, variables: { login: cfg.login } }),
  });
  const json = await res.json();
  if (!res.ok || json.errors || !json.data?.user) {
    throw new Error(`GitHub API failed (${res.status}): ${JSON.stringify(json.errors ?? json).slice(0, 400)}`);
  }
  const user = json.data.user;
  const cal = user.contributionsCollection.contributionCalendar;
  const weeks = cal.weeks.map((w) =>
    w.contributionDays.map((d) => ({ date: d.date, weekday: d.weekday, count: d.contributionCount, level: d.contributionLevel })),
  );

  let activeDays = 0, longestStreak = 0, run = 0;
  for (const d of weeks.flat()) {
    if (d.count > 0) { activeDays++; run++; longestStreak = Math.max(longestStreak, run); } else run = 0;
  }

  const repos = {};
  const langs = new Map();
  let stars = 0;
  for (const r of user.repositories.nodes) {
    stars += r.stargazerCount;
    repos[r.name] = { stars: r.stargazerCount, url: r.url, language: r.primaryLanguage };
    for (const e of r.languages.edges) {
      if (cfg.ignoreLanguages.includes(e.node.name)) continue;
      const cur = langs.get(e.node.name) ?? { name: e.node.name, color: e.node.color, size: 0 };
      cur.size += e.size;
      langs.set(e.node.name, cur);
    }
  }

  return {
    contributions: cal.totalContributions,
    activeDays,
    longestStreak,
    stars,
    publicRepos: user.repositories.totalCount,
    weeks,
    languages: [...langs.values()].sort((a, b) => b.size - a.size),
    repos,
  };
}

const data = await fetchData();
for (const p of cfg.projects) {
  if (!data.repos[p.repo]) throw new Error(`Project "${p.repo}" is not one of your public repos. Fix scripts/config.mjs.`);
}

const files = {
  'hero.svg': hero(cfg, data),
  'focus.svg': focus(cfg),
  'stack.svg': stack(cfg, icons),
  'projects.svg': sectionBar({ index: '03', title: 'FEATURED PROJECTS', sub: 'click a card to open the repo' }),
  'stats.svg': stats(cfg, data),
  'footer.svg': footer(cfg),
};
cfg.projects.forEach((p, i) => {
  files[projectFile(p.repo)] = projectCard(p, data.repos[p.repo], 100 + i * 7);
});
for (const link of cfg.links) files[`btn-${link.id}.svg`] = button(link, icons);

mkdirSync(`${root}assets`, { recursive: true });
let bytes = 0;
for (const [name, svg] of Object.entries(files)) {
  writeFileSync(`${root}assets/${name}`, svg);
  bytes += svg.length;
}
writeFileSync(`${root}README.md`, readme(cfg, data));

console.log(`Built ${Object.keys(files).length} images (${(bytes / 1024).toFixed(0)} KB) + README.md`);
console.log(`  ${data.contributions} contributions · ${data.activeDays} active days · ${data.longestStreak}d streak · ${data.stars} stars · ${data.publicRepos} repos`);
console.log(`  languages: ${data.languages.slice(0, 6).map((l) => l.name).join(', ')}`);
