'use client';

import { useEffect, useState } from 'react';
import { TextConfig } from '../types';
import { exportPng } from '../lib/exportPng';

interface ExportButtonProps {
  config: TextConfig;
  isFontLoaded: (fontId: string) => boolean;
}

export default function ExportButton({ config, isFontLoaded }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inApp, setInApp] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setInApp(
      /Instagram|FBAN|FBAV|FB_IAB|Twitter|Line\/|MicroMessenger|TikTok|Snapchat|LinkedIn/.test(
        navigator.userAgent
      ) || true
    );
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  const fontReady = isFontLoaded(config.fontId);

  const handleExport = async () => {
    if (!fontReady) return;
    setExporting(true);
    setError(null);
    try {
      await exportPng(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
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
            Exporting…
          </span>
        ) : (
          'Download PNG'
        )}
      </button>
      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}
      {inApp && (
        <p className="text-xs text-amber-500/80 text-center">
          {isIOS
            ? 'Open in Safari to download'
            : 'Open in Chrome to download'}
        </p>
      )}
      <p className="text-xs text-neutral-600 text-center">
        Transparent PNG · {config.canvasWidth}px wide · 2× resolution
      </p>
    </div>
  );
}
