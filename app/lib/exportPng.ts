import { TextConfig } from '../types';
import { renderTextToCanvas } from './renderText';

export async function exportPng(config: TextConfig): Promise<void> {
  // Render at 2x for high quality
  const { canvas } = renderTextToCanvas(config, undefined, { scale: 2 });

  // iOS Safari doesn't support canvas.toBlob well for download
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS) {
    const dataUrl = canvas.toDataURL('image/png');
    window.open(dataUrl, '_blank');
    return;
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create blob'));
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mushaf-text-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve();
    }, 'image/png');
  });
}
