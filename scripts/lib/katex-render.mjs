import { chromium } from 'playwright';

let browser;

async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }
  return browser;
}

/**
 * 预处理 Markdown：将数学公式替换为占位符
 * 返回 { processed, formulas }
 */
export function extractFormulas(md) {
  const formulas = [];
  let index = 0;

  // 块级公式 $$...$$
  let result = md.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
    const id = `[[FORMULA_BLOCK_${index++}]]`;
    formulas.push({ id, formula: formula.trim(), displayMode: true });
    return id;
  });

  // 行内公式 $...$
  result = result.replace(/(?<!\$)\$(?!\$)([^\n$]+?)\$(?!\$)/g, (match, formula) => {
    const id = `[[FORMULA_INLINE_${index++}]]`;
    formulas.push({ id, formula: formula.trim(), displayMode: false });
    return id;
  });

  return { processed: result, formulas };
}

/**
 * 渲染公式为 base64 PNG 图片
 * 微信编辑器对 SVG/HTML 公式支持差，PNG 兼容性最好
 */
export async function renderFormulaToPng(formula, displayMode = false) {
  try {
    const bw = await getBrowser();
    const page = await bw.newPage();

    // 渲染 KaTeX 到页面
    await page.setContent(`
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<style>
body {
  margin: 0;
  padding: ${displayMode ? '20px' : '10px 20px'};
  background: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Source Han Sans SC', 'PingFang SC', sans-serif;
}
.katex-display { margin: 0 !important; }
.katex { color: #0A0A0A !important; }
.katex * { color: #0A0A0A !important; }
</style>
</head>
<body>
<div id="formula"></div>
<script>
katex.render(${JSON.stringify(formula)}, document.getElementById('formula'), {
  displayMode: ${displayMode},
  throwOnError: false,
  strict: false,
});
</script>
</body>
</html>
    `);

    // 等待公式渲染完成
    await page.waitForSelector('#formula .katex');

    // 截图
    const selector = displayMode ? '#formula .katex-display' : '#formula .katex';
    const element = await page.$(selector) || await page.$('#formula');
    const screenshot = await element.screenshot({
      type: 'png',
      omitBackground: true,
    });

    await page.close();

    // 转为 base64
    const base64 = screenshot.toString('base64');
    return `data:image/png;base64,${base64}`;
  } catch (err) {
    console.error('KaTeX render error:', err.message);
    return null;
  }
}

/**
 * 将所有公式占位符替换为渲染后的图片
 */
export async function restoreFormulas(html, formulas) {
  let result = html;
  for (const { id, formula, displayMode } of formulas) {
    const dataUrl = await renderFormulaToPng(formula, displayMode);
    if (dataUrl) {
      const style = displayMode
        ? 'display:block;margin:1em auto;text-align:center;max-width:100%;'
        : 'display:inline-block;vertical-align:middle;height:1.2em;width:auto;';
      const img = `<img src="${dataUrl}" style="${style}" alt="${escapeHtml(formula)}" />`;
      result = result.replace(id, img);
    } else {
      result = result.replace(id, `<span style="color:#C0392B;font-family:'JetBrains Mono',monospace;">[公式: ${escapeHtml(formula)}]</span>`);
    }
  }
  return result;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
