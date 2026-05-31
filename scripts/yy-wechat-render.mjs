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

import { marked } from 'marked';
import { createVIRenderer } from './lib/vi-renderer.mjs';
import { postProcess } from './lib/post-process.mjs';
import { lint } from './lib/linter.mjs';
import { generateCopyHtml } from './lib/copy-html.mjs';
import { renderMermaidToSvg } from './lib/svg-render.mjs';

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
        html = html.replace(full, `<div style="margin:1em 0;">${svg}</div>`);
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

if (import.meta.url.startsWith('file:') && process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(err => {
    console.error(`❌ 渲染失败: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });
}
