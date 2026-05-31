import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let katexCss = '';
try {
  const katexCssPath = path.resolve(__dirname, '../../node_modules/katex/dist/katex.min.css');
  katexCss = fs.readFileSync(katexCssPath, 'utf8');
} catch {
  // KaTeX CSS 不存在则跳过
}

export function generateCopyHtml(contentHtml, options = {}) {
  const katexStyle = options.includeKatex !== false && katexCss
    ? `<style>${katexCss}</style>`
    : '';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>复制到公众号</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, 'PingFang SC', 'Source Han Sans SC', sans-serif;
  background: #FAFAFA;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2em;
}
.container {
  max-width: 480px;
  width: 100%;
  text-align: center;
}
.title {
  font-size: 20px;
  color: #0A0A0A;
  margin-bottom: 0.5em;
  font-weight: 600;
}
.subtitle {
  font-size: 14px;
  color: rgba(10,10,10,0.5);
  margin-bottom: 2em;
  line-height: 1.6;
}
.copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  background: #C0392B;
  color: #FAFAFA;
  border: none;
  padding: 1em 2.5em;
  font-size: 16px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  letter-spacing: 0.05em;
}
.copy-btn:hover {
  background: #a93226;
  transform: translateY(-1px);
}
.copy-btn:active {
  transform: translateY(0);
}
.copy-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}
.copy-btn .icon {
  font-size: 18px;
}
.status {
  margin-top: 1.5em;
  font-size: 14px;
  min-height: 1.5em;
  transition: opacity 0.3s;
}
.status.success {
  color: #0A0A0A;
}
.status.success::before {
  content: "✓ ";
  color: #C0392B;
  font-weight: bold;
}
.status.error {
  color: #C0392B;
}
.status.error::before {
  content: "⚠ ";
}
.preview-toggle {
  margin-top: 2em;
  font-size: 13px;
  color: rgba(10,10,10,0.4);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.preview-toggle:hover {
  color: #C0392B;
}
.preview-box {
  margin-top: 1em;
  padding: 1em;
  background: #FFFFFF;
  border: 1px solid rgba(10,10,10,0.1);
  border-radius: 6px;
  max-height: 300px;
  overflow-y: auto;
  text-align: left;
  display: none;
}
.preview-box.active {
  display: block;
}
#source {
  position: fixed;
  left: -9999px;
  top: 0;
}
</style>
${katexStyle}
</head>
<body>
<div id="source">${contentHtml}</div>

<div class="container">
  <div class="title">📋 公众号文章复制</div>
  <div class="subtitle">点击下方按钮，将渲染后的富文本复制到剪贴板<br>然后切换到公众号编辑器粘贴即可</div>

  <button class="copy-btn" id="copyBtn" onclick="doCopy()">
    <span class="icon">📄</span>
    <span id="btnText">一键复制到公众号</span>
  </button>

  <div class="status" id="status"></div>

  <div class="preview-toggle" onclick="togglePreview()">👁 预览内容（点击展开）</div>
  <div class="preview-box" id="previewBox">
    ${contentHtml}
  </div>
</div>

<script>
function doCopy() {
  const btn = document.getElementById('copyBtn');
  const btnText = document.getElementById('btnText');
  const status = document.getElementById('status');
  const source = document.getElementById('source');

  btn.disabled = true;
  btnText.textContent = '复制中...';
  status.textContent = '';
  status.className = 'status';

  try {
    const range = document.createRange();
    range.selectNodeContents(source);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    const success = document.execCommand('copy');
    sel.removeAllRanges();

    if (success) {
      btnText.textContent = '已复制';
      status.textContent = '切换到公众号编辑器，按 Cmd/Ctrl + V 粘贴';
      status.className = 'status success';

      setTimeout(() => {
        btn.disabled = false;
        btnText.textContent = '再次复制';
      }, 2000);
    } else {
      throw new Error('execCommand failed');
    }
  } catch (e) {
    // fallback: 显示预览让用户手动复制
    btn.disabled = false;
    btnText.textContent = '一键复制到公众号';
    status.innerHTML = '自动复制被浏览器拦截，请<strong>手动全选下方预览内容</strong>后复制';
    status.className = 'status error';
    document.getElementById('previewBox').classList.add('active');
  }
}

function togglePreview() {
  const box = document.getElementById('previewBox');
  box.classList.toggle('active');
}
</script>
</body>
</html>`;
}
