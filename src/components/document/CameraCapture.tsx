
import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCw, X, Zap, ZapOff, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ExtendedMediaTrackCapabilities, 
  MediaTrackConstraintsWithTorch, 
  ExtendedMediaTrackConstraintSet 
} from '@/types/camera';

interface CameraCaptureProps {
  images: string[];
  setImages: (images: string[]) => void;
}

const CameraCapture = ({ images, setImages }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [flashSupported, setFlashSupported] = useState(false);
  const { t } = useLanguage();

  // Initialize camera when component mounts
  useEffect(() => {
    // If camera should be active, but stream is not set, start camera
    if (cameraActive && !stream) {
      startCamera();
    }
    
    // Cleanup: stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraActive, stream]);

  // Initialize camera
  const startCamera = async () => {
    try {
      // Stop any existing streams first
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      // Check if torch is supported
      const videoTrack = mediaStream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
      
      setFlashSupported(!!capabilities.torch);
      setStream(mediaStream);
      setCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: t('cameraError'),
        description: t('cameraPermissionError'),
        variant: "destructive"
      });
    }
  };
  
  // Toggle camera flash (if supported)
  const toggleFlash = async () => {
    if (!stream) return;
    
    try {
      const videoTrack = stream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
      
      // Check if torch is supported
      if (capabilities.torch) {
        const torchConstraint: ExtendedMediaTrackConstraintSet = { torch: !flashEnabled };
        // Create constraint object
        const constraints: MediaTrackConstraintsWithTorch = {
          advanced: [torchConstraint]
        };
        
        await videoTrack.applyConstraints(constraints);
        setFlashEnabled(!flashEnabled);
      } else {
        toast({
          title: t('flashNotSupported'),
          description: t('deviceNoFlash'),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error toggling flash:', error);
    }
  };
  
  // Capture image from camera
  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setImages([...images, imageDataUrl]);
        
        toast({
          title: t('imageCaptured'),
          description: `${images.length + 1} ${t('ofImages')}`
        });
      }
    }
  }, [images, setImages, t]);
  
  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
    setFlashEnabled(false);
  };
  
  // Reset camera
  const resetCamera = () => {
    stopCamera();
    startCamera();
  };
  
  // Remove image
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Camera view */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {cameraActive ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Button 
              type="button"
              onClick={startCamera}
              className="bg-docvault-accent hover:bg-docvault-accent/80"
            >
              <Camera className="mr-2" size={18} />
              {t('startCamera')}
            </Button>
          </div>
        )}
        
        {/* Hidden canvas for captures */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {/* Camera controls */}
      {cameraActive && (
        <div className="flex items-center justify-center space-x-4">
          {flashSupported && (
            <Button 
              type="button" 
              onClick={toggleFlash}
              variant="outline"
              className="border-docvault-accent/30"
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
            onClick={captureImage}
            className="bg-docvault-accent hover:bg-docvault-accent/80"
          >
            <Camera className="mr-2" size={18} />
            {t('capture')}
          </Button>
          
          <Button 
            type="button" 
            onClick={resetCamera}
            variant="outline"
            className="border-docvault-accent/30"
          >
            <RotateCw size={18} />
          </Button>
        </div>
      )}
      
      {/* Captured images */}
      {images.length > 0 && (
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
                  onClick={() => removeImage(index)}
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
                onClick={cameraActive ? captureImage : startCamera}
              >
                <div className="flex flex-col items-center">
                  <Plus size={24} className="text-docvault-accent mb-1" />
                  <span className="text-xs">{t('addAnotherImage')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
