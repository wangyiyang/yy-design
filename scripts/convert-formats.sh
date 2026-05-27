#!/bin/bash
# Convert MP4 animations to 60fps MP4 and optimized GIF.
#
# Usage:
#   ./convert-formats.sh input.mp4 [gif_width] [--minterpolate] [--skip-60fps]
#
# Produces next to the input:
#   <name>-60fps.mp4   (1920x1080, 60fps, frame-duplicated by default)
#   <name>.gif         (scaled width, 15fps, palette-optimized)
#
# Flags:
#   --minterpolate     Enable motion-compensated interpolation
#   --skip-60fps       Skip 60fps conversion (use when source is already 60fps,
#                      e.g. rendered by HyperFrames with --fps 60)
#
# HyperFrames note: If your source is already 30fps+ from HyperFrames,
# the 60fps conversion is optional. Use --skip-60fps to only generate GIF.
# The script auto-detects source fps and skips if already >= 60.

set -e

INPUT=""
GIF_WIDTH="960"
USE_MINTERPOLATE=0
SKIP_60FPS=0
for arg in "$@"; do
  case "$arg" in
    --minterpolate) USE_MINTERPOLATE=1 ;;
    --skip-60fps) SKIP_60FPS=1 ;;
    --*) echo "Unknown flag: $arg" >&2; exit 1 ;;
    *)
      if [ -z "$INPUT" ]; then INPUT="$arg"
      else GIF_WIDTH="$arg"
      fi
      ;;
  esac
done
[ -z "$INPUT" ] && { echo "Usage: $0 input.mp4 [gif_width] [--minterpolate] [--skip-60fps]" >&2; exit 1; }

DIR=$(dirname "$INPUT")
BASE=$(basename "$INPUT" .mp4)
OUT60="$DIR/$BASE-60fps.mp4"
OUTGIF="$DIR/$BASE.gif"
PAL="$DIR/.palette-$BASE.png"

# Auto-detect source fps
SRC_FPS=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 "$INPUT" 2>/dev/null | head -1)
SRC_FPS_NUM=$(echo "$SRC_FPS" | awk -F/ '{if(NF==2) printf "%.0f", $1/$2; else print $1}')
if [ "$SRC_FPS_NUM" -ge 60 ] 2>/dev/null; then
  SKIP_60FPS=1
  echo "▸ Source is ${SRC_FPS_NUM}fps, skipping 60fps conversion"
fi

if [ "$SKIP_60FPS" = "0" ]; then
  if [ "$USE_MINTERPOLATE" = "1" ]; then
    echo "▸ 60fps interpolate (minterpolate): $OUT60"
    VFILTER="minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1"
  else
    echo "▸ 60fps frame-duplicate (compat mode): $OUT60"
    VFILTER="fps=60"
  fi

  ffmpeg -y -loglevel error -i "$INPUT" \
    -vf "$VFILTER" \
    -c:v libx264 -pix_fmt yuv420p -profile:v high -level 4.0 \
    -crf 18 -preset medium -movflags +faststart \
    "$OUT60"
  MP4_SIZE=$(du -h "$OUT60" | cut -f1)
  echo "  ✓ $MP4_SIZE"
fi

echo "▸ GIF (${GIF_WIDTH}w, 15fps, palette-optimized): $OUTGIF"
# Pass 1: generate palette tailored to this video
ffmpeg -y -loglevel error -i "$INPUT" \
  -vf "fps=15,scale=${GIF_WIDTH}:-1:flags=lanczos,palettegen=stats_mode=diff" \
  "$PAL"
# Pass 2: apply palette with dithering
ffmpeg -y -loglevel error -i "$INPUT" -i "$PAL" \
  -lavfi "fps=15,scale=${GIF_WIDTH}:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" \
  "$OUTGIF"
rm -f "$PAL"
GIF_SIZE=$(du -h "$OUTGIF" | cut -f1)
echo "  ✓ $GIF_SIZE"
