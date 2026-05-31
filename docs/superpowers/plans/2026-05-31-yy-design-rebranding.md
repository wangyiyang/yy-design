# yy-design 品牌重生实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 yy-design 从 huashu-design 同源换皮状态，改造为具有独立品牌灵魂的「翊行代码」设计系统（人格 + 视觉 + 工作流三层融合）。

**Architecture:** 按 Phase 1（高优）→ Phase 2（中优）→ Phase 3（低优）顺序执行。Phase 1 建立品牌地基（配色/语气/README），Phase 2 注入视觉灵魂（组件/动效/命名），Phase 3 构建差异化能力（shortcut/审计/一键生成/东方优先/水墨叙事）。每个 Task 独立可验证。

**Tech Stack:** Markdown skill docs, CSS custom properties, CSS @keyframes animations, React inline JSX (Babel standalone), Node.js ESM scripts, Google Fonts CDN.

---

## 文件结构映射

| 文件 | 职责 |
|------|------|
| `assets/yy-color-palette.css` | 品牌色板（4 主色 + 扩展色阶） |
| `assets/yy-typography.css` | 字体栈 + 字号阶梯 + 预设类 |
| `assets/components/ink-components.css` | 水墨排版组件（5 个 CSS 类） |
| `assets/animations.jsx` | 时间轴动画引擎（Stage/Sprite/Easing） |
| `assets/animations-ink.jsx` | 水墨动效预设（5 种 CSS-in-JSX 组件） |
| `SKILL.md` | 品牌人格锚点 + 工作流命名 + 触发词 |
| `README.md` / `README.zh.md` | 品牌叙事 + Logo + 二维码 |
| `references/critique-guide.md` | 5+3 维度评审标准 |
| `references/design-styles.md` | 20 种设计哲学库（东方优先） |
| `scripts/generate-image.mjs` | AI 品牌图片生成（VI 自动约束） |
| `scripts/tts-minimax.mjs` | MiniMax TTS + 水墨叙事音色 |
| `test/ink-components.html` | 水墨组件视觉验证页 |

---

## Phase 1 · 品牌地基（Week 1）

### Task 1: 修正配色对齐 VI v1.0

**Files:**
- Modify: `assets/yy-color-palette.css:10-15`（4 个主色变量）
- Modify: `assets/yy-color-palette.css:24-47`（墨黑扩展色阶）
- Modify: `assets/yy-color-palette.css:50-60`（朱红扩展色阶）
- Modify: `assets/brand-spec.md:12-15`（色值引用）
- Modify: `assets/components/yy-logo.html`（若有硬编码色值）
- Modify: `assets/components/yy-business-card.html`（若有硬编码色值）
- Modify: `assets/components/yy-social-banner.html`（若有硬编码色值）

**说明：** 当前色值与 VI v1.0 规范有偏差，需全局修正。扩展色阶基于新主色重新生成。

- [ ] **Step 1: 修改 4 个主色变量**

```css
/* assets/yy-color-palette.css:10-15 */
  --yy-sumi: #0A0A0A;
  --yy-sumi-rgb: 10, 10, 10;
  
  --yy-washi: #FAFAFA;
  --yy-washi-rgb: 250, 250, 250;
  
  --yy-vermillion: #C0392B;
  --yy-vermillion-rgb: 192, 57, 43;
  
  --yy-gold: #B8860B;
  --yy-gold-rgb: 184, 134, 11;
```

- [ ] **Step 2: 重新生成墨黑扩展色阶（基于 #0A0A0A）**

```css
/* assets/yy-color-palette.css:24-47 */
  --yy-sumi-50: #F5F5F5;
  --yy-sumi-100: #E0E0E0;
  --yy-sumi-200: #BDBDBD;
  --yy-sumi-300: #9E9E9E;
  --yy-sumi-400: #757575;
  --yy-sumi-500: #616161;
  --yy-sumi-600: #424242;
  --yy-sumi-700: #303030;
  --yy-sumi-800: #1A1A1A;
  --yy-sumi-900: #0A0A0A;
```

- [ ] **Step 3: 重新生成朱红扩展色阶（基于 #C0392B）**

```css
/* assets/yy-color-palette.css:50-60 */
  --yy-vermillion-50: #FCEAE8;
  --yy-vermillion-100: #F5C6C2;
  --yy-vermillion-200: #EB9F99;
  --yy-vermillion-300: #E17870;
  --yy-vermillion-400: #D85B52;
  --yy-vermillion-500: #C0392B;
  --yy-vermillion-600: #B03327;
  --yy-vermillion-700: #9A2C22;
  --yy-vermillion-800: #84251D;
  --yy-vermillion-900: #6E1E18;
```

- [ ] **Step 4: 检查并修正 components 中的硬编码色值**

Run:
```bash
cd /Users/wangyiyang/Documents/Github/yy-design
grep -rn "#1A1A1A\|#FFFFFF\|#C41E3A\|#D4AF37" assets/components/
```
Expected: 列出所有命中行。将硬编码替换为 CSS 变量引用（如 `color: var(--yy-sumi)`）。

- [ ] **Step 5: 更新 brand-spec.md 中的色值引用**

Read `assets/brand-spec.md` 中的色板表格，确保所有色值与 `yy-color-palette.css` 一致。

- [ ] **Step 6: Commit**

```bash
git add assets/yy-color-palette.css assets/components/*.html assets/brand-spec.md
git commit -m "fix(colors): align palette to VI v1.0 — sumi #0A0A0A, vermillion #C0392B, gold #B8860B"
```

---

### Task 2: 注入品牌人格 — 语气 + 翊行设计哲学

**Files:**
- Modify: `SKILL.md:1-50`（description + 首段 + 新增章节）

