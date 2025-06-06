
import { useRef, useState, useCallback, useEffect } from 'react';
import { UseCameraReturn } from './camera/types';
import { useCameraConstraints } from './camera/useCameraConstraints';
import { useCameraStream } from './camera/useCameraStream';
import { useCameraCapture } from './camera/useCameraCapture';
import { useCameraFlash } from './camera/useCameraFlash';

export type { UseCameraReturn } from './camera/types';

export const useCamera = (): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [state, setState] = useState({
    cameraActive: false,
    videoLoaded: false,
    cameraInitializing: false,
    flashSupported: false,
    flashEnabled: false
  });

  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setFlashEnabled = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, flashEnabled: enabled }));
  }, []);

  // Get camera constraints
  const { getCameraConstraints } = useCameraConstraints();

  // Camera stream management
  const { streamRef, startCamera, stopCamera } = useCameraStream({
    state,
    setState: updateState,
    videoRef,
    getCameraConstraints
  });

  // Image capture functionality
  const { captureImage } = useCameraCapture({
    videoRef,
    canvasRef,
    videoLoaded: state.videoLoaded
  });

  // Flash/torch functionality
  const { toggleFlash } = useCameraFlash({
    streamRef,
    flashSupported: state.flashSupported,
    flashEnabled: state.flashEnabled,
    setFlashEnabled
  });

  // Reset camera functionality
  const resetCamera = useCallback(() => {
    console.log('Resetting camera...');
    stopCamera();
    setTimeout(() => {
      startCamera();
    }, 500);
  }, [stopCamera, startCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    cameraActive: state.cameraActive,
    videoLoaded: state.videoLoaded,
    cameraInitializing: state.cameraInitializing,
    flashSupported: state.flashSupported,
    flashEnabled: state.flashEnabled,
    startCamera,
    stopCamera,
    captureImage,
    toggleFlash,
    resetCamera
  };
};
