# yy-wechat-render · 设计文档

> 把 Markdown 自动渲染成「符合翊行代码 VI、可直接粘进公众号」的内联样式富文本。

---

## 1. 定位

yy-design skill 的内部渲染脚本，放在 `scripts/` 目录下。输入 Markdown，输出内联样式 HTML + copy.html（打开即复制富文本到剪贴板）。

**不是独立项目**，不 fork doocs/md，只复刻其样式层逻辑。

---

## 2. CLI 接口

```bash
node scripts/yy-wechat-render.mjs --md article.md --out article.html
node scripts/yy-wechat-render.mjs --md article.md --out-dir output/
```

| Flag | 说明 | 必填 |
|------|------|------|
| `--md <path>` | 输入 Markdown 文件 | ✅ |
| `--out <path>` | 输出 HTML 文件路径 | 与 `--out-dir` 二选一 |
| `--out-dir <dir>` | 输出目录（默认 `output/`） | 与 `--out` 二选一 |
| `--title <text>` | 文章标题（覆盖 md 中 h1） | ❌ |
| `--subtitle <text>` | 副标题 | ❌ |
| `--theme <name>` | 主题标签，用于封面命名提示 | ❌ |
| `--date <yymmdd>` | 日期，用于封面命名 | ❌ |
| `--no-footer` | 不输出文末签 | ❌ |
| `--no-author-card` | 不输出作者卡 | ❌ |

**stdout**：`{"html":"...","copyHtml":"...","warnings":["..."]}`  
**stderr**：人类可读的进度信息（`▸ 解析 Markdown...` 风格，对齐现有脚本）。

---

## 3. 输出产物

| 文件 | 说明 |
|------|------|
| `article.html` | 完整内联样式 HTML，可浏览器预览 |
| `article-copy.html` | 打开即自动复制富文本到剪贴板 |

---

## 4. 处理流程

```
1. 读取 --md 文件
2. marked.parse(md, { renderer: viRenderer }) → HTML 片段
3. 后处理：
   a. 扫描 <a href="外链"> → 收集为引用清单
   b. 将正文中的 <a> 替换为 <span style="color:#C0392B;">文字</span>
   c. 文末插入引用清单 section（若存在外链）
4. 按 options 拼接文末签 + 作者卡
5. 用 <section style="..."> 包裹全部内容作为根容器
6. 铁律校验器扫描最终 HTML → warnings[]
7. 写 article.html
8. 生成 article-copy.html（注入自动复制脚本）
9. stdout JSON + stderr 进度信息
```

---

## 5. VI 常量

直接复用 brand-check.mjs 已定义的四色体系：

```js
const VI = {
  colors: {
    sumiBlack: '#0A0A0A',
    washiWhite: '#FAFAFA',
    vermillion: '#C0392B',
    mutedGold: '#B8860B',
  },
  fonts: {
    serif: "'Source Han Serif SC','Songti SC',serif",
    sans: "'Source Han Sans SC','PingFang SC',sans-serif",
    mono: "'JetBrains Mono','SF Mono',monospace",
  },
  sizes: {
    h1: '32px', h2: '24px', h3: '20px',
    body: '16px', small: '14px', caption: '12px',
  },
  lineHeights: {
    body: 1.8, heading: 1.3, code: 1.5,
  },
};
```

---

## 6. 组件映射（内联 style）

| Markdown 节点 | 输出 HTML | 关键 style |
|---------------|-----------|------------|
| `paragraph` | `<p>` | `margin:0 0 1em; color:#0A0A0A; font-size:16px; line-height:1.8; font-family:'Source Han Sans SC','PingFang SC',sans-serif;` |
| `heading(1)` | `<h1>` | `font-size:32px; line-height:1.3; font-family:'Source Han Serif SC','Songti SC',serif;` |
| `heading(2)` | `<h2>` | `font-size:24px;` + `<span style="color:#C0392B;">▌</span>` 前缀 |
| `heading(3)` | `<h3>` | `font-size:20px;` |
| `blockquote` | `<blockquote>` | `border-left:4px solid #C0392B; background:rgba(10,10,10,0.05); font-style:italic;` |
| `code(inline)` | `<code>` | `background:rgba(10,10,10,0.05); font-family:'JetBrains Mono',...;` |
| `code(block)` | `<section><code>` | `background:#0A0A0A; color:#FAFAFA; font-size:14px; line-height:1.5; padding:1em; border-radius:6px;` |
| `list item` | `<p>` | `<span style="color:#C0392B;">▸</span>` 前缀 |
| `image` | `<figure>` | `<img style="max-width:100%; border-radius:4px;"/>` + `<figcaption>` 灰字 caption |
| `strong` | `<strong>` | `font-weight:600;` |
| `em` | `<em>` | `font-style:italic;` |
| `link`（正文）| `<span>` | `color:#C0392B;`（外链转文末引用清单）|
| `thematicBreak` | `<hr>` | `border:none; border-top:1px solid rgba(10,10,10,0.1);` |

