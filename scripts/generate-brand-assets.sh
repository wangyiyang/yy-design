#!/bin/bash
#
# YY Design · 品牌资产生成脚本
#
# 基于 VI 规范自动生成品牌资产
# 用法: ./generate-brand-assets.sh [type] [variant]
# 示例: ./generate-brand-assets.sh avatar enso
#

set -e

# ========== 配置 ==========
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ASSETS_DIR="$PROJECT_DIR/assets/generated"
DATE_CODE=$(date +%y%m%d)

# 品牌色
SUMI="#0A0A0A"
WASHI="#FAFAFA"
VERMILLION="#C0392B"
GOLD="#B8860B"

# 品牌信息
BRAND_NAME="BRAND_NAME"
BRAND_EN="YY Design"
TAGLINE="Code, one stroke at a time."
AUTHOR="AUTHOR"
AUTHOR_EN="Ian"
WEBSITE="OWNER.cc"
GITHUB="OWNER"
EMAIL="OWNER.kk@gmail.com"

# ========== 帮助 ==========
usage() {
    cat << EOF
YY Design 品牌资产生成脚本

用法: $0 [type] [variant]

类型 (type):
  avatar      - 头像 (1:1, 1024x1024)
  banner      - 横幅 (3:1, 1500x500)
  og          - 分享卡片 (1.91:1, 1200x630)
  editorial   - 文章配图 (4:3, 1600x1200)
  logo        - Logo 探索 (1:1, 2048x2048)
  hero        - 产品主视觉 (16:9, 2560x1440)
  business-card - 名片 (90mm x 54mm)
  social      - 社交媒体 Banner (多尺寸)

变体 (variant):
  avatar:  enso, inkdrop, brush, square
  banner:  mountain, horizon, dissolve
  og:      square, enso, minimal
  editorial: inkdrop, brushstroke, mountain
  logo:    primary, minimal, abstract
  hero:    enso, mountain, inkdrop

示例:
  $0 avatar enso
  $0 banner mountain
  $0 og square
  $0 business-card
  $0 social

EOF
    exit 1
}

# ========== Prompt 生成器 ==========
generate_prompt() {
    local type=$1
    local variant=$2
    
    local STYLE_SUFFIX="minimalist, zen aesthetic, sumi-e ink wash, 80% negative space, single vermillion accent dot, matte gold leaf texture, luxury brand quality, abstract over literal, suggestion over description, high contrast, cinematic lighting, ultra-detailed, 8k"
    
    local NEGATIVE="ninja, shuriken, katana, ninja headband, cyberpunk, neon, gradient background, multiple red accents, busy composition, literal oriental elements, cherry blossom, koi fish, mount fuji, cartoon, anime, 3d render, glossy, plastic"
    
    case "$type" in
        avatar)
            case "$variant" in
                enso)
                    echo "A single enso (zen circle), incomplete with one gap, drawn in sumi ink on washi paper, 80% white space, a single vermillion dot at the gap, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
                inkdrop)
                    echo "A single drop of ink captured mid-fall, frozen in time, sumi ink on washi paper, 80% white space, a single vermillion dot at the center of the drop, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
                brush)
                    echo "A single bold brush stroke, starting thick and fading to nothing, sumi ink on washi paper, 80% white space, a single vermillion dot at the end of the stroke, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
                square)
                    echo "A perfect black square void, slightly off-center, sumi ink on washi paper, 80% white space, a single vermillion dot at the bottom right corner, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
            esac
            ;;
        banner)
            case "$variant" in
                mountain)
                    echo "Wide panoramic composition, a distant mountain silhouette dissolving in fog, sumi ink wash style, 80% negative space, matte gold leaf texture at the horizon line, single vermillion seal stamp in the corner, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
                horizon)
                    echo "Wide panoramic composition, a single horizontal ink stroke dividing sky and water, sumi ink wash style, 80% negative space, matte gold leaf texture along the stroke, single vermillion dot at the center, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
                dissolve)
                    echo "Wide panoramic composition, a geometric form slowly dissolving into particles, sumi ink wash style, 80% negative space, matte gold leaf particles in the dissolving area, single vermillion dot at the origin point, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
            esac
            ;;
        og)
            case "$variant" in
                square)
                    echo "Square composition, a perfect black square void slightly off-center on white background, single vermillion dot at the bottom right corner of the square, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
                enso)
                    echo "Square composition, a single enso (zen circle) in the center, incomplete with one gap, sumi ink on washi paper, single vermillion dot at the gap, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
                minimal)
                    echo "Square composition, the character {BRAND_CHAR} rendered in elegant brush calligraphy, centered, with a single vermillion dot inside the right brace, on pure white background, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
            esac
            ;;
        editorial)
            case "$variant" in
                inkdrop)
                    echo "A single drop of ink blooming on paper, captured at the moment of contact, sumi ink wash style, 80% white space, subtle gold leaf particles in the ink, macro photography style, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
                brushstroke)
                    echo "A single bold brush stroke on washi paper, sumi ink, captured in extreme close-up, showing ink bleeding into paper fibers, 80% white space, single vermillion dot at the end, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
                mountain)
                    echo "Minimalist mountain silhouette in sumi ink, single peak, vast empty sky, 80% negative space, subtle gold leaf shimmer on the peak, single vermillion dot as sun, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
            esac
            ;;
        logo)
            case "$variant" in
                primary)
                    echo "Minimalist logo design, the Chinese character BRAND_CHAR inside elegant curly braces { }, rendered in bold sumi ink brush calligraphy, single vermillion dot accent, on pure white background, clean vector style, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
                minimal)
                    echo "Ultra-minimalist logo, a single enso circle with a small gap, inside the gap a tiny vermillion dot, black ink on white, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
                abstract)
                    echo "Abstract geometric logo, a perfect square with one corner dissolving into ink particles, single vermillion dot at the dissolving corner, black and white with one red accent, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
            esac
            ;;
        hero)
            case "$variant" in
                enso)
                    echo "Cinematic wide shot, a massive enso circle drawn in sumi ink floating in dark void, 80% negative space, single vermillion dot at the gap, matte gold leaf texture on the ink stroke, dramatic lighting, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
                mountain)
                    echo "Cinematic landscape, single mountain peak emerging from clouds, sumi ink wash style, vast empty sky, subtle gold leaf on the peak, single vermillion dot as distant sun, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
                inkdrop)
                    echo "Cinematic macro shot, a single drop of ink falling into still water, creating perfect concentric ripples, sumi ink style, 80% dark negative space, single vermillion reflection in the water, $STYLE_SUFFIX --negative-prompt: $NEGATIVE"
                    ;;
            esac
            ;;
    esac
}