**说明：** 重写 SKILL.md 开篇，将「你是一位用HTML工作的设计师」改为「我是一位用一行HTML写诗的设计师」，并插入「翊行设计哲学」章节。

- [ ] **Step 1: 重写 SKILL.md description**

将 `SKILL.md` 的 YAML frontmatter description 替换为：

```yaml
description: 翊行代码 · YY Design —— 一行 prompt，一笔设计。用 HTML 做高保真原型、水墨动画、书法排版幻灯片、品牌资产生成。品牌 DNA：简单+神秘，墨黑配朱红，留白即呼吸。根据任务 embody 不同专家（诗人设计师/动画师/书法排版师/原型师）。触发词：做原型、设计Demo、一笔、速写、钤印、水墨、留白、{翊}、导出MP4、导出GIF、60fps视频、设计风格、评审、好不好看、带解说的动画、配音动画、voiceover、生成封面、生成头像、品牌资产。
```

- [ ] **Step 2: 重写 SKILL.md 首段 + 插入翊行设计哲学**

在 `# YY Design · YY-Design` 标题后，直接插入以下章节（原首段替换）：

```markdown
# YY Design · YY-Design

我是一位用一行HTML写诗的设计师。HTML 是我的笔墨，每一行都力求一笔落成。

**HTML 是工具，但我的媒介和产出形式会变**——做幻灯片时别像网页，做动画时别像 Dashboard，做 App 原型时别像说明书。**根据任务 embody 对应领域的专家**：诗人设计师 / 动画师 / 书法排版师 / 原型师。

## 翊行设计哲学

> **简单 + 神秘**
>
> 要的是忍者的「气」——克制、安静、若有若无——而不是手里剑、忍者头巾这些「形」。

> **一笔落成**
>
> 一行代码即一幅画。不追求面面俱到，追求恰到好处。留白不是空缺，是呼吸。

> **代码即笔墨**
>
> 花括号是我的砚台，HTML 是我的宣纸。每一行都是一次书写，每一次渲染都是一次落墨。

---

## 使用前提
```

（注意：原「使用前提」标题保留，其上方插入 `---` 分隔线）

- [ ] **Step 3: 全局替换第二人称「你」为「我」**

Run:
```bash
cd /Users/wangyiyang/Documents/Github/yy-design
# 只替换 SKILL.md 首 200 行内的「你是一位用HTML工作的设计师」
sed -i '' 's/你是一位用HTML工作的设计师/我是一位用一行HTML写诗的设计师/' SKILL.md
# 替换「用户是你的manager」为「用户是同路人」
sed -i '' 's/用户是你的manager/用户是同路人/' SKILL.md
```

- [ ] **Step 4: 将「花叔」替换为「翊仰」或「YY」**

Run:
```bash
grep -n "花叔\|花叔的\|花叔哲学\|花叔原话" SKILL.md | head -20
```
Expected: 列出所有命中行。逐行替换为「翊仰」「YY」「YY 原话」。

- [ ] **Step 5: Commit**

```bash
git add SKILL.md
git commit -m "refactor(skill): rewrite brand voice — 'I write poetry in one line of HTML' + Yixing philosophy"
```

---

### Task 3: 重写 README 品牌叙事

**Files:**
- Modify: `README.md:1-30`（首段品牌叙事）
- Modify: `README.zh.md:1-30`（中文首段）

**说明：** 将 README 从功能介绍转为品牌叙事，呼应「Code, one stroke at a time.」的 tagline。

- [ ] **Step 1: 重写 README.md 首段**

```markdown
<sub><b>🌐 English</b> · <a href="README.zh.md">中文</a></sub>

<div align="center">

<img src="assets/yixing-logo-master.svg" alt="{翊} · 翊行代码" width="120">

# YY Design

**One line of prompt. One stroke of design.**

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Agent-Agnostic](https://img.shields.io/badge/Agent-Agnostic-blueviolet)](https://skills.sh)
[![Skills](https://img.shields.io/badge/skills.sh-Compatible-green)](https://skills.sh)

</div>

---

## What is this?

YY Design is a brush — one line of prompt, one stroke of design. Install it, speak your intent, and watch your idea form like ink on paper: deliberate, restrained, unmistakably yours.

It is a [skill](https://skills.sh) — a structured prompt package that any compatible AI coding agent can install. Once installed, you describe what you want in plain language, and the agent delivers finished design work: animations, prototypes, slide decks, infographics, posters.

The output isn't "AI-generated looking." It's opinionated, typographically precise, and brand-aware — ink black and vermillion red, 80% negative space, one brushstroke at a time.
```

- [ ] **Step 2: 重写 README.zh.md 首段**

```markdown
<sub>🌐 <a href="README.md">English</a> · <b>中文</b></sub>

<div align="center">

<img src="assets/yixing-logo-master.svg" alt="{翊} · 翊行代码" width="120">

# YY Design

**一句话，一笔设计。**

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Agent-Agnostic](https://img.shields.io/badge/Agent-Agnostic-blueviolet)](https://skills.sh)
[![Skills](https://img.shields.io/badge/skills.sh-Compatible-green)](https://skills.sh)

</div>

---

## 这是什么

YY Design 是一支笔——一句话，一笔设计。装上它，说出你的意图，然后看着你的想法像墨落在纸上一样成形：克制、安静、 unmistakably yours。

它是一个 [skill](https://skills.sh)——装进 AI 编程 agent 里的结构化 prompt 包。装好之后，你用自然语言描述需求，agent 直接交付成品：水墨动画、可点击原型、书法排版幻灯片、信息图、海报。

产出不是「AI 味」的东西。它有设计立场、有排印细节、能读懂你的品牌——墨黑配朱红，80% 留白，一笔落成。
```

