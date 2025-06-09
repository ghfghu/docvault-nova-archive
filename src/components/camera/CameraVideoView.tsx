
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CameraVideoViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isReady: boolean;
  isLoading: boolean;
  dir: string;
}

const CameraVideoView = ({ videoRef, isReady, isLoading, dir }: CameraVideoViewProps) => {
  const { t } = useLanguage();

  return (
    <>
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="w-full h-full object-cover"
      />
      {(isLoading || !isReady) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <Loader2 className="mx-auto mb-2 animate-spin" size={32} />
            <p dir={dir}>{t('loadingCamera')}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CameraVideoView;
