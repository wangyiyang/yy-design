#!/usr/bin/env node
/**
 * 为 Gallery demo 录制 MP4 视频
 * 用法: node scripts/record-demos.mjs
 */
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { mkdir } from 'fs/promises';
import path from 'path';

const DEMOS = [
  { file: 'hero-ink-brand.html',      name: 'hero-ink-brand',      duration: 8000 },
  { file: 'c1-ios-prototype-en.html', name: 'c1-ios-prototype',    duration: 6000 },
  { file: 'c3-motion-design-en.html', name: 'c3-motion-design',    duration: 6000 },
  { file: 'c5-infographic-en.html',   name: 'c5-infographic',      duration: 5000 },
  { file: 'c6-expert-review-en.html', name: 'c6-expert-review',    duration: 5000 },
  { file: 'c2-slides-pptx-en.html',   name: 'c2-slides-pptx',      duration: 6000 },
  { file: 'w3-fallback-advisor-en.html', name: 'w3-fallback-advisor', duration: 5000 },
];

const OUTDIR = 'assets/videos';
await mkdir(OUTDIR, { recursive: true });

async function convertToMp4(webmPath, mp4Path) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-y',
      '-i', webmPath,
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      '-vf', 'fps=30,scale=1920:-2:flags=lanczos',
      '-crf', '23',
      '-preset', 'fast',
      mp4Path,
    ], { stdio: 'pipe' });
    ffmpeg.on('close', code => code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}`)));
    ffmpeg.stderr.on('data', d => process.stderr.write(d));
  });
}

async function recordDemo(demo) {
  const fileUrl = `file://${path.resolve('帖', demo.file)}`;
  const webmPath = path.join(OUTDIR, `${demo.name}.webm`);
  const mp4Path = path.join(OUTDIR, `${demo.name}.mp4`);

  console.log(`\n▶ Recording ${demo.name} (${demo.duration}ms)`);

  const context = await chromium.launchPersistentContext('', {
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: OUTDIR, size: { width: 1920, height: 1080 } },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const [page] = context.pages();
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(demo.duration);
  await context.close();

  // Playwright saves as webm with random name — find it
  const { readdir } = await import('fs/promises');
  const files = await readdir(OUTDIR);
  const webm = files.find(f => f.endsWith('.webm') && !f.includes(demo.name));
  if (webm) {
    const src = path.join(OUTDIR, webm);
    await convertToMp4(src, mp4Path);
    // remove temp webm
    const { unlink } = await import('fs/promises');
    await unlink(src);
    console.log(`  ✅ ${mp4Path}`);
  } else {
    console.log(`  ⚠️  no webm found for ${demo.name}`);
  }
}

for (const demo of DEMOS) {
  try {
    await recordDemo(demo);
  } catch (e) {
    console.error(`  ❌ ${demo.name}: ${e.message}`);
  }
}

console.log('\n🎬 Done!');
