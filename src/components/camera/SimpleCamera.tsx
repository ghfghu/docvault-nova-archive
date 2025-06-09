
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useSimpleCamera } from '@/hooks/useSimpleCamera';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/hooks/use-toast';

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

  const handleRetryCamera = () => {
    console.log('Retrying camera initialization');
    camera.stopCamera();
    setTimeout(() => {
      camera.startCamera();
    }, 500);
  };

  const handleStartCamera = () => {
    console.log('Starting camera manually');
    camera.startCamera();
  };

  return (
    <div className="space-y-4" dir={dir}>
      {/* Camera View */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {camera.hasError ? (
          <div className="flex flex-col items-center justify-center h-full text-white p-4">
            <AlertCircle size={48} className="mb-4 text-red-400" />
            <p className="text-center mb-4 text-sm" dir={dir}>
              {camera.errorMessage}
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              <Button 
                onClick={handleStartCamera}
                className="bg-docvault-accent hover:bg-docvault-accent/80"
                disabled={camera.isLoading}
              >
                {camera.isLoading ? (
                  <Loader2 className="mr-2 animate-spin" size={16} />
                ) : (
                  <Camera className="mr-2" size={16} />
                )}
                {t('tryAgain')}
              </Button>
              <Button 
                onClick={handleRetryCamera}
                variant="outline"
                className="border-docvault-accent/30 text-white"
                disabled={camera.isLoading}
              >
                <RefreshCw className="mr-2" size={16} />
                {t('reset')}
              </Button>
            </div>
          </div>
        ) : camera.isActive ? (
          <>
            <video 
              ref={camera.videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
            {(camera.isLoading || !camera.isReady) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-center">
                  <Loader2 className="mx-auto mb-2 animate-spin" size={32} />
                  <p dir={dir}>{t('loadingCamera')}</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Button 
              onClick={handleStartCamera}
              disabled={camera.isLoading}
              className="bg-docvault-accent hover:bg-docvault-accent/80"
            >
              {camera.isLoading ? (
                <Loader2 className="mr-2 animate-spin" size={18} />
              ) : (
                <Camera className="mr-2" size={18} />
              )}
              {camera.isLoading ? t('loading') : t('startCamera')}
            </Button>
          </div>
        )}
      </div>

      <canvas ref={camera.canvasRef} className="hidden" />

      {/* Controls */}
      {camera.isActive && camera.isReady && !camera.hasError && (
        <div className="flex justify-center gap-4">
          {camera.canSwitchCamera && (
            <Button
              onClick={camera.switchCamera}
              variant="outline"
              className="border-docvault-accent/30"
              disabled={camera.isLoading}
            >
              <RotateCcw size={18} />
            </Button>
          )}
          
          <Button
            onClick={handleCapture}
            disabled={!camera.isReady || isCapturing || camera.isLoading}
            className="bg-docvault-accent hover:bg-docvault-accent/80 px-8"
          >
            {isCapturing ? (
              <Loader2 className="mr-2 animate-spin" size={18} />
            ) : (
              <Camera className="mr-2" size={18} />
            )}
            {isCapturing ? t('capturing') : t('capture')}
          </Button>
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={image} 
                alt={`Captured ${index + 1}`}
                className="w-full h-32 object-cover rounded border"
              />
              <Button
                onClick={() => removeImage(index)}
                size="sm"
                variant="destructive"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleCamera;
