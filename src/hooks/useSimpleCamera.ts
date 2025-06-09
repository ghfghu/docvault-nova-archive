
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
    updateState({ isLoading: true, hasError: false, errorMessage: '', isReady: false });
    
    try {
      // Check browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('الكاميرا غير مدعومة في هذا المتصفح');
      }

      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      // Simplified constraints for better compatibility
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: state.facingMode,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: false
      };
      
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained successfully');
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video metadata to load
        const handleLoadedMetadata = () => {
          console.log('Video metadata loaded');
          updateState({ 
            isActive: true, 
            isLoading: false, 
            isReady: true,
            hasError: false,
            errorMessage: ''
          });
        };

        const handleCanPlay = () => {
          console.log('Video can play, camera is ready');
          if (!state.isReady) {
            updateState({ 
              isActive: true, 
              isLoading: false, 
              isReady: true,
              hasError: false,
              errorMessage: ''
            });
          }
        };
        
        // Add event listeners
        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
        videoRef.current.addEventListener('canplay', handleCanPlay, { once: true });
        
        try {
          await videoRef.current.play();
          console.log('Video started playing');
        } catch (playError) {
          console.warn('Auto-play failed, but camera should still work:', playError);
          // Mark as ready even if autoplay fails
          handleCanPlay();
        }
        
        // Check for multiple cameras
        const canSwitch = await checkCameraDevices();
        updateState({ canSwitchCamera: canSwitch });
      }
    } catch (error) {
      console.error('Camera initialization failed:', error);
      let errorMessage = 'غير قادر على الوصول للكاميرا';
      
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage = 'تم رفض إذن الكاميرا. يرجى السماح بالوصول للكاميرا في إعدادات المتصفح وإعادة تحديث الصفحة.';
            break;
          case 'NotFoundError':
            errorMessage = 'لم يتم العثور على كاميرا في هذا الجهاز.';
            break;
          case 'NotReadableError':
            errorMessage = 'الكاميرا قيد الاستخدام من تطبيق آخر. يرجى إغلاق التطبيقات الأخرى التي تستخدم الكاميرا.';
            break;
          case 'OverconstrainedError':
            errorMessage = 'إعدادات الكاميرا غير متوافقة. جاري المحاولة بإعدادات أساسية...';
            // Retry with basic constraints
            setTimeout(() => {
              updateState({ facingMode: 'user' });
              startCamera();
            }, 1000);
            return;
          default:
            errorMessage = `خطأ في الكاميرا: ${error.message}`;
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
  }, [state.facingMode, updateState, checkCameraDevices, state.isReady]);

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

      // Get video dimensions - ensure they're valid
      const videoWidth = video.videoWidth || 640;
      const videoHeight = video.videoHeight || 480;
      
      console.log('Video dimensions:', { videoWidth, videoHeight });
      
      // Set canvas size to match video
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      
      // Draw the current video frame to canvas
      context.drawImage(video, 0, 0, videoWidth, videoHeight);
      
      // Convert to data URL with good quality
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
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
