
export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  stream: MediaStream | null;
  flashEnabled: boolean;
  cameraActive: boolean;
  flashSupported: boolean;
  videoLoaded: boolean;
  cameraInitializing: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  resetCamera: () => void;
  toggleFlash: () => Promise<void>;
  captureImage: () => string | null;
}
