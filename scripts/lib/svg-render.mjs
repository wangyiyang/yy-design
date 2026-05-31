import { chromium } from 'playwright';

let browser;

async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }
  return browser;
}

/**
 * 把 mermaid 渲染为 base64 PNG 图片
 * 微信编辑器对 SVG 支持差，PNG 兼容性最好
 */
export async function renderMermaidToSvg(graphDefinition) {
  try {
    const bw = await getBrowser();
    const page = await bw.newPage();

    // 用 VI 配色渲染 mermaid
    await page.setContent(`
<!DOCTYPE html>
<html>
<head>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    fontFamily: "'Source Han Sans SC','PingFang SC',sans-serif",
    fontSize: '14px',
    primaryColor: '#0A0A0A',
    primaryTextColor: '#FAFAFA',
    primaryBorderColor: '#C0392B',
    secondaryColor: '#1A1A1A',
    secondaryTextColor: '#FAFAFA',
    secondaryBorderColor: '#C0392B',
    tertiaryColor: '#F5F5F5',
    tertiaryTextColor: '#0A0A0A',
    tertiaryBorderColor: '#0A0A0A',
    lineColor: '#C0392B',
    edgeLabelBackground: '#FFFFFF',
    nodeTextColor: '#FAFAFA',
    textColor: '#0A0A0A',
    labelTextColor: '#0A0A0A',
    background: '#FFFFFF',
    mainBkg: '#0A0A0A',
    fillType0: '#0A0A0A',
    fillType1: '#1A1A1A',
    fillType2: '#F5F5F5',
  },
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
    padding: 16,
    nodeSpacing: 48,
    rankSpacing: 64,
  },
});
</script>
</head>
<body style="background:#FFFFFF;margin:0;padding:20px;display:flex;justify-content:center;align-items:center;">
<div class="mermaid">${graphDefinition.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
</body>
</html>
    `);

    await page.waitForFunction(() => typeof mermaid !== 'undefined');

    // 先渲染 SVG 到页面
    const svgHtml = await page.evaluate(async () => {
      const el = document.querySelector('.mermaid');
      const { svg } = await mermaid.render('mermaid-' + Date.now(), el.textContent);
      return svg;
    });

    // 把 SVG 注入页面，然后截图
    await page.setContent(`
<!DOCTYPE html>
<html>
<head>
<style>
body { margin: 0; padding: 20px; background: #FFFFFF; display: flex; justify-content: center; align-items: center; }
svg { max-width: 100%; height: auto; }
</style>
</head>
<body>
${svgHtml}
</body>
</html>
    `);

    // 等待 SVG 渲染
    await page.waitForSelector('svg');

    // 截图为 PNG
    const svgElement = await page.$('svg');
    const screenshot = await svgElement.screenshot({
      type: 'png',
      omitBackground: false,
    });

    await page.close();

    // 转为 base64 data URL
    const base64 = screenshot.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    // 返回 <img> 标签
    return `<img src="${dataUrl}" style="max-width:100%;display:block;margin:0 auto;border-radius:4px;" alt="mermaid diagram"/>`;
  } catch (err) {
    console.error('Mermaid render error:', err.message);
    return null;
  }
}

export function countSvgNodes(svgString) {
  // 现在不是 SVG 了，直接返回 0
  return 0;
}
