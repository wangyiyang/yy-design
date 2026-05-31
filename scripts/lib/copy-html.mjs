export function generateCopyHtml(contentHtml) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>复制到公众号</title>
<style>
body { margin: 0; padding: 2em; font-family: -apple-system, sans-serif; background: #F5F5F5; }
#message { text-align: center; color: #0A0A0A; font-size: 16px; margin-top: 40vh; }
#message p { margin: 0.5em 0; }
</style>
</head>
<body>
<div id="source" style="position:fixed;left:-9999px;top:0;">
${contentHtml}
</div>
<div id="message">
  <p style="font-size:24px;font-weight:600;">✅ 已复制到剪贴板</p>
  <p style="color:rgba(10,10,10,0.6);">切换到公众号编辑器，按 Cmd/Ctrl + V 粘贴</p>
</div>
<script>
(function() {
  const source = document.getElementById('source');
  const range = document.createRange();
  range.selectNodeContents(source);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  const success = document.execCommand('copy');
  sel.removeAllRanges();
  if (!success) {
    document.getElementById('message').innerHTML = 
      '<p style="font-size:24px;font-weight:600;color:#C0392B;">⚠️ 自动复制失败</p>' +
      '<p style="color:rgba(10,10,10,0.6);">请全选下方内容手动复制</p>';
    source.style.position = 'static';
    source.style.left = 'auto';
  }
})();
</script>
</body>
</html>`;
}
