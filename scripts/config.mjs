// Everything the profile says about you lives in this one file.
// Edit it, run `node scripts/build.mjs`, commit. The daily workflow refreshes the live numbers.

export default {
  login: 'PriyanshuGeTRekT',
  name: 'Priyanshu Yadav',

  // Typed out one after another in the hero.
  roles: ['AI Engineer', 'LLMOps & Evals', 'Full-Stack Developer', 'Agent & RAG Systems'],

  tagline:
    'I build LLM agents that cite their sources, the evals and tracing that keep them honest, and the full-stack products around them.',

  // Labels that orbit the planet in the hero (two per orbit, inner to outer).
  orbit: ['agents', 'RAG', 'evals', 'LLMOps', 'full-stack', 'desktop'],

  links: [
    { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/priyanshuyadav98/', glyph: 'in' },
    { id: 'website', label: 'namanpuja.com', url: 'https://www.namanpuja.com/', glyph: 'globe' },
    { id: 'repos', label: 'All repositories', url: 'https://github.com/PriyanshuGeTRekT?tab=repositories', icon: 'github' },
  ],

  focus: [
    {
      glyph: 'agents',
      accent: 'cyan',
      title: 'AI Engineering',
      kicker: 'Agents that do real work',
      points: [
        'Multi-agent graphs in LangGraph',
        'Hybrid-search RAG, cited answers',
        'Tool calling, MCP, human review',
        'Speech, OCR and vision pipelines',
      ],
    },
    {
      glyph: 'evals',
      accent: 'violet',
      title: 'LLMOps & Evals',
      kicker: 'Keeping models honest',
      points: [
        'Eval harnesses, regression suites',
        'OpenTelemetry traces per step',
        'Structured output + validation',
        'Any provider, hosted or local',
      ],
    },
    {
      glyph: 'stack',
      accent: 'pink',
      title: 'Full-Stack & Desktop',
      kicker: 'The product around the model',
      points: [
        'Next.js, React, TypeScript UIs',
        'Node + FastAPI, Postgres, Redis',
        'Electron, Tauri, Rust, Swift',
        'Docker, CI/CD, cloud deploys',
      ],
    },
  ],

  // `icon` is a key in scripts/icons.json (Simple Icons). `glyph` is a hand-drawn fallback
  // from scripts/glyphs.mjs for brands Simple Icons does not carry.
  stack: [
    {
      label: 'Agents & LLMs',
      items: [
        { name: 'LangGraph', icon: 'langgraph' },
        { name: 'LangChain', icon: 'langchain' },
        { name: 'Claude', icon: 'claude' },
        { name: 'OpenAI', glyph: 'spark' },
        { name: 'Gemini', icon: 'googlegemini' },
        { name: 'Groq', glyph: 'bolt' },
        { name: 'MCP', icon: 'modelcontextprotocol' },
        { name: 'llama.cpp', glyph: 'chip' },
      ],
    },
    {
      label: 'RAG · ML · Vision',
      items: [
        { name: 'Qdrant', icon: 'qdrant' },
        { name: 'OpenSearch', icon: 'opensearch' },
        { name: 'PyTorch', icon: 'pytorch' },
        { name: 'ONNX', icon: 'onnx' },
        { name: 'OpenCV', icon: 'opencv' },
        { name: 'Whisper', glyph: 'wave' },
        { name: 'OCR', glyph: 'scan' },
        { name: 'NumPy', icon: 'numpy' },
      ],
    },
    {
      label: 'LLMOps & Evals',
      items: [
        { name: 'OpenTelemetry', icon: 'opentelemetry' },
        { name: 'OpenInference', glyph: 'trace' },
        { name: 'Pydantic', icon: 'pydantic' },
        { name: 'pytest', icon: 'pytest' },
        { name: 'Celery', icon: 'celery' },
        { name: 'Redis', icon: 'redis' },
        { name: 'Ruff', icon: 'ruff' },
        { name: 'uv', icon: 'uv' },
      ],
    },
    {
      label: 'Web',
      items: [
        { name: 'TypeScript', icon: 'typescript' },
        { name: 'React', icon: 'react' },
        { name: 'Next.js', icon: 'nextdotjs' },
        { name: 'Vite', icon: 'vite' },
        { name: 'Tailwind', icon: 'tailwindcss' },
        { name: 'shadcn/ui', icon: 'shadcnui' },
        { name: 'TanStack', icon: 'reactquery' },
        { name: 'Zod', icon: 'zod' },
      ],
    },
    {
      label: 'Backend & Data',
      items: [
        { name: 'Python', icon: 'python' },
        { name: 'Node.js', icon: 'nodedotjs' },
        { name: 'FastAPI', icon: 'fastapi' },
        { name: 'Express', icon: 'express' },
        { name: 'PostgreSQL', icon: 'postgresql' },
        { name: 'MySQL', icon: 'mysql' },
        { name: 'SQLite', icon: 'sqlite' },
        { name: 'Supabase', icon: 'supabase' },
      ],
    },
    {
      label: 'Desktop & Systems',
      items: [
        { name: 'Rust', icon: 'rust' },
        { name: 'Tauri', icon: 'tauri' },
        { name: 'Electron', icon: 'electron' },
        { name: 'Swift', icon: 'swift' },
        { name: '.NET / C#', icon: 'dotnet' },
        { name: 'PowerShell', glyph: 'terminal' },
        { name: 'Win32', glyph: 'window' },
        { name: 'Capacitor', icon: 'capacitor' },
      ],
    },
    {
      label: 'Cloud & DevOps',
      items: [
        { name: 'Docker', icon: 'docker' },
        { name: 'Actions', icon: 'githubactions' },
        { name: 'AWS', glyph: 'cloud' },
        { name: 'Vercel', icon: 'vercel' },
        { name: 'Render', icon: 'render' },
        { name: 'Fly.io', icon: 'flydotio' },
        { name: 'Nginx', icon: 'nginx' },
        { name: 'Linux', icon: 'linux' },
      ],
    },
  ],

  // Star counts and primary language are filled in live from the GitHub API.
  projects: [
    {
      repo: 'Claude-Code-Desktop-Switcher',
      title: 'Claude Profile Switcher',
      desc: 'Run several Claude desktop accounts side by side on Windows, macOS and Linux. One click to add or switch, with sign-ins routed to the right account.',
      tags: ['PowerShell', 'Swift', 'Python'],
      accent: 'pink',
    },
    {
      repo: 'AI-harness-Character-creator',
      title: 'AgentDeck',
      desc: 'One local control panel for 21 AI coding agents: behavior, permissions, token cost, skills, subagents, MCP servers and hooks. Zero dependencies.',
      tags: ['Node.js', 'MCP', 'Claude Code'],
      accent: 'cyan',
    },
    {
      repo: 'rfp-intelligence',
      title: 'RFP Intelligence',
      desc: 'Hybrid search and multi-agent extraction over public bid documents. Every field is cited to a file, page and quote, backed by evals and agent traces.',
      tags: ['LangGraph', 'Qdrant', 'OpenTelemetry'],
      accent: 'violet',
    },
    {
      repo: 'Universal-Monitor-Brightness-control',
      title: 'Brightness Tray',
      desc: 'A ~340 KB Windows tray app that sets the brightness of every display: laptop panels, DDC/CI monitors and a software fallback. 0% idle CPU.',
      tags: ['Rust', 'Win32', 'DDC/CI'],
      accent: 'amber',
    },
    {
      repo: 'AI-Lead-Generation-Research-Agent-',
      title: 'Lead Research Agent',
      desc: 'Supervisor multi-agent pipeline for B2B lead research: multi-source search, LLM scoring and enrichment, then human review before any outreach.',
      tags: ['LangGraph', 'RAG', 'Celery'],
      accent: 'green',
    },
    {
      repo: 'frontend-namanpuja',
      title: 'namanpuja.com',
      desc: 'Production booking platform for Vedic pujas: a Next.js storefront, an Express + TypeScript API, an admin console and a CRM that syncs every booking.',
      tags: ['Next.js', 'Express', 'react-admin'],
      accent: 'cyan',
    },
  ],

  // Markup and generated files that would otherwise drown out real code in the language bar.
  ignoreLanguages: ['HTML', 'CSS', 'Batchfile', 'Inno Setup', 'VBScript', 'Makefile', 'Dockerfile', 'PLpgSQL'],

  motto: 'Building systems, not just projects.',
};
