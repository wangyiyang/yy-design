import { VI, ALLOWED_COLORS } from '../yy-wechat-render.mjs';

// KaTeX / Mermaid 生成的颜色添加到白名单
const EXTRA_COLORS = new Set([
  '#0b0b0b', '#0b0806', '#090a0a', '#0a0908',
  '#fff4dd', '#fdf2d9', '#f7f7f7', '#f0f0f0',
  '#ffffff', '#fffffc', '#333333', '#f5f5f5',
  'rgb(8.5000000002,5.7500000001,0)',
  'rgb(11.0000000001,8.5000000002,0)',
  'rgba(243.9999999999,220.9999999998,255,0.5)',
  'rgba(220.9999999999,243.9999999998,255,0.5)',
  'rgba(255,255,255,0.5)',
  'hsl(220.5882352941,100%,98.3333333333%)',
  'hsl(220.5882352941,60%,88.3333333333%)',
  'hsl(-79.4117647059,100%,93.3333333333%)',
  'hsl(40.5882352941,60%,83.3333333333%)',
]);

/**
 * 移除代码块、公式块和 SVG，返回正文 HTML（用于铁律校验）
 */
function extractBodyHtml(html) {
  // 移除代码块（深墨底 section）
  let body = html.replace(/<section[^>]*background:#0A0A0A[^>]*>[\s\S]*?<\/section>/gi, '');
  // 移除公式块（katex-display）
  body = body.replace(/<span class="katex-display"[^>]*>[\s\S]*?<\/span>/gi, '');
  // 移除行内公式
  body = body.replace(/<span class="katex"[^>]*>[\s\S]*?<\/span>/gi, '');
  // 移除 SVG（包含 foreignObject 内部的段落）
  body = body.replace(/<svg[\s\S]*?<\/svg>/gi, '');
  return body;
}

export function lint(html) {
  const warnings = [];
  const bodyHtml = extractBodyHtml(html);

  // 1. 朱红关键词 ≤ 5 处（仅正文，排除列表前缀▸和小标题前缀▌）
  let vermillionBody = bodyHtml.replace(/<span style="color:#C0392B;">▌<\/span>/gi, '');
  vermillionBody = vermillionBody.replace(/<span style="color:#C0392B;">▸<\/span>/gi, '');
  const vermillionSpans = (vermillionBody.match(/color:#C0392B/gi) || []).length;
  if (vermillionSpans > 5) {
    warnings.push(`⚠️ 朱红关键词 ${vermillionSpans} 处（建议 ≤5）`);
  }

  // 2. 加粗关键句 ≤ 3 处（仅正文，排除列表项中的加粗）
  // 先移除列表项（以▸开头的段落）
  let bodyNoList = bodyHtml.replace(/<p[^>]*>\s*<span[^>]*>▸<\/span>[^]*?<\/p>/gi, '');
  const strongCount = (bodyNoList.match(/<strong/gi) || []).length;
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

  // 4. 段落间留白 — 仅检查正文段落，排除公式/代码内部
  const paragraphsWithoutMargin = (bodyHtml.match(/<p(?![^>]*margin)/gi) || []).length;
  if (paragraphsWithoutMargin > 0) {
    warnings.push(`⚠️ ${paragraphsWithoutMargin} 个段落缺少 margin-bottom`);
  }

  // 5. 列表前缀 — renderer 保证，跳过

  // 6. 不引入第 5 种颜色
  const hexColors = html.match(/#[0-9A-Fa-f]{6}/g) || [];
  const rgbColors = html.match(/rgba?\([^)]+\)/g) || [];
  const allColors = [...new Set([...hexColors, ...rgbColors])];
  const unknown = allColors.filter(c => {
    const normalized = c.toLowerCase().replace(/\s+/g, '');
    return !ALLOWED_COLORS.has(c) && !ALLOWED_COLORS.has(normalized) && !EXTRA_COLORS.has(normalized);
  });
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
