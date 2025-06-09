
import { Button } from '@/components/ui/button';

interface CameraImageGalleryProps {
  images: string[];
  onRemoveImage: (index: number) => void;
}

const CameraImageGallery = ({ images, onRemoveImage }: CameraImageGalleryProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <img 
            src={image} 
            alt={`Captured ${index + 1}`}
            className="w-full h-32 object-cover rounded border"
          />
          <Button
            onClick={() => onRemoveImage(index)}
            size="sm"
            variant="destructive"
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ×
          </Button>
        </div>
      ))}
    </div>
  );
};

export default CameraImageGallery;
