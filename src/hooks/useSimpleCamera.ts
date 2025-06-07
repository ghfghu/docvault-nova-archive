
import { useRef, useState, useCallback, useEffect } from 'react';

interface CameraState {
  isActive: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  isReady: boolean;
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
    isReady: false
  });

  const startCamera = useCallback(async () => {
    console.log('Starting camera...');
    setState(prev => ({ ...prev, isLoading: true, hasError: false, errorMessage: '' }));
    
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        const handleLoadedMetadata = () => {
          console.log('Camera ready');
          setState(prev => ({ 
            ...prev, 
            isActive: true, 
            isLoading: false, 
            isReady: true 
          }));
        };
        
        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
        await videoRef.current.play();
      }
    } catch (error) {
      console.error('Camera error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        hasError: true,
        errorMessage: error instanceof Error ? error.message : 'Camera access failed'
      }));
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setState({
      isActive: false,
      isLoading: false,
      hasError: false,
      errorMessage: '',
      isReady: false
    });
  }, []);

  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current || !state.isReady) {
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
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
    captureImage
  };
};
