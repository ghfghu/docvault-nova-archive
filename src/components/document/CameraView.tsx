
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { UseCameraReturn } from '@/hooks/useCamera';
import { useEffect } from 'react';

interface CameraViewProps {
  cameraInterface: UseCameraReturn;
}

const CameraView = ({ cameraInterface }: CameraViewProps) => {
  const { t, language } = useLanguage();
  const { 
    videoRef, 
    cameraActive, 
    videoLoaded, 
    cameraInitializing, 
    startCamera 
  } = cameraInterface;

  // Determine loading text direction based on language
  const textDirection = language === 'ar' ? 'rtl' : 'ltr';

  // Log camera status changes
  useEffect(() => {
    console.log('Camera status:', { 
      cameraActive, 
      videoLoaded, 
      cameraInitializing 
    });
  }, [cameraActive, videoLoaded, cameraInitializing]);

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {cameraActive ? (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {(!videoLoaded || cameraInitializing) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-10 w-10 animate-spin text-docvault-accent" />
              <span className={`ml-2 text-white`} dir={textDirection}>{t('cameraLoading')}</span>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <Button 
            type="button"
            onClick={startCamera}
            className="bg-docvault-accent hover:bg-docvault-accent/80"
            disabled={cameraInitializing}
          >
            {cameraInitializing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Camera className="mr-2" size={18} />
            )}
            {t('startCamera')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CameraView;
