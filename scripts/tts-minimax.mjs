#!/usr/bin/env node
/**
 * tts-minimax.mjs · MiniMax 语音合成
 *
 * 用法：
 *   node scripts/tts-minimax.mjs --text "你好" --out demo.mp3
 *   node scripts/tts-minimax.mjs --text-file script.txt --out out.mp3 --speed 1.0
 *
 * 输出：
 *   - mp3 文件写到 --out 路径
 *   - stdout 打印一行 JSON: {"path":"...","duration":12.34,"bytes":54321}
 *
 * 依赖：mmx CLI (npm install -g mmx-cli)、ffprobe（测时长）
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, '..');

// 翊行代码 · 水墨叙事音色映射
const VOICES = {
  scholar: { voice_id: process.env.MMX_TTS_VOICE_SCHOLAR || 'male-qn-qingse', desc: '克制低沉，文人质感' },
  calm: { voice_id: process.env.MMX_TTS_VOICE_CALM || 'female-shaonv-jingpin', desc: '沉静温柔' },
  default: { voice_id: process.env.MMX_TTS_VOICE_ID || 'female-shaonv-jingpin', desc: '默认' },
};

function loadEnv() {
  const envPath = path.join(SKILL_ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadEnv();

function parseArgs(argv) {
  const args = { speed: '1.0' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--text') args.text = argv[++i];
    else if (a === '--text-file') args.textFile = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--speed') args.speed = argv[++i];
    else if (a === '--voice') args.voice = argv[++i];
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function usage() {
  console.error(`
tts-minimax.mjs · MiniMax 语音合成

  --text <str>          要合成的文本
  --text-file <path>    从文件读取文本（与 --text 二选一）
  --out <path>          输出 mp3 路径（必填）
  --speed <float>       语速倍率，默认 1.0
  --voice <id>          音色 id 或别名：scholar（文人·克制低沉）/ calm（沉静温柔）
                        默认读 MMX_TTS_VOICE_ID 或 female-shaonv-jingpin
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

async function tts({ text, voice, speed, outPath }) {
  let voiceId = voice;

  // 翊行代码音色映射
  if (voice && VOICES[voice]) {
    voiceId = VOICES[voice].voice_id;
    console.log(`[voice] 使用 ${voice} 音色：${VOICES[voice].desc}`);
  }

  voiceId = voiceId
    || process.env.MMX_TTS_VOICE_ID
    || 'female-shaonv-jingpin';

  const args = ['speech', 'synthesize', '--text', text, '--voice', voiceId, '--out', outPath];
  if (speed && speed !== '1.0') args.push('--speed', speed);

  execFileSync('mmx', args, { stdio: ['ignore', 'pipe', 'inherit'] });
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) usage();

  let text = args.text;
  if (!text && args.textFile) {
    text = fs.readFileSync(args.textFile, 'utf8').trim();
  }
  if (!text) {
    console.error('错：缺 --text 或 --text-file');
    usage();
  }
  if (!args.out) {
    console.error('错：缺 --out');
    usage();
  }

  const outPath = path.resolve(args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  await tts({ text, voice: args.voice, speed: args.speed, outPath });

  const stats = fs.statSync(outPath);
  const duration = getDuration(outPath);
  const result = {
    path: outPath,
    bytes: stats.size,
    duration,
    text_chars: text.length,
  };
  console.log(JSON.stringify(result));
}

main().catch((err) => {
  console.error(`TTS 失败：${err.message}`);
  process.exit(1);
});
