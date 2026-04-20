# Mushaf — Project Context

A Next.js web app for creating Quranic verse images with elegant Arabic typography. Users type Arabic text, pick a font, tweak style settings, and export a transparent PNG.

---

## Stack

- **Next.js 16** (App Router, `"use client"` components only — no server components with data)
- **Tailwind CSS v4**
- **TypeScript**
- All rendering is **client-side Canvas API** — no server-side image generation

---

## File Map

```
app/
  page.tsx                   — Root page, all state lives here
  layout.tsx                 — Root layout (minimal)
  globals.css                — Tailwind base + global styles
  types/index.ts             — TextConfig, TextConfigAction, FontDefinition types
  lib/
    fonts.ts                 — FONTS array (FontDefinition[]) + helpers: getFontById, getFontCssName, DEFAULT_FONT_ID
    renderText.ts            — renderTextToCanvas(config, canvas?, options) → { canvas, height }
    exportPng.ts             — exportPng(config) → downloads transparent PNG (2× scale); iOS falls back to window.open
  hooks/
    useFontLoader.ts         — loadFont, isFontLoaded, isFontLoading, preloadFonts; uses module-level cache (fontStatusCache Map)
    useCanvasRenderer.ts     — wires config → debounced renderTextToCanvas call on a canvasRef
  components/
    TextInput.tsx            — RTL textarea; auto-resizes; links to quran.com; changes apply immediately to config
    FontPicker.tsx           — Dropdown font selector grouped by category; loads fonts on open; preview text per font
    StyleControls.tsx        — All style sliders/buttons; writes to draft state (NOT config); has Save Settings button
    CanvasPreview.tsx        — Renders canvas via useCanvasRenderer; checkerboard background; shows font loading state
    ExportButton.tsx         — Calls exportPng; detects in-app browsers (Instagram, TikTok, etc.) to show warning
```

---

## Core Types (`app/types/index.ts`)

```typescript
interface TextConfig {
  text: string;
  fontId: string;
  fontSize: number;       // 24–200
  color: string;          // hex
  align: 'right' | 'center' | 'left';
  lineHeight: number;     // 1.2–3.0
  canvasWidth: 1080 | 1920 | 2560;
}

type TextConfigAction =
  | { type: 'SET_TEXT';         payload: string }
  | { type: 'SET_FONT';         payload: string }
  | { type: 'SET_FONT_SIZE';    payload: number }
  | { type: 'SET_COLOR';        payload: string }
  | { type: 'SET_ALIGN';        payload: TextAlign }
  | { type: 'SET_LINE_HEIGHT';  payload: number }
  | { type: 'SET_CANVAS_WIDTH'; payload: CanvasWidth }
  | { type: 'SET_ALL';          payload: TextConfig };  // bulk replace
```

---

## State Architecture (`app/page.tsx`)

Two separate states with different commit timing:

| State | Type | Purpose | Updates when |
|---|---|---|---|
| `config` | `useReducer(reducer, DEFAULT_CONFIG)` | Canvas rendering, export, localStorage persistence | `SET_TEXT` (immediate) or `SET_ALL` (on Save) |
| `draft` | `useState<TextConfig>` | Style controls UI | Any style control interaction |

**Key rule:** Text input dispatches directly to `config` (immediate re-render). All style controls (font, fontSize, color, align, lineHeight, canvasWidth) write to `draft` only. Canvas only re-renders when `config` changes.

**Save flow:**
```typescript
const STYLE_FIELDS = ['fontId','fontSize','color','align','lineHeight','canvasWidth'] as const;
const hasChanges = STYLE_FIELDS.some(k => draft[k] !== config[k]);

function handleSave() {
  dispatch({ type: "SET_ALL", payload: { ...config, ...draft } });
  // config.text is preserved; draft style fields overwrite
}
```

**Hydration:** On mount, `loadConfig()` reads localStorage → dispatches `SET_ALL` to `config` AND calls `setDraft(saved)` to keep them in sync.

**Persistence:** `useEffect` on `config` writes to `localStorage` key `"mushaf-config-v1"`.

---

## Font System

- All fonts are **self-hosted** in `public/fonts/` (TTF/OTF)
- Loaded at runtime via `FontFace` API and added to `document.fonts`
- Module-level `fontStatusCache: Map<string, 'idle'|'loading'|'loaded'|'error'>` prevents duplicate loads across re-renders
- Default font: `pdms-saleem` (PDMS Saleem Quran)
- Font categories: `quranic`, `naskh`, `modern`, `display`
- Font loading is triggered by **draft fontId changes** (not config) so the preview in FontPicker works before Save

---

## Canvas Rendering (`app/lib/renderText.ts`)

- `renderTextToCanvas(config, existingCanvas?, { scale })` — pure function, works in browser only
- Renders RTL Arabic text with word-wrap to fit `canvasWidth - 120px` padding
- Canvas height is dynamic (grows with text/line-height)
- `useCanvasRenderer` hook debounces renders by 100ms on any `config` change
- Export uses `scale: 2` (2× resolution); preview uses `window.devicePixelRatio`

---

## Component Props Quick Reference

```typescript
// CanvasPreview
{ config: TextConfig; isFontLoaded: fn; isFontLoading: fn }

// ExportButton
{ config: TextConfig; isFontLoaded: fn }

// TextInput
{ value: string; onChange: (text: string) => void }

// FontPicker
{ selectedFontId: string; onSelect: (id: string) => void;
  loadFont: fn; isFontLoaded: fn; isFontLoading: fn }
// NOTE: selectedFontId and onSelect are wired to `draft`, not `config`

// StyleControls
{ draft: TextConfig; setDraft: Dispatch<SetStateAction<TextConfig>>;
  onSave: () => void; hasChanges: boolean }
```

---

## Notable Behaviours & Gotchas

- **No SSR data fetching** — everything is client-only; `DEFAULT_CONFIG` is the SSR-safe initial state
- **Font picker preview** reflects `draft.fontId`, not committed `config.fontId`
- **Canvas preview** always reflects committed `config` — deliberately lags behind draft
- **Export** uses committed `config` — user must Save before export reflects style changes
- **In-app browser detection** in `ExportButton` for Instagram/TikTok/etc. warns users to open in browser
- `isFontLoaded` reads from module-level cache (not React state) — stable reference, no stale closure issues
- `TextConfigAction` is a discriminated union; the reducer's `default` case returns `state` unchanged
