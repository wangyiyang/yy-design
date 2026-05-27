#!/usr/bin/env node
/**
 * generate-bgm.mjs · MiniMax AI 背景音乐生成
 *
 * 用法：
 *   node scripts/generate-bgm.mjs --mood tech --duration 15 --out bgm.mp3
 *   node scripts/generate-bgm.mjs --prompt "极简钢琴，苹果发布会风格" --instrumental --out bgm.mp3
 *
 * 预设 mood（对齐 add-music.sh 的 6 种场景）：
 *   tech         极简合成器+钢琴，Apple 发布会风格
 *   ad           upbeat 现代电子，有 build + drop
 *   educational  温暖明亮，轻吉他/电钢琴
 *   tutorial     lo-fi 环境音，几乎无存在感
 *   cinematic    电影感弦乐，缓慢 build
 *   ambient      极简环境音，冥想/专注
 *
 * 输出：
 *   stdout JSON: {"path":"...","duration":15,"bytes":123456,"mood":"tech"}
 *
 * 依赖：mmx CLI (npm install -g mmx-cli)、ffprobe
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MOOD_PRESETS = {
  tech: {
    prompt: 'Minimal electronic, soft synth pads and piano, Apple keynote style, clean and modern',
    genre: 'electronic', mood: 'focused', instruments: 'synthesizer, piano',
    tempo: 'moderate', bpm: 110,
  },
  ad: {
    prompt: 'Upbeat modern electronic with build and drop, energetic product promo',
    genre: 'electronic', mood: 'energetic', instruments: 'synth bass, drums, synth lead',
    tempo: 'fast', bpm: 128,
  },
  educational: {
    prompt: 'Warm bright acoustic, inviting and friendly, science explainer background',
    genre: 'folk', mood: 'warm', instruments: 'acoustic guitar, electric piano, light strings',
    tempo: 'moderate', bpm: 95,
  },
  tutorial: {
    prompt: 'Lo-fi ambient, barely noticeable background, coding tutorial vibe',
    genre: 'ambient', mood: 'calm', instruments: 'soft piano, ambient pads',
    tempo: 'slow', bpm: 75,
  },
  cinematic: {
    prompt: 'Cinematic orchestral, slow build, emotional and grand',
    genre: 'orchestral', mood: 'epic', instruments: 'strings, brass, timpani',
    tempo: 'slow', bpm: 80,
  },
  ambient: {
    prompt: 'Minimal ambient soundscape, meditation and focus, almost silent',
    genre: 'ambient', mood: 'peaceful', instruments: 'ambient pads, soft bells',
    tempo: 'slow', bpm: 60,
  },
};

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--mood') args.mood = argv[++i];
    else if (a === '--prompt') args.prompt = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--duration') args.duration = argv[++i];
    else if (a === '--instrumental') args.instrumental = true;
    else if (a === '--model') args.model = argv[++i];
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function usage() {
  console.error(`
generate-bgm.mjs · MiniMax AI 背景音乐生成

  --mood <name>       预设场景：tech|ad|educational|tutorial|cinematic|ambient
  --prompt <text>     自定义音乐风格描述（与 --mood 二选一）
  --out <path>        输出 mp3 路径（必填）
  --duration <sec>    目标时长（参考值，实际由模型决定）
  --instrumental      纯器乐（默认）
  --model <name>      模型：music-2.6（推荐）| music-2.6-free（默认）

预设 mood：
  tech         极简合成器+钢琴，Apple 发布会风格
  ad           upbeat 现代电子，有 build + drop
  educational  温暖明亮，轻吉他/电钢琴
  tutorial     lo-fi 环境音，几乎无存在感
  cinematic    电影感弦乐，缓慢 build
  ambient      极简环境音，冥想/专注
`.trim());
  process.exit(1);
}

function getDuration(filePath) {
  try {
    const out = execFileSync('ffprobe', [
      '-v', 'error', '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1', filePath,
    ], { encoding: 'utf8' });
    return parseFloat(out.trim());
  } catch { return null; }
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) usage();
  if (!args.out) { console.error('错：缺 --out'); usage(); }
  if (!args.mood && !args.prompt) { console.error('错：缺 --mood 或 --prompt'); usage(); }

  const outPath = path.resolve(args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const preset = args.mood ? MOOD_PRESETS[args.mood] : null;
  if (args.mood && !preset) {
    console.error(`错：未知 mood "${args.mood}"，可选：${Object.keys(MOOD_PRESETS).join(', ')}`);
    process.exit(1);
  }

  const mmxArgs = ['music', 'generate', '--instrumental', '--out', outPath];
  if (preset) {
    mmxArgs.push('--prompt', preset.prompt);
    mmxArgs.push('--genre', preset.genre);
    mmxArgs.push('--mood', preset.mood);
    mmxArgs.push('--instruments', preset.instruments);
    mmxArgs.push('--tempo', preset.tempo);
    if (preset.bpm) mmxArgs.push('--bpm', String(preset.bpm));
  } else {
    mmxArgs.push('--prompt', args.prompt);
  }
  if (args.model) mmxArgs.push('--model', args.model);

  mmxArgs.push('--use-case', 'background music for video');

  execFileSync('mmx', mmxArgs, { stdio: ['ignore', 'pipe', 'inherit'], timeout: 300000 });

  const stats = fs.statSync(outPath);
  const duration = getDuration(outPath);
  const result = { path: outPath, bytes: stats.size, duration, mood: args.mood || 'custom' };
  console.log(JSON.stringify(result));
}

main();
