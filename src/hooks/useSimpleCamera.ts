
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
      console.log('Available video devices:', videoDevices.length);
      return videoDevices.length > 1;
    } catch (error) {
      console.error('Error checking camera devices:', error);
      return false;
    }
  }, []);

  const startCamera = useCallback(async () => {
    console.log('Starting camera with facingMode:', state.facingMode);
    updateState({ isLoading: true, hasError: false, errorMessage: '' });
    
    try {
      // Check browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera is not supported on this browser');
      }

      // Request permissions first
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      console.log('Camera permission status:', permissionStatus.state);

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      // Simple constraints for better compatibility
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: state.facingMode,
          width: { ideal: 1280, min: 320 },
          height: { ideal: 720, min: 240 }
        },
        audio: false
      };
      
      console.log('Requesting camera access with constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained successfully');
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        const handleCanPlay = () => {
          console.log('Video can play, camera is ready');
          updateState({ 
            isActive: true, 
            isLoading: false, 
            isReady: true,
            hasError: false,
            errorMessage: ''
          });
        };
        
        videoRef.current.addEventListener('canplay', handleCanPlay, { once: true });
        
        try {
          await videoRef.current.play();
          console.log('Video started playing');
        } catch (playError) {
          console.error('Error playing video:', playError);
          // Still mark as ready even if play fails initially
          handleCanPlay();
        }
        
        // Check for multiple cameras
        const canSwitch = await checkCameraDevices();
        updateState({ canSwitchCamera: canSwitch });
      }
    } catch (error) {
      console.error('Camera initialization failed:', error);
      let errorMessage = 'Unable to access camera';
      
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage = 'Camera permission was denied. Please allow camera access in your browser settings and refresh the page.';
            break;
          case 'NotFoundError':
            errorMessage = 'No camera found on this device.';
            break;
          case 'NotReadableError':
            errorMessage = 'Camera is being used by another application. Please close other apps using the camera.';
            break;
          case 'OverconstrainedError':
            errorMessage = 'Camera constraints cannot be satisfied. Trying with basic settings...';
            // Retry with basic constraints
            setTimeout(() => {
              updateState({ facingMode: 'user' });
              startCamera();
            }, 1000);
            return;
          default:
            errorMessage = `Camera error: ${error.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      updateState({
        isLoading: false,
        hasError: true,
        errorMessage,
        isActive: false,
        isReady: false
      });
    }
  }, [state.facingMode, updateState, checkCameraDevices]);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera...');
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
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
    if (!state.canSwitchCamera) {
      console.log('Camera switching not available');
      return;
    }
    
    console.log('Switching camera from', state.facingMode);
    const newFacingMode = state.facingMode === 'environment' ? 'user' : 'environment';
    
    stopCamera();
    
    // Wait a bit before starting with new facing mode
    setTimeout(() => {
      updateState({ facingMode: newFacingMode });
      startCamera();
    }, 500);
  }, [state.canSwitchCamera, state.facingMode, stopCamera, startCamera, updateState]);

  const captureImage = useCallback((): string | null => {
    console.log('Attempting to capture image...');
    
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref not available');
      return null;
    }

    if (!state.isReady || !state.isActive) {
      console.error('Camera not ready for capture', { isReady: state.isReady, isActive: state.isActive });
      return null;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) {
        console.error('Canvas context not available');
        return null;
      }

      // Get video dimensions
      const videoWidth = video.videoWidth || video.clientWidth || 640;
      const videoHeight = video.videoHeight || video.clientHeight || 480;
      
      console.log('Video dimensions:', { videoWidth, videoHeight });
      
      // Set canvas size to match video
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      
      // Draw the current video frame to canvas
      context.drawImage(video, 0, 0, videoWidth, videoHeight);
      
      // Convert to data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Image captured successfully');
      
      return imageDataUrl;
    } catch (error) {
      console.error('Error capturing image:', error);
      return null;
    }
  }, [state.isReady, state.isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        console.log('Cleaning up camera stream on unmount');
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
