import { TextConfig } from "../types";
import { renderTextToCanvas } from "./renderText";

export function isInAppBrowser(): boolean {
  const ua = navigator.userAgent;
  return /Instagram|FBAN|FBAV|FB_IAB|Twitter|Line\/|MicroMessenger|TikTok|Snapchat|LinkedIn/.test(
    ua,
  );
}

export function getDataUrl(config: TextConfig): string {
  const { canvas } = renderTextToCanvas(config, undefined, { scale: 2 });
  return canvas.toDataURL("image/png");
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Failed to create blob")),
      "image/png",
    );
  });
}

export async function exportPng(config: TextConfig): Promise<void> {
  const { canvas } = renderTextToCanvas(config, undefined, { scale: 2 });
  const blob = await canvasToBlob(canvas);
  const filename = `mushaf-text-${Date.now()}.png`;
  const file = new File([blob], filename, { type: "image/png" });

  // Web Share API — opens native OS share sheet (works in Instagram, TikTok, etc.)
  // User can tap "Save Image" / "Save to Photos" from the share sheet
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file], title: "Mushaf Text" });
    return;
  }

  // iOS Safari fallback (older versions without file sharing)
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    window.open(canvas.toDataURL("image/png"), "_blank");
    return;
  }

  // Desktop / Android Chrome — standard download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
