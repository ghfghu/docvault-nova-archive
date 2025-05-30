
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
    console.log('Video loaded successfully');
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

  // Stop camera function - moved before startCamera to fix dependency error
  const stopCamera = useCallback(() => {
    console.log('Stopping camera...');
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      setStream(null);
    }
    
    setCameraActive(false);
    setVideoLoaded(false);
    setFlashEnabled(false);
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    console.log('Camera stopped');
  }, [stream]);

  // Start camera function with improved error handling and retry logic
  const startCamera = useCallback(async () => {
    try {
      setCameraInitializing(true);
      setVideoLoaded(false);
      
      if (stream) {
        console.log('Camera already started, stopping first');
        stopCamera();
      }
      
      console.log('Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      console.log('Camera access granted');
      
      // Check if flash is supported
      const videoTrack = mediaStream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities() as any;
      const flashSupport = capabilities?.torch !== undefined;
      setFlashSupported(flashSupport);
      console.log('Flash supported:', flashSupport);
      
      // Set stream first
      setStream(mediaStream);
      setCameraActive(true);
      
      // Wait a bit for the component to render the video element
      const assignStreamToVideo = () => {
        if (videoRef.current) {
          console.log('Assigning stream to video element');
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
          });
        } else {
          console.log('Video ref still null, retrying in 100ms');
          setTimeout(assignStreamToVideo, 100);
        }
      };
      
      // Start the assignment process
      assignStreamToVideo();
      
    } catch (error) {
      console.error('Camera start error:', error);
      setCameraActive(false);
      toast({
        title: t('cameraError'),
        description: t('cameraPermissionError'),
        variant: 'destructive'
      });
    } finally {
      setCameraInitializing(false);
    }
  }, [t, stream, stopCamera]);

  // Reset camera function
  const resetCamera = useCallback(() => {
    stopCamera();
    // Small delay to ensure all resources are cleaned up
    setTimeout(() => {
      startCamera();
    }, 300);
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
      console.log('Flash toggled to:', newFlashState);
    } catch (error) {
      console.error('Flash toggle error:', error);
      toast({
        title: t('flashNotSupported'),
        description: t('deviceNoFlash'),
        variant: 'destructive'
      });
    }
  }, [stream, flashEnabled, flashSupported, t]);

  // Capture image function with improved error checking
  const captureImage = useCallback((): string | null => {
    console.log('Attempting to capture image...');
    console.log('Video loaded state:', videoLoaded);
    console.log('Video element exists:', !!videoRef.current);
    console.log('Canvas element exists:', !!canvasRef.current);
    
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref is null');
      toast({
        title: t('captureError'),
        description: t('cameraNotReady'),
        variant: 'destructive'
      });
      return null;
    }
    
    if (!videoLoaded || !cameraActive) {
      console.error('Video not loaded or camera not active');
      toast({
        title: t('captureError'),
        description: t('cameraNotReady'),
        variant: 'destructive'
      });
      return null;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Check if video has valid dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('Video dimensions are invalid:', video.videoWidth, video.videoHeight);
      toast({
        title: t('captureError'),
        description: t('cameraNotReady'),
        variant: 'destructive'
      });
      return null;
    }
    
    console.log('Setting canvas dimensions to:', video.videoWidth, video.videoHeight);
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return null;
    }
    
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      console.log('Image captured successfully');
      // Get image data URL
      return canvas.toDataURL('image/jpeg');
    } catch (error) {
      console.error('Canvas to data URL error:', error);
      toast({
        title: t('captureError'),
        description: String(error),
        variant: 'destructive'
      });
      return null;
    }
  }, [videoRef, canvasRef, videoLoaded, cameraActive, t]);

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
