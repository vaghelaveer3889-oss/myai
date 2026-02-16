
export interface ImageState {
  original: string | null;
  current: string | null;
  history: string[];
}

export interface EditRequest {
  image: string; // Base64
  prompt: string;
  mimeType: string;
}

export interface EditResponse {
  imageUrl: string;
  error?: string;
}
