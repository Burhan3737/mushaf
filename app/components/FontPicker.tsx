'use client';

import { useState, useRef, useEffect } from 'react';
import { FONTS } from '../lib/fonts';
import { FontDefinition } from '../types';

interface FontPickerProps {
  selectedFontId: string;
  onSelect: (fontId: string) => void;
  loadFont: (font: FontDefinition) => Promise<boolean>;
  isFontLoaded: (fontId: string) => boolean;
  isFontLoading: (fontId: string) => boolean;
}

const PREVIEW_TEXT = 'بِسْمِ ٱللَّهِ';

const CATEGORY_LABELS: Record<string, string> = {
  quranic: 'Quranic & Traditional',
  naskh: 'Classic Naskh',
  modern: 'Modern Arabic',
  display: 'Display & Decorative',
};

const CATEGORY_ORDER = ['quranic', 'naskh', 'modern', 'display'];

export default function FontPicker({
  selectedFontId,
  onSelect,
  loadFont,
  isFontLoaded,
  isFontLoading,
}: FontPickerProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedFont = FONTS.find((f) => f.id === selectedFontId);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Preload first 6 fonts on mount
  useEffect(() => {
    FONTS.slice(0, 6).forEach((f) => loadFont(f));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (font: FontDefinition) => {
    onSelect(font.id);
    setOpen(false);
    if (!isFontLoaded(font.id)) loadFont(font);
  };

  // Load fonts for the dropdown when opened
  const handleOpen = () => {
    setOpen((v) => !v);
    // Load all fonts in background when user opens the picker
    FONTS.forEach((f) => {
      if (!isFontLoaded(f.id)) loadFont(f);
    });
  };

  // Group fonts by category in order
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    label: CATEGORY_LABELS[cat],
    fonts: FONTS.filter((f) => f.category === cat),
  }));

  const loaded = selectedFont ? isFontLoaded(selectedFont.id) : false;
  const loading = selectedFont ? isFontLoading(selectedFont.id) : false;

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      <label className="block text-sm font-medium text-neutral-300">Font</label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center justify-between gap-3 rounded-xl border border-neutral-700
                   bg-neutral-900 px-4 py-3 text-left transition-colors
                   hover:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-500
                   focus:border-amber-500"
      >
        {/* Selected font preview */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            dir="rtl"
            className="text-xl text-white leading-tight shrink-0"
            style={loaded && selectedFont ? { fontFamily: `"${selectedFont.name}", serif` } : {}}
          >
            {loading ? (
              <span className="text-sm text-neutral-500 animate-pulse">Loading…</span>
            ) : (
              PREVIEW_TEXT
            )}
          </div>
          <div className="min-w-0">
            <div className="text-sm text-white truncate">
              {selectedFont?.displayName ?? 'Select font'}
            </div>
            <div className="text-xs text-neutral-500 truncate">
              {selectedFont ? CATEGORY_LABELS[selectedFont.category] : ''}
            </div>
          </div>
        </div>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-[calc(100%-2rem)] max-w-sm rounded-xl border border-neutral-700
                        bg-neutral-900 shadow-2xl shadow-black/60 overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            {grouped.map(({ cat, label, fonts }) => (
              <div key={cat}>
                {/* Category header */}
                <div className="sticky top-0 px-3 py-1.5 bg-neutral-800 border-b border-neutral-700">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                    {label}
                  </span>
                </div>

                {/* Font items */}
                {fonts.map((font) => {
                  const isSelected = font.id === selectedFontId;
                  const fontLoaded = isFontLoaded(font.id);
                  const fontLoading = isFontLoading(font.id);

                  return (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => handleSelect(font)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors
                        focus:outline-none
                        ${isSelected
                          ? 'bg-amber-500/15 border-l-2 border-amber-500'
                          : 'border-l-2 border-transparent hover:bg-neutral-800'
                        }`}
                    >
                      {/* Arabic preview in the actual font */}
                      <div
                        dir="rtl"
                        className="text-lg text-white leading-tight w-24 text-right shrink-0"
                        style={fontLoaded ? { fontFamily: `"${font.name}", serif` } : {}}
                      >
                        {fontLoading ? (
                          <span className="text-xs text-neutral-600 animate-pulse">…</span>
                        ) : (
                          PREVIEW_TEXT
                        )}
                      </div>

                      {/* Name */}
                      <div className="min-w-0 flex-1">
                        <div className={`text-sm truncate ${isSelected ? 'text-amber-400 font-medium' : 'text-neutral-200'}`}>
                          {font.displayName}
                        </div>
                      </div>

                      {/* Selected checkmark */}
                      {isSelected && (
                        <svg className="w-4 h-4 text-amber-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
