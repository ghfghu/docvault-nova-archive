
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ExtendedMediaTrackCapabilities, 
  MediaTrackConstraintsWithTorch, 
  ExtendedMediaTrackConstraintSet 
} from '@/types/camera';

export interface UseCameraProps {
  onVideoLoad?: () => void;
}

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
  captureImage: () => void;
}

export const useCamera = ({ onVideoLoad }: UseCameraProps = {}): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [flashSupported, setFlashSupported] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [cameraInitializing, setCameraInitializing] = useState(false);
  const { t } = useLanguage();

  // Initialize camera when component mounts
  useEffect(() => {
    // If camera should be active, but stream is not set, start camera
    if (cameraActive && !stream) {
      startCamera();
    }
    
    // Cleanup: stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraActive, stream]);

  // Handler for when video is loaded and ready
  const handleVideoLoad = () => {
    console.log('Video metadata loaded');
    setVideoLoaded(true);
    setCameraInitializing(false);
    if (onVideoLoad) {
      onVideoLoad();
    }
  };

  // Initialize camera with safe error handling
  const startCamera = async () => {
    try {
      setVideoLoaded(false);
      setCameraInitializing(true);
      // Stop any existing streams first
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      console.log('Starting camera with environment facing mode');
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Add event listener for when video metadata is loaded
        videoRef.current.onloadedmetadata = handleVideoLoad;
      }
      
      // Check if torch is supported
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
        setFlashSupported(!!capabilities?.torch);
      }
      
      setStream(mediaStream);
      setCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraInitializing(false);
      toast({
        title: t('cameraError'),
        description: t('cameraPermissionError'),
        variant: "destructive"
      });
    }
  };
  
  // Toggle camera flash (if supported) with additional checks
  const toggleFlash = async () => {
    if (!stream) return;
    
    try {
      const videoTracks = stream.getVideoTracks();
      if (!videoTracks || videoTracks.length === 0) return;
      
      const videoTrack = videoTracks[0];
      const capabilities = videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
      
      // Check if torch is supported
      if (capabilities && capabilities.torch) {
        const torchConstraint: ExtendedMediaTrackConstraintSet = { torch: !flashEnabled };
        // Create constraint object
        const constraints: MediaTrackConstraintsWithTorch = {
          advanced: [torchConstraint]
        };
        
        await videoTrack.applyConstraints(constraints);
        setFlashEnabled(!flashEnabled);
      } else {
        toast({
          title: t('flashNotSupported'),
          description: t('deviceNoFlash'),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error toggling flash:', error);
    }
  };
  
  // Capture image from camera with additional safety checks
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !videoLoaded) {
      console.log('Video not ready for capture yet');
      toast({
        title: t('cameraError'),
        description: t('cameraNotReady'),
        variant: "destructive"
      });
      return;
    }
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Check if video is properly initialized and playing
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error('Video dimensions are not available');
        toast({
          title: t('cameraError'),
          description: t('cameraNotReady'),
          variant: "destructive"
        });
        return;
      }
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL and return it
        return canvas.toDataURL('image/jpeg', 0.8);
      }
    } catch (err) {
      console.error('Error capturing image:', err);
      toast({
        title: t('captureError'),
        description: String(err),
        variant: "destructive"
      });
    }
    
    return null;
  };
  
  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
    setFlashEnabled(false);
    setVideoLoaded(false);
  };
  
  // Reset camera
  const resetCamera = () => {
    stopCamera();
    startCamera();
  };

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
