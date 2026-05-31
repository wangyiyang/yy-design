# yy-wechat-render Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `scripts/yy-wechat-render.mjs` — a CLI tool that converts Markdown to inline-styled HTML matching YY Design VI, with copy-to-clipboard support, mermaid SVG rendering, and iron-rule linting.

**Architecture:** Single CLI file (~450 lines) using `marked` custom renderer to emit inline-style HTML, post-process for external links and footers, lint pass for VI compliance, and generate a companion `copy.html` with auto-copy script. Mermaid blocks are server-side rendered to inline SVG via `jsdom`.

**Tech Stack:** Node.js ESM, `marked`, `mermaid`, `jsdom`, Node.js built-in `test` runner

---

## File Structure

| File | Responsibility |
|------|---------------|
| `scripts/yy-wechat-render.mjs` | CLI entry + arg parser + pipeline orchestrator + VI constants |
| `scripts/lib/vi-renderer.mjs` | Marked custom renderer — maps every MD node to inline-style HTML |
| `scripts/lib/post-process.mjs` | External-link → footnotes, footer/author-card injection, root `<section>` wrapper |
| `scripts/lib/linter.mjs` | Iron-rule validator — scans final HTML, produces warnings array |
| `scripts/lib/copy-html.mjs` | Generates `*-copy.html` with auto-copy-to-clipboard script |
| `scripts/lib/svg-render.mjs` | Mermaid server-side rendering to inline SVG via jsdom |
| `test/yy-wechat-render.test.mjs` | Node.js built-in test suite |
| `test/fixtures/sample.md` | Sample Markdown for integration testing |
| `package.json` | Project manifest with ESM type and dependencies |

---

## Task 1: Initialize Project & Dependencies

**Files:**
- Create: `package.json`
- Create: `test/fixtures/sample.md`

**Context:** This project has no `package.json`. We need one for dependency management and ESM support.

- [ ] **Step 1: Create package.json**

```json
{
  "name": "yy-wechat-render",
  "version": "1.0.0",
  "type": "module",
  "description": "Render Markdown to inline-styled HTML for WeChat articles",
  "scripts": {
    "test": "node --test test/*.test.mjs"
  },
  "dependencies": {
    "marked": "^15.0.0",
    "mermaid": "^11.0.0",
    "jsdom": "^26.0.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:
```bash
cd /Users/wangyiyang/Documents/Github/yy-design && npm install
```

Expected: `node_modules/` created with `marked`, `mermaid`, `jsdom`

- [ ] **Step 3: Create test fixture**

Create `test/fixtures/sample.md`:
```markdown
# 测试文章

这是正文段落，包含**加粗文字**和*斜体*。

## 小标题示例

> 这是一段引用文字。

- 列表项一
- 列表项二

```
const x = 1;
console.log(x);
```

