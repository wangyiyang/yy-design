<sub><b>🌐 English</b> · <a href="README.zh.md">中文</a></sub>

<div align="center">

# YY Design

**An agent skill that turns one sentence into production-ready design artifacts.**

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Agent-Agnostic](https://img.shields.io/badge/Agent-Agnostic-blueviolet)](https://skills.sh)
[![Skills](https://img.shields.io/badge/skills.sh-Compatible-green)](https://skills.sh)

</div>

---

## What is this?

YY Design is a [skill](https://skills.sh) — a structured prompt package that any compatible AI coding agent can install. Once installed, you describe what you want in plain language, and the agent delivers finished design work: animations, prototypes, slide decks, infographics, posters.

The output isn't "AI-generated looking." It's opinionated, typographically precise, and brand-aware.

```bash
npx skills add wangyiyang/yy-design
```

Works with Claude Code, Cursor, Codex, Trae, Hermes, OpenClaw — any agent that supports markdown skills.

---

## Quick Start

After installing, talk to your agent:

```
"Build a 4-screen iOS prototype for a meditation app. Make it clickable."
"Create a 60-second product launch animation. Export MP4 and GIF."
"Design 3 style directions for my pitch deck. Show me demos of each."
"Run an expert design critique on this page — score it across 5 dimensions."
```

No GUI. No plugins. Just conversation.

---

<p align="center">
  <video src="https://github.com/wangyiyang/yy-design/releases/download/v2.0/hero-animation-v10-en.mp4" autoplay muted loop playsinline width="100%">
    <a href="https://github.com/wangyiyang/yy-design/releases/download/v2.0/hero-animation-v10-en.mp4">Download MP4</a>
  </video>
</p>

---

## Capabilities

| What you ask for | What you get | Time |
|---|---|---|
| App prototype | Single-file HTML, real device bezels, clickable navigation, Playwright-tested | 10–15 min |
| Slide deck | HTML presentation + editable PPTX with real text frames | 15–25 min |
| Animation / video | MP4 + GIF + optional BGM, 25fps native or 60fps interpolated | 8–12 min |
| Infographic | Print-quality layout, CSS Grid, exports to PDF/PNG/SVG | 10 min |
| Design exploration | 3+ variations from different design schools, side-by-side comparison | 5–10 min |
| Design critique | 5-axis radar chart + Keep/Fix/Quick Wins action list | 3 min |

---

## Gallery

Every visual below was produced by yy-design itself — no external design tools involved.

### iOS Prototype

<p align="center"><img src="https://github.com/wangyiyang/yy-design/releases/download/v2.0/c1-ios-prototype-en.gif" width="100%"></p>

Pixel-accurate iPhone 15 Pro frame. State-driven navigation across multiple screens. Real images from Wikimedia/Unsplash. Playwright click-tests before delivery.

### Motion Design

<p align="center"><img src="https://github.com/wangyiyang/yy-design/releases/download/v2.0/c3-motion-design-en.gif" width="100%"></p>

Stage + Sprite timeline model. Four APIs (`useTime`, `useSprite`, `interpolate`, `Easing`) handle all animation. One command exports MP4 / GIF / 60fps / BGM-scored video.

### Slides → Editable PPTX

<p align="center"><img src="https://github.com/wangyiyang/yy-design/releases/download/v2.0/c2-slides-pptx-en.gif" width="100%"></p>

HTML decks for browser presentation. `html2pptx.js` translates DOM computed styles into PowerPoint objects — exports contain real text frames, not flattened images.

### Design Direction Advisor

<p align="center"><img src="https://github.com/wangyiyang/yy-design/releases/download/v2.0/w3-fallback-advisor-en.gif" width="100%"></p>

When the brief is vague: recommends 3 directions from 5 schools × 20 design philosophies, generates visual demos of each in parallel, lets you pick.

### Infographic

<p align="center"><img src="https://github.com/wangyiyang/yy-design/releases/download/v2.0/c5-infographic-en.gif" width="100%"></p>

Magazine-grade typography. CSS Grid layout. Real data. Exports to vector PDF, 300dpi PNG, or SVG.

### Expert Critique

<p align="center"><img src="https://github.com/wangyiyang/yy-design/releases/download/v2.0/c6-expert-review-en.gif" width="100%"></p>

Scores across 5 dimensions (philosophy · hierarchy · craft · function · innovation). Radar chart + actionable Keep/Fix/Quick Wins list.

---

## How It Works

Three mechanisms make the output consistently good:

**1. Brand Asset Protocol**

When your task involves a specific brand, the skill enforces a 5-step process: ask for existing guidelines → search official brand pages → download assets (with three fallback paths) → extract colors from real files (never from memory) → freeze everything into a `brand-spec.md`. This eliminates the #1 failure mode of AI design: guessing brand colors.

**2. Design Direction Advisor**

When requirements are vague, the skill doesn't guess — it enters advisor mode. Recommends 3 directions from different design schools, generates visual demos of each, and waits for you to choose before proceeding.

**3. Anti AI-Slop Rules**

Explicit bans on the visual clichés that make AI output obvious: purple gradients, emoji icons, rounded-corner cards with left-border accents, SVG illustrations of people, Inter as display type. Instead: `text-wrap: pretty`, CSS Grid, serif display faces, oklch color space.

---

## Star History

<p align="center">
  <a href="https://star-history.com/#wangyiyang/yy-design&Date">
    <img src="https://api.star-history.com/svg?repos=wangyiyang/yy-design&type=Date" alt="Star History" width="80%">
  </a>
</p>

---

## Repository Layout

```
yy-design/
├── SKILL.md                 # Agent-facing spec (Chinese)
├── README.md / README.zh.md # This file / Chinese version
├── assets/                  # Components, frames, BGM tracks, showcases
├── references/              # Deep-dive docs by task type
├── scripts/                 # Export toolchain (render, convert, music, TTS)
└── demos/                   # Capability demos with GIF/MP4/HTML
```

---

## Limitations

- No round-trip to Figma or Keynote for layer-level editing. Output is HTML-first.
- Complex 3D, physics, or particle animations are out of scope.
- Brand-from-zero (no assets provided) quality drops to ~60 points. The skill is designed to build on existing brand context.

---

## License

[MIT](LICENSE) since 2026-05-14. Use it however you want — personal, commercial, modified, redistributed. No restrictions.

---

## Author

**王翊仰 (Ian / YY)** · [@wangyiyang](https://github.com/wangyiyang) · [wangyiyang.cc](https://wangyiyang.cc) · wangyiyang.kk@gmail.com
</content>
</invoke>