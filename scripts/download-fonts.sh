#!/usr/bin/env bash
# Downloads all Quranic and Arabic fonts into public/fonts/
# Run from project root: bash scripts/download-fonts.sh

set -euo pipefail
DEST="public/fonts"
mkdir -p "$DEST"

echo "Downloading Arabic/Quranic fonts to $DEST..."

# ── Google Fonts (woff2 → saved as .woff2) ────────────────────────────────────
download_google() {
  local name="$1"
  local url="$2"
  local out="$DEST/$name"
  if [ -f "$out" ]; then
    echo "  [skip] $name already exists"
    return
  fi
  echo "  Downloading $name..."
  curl -fsSL "$url" -o "$out" || echo "  WARNING: Failed to download $name"
}

# Amiri (Regular)
download_google "AmiriQuran-Regular.ttf" \
  "https://github.com/alif-type/amiri/releases/download/1.000/Amiri-1.000.zip"

# We'll get the actual individual files via direct GitHub/CDN links:

# Amiri Quran
download_google "AmiriQuran-Regular.ttf" \
  "https://github.com/alif-type/amiri/raw/master/AmiriQuran-Regular.ttf"

# Amiri Regular
download_google "Amiri-Regular.ttf" \
  "https://github.com/alif-type/amiri/raw/master/Amiri-Regular.ttf"

# Scheherazade New
download_google "ScheherazadeNew-Regular.ttf" \
  "https://github.com/silnrsi/font-scheherazade/releases/download/3.300/ScheherazadeNew-3.300.zip"
  # (use individual file)
download_google "ScheherazadeNew-Regular.ttf" \
  "https://github.com/silnrsi/font-scheherazade/raw/master/results/ScheherazadeNew-Regular.ttf"

# Noto Naskh Arabic
download_google "NotoNaskhArabic-Regular.ttf" \
  "https://github.com/notofonts/arabic/raw/main/fonts/NotoNaskhArabic/unhinted/ttf/NotoNaskhArabic-Regular.ttf"

# Noto Sans Arabic
download_google "NotoSansArabic-Regular.ttf" \
  "https://github.com/notofonts/arabic/raw/main/fonts/NotoSansArabic/unhinted/ttf/NotoSansArabic-Regular.ttf"

# Lateef
download_google "Lateef-Regular.ttf" \
  "https://github.com/silnrsi/font-lateef/raw/master/results/Lateef-Regular.ttf"

# Harmattan
download_google "Harmattan-Regular.ttf" \
  "https://github.com/silnrsi/font-harmattan/raw/master/results/Harmattan-Regular.ttf"

# Reem Kufi (Google Fonts GitHub)
download_google "ReemKufi-Regular.ttf" \
  "https://github.com/google/fonts/raw/main/ofl/reemkufi/ReemKufi%5Bwght%5D.ttf"

# Aref Ruqaa
download_google "ArefRuqaa-Regular.ttf" \
  "https://github.com/google/fonts/raw/main/ofl/arefruqaa/ArefRuqaa-Regular.ttf"

# Jomhuria
download_google "Jomhuria-Regular.ttf" \
  "https://github.com/google/fonts/raw/main/ofl/jomhuria/Jomhuria-Regular.ttf"

# Mada
download_google "Mada-Regular.ttf" \
  "https://github.com/khaledhosny/mada/raw/master/Mada-Regular.ttf"

# KFGQPC Uthmanic Script HAFS (from qurancomplex.gov.sa)
download_google "KFGQPCUthmanicScriptHAFS.otf" \
  "https://fonts.qurancomplex.gov.sa/wp-content/fonts/KFGQPCUthmanicScriptHAFS.otf"

# KFGQPC Uthmanic Warsh
download_google "KFGQPCUthmanicScriptWarsh.otf" \
  "https://fonts.qurancomplex.gov.sa/wp-content/fonts/KFGQPCUthmanicScriptWarsh01.otf"

echo ""
echo "Done! Fonts downloaded to $DEST/"
echo ""
echo "Self-hosted fonts that need manual download (not freely available via direct URL):"
echo "  - PDMS_Saleem_QuranFont.ttf    → https://www.pdms.org/fonts/"
echo "  - MuhammadiQuranic.ttf         → Search 'Muhammadi Quranic font download'"
echo "  - Kitab-Regular.ttf            → https://github.com/microsoft/font-tools or web search"
echo "  - HussainiNastaleeq.ttf        → Search 'Hussaini Nastaleeq font download'"
echo "  - AL_Majeed_Quranic.ttf        → https://urdunigaar.com"
echo "  - Al_Mushaf_Arabic.ttf         → https://urdunigaar.com"
echo "  - Ayat.ttf                     → https://urdunigaar.com"
echo "  - me_quran.ttf                 → Search 'me_quran font download'"
echo "  - Al_Qalam_Quran_Majeed.ttf    → https://urdunigaar.com"
echo "  - KFGQPCTajweed.ttf            → https://fonts.qurancomplex.gov.sa"
echo "  - UthmaniHafsMushaf.ttf        → Search 'Uthmani Hafs Mushaf font'"
echo "  - Aalmaghribi.ttf              → Search 'Aalmaghribi font download'"
echo "  - Lafadz.ttf                   → https://urdunigaar.com"
echo "  - DroidArabicNaskh-Regular.ttf → Search 'Droid Arabic Naskh ttf download'"
echo ""
echo "Place missing fonts in public/fonts/ and the app will pick them up automatically."
