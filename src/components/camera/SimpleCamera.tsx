
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw, AlertCircle } from 'lucide-react';
import { useSimpleCamera } from '@/hooks/useSimpleCamera';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/hooks/use-toast';

interface SimpleCameraProps {
  images: string[];
  setImages: (images: string[]) => void;
}

const SimpleCamera = ({ images, setImages }: SimpleCameraProps) => {
  const { t } = useLanguage();
  const camera = useSimpleCamera();
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async () => {
    setIsCapturing(true);
    const imageData = camera.captureImage();
    
    if (imageData) {
      setImages([...images, imageData]);
      toast({
        title: t('imageCaptured'),
        description: `${images.length + 1} ${t('ofImages')}`
      });
    } else {
      toast({
        title: t('captureError'),
        description: t('cameraNotReady'),
        variant: 'destructive'
      });
    }
    setIsCapturing(false);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Camera View */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {camera.hasError ? (
          <div className="flex flex-col items-center justify-center h-full text-white p-4">
            <AlertCircle size={48} className="mb-4 text-red-400" />
            <p className="text-center mb-4 text-sm">{camera.errorMessage}</p>
            <Button 
              onClick={camera.startCamera}
              className="bg-docvault-accent hover:bg-docvault-accent/80"
            >
              <Camera className="mr-2" size={16} />
              {t('tryAgain')}
            </Button>
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
            {camera.isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-center">
                  <Camera className="mx-auto mb-2 animate-pulse" size={32} />
                  <p>{t('loadingCamera')}</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Button 
              onClick={camera.startCamera}
              disabled={camera.isLoading}
              className="bg-docvault-accent hover:bg-docvault-accent/80"
            >
              <Camera className="mr-2" size={18} />
              {camera.isLoading ? t('loading') : t('startCamera')}
            </Button>
          </div>
        )}
      </div>

      <canvas ref={camera.canvasRef} className="hidden" />

      {/* Controls */}
      {camera.isActive && camera.isReady && (
        <div className="flex justify-center gap-4">
          {camera.canSwitchCamera && (
            <Button
              onClick={camera.switchCamera}
              variant="outline"
              className="border-docvault-accent/30"
            >
              <RotateCcw size={18} />
            </Button>
          )}
          
          <Button
            onClick={handleCapture}
            disabled={!camera.isReady || isCapturing}
            className="bg-docvault-accent hover:bg-docvault-accent/80 px-8"
          >
            <Camera className="mr-2" size={18} />
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
