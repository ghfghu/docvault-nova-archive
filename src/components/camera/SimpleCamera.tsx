
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useSimpleCamera } from '@/hooks/useSimpleCamera';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/hooks/use-toast';
import CameraErrorView from './CameraErrorView';
import CameraVideoView from './CameraVideoView';
import CameraStartView from './CameraStartView';
import CameraControls from './CameraControls';
import CameraImageGallery from './CameraImageGallery';

interface SimpleCameraProps {
  images: string[];
  setImages: (images: string[]) => void;
}

const SimpleCamera = ({ images, setImages }: SimpleCameraProps) => {
  const { t, language } = useLanguage();
  const camera = useSimpleCamera();
  const [isCapturing, setIsCapturing] = useState(false);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const handleCapture = async () => {
    console.log('Handle capture clicked');
    setIsCapturing(true);
    
    try {
      const imageData = camera.captureImage();
      
      if (imageData) {
        console.log('Image captured, adding to collection');
        setImages([...images, imageData]);
        toast({
          title: t('imageCaptured'),
          description: `${images.length + 1} ${t('ofImages')}`
        });
      } else {
        console.error('Image capture returned null');
        toast({
          title: t('captureError'),
          description: t('cameraNotReady'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error in handleCapture:', error);
      toast({
        title: t('captureError'),
        description: t('cameraNotReady'),
        variant: 'destructive'
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4" dir={dir}>
      {/* Camera View */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {camera.hasError ? (
          <CameraErrorView 
            errorMessage={camera.errorMessage}
            onStartCamera={camera.startCamera}
            onRetryCamera={() => {
              camera.stopCamera();
              setTimeout(camera.startCamera, 500);
            }}
            isLoading={camera.isLoading}
            dir={dir}
          />
        ) : camera.isActive ? (
          <CameraVideoView 
            videoRef={camera.videoRef}
            isReady={camera.isReady}
            isLoading={camera.isLoading}
            dir={dir}
          />
        ) : (
          <CameraStartView 
            onStartCamera={camera.startCamera}
            isLoading={camera.isLoading}
          />
        )}
      </div>

      <canvas ref={camera.canvasRef} className="hidden" />

      {/* Controls */}
      {camera.isActive && camera.isReady && !camera.hasError && (
        <CameraControls
          canSwitchCamera={camera.canSwitchCamera}
          onSwitchCamera={camera.switchCamera}
          onCapture={handleCapture}
          isReady={camera.isReady}
          isCapturing={isCapturing}
          isLoading={camera.isLoading}
        />
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <CameraImageGallery 
          images={images}
          onRemoveImage={removeImage}
        />
      )}
    </div>
  );
};

export default SimpleCamera;
