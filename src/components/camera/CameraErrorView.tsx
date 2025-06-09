
import { Button } from '@/components/ui/button';
import { AlertCircle, Camera, RefreshCw, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CameraErrorViewProps {
  errorMessage: string;
  onStartCamera: () => void;
  onRetryCamera: () => void;
  isLoading: boolean;
  dir: string;
}

const CameraErrorView = ({ errorMessage, onStartCamera, onRetryCamera, isLoading, dir }: CameraErrorViewProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center h-full text-white p-4">
      <AlertCircle size={48} className="mb-4 text-red-400" />
      <p className="text-center mb-4 text-sm" dir={dir}>
        {errorMessage}
      </p>
      <div className="flex gap-2 flex-wrap justify-center">
        <Button 
          onClick={onStartCamera}
          className="bg-docvault-accent hover:bg-docvault-accent/80"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 animate-spin" size={16} />
          ) : (
            <Camera className="mr-2" size={16} />
          )}
          {t('tryAgain')}
        </Button>
        <Button 
          onClick={onRetryCamera}
          variant="outline"
          className="border-docvault-accent/30 text-white"
          disabled={isLoading}
        >
          <RefreshCw className="mr-2" size={16} />
          {t('reset')}
        </Button>
      </div>
    </div>
  );
};

export default CameraErrorView;
