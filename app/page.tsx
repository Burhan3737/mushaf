"use client";

import { useReducer, useEffect, useState } from "react";
import { TextConfig, TextConfigAction } from "./types";
import { DEFAULT_FONT_ID, getFontById } from "./lib/fonts";
import { useFontLoader } from "./hooks/useFontLoader";
import TextInput from "./components/TextInput";
import FontPicker from "./components/FontPicker";
import StyleControls from "./components/StyleControls";
import CanvasPreview from "./components/CanvasPreview";
import ExportButton from "./components/ExportButton";

const STORAGE_KEY = "mushaf-config-v1";

const DEFAULT_CONFIG: TextConfig = {
  text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
  fontId: DEFAULT_FONT_ID,
  fontSize: 72,
  color: "#ffffff",
  align: "center",
  lineHeight: 1.8,
  canvasWidth: 1920,
};

// Only called client-side (inside useEffect), never during SSR
function loadConfig(): TextConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const saved = JSON.parse(raw) as Partial<TextConfig>;
    return { ...DEFAULT_CONFIG, ...saved };
  } catch {
    return DEFAULT_CONFIG;
  }
}

function reducer(state: TextConfig, action: TextConfigAction): TextConfig {
  switch (action.type) {
    case "SET_TEXT":
      return { ...state, text: action.payload };
    case "SET_FONT":
      return { ...state, fontId: action.payload };
    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.payload };
    case "SET_COLOR":
      return { ...state, color: action.payload };
    case "SET_ALIGN":
      return { ...state, align: action.payload };
    case "SET_LINE_HEIGHT":
      return { ...state, lineHeight: action.payload };
    case "SET_CANVAS_WIDTH":
      return { ...state, canvasWidth: action.payload };
    case "SET_ALL":
      return { ...action.payload };
    default:
      return state;
  }
}

export default function HomePage() {
  // Always start with DEFAULT_CONFIG (safe for SSR), then hydrate from localStorage
  const [config, dispatch] = useReducer(reducer, DEFAULT_CONFIG);
  const [draft, setDraft] = useState<TextConfig>(DEFAULT_CONFIG);
  const { loadFont, isFontLoaded, isFontLoading, preloadFonts } =
    useFontLoader();

  // On mount: restore from localStorage (runs client-only, after hydration)
  useEffect(() => {
    const saved = loadConfig();
    // Only dispatch if something differs from the default
    if (JSON.stringify(saved) !== JSON.stringify(DEFAULT_CONFIG)) {
      dispatch({ type: "SET_ALL", payload: saved });
      setDraft(saved);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      /* quota exceeded */
    }
  }, [config]);

  // Load default font on mount
  useEffect(() => {
    const font = getFontById(DEFAULT_FONT_ID);
    if (font) loadFont(font);
    // Preload viral favorites in background
    preloadFonts([
      "pdms-saleem",
      "amiri-quran",
      "kfgqpc-hafs",
      "amiri",
      "scheherazade",
      "noto-naskh",
      "al-mushaf",
      "me-quran",
    ]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load font whenever draft font selection changes
  useEffect(() => {
    const font = getFontById(draft.fontId);
    if (font && !isFontLoaded(font.id)) {
      loadFont(font);
    }
  }, [draft.fontId]); // eslint-disable-line react-hooks/exhaustive-deps

  const STYLE_FIELDS = ['fontId', 'fontSize', 'color', 'align', 'lineHeight', 'canvasWidth'] as const;
  const hasChanges = STYLE_FIELDS.some((k) => draft[k] !== config[k]);

  function handleSave() {
    dispatch({ type: "SET_ALL", payload: { ...config, ...draft } });
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <span
                className="text-amber-400 text-sm font-bold"
                style={{ fontFamily: "serif" }}
              >
                م
              </span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">Mushaf</h1>
              <p className="text-xs text-neutral-500">
                Create Quran verses in elegant Arabic typography
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Footer banner */}
      <div className="border-b border-neutral-800 bg-neutral-900/50 py-2 px-4">
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-neutral-500">
          <span>
            Made with <span className="text-red-500">♥</span> for the Ummah by{" "}
            <a
              href="https://instagram.com/bhn.recites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              @bhn.recites
            </a>
          </span>
        </div>
      </div>

      {/* Main layout: 2-column on desktop */}
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">
          {/* Left: Preview (sticky on desktop) */}
          <div className="lg:sticky lg:top-20">
            <CanvasPreview
              config={config}
              isFontLoaded={isFontLoaded}
              isFontLoading={isFontLoading}
            />
            <div className="mt-4">
              <ExportButton config={config} isFontLoaded={isFontLoaded} />
            </div>
          </div>

          {/* Right: Controls */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-5">
              <TextInput
                value={config.text}
                onChange={(text) =>
                  dispatch({ type: "SET_TEXT", payload: text })
                }
              />
              <FontPicker
                selectedFontId={draft.fontId}
                onSelect={(fontId) =>
                  setDraft((prev) => ({ ...prev, fontId }))
                }
                loadFont={loadFont}
                isFontLoaded={isFontLoaded}
                isFontLoading={isFontLoading}
              />
              <StyleControls
                draft={draft}
                setDraft={setDraft}
                onSave={handleSave}
                hasChanges={hasChanges}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
