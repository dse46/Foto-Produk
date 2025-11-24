export interface GenerationResult {
  imageData: string | null; // Base64 data URI
  textResponse: string | null;
}

export interface PresetPrompt {
  id: string;
  label: string;
  text: string;
  icon: string;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type AspectRatioType = '1:1' | '16:9' | '9:16' | 'custom';