# ========== 尺寸信息 ==========
get_size_info() {
    local type=$1
    case "$type" in
        avatar)      echo "1024x1024 (1:1)" ;;
        banner)      echo "1500x500 (3:1)" ;;
        og)          echo "1200x630 (1.91:1)" ;;
        editorial)   echo "1600x1200 (4:3)" ;;
        logo)        echo "2048x2048 (1:1)" ;;
        hero)        echo "2560x1440 (16:9)" ;;
        business-card) echo "90mm x 54mm" ;;
        social)      echo "多尺寸" ;;
    esac
}

# ========== 主逻辑 ==========
if [ $# -lt 1 ]; then
    usage
fi

TYPE=$1
VARIANT=${2:-"default"}

# 确保目录存在
mkdir -p "$ASSETS_DIR"/{avatar,banner,og,editorial,logo,hero,business-card,social}

# 生成 prompt
PROMPT=$(generate_prompt "$TYPE" "$VARIANT")

if [ -z "$PROMPT" ]; then
    echo "错误: 未知类型或变体"
    usage
fi

# 输出信息
OUTPUT_NAME="yy-${TYPE}-${VARIANT}-v1-${DATE_CODE}"
OUTPUT_DIR="$ASSETS_DIR/$TYPE"
SIZE_INFO=$(get_size_info "$TYPE")

echo "========================================"
echo "  YY Design · 品牌资产生成"
echo "========================================"
echo ""
echo "类型: $TYPE"
echo "变体: $VARIANT"
echo "尺寸: $SIZE_INFO"
echo "输出目录: $OUTPUT_DIR"
echo ""
echo "--- Prompt ---"
echo "$PROMPT"
echo ""
echo "========================================"
echo ""

# 保存 prompt 到文件
PROMPT_FILE="$OUTPUT_DIR/${OUTPUT_NAME}.txt"
echo "$PROMPT" > "$PROMPT_FILE"
echo "✅ Prompt 已保存: $PROMPT_FILE"

# 保存元数据
META_FILE="$OUTPUT_DIR/${OUTPUT_NAME}.json"
cat > "$META_FILE" << EOF
{
  "brand": "$BRAND_NAME",
  "brand_en": "$BRAND_EN",
  "author": "$AUTHOR",
  "type": "$TYPE",
  "variant": "$VARIANT",
  "date": "$DATE_CODE",
  "size": "$SIZE_INFO",
  "prompt": $(echo "$PROMPT" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read().strip()))'),
  "colors": {
    "sumi": "$SUMI",
    "washi": "$WASHI",
    "vermillion": "$VERMILLION",
    "gold": "$GOLD"
  }
}
EOF
echo "✅ 元数据已保存: $META_FILE"

echo ""
echo "提示: 使用上述 prompt 在以下平台生成图片:"
echo "  - Midjourney"
echo "  - Flux"
echo "  - GPT-Image"
echo "  - Seedream"
echo "  - Stable Diffusion"
echo ""
echo "生成后保存到: $OUTPUT_DIR/${OUTPUT_NAME}.png"
