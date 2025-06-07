
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Play, 
  Pause, 
  Square, 
  Download, 
  Upload,
  Settings,
  TrendingUp,
  Database,
  Camera
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Layout from '@/components/Layout';

const AITraining = () => {
  const { t, language } = useLanguage();
  const [selectedModel, setSelectedModel] = useState('');
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'training' | 'paused' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const modelOptions = [
    { id: 'document-classifier', name: 'Document Classification', description: 'Classify document types automatically' },
    { id: 'text-extractor', name: 'Text Extraction (OCR)', description: 'Extract text from images' },
    { id: 'face-recognition', name: 'Face Recognition', description: 'Identify faces in images' },
    { id: 'custom-pattern', name: 'Custom Pattern Detection', description: 'Detect custom patterns in documents' }
  ];

  const startTraining = () => {
    setTrainingStatus('training');
    // Simulate training progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTrainingStatus('completed');
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const pauseTraining = () => {
    setTrainingStatus('paused');
  };

  const stopTraining = () => {
    setTrainingStatus('idle');
    setProgress(0);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fade-in" dir={dir}>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gradient flex items-center">
            <Brain className="mr-2 text-docvault-accent" size={24} />
            {t('aiTraining')}
          </h1>
          <p className="text-docvault-gray text-sm">
            {t('trainCustomModels')}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model Selection */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2" size={20} />
                {t('modelSelection')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="bg-docvault-dark/50 border-docvault-accent/30">
                  <SelectValue placeholder={t('selectModel')} />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedModel && (
                <div className="p-3 bg-docvault-dark/30 rounded">
                  <h4 className="font-medium text-docvault-accent mb-1">
                    {modelOptions.find(m => m.id === selectedModel)?.name}
                  </h4>
                  <p className="text-sm text-docvault-gray">
                    {modelOptions.find(m => m.id === selectedModel)?.description}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={startTraining}
                  disabled={!selectedModel || trainingStatus === 'training'}
                  className="bg-docvault-accent hover:bg-docvault-accent/80"
                >
                  <Play className="mr-2" size={16} />
                  {t('startTraining')}
                </Button>
                
                {trainingStatus === 'training' && (
                  <Button onClick={pauseTraining} variant="outline">
                    <Pause className="mr-2" size={16} />
                    {t('pause')}
                  </Button>
                )}
                
                {(trainingStatus === 'training' || trainingStatus === 'paused') && (
                  <Button onClick={stopTraining} variant="destructive">
                    <Square className="mr-2" size={16} />
                    {t('stop')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Training Progress */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2" size={20} />
                {t('trainingProgress')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('progress')}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">{t('status')}</span>
                <Badge variant={trainingStatus === 'completed' ? 'default' : 'secondary'}>
                  {t(trainingStatus)}
                </Badge>
              </div>

              {trainingStatus === 'completed' && (
                <div className="space-y-2">
                  <Button className="w-full bg-docvault-accent hover:bg-docvault-accent/80">
                    <Download className="mr-2" size={16} />
                    {t('downloadModel')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Training Data */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2" size={20} />
                {t('trainingData')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-docvault-dark/30 p-3 rounded">
                  <p className="font-medium">{t('documents')}</p>
                  <p className="text-2xl text-docvault-accent">156</p>
                </div>
                <div className="bg-docvault-dark/30 p-3 rounded">
                  <p className="font-medium">{t('images')}</p>
                  <p className="text-2xl text-docvault-accent">423</p>
                </div>
              </div>

              <Button variant="outline" className="w-full border-docvault-accent/30">
                <Upload className="mr-2" size={16} />
                {t('uploadTrainingData')}
              </Button>
            </CardContent>
          </Card>

          {/* Model Results */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="mr-2" size={20} />
                {t('modelResults')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t('accuracy')}</span>
                  <span className="text-docvault-accent font-medium">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t('precision')}</span>
                  <span className="text-docvault-accent font-medium">91.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t('recall')}</span>
                  <span className="text-docvault-accent font-medium">89.5%</span>
                </div>
              </div>

              {trainingStatus === 'completed' && (
                <div className="text-sm text-green-400">
                  {t('trainingCompleted')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AITraining;
