
import { useRef, useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { MediaTrackConstraintsWithTorch } from '@/types/camera';

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

export const useCamera = (): UseCameraReturn => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [flashSupported, setFlashSupported] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [cameraInitializing, setCameraInitializing] = useState(false);

  // Function to handle video element loaded
  const handleVideoLoaded = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  // Effect to add and remove event listener for video loaded
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('loadeddata', handleVideoLoaded);
      return () => {
        videoElement.removeEventListener('loadeddata', handleVideoLoaded);
      };
    }
  }, [handleVideoLoaded, cameraActive]);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Start camera function
  const startCamera = useCallback(async () => {
    try {
      setCameraInitializing(true);
      setVideoLoaded(false);
      
      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      // Check if flash is supported
      const videoTrack = mediaStream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities() as any;
      const flashSupport = capabilities?.torch !== undefined;
      setFlashSupported(flashSupport);
      
      // Set stream and update state
      setStream(mediaStream);
      setCameraActive(true);
      
      // Assign stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera start error:', error);
      toast({
        title: t('cameraError'),
        description: t('cameraPermissionError'),
        variant: 'destructive'
      });
    } finally {
      setCameraInitializing(false);
    }
  }, [t]);

  // Stop camera function
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setCameraActive(false);
    setVideoLoaded(false);
    setFlashEnabled(false);
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  // Reset camera function
  const resetCamera = useCallback(() => {
    stopCamera();
    startCamera();
  }, [stopCamera, startCamera]);

  // Toggle flash function
  const toggleFlash = useCallback(async () => {
    if (!stream || !flashSupported) return;
    
    try {
      const videoTrack = stream.getVideoTracks()[0];
      const newFlashState = !flashEnabled;
      
      // Apply torch constraint
      const constraints: MediaTrackConstraintsWithTorch = {
        advanced: [{ torch: newFlashState }]
      };
      
      await videoTrack.applyConstraints(constraints);
      setFlashEnabled(newFlashState);
    } catch (error) {
      console.error('Flash toggle error:', error);
      toast({
        title: t('flashNotSupported'),
        description: t('deviceNoFlash'),
        variant: 'destructive'
      });
    }
  }, [stream, flashEnabled, flashSupported, t]);

  // Capture image function
  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current || !videoLoaded) {
      console.error('Video or canvas not ready');
      toast({
        title: t('captureError'),
        description: t('cameraNotReady'),
        variant: 'destructive'
      });
      return null;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data URL
    try {
      return canvas.toDataURL('image/jpeg');
    } catch (error) {
      console.error('Canvas to data URL error:', error);
      return null;
    }
  }, [videoRef, canvasRef, videoLoaded, t]);

  return {
    videoRef,
    canvasRef,
    stream,
    flashEnabled,
    cameraActive,
    flashSupported,
    videoLoaded,
    cameraInitializing,
    startCamera,
    stopCamera,
    resetCamera,
    toggleFlash,
    captureImage
  };
};
