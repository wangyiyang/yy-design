# Video Export：HTML 动画导出为 MP4/GIF

动画 HTML 完成后，用户常想「能导出视频吗」。这份指南给出完整流程。

## 何时导出

**导出时机**：
- 动画完整跑通、视觉验证过（浏览器 preview 确认各时间点状态正确）
- 用户在浏览器里看过至少一次，表示效果 OK
- **不要**在动画 bug 没修完的阶段导出——导出到视频后改起来更贵

**用户可能说的触发语**：
- 「能导出成视频吗」
- 「转成 MP4」
- 「做成 GIF」
- 「60fps」

## 产出规格

默认一次给三种格式，让用户选：

| 格式 | 规格 | 适合场景 | 典型大小（30s） |
|---|---|---|---|
| MP4 30fps | 1920×1080 · H.264 · CRF 18 | 公众号嵌入、视频号、YouTube | 1-2 MB |
| MP4 60fps | 1920×1080 · HyperFrames 直出 · H.264 | 高帧率展示、B站、作品集 | 2-4 MB |
| GIF | 960×540 · 15fps · palette 优化 | Twitter/X、README、Slack 预览 | 2-4 MB |

## 工具链

### 渲染引擎：HyperFrames

使用 [HyperFrames](https://github.com/heygen-com/hyperframes) 做确定性逐帧渲染。
核心优势：seek-and-capture 模型（同输入必同输出）、任意帧率、并行捕获。

### 1. `render-hyperframes.mjs` — Composition → MP4

```bash
node scripts/render-hyperframes.mjs <composition-dir> [options]
```

可选参数：
- `--output <path>` 输出文件路径
- `--fps 30|60` 帧率（默认 30）
- `--quality draft|standard|high` 质量预设（默认 standard）
- `--format mp4|webm|mov` 格式（默认 mp4）
- `--workers <n>` 并行线程数（默认 4）
- `--docker` 使用 Docker 确定性渲染

或直接用 HyperFrames CLI：
```bash
cd <composition-dir>
npx hyperframes render --output output.mp4 --fps 30 --quality high
```

### 2. `add-music.sh` — MP4 + BGM → MP4

给无声 MP4 混入背景音乐，按场景（mood）从内置 BGM 库里选，也可自带音频。自动匹配时长、加淡入淡出。

```bash
bash add-music.sh <input.mp4> [--mood=<name>] [--music=<path>] [--out=<path>]
```

**内置 BGM 库**（在 `assets/bgm-<mood>.mp3`）：

| `--mood=` | 风格 | 适配场景 |
|-----------|------|---------|
| `tech`（默认） | Apple Silicon / 苹果发布会，极简合成器+钢琴 | 产品发布、AI工具、Skill 宣传 |
| `ad` | upbeat 现代电子，有 build + drop | 社交媒体广告、产品预告、促销片 |
| `educational` | 温暖明亮、轻吉他/电钢琴，inviting | 科普、教程介绍、课程预告 |
| `educational-alt` | 同类备选，换一首试试 | 同上 |
| `tutorial` | lo-fi 环境音，几乎无存在感 | 软件演示、编程教程、长演示 |
| `tutorial-alt` | 同类备选 | 同上 |

**行为**：
- 音乐按视频时长裁剪
- 0.3s 淡入 + 1s 淡出（避免硬切）
- 视频流 `-c:v copy` 不重编码，音频 AAC 192k
- `--music=<path>` 优先级高于 `--mood`，可以直接指定任意外部音频
- 传错 mood 名会列出所有可用选项，不会静默失败

**典型流水线**（HyperFrames 渲染 + 配乐）：
```bash
# 渲染 30fps MP4
npx hyperframes render --output animation.mp4 --fps 30 --quality high

# 派生 GIF（60fps 转换自动跳过，因为可以直接 --fps 60 渲染）
bash convert-formats.sh animation.mp4

# 加默认 tech BGM
bash add-music.sh animation.mp4

# 或直接渲染 60fps
npx hyperframes render --output animation-60fps.mp4 --fps 60 --quality high
bash add-music.sh animation-60fps.mp4 --mood=ad --out=promo-final.mp4
```

### 3. `convert-formats.sh` — MP4 → 60fps MP4 + GIF

从已有 MP4 生成 60fps 版本和 GIF。

```bash
bash /path/to/claude-design/scripts/convert-formats.sh <input.mp4> [gif_width] [--minterpolate]
```

输出（与输入同目录）：
- `<name>-60fps.mp4` — 默认用 `fps=60` 帧复制（兼容性广）；加 `--minterpolate` 启用高质量插帧
- `<name>.gif` — palette 优化的 GIF（默认 960 宽，可改）

**60fps 模式选择**：

| 模式 | 命令 | 兼容性 | 使用场景 |
|---|---|---|---|
| 帧复制（默认）| `convert-formats.sh in.mp4` | QuickTime/Safari/Chrome/VLC 全通 | 通用交付、上传平台、社交媒体 |
| minterpolate 插帧 | `convert-formats.sh in.mp4 --minterpolate` | macOS QuickTime/Safari 可能拒打 | B站等需要真插帧的展示场景，**交付前必须本地测**目标播放器 |

为什么默认改成帧复制？minterpolate 输出的 H.264 elementary stream 有 known compat bug——之前默认 minterpolate 时多次踩到「macOS QuickTime 打不开」的问题。详见 `animation-pitfalls.md` §14。

`gif_width` 参数：
- 960（默认）—— 社交平台通用
- 1280 —— 更清晰但文件更大
- 600 —— Twitter/X 优先加载

## 完整流程（标准推荐）

用户说「导出视频」后：

```bash
cd <composition-dir>

# 1. 渲染 MP4（30fps 标准质量）
npx hyperframes render --output output.mp4 --fps 30 --quality high

# 2. 可选：生成 GIF
bash scripts/convert-formats.sh output.mp4

# 3. 可选：加 BGM
bash scripts/add-music.sh output.mp4 --mood=tech

# 产出清单：
# output.mp4         (30fps · 1-2 MB)
# output.gif         (15fps · 2-4 MB)
# output-bgm.mp4    (带音乐)
```

如需 60fps：
```bash
npx hyperframes render --output output-60fps.mp4 --fps 60 --quality high
```

## HyperFrames Composition 格式

### 必需文件

每个 composition 目录需要：
- `index.html` — 主 composition 文件
- `hyperframes.json` — 配置文件
- `meta.json` — 元数据

### HTML 结构

```html
<div id="root" data-composition-id="main"
     data-start="0" data-duration="10"
     data-width="1920" data-height="1080">
  <!-- 内容 -->
</div>
```

### GSAP Timeline 规则

- 所有 timeline 必须 `{ paused: true }`
- 注册到 `window.__timelines["main"]`
- 不要用 `repeat: -1`（无限循环会破坏捕获引擎）
- 入场用 `gsap.from()`，退场用 `gsap.to()`

### 预制模板

在 `assets/hyperframes-templates/` 下提供 4 个 VI 化模板：

| 模板 | 时长 | 用途 |
|------|------|------|
| `logo-reveal/` | 5s | 品牌 Logo 揭示 |
| `product-reveal/` | 5s | 产品展示 |
| `brand-sizzle/` | 12s | 品牌宣传片（多场景） |
| `terminal-typing/` | 8s | 终端打字效果 |

使用方式：
```bash
cp -r assets/hyperframes-templates/logo-reveal/ my-video/
# 编辑 my-video/index.html
npx hyperframes render --output my-video.mp4
```

## 技术细节（排错用）

### HyperFrames 渲染模型

- **确定性 seek-and-capture**：每帧独立定位（frame / fps = seconds），不依赖实时播放
- **并行捕获**：多 worker 同时捕获不同帧段，渲染速度随 CPU 核心数线性提升
- **Chrome beginFrame API**：原子级帧捕获，无竞态条件
- **字体处理**：自动从 Google Fonts 拉取映射字体；自定义字体需 @font-face 声明

### 常见问题

| 问题 | 解决 |
|------|------|
| 字体 fallback 警告 | 使用 HyperFrames 映射字体名（如 `Inter` 代替 `Helvetica`）或添加 @font-face |
| 动画不播放 | 确认 timeline 注册到 `window.__timelines` 且 `paused: true` |
| 渲染超时 | 检查是否有 `repeat: -1` 或无限循环 |
| 黑帧 | 确认 `data-duration` 覆盖了所有动画时间 |

### GIF palette 为何要两阶段

GIF 只能 256 色。一次 pass 的 GIF 会把全动画色彩压到 256 色通用 palette，对米色底+橙色这种细腻配色会糊。

两阶段：
1. `palettegen=stats_mode=diff` —— 先扫描全片，生成**针对此动画的 optimal palette**
2. `paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle` —— 用这个 palette 编码，rectangle diff 只更新变化区域，大幅减小文件

对 fade 过渡用 `dither=bayer` 比 `none` 更平滑，但文件大一点。

## Pre-flight check（导出前）

导出前 30 秒自检：

- [ ] HTML 在浏览器里完整跑过一遍，无控制台错误
- [ ] 动画第 0 帧是完整初始状态（不是空白加载中）
- [ ] 动画最后一帧是稳定的收尾状态（不是半截）
- [ ] 字体/图片/emoji 全部正常渲染（参考 `animation-pitfalls.md`）
- [ ] Duration 参数与 HTML 里的实际动画时长匹配
- [ ] HTML 中 Stage 检测 `window.__recording` 强制 loop=false（手写 Stage 必查；用 `assets/animations.jsx` 自带）
- [ ] 结尾 Sprite 的 `fadeOut={0}`（视频末帧不淡出）
- [ ] 含「Created by YY-Design」水印（仅动画场景必加；第三方品牌作品加「非官方出品 · 」前缀。详见 SKILL.md §「Skill 推广水印」）

## 交付时附带的说明

导出完成后给用户的标准说明格式：

```
**完整交付**

| 文件 | 格式 | 规格 | 大小 |
|---|---|---|---|
| foo.mp4 | MP4 | 1920×1080 · 25fps · H.264 | X MB |
| foo-60fps.mp4 | MP4 | 1920×1080 · 60fps（运动插帧）· H.264 | X MB |
| foo.gif | GIF | 960×540 · 15fps · palette 优化 | X MB |

**说明**
- 60fps 用 minterpolate 做运动估计插帧，transform 动画效果好
- GIF 用 palette 优化，30s 动画可压到 3MB 左右

要换尺寸或帧率说一声。
```

## 常见用户追加需求

| 用户说 | 应对 |
|---|---|
| 「太大了」 | MP4：提高 CRF 到 23-28；GIF：降分辨率到 600 或 fps 到 10 |
| 「GIF 太糊」 | 提高 `gif_width` 到 1280；或者建议用 MP4 代替（微信朋友圈也支持） |
| 「要竖屏 9:16」 | 改 HTML 源的 `--width=1080 --height=1920`，重新录 |
| 「加水印」 | ffmpeg 加 `-vf "drawtext=..."` 或 `overlay=` 一个 PNG |
| 「要透明背景」 | MP4 不支持 alpha；用 WebM VP9 + alpha 或 APNG |
| 「要无损」 | CRF 改 0 + preset veryslow（文件会大 10 倍） |
