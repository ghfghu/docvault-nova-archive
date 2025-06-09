
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CameraControlsProps {
  canSwitchCamera: boolean;
  onSwitchCamera: () => void;
  onCapture: () => void;
  isReady: boolean;
  isCapturing: boolean;
  isLoading: boolean;
}

const CameraControls = ({ 
  canSwitchCamera, 
  onSwitchCamera, 
  onCapture, 
  isReady, 
  isCapturing, 
  isLoading 
}: CameraControlsProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-center gap-4">
      {canSwitchCamera && (
        <Button
          onClick={onSwitchCamera}
          variant="outline"
          className="border-docvault-accent/30"
          disabled={isLoading}
        >
          <RotateCcw size={18} />
        </Button>
      )}
      
      <Button
        onClick={onCapture}
        disabled={!isReady || isCapturing || isLoading}
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
  );
};

export default CameraControls;
