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
