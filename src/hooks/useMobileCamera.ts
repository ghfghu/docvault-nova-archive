
import { useRef, useState, useCallback, useEffect } from 'react';

interface CameraPermissionState {
  status: 'unknown' | 'requesting' | 'granted' | 'denied' | 'unavailable';
  error?: string;
}

interface MobileCameraState {
  isActive: boolean;
  isLoading: boolean;
  isReady: boolean;
  permission: CameraPermissionState;
  facingMode: 'environment' | 'user';
  hasMultipleCameras: boolean;
}

export const useMobileCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [state, setState] = useState<MobileCameraState>({
    isActive: false,
    isLoading: false,
    isReady: false,
    permission: { status: 'unknown' },
    facingMode: 'environment',
    hasMultipleCameras: false
  });

  const updateState = useCallback((updates: Partial<MobileCameraState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const checkPermissions = useCallback(async (): Promise<boolean> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        updateState({ 
          permission: { 
            status: 'unavailable', 
            error: 'Camera not supported on this device' 
          } 
        });
        return false;
      }

      // Check for multiple cameras
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      updateState({ hasMultipleCameras: videoDevices.length > 1 });

      updateState({ permission: { status: 'requesting' } });
      
      // Test camera access with minimal constraints
      const testStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      testStream.getTracks().forEach(track => track.stop());
      
      updateState({ permission: { status: 'granted' } });
      return true;
    } catch (error) {
      console.error('Camera permission check failed:', error);
      
      let errorMessage = 'Camera access denied';
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.';
            break;
          case 'NotFoundError':
            errorMessage = 'No camera found on this device.';
            break;
          case 'NotReadableError':
            errorMessage = 'Camera is being used by another application.';
            break;
          case 'OverconstrainedError':
            errorMessage = 'Camera constraints not supported.';
            break;
          default:
            errorMessage = `Camera error: ${error.message}`;
        }
      }
      
      updateState({ 
        permission: { 
          status: 'denied', 
          error: errorMessage 
        } 
      });
      return false;
    }
  }, [updateState]);

  const getOptimalConstraints = useCallback((facingMode: 'environment' | 'user') => {
    // Progressive constraint fallback for better mobile compatibility
    const constraints = [
      // High quality for modern devices
      {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
          aspectRatio: { ideal: 16/9 }
        }
      },
      // Medium quality fallback
      {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        }
      },
      // Basic fallback
      {
        video: {
          facingMode: facingMode
        }
      },
      // Last resort - any camera
      {
        video: true
      }
    ];

    return constraints;
  }, []);

  const startCamera = useCallback(async () => {
    if (state.isLoading || state.isActive) return;
    
    console.log('Starting mobile camera...');
    updateState({ isLoading: true, isReady: false });

    // Check permissions first
    const hasPermission = await checkPermissions();
    if (!hasPermission) {
      updateState({ isLoading: false });
      return;
    }

    const constraints = getOptimalConstraints(state.facingMode);
    
    for (const constraint of constraints) {
      try {
        console.log('Trying camera constraints:', constraint);
        const stream = await navigator.mediaDevices.getUserMedia(constraint);
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          updateState({ isActive: true });
          
          const handleLoadedMetadata = () => {
            console.log('Mobile camera ready');
            updateState({ isReady: true, isLoading: false });
          };
          
          const handleError = () => {
            console.error('Video loading error');
            stopCamera();
          };
          
          videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
          videoRef.current.addEventListener('error', handleError, { once: true });
          
          try {
            await videoRef.current.play();
            console.log('Mobile camera started successfully');
            return; // Success, exit the loop
          } catch (playError) {
            console.warn('Video autoplay failed:', playError);
            updateState({ isReady: true, isLoading: false });
            return;
          }
        }
      } catch (error) {
        console.warn('Camera constraint failed, trying next...', error);
        continue; // Try next constraint
      }
    }
    
    // If we get here, all constraints failed
    updateState({ 
      isLoading: false,
      permission: { 
        status: 'denied', 
        error: 'Unable to access camera with any settings' 
      }
    });
  }, [state.isLoading, state.isActive, state.facingMode, checkPermissions, getOptimalConstraints, updateState]);

  const stopCamera = useCallback(() => {
    console.log('Stopping mobile camera...');
    
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
      isReady: false
    });
  }, [updateState]);

  const switchCamera = useCallback(() => {
    if (!state.hasMultipleCameras) return;
    
    const newFacingMode = state.facingMode === 'environment' ? 'user' : 'environment';
    updateState({ facingMode: newFacingMode });
    
    if (state.isActive) {
      stopCamera();
      setTimeout(() => {
        updateState({ facingMode: newFacingMode });
        startCamera();
      }, 500);
    }
  }, [state.hasMultipleCameras, state.facingMode, state.isActive, updateState, stopCamera, startCamera]);

  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current || !state.isReady) {
      console.error('Mobile camera not ready for capture');
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
      console.error('Mobile image capture error:', error);
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
    captureImage,
    requestPermissions: checkPermissions
  };
};