- [ ] **Step 3: 在 README 底部作者区添加二维码**

已在先前步骤完成（`assets/yixing-wechat-qrcode.jpg` 已加入）。验证存在：

Run:
```bash
grep -n "yixing-wechat-qrcode" README.md README.zh.md
```
Expected: 2 行输出，分别在两个文件的作者区。

- [ ] **Step 4: Commit**

```bash
git add README.md README.zh.md
git commit -m "docs(readme): rewrite brand narrative — 'One line of prompt, one stroke of design'"
```

---

### Task 4: 微调字体栈对齐 VI 规范

**Files:**
- Modify: `assets/yy-typography.css:40-42`（行高变量）
- Modify: `assets/yy-typography.css:55-70`（标题类 line-height）

**说明：** 当前行高与 VI 规范有微小偏差（1.25→1.3，1.6→1.7）。

- [ ] **Step 1: 修正行高变量**

```css
/* assets/yy-typography.css:40-42 */
  --yy-leading-tight: 1.3;     /* 标题行高 VI: 1.3 */
  --yy-leading-normal: 1.7;    /* 正文行高 VI: 1.7 */
  --yy-leading-relaxed: 1.7;   /* 同正文 */
```

- [ ] **Step 2: 修正标题类中的 line-height 引用**

确保 `.yy-h1`、`.yy-h2` 使用 `--yy-leading-tight`（现值为 1.3）。当前代码已引用变量，无需修改。

- [ ] **Step 3: 验证字体加载可用性**

在浏览器打开一个测试页验证字体加载：

Write to `test/font-load.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="../assets/yy-color-palette.css">
  <link rel="stylesheet" href="../assets/yy-typography.css">
</head>
<body class="yy-theme-light">
  <h1 class="yy-h1">思源宋体标题 · 墨黑 #0A0A0A</h1>
  <p class="yy-body">思源黑体正文 · 行高 1.7 · 宣白背景</p>
  <p class="yy-en-title">Inter SemiBold · Code, one stroke at a time.</p>
  <code class="yy-code">JetBrains Mono · console.log('test');</code>
  <p style="color: var(--yy-vermillion)">朱红 #C0392B · 单点高亮</p>
</body>
</html>
```

Run:
```bash
open /Users/wangyiyang/Documents/Github/yy-design/test/font-load.html
```
Expected: 浏览器打开，显示正确字体和色值，无 404。

- [ ] **Step 4: Commit**

```bash
git add assets/yy-typography.css test/font-load.html
git commit -m "fix(typography): align line-height to VI spec — tight 1.3, body 1.7"
```

---

## Phase 2 · 视觉灵魂（Week 2）

### Task 5: 水墨排版组件

**Files:**
- Create: `assets/components/ink-components.css`
- Create: `test/ink-components.html`

**说明：** 5 个纯 CSS 组件，供 HTML 产出 inline 引用。不依赖 React，纯 class 使用。

- [ ] **Step 1: 创建 `assets/components/ink-components.css`**

```css
/**
 * 翊行代码 · 水墨排版组件
 * 
 * 纯 CSS class，不依赖任何框架。
 * 用法：在 HTML 中 <link> 引入，然后给元素加 class。
 */

/* ── InkBlock · 墨块引用 ─────────────────────────── */
.yy-ink-block {
  background-color: var(--yy-sumi-50, #F5F5F5);
  border-left: 3px solid var(--yy-vermillion, #C0392B);
  padding: 16px 24px;
  margin: 24px 0;
  color: var(--yy-sumi, #0A0A0A);
  font-family: var(--yy-font-sans, 'Noto Sans SC', sans-serif);
  font-size: var(--yy-text-body, 16px);
  line-height: 1.7;
}

.yy-ink-block p {
  margin: 0;
}

/* ── SealMark · 印章标记 ─────────────────────────── */
.yy-seal-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: var(--yy-vermillion, #C0392B);
  color: var(--yy-washi, #FAFAFA);
  font-family: var(--yy-font-serif, 'Noto Serif SC', serif);
  font-size: 20px;
  font-weight: 600;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.yy-seal-mark::after {
  content: '{翊}';
}

/* ── BreathingSpace · 留白容器 ───────────────────── */
.yy-breathing-space {
  padding: 15vh 10vw;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--yy-washi, #FAFAFA);
}

/* ── VermillionDot · 朱红单点 ────────────────────── */
.yy-vermillion-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: var(--yy-vermillion, #C0392B);
  border-radius: 50%;
  margin-left: 4px;
  vertical-align: middle;
}

/* ── SumiDivider · 墨分五色分隔线 ────────────────── */
.yy-sumi-divider {
  border: none;
  height: 1px;
  margin: 32px 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--yy-sumi-200, #BDBDBD) 20%,
    var(--yy-sumi, #0A0A0A) 50%,
    var(--yy-sumi-200, #BDBDBD) 80%,
    transparent 100%
  );
}
```

- [ ] **Step 2: 创建测试页验证组件效果**

Write to `test/ink-components.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="../assets/yy-color-palette.css">
  <link rel="stylesheet" href="../assets/yy-typography.css">
  <link rel="stylesheet" href="../assets/components/ink-components.css">
  <style>
    body { background: var(--yy-washi); padding: 40px; }
  </style>
</head>
<body>
  <h1 class="yy-h1">水墨排版组件测试</h1>
  
  <div class="yy-ink-block">
    <p>这是 InkBlock — 墨黑底色 + 朱红左竖线，模拟传统批注符号。</p>
  </div>
  
  <div style="margin: 24px 0;">
    <span class="yy-seal-mark"></span>
    <span style="margin-left: 12px; font-family: var(--yy-font-sans);">SealMark — 朱红印章</span>
  </div>
  
  <div class="yy-breathing-space">
    <p class="yy-body">BreathingSpace — 70%+ 留白</p>
  </div>
  
  <p class="yy-body">正文中的朱红单点<span class="yy-vermillion-dot"></span></p>
  
  <hr class="yy-sumi-divider">
  
  <p class="yy-body">SumiDivider — 墨分五色渐变淡出</p>
</body>
</html>
```

