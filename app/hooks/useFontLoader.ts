'use client';

import { useState, useCallback } from 'react';
import { FontDefinition } from '../types';
import { FONTS } from '../lib/fonts';

type FontStatus = 'idle' | 'loading' | 'loaded' | 'error';

// Module-level cache so we don't reload across re-renders
const fontStatusCache = new Map<string, FontStatus>();
const fontLoadPromises = new Map<string, Promise<boolean>>();

export function useFontLoader() {
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [loadingFonts, setLoadingFonts] = useState<Set<string>>(new Set());

  const loadFont = useCallback(async (fontDef: FontDefinition): Promise<boolean> => {
    const key = fontDef.id;

    // Already loaded
    if (fontStatusCache.get(key) === 'loaded') {
      setLoadedFonts((prev) => new Set(prev).add(key));
      return true;
    }
    // Already errored — don't retry
    if (fontStatusCache.get(key) === 'error') return false;

    // In-flight — return same promise
    if (fontLoadPromises.has(key)) {
      return fontLoadPromises.get(key)!;
    }

    fontStatusCache.set(key, 'loading');
    setLoadingFonts((prev) => new Set(prev).add(key));

    const promise = (async (): Promise<boolean> => {
      try {
        const face = new FontFace(fontDef.name, `url(${fontDef.url})`);
        await face.load();
        document.fonts.add(face);
        fontStatusCache.set(key, 'loaded');
        setLoadedFonts((prev) => new Set(prev).add(key));
        return true;
      } catch (err) {
        console.warn(`Font "${fontDef.displayName}" unavailable:`, err);
        fontStatusCache.set(key, 'error');
        return false;
      } finally {
        fontLoadPromises.delete(key);
        setLoadingFonts((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    })();

    fontLoadPromises.set(key, promise);
    return promise;
  }, []); // stable — no deps needed

  const isFontLoaded = useCallback(
    (fontId: string) => fontStatusCache.get(fontId) === 'loaded',
    [] // reads from module-level cache, no state deps needed
  );

  const isFontLoading = useCallback(
    (fontId: string) => loadingFonts.has(fontId),
    [loadingFonts]
  );

  const preloadFonts = useCallback(
    async (fontIds: string[]) => {
      const defs = fontIds
        .map((id) => FONTS.find((f) => f.id === id))
        .filter((f): f is FontDefinition => !!f);
      await Promise.allSettled(defs.map(loadFont));
    },
    [loadFont]
  );

  return { loadFont, isFontLoaded, isFontLoading, preloadFonts };
}
