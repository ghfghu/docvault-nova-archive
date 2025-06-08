
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw, Smartphone, AlertCircle, Settings } from 'lucide-react';
import { useMobileCamera } from '@/hooks/useMobileCamera';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MobileCameraProps {
  images: string[];
  setImages: (images: string[]) => void;
}

const MobileCamera = ({ images, setImages }: MobileCameraProps) => {
  const { t } = useLanguage();
  const camera = useMobileCamera();
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  const handleStartCamera = async () => {
    if (camera.permission.status === 'denied' || camera.permission.status === 'unavailable') {
      setShowPermissionDialog(true);
      return;
    }
    await camera.startCamera();
  };

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

  const PermissionDialog = () => (
    <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
      <DialogContent className="glass-card">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Camera className="mr-2 text-docvault-accent" />
            Camera Permission Required
          </DialogTitle>
          <DialogDescription className="space-y-3">
            <p>{camera.permission.error}</p>
            <div className="bg-docvault-dark/30 p-3 rounded text-sm">
              <p className="font-medium mb-2">To enable camera access:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click the camera icon in your browser's address bar</li>
                <li>Select "Allow" for camera permissions</li>
                <li>Refresh the page if needed</li>
              </ol>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setShowPermissionDialog(false);
              camera.requestPermissions();
            }}
            className="flex-1 bg-docvault-accent hover:bg-docvault-accent/80"
          >
            <Settings className="mr-2" size={16} />
            Check Permissions
          </Button>
          <Button
            onClick={() => setShowPermissionDialog(false)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-4">
      {/* Camera View */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {camera.permission.status === 'denied' || camera.permission.status === 'unavailable' ? (
          <div className="flex flex-col items-center justify-center h-full text-white p-4">
            <AlertCircle size={48} className="mb-4 text-red-400" />
            <p className="text-center mb-4">{camera.permission.error}</p>
            <Button 
              onClick={handleStartCamera}
              className="bg-docvault-accent hover:bg-docvault-accent/80"
            >
              <Settings className="mr-2" size={16} />
              Fix Camera Access
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
                  <p>Loading camera...</p>
                </div>
              </div>
            )}
            {camera.permission.status === 'requesting' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-center">
                  <Smartphone className="mx-auto mb-2 animate-bounce" size={32} />
                  <p>Requesting camera access...</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Button 
              onClick={handleStartCamera}
              disabled={camera.isLoading || camera.permission.status === 'requesting'}
              className="bg-docvault-accent hover:bg-docvault-accent/80"
            >
              <Camera className="mr-2" size={18} />
              {camera.isLoading ? 'Starting...' : t('startCamera')}
            </Button>
          </div>
        )}
      </div>

      <canvas ref={camera.canvasRef} className="hidden" />

      {/* Controls */}
      {camera.isActive && camera.isReady && (
        <div className="flex justify-center gap-4">
          {camera.hasMultipleCameras && (
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
            {isCapturing ? 'Capturing...' : t('capture')}
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

      <PermissionDialog />
    </div>
  );
};

export default MobileCamera;
