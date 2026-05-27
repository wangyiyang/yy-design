# YY Design · VI 完整规范 v1.0

> 本页是「翊行代码」品牌的 VI v1.0 唯一规范来源。

---

## 1. 品牌色 & 基调

| 角色 | 颜色 | HEX | 用途 |
|------|------|-----|------|
| 主色（墨） | 墨黑 Sumi Black | `#0A0A0A` | 主体、文字、剪影 |
| 底色（和） | 宣白 Washi White | `#FAFAFA` | 背景、留白（70%+ 画面） |
| 强调（朱） | 朱红 Vermillion | `#C0392B` | 印章、点睛、CTA、单点高亮 |
| 辅助（金） | 哑金 Gold Leaf | `#B8860B` | 极少量奢华点缀，不主导画面 |

**核心比例感**：黑 70% · 白 25% · 红 4% · 金 1%（参考，不机械执行）。

### 1.5 品牌名 × 主视觉的天然连接

**四重意义的合一**：

- **音** · 翊行（yì háng）≈ 一行（yī háng） → 翊行代码 ↔ 一行代码 · 1 line code（程序员母语的双关，最直击的一层）
- **形** · 翊行 ≈ 一笔（one stroke） →「翊」字用一笔连续墨迹写就，对应英文 tagline Code, one stroke at a time.
- **码** · `{ }` → 几乎所有编程语言的代码块边界
- **气** · 简单 + 神秘 → 表面只是「花括号 + 一个字」，内里藏着「翊行代码」的视觉密码

`{翊}` 是「翊行代码」四字的视觉浓缩：花括号 = 代码，翊 = 行（你的一笔 / 你的一行）。一个 logo 同时讲完了「你是谁 + 你做什么 + 你怎么做」，且不可复制——抄走没有「翊」这个名字就立刻穿帮。

短描述（用于 bio / OG 副标 / GitHub README 首行）：翊行代码 · 1 line code 或 翊行代码（yì háng dài mǎ）≈ 一行代码。不起 tagline 作用，只用在需要重透品牌名内含义的场景。

### 1.6 字体系统（中文 / 英文 / 代码）

中文 + 英文 + 代码三栈，全部开源免费，**所有载体保持一致**。

| 角色 | 字体 | 权重 | 用途 |
|------|------|------|------|
| 中文标题 | 思源宋体 / Source Han Serif SC | SemiBold (600) | 公众号标题、博客 H1、海报大字 |
| 中文正文 | 思源黑体 / Source Han Sans SC | Regular (400) / Medium (500) | 公众号正文、博客正文、UI |
| 英文（标题与正文） | Inter | SemiBold (600) / Regular (400) | 英文标题、tagline、UI |
| 代码 / 等宽 | JetBrains Mono | Regular (400) | 代码块、终端截图、技术配图 |

**字号阶梯（参考）**：H1 32 · H2 24 · H3 20 · 正文 16 · 小字 14 · Caption 12（单位 px）

---

## 2. Style Suffix（拼在 prompt 末尾）

```
minimalist, zen aesthetic, sumi-e ink wash, 80% negative space, single vermillion accent dot, matte gold leaf texture, luxury brand quality, abstract over literal, suggestion over description, high contrast, cinematic lighting, ultra-detailed, 8k
```

---

## 3. Negative Prompt（禁止出现）

```
ninja, shuriken, katana, ninja headband, cyberpunk, neon, gradient background, multiple red accents, busy composition, literal oriental elements, cherry blossom, koi fish, mount fuji, cartoon, anime, 3d render, glossy, plastic
```

---

## 4. 场景模板

### 4.1 Avatar（头像）

```
A single enso (zen circle), incomplete with one gap, drawn in sumi ink on washi paper, 80% white space, a single vermillion dot at the gap, minimalist, zen aesthetic, ultra-detailed, 8k
```

### 4.2 Banner（横幅）

```
Wide panoramic composition, a distant mountain silhouette dissolving in fog, sumi ink wash style, 80% negative space, matte gold leaf texture at the horizon line, single vermillion seal stamp in the corner, minimalist, zen aesthetic, ultra-wide, cinematic, 8k
```

