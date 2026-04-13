'use client';

import { useState } from 'react';
import { TextConfig } from '../types';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';
import { getFontById } from '../lib/fonts';

interface CanvasPreviewProps {
  config: TextConfig;
  isFontLoaded: (fontId: string) => boolean;
  isFontLoading: (fontId: string) => boolean;
}

export default function CanvasPreview({ config, isFontLoaded, isFontLoading }: CanvasPreviewProps) {
  const [canvasHeight, setCanvasHeight] = useState(200);
  const { canvasRef } = useCanvasRenderer({
    config,
    isFontLoaded,
    onHeightChange: setCanvasHeight,
  });

  const fontReady = isFontLoaded(config.fontId);
  const fontLoading = isFontLoading(config.fontId);
  const font = getFontById(config.fontId);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-neutral-300">Preview</label>
        <span className="text-xs text-neutral-500">
          {config.canvasWidth}px × {Math.round(canvasHeight)}px
        </span>
      </div>

      {/* Horizontal scroll container for wide canvases */}
      <div className="overflow-x-auto rounded-xl border border-neutral-700">
        <div
          className="relative"
          style={{
            // Checkerboard background — transparency indicator
            backgroundImage: `
              linear-gradient(45deg, #333 25%, transparent 25%),
              linear-gradient(-45deg, #333 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #333 75%),
              linear-gradient(-45deg, transparent 75%, #333 75%)
            `,
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
            backgroundColor: '#222',
          }}
        >
          {fontLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/80 rounded-xl z-10 min-h-[100px]">
              <span className="text-neutral-400 text-sm animate-pulse">
                Loading {font?.displayName}…
              </span>
            </div>
          )}
          {!fontReady && !fontLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/60 rounded-xl z-10 min-h-[100px]">
              <span className="text-neutral-500 text-sm">
                Font unavailable — using fallback
              </span>
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="block max-w-full"
            style={{
              maxWidth: '100%',
              height: 'auto',
              opacity: fontReady ? 1 : 0.3,
              transition: 'opacity 0.2s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}
