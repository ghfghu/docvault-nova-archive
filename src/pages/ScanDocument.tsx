
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Camera, X, Zap, ZapOff, Plus, RotateCw } from 'lucide-react';
import { useData } from '@/context/DataContext';
import Layout from '@/components/Layout';
import { toast } from '@/components/ui/use-toast';

// Document types
const documentTypes = [
  'ID Card',
  'Passport',
  'Driver\'s License',
  'Birth Certificate',
  'Invoice',
  'Contract',
  'Medical Record',
  'Evidence',
  'Other'
];

// Viewing tags
const viewingTags = [
  'Inspected',
  'Reviewed',
  'Approved',
  'Rejected',
  'Pending',
  'Flagged',
  'Confidential'
];

const ScanDocument = () => {
  const navigate = useNavigate();
  const { addDocument } = useData();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [docType, setDocType] = useState('');
  const [priority, setPriority] = useState(5);
  const [notes, setNotes] = useState('');
  const [viewingTag, setViewingTag] = useState('');
  
  // Initialize camera
  const startCamera = async () => {
    try {
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
      
      setStream(mediaStream);
      setCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  // Toggle camera flash (if supported)
  const toggleFlash = async () => {
    if (!stream) return;
    
    try {
      const videoTrack = stream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities();
      
      // Check if torch is supported
      if (capabilities.torch) {
        await videoTrack.applyConstraints({
          advanced: [{ torch: !flashEnabled }]
        });
        setFlashEnabled(!flashEnabled);
      } else {
        toast({
          title: "Flash not supported",
          description: "Your device camera does not support flash control",
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
          title: "Image captured",
          description: `${images.length + 1} of 2 images captured`
        });
      }
    }
  }, [images]);
  
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
  
  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast({
        title: "No images",
        description: "Please capture at least one image before saving",
        variant: "destructive"
      });
      return;
    }
    
    // Create document object
    const newDocument = {
      name,
      date,
      type: docType || 'Other',
      priority: Number(priority),
      notes,
      viewingTag: viewingTag || undefined,
      images
    };
    
    // Add document
    addDocument(newDocument);
    
    // Navigate to documents page
    navigate('/documents');
  };
  
  // Clean up on unmount
  const handleLeave = () => {
    stopCamera();
  };
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gradient">Scan Document</h1>
          <p className="text-docvault-gray text-sm">
            Capture and document important information
          </p>
        </header>
        
        <form onSubmit={handleSubmit}>
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Camera className="mr-2 text-docvault-accent" size={20} />
                Camera Capture
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                        Start Camera
                      </Button>
                    </div>
                  )}
                  
                  {/* Hidden canvas for captures */}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                
                {/* Camera controls */}
                {cameraActive && (
                  <div className="flex items-center justify-center space-x-4">
                    <Button 
                      type="button" 
                      onClick={toggleFlash}
                      variant="outline"
                      className="border-docvault-accent/30"
                    >
                      {flashEnabled ? (
                        <>
                          <ZapOff className="mr-2" size={18} />
                          Disable Flash
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2" size={18} />
                          Enable Flash
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      onClick={captureImage}
                      className="bg-docvault-accent hover:bg-docvault-accent/80"
                    >
                      <Camera className="mr-2" size={18} />
                      Capture
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
                    <Label>Captured Images</Label>
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
                            <span className="text-xs">Add another image</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Document Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name">Document Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter document name"
                      className="bg-docvault-dark/50 border-docvault-accent/30"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-docvault-dark/50 border-docvault-accent/30"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="docType">Document Type</Label>
                      <Select value={docType} onValueChange={setDocType}>
                        <SelectTrigger className="bg-docvault-dark/50 border-docvault-accent/30">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Priority (1-10)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="priority"
                          type="number"
                          value={priority}
                          onChange={(e) => setPriority(Number(e.target.value))}
                          min={1}
                          max={10}
                          className="bg-docvault-dark/50 border-docvault-accent/30"
                        />
                        
                        <div className="w-8 h-8 flex items-center justify-center rounded-full" style={{
                          backgroundColor: `rgba(30, 174, 219, ${priority / 10})`,
                          boxShadow: `0 0 ${priority * 2}px rgba(30, 174, 219, ${priority / 10})`
                        }}>
                          {priority}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="viewingTag">Viewing Tag (Optional)</Label>
                      <Select value={viewingTag} onValueChange={setViewingTag}>
                        <SelectTrigger className="bg-docvault-dark/50 border-docvault-accent/30">
                          <SelectValue placeholder="Select tag" />
                        </SelectTrigger>
                        <SelectContent>
                          {viewingTags.map((tag) => (
                            <SelectItem key={tag} value={tag}>
                              {tag}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Observation Notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter any additional notes or observations"
                      className="bg-docvault-dark/50 border-docvault-accent/30 min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                className="border-docvault-accent/30"
                onClick={() => {
                  handleLeave();
                  navigate('/documents');
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-docvault-accent hover:bg-docvault-accent/80"
              >
                Save Document
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Layout>
  );
};

export default ScanDocument;
