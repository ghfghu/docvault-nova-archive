
import { useCallback } from 'react';

interface UseCameraCaptureProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  videoLoaded: boolean;
}

export const useCameraCapture = ({ videoRef, canvasRef, videoLoaded }: UseCameraCaptureProps) => {
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
  }, [videoRef, canvasRef, videoLoaded]);

  return { captureImage };
};
