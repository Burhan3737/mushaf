'use client';

import { useRef, useEffect } from 'react';

interface TextInputProps {
  value: string;
  onChange: (text: string) => void;
}

const PLACEHOLDER = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';

export default function TextInput({ value, onChange }: TextInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-300">
        Text{' '}
          <a
            href="https://quran.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-normal text-neutral-500 hover:text-amber-400 transition-colors"
          >
            ↗ quran.com
          </a>
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-neutral-500 hover:text-red-400 transition-colors focus:outline-none"
          >
            Clear
          </button>
        )}
      </div>
      <textarea
        ref={ref}
        dir="rtl"
        lang="ar"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={3}
        className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3
                   text-xl leading-relaxed text-white placeholder-neutral-600
                   focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500
                   resize-none overflow-hidden transition-colors"
        style={{ fontFamily: 'inherit', direction: 'rtl', unicodeBidi: 'bidi-override' }}
      />
    </div>
  );
}
