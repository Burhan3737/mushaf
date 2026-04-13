# Mushaf — Arabic Overlay Generator

A web app for generating transparent PNG overlays of Arabic/Quranic text, built for video editors who overlay Quran recitation subtitles in tools like Premiere Pro, CapCut, or DaVinci Resolve.

---

## What it does

- Paste or type any Arabic/Quranic text
- Pick from 28 self-hosted Arabic fonts (Quranic, Naskh, Modern, Display)
- Adjust font size, color, alignment, line height, and canvas width
- Live preview on a checkerboard background (shows transparency)
- Download a high-resolution transparent PNG ready to drop into any video editor
- All settings auto-saved in the browser — nothing resets between sessions

---

## Fonts included

28 fonts across 4 categories, all self-hosted in `public/fonts/`:

| Category | Fonts |
|----------|-------|
| Quranic & Traditional | PDMS Saleem Quran, Attari Quran, KFGQPC Uthmanic HAFS/Warsh, Amiri Quran, AL Majeed Quranic, Al Mushaf Arabic, Al Qalam Quran Majeed, me_quran, Noor e Quran, Uthmani Hafs Mushaf, Uthman TN1, Hafs Nastaleeq, Hussaini Nastaleeq, Kitab |
| Classic Naskh | Amiri, Scheherazade New |
| Modern Arabic | Noto Naskh Arabic, Noto Sans Arabic, Droid Arabic Naskh, Mada, Lateef, Harmattan, Thabit |
| Display & Decorative | Aalmaghribi, Reem Kufi, Aref Ruqaa, Jomhuria |

---

## Running locally

```bash
# Install dependencies
npm install

# Development server (localhost only)
npm run dev

# Production build + serve on all network interfaces
npm run serve

# Optional: pass a custom port
bash scripts/start.sh 8080
```

---

## Tech stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **HTML Canvas API** — text rendering, word wrap, RTL, high-DPI export
- **FontFace API** — on-demand font loading with module-level cache
- No backend, no database — fully client-side

---

## Adding missing fonts

Three fonts (Muhammadi Quranic, Ayat, Lafadz) are only available via protected download pages and aren't bundled. To add them:

1. Download the `.ttf` file from [urdunigaar.com](https://urdunigaar.com)
2. Place it in `public/fonts/` using the exact filename expected in `app/lib/fonts.ts`
3. Rebuild: `npm run serve`

---

## Deployment

Deployed on Vercel. To redeploy after changes:

```bash
npx vercel --prod
```