[翊行代码](https://wangyiyang.cc)
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json test/fixtures/sample.md
git commit -m "chore: init yy-wechat-render with dependencies"
```

---

## Task 2: VI Constants & CLI Argument Parser

**Files:**
- Create: `scripts/yy-wechat-render.mjs`

- [ ] **Step 1: Write VI constants and parseArgs**

Create `scripts/yy-wechat-render.mjs`:
```javascript
#!/usr/bin/env node
/**
 * yy-wechat-render.mjs · Markdown → 内联样式 HTML（公众号富文本）
 *
 * 用法：
 *   node scripts/yy-wechat-render.mjs --md article.md --out article.html
 *   node scripts/yy-wechat-render.mjs --md article.md --out-dir output/
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ── VI 常量 ─────────────────────────────────────────────────────────
export const VI = {
  colors: {
    sumiBlack: '#0A0A0A',
    washiWhite: '#FAFAFA',
    vermillion: '#C0392B',
    mutedGold: '#B8860B',
  },
  fonts: {
    serif: "'Source Han Serif SC','Songti SC',serif",
    sans: "'Source Han Sans SC','PingFang SC',sans-serif",
    mono: "'JetBrains Mono','SF Mono',monospace",
  },
  sizes: {
    h1: '32px', h2: '24px', h3: '20px',
    body: '16px', small: '14px', caption: '12px',
  },
  lineHeights: {
    body: 1.8, heading: 1.3, code: 1.5,
  },
};

export const ALLOWED_COLORS = new Set([
  '#0A0A0A', '#FAFAFA', '#C0392B', '#B8860B',
  '#FFFFFF', '#000000',
  ...generateAlphaVariants('#0A0A0A'),
  ...generateAlphaVariants('#C0392B'),
]);

function generateAlphaVariants(hex) {
  const variants = [];
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  for (const a of [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]) {
    variants.push(`rgba(${r},${g},${b},${a})`);
  }
  return variants;
}

// ── CLI 参数解析 ────────────────────────────────────────────────────
export function parseArgs(argv) {
  const args = { includeFooter: true, includeAuthorCard: true };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--md') args.md = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--out-dir') args.outDir = argv[++i];
    else if (a === '--title') args.title = argv[++i];
    else if (a === '--subtitle') args.subtitle = argv[++i];
    else if (a === '--theme') args.theme = argv[++i];
    else if (a === '--date') args.date = argv[++i];
    else if (a === '--no-footer') args.includeFooter = false;
    else if (a === '--no-author-card') args.includeAuthorCard = false;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

export function usage() {
  console.error(`
yy-wechat-render.mjs · Markdown → 公众号内联样式 HTML

  --md <path>         输入 Markdown 文件（必填）
  --out <path>        输出 HTML 文件路径
  --out-dir <dir>     输出目录（默认 output/）
  --title <text>      覆盖文章标题
  --subtitle <text>   副标题
  --theme <name>      主题标签
  --date <yymmdd>     日期
  --no-footer         不输出文末签
  --no-author-card    不输出作者卡
`.trim());
  process.exit(1);
}
```

- [ ] **Step 2: Write test for parseArgs**

Create `test/yy-wechat-render.test.mjs`:
```javascript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseArgs, VI, ALLOWED_COLORS } from '../scripts/yy-wechat-render.mjs';

describe('parseArgs', () => {
  it('parses all flags correctly', () => {
    const args = parseArgs(['node', 'script', '--md', 'a.md', '--out', 'b.html', '--title', 'T', '--no-footer']);
    assert.strictEqual(args.md, 'a.md');
    assert.strictEqual(args.out, 'b.html');
    assert.strictEqual(args.title, 'T');
    assert.strictEqual(args.includeFooter, false);
    assert.strictEqual(args.includeAuthorCard, true);
  });

  it('defaults includeFooter and includeAuthorCard to true', () => {
    const args = parseArgs(['node', 'script', '--md', 'x.md']);
    assert.strictEqual(args.includeFooter, true);
    assert.strictEqual(args.includeAuthorCard, true);
  });
});

describe('VI constants', () => {
  it('has expected colors', () => {
    assert.strictEqual(VI.colors.sumiBlack, '#0A0A0A');
    assert.strictEqual(VI.colors.vermillion, '#C0392B');
  });

  it('ALLOWED_COLORS includes alpha variants', () => {
    assert(ALLOWED_COLORS.has('rgba(10,10,10,0.6)'));
    assert(ALLOWED_COLORS.has('rgba(192,57,43,0.5)'));
  });
});
```

- [ ] **Step 3: Run tests**

Run:
```bash
cd /Users/wangyiyang/Documents/Github/yy-design && npm test
```

Expected: 4 tests PASS

- [ ] **Step 4: Commit**

```bash
git add scripts/yy-wechat-render.mjs test/yy-wechat-render.test.mjs
git commit -m "feat(cli): VI constants and argument parser"
```

---

## Task 3: Marked Custom Renderer

**Files:**
- Create: `scripts/lib/vi-renderer.mjs`

- [ ] **Step 1: Implement viRenderer**

Create `scripts/lib/vi-renderer.mjs`:
```javascript
import { Renderer } from 'marked';
import { VI } from '../yy-wechat-render.mjs';

export function createVIRenderer() {
  const renderer = new Renderer();

  renderer.paragraph = ({ tokens }) => {
    const text = renderer.parser.parseInline(tokens);
    return `<p style="margin:0 0 1em;color:${VI.colors.sumiBlack};font-size:${VI.sizes.body};line-height:${VI.lineHeights.body};font-family:${VI.fonts.sans};">${text}</p>`;
  };

  renderer.heading = ({ tokens, depth }) => {
    const text = renderer.parser.parseInline(tokens);
    const sizes = { 1: VI.sizes.h1, 2: VI.sizes.h2, 3: VI.sizes.h3 };
    const size = sizes[depth] || VI.sizes.body;
    const margin = depth === 1 ? '1.2em 0 0.6em' : '1.6em 0 0.6em';
    
    if (depth === 2) {
      return `<h2 style="margin:${margin};color:${VI.colors.sumiBlack};font-size:${size};line-height:${VI.lineHeights.heading};font-weight:600;font-family:${VI.fonts.serif};"><span style="color:${VI.colors.vermillion};">▌</span> ${text}</h2>`;
    }
    return `<h${depth} style="margin:${margin};color:${VI.colors.sumiBlack};font-size:${size};line-height:${VI.lineHeights.heading};font-family:${VI.fonts.serif};">${text}</h${depth}>`;
  };

  renderer.blockquote = ({ tokens }) => {
    const body = renderer.parser.parse(tokens);
    return `<blockquote style="margin:1em 0;padding:0.6em 1em;border-left:4px solid ${VI.colors.vermillion};background:rgba(10,10,10,0.05);color:${VI.colors.sumiBlack};font-style:italic;font-size:${VI.sizes.body};line-height:${VI.lineHeights.body};">${body}</blockquote>`;
  };

  renderer.code = ({ text, lang }) => {
    if (lang === 'mermaid') {
      return `<div class="mermaid-raw" data-graph="${escapeHtml(text)}"></div>`;
    }
    const escaped = escapeHtml(text);
    return `<section style="margin:1em 0;background:${VI.colors.sumiBlack};color:${VI.colors.washiWhite};font-family:${VI.fonts.mono};font-size:${VI.sizes.small};line-height:${VI.lineHeights.code};padding:1em;border-radius:6px;overflow-x:auto;"><code>${escaped}</code></section>`;
  };

  renderer.codespan = ({ text }) => {
    return `<code style="background:rgba(10,10,10,0.05);padding:0.1em 0.3em;border-radius:3px;font-family:${VI.fonts.mono};font-size:0.9em;">${escapeHtml(text)}</code>`;
  };

  renderer.list = ({ items }) => {
    return items.map(item => {
      const text = renderer.parser.parseInline(item.tokens);
      return `<p style="margin:0 0 0.5em;color:${VI.colors.sumiBlack};font-size:${VI.sizes.body};line-height:${VI.lineHeights.body};font-family:${VI.fonts.sans};"><span style="color:${VI.colors.vermillion};">▸</span> ${text}</p>`;
    }).join('\n');
  };

  renderer.image = ({ href, title, text }) => {
    const caption = text || title || '';
    return `<figure style="margin:1.2em 0;text-align:center;"><img src="${href}" style="max-width:100%;border-radius:4px;" alt="${escapeHtml(text)}"/>${caption ? `<figcaption style="margin-top:0.4em;color:rgba(10,10,10,0.5);font-size:${VI.sizes.caption};">${escapeHtml(caption)}</figcaption>` : ''}</figure>`;
  };

  renderer.strong = ({ text }) => {
    return `<strong style="font-weight:600;">${text}</strong>`;
  };

  renderer.em = ({ text }) => {
    return `<em style="font-style:italic;">${text}</em>`;
  };

  renderer.link = ({ href, text }) => {
    return `<a href="${href}" data-external="true" style="color:${VI.colors.vermillion};text-decoration:none;">${text}</a>`;
  };

  renderer.hr = () => {
    return `<hr style="border:none;border-top:1px solid rgba(10,10,10,0.1);margin:1.5em 0;"/>`;
  };

  renderer.space = () => '';

  return renderer;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
```

- [ ] **Step 2: Add renderer tests**

Append to `test/yy-wechat-render.test.mjs`:
```javascript
import { createVIRenderer } from '../scripts/lib/vi-renderer.mjs';
import { marked } from 'marked';

describe('vi-renderer', () => {
  it('renders paragraph with inline styles', () => {
    const renderer = createVIRenderer();
    const html = marked.parse('Hello world', { renderer });
    assert(html.includes('color:#0A0A0A'));
    assert(html.includes('font-size:16px'));
    assert(html.includes("font-family:'Source Han Sans SC'"));
  });

  it('renders h2 with vermillion prefix', () => {
    const renderer = createVIRenderer();
    const html = marked.parse('## Title', { renderer });
    assert(html.includes('▌'));
    assert(html.includes('color:#C0392B'));
    assert(html.includes('font-size:24px'));
  });

  it('renders blockquote with left border', () => {
    const renderer = createVIRenderer();
    const html = marked.parse('> Quote', { renderer });
    assert(html.includes('border-left:4px solid #C0392B'));
    assert(html.includes('background:rgba(10,10,10,0.05)'));
  });

  it('renders code block with dark background', () => {
    const renderer = createVIRenderer();
    const html = marked.parse('```\nconst x = 1;\n```', { renderer });
    assert(html.includes('background:#0A0A0A'));
    assert(html.includes('color:#FAFAFA'));
  });

  it('renders list items with ▸ prefix', () => {
    const renderer = createVIRenderer();
    const html = marked.parse('- Item 1\n- Item 2', { renderer });
    const count = (html.match(/▸/g) || []).length;
    assert.strictEqual(count, 2);
  });

  it('marks external links for post-processing', () => {
    const renderer = createVIRenderer();
    const html = marked.parse('[text](https://example.com)', { renderer });
    assert(html.includes('data-external="true"'));
  });
});
```

- [ ] **Step 3: Run tests**

Run:
```bash
cd /Users/wangyiyang/Documents/Github/yy-design && npm test
```

Expected: 10 tests PASS

- [ ] **Step 4: Commit**

```bash
git add scripts/lib/vi-renderer.mjs test/yy-wechat-render.test.mjs
git commit -m "feat(renderer): marked custom renderer with VI inline styles"
```

---

## Task 4: Mermaid SVG Renderer

**Files:**
- Create: `scripts/lib/svg-render.mjs`

- [ ] **Step 1: Implement mermaid server-side rendering**

Create `scripts/lib/svg-render.mjs`:
```javascript
import { JSDOM } from 'jsdom';
import mermaid from 'mermaid';

const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = window.document;

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#FAFAFA',
    primaryTextColor: '#0A0A0A',
    primaryBorderColor: '#0A0A0A',
    lineColor: '#0A0A0A',
    secondaryColor: '#F5F5F5',
    tertiaryColor: '#FAFAFA',
    fontFamily: "'Source Han Sans SC','PingFang SC',sans-serif",
  },
});

export async function renderMermaidToSvg(graphDefinition) {
  try {
    const id = 'mermaid-' + Math.random().toString(36).slice(2);
    const { svg } = await mermaid.render(id, graphDefinition);
    return svg.replace(/<style>[\s\S]*?<\/style>/, '')
              .replace(/class="[^"]*"/g, '')
              .replace(/style="[^"]*"/g, (match) => match.replace(/font-family:[^;]+;/, `font-family:'Source Han Sans SC','PingFang SC',sans-serif;`));
  } catch (err) {
    return null;
  }
}

export function countSvgNodes(svgString) {
  const rectMatches = svgString.match(/<rect/g) || [];
  const circleMatches = svgString.match(/<circle/g) || [];
  const pathMatches = svgString.match(/<path/g) || [];
  return rectMatches.length + circleMatches.length + pathMatches.length;
}
```

- [ ] **Step 2: Add mermaid render test**

Append to `test/yy-wechat-render.test.mjs`:
```javascript
import { renderMermaidToSvg, countSvgNodes } from '../scripts/lib/svg-render.mjs';

describe('svg-render', () => {
  it('renders simple flowchart to SVG', async () => {
    const svg = await renderMermaidToSvg('graph TD; A-->B;');
    assert(svg);
    assert(svg.startsWith('<svg'));
  });

  it('returns null for invalid mermaid', async () => {
    const svg = await renderMermaidToSvg('invalid %% syntax');
    assert.strictEqual(svg, null);
  });

  it('counts SVG nodes', () => {
    const svg = '<svg><rect/><rect/><circle/></svg>';
    assert.strictEqual(countSvgNodes(svg), 3);
  });
});
```

- [ ] **Step 3: Run tests**

Run:
```bash
cd /Users/wangyiyang/Documents/Github/yy-design && npm test
```

Expected: 13 tests PASS (mermaid tests may take 2-3s)

- [ ] **Step 4: Commit**

```bash
git add scripts/lib/svg-render.mjs test/yy-wechat-render.test.mjs
git commit -m "feat(mermaid): server-side SVG rendering with jsdom"
```

---

## Task 5: Post-Processor

**Files:**
- Create: `scripts/lib/post-process.mjs`

- [ ] **Step 1: Implement post-process**

Create `scripts/lib/post-process.mjs`:
```javascript
import { VI } from '../yy-wechat-render.mjs';

export function postProcess(html, options = {}) {
  let result = html;
  const references = [];

  // Extract external links
  const linkRegex = /<a href="([^"]+)" data-external="true"[^>]*>([^<]*)<\/a>/g;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    references.push({ href: match[1], text: match[2] });
  }

  // Replace links with vermillion spans
  result = result.replace(
    /<a href="([^"]+)" data-external="true"[^>]*>([^<]*)<\/a>/g,
    `<span style="color:${VI.colors.vermillion};">$2</span>`
  );

  // Replace mermaid placeholders with actual SVG
  // (handled in main pipeline after async render)

  // Add references section
  if (references.length > 0) {
    const refSection = buildReferencesSection(references);
    result += '\n' + refSection;
  }

  // Add footer
  if (options.includeFooter !== false) {
    result += '\n' + buildFooter();
  }

  // Add author card
  if (options.includeAuthorCard !== false) {
    result += '\n' + buildAuthorCard();
  }

  // Wrap in root section
  result = `<section style="max-width:680px;margin:0 auto;padding:2em 1.5em;background:#FFFFFF;color:${VI.colors.sumiBlack};font-family:${VI.fonts.sans};font-size:${VI.sizes.body};line-height:${VI.lineHeights.body};">\n${result}\n</section>`;

  return result;
}

function buildReferencesSection(refs) {
  const items = refs.map((ref, i) => 
    `<p style="margin:0.3em 0;font-size:${VI.sizes.small};color:rgba(10,10,10,0.6);">[${i + 1}] ${ref.text}: ${ref.href}</p>`
  ).join('\n');
  return `<section style="margin:2em 0 0;">\n<h3 style="font-size:${VI.sizes.h3};font-family:${VI.fonts.serif};margin:1em 0 0.5em;">引用</h3>\n${items}\n</section>`;
}

function buildFooter() {
  return `<section style="margin:2em 0 0;text-align:center;color:${VI.colors.sumiBlack};font-family:${VI.fonts.sans};">\n<hr style="border:none;border-top:1px solid rgba(10,10,10,0.1);margin:1.5em 0;"/>\n<p style="margin:0.6em 0 0;font-weight:600;">翊行代码 · YY</p>\n<p style="margin:0.2em 0;color:rgba(10,10,10,0.6);font-size:${VI.sizes.small};">Code, one stroke at a time.</p>\n</section>`;
}

function buildAuthorCard() {
  return `<section style="margin:1em 0 0;text-align:center;color:${VI.colors.sumiBlack};font-family:${VI.fonts.sans};">\n<p style="margin:0.4em 0;font-size:${VI.sizes.small};">▸ 博客: wangyiyang.cc</p>\n<p style="margin:0.2em 0;font-size:${VI.sizes.small};">▸ GitHub: github.com/wangyiyang</p>\n</section>`;
}
```

- [ ] **Step 2: Add post-process tests**

Append to `test/yy-wechat-render.test.mjs`:
```javascript
import { postProcess } from '../scripts/lib/post-process.mjs';

describe('post-process', () => {
  it('replaces external links with vermillion spans', () => {
    const html = '<p><a href="https://example.com" data-external="true">Example</a></p>';
    const result = postProcess(html);
    assert(!result.includes('<a'));
    assert(result.includes('color:#C0392B'));
    assert(result.includes('Example'));
  });

  it('adds references section for external links', () => {
    const html = '<p><a href="https://a.com" data-external="true">A</a></p>';
    const result = postProcess(html);
    assert(result.includes('引用'));
    assert(result.includes('https://a.com'));
  });

  it('adds footer and author card by default', () => {
    const result = postProcess('<p>text</p>');
    assert(result.includes('翊行代码'));
    assert(result.includes('wangyiyang.cc'));
  });

  it('wraps in root section', () => {
    const result = postProcess('<p>text</p>');
    assert(result.startsWith('<section'));
    assert(result.includes('max-width:680px'));
  });

  it('respects --no-footer and --no-author-card', () => {
    const result = postProcess('<p>text</p>', { includeFooter: false, includeAuthorCard: false });
    assert(!result.includes('翊行代码'));
    assert(!result.includes('wangyiyang.cc'));
  });
});
```

- [ ] **Step 3: Run tests**

Run:
```bash
cd /Users/wangyiyang/Documents/Github/yy-design && npm test
```

Expected: 18 tests PASS

- [ ] **Step 4: Commit**

```bash
git add scripts/lib/post-process.mjs test/yy-wechat-render.test.mjs
git commit -m "feat(post-process): external link footnotes, footer, author card, root wrapper"
```

---

## Task 6: Iron-Rule Linter

**Files:**
- Create: `scripts/lib/linter.mjs`

- [ ] **Step 1: Implement linter**

Create `scripts/lib/linter.mjs`:
```javascript
import { VI, ALLOWED_COLORS } from '../yy-wechat-render.mjs';

export function lint(html) {
  const warnings = [];

  // 1. 朱红关键词 ≤ 5 处
  const vermillionSpans = (html.match(/color:#C0392B/gi) || []).length;
  if (vermillionSpans > 5) {
    warnings.push(`⚠️ 朱红关键词 ${vermillionSpans} 处（建议 ≤5）`);
  }

  // 2. 加粗关键句 ≤ 3 处
  const strongCount = (html.match(/<strong/gi) || []).length;
  if (strongCount > 3) {
    warnings.push(`⚠️ 加粗关键句 ${strongCount} 处（建议 ≤3）`);
  }

  // 3. 朱红不大段（简化：检查 blockquote 或 section 含朱红）
  const vermillionBlocks = (html.match(/style="[^"]*color:#C0392B[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/gi) || []);
  for (const block of vermillionBlocks) {
    const lineCount = (block.match(/<p/gi) || []).length;
    if (lineCount > 3) {
      warnings.push(`⚠️ 发现大段朱红文本（${lineCount} 行），建议拆散`);
      break;
    }
  }

  // 4. 段落间留白 — renderer 保证，此处仅校验
  const paragraphsWithoutMargin = (html.match(/<p(?![^>]*margin)/gi) || []).length;
  if (paragraphsWithoutMargin > 0) {
    warnings.push(`⚠️ ${paragraphsWithoutMargin} 个段落缺少 margin-bottom`);
  }

  // 5. 列表前缀 — renderer 保证，跳过

  // 6. 不引入第 5 种颜色
  const hexColors = html.match(/#[0-9A-Fa-f]{6}/g) || [];
  const rgbColors = html.match(/rgba?\([^)]+\)/g) || [];
  const allColors = [...new Set([...hexColors, ...rgbColors])];
  const unknown = allColors.filter(c => !ALLOWED_COLORS.has(c.toUpperCase()));
  if (unknown.length > 0) {
    warnings.push(`❌ 发现未授权颜色：${unknown.slice(0, 3).join(', ')}`);
  }

  // 7. mermaid 复杂度
  const svgNodeCounts = [];
  const svgRegex = /<svg[\s\S]*?<\/svg>/g;
  let svgMatch;
  while ((svgMatch = svgRegex.exec(html)) !== null) {
    const nodeCount = (svgMatch[0].match(/<(rect|circle|path|text|line|polyline)/g) || []).length;
    if (nodeCount > 50) {
      warnings.push(`⚠️ mermaid 图表节点 ${nodeCount} 个（建议 ≤50，移动端可能拥挤）`);
    }
  }

  return warnings;
}
```

- [ ] **Step 2: Add linter tests**

Append to `test/yy-wechat-render.test.mjs`:
```javascript
import { lint } from '../scripts/lib/linter.mjs';

describe('linter', () => {
  it('warns on too many vermillion spans', () => {
    const html = '<p><span style="color:#C0392B;">1</span></p>'.repeat(7);
    const warnings = lint(html);
    assert(warnings.some(w => w.includes('朱红') && w.includes('7')));
  });

  it('warns on too many strong tags', () => {
    const html = '<strong>1</strong>'.repeat(5);
    const warnings = lint(html);
    assert(warnings.some(w => w.includes('加粗')));
  });

  it('reports unauthorized colors', () => {
    const html = '<p style="color:#FF5733;">text</p>';
    const warnings = lint(html);
    assert(warnings.some(w => w.includes('未授权颜色')));
  });

  it('warns on paragraphs without margin', () => {
    const html = '<p>no margin</p>';
    const warnings = lint(html);
    assert(warnings.some(w => w.includes('margin')));
  });

  it('warns on complex mermaid SVG', () => {
    const nodes = '<rect/>'.repeat(60);
    const html = `<svg>${nodes}</svg>`;
    const warnings = lint(html);
    assert(warnings.some(w => w.includes('mermaid') && w.includes('拥挤')));
  });

  it('passes clean HTML', () => {
    const html = '<p style="margin:0 0 1em;color:#0A0A0A;">Clean</p>';
    const warnings = lint(html);
    assert.strictEqual(warnings.length, 0);
  });
});
```

- [ ] **Step 3: Run tests**

Run:
```bash
cd /Users/wangyiyang/Documents/Github/yy-design && npm test
```

Expected: 24 tests PASS

- [ ] **Step 4: Commit**

```bash
git add scripts/lib/linter.mjs test/yy-wechat-render.test.mjs
git commit -m "feat(linter): iron-rule validator with VI compliance checks"
```

---

## Task 7: Copy-HTML Generator

**Files:**
- Create: `scripts/lib/copy-html.mjs`

- [ ] **Step 1: Implement copy-html generator**

Create `scripts/lib/copy-html.mjs`:
```javascript
export function generateCopyHtml(contentHtml) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>复制到公众号</title>
<style>
body { margin: 0; padding: 2em; font-family: -apple-system, sans-serif; background: #F5F5F5; }
#message { text-align: center; color: #0A0A0A; font-size: 16px; margin-top: 40vh; }
#message p { margin: 0.5em 0; }
</style>
</head>
<body>
<div id="source" style="position:fixed;left:-9999px;top:0;">
${contentHtml}
</div>
<div id="message">
  <p style="font-size:24px;font-weight:600;">✅ 已复制到剪贴板</p>
  <p style="color:rgba(10,10,10,0.6);">切换到公众号编辑器，按 Cmd/Ctrl + V 粘贴</p>
</div>
<script>
(function() {
  const source = document.getElementById('source');
  const range = document.createRange();
  range.selectNodeContents(source);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  const success = document.execCommand('copy');
  sel.removeAllRanges();
  if (!success) {
    document.getElementById('message').innerHTML = 
      '<p style="font-size:24px;font-weight:600;color:#C0392B;">⚠️ 自动复制失败</p>' +
      '<p style="color:rgba(10,10,10,0.6);">请全选下方内容手动复制</p>';
    source.style.position = 'static';
    source.style.left = 'auto';
  }
})();
</script>
</body>
</html>`;
}
```

- [ ] **Step 2: Add copy-html test**

Append to `test/yy-wechat-render.test.mjs`:
```javascript
import { generateCopyHtml } from '../scripts/lib/copy-html.mjs';

describe('copy-html', () => {
  it('generates valid HTML with hidden source container', () => {
    const html = generateCopyHtml('<p>test</p>');
    assert(html.includes('<!DOCTYPE html>'));
    assert(html.includes('id="source"'));
    assert(html.includes('position:fixed;left:-9999px'));
    assert(html.includes('document.execCommand(\'copy\')'));
    assert(html.includes('<p>test</p>'));
  });

  it('includes fallback message for failed copy', () => {
    const html = generateCopyHtml('<p>test</p>');
    assert(html.includes('自动复制失败'));
  });
});
```

- [ ] **Step 3: Run tests**

Run:
```bash
cd /Users/wangyiyang/Documents/Github/yy-design && npm test
```

Expected: 26 tests PASS

- [ ] **Step 4: Commit**

```bash
git add scripts/lib/copy-html.mjs test/yy-wechat-render.test.mjs
git commit -m "feat(copy): auto-copy HTML generator with fallback"
```

---

## Task 8: Main Pipeline & CLI Integration

**Files:**
- Modify: `scripts/yy-wechat-render.mjs`

- [ ] **Step 1: Add main pipeline to CLI file**

Append to `scripts/yy-wechat-render.mjs`:
```javascript
import { marked } from 'marked';
import { createVIRenderer } from './lib/vi-renderer.mjs';
import { postProcess } from './lib/post-process.mjs';
import { lint } from './lib/linter.mjs';
import { generateCopyHtml } from './lib/copy-html.mjs';
import { renderMermaidToSvg, countSvgNodes } from './lib/svg-render.mjs';
import fs from 'node:fs';
import path from 'node:path';

export async function renderMarkdown(mdPath, options = {}) {
  const md = fs.readFileSync(mdPath, 'utf8');
  
  process.stderr.write('▸ 解析 Markdown...\n');
  const renderer = createVIRenderer();
  let html = marked.parse(md, { renderer });

  // Render mermaid blocks
  const mermaidRegex = /<div class="mermaid-raw" data-graph="([^"]*)"><\/div>/g;
  const mermaidMatches = [];
  let mMatch;
  while ((mMatch = mermaidRegex.exec(html)) !== null) {
    mermaidMatches.push({ full: mMatch[0], graph: decodeHtmlEntities(mMatch[1]) });
  }

  if (mermaidMatches.length > 0) {
    process.stderr.write(`▸ 渲染 ${mermaidMatches.length} 个 mermaid 图表...\n`);
    for (const { full, graph } of mermaidMatches) {
      const svg = await renderMermaidToSvg(graph);
      if (svg) {
        const nodeCount = countSvgNodes(svg);
        const style = nodeCount > 50 ? '' : '';
        html = html.replace(full, `<div style="margin:1em 0;${style}">${svg}</div>`);
      } else {
        html = html.replace(full, `<section style="margin:1em 0;background:${VI.colors.sumiBlack};color:${VI.colors.washiWhite};padding:1em;border-radius:6px;"><code style="font-family:${VI.fonts.mono};">[mermaid 渲染失败]</code></section>`);
      }
    }
  }

  process.stderr.write('▸ 后处理（外链、文末签、作者卡）...\n');
  html = postProcess(html, options);

  process.stderr.write('▸ 铁律校验...\n');
  const warnings = lint(html);

  return { html, warnings };
}

function decodeHtmlEntities(str) {
  return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.md) usage();

  const mdPath = path.resolve(args.md);
  if (!fs.existsSync(mdPath)) {
    console.error(`❌ 文件不存在: ${mdPath}`);
    process.exit(1);
  }

  const options = {
    title: args.title,
    subtitle: args.subtitle,
    includeFooter: args.includeFooter,
    includeAuthorCard: args.includeAuthorCard,
  };

  const { html, warnings } = await renderMarkdown(mdPath, options);

  // Determine output path
  let outPath;
  if (args.out) {
    outPath = path.resolve(args.out);
  } else {
    const outDir = args.outDir ? path.resolve(args.outDir) : path.join(PROJECT_ROOT, 'output');
    fs.mkdirSync(outDir, { recursive: true });
    const basename = path.basename(mdPath, '.md');
    outPath = path.join(outDir, `${basename}.html`);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${escapeHtml(args.title || path.basename(mdPath, '.md'))}</title>\n</head>\n<body style="margin:0;background:#FFFFFF;">\n${html}\n</body>\n</html>`, 'utf8');

  // Generate copy.html
  const copyPath = outPath.replace(/\.html$/, '-copy.html');
  fs.writeFileSync(copyPath, generateCopyHtml(html), 'utf8');

  // Output warnings
  for (const w of warnings) {
    process.stderr.write(`  ${w}\n`);
  }

  process.stderr.write(`▸ 输出: ${outPath}\n`);
  process.stderr.write(`▸ copy.html: ${copyPath}\n`);

  // stdout JSON
  const output = {
    html: outPath,
    copyHtml: copyPath,
    warnings,
  };
  console.log(JSON.stringify(output));
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

main().catch(err => {
  console.error(`❌ 渲染失败: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
```

- [ ] **Step 2: Add integration test**

Append to `test/yy-wechat-render.test.mjs`:
```javascript
import { renderMarkdown } from '../scripts/yy-wechat-render.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('integration', () => {
  it('renders sample.md to inline-styled HTML', async () => {
    const samplePath = path.join(__dirname, 'fixtures', 'sample.md');
    const { html, warnings } = await renderMarkdown(samplePath);
    
    assert(html.includes('color:#0A0A0A'));
    assert(html.includes('▌'));
    assert(html.includes('▸'));
    assert(html.includes('background:#0A0A0A'));
    assert(html.includes('翊行代码'));
    assert(html.includes('引用'));
  });

  it('outputs warnings array', async () => {
    const samplePath = path.join(__dirname, 'fixtures', 'sample.md');
    const { warnings } = await renderMarkdown(samplePath);
    assert(Array.isArray(warnings));
  });
});
```

- [ ] **Step 3: Run all tests**

Run:
```bash
cd /Users/wangyiyang/Documents/Github/yy-design && npm test
```

Expected: 28 tests PASS

- [ ] **Step 4: Manual CLI test**

Run:
```bash
cd /Users/wangyiyang/Documents/Github/yy-design && node scripts/yy-wechat-render.mjs --md test/fixtures/sample.md --out test-output.html
```

Expected:
- `test-output.html` created
- `test-output-copy.html` created
- stderr shows progress + warnings
- stdout shows JSON with paths

- [ ] **Step 5: Commit**

```bash
git add scripts/yy-wechat-render.mjs test/yy-wechat-render.test.mjs
git commit -m "feat(cli): main pipeline with mermaid, post-process, lint, copy-html"
```

---

## Task 9: Final Review & README Update

**Files:**
- Modify: `README.md` or `README.zh.md`

- [ ] **Step 1: Verify all spec requirements**

Run:
```bash
cd /Users/wangyiyang/Documents/Github/yy-design && npm test
```

Expected: All 28 tests PASS

- [ ] **Step 2: Add usage to README.zh.md**

Append a section to `README.zh.md`:
```markdown
## yy-wechat-render · 公众号文章渲染

将 Markdown 渲染为符合翊行代码 VI 的内联样式 HTML。

```bash
node scripts/yy-wechat-render.mjs --md article.md --out article.html
```

输出：
- `article.html` — 带内联样式的完整 HTML
- `article-copy.html` — 打开即自动复制富文本到剪贴板

支持：标题/正文/引用/列表/代码块/图片/mermaid 图表/铁律校验
```

- [ ] **Step 3: Commit**

```bash
git add README.zh.md
git commit -m "docs: add yy-wechat-render usage to README"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- ✅ CLI 接口（--md, --out, --out-dir, flags）→ Task 1-2, 8
- ✅ VI 常量（colors, fonts, sizes）→ Task 2
- ✅ 组件映射（paragraph/heading/blockquote/code/list/image/link/hr）→ Task 3
- ✅ Mermaid SVG 预渲染 → Task 4, 8
- ✅ 外链转引用清单 → Task 5
- ✅ 文末签 + 作者卡 → Task 5
- ✅ 铁律校验（朱红≤5/加粗≤3/颜色白名单/mermaid复杂度）→ Task 6
- ✅ copy.html 自动复制 → Task 7
- ✅ 错误处理 → Task 8

**2. Placeholder scan:**
- ✅ 无 TBD/TODO
- ✅ 所有步骤含完整代码
- ✅ 所有测试含完整断言

**3. Type consistency:**
- ✅ `VI` 常量一处定义，多处引用
- ✅ `options` 对象结构一致（{ includeFooter, includeAuthorCard }）
- ✅ `warnings` 始终为 string[]