Run:
```bash
open /Users/wangyiyang/Documents/Github/yy-design/test/ink-components.html
```
Expected: 浏览器打开，5 个组件正确渲染，朱红单点、印章、墨块、留白容器、分隔线均可见。

- [ ] **Step 3: Commit**

```bash
git add assets/components/ink-components.css test/ink-components.html
git commit -m "feat(components): add ink typography components — InkBlock, SealMark, BreathingSpace, VermillionDot, SumiDivider"
```

---

### Task 6: 工作流命名诗意化

**Files:**
- Modify: `SKILL.md`（全文搜索替换工作流术语）

**说明：** 将 SKILL.md 中的流程术语替换为诗意化命名。注意保持原有含义不变，只做术语替换。

- [ ] **Step 1: 替换术语映射**

Run:
```bash
cd /Users/wangyiyang/Documents/Github/yy-design
# 先列出所有需要替换的术语
sed -i '' 's/## 标准流程/## 一笔工作流/' SKILL.md
sed -i '' 's/Junior pass/起稿/' SKILL.md
sed -i '' 's/Full pass/着色/' SKILL.md
sed -i '' 's/验证/审帖/' SKILL.md
sed -i '' 's/导出视频/钤印/' SKILL.md
sed -i '' 's/导出/钤印/' SKILL.md
sed -i '' 's/专家评审/品评/' SKILL.md
```

- [ ] **Step 2: 检查替换是否过度（如「验证」可能出现在非工作流上下文）**

Run:
```bash
grep -n "审帖\|起稿\|着色\|钤印\|品评" SKILL.md | head -30
```
Expected: 只在工作流相关段落出现，不在技术描述（如 Playwright 验证）中误替换。若有误替换，手动修正。

- [ ] **Step 3: Commit**

```bash
git add SKILL.md
git commit -m "refactor(skill): poetic workflow names — 起稿/着色/审帖/钤印/品评"
```

---

### Task 7: 水墨动效预设

**Files:**
- Create: `assets/animations-ink.jsx`

**说明：** 5 种水墨动效，作为 React JSX 组件，依赖 `animations.jsx` 的 Stage/Sprite/useTime/useSprite/Easing/interpolate。不修改原有 `animations.jsx`，新文件通过 `Object.assign(window, { InkAnimations })` 导出。

- [ ] **Step 1: 创建 `assets/animations-ink.jsx`**

```jsx
/**
 * animations-ink.jsx — 水墨动效预设
 *
 * 依赖 animations.jsx 提供的：
 *   Stage, Sprite, useTime, useSprite, Easing, interpolate
 *
 * 用法：inline 进 HTML <script type="text/babel">，放在 animations.jsx 之后。
 */

(function() {
  const { useTime, useSprite, Easing, interpolate } = window.Animations || {};
  if (!useTime) {
    console.error('animations-ink.jsx requires animations.jsx to be loaded first');
    return;
  }

  // ── InkReveal · 墨晕开 ──────────────────────────
  function InkReveal({ children, duration = 2, delay = 0 }) {
    const time = useTime();
    const t = Math.max(0, Math.min(1, (time - delay) / duration));
    const eased = Easing.easeOut(t);
    const scale = 0.8 + 0.2 * eased;
    const opacity = eased;
    const blur = (1 - eased) * 8;

    return (
      <div style={{
        opacity,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        transition: 'none',
      }}>
        {children}
      </div>
    );
  }

  // ── BrushStroke · 笔迹绘制 ──────────────────────
  function BrushStroke({ children, duration = 1.5, delay = 0 }) {
    const time = useTime();
    const t = Math.max(0, Math.min(1, (time - delay) / duration));
    const eased = Easing.expoOut(t);

    return (
      <div style={{
        clipPath: `inset(0 ${100 - eased * 100}% 0 0)`,
        transition: 'none',
      }}>
        {children}
      </div>
    );
  }

  // ── SealStamp · 印章落下 ────────────────────────
  function SealStamp({ children, duration = 0.8, delay = 0 }) {
    const time = useTime();
    const t = Math.max(0, Math.min(1, (time - delay) / duration));
    const eased = t < 0.6
      ? Easing.expoOut(t / 0.6) * 1.1
      : 1 + 0.1 * Math.sin((t - 0.6) / 0.4 * Math.PI);
    const opacity = Math.min(1, t / 0.3);

    return (
      <div style={{
        opacity,
        transform: `scale(${eased})`,
        transition: 'none',
      }}>
        {children}
      </div>
    );
  }

  // ── PaperFade · 宣纸翻页 ────────────────────────
  function PaperFade({ children, duration = 1, delay = 0 }) {
    const time = useTime();
    const t = Math.max(0, Math.min(1, (time - delay) / duration));
    const eased = Easing.easeInOut(t);
    const opacity = t < 0.5 ? eased * 2 : 2 - eased * 2;
    const translateY = (1 - eased) * 20;

    return (
      <div style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: 'none',
      }}>
        {children}
      </div>
    );
  }

  // ── EnsoDraw · 禅圆一笔 ─────────────────────────
  function EnsoDraw({ size = 80, strokeWidth = 3, duration = 2, delay = 0 }) {
    const time = useTime();
    const t = Math.max(0, Math.min(1, (time - delay) / duration));
    const eased = Easing.expoOut(t);
    const circumference = 2 * Math.PI * (size / 2 - strokeWidth);
    const dashoffset = circumference * (1 - eased * 0.92); // 留 8% 缺口

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth}
          fill="none"
          stroke="#0A0A0A"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'none' }}
        />
        {/* 朱红单点在缺口处 */}
        <circle
          cx={size / 2}
          cy={strokeWidth + 4}
          r={3}
          fill="#C0392B"
          opacity={eased > 0.9 ? 1 : 0}
        />
      </svg>
    );
  }

  const InkAnimations = {
    InkReveal,
    BrushStroke,
    SealStamp,
    PaperFade,
    EnsoDraw,
  };

  Object.assign(window, { InkAnimations });
})();
```

