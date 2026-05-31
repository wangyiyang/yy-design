#!/usr/bin/env node
/**
 * render-hyperframes.mjs · HyperFrames 视频渲染
 *
 * 用法：
 *   node scripts/render-hyperframes.mjs <composition-dir> [options]
 *   node scripts/render-hyperframes.mjs 帖/hero-animation-v10-en/ --output hero.mp4
 *
 * 选项：
 *   --output <path>     输出文件路径（默认 <composition-dir>/output.mp4）
 *   --fps <number>      帧率（默认 30）
 *   --quality <preset>  draft | standard | high（默认 standard）
 *   --format <ext>      mp4 | webm | mov（默认 mp4）
 *   --workers <n>       并行渲染线程数（默认 4）
 *   --docker            使用 Docker 确定性渲染
 *   --duration <sec>    覆盖 composition 时长
 *
 * 输出：
 *   stdout 打印 JSON: {"path":"...","duration":15,"fps":30,"bytes":123456}
 *
 * 依赖：hyperframes CLI (npm install -g hyperframes)、ffprobe
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = { fps: '30', quality: 'standard', format: 'mp4', workers: '4' };
  const positional = [];
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--output') args.output = argv[++i];
    else if (a === '--fps') args.fps = argv[++i];
    else if (a === '--quality') args.quality = argv[++i];
    else if (a === '--format') args.format = argv[++i];
    else if (a === '--workers') args.workers = argv[++i];
    else if (a === '--duration') args.duration = argv[++i];
    else if (a === '--docker') args.docker = true;
    else if (a === '--help' || a === '-h') args.help = true;
    else if (!a.startsWith('-')) positional.push(a);
  }
  if (positional.length > 0) args.compositionDir = positional[0];
  return args;
}

function usage() {
  console.error(`
render-hyperframes.mjs · HyperFrames 视频渲染

  <composition-dir>   HyperFrames composition 目录（含 index.html）
  --output <path>     输出文件路径（默认 <dir>/output.mp4）
  --fps <number>      帧率（默认 30）
  --quality <preset>  draft | standard | high（默认 standard）
  --format <ext>      mp4 | webm | mov（默认 mp4）
  --workers <n>       并行线程数（默认 4）
  --docker            Docker 确定性渲染
  --duration <sec>    覆盖时长
`.trim());
  process.exit(1);
}

function getDuration(filePath) {
  try {
    const out = execFileSync('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      filePath,
    ], { encoding: 'utf8' });
    return parseFloat(out.trim());
  } catch (e) {
    return null;
  }
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) usage();
  if (!args.compositionDir) {
    console.error('错：缺 composition 目录');
    usage();
  }

  const compDir = path.resolve(args.compositionDir);
  if (!fs.existsSync(path.join(compDir, 'index.html'))) {
    console.error(`错：${compDir}/index.html 不存在`);
    process.exit(1);
  }

  const outputPath = args.output
    ? path.resolve(args.output)
    : path.join(compDir, `output.${args.format}`);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const renderArgs = ['hyperframes', 'render', '--output', outputPath];
  renderArgs.push('--fps', args.fps);
  renderArgs.push('--quality', args.quality);
  renderArgs.push('--workers', args.workers);
  if (args.docker) renderArgs.push('--docker');

  try {
    execFileSync('npx', renderArgs, {
      cwd: compDir,
      stdio: ['ignore', 'inherit', 'inherit'],
      timeout: 300000,
    });
  } catch (e) {
    console.error(`渲染失败（exit ${e.status}）`);
    process.exit(e.status || 1);
  }

  const stats = fs.statSync(outputPath);
  const duration = getDuration(outputPath);
  const result = {
    path: outputPath,
    bytes: stats.size,
    duration,
    fps: parseInt(args.fps),
    format: args.format,
  };
  console.log(JSON.stringify(result));
}

main();
