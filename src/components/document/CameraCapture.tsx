import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useCamera } from '@/hooks/useCamera';
import CameraView from './CameraView';
import CameraControls from './CameraControls';
import ImageGallery from './ImageGallery';

interface CameraCaptureProps {
  images: string[];
  setImages: (images: string[]) => void;
}

const CameraCapture = ({ images = [], setImages }: CameraCaptureProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const { t } = useLanguage();
  const hasMountedRef = useRef(false);
  
  // Initialize camera hook
  const cameraInterface = useCamera();
  
  // Auto-start camera when component mounts - prevent multiple mounts
  useEffect(() => {
    if (!hasMountedRef.current) {
      console.log('CameraCapture component mounted for first time');
      hasMountedRef.current = true;
      
      if (!cameraInterface.cameraActive && !cameraInterface.cameraInitializing) {
        console.log('Auto-starting camera');
        cameraInterface.startCamera();
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (hasMountedRef.current && cameraInterface.cameraActive) {
        console.log('Stopping camera on unmount');
        cameraInterface.stopCamera();
      }
    };
  }, []); // Empty dependency array to prevent re-running
  
  // Capture image handler with state updates and improved error handling
  const handleCaptureImage = useCallback(() => {
    console.log('Capture image requested');
    setIsCapturing(true);
    
    try {
      // Get image data URL
      const imageDataUrl = cameraInterface.captureImage();
      
      // Check if imageDataUrl is truthy before proceeding
      if (imageDataUrl && typeof imageDataUrl === 'string') {
        console.log('Image captured successfully, updating images array');
        setImages([...(images || []), imageDataUrl]);
        
        toast({
          title: t('imageCaptured'),
          description: `${(images || []).length + 1} ${t('ofImages')}`
        });
      } else {
        console.error('Image capture returned null or undefined');
      }
    } catch (err) {
      console.error('Error in capture handler:', err);
      toast({
        title: t('captureError'),
        description: String(err),
        variant: 'destructive'
      });
    } finally {
      setIsCapturing(false);
    }
  }, [images, setImages, t, cameraInterface]);
  
  // Remove image with safety check
  const removeImage = (index: number) => {
    if (!images) return;
    setImages(images.filter((_, i) => i !== index));
  };

  // Ensure we always have a valid images array
  const safeImages = images || [];
  
  return (
    <div className="space-y-4">
      {/* Camera view with hidden canvas for captures */}
      <CameraView cameraInterface={cameraInterface} />
      <canvas ref={cameraInterface.canvasRef} className="hidden" />
      
      {/* Camera controls */}
      <CameraControls 
        cameraInterface={cameraInterface}
        onCapture={handleCaptureImage}
        isCapturing={isCapturing}
      />
      
      {/* Captured images */}
      <ImageGallery 
        images={safeImages}
        onRemoveImage={removeImage}
        onAddImage={handleCaptureImage}
        cameraActive={cameraInterface.cameraActive}
        videoLoaded={cameraInterface.videoLoaded}
        cameraInitializing={cameraInterface.cameraInitializing}
      />
    </div>
  );
};

export default CameraCapture;