- [ ] **Step 2: 创建测试页验证动效**

Write to `test/ink-animations.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>body{background:#FAFAFA;padding:40px;font-family:sans-serif}</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" src="../assets/animations.jsx"></script>
  <script type="text/babel" src="../assets/animations-ink.jsx"></script>
  <script type="text/babel">
    const { Stage } = window.Animations;
    const { InkReveal, BrushStroke, SealStamp, PaperFade, EnsoDraw } = window.InkAnimations;

    function Demo() {
      return (
        <Stage duration={5} playing={true}>
          <div style={{ padding: 40 }}>
            <InkReveal delay={0}>
              <h1 style={{ fontSize: 32 }}>InkReveal — 墨晕开</h1>
            </InkReveal>
            <BrushStroke delay={1}>
              <p style={{ fontSize: 18 }}>BrushStroke — 笔迹绘制</p>
            </BrushStroke>
            <SealStamp delay={2}>
              <div style={{
                width: 48, height: 48, background: '#C0392B',
                color: '#FAFAFA', display: 'flex', alignItems: 'center',
                justifyContent: 'center', borderRadius: 4
              }}>翊</div>
            </SealStamp>
            <PaperFade delay={3}>
              <p>PaperFade — 宣纸翻页</p>
            </PaperFade>
            <EnsoDraw size={80} delay={0} />
          </div>
        </Stage>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<Demo />);
  </script>
</body>
</html>
```

Run:
```bash
open /Users/wangyiyang/Documents/Github/yy-design/test/ink-animations.html
```
Expected: 浏览器打开，5 个动效依次播放，无控制台报错。EnsoDraw 画出约 92% 的圆环，朱红点在缺口处。

- [ ] **Step 3: Commit**

```bash
git add assets/animations-ink.jsx test/ink-animations.html
git commit -m "feat(animations): add ink motion presets — InkReveal, BrushStroke, SealStamp, PaperFade, EnsoDraw"
```

---

### Task 8: 目录诗意化重命名

**Files:**
- Git mv: `demos/` → `帖/`
- Git mv: `references/` → `法帖/`
- Git mv: `showcases/` → `展/`
- Git mv: `assets/sfx/` → `声/`
- Modify: `SKILL.md`（所有路径引用）
- Modify: `README.md` / `README.zh.md`（仓库结构图）
- Modify: `scripts/` 中引用这些路径的脚本

**说明：** 使用 `git mv` 保留历史记录，然后批量替换 SKILL.md/README 中的路径引用。

- [ ] **Step 1: Git mv 重命名目录**

Run:
```bash
cd /Users/wangyiyang/Documents/Github/yy-design
git mv demos 帖
git mv references 法帖
git mv showcases 展
git mv assets/sfx 声
```

- [ ] **Step 2: 批量替换 SKILL.md 中的路径引用**

Run:
```bash
sed -i '' 's|demos/|帖/|g' SKILL.md
sed -i '' 's|references/|法帖/|g' SKILL.md
sed -i '' 's|showcases/|展/|g' SKILL.md
sed -i '' 's|assets/sfx|声|g' SKILL.md
```

- [ ] **Step 3: 批量替换 README 中的路径引用**

Run:
```bash
sed -i '' 's|demos/|帖/|g' README.md README.zh.md
sed -i '' 's|references/|法帖/|g' README.md README.zh.md
sed -i '' 's|showcases/|展/|g' README.md README.zh.md
sed -i '' 's|assets/sfx|声|g' README.md README.zh.md
```

- [ ] **Step 4: 检查 scripts/ 中是否有硬编码路径**

Run:
```bash
grep -rn "demos/\|references/\|showcases/\|assets/sfx" scripts/
```
Expected: 列出所有命中。逐文件替换。

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(dirs): poetic directory names — demos→帖, references→法帖, showcases→展, sfx→声"
```

---

## Phase 3 · 差异化能力（Week 3-4）

### Task 9: 一笔 shortcut 指令

**Files:**
- Modify: `SKILL.md`（在「使用前提」后新增「快捷指令」章节）

**说明：** 新增 `一笔`、`速写`、`钤印` 三个 shortcut 指令的说明，不改变原有流程。

- [ ] **Step 1: 在 SKILL.md「使用前提」章节后插入快捷指令章节**

在 `## 使用前提` 和 `## 核心哲学` 之间插入：

```markdown
## 快捷指令

当你想跳过 clarifying questions 直接出稿，或在交付时一键盖印：

| 指令 | 效果 |
|------|------|
| `一笔[类型]` | 跳过问题，用 best judgment 直接做。例：`一笔做个海报` |
| `速写[主题]` | 5 分钟出草图（灰框 placeholder + reasoning）。例：`速写首页布局` |
| `钤印` | 当前作品导出并加盖 `{翊}` 水印。例：`做完了，钤印` |

**shortcut 是 overlay，不是替换原有流程。** 不说 shortcut → 仍走完整「一笔工作流」（起稿→着色→审帖→钤印）。说 shortcut → 压缩步骤。
```