### 4.3 OG（分享卡片）

```
Square composition, a perfect black square void slightly off-center on white background, single vermillion dot at the bottom right corner of the square, minimalist, zen aesthetic, high contrast, ultra-detailed, 8k
```

### 4.4 Editorial（文章配图）

```
A single drop of ink blooming on paper, captured at the moment of contact, sumi ink wash style, 80% white space, subtle gold leaf particles in the ink, minimalist, zen aesthetic, macro photography style, ultra-detailed, 8k
```

---

## 5. 核心抽象意象词库

| 意象 | 英文描述 | 适用场景 |
|------|----------|----------|
| 禅圆 | a single enso (zen circle), incomplete with one gap | avatar, logo |
| 墨滴 | a single drop of ink blooming on paper | editorial, hero |
| 远山 | a distant mountain silhouette dissolving in fog | banner, hero |
| 方虚 | a perfect black square void, slightly off-center | og, logo |
| 一笔 | a single brush stroke, bold and decisive | editorial, hero |

---

## 6. 衍生变体

替换核心抽象意象，跑 4 张做对比：

1. 主体 = `a single enso (zen circle), incomplete with one gap`
2. 主体 = `a perfect black square void, slightly off-center`
3. 主体 = `a distant mountain silhouette dissolving in fog`
4. 主体 = `a single drop of ink blooming on paper`

---

## 7. 输出规范 & 命名约定

**文件命名**：`yy-{type}-{subject}-{variant}-{yymmdd}.png`

示例：`yy-avatar-enso-v2-260526.png`

| type | 用途 | 推荐比例 | 推荐尺寸 |
|------|------|----------|----------|
| avatar | 头像 | 1:1 | 1024×1024 |
| banner | 横幅 | 3:1 | 1500×500 |
| og | 分享卡片 | 1.91:1 | 1200×630 |
| editorial | 文章配图 | 4:3 | 1600×1200 |
| logo | logo 探索 | 1:1 | 2048×2048 |
| hero | 产品主视觉 | 16:9 | 2560×1440 |

---

## 8. 使用建议（避免破坏品牌一致性）

- ✅ **抽象优先，暗示优于描述**——要的是「气」不是「形」，一个 enso 圆比一个忍者更有力量。
- ✅ **永远只用 1 个朱红点**——这是「类奢牌」气质的关键，红多就俗。
- ✅ **80% 留白原则**——出图后觉得太空，是对的；觉得刚好，就是太满了。
- ✅ **先黑白后加色**——先确定形，再去想颜色。
- ❌ **不要直接画忍者、手里剑、刀剑、忍者头巾**——这是新人最容易踩的坑。
- ❌ 不要混合多种东方元素（樱花 + 锦鲤 + 富士山…太杂）。
- ❌ 不要用渐变背景、霓虹、赛博朋克——和「类奢牌」相斥。

---

## 9. 待办 & 迭代

- [x] 跑 Moodboard 找感觉
- [x] 锁定主视觉概念：`{翊}` 笔意花括号
- [x] 选定主视觉版本：行书 + 毛笔括号 + 右括号内朱红点
- [x] 锁定配色 / 字体 / Tagline / 文章模板（VI v1.0）
- [x] 锁定个人 handle：GitHub wangyiyang / 域名 wangyiyang.cc / Gmail wangyiyangkk@gmail.com
- [ ] 在 GitHub、X、知乎、小红书、即刻、B 站等平台核查并统一占用 wangyiyang
- [ ] 矢量化 Logo（拿 §10.3 brief 找设计师，预算 ¥2k–5k）
- [ ] 出首批资产四件套：Avatar / Banner / OG / 公众号封面
- [ ] 公众号 + 博客按 §11、§12 改造套用 VI
- [ ] 扩展到 favicon、名片、Slide 模板
- [ ] 把 prompt + VI 规则沉淀进个人 CLI 自动生图脚本

---

*YY Design VI v1.0 — 唯一规范来源*
