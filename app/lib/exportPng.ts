import { TextConfig } from '../types';
import { renderTextToCanvas } from './renderText';

export function isInAppBrowser(): boolean {
  const ua = navigator.userAgent;
  return /Instagram|FBAN|FBAV|FB_IAB|Twitter|Line\/|MicroMessenger|TikTok|Snapchat|LinkedIn/.test(ua)
}

export function getDataUrl(config: TextConfig): string {
  const { canvas } = renderTextToCanvas(config, undefined, { scale: 2 });
  return canvas.toDataURL('image/png');
}

export async function exportPng(config: TextConfig): Promise<void> {
  const { canvas } = renderTextToCanvas(config, undefined, { scale: 2 });

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
