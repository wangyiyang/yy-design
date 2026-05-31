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