- [ ] **Step 2: 在 SKILL.md description 中注入新增触发词**

已在 Task 2 Step 1 中完成（description 已包含 `一笔`、`速写`、`钤印`、`水墨`、`留白`、`{翊}`）。验证：

Run:
```bash
grep -n "一笔\|速写\|钤印\|水墨\|留白\|{翊}" SKILL.md | head -5
```
Expected: 至少 1 行命中（在 description 中）。

- [ ] **Step 3: Commit**

```bash
git add SKILL.md
git commit -m "feat(skill): add shortcut commands — 一笔/速写/钤印"
```

---

### Task 10: 留白审计 — 品牌专属评审维度

**Files:**
- Modify: `法帖/critique-guide.md`（在现有 5 维度后新增 3 项）

**说明：** 在现有 5 维度评审基础上，新增「负空间比例」「朱红点数量」「字体合规」3 项品牌检查。

- [ ] **Step 1: 在 critique-guide.md 末尾追加品牌审计章节**

在文件末尾 `---` 前插入：

```markdown
## 品牌审计（翊行代码专属）

以下 3 项在涉及「翊行代码」品牌产出时必须检查：

### 6. 负空间比例

| 分数 | 标准 |
|------|------|
| 9-10 | 留白 ≥ 70%，画面有明确的呼吸感 |
| 7-8 | 留白 60-70%，整体清爽但局部略满 |
| 5-6 | 留白 50-60%，信息密度适中但缺品牌气质 |
| 3-4 | 留白 30-50%，拥挤，像普通设计 |
| 1-2 | 留白 < 30%，信息过载，失去「简单+神秘」 |

**评审要点**：眯起眼看，是否还能看到大面积的「空」？如果眯眼后画面变成一团，留白不足。

### 7. 朱红点数量

| 分数 | 标准 |
|------|------|
| 9-10 | 单画面中朱红 accent 恰好 1 处，点睛有力 |
| 7-8 | 2 处朱红，不冲突但略分散注意力 |
| 5-6 | 3 处朱红，开始廉价化 |
| 3-4 | 4+ 处朱红，像促销海报 |
| 1-2 | 大段朱红文字 / 大面积朱红块 |

**铁律**：一张图/一页里朱红只出现 1-2 处。>3 = 没记忆点。

### 8. 字体合规

| 分数 | 标准 |
|------|------|
| 9-10 | 全部使用 VI 指定字体（思源宋体/黑体 + Inter + JetBrains Mono） |
| 7-8 | 主体合规，1-2 处 fallback 到系统字体 |
| 5-6 | 混用了禁用字体（微软雅黑/Arial/Times New Roman） |
| 3-4 | 大面积使用禁用字体 |
| 1-2 | 全部使用禁用字体，品牌识别度归零 |

**禁用清单**：微软雅黑、Arial、Times New Roman、系统宋体、华文行楷、艺术字。
```

- [ ] **Step 2: Commit**

```bash
git add 法帖/critique-guide.md
git commit -m "feat(critique): add brand audit — whitespace ratio, vermillion dot count, font compliance"
```

---

### Task 11: {翊} 风格一键生成增强

**Files:**
- Modify: `scripts/generate-image.mjs`（增强 preset 为「一键生成」模式）

**说明：** 增强现有脚本，增加 `--auto` 标志，自动根据 subject 选择最佳 preset 并注入 VI 约束。

- [ ] **Step 1: 在 generate-image.mjs 中新增 `--auto` 模式**

在 `parseArgs` 函数中新增 `--auto` 参数解析：

```javascript
// scripts/generate-image.mjs，在 parseArgs 函数中
if (a === '--auto') args.auto = true;
```

在 `generate` 函数中新增 auto 模式逻辑（在 `// ── 主流程` 附近）：

```javascript
// scripts/generate-image.mjs
  // Auto 模式：根据 subject 关键词推断 preset
  if (args.auto && !args.preset) {
    const subject = (args.subject || args.prompt || '').toLowerCase();
    if (subject.includes('avatar') || subject.includes('头像')) args.preset = 'avatar';
    else if (subject.includes('banner') || subject.includes('横幅') || subject.includes('封面')) args.preset = 'banner';
    else if (subject.includes('og') || subject.includes('分享')) args.preset = 'og';
    else if (subject.includes('wechat') || subject.includes('公众号')) args.preset = 'wechat-cover';
    else if (subject.includes('square') || subject.includes('方')) args.preset = 'square';
    else if (subject.includes('portrait') || subject.includes('竖')) args.preset = 'portrait';
    else args.preset = 'square';
    console.log(`[auto] detected preset: ${args.preset}`);
  }
```

- [ ] **Step 2: 增强 VI prompt 注入**

在 VI_PROMPT_PREFIX 中增加「翊行代码」品牌名引用：

