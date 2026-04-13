'use client';

import { useEffect, useRef, useCallback } from 'react';
import { TextConfig } from '../types';
import { renderTextToCanvas } from '../lib/renderText';
import { getFontById } from '../lib/fonts';

interface UseCanvasRendererOptions {
  config: TextConfig;
  isFontLoaded: (fontId: string) => boolean;
  onHeightChange?: (height: number) => void;
}

export function useCanvasRenderer({
  config,
  isFontLoaded,
  onHeightChange,
}: UseCanvasRendererOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const { height } = renderTextToCanvas(config, canvas, { scale: dpr });

    // Set CSS display size
    canvas.style.width = `${config.canvasWidth}px`;
    canvas.style.height = `${height / dpr}px`;

    onHeightChange?.(height / dpr);
  }, [config, onHeightChange]);

  // Debounced render on config changes
  useEffect(() => {
    const font = getFontById(config.fontId);
    if (!font) return;

    // Render even if font failed (will use system serif fallback)

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(render, 100);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [config, isFontLoaded, render]);

  return { canvasRef };
}
