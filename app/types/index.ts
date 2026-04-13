export interface FontDefinition {
  id: string;
  name: string;
  displayName: string;
  source: 'google' | 'self-hosted';
  /** URL for Google Fonts or filename for self-hosted */
  url: string;
  /** Optional CSS font-family fallback */
  fallback?: string;
  category: 'quranic' | 'naskh' | 'modern' | 'display';
}

export type TextAlign = 'right' | 'center' | 'left';
export type CanvasWidth = 1080 | 1920 | 2560;

export interface TextConfig {
  text: string;
  fontId: string;
  fontSize: number;
  color: string;
  align: TextAlign;
  lineHeight: number;
  canvasWidth: CanvasWidth;
}

export type TextConfigAction =
  | { type: 'SET_TEXT'; payload: string }
  | { type: 'SET_FONT'; payload: string }
  | { type: 'SET_FONT_SIZE'; payload: number }
  | { type: 'SET_COLOR'; payload: string }
  | { type: 'SET_ALIGN'; payload: TextAlign }
  | { type: 'SET_LINE_HEIGHT'; payload: number }
  | { type: 'SET_CANVAS_WIDTH'; payload: CanvasWidth };
