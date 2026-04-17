import { TextConfig } from '../types';
import { renderTextToCanvas } from './renderText';

export async function exportPng(config: TextConfig): Promise<void> {
  const { canvas } = renderTextToCanvas(config, undefined, { scale: 2 });
  const dataUrl = canvas.toDataURL('image/png');

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `mushaf-text-${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
