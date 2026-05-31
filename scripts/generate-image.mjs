#!/usr/bin/env node
/**
 * generate-image.mjs · MiniMax AI 品牌图片生成
 *
 * 基于 yy-design VI 规范自动注入品牌约束到 prompt，
 * 确保生成的图片符合「翊行代码」品牌视觉识别。
 *
 * 用法：
 *   node scripts/generate-image.mjs --preset avatar --out assets/yy-avatar.png
 *   node scripts/generate-image.mjs --preset banner --subject "AI编程" --out banner.png
 *   node scripts/generate-image.mjs --prompt "自定义描述" --style vi --out custom.png
 *   node scripts/generate-image.mjs --preset og --subject "HyperFrames视频渲染" --out og.png
 *
 * 预设 preset（对齐 brand-spec.md §8 应用场景）：
 *   avatar        头像（1:1, 1024×1024）
 *   banner        横幅（16:9, 1920×1080）
 *   og            OG 社交分享图（1200×630）
 *   cover         通用封面（16:9）
 *   wechat-cover  公众号封面（2.35:1, 900×383）
 *   square        正方形配图（1:1）
 *   portrait      竖版海报（9:16, 1080×1920）
 *
 * 输出：
 *   stdout JSON: {"path":"...","width":1920,"height":1080,"bytes":123456,"preset":"banner"}
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── VI 品牌约束（从 brand-spec.md 提取） ──────────────────────────────
const VI = {
  colors: {
    sumiBlack: '#0A0A0A',
    washiWhite: '#FAFAFA',
    vermillion: '#C0392B',
  },
  dna: '极简、留白、墨黑配朱红、类奢牌质感、抽象优先',
  style: 'minimal, elegant, ink black and vermillion red accent',
  forbidden: [
    'ninja imagery', 'shuriken', 'ninja headband',
    'gradient background', 'neon', 'cyberpunk',
    'cherry blossom mixed with koi and Mount Fuji',
    'emoji decoration', 'glitter', 'rainbow',
  ],
};

const VI_PROMPT_PREFIX = `Style: 翊行代码品牌视觉 — ultra-minimal, luxury brand aesthetic, ink black (#0A0A0A) and off-white (#FAFAFA) with a single vermillion red (#C0392B) accent point. Abstract, restrained, zen-like negative space. No gradients, no neon, no busy patterns. Think Muji meets Aesop meets calligraphy.`;

const VI_PROMPT_SUFFIX = `Avoid: ninja imagery, shuriken, gradient backgrounds, neon colors, cyberpunk aesthetic, emoji, glitter, rainbow, busy oriental motifs mixed together.`;

// ── 场景预设 ──────────────────────────────────────────────────────────
const PRESETS = {
  avatar: {
    width: 1024, height: 1024,
    description: '品牌头像（GitHub/LinkedIn/社交平台）',
    prompt: 'Centered abstract calligraphic mark, single brushstroke character enclosed in curly braces, ink on white, one small vermillion dot accent at lower-right. Clean circular composition suitable for avatar.',
  },
  banner: {
    width: 1920, height: 1080,
    description: '横幅（博客/GitHub/社交封面）',
    prompt: 'Wide panoramic composition, vast negative space on left, subtle ink brushwork element on right third, single vermillion accent. Cinematic letterbox feel, editorial luxury.',
  },
  og: {
    width: 1200, height: 632,
    description: 'OG 社交分享图',
    prompt: 'Social sharing card composition, abstract ink element on left, generous white space for text overlay on right. Single vermillion dot. Clean, modern, editorial.',
  },
  cover: {
    width: 1920, height: 1080,
    description: '通用封面（16:9）',
    prompt: 'Cover image, abstract minimal composition, ink wash texture with vast white space. One vermillion accent. Luxury brand aesthetic, restrained and elegant.',
  },
  'wechat-cover': {
    width: 1800, height: 768,
    description: '公众号封面（2.35:1）',
    prompt: 'Ultra-wide cinematic composition, calligraphic ink element centered slightly above middle, generous breathing room. Single vermillion dot. WeChat article cover format.',
  },
  square: {
    width: 1024, height: 1024,
    description: '正方形配图',
    prompt: 'Square composition, abstract ink and white space, minimal geometric or calligraphic element. One vermillion accent point. Suitable as article illustration.',
  },
  portrait: {
    width: 1080, height: 1920,
    description: '竖版海报（9:16）',
    prompt: 'Vertical poster composition, ink element in upper third, vast white space below for text. Single vermillion accent. Luxury brand poster aesthetic.',
  },
};

// ── CLI 参数解析 ──────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--preset') args.preset = argv[++i];
    else if (a === '--prompt') args.prompt = argv[++i];
    else if (a === '--subject') args.subject = argv[++i];
    else if (a === '--style') args.style = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--out-dir') args.outDir = argv[++i];
    else if (a === '--n') args.n = parseInt(argv[++i], 10);
    else if (a === '--seed') args.seed = argv[++i];
    else if (a === '--width') args.width = parseInt(argv[++i], 10);
    else if (a === '--height') args.height = parseInt(argv[++i], 10);
    else if (a === '--auto') args.auto = true;
    else if (a === '--no-vi') args.noVi = true;
    else if (a === '--optimize') args.optimize = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function usage() {
  console.error(`
generate-image.mjs · MiniMax AI 品牌图片生成（VI 约束自动注入）

  --preset <name>     场景预设：avatar|banner|og|cover|wechat-cover|square|portrait
  --auto              自动根据 subject 关键词推断 preset
  --prompt <text>     自定义图片描述（与 --preset 可叠加）
  --subject <text>    主题/内容描述（叠加到 preset prompt 上）
  --style vi          强制注入 VI 约束（默认行为）
  --out <path>        输出文件路径（必填，单图时）
  --out-dir <dir>     输出目录（多图时）
  --n <count>         生成数量（默认 1）
  --seed <n>          随机种子（可复现）
  --width <px>        自定义宽度（覆盖 preset）
  --height <px>       自定义高度（覆盖 preset）
  --no-vi             不注入 VI 约束（用于非品牌场景）
  --optimize          启用 prompt 优化器

预设场景：
  avatar        头像 1024×1024（GitHub/LinkedIn）
  banner        横幅 1920×1080（博客/社交封面）
  og            OG 图 1200×630（社交分享）
  cover         通用封面 1920×1080
  wechat-cover  公众号封面 1800×768
  square        正方形 1024×1024（文章配图）
  portrait      竖版海报 1080×1920
`.trim());
  process.exit(1);
}

function buildPrompt(args) {
  const parts = [];
  const preset = args.preset ? PRESETS[args.preset] : null;

  if (!args.noVi) parts.push(VI_PROMPT_PREFIX);
  if (preset) parts.push(preset.prompt);
  if (args.subject) parts.push(`Subject/content: ${args.subject}`);
  if (args.prompt) parts.push(args.prompt);
  if (!args.noVi) parts.push(VI_PROMPT_SUFFIX);

  return parts.join(' ');
}

function snap8(n) { return Math.round(n / 8) * 8; }

function main() {
  const args = parseArgs(process.argv);
  if (args.help) usage();
  if (!args.out && !args.outDir) { console.error('错：缺 --out 或 --out-dir'); usage(); }

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

  if (!args.preset && !args.prompt) { console.error('错：缺 --preset 或 --prompt'); usage(); }

  const preset = args.preset ? PRESETS[args.preset] : null;
  if (args.preset && !preset) {
    console.error(`错：未知 preset "${args.preset}"，可选：${Object.keys(PRESETS).join(', ')}`);
    process.exit(1);
  }

  const width = snap8(args.width || (preset ? preset.width : 1024));
  const height = snap8(args.height || (preset ? preset.height : 1024));
  const prompt = buildPrompt(args);

  const outPath = args.out ? path.resolve(args.out) : null;
  const outDir = args.outDir ? path.resolve(args.outDir) : null;

  if (outPath) fs.mkdirSync(path.dirname(outPath), { recursive: true });
  if (outDir) fs.mkdirSync(outDir, { recursive: true });

  const mmxArgs = ['image', 'generate', '--prompt', prompt];
  mmxArgs.push('--width', String(width), '--height', String(height));
  if (args.seed) mmxArgs.push('--seed', String(args.seed));
  if (args.n && args.n > 1) mmxArgs.push('--n', String(args.n));
  if (args.optimize) mmxArgs.push('--prompt-optimizer');
  if (outPath) mmxArgs.push('--out', outPath);
  if (outDir) mmxArgs.push('--out-dir', outDir);

  process.stderr.write(`▸ 生成图片 (${width}×${height})...\n`);
  if (preset) process.stderr.write(`  预设: ${args.preset} — ${preset.description}\n`);
  process.stderr.write(`  prompt: ${prompt.slice(0, 120)}...\n`);

  const result = execFileSync('mmx', mmxArgs, {
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], timeout: 120000,
  });

  if (outPath && fs.existsSync(outPath)) {
    const stats = fs.statSync(outPath);
    const output = { path: outPath, width, height, bytes: stats.size, preset: args.preset || 'custom' };
    console.log(JSON.stringify(output));
  } else if (outDir) {
    console.log(JSON.stringify({ dir: outDir, width, height, n: args.n || 1, preset: args.preset || 'custom' }));
  } else {
    process.stdout.write(result);
  }
}

main();
