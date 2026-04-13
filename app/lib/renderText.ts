import { TextConfig } from '../types';
import { getFontById, getFontCssName } from './fonts';

interface RenderOptions {
  scale?: number;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  const paragraphs = text.split('\n');

  for (const para of paragraphs) {
    if (para.trim() === '') {
      lines.push('');
      continue;
    }

    const words = para.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push('');
      continue;
    }

    let current = words[0];
    for (let i = 1; i < words.length; i++) {
      const test = current + ' ' + words[i];
      const { width } = ctx.measureText(test);
      if (width <= maxWidth) {
        current = test;
      } else {
        lines.push(current);
        current = words[i];
      }
    }
    lines.push(current);
  }

  return lines;
}

export interface RenderResult {
  canvas: HTMLCanvasElement;
  height: number;
}

export function renderTextToCanvas(
  config: TextConfig,
  existingCanvas?: HTMLCanvasElement,
  options: RenderOptions = {}
): RenderResult {
  const { scale = 1 } = options;
  const padding = 60 * scale;
  const maxTextWidth = config.canvasWidth * scale - padding * 2;

  const font = getFontById(config.fontId);
  const fontFamily = font ? getFontCssName(font) : 'serif';
  const scaledFontSize = config.fontSize * scale;

  // Measurement canvas to compute height
  const measureCanvas = document.createElement('canvas');
  measureCanvas.width = config.canvasWidth * scale;
  measureCanvas.height = 100;
  const mCtx = measureCanvas.getContext('2d')!;
  mCtx.font = `${scaledFontSize}px "${fontFamily}", serif`;
  mCtx.direction = 'rtl';

  const lines = wrapText(mCtx, config.text || 'بِسْمِ ٱللَّهِ', maxTextWidth);
  const lineHeightPx = scaledFontSize * config.lineHeight;
  const totalHeight = Math.ceil(lines.length * lineHeightPx + padding * 2);

  const canvas = existingCanvas || document.createElement('canvas');
  canvas.width = config.canvasWidth * scale;
  canvas.height = totalHeight;

  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${scaledFontSize}px "${fontFamily}", serif`;
  ctx.fillStyle = config.color;
  ctx.direction = 'rtl';
  ctx.textBaseline = 'top';

  // Determine x position based on alignment
  let x: number;
  switch (config.align) {
    case 'right':
      ctx.textAlign = 'right';
      x = canvas.width - padding;
      break;
    case 'left':
      ctx.textAlign = 'left';
      x = padding;
      break;
    case 'center':
    default:
      ctx.textAlign = 'center';
      x = canvas.width / 2;
  }

  let y = padding;
  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineHeightPx;
  }

  return { canvas, height: totalHeight };
}
