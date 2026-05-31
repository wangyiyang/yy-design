# YY Design · Prompt 模板库

> 基于 VI v1.0 规范的品牌资产生成模板

---

## 快速使用

```bash
cd scripts
./generate-brand-assets.sh [type] [variant]
```

## 模板列表

| 模板 | 用途 | 推荐比例 | 推荐尺寸 |
|------|------|----------|----------|
| [avatar.md](avatar.md) | 头像 | 1:1 | 1024×1024 |
| [banner.md](banner.md) | 横幅 | 3:1 | 1500×500 |
| [og-image.md](og-image.md) | 分享卡片 | 1.91:1 | 1200×630 |
| [editorial.md](editorial.md) | 文章配图 | 4:3 | 1600×1200 |
| [logo.md](logo.md) | Logo 探索 | 1:1 | 2048×2048 |
| [hero.md](hero.md) | 产品主视觉 | 16:9 | 2560×1440 |

## 核心规则

1. **抽象优先，暗示优于描述** — 要的是「气」不是「形」
2. **永远只用 1 个朱红点** — 类奢牌气质的关键
3. **80% 留白原则** — 觉得太空是对的，刚好就是太满
4. **先黑白后加色** — 先确定形，再想颜色
5. **所有 prompt 用英文写** — 主流图像模型对英文响应更稳定

## 核心抽象意象

| 意象 | 英文描述 | 适用场景 |
|------|----------|----------|
| 禅圆 | a single enso (zen circle), incomplete with one gap | avatar, logo |
| 墨滴 | a single drop of ink blooming on paper | editorial, hero |
| 远山 | a distant mountain silhouette dissolving in fog | banner, hero |
| 方虚 | a perfect black square void, slightly off-center | og, logo |
| 一笔 | a single brush stroke, bold and decisive | editorial, hero |

## Style Suffix（拼在所有 prompt 末尾）

```
minimalist, zen aesthetic, sumi-e ink wash, 80% negative space, single vermillion accent dot, matte gold leaf texture, luxury brand quality, abstract over literal, suggestion over description, high contrast, cinematic lighting, ultra-detailed, 8k
```

## Negative Prompt（禁止出现）

```
ninja, shuriken, katana, ninja headband, cyberpunk, neon, gradient background, multiple red accents, busy composition, literal oriental elements, cherry blossom, koi fish, mount fuji, cartoon, anime, 3d render, glossy, plastic
```

## 命名规范

```
yy-{type}-{subject}-{variant}-{yymmdd}.png
```

示例：`yy-avatar-enso-v2-260526.png`
