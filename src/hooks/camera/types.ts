
export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cameraActive: boolean;
  videoLoaded: boolean;
  cameraInitializing: boolean;
  flashSupported: boolean;
  flashEnabled: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureImage: () => string | null;
  toggleFlash: () => void;
  resetCamera: () => void;
}

export interface CameraState {
  cameraActive: boolean;
  videoLoaded: boolean;
  cameraInitializing: boolean;
  flashSupported: boolean;
  flashEnabled: boolean;
}
