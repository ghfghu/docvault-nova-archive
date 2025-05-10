
import { Button } from '@/components/ui/button';
import { X, Plus, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ImageGalleryProps {
  images: string[];
  onRemoveImage: (index: number) => void;
  onAddImage: () => void;
  cameraActive: boolean;
  videoLoaded: boolean;
  cameraInitializing: boolean;
}

const ImageGallery = ({ 
  images, 
  onRemoveImage, 
  onAddImage,
  cameraActive,
  videoLoaded,
  cameraInitializing
}: ImageGalleryProps) => {
  const { t } = useLanguage();

  if (!images.length && !cameraActive) return null;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img 
              src={image} 
              alt={`Captured ${index + 1}`} 
              className="w-full h-36 object-cover rounded-md border border-docvault-accent/30"
            />
            <Button
              type="button"
              onClick={() => onRemoveImage(index)}
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
            >
              <X size={14} />
            </Button>
          </div>
        ))}
        
        {images.length < 2 && (
          <div 
            className="w-full h-36 border border-dashed border-docvault-accent/30 rounded-md flex items-center justify-center cursor-pointer hover:bg-docvault-accent/10 transition-colors"
            onClick={(cameraActive && videoLoaded) ? onAddImage : onAddImage}
            aria-disabled={cameraInitializing}
          >
            <div className="flex flex-col items-center">
              {cameraInitializing ? (
                <Loader2 size={24} className="animate-spin text-docvault-accent mb-1" />
              ) : (
                <Plus size={24} className="text-docvault-accent mb-1" />
              )}
              <span className="text-xs">{t('addAnotherImage')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
