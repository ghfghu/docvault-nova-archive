
import { useState, useCallback } from 'react';
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
  
  // Initialize camera hook
  const cameraInterface = useCamera();
  
  // Capture image handler with state updates
  const handleCaptureImage = useCallback(() => {
    setIsCapturing(true);
    
    try {
      const imageDataUrl = cameraInterface.captureImage();
      
      // Check if imageDataUrl is truthy before proceeding
      if (imageDataUrl && typeof imageDataUrl === 'string') {
        setImages([...(images || []), imageDataUrl]);
        
        toast({
          title: t('imageCaptured'),
          description: `${(images || []).length + 1} ${t('ofImages')}`
        });
      }
    } catch (err) {
      console.error('Error in capture handler:', err);
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
