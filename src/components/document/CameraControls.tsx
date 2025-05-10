
import { Button } from '@/components/ui/button';
import { Camera, RotateCw, Zap, ZapOff, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { UseCameraReturn } from '@/hooks/useCamera';

interface CameraControlsProps {
  cameraInterface: UseCameraReturn;
  onCapture: () => void;
  isCapturing: boolean;
}

const CameraControls = ({ cameraInterface, onCapture, isCapturing }: CameraControlsProps) => {
  const { t } = useLanguage();
  const { 
    cameraActive, 
    flashSupported, 
    flashEnabled, 
    toggleFlash, 
    resetCamera, 
    videoLoaded,
    cameraInitializing
  } = cameraInterface;

  if (!cameraActive) return null;

  return (
    <div className="flex items-center justify-center space-x-4">
      {flashSupported && (
        <Button 
          type="button" 
          onClick={toggleFlash}
          variant="outline"
          className="border-docvault-accent/30"
          disabled={!videoLoaded || cameraInitializing}
        >
          {flashEnabled ? (
            <>
              <ZapOff className="mr-2" size={18} />
              {t('disableFlash')}
            </>
          ) : (
            <>
              <Zap className="mr-2" size={18} />
              {t('enableFlash')}
            </>
          )}
        </Button>
      )}
      
      <Button 
        type="button" 
        onClick={onCapture}
        className="bg-docvault-accent hover:bg-docvault-accent/80"
        disabled={!videoLoaded || isCapturing || cameraInitializing}
      >
        {isCapturing ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Camera className="mr-2" size={18} />
        )}
        {t('capture')}
      </Button>
      
      <Button 
        type="button" 
        onClick={resetCamera}
        variant="outline"
        className="border-docvault-accent/30"
        disabled={cameraInitializing}
      >
        <RotateCw size={18} />
      </Button>
    </div>
  );
};

export default CameraControls;
