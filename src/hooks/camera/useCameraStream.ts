
import { useRef, useCallback } from 'react';
import { CameraState } from './useCameraState';

export const useCameraStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const createStream = useCallback(async (facingMode: 'environment' | 'user') => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('الكاميرا غير مدعومة في هذا المتصفح');
    }

    const constraints: MediaStreamConstraints = {
      video: {
        facingMode,
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 }
      },
      audio: false
    };

    console.log('Requesting camera access with facingMode:', facingMode);
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log('Camera stream obtained successfully');
    
    return stream;
  }, []);

  const attachStreamToVideo = useCallback((stream: MediaStream): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current) {
        reject(new Error('Video element not available'));
        return;
      }

      const video = videoRef.current;
      video.srcObject = stream;
      
      const handleCanPlay = () => {
        console.log('Video can play, stream attached successfully');
        video.removeEventListener('canplay', handleCanPlay);
        resolve();
      };

      const handleError = (error: Event) => {
        console.error('Video error:', error);
        video.removeEventListener('error', handleError);
        reject(new Error('Failed to attach stream to video'));
      };

      video.addEventListener('canplay', handleCanPlay, { once: true });
      video.addEventListener('error', handleError, { once: true });

      video.play().catch(playError => {
        console.warn('Auto-play failed, but stream should still work:', playError);
        resolve(); // Still resolve as the stream is attached
      });
    });
  }, []);

  const stopStream = useCallback(() => {
    console.log('Stopping camera stream...');
    
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
  }, []);

  return {
    videoRef,
    streamRef,
    checkCameraDevices,
    createStream,
    attachStreamToVideo,
    stopStream
  };
};
