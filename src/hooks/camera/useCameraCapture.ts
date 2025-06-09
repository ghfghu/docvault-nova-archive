
import { useRef, useCallback } from 'react';

export const useCameraCapture = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const captureImage = useCallback((videoRef: React.RefObject<HTMLVideoElement>): string | null => {
    console.log('Attempting to capture image...');
    
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref not available');
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

      const videoWidth = video.videoWidth || 640;
      const videoHeight = video.videoHeight || 480;
      
      console.log('Video dimensions:', { videoWidth, videoHeight });
      
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      
      context.drawImage(video, 0, 0, videoWidth, videoHeight);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      console.log('Image captured successfully');
      
      return imageDataUrl;
    } catch (error) {
      console.error('Error capturing image:', error);
      return null;
    }
  }, []);

  return {
    canvasRef,
    captureImage
  };
};
