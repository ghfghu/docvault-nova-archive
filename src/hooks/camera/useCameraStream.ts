
import { useRef, useCallback } from 'react';
import { ExtendedMediaTrackCapabilities } from '@/types/camera';
import { CameraState } from './types';

interface UseCameraStreamProps {
  state: CameraState;
  setState: (updates: Partial<CameraState>) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  getCameraConstraints: () => MediaStreamConstraints;
}

export const useCameraStream = ({ state, setState, videoRef, getCameraConstraints }: UseCameraStreamProps) => {
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async (): Promise<void> => {
    if (state.cameraInitializing || state.cameraActive) return;
    
    console.log('Starting camera...');
    setState({ cameraInitializing: true, videoLoaded: false });

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
          setState({ 
            videoLoaded: true, 
            cameraActive: true 
          });
          
          // Check for flash support
          const videoTrack = stream.getVideoTracks()[0];
          if (videoTrack) {
            const capabilities = videoTrack.getCapabilities?.() as ExtendedMediaTrackCapabilities;
            if (capabilities?.torch) {
              setState({ flashSupported: true });
              console.log('Flash/torch supported');
            }
          }
        };
        
        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setState({ 
        cameraActive: false, 
        videoLoaded: false 
      });
      
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
      setState({ cameraInitializing: false });
    }
  }, [state.cameraInitializing, state.cameraActive, getCameraConstraints, setState, videoRef]);

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
    
    setState({
      cameraActive: false,
      videoLoaded: false,
      flashEnabled: false,
      flashSupported: false
    });
  }, [setState, videoRef]);

  return {
    streamRef,
    startCamera,
    stopCamera
  };
};
