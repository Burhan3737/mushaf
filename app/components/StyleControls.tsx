'use client';

import { TextConfig, TextAlign, CanvasWidth } from '../types';

interface StyleControlsProps {
  draft: TextConfig;
  setDraft: React.Dispatch<React.SetStateAction<TextConfig>>;
  onSave: () => void;
  hasChanges: boolean;
}

const PRESET_COLORS = [
  { label: 'White', value: '#ffffff' },
  { label: 'Cream', value: '#fff8e7' },
  { label: 'Gold', value: '#d4a853' },
  { label: 'Light Gold', value: '#f0c040' },
  { label: 'Dark Gold', value: '#a07830' },
  { label: 'Black', value: '#000000' },
  { label: 'Dark Gray', value: '#1a1a1a' },
];

const CANVAS_WIDTHS: CanvasWidth[] = [1080, 1920, 2560];

const ALIGN_OPTIONS: { value: TextAlign; icon: string; label: string }[] = [
  { value: 'right', icon: '⫷', label: 'Right' },
  { value: 'center', icon: '≡', label: 'Center' },
  { value: 'left', icon: '⫸', label: 'Left' },
];

export default function StyleControls({ draft, setDraft, onSave, hasChanges }: StyleControlsProps) {
  return (
    <div className="space-y-4">
      {/* Font Size */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-neutral-300">Font Size</label>
          <span className="text-sm text-amber-400 font-mono">{draft.fontSize}px</span>
        </div>
        <input
          type="range"
          min={24}
          max={200}
          step={2}
          value={draft.fontSize}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, fontSize: parseInt(e.target.value) }))
          }
          className="w-full accent-amber-500 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-neutral-600">
          <span>24px</span>
          <span>200px</span>
        </div>
      </div>

      {/* Color */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-neutral-300">Color</label>
        <div className="flex flex-wrap gap-2 items-center">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.value}
              title={c.label}
              onClick={() => setDraft((prev) => ({ ...prev, color: c.value }))}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500
                ${draft.color === c.value ? 'border-amber-500 scale-110' : 'border-neutral-600'}`}
              style={{ backgroundColor: c.value }}
            />
          ))}
          {/* Custom color picker */}
          <label className="relative w-8 h-8 rounded-full border-2 border-dashed border-neutral-600 cursor-pointer hover:border-neutral-400 transition-colors flex items-center justify-center overflow-hidden">
            <span className="text-neutral-400 text-lg leading-none">+</span>
            <input
              type="color"
              value={draft.color}
              onChange={(e) => setDraft((prev) => ({ ...prev, color: e.target.value }))}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
        </div>
      </div>

      {/* Alignment */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-neutral-300">Alignment</label>
        <div className="flex gap-2">
          {ALIGN_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDraft((prev) => ({ ...prev, align: opt.value }))}
              title={opt.label}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-amber-500
                ${draft.align === opt.value
                  ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                  : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Line Height */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-neutral-300">Line Height</label>
          <span className="text-sm text-amber-400 font-mono">{draft.lineHeight.toFixed(1)}×</span>
        </div>
        <input
          type="range"
          min={1.2}
          max={3.0}
          step={0.1}
          value={draft.lineHeight}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, lineHeight: parseFloat(e.target.value) }))
          }
          className="w-full accent-amber-500 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-neutral-600">
          <span>1.2×</span>
          <span>3.0×</span>
        </div>
      </div>

      {/* Canvas Width */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-neutral-300">Canvas Width</label>
        <div className="flex gap-2">
          {CANVAS_WIDTHS.map((w) => (
            <button
              key={w}
              onClick={() => setDraft((prev) => ({ ...prev, canvasWidth: w }))}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-amber-500
                ${draft.canvasWidth === w
                  ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                  : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'
                }`}
            >
              {w}
            </button>
          ))}
        </div>
        <div className="text-xs text-neutral-600 text-center">
          {draft.canvasWidth === 1080 && 'Square / Portrait'}
          {draft.canvasWidth === 1920 && 'Full HD (16:9)'}
          {draft.canvasWidth === 2560 && '2K / Wide'}
        </div>
      </div>

      {/* Save Settings */}
      <button
        onClick={onSave}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500
          ${hasChanges
            ? 'bg-amber-500 hover:bg-amber-400 text-neutral-900'
            : 'bg-neutral-800 text-neutral-500 cursor-default'
          }`}
      >
        Save Settings
      </button>
    </div>
  );
}