---

## 7. Mermaid 图表支持

检测到 ` ```mermaid ` 代码块时，**服务端预渲染为内联 SVG**：

- 引入 `mermaid` + `jsdom`，在 Node.js 环境调用 `mermaid.render()`
- 输出 `<svg style="max-width:100%; margin:1em 0;">...</svg>`
- SVG 内 `<style>` 通过后处理转为内联（若公众号剥离 defs 内 style）
- 渲染失败时 fallback 为普通代码块 + `warnings.push('⚠️ mermaid 渲染失败')`
- 节点数 > 50 时 warning "移动端可能拥挤"

---

## 8. 文末签 / 作者卡模板

```html
<section style="margin:2em 0 0; text-align:center; color:#0A0A0A; font-family:'Source Han Sans SC','PingFang SC',sans-serif;">
  <hr style="border:none; border-top:1px solid rgba(10,10,10,0.1); margin:1.5em 0;"/>
  <p style="margin:0.6em 0 0; font-weight:600;">翊行代码 · YY</p>
  <p style="margin:0.2em 0; color:rgba(10,10,10,0.6); font-size:14px;">Code, one stroke at a time.</p>
  <p style="margin:0.4em 0; font-size:14px;">▸ 博客: wangyiyang.cc</p>
  <p style="margin:0.2em 0; font-size:14px;">▸ GitHub: github.com/wangyiyang</p>
</section>
```

---

## 9. 铁律校验器

| 规则 | 实现 | 越界处理 |
|------|------|----------|
| 朱红关键词 ≤ 5 处 | 正则匹配 `color:#C0392B`（行内 span） | warning + 标出位置 |
| 加粗关键句 ≤ 3 处 | 统计 `<strong>` / `<b>` 数 | warning |
| 朱红不大段（>3 行）| 检测含朱红色的块级元素高度 | warning |
| 段落间留白 | `<p>` 必须有 `margin-bottom` | renderer 自动保证 |
| 列表前缀 ▸ / · | renderer 自动替换 | 自动替换 |
| 不引入第 5 种颜色 | 扫描 `#RRGGBB` / `rgb()`，校验 VI 白名单 | warning（致命级别）|
| mermaid 复杂度 | SVG 节点数 > 50 | warning |

---

## 10. copy.html 方案

```html
<div id="source" style="position:fixed; left:-9999px;">
  <!-- 完整渲染后的富文本 DOM -->
</div>
<script>
  const range = document.createRange();
  range.selectNode(document.getElementById('source'));
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  document.execCommand('copy');
  sel.removeAllRanges();
  document.body.innerHTML = '<p style="text-align:center;">✅ 已复制到剪贴板</p>';
</script>
```

---

## 11. 模块架构

```
scripts/yy-wechat-render.mjs（CLI 入口，~150 行）
├── VI 常量对象
├── parseArgs() — 手写 --flag 解析
├── viRenderer — marked 自定义 Renderer（~250 行）
│   ├── paragraph / heading / blockquote / code / list / image / link / hr
│   └── mermaid 代码块检测 → svgRender()
├── postProcess(html) — 外链转引用、拼接 footer/authorCard、包裹根容器
├── lint(html) — 铁律校验器（~100 行）
├── generateCopyHtml(html) — copy.html 生成
└── main() — 编排 pipeline + stdout JSON / stderr 进度
```

单文件控制在 500 行内。铁律校验独立函数，不耦合渲染逻辑。

---

## 12. 错误处理

| 场景 | 处理 |
|------|------|
| `--md` 文件不存在 | `❌ 文件不存在` → stderr → exit 1 |
| marked 解析失败 | stderr → exit 1 |
| mermaid 渲染失败 | fallback 为代码块 + warning |
| 输出目录不可写 | stderr → exit 1 |

---

## 13. 依赖

| 包 | 用途 |
|----|------|
| `marked` | Markdown 解析 |
| `mermaid` | 图表预渲染 |
| `jsdom` | mermaid 服务端渲染环境 |

---

## 14. 验收标准

- [ ] 纯文字文章 → 粘进公众号格式完整、颜色正确、段间有呼吸
- [ ] 含代码块 → 深墨底宣白字、等宽、不溢出
- [ ] 含引用/列表/小标题 → 朱红竖线、▌前缀、▸列表正确
- [ ] 朱红关键词 7 处 → `warnings` 正确报「超过 5」
- [ ] 正文含外链 → 自动转文末引用清单
- [ ] 文末签/作者卡 → 与规范一致
- [ ] copy.html → 打开即复制，粘贴为富文本
- [ ] mermaid 代码块 → 输出内联 SVG，无 `<script>`
