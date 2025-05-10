
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import Layout from '@/components/Layout';
import CameraCapture from '@/components/document/CameraCapture';
import DocumentForm from '@/components/document/DocumentForm';
import { DocumentData } from '@/types/camera';

const ScanDocument = () => {
  const navigate = useNavigate();
  const { addDocument } = useData();
  const { t, language } = useLanguage();
  const [images, setImages] = useState<string[]>([]);
  
  // Form state
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [docType, setDocType] = useState('');
  const [priority, setPriority] = useState(5);
  const [notes, setNotes] = useState('');
  const [viewingTag, setViewingTag] = useState('');
  
  // Submit form with null checks
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!images || images.length === 0) {
      toast({
        title: t('noImages'),
        description: t('captureImageFirst'),
        variant: "destructive"
      });
      return;
    }
    
    // Create document object with safe defaults
    const newDocument: DocumentData = {
      name: name || 'Untitled',
      date: date || new Date().toISOString().split('T')[0],
      type: docType || 'Other',
      priority: Number(priority) || 5,
      notes: notes || '',
      viewingTag: viewingTag || undefined,
      images: images || []
    };
    
    // Add document
    if (addDocument) {
      addDocument(newDocument);
      
      toast({
        title: t('documentAdded'),
        description: name || 'Untitled'
      });
    }
    
    // Navigate to documents page
    navigate('/documents');
  };
  
  // Ensure we have a valid language value for direction
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto animate-fade-in" dir={dir}>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gradient">{t('scanDocument')}</h1>
          <p className="text-docvault-gray text-sm">
            {t('captureDocument')}
          </p>
        </header>
        
        <form onSubmit={handleSubmit}>
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Camera className="mr-2 text-docvault-accent" size={20} />
                {t('cameraCapture')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CameraCapture images={images || []} setImages={setImages} />
            </CardContent>
          </Card>
          
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{t('documentInfo')}</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentForm 
                name={name}
                setName={setName}
                date={date}
                setDate={setDate}
                docType={docType}
                setDocType={setDocType}
                priority={priority}
                setPriority={setPriority}
                notes={notes}
                setNotes={setNotes}
                viewingTag={viewingTag}
                setViewingTag={setViewingTag}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                className="border-docvault-accent/30"
                onClick={() => navigate('/documents')}
              >
                {t('cancel')}
              </Button>
              <Button 
                type="submit" 
                className="bg-docvault-accent hover:bg-docvault-accent/80"
              >
                {t('saveDocument')}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Layout>
  );
};

export default ScanDocument;
