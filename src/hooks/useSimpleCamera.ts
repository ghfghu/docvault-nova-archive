
import { useRef, useState, useCallback, useEffect } from 'react';

interface CameraState {
  isActive: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  isReady: boolean;
  canSwitchCamera: boolean;
  facingMode: 'environment' | 'user';
}

export const useSimpleCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [state, setState] = useState<CameraState>({
    isActive: false,
    isLoading: false,
    hasError: false,
    errorMessage: '',
    isReady: false,
    canSwitchCamera: false,
    facingMode: 'environment'
  });

  const updateState = useCallback((updates: Partial<CameraState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const checkCameraDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      return videoDevices.length > 1;
    } catch {
      return false;
    }
  }, []);

  const startCamera = useCallback(async () => {
    console.log('Starting camera...');
    updateState({ isLoading: true, hasError: false, errorMessage: '' });
    
    try {
      // Check if camera devices exist
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      // Simple constraints that work on most devices
      const constraints = {
        video: {
          facingMode: state.facingMode,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        const handleLoadedMetadata = () => {
          console.log('Camera ready');
          updateState({ 
            isActive: true, 
            isLoading: false, 
            isReady: true 
          });
        };
        
        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
        await videoRef.current.play();
        
        // Check for multiple cameras
        const canSwitch = await checkCameraDevices();
        updateState({ canSwitchCamera: canSwitch });
      }
    } catch (error) {
      console.error('Camera error:', error);
      let errorMessage = 'Unable to access camera';
      
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage = 'Camera permission denied. Please allow camera access and refresh the page.';
            break;
          case 'NotFoundError':
            errorMessage = 'No camera found on this device.';
            break;
          case 'NotReadableError':
            errorMessage = 'Camera is being used by another application.';
            break;
          default:
            errorMessage = `Camera error: ${error.message}`;
        }
      }
      
      updateState({
        isLoading: false,
        hasError: true,
        errorMessage
      });
    }
  }, [state.facingMode, updateState, checkCameraDevices]);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera...');
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    updateState({
      isActive: false,
      isLoading: false,
      isReady: false,
      hasError: false,
      errorMessage: ''
    });
  }, [updateState]);

  const switchCamera = useCallback(async () => {
    if (!state.canSwitchCamera) return;
    
    const newFacingMode = state.facingMode === 'environment' ? 'user' : 'environment';
    
    if (state.isActive) {
      stopCamera();
      updateState({ facingMode: newFacingMode });
      setTimeout(() => {
        startCamera();
      }, 500);
    }
  }, [state.canSwitchCamera, state.facingMode, state.isActive, updateState, stopCamera, startCamera]);

  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current || !state.isReady) {
      console.error('Camera not ready for capture');
      return null;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return null;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      context.drawImage(video, 0, 0);
      
      return canvas.toDataURL('image/jpeg', 0.8);
    } catch (error) {
      console.error('Image capture error:', error);
      return null;
    }
  }, [state.isReady]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    ...state,
    startCamera,
    stopCamera,
    switchCamera,
    captureImage
  };
};
