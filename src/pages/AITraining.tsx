
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import Layout from '@/components/Layout';
import AIChat from '@/components/ai/AIChat';
import { 
  Brain, 
  Upload, 
  Play, 
  Pause, 
  Square, 
  Download,
  MessageSquare,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

const AITraining = () => {
  const { t, language } = useLanguage();
  const [selectedModel, setSelectedModel] = useState('document-classifier');
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'training' | 'paused' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [showChat, setShowChat] = useState(true);

  const models = [
    {
      id: 'document-classifier',
      name: 'Document Classifier',
      description: 'Automatically classify document types',
      accuracy: 94.2,
      status: 'trained'
    },
    {
      id: 'text-extractor',
      name: 'Text Extractor (OCR)',
      description: 'Extract text from document images',
      accuracy: 97.8,
      status: 'training'
    },
    {
      id: 'face-detector',
      name: 'Face Detection',
      description: 'Detect and identify faces in documents',
      accuracy: 91.5,
      status: 'idle'
    }
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
        return prev + Math.random() * 5;
      });
    }, 500);
  };

  const pauseTraining = () => {
    setTrainingStatus('paused');
  };

  const stopTraining = () => {
    setTrainingStatus('idle');
    setProgress(0);
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <Layout>
      <div className="max-w-6xl mx-auto animate-fade-in" dir={dir}>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">{t('aiTraining')}</h1>
          <p className="text-docvault-gray">{t('trainCustomModels')}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Training Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Model Selection */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 text-docvault-accent" size={24} />
                  {t('modelSelection')}
                </CardTitle>
                <CardDescription>{t('selectModel')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {models.map((model) => (
                    <div
                      key={model.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedModel === model.id
                          ? 'border-docvault-accent bg-docvault-accent/10'
                          : 'border-docvault-accent/20 hover:border-docvault-accent/40'
                      }`}
                      onClick={() => setSelectedModel(model.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{model.name}</h3>
                        <Badge variant={
                          model.status === 'trained' ? 'default' : 
                          model.status === 'training' ? 'secondary' : 'outline'
                        }>
                          {model.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-docvault-gray mb-2">{model.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Target size={14} />
                          Accuracy: {model.accuracy}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Training Controls */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>{t('trainingProgress')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('progress')}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-docvault-gray">
                    <span>{t('status')}: {t(trainingStatus)}</span>
                    <span>ETA: {trainingStatus === 'training' ? '~5 min' : '--'}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  {trainingStatus === 'idle' && (
                    <Button onClick={startTraining} className="bg-docvault-accent hover:bg-docvault-accent/80">
                      <Play className="mr-2" size={16} />
                      {t('startTraining')}
                    </Button>
                  )}
                  
                  {trainingStatus === 'training' && (
                    <>
                      <Button onClick={pauseTraining} variant="outline">
                        <Pause className="mr-2" size={16} />
                        {t('pause')}
                      </Button>
                      <Button onClick={stopTraining} variant="destructive">
                        <Square className="mr-2" size={16} />
                        {t('stop')}
                      </Button>
                    </>
                  )}
                  
                  {trainingStatus === 'paused' && (
                    <>
                      <Button onClick={startTraining} className="bg-docvault-accent hover:bg-docvault-accent/80">
                        <Play className="mr-2" size={16} />
                        Resume
                      </Button>
                      <Button onClick={stopTraining} variant="destructive">
                        <Square className="mr-2" size={16} />
                        {t('stop')}
                      </Button>
                    </>
                  )}
                  
                  {trainingStatus === 'completed' && (
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Download className="mr-2" size={16} />
                      {t('downloadModel')}
                    </Button>
                  )}
                </div>

                {/* Training Data Upload */}
                <div className="border-t border-docvault-accent/20 pt-4">
                  <h4 className="font-medium mb-4">{t('trainingData')}</h4>
                  <div className="border-2 border-dashed border-docvault-accent/30 rounded-lg p-6 text-center">
                    <Upload className="mx-auto mb-2 text-docvault-accent" size={24} />
                    <p className="text-sm text-docvault-gray mb-2">{t('uploadTrainingData')}</p>
                    <Button variant="outline" size="sm">
                      Select Files
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Chat Sidebar */}
          <div className="space-y-6">
            {/* Chat Toggle */}
            <Card className="glass-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MessageSquare className="mr-2 text-docvault-accent" size={20} />
                    AI Assistant
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChat(!showChat)}
                  >
                    {showChat ? 'Hide' : 'Show'}
                  </Button>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* AI Chat */}
            {showChat && (
              <AIChat 
                context="AI Training"
                suggestions={[
                  "How to improve model accuracy?",
                  "What training data do I need?",
                  "How long does training take?"
                ]}
              />
            )}

            {/* Model Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 text-docvault-accent" size={20} />
                  Model Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-docvault-gray">Accuracy</span>
                    <span className="font-semibold">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-docvault-gray">Precision</span>
                    <span className="font-semibold">92.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-docvault-gray">Recall</span>
                    <span className="font-semibold">95.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AITraining;