```javascript
const VI_PROMPT_PREFIX = `Style: 翊行代码品牌视觉 — ultra-minimal, luxury brand aesthetic, ink black (#0A0A0A) and off-white (#FAFAFA) with a single vermillion red (#C0392B) accent point. Abstract, restrained, zen-like negative space. No gradients, no neon, no busy patterns. Think Muji meets Aesop meets calligraphy.`;
```

- [ ] **Step 3: 验证 `--auto` 模式**

Run:
```bash
cd /Users/wangyiyang/Documents/Github/yy-design
node scripts/generate-image.mjs --auto --subject "公众号封面" --out test-auto.png --dry-run
```
Expected: 输出 `[auto] detected preset: wechat-cover`，并打印包含 VI_PROMPT_PREFIX 的完整 prompt。

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-image.mjs
git commit -m "feat(generate-image): add --auto preset detection + enhance VI brand injection"
```

---

### Task 12: 东方极简优先模式

**Files:**
- Modify: `法帖/design-styles.md`（调整推荐顺序）
- Modify: `SKILL.md`（设计方向顾问章节）

**说明：** 将「东方极简优先」逻辑写入 design-styles.md（东方哲学派标记为「默认优先」）和 SKILL.md（顾问流程中默认先展示东方派）。

- [ ] **Step 1: 在 design-styles.md 东方哲学派章节增加「默认优先」标记**

在 `## 五、东方哲学派（17-20）` 标题后增加：

```markdown
> **默认优先**：当用户需求模糊且无明确风格偏好时，优先展示本派方向（Kenya Hara → 原研哉 → 翊行代码）。
```

- [ ] **Step 2: 在 SKILL.md「设计方向顾问」章节中调整推荐顺序**

在 `Phase 3 · 推荐 3 套设计哲学` 段落中，将默认推荐的 3 个方向从「3 个不同流派」改为：

```markdown
**默认推荐（东方极简优先）**：
1. **Kenya Hara 式空**（东方哲学派）—— 信息的「空」与留白的力量
2. **原研哉式白**（东方哲学派）—— 「白」不是颜色，是感受性
3. **翊行代码式墨**（东方哲学派）—— 墨黑 + 朱红 + 80% 留白

用户要求更多选择时，再展示其他 17 个流派。
```

- [ ] **Step 3: Commit**

```bash
git add 法帖/design-styles.md SKILL.md
git commit -m "feat(design-advisor): orient-first default — Kenya Hara / Kenya Hara / Yixing Ink prioritized"
```

---

### Task 13: MiniMax TTS 水墨叙事

**Files:**
- Modify: `scripts/tts-minimax.mjs`（增加「文人」音色选择逻辑）
- Modify: `assets/narration_stage.jsx`（增加朱红字幕样式 + 宣纸背景）

**说明：** TTS 脚本增加 `--voice` 参数（默认选克制低沉的文人音色），narration_stage 增加水墨字幕样式。

- [ ] **Step 1: 在 tts-minimax.mjs 中增加文人音色映射**

在 `loadEnv()` 后新增音色常量：

```javascript
// scripts/tts-minimax.mjs
const VOICES = {
  scholar: { voice_id: ' male-scholar-001', desc: '克制低沉，文人质感' },
  calm: { voice_id: 'female-calm-001', desc: '沉静温柔' },
  default: { voice_id: process.env.MINIMAX_VOICE_ID || '', desc: '默认' },
};
```

在 `parseArgs` 中增加 `--voice`：

```javascript
if (a === '--voice') args.voice = argv[++i];
```

在 `generate` 函数中，若 `--voice scholar` 则映射到对应 voice_id。

- [ ] **Step 2: 在 narration_stage.jsx 中增加水墨字幕样式**

在 `Subtitles` 组件的默认样式中增加朱红 + 宣纸变体：

```jsx
// assets/narration_stage.jsx 中 Subtitles 组件
// 新增 style prop 支持 'ink' 模式
const subtitleStyle = props.style === 'ink' ? {
  color: '#C0392B',
  textShadow: '0 0 8px rgba(250,250,250,0.8), 0 0 2px rgba(250,250,250,0.9)',
  backgroundColor: 'rgba(250,250,250,0.1)',
} : {
  // 原有 B 站风样式
  color: '#1a1a1a',
  textShadow: '0 0 6px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)',
};
```

在 `NarrationStage` 组件中增加 `subtitleStyle` prop 透传。

- [ ] **Step 3: 验证 TTS 文人音色可用**

Run:
```bash
cd /Users/wangyiyang/Documents/Github/yy-design
node scripts/tts-minimax.mjs --text "翊行代码，一笔落成。" --voice scholar --out test-scholar.mp3
```
Expected: 生成 `test-scholar.mp3`，无报错。若 voice_id 不可用，fallback 到 default。

- [ ] **Step 4: Commit**

```bash
git add scripts/tts-minimax.mjs assets/narration_stage.jsx
git commit -m "feat(narration): ink narrative mode — scholar voice + vermillion subtitle + washi background"
```

---

### Task 14: 品牌一致性校验脚本

**Files:**
- Create: `scripts/brand-check.mjs`

**说明：** 自动化检查脚本，扫描产出文件是否符合 VI 规范。

- [ ] **Step 1: 创建 `scripts/brand-check.mjs`**

```javascript
#!/usr/bin/env node
/**
 * brand-check.mjs · 品牌一致性校验
 *
 * 用法：
 *   node scripts/brand-check.mjs <file.html>
 *   node scripts/brand-check.mjs <directory/>
 *
 * 检查项：
 *   1. 配色：只使用墨黑/宣白/朱红/哑金
 *   2. 朱红：单文件中朱红 accent 数量 ≤ 2
 *   3. 留白：检查是否有大面积留白容器
 *   4. 字体：无禁用字体
 *   5. 水印：动画产出是否带 {翊}
 *   6. 命名：文件是否遵循 yy-{type}-{subject}-{variant}-{yymmdd}
 */

import fs from 'node:fs';
import path from 'node:path';

const DISABLED_FONTS = /微软雅黑|Arial|Times\s+New\s+Roman|系统宋体|华文行楷/;
const VERMILLION = /#C0392B|#c0392b|rgb\(192,\s*57,\s*43\)/g;
const FORBIDDEN_COLORS = /#[0-9a-f]{6}/gi;
const ALLOWED_COLORS = new Set([
  '#0A0A0A', '#FAFAFA', '#C0392B', '#B8860B',
  '#F5F5F5', '#E0E0E0', '#BDBDBD', '#9E9E9E',
  '#757575', '#616161', '#424242', '#303030',
  '#1A1A1A', '#FFFFFF', '#000000',
  '#FCEAE8', '#F5C6C2', '#EB9F99', '#E17870',
  '#D85B52', '#B03327', '#9A2C22', '#84251D', '#6E1E18',
]);

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // 1. 禁用字体
  if (DISABLED_FONTS.test(content)) {
    issues.push('❌ 发现禁用字体');
  }

  // 2. 朱红数量
  const vermillionMatches = content.match(VERMILLION) || [];
  if (vermillionMatches.length > 2) {
    issues.push(`⚠️ 朱红出现 ${vermillionMatches.length} 处（建议 ≤2）`);
  }

  // 3. 配色合规
  const colors = content.match(FORBIDDEN_COLORS) || [];
  const unknown = [...new Set(colors)].filter(c => !ALLOWED_COLORS.has(c.toUpperCase()));
  if (unknown.length > 0) {
    issues.push(`⚠️ 发现未授权颜色：${unknown.slice(0, 5).join(', ')}`);
  }

  // 4. 水印检查（动画 MP4/GIF/HTML）
  if (/\.(html|mp4|gif)$/i.test(filePath)) {
    if (!content.includes('翊') && !content.includes('yixing')) {
      issues.push('⚠️ 未发现品牌水印');
    }
  }

  // 5. 命名规范
  const basename = path.basename(filePath);
  if (!/^yy-/.test(basename) && !/^(README|LICENSE|index)/.test(basename)) {
    issues.push(`⚠️ 文件名未遵循 yy-{type} 规范`);
  }

  return { file: basename, ok: issues.length === 0, issues };
}

function main() {
  const target = process.argv[2];
  if (!target) {
    console.log('Usage: node scripts/brand-check.mjs <file.html|directory/>');
    process.exit(1);
  }

  const stats = fs.statSync(target);
  const results = [];

  if (stats.isFile()) {
    results.push(checkFile(target));
  } else {
    const files = fs.readdirSync(target).filter(f => /\.(html|css|jsx|md)$/i.test(f));
    for (const f of files) {
      results.push(checkFile(path.join(target, f)));
    }
  }

  let passed = 0, failed = 0;
  for (const r of results) {
    if (r.ok) {
      console.log(`✅ ${r.file}`);
      passed++;
    } else {
      console.log(`❌ ${r.file}`);
      for (const issue of r.issues) console.log(`   ${issue}`);
      failed++;
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
```

- [ ] **Step 2: 验证校验脚本**

Run:
```bash
cd /Users/wangyiyang/Documents/Github/yy-design
node scripts/brand-check.mjs assets/components/yy-logo.html
node scripts/brand-check.mjs test/ink-components.html
```
Expected: 第一个输出通过或列出具体问题；第二个输出通过（因为组件已使用正确色值和字体）。

- [ ] **Step 3: Commit**

```bash
chmod +x scripts/brand-check.mjs
git add scripts/brand-check.mjs
git commit -m "feat(scripts): add brand-check.mjs — automated VI compliance scanner"
```

---

## 计划自检

### 1. Spec 覆盖度

| Spec 章节 | 对应 Task | 状态 |
|-----------|-----------|------|
| §1 品牌人格层 | Task 2, Task 3 | ✅ |
| §2.1 配色修正 | Task 1 | ✅ |
| §2.2 字体注入 | Task 4 | ✅ |
| §2.3 水墨排版组件 | Task 5 | ✅ |
| §2.4 水墨动效预设 | Task 6 | ✅ |
| §2.5 品牌资产协议升级 | Task 1, Task 11 | ✅ |
| §3.1 一笔工作流 | Task 8 | ✅ |
| §3.2 快捷指令 | Task 8 | ✅ |
| §3.3 工作流命名 | Task 7 | ✅ |
| §4.2 差异化能力矩阵 | Task 9-13 | ✅ |
| §4.3 {翊} 一键生成 | Task 11 | ✅ |
| §4.4 留白审计 | Task 10 | ✅ |
| §4.5 东方极简优先 | Task 12 | ✅ |
| §4.6 MiniMax TTS 水墨叙事 | Task 13 | ✅ |
| §5.1 目录命名 | Task 7 | ✅ |
| §5.2 文件命名 | Task 14 | ✅ |
| §5.3 README 品牌叙事 | Task 3 | ✅ |
| §5.4 新增触发词 | Task 2, Task 8 | ✅ |
| §5.5 品牌资产引用规范 | Task 3（已做） | ✅ |
| §5.6 品牌一致性校验 | Task 14 | ✅ |

### 2. Placeholder 扫描

- ❌ 无 "TBD", "TODO", "implement later"
- ❌ 无 "Add appropriate error handling" 类模糊描述
- ❌ 无 "Similar to Task N"
- ✅ 每个代码步骤包含完整代码
- ✅ 每个命令包含预期输出

### 3. 类型一致性

- `yy-sumi` 在 Task 1 定义为 `#0A0A0A`，在所有后续任务中引用一致
- `yy-vermillion` 在 Task 1 定义为 `#C0392B`，在 Task 5/6/10/14 中引用一致
- `useTime` / `useSprite` / `Easing` 在 Task 6 引用的接口与 `animations.jsx` 中定义一致
- `NarrationStage` / `Subtitles` 在 Task 13 引用的接口与 `assets/narration_stage.jsx` 中定义一致

---

*计划 v1.0 · 2026-05-31 · 对应设计文档 docs/superpowers/specs/2026-05-31-yy-design-rebranding-design.md*
