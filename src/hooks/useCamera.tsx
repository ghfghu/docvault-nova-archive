
import { useRef, useState, useCallback, useEffect } from 'react';

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

export const useCamera = (): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [cameraActive, setCameraActive] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [cameraInitializing, setCameraInitializing] = useState(false);
  const [flashSupported, setFlashSupported] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);

  // Enhanced camera constraints for mobile
  const getCameraConstraints = useCallback(() => {
    const baseConstraints = {
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920, min: 640 },
        height: { ideal: 1080, min: 480 },
        aspectRatio: { ideal: 16/9 }
      },
      audio: false
    };

    // Add mobile-specific constraints
    if (window.Capacitor?.isNativePlatform()) {
      return {
        ...baseConstraints,
        video: {
          ...baseConstraints.video,
          frameRate: { ideal: 30, max: 30 }
        }
      };
    }

    return baseConstraints;
  }, []);

  const startCamera = useCallback(async () => {
    if (cameraInitializing || cameraActive) return;
    
    console.log('Starting camera...');
    setCameraInitializing(true);
    setVideoLoaded(false);

    try {
      // Check for camera permissions on mobile
      if (window.Capacitor?.isNativePlatform()) {
        // Add a small delay to ensure UI is ready
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const constraints = getCameraConstraints();
      console.log('Requesting camera with constraints:', constraints);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained successfully');
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Handle video loaded event
        const handleLoadedMetadata = () => {
          console.log('Video metadata loaded');
          setVideoLoaded(true);
          setCameraActive(true);
          
          // Check for flash support
          const videoTrack = stream.getVideoTracks()[0];
          if (videoTrack) {
            const capabilities = videoTrack.getCapabilities?.();
            if (capabilities?.torch) {
              setFlashSupported(true);
              console.log('Flash/torch supported');
            }
          }
        };
        
        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        
        // Cleanup function for the event listener
        return () => {
          if (videoRef.current) {
            videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          }
        };
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraActive(false);
      setVideoLoaded(false);
      
      // More specific error handling for mobile
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            console.log('Camera permission denied');
            break;
          case 'NotFoundError':
            console.log('No camera device found');
            break;
          case 'NotReadableError':
            console.log('Camera is in use by another application');
            break;
          default:
            console.log('Camera error:', error.message);
        }
      }
    } finally {
      setCameraInitializing(false);
    }
  }, [cameraInitializing, cameraActive, getCameraConstraints]);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera...');
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Camera track stopped');
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
    setVideoLoaded(false);
    setFlashEnabled(false);
    setFlashSupported(false);
  }, []);

  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current || !videoLoaded) {
      console.error('Camera not ready for capture');
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

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      console.log(`Capturing image: ${canvas.width}x${canvas.height}`);
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL with good quality
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Image captured successfully');
      
      return dataUrl;
    } catch (error) {
      console.error('Image capture error:', error);
      return null;
    }
  }, [videoLoaded]);

  const toggleFlash = useCallback(async () => {
    if (!flashSupported || !streamRef.current) return;

    try {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        await videoTrack.applyConstraints({
          advanced: [{ torch: !flashEnabled }]
        });
        setFlashEnabled(!flashEnabled);
        console.log(`Flash ${!flashEnabled ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      console.error('Flash toggle error:', error);
    }
  }, [flashSupported, flashEnabled]);

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
    cameraActive,
    videoLoaded,
    cameraInitializing,
    flashSupported,
    flashEnabled,
    startCamera,
    stopCamera,
    captureImage,
    toggleFlash,
    resetCamera
  };
};
