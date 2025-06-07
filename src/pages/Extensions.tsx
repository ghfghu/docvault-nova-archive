
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Puzzle, 
  Search, 
  Download, 
  Star, 
  Settings,
  ExternalLink,
  Shield,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Layout from '@/components/Layout';

const Extensions = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [installedExtensions, setInstalledExtensions] = useState<string[]>(['ocr-enhanced', 'smart-classification']);
  
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const extensions = [
    {
      id: 'ocr-enhanced',
      name: 'Enhanced OCR',
      description: 'Advanced text extraction with multi-language support',
      version: '2.1.0',
      rating: 4.8,
      downloads: 15420,
      category: 'OCR',
      verified: true
    },
    {
      id: 'smart-classification',
      name: 'Smart Document Classification',
      description: 'AI-powered automatic document type detection',
      version: '1.5.2',
      rating: 4.6,
      downloads: 8930,
      category: 'AI',
      verified: true
    },
    {
      id: 'barcode-scanner',
      name: 'Barcode & QR Scanner',
      description: 'Scan and decode barcodes and QR codes',
      version: '1.2.1',
      rating: 4.4,
      downloads: 12650,
      category: 'Scanner',
      verified: false
    },
    {
      id: 'face-detect',
      name: 'Face Detection Pro',
      description: 'Advanced face detection and recognition',
      version: '3.0.1',
      rating: 4.9,
      downloads: 22100,
      category: 'AI',
      verified: true
    },
    {
      id: 'batch-processor',
      name: 'Batch Document Processor',
      description: 'Process multiple documents simultaneously',
      version: '1.8.0',
      rating: 4.3,
      downloads: 6540,
      category: 'Productivity',
      verified: false
    }
  ];

  const filteredExtensions = extensions.filter(ext =>
    ext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ext.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ext.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExtension = (extensionId: string) => {
    setInstalledExtensions(prev => 
      prev.includes(extensionId)
        ? prev.filter(id => id !== extensionId)
        : [...prev, extensionId]
    );
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto animate-fade-in" dir={dir}>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gradient flex items-center">
            <Puzzle className="mr-2 text-docvault-accent" size={24} />
            {t('extensions')}
          </h1>
          <p className="text-docvault-gray text-sm">
            {t('extendFunctionality')}
          </p>
        </header>

        {/* Search */}
        <Card className="glass-card mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-docvault-gray" size={18} />
              <Input
                placeholder={t('searchExtensions')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-docvault-dark/50 border-docvault-accent/30"
              />
            </div>
          </CardContent>
        </Card>

        {/* Extensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExtensions.map((extension) => {
            const isInstalled = installedExtensions.includes(extension.id);
            
            return (
              <Card key={extension.id} className="glass-card hover:border-docvault-accent/50 transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center">
                      {extension.name}
                      {extension.verified && (
                        <Shield className="ml-2 text-docvault-accent" size={16} />
                      )}
                    </CardTitle>
                    <Switch
                      checked={isInstalled}
                      onCheckedChange={() => toggleExtension(extension.id)}
                    />
                  </div>
                  <p className="text-sm text-docvault-gray">
                    {extension.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{extension.category}</Badge>
                    <span className="text-sm text-docvault-gray">v{extension.version}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-docvault-gray">
                    <div className="flex items-center">
                      <Star className="mr-1 text-yellow-400" size={14} />
                      {extension.rating}
                    </div>
                    <div className="flex items-center">
                      <Download className="mr-1" size={14} />
                      {extension.downloads.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {isInstalled ? (
                      <>
                        <Button size="sm" variant="outline" className="flex-1 border-docvault-accent/30">
                          <Settings className="mr-2" size={14} />
                          {t('configure')}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => toggleExtension(extension.id)}
                        >
                          {t('uninstall')}
                        </Button>
                      </>
                    ) : (
                      <Button 
                        size="sm" 
                        className="flex-1 bg-docvault-accent hover:bg-docvault-accent/80"
                        onClick={() => toggleExtension(extension.id)}
                      >
                        <Download className="mr-2" size={14} />
                        {t('install')}
                      </Button>
                    )}
                    
                    <Button size="sm" variant="ghost">
                      <ExternalLink size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {filteredExtensions.length === 0 && (
          <Card className="glass-card p-8 text-center">
            <div className="flex flex-col items-center">
              <Puzzle size={48} className="text-docvault-accent/50 mb-4" />
              <h3 className="text-xl font-bold text-gradient mb-2">{t('noExtensionsFound')}</h3>
              <p className="text-docvault-gray mb-4">
                {t('tryDifferentSearch')}
              </p>
              <Button 
                variant="outline" 
                className="border-docvault-accent/30"
                onClick={() => setSearchTerm('')}
              >
                {t('clearSearch')}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Extensions;
