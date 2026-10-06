#!/bin/bash
# Rebuild remotion-ads/public/clips/ — one short 1080x1920 clip per scene.
#
# Each clip is center-cropped to 9:16 from the portfolio's local originals
# (public/videos/originals/, gitignored — see the root README "Media").
# Clips run 1.6s, a hair longer than the 1s each scene is on screen, so
# the composition has headroom. The scene order here must match SCENES in
# src/Ad.tsx.
#
#   bash remotion-ads/scripts/extract-scenes.sh
set -euo pipefail

FFMPEG="${FFMPEG:-/Users/franciscoalencar/Library/Python/3.14/lib/python/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1}"
HERE="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$HERE/../public/videos/originals"
OUT="$HERE/public/clips"
mkdir -p "$OUT"

# index:duration:source:start_seconds
#   source is a film slug in originals/, or still:<file> under assets/
SCENES=(
  "00:2.6:beyond-the-map:7"          # intro — Rio aerial
  "01:1.6:google-search-mojo:9"      # HELLO
  "02:1.6:proud-to-play:74"          # I
  "03:1.6:nubank-croma:3.1"          # AM — deciding at the table; clean of burned-in subs
  "04:1.6:beyond-the-map:24"         # FRANCISCO — Rocinha
  "05:1.6:moto-g9:15.6"              # CHAMPS — rooftop dancer, arm up at 15.9s; cut at 16.85s
  "06:1.6:youtube-brazil-reel:29"    # CREATIVE
  "07:1.6:project-loon:89"           # STRATEGIST
  "08:1.6:we-speak-translate:69"     # SCREENWRITER
  "09:1.6:still:compliance-zero-key-art.png"  # AI MAKER — a game built with Claude
  "10:1.6:ta-na-rede:29"             # FROM
  "11:1.6:beyond-the-map:10"         # BRAZIL — Rio callback
)

# Center-crop to 9:16 whatever the source aspect, then scale to 1080x1920.
CROP="crop='min(iw,ih*9/16)':'min(ih,iw*16/9)':(iw-min(iw\\,ih*9/16))/2:(ih-min(ih\\,iw*16/9))/2"
ENC=(-c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -r 30 -movflags +faststart -an)

for spec in "${SCENES[@]}"; do
  IFS=":" read -r idx dur src start <<< "$spec"
  out="$OUT/scene-${idx}.mp4"
  if [[ "$src" == "still" ]]; then
    # Pixel art: double with nearest-neighbour first so pixels stay square,
    # then a clean lanczos pass down to the target.
    "$FFMPEG" -y -loop 1 -i "$HERE/assets/$start" -t "$dur" \
      -vf "scale=iw*2:ih*2:flags=neighbor,$CROP,scale=1080:1920:flags=lanczos,setsar=1" \
      "${ENC[@]}" "$out" >/dev/null 2>&1
    echo "[$idx] still $start → $(basename "$out")"
  else
    "$FFMPEG" -y -ss "$start" -i "$SRC/$src.mp4" -t "$dur" \
      -vf "$CROP,scale=1080:1920:flags=lanczos,setsar=1" \
      "${ENC[@]}" "$out" >/dev/null 2>&1
    echo "[$idx] $src @ ${start}s → $(basename "$out")"
  fi
done
