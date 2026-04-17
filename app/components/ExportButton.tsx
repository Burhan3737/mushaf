'use client';

import { useState, useEffect } from 'react';
import { TextConfig } from '../types';
import { exportPng, getDataUrl, isInAppBrowser } from '../lib/exportPng';

interface ExportButtonProps {
  config: TextConfig;
  isFontLoaded: (fontId: string) => boolean;
}

export default function ExportButton({ config, isFontLoaded }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inApp, setInApp] = useState(false);
  const [modalDataUrl, setModalDataUrl] = useState<string | null>(null);

  useEffect(() => {
    setInApp(isInAppBrowser());
  }, []);

  const fontReady = isFontLoaded(config.fontId);

  const handleExport = async () => {
    if (!fontReady) return;
    setExporting(true);
    setError(null);
    try {
      if (inApp) {
        // In-app browsers block downloads — show image in modal for long-press save
        const dataUrl = getDataUrl(config);
        setModalDataUrl(dataUrl);
      } else {
        await exportPng(config);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <button
          onClick={handleExport}
          disabled={!fontReady || exporting}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-base transition-all
                     focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-950
                     disabled:opacity-50 disabled:cursor-not-allowed
                     bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-neutral-950"
        >
          {exporting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating…
            </span>
          ) : (
            'Download PNG'
          )}
        </button>

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        {inApp && (
          <p className="text-xs text-amber-500/80 text-center">
            Tap Download then hold the image to save
          </p>
        )}

        {!inApp && (
          <p className="text-xs text-neutral-600 text-center">
            Transparent PNG · {config.canvasWidth}px wide · 2× resolution
          </p>
        )}
      </div>

      {/* Save-image modal for in-app browsers */}
      {modalDataUrl && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4"
          onClick={() => setModalDataUrl(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
              <p className="text-sm font-semibold text-white">Save Image</p>
              <button
                onClick={() => setModalDataUrl(null)}
                className="text-neutral-400 hover:text-white transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Image — user long-presses this to save */}
            <div
              className="p-3"
              style={{
                backgroundImage: `linear-gradient(45deg,#333 25%,transparent 25%),linear-gradient(-45deg,#333 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#333 75%),linear-gradient(-45deg,transparent 75%,#333 75%)`,
                backgroundSize: '12px 12px',
                backgroundPosition: '0 0,0 6px,6px -6px,-6px 0',
                backgroundColor: '#222',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={modalDataUrl}
                alt="Generated text"
                className="w-full rounded-lg"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>

            {/* Instructions */}
            <div className="px-4 py-3 border-t border-neutral-800 text-center space-y-1">
              <p className="text-sm text-white font-medium">Hold the image to open download options</p>
            
            </div>
          </div>
        </div>
      )}
    </>
  );
}
