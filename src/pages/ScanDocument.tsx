
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Layout from '@/components/Layout';
import SimpleCamera from '@/components/camera/SimpleCamera';
import DocumentForm from '@/components/document/DocumentForm';
import { useDocumentForm } from '@/hooks/useDocumentForm';

const ScanDocument = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { formData, images, setImages, updateField, submitDocument } = useDocumentForm();
  
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
        
        <form onSubmit={submitDocument}>
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Camera className="mr-2 text-docvault-accent" size={20} />
                {t('cameraCapture')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCamera images={images || []} setImages={setImages} />
            </CardContent>
          </Card>
          
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{t('documentInfo')}</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentForm 
                formData={formData}
                onFieldChange={updateField}
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
