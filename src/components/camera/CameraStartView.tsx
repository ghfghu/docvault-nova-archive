
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CameraStartViewProps {
  onStartCamera: () => void;
  isLoading: boolean;
}

const CameraStartView = ({ onStartCamera, isLoading }: CameraStartViewProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center h-full">
      <Button 
        onClick={onStartCamera}
        disabled={isLoading}
        className="bg-docvault-accent hover:bg-docvault-accent/80"
      >
        {isLoading ? (
          <Loader2 className="mr-2 animate-spin" size={18} />
        ) : (
          <Camera className="mr-2" size={18} />
        )}
        {isLoading ? t('loading') : t('startCamera')}
      </Button>
    </div>
  );
};

export default CameraStartView;
