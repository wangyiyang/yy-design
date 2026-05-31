import { chromium } from 'playwright';

let browser;

async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }
  return browser;
}

export async function renderMermaidToSvg(graphDefinition) {
  try {
    const bw = await getBrowser();
    const page = await bw.newPage();
    await page.setContent(`
<!DOCTYPE html>
<html>
<head>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
mermaid.initialize({ startOnLoad: false, theme: 'base' });
</script>
</head>
<body>
<div class="mermaid">${graphDefinition.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
</body>
</html>
    `);
    await page.waitForFunction(() => typeof mermaid !== 'undefined');
    const svg = await page.evaluate(async () => {
      const el = document.querySelector('.mermaid');
      const { svg: rendered } = await mermaid.render('mermaid-' + Date.now(), el.textContent);
      return rendered;
    });
    await page.close();
    return svg;
  } catch (err) {
    return null;
  }
}

export function countSvgNodes(svgString) {
  const rectMatches = svgString.match(/<rect/g) || [];
  const circleMatches = svgString.match(/<circle/g) || [];
  const pathMatches = svgString.match(/<path/g) || [];
  return rectMatches.length + circleMatches.length + pathMatches.length;
}
