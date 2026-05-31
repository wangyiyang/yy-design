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
  const unknown = allColors.filter(c => {
    const normalized = c.toLowerCase().replace(/\s+/g, '');
    return !ALLOWED_COLORS.has(c) && !ALLOWED_COLORS.has(normalized);
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
