#!/bin/bash
#
# YY Design · 批量生成所有品牌资产
#
# 一键生成所有类型的品牌资产 prompt
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"

ASSETS_DIR="$PARENT_DIR/../assets/generated"
DATE_CODE=$(date +%y%mdd)

echo "========================================"
echo "  YY Design · 批量品牌资产生成"
echo "========================================"
echo ""

# 确保目录存在
mkdir -p "$ASSETS_DIR"/{avatar,banner,og,editorial,logo,hero}

# 定义要生成的资产列表
declare -a ASSETS=(
  "avatar:enso"
  "avatar:inkdrop"
  "avatar:brush"
  "avatar:square"
  "banner:mountain"
  "banner:horizon"
  "og:square"
  "og:enso"
  "og:minimal"
  "editorial:inkdrop"
  "editorial:brushstroke"
  "editorial:mountain"
  "logo:primary"
  "logo:minimal"
  "logo:abstract"
  "hero:enso"
  "hero:mountain"
  "hero:inkdrop"
)

# 批量生成
for asset in "${ASSETS[@]}"; do
  IFS=':' read -r type variant <<< "$asset"
  echo "生成: $type / $variant"
  "$PARENT_DIR/generate-brand-assets.sh" "$type" "$variant" > /dev/null 2>&1 || true
  echo "  ✅ 完成"
done

echo ""
echo "========================================"
echo "  所有品牌资产生成完成！"
echo "========================================"
echo ""
echo "输出目录: $ASSETS_DIR"
echo ""
echo "请使用生成的 prompt 文件在以下平台生成图片:"
echo "  - Midjourney"
echo "  - Flux"
echo "  - GPT-Image"
echo "  - Seedream"
echo "  - Stable Diffusion"
