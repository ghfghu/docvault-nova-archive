
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Play, 
  Pause, 
  Square, 
  Download, 
  Upload,
  BarChart3,
  Zap,
  Globe
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Layout from '@/components/Layout';
import AdvancedAIChat from '@/components/ai/AdvancedAIChat';

const AITraining = () => {
  const { t, language } = useLanguage();
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'training' | 'paused' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [selectedModel, setSelectedModel] = useState('DeepSec-OCR');

  const models = [
    { 
      id: 'DeepSec-OCR', 
      name: language === 'ar' ? 'التعرف الضوئي على النصوص' : 'OCR Recognition',
      accuracy: 94.5 
    },
    { 
      id: 'DeepSec-Classification', 
      name: language === 'ar' ? 'تصنيف المستندات' : 'Document Classification',
      accuracy: 92.8 
    },
    { 
      id: 'DeepSec-Face', 
      name: language === 'ar' ? 'التعرف على الوجوه' : 'Face Recognition',
      accuracy: 96.2 
    }
  ];

  const startTraining = () => {
    setTrainingStatus('training');
    // Simulate training progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setTrainingStatus('completed');
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 1000);
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
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gradient flex items-center">
            <Brain className="mr-2 text-docvault-accent" size={24} />
            {t('aiTraining')}
          </h1>
          <p className="text-docvault-gray text-sm">
            {language === 'ar' 
              ? 'تدريب نماذج ذكاء اصطناعي مخصصة للعمل دون اتصال بالإنترنت'
              : 'Train custom AI models for offline operation'
            }
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Training Interface */}
          <div className="space-y-6">
            {/* Model Selection */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2" size={20} />
                  {language === 'ar' ? 'اختيار النموذج' : 'Model Selection'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' 
                    ? 'اختر نموذج للتدريب'
                    : 'Select a model to train'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {models.map((model) => (
                  <div
                    key={model.id}
                    className={`p-3 rounded border cursor-pointer transition-colors ${
                      selectedModel === model.id
                        ? 'border-docvault-accent bg-docvault-accent/10'
                        : 'border-docvault-accent/30 hover:border-docvault-accent/50'
                    }`}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{model.name}</span>
                      <Badge variant="outline">
                        {model.accuracy}% {language === 'ar' ? 'دقة' : 'accuracy'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Training Controls */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'تقدم التدريب' : 'Training Progress'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{language === 'ar' ? 'التقدم' : 'Progress'}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span>{language === 'ar' ? 'الحالة' : 'Status'}</span>
                  <Badge 
                    variant={trainingStatus === 'training' ? 'default' : 'outline'}
                    className={trainingStatus === 'training' ? 'bg-docvault-accent' : ''}
                  >
                    {language === 'ar' ? (
                      trainingStatus === 'idle' ? 'خامل' :
                      trainingStatus === 'training' ? 'يتدرب' :
                      trainingStatus === 'paused' ? 'متوقف مؤقتاً' : 'مكتمل'
                    ) : (
                      trainingStatus === 'idle' ? 'Idle' :
                      trainingStatus === 'training' ? 'Training' :
                      trainingStatus === 'paused' ? 'Paused' : 'Completed'
                    )}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  {trainingStatus === 'idle' || trainingStatus === 'paused' ? (
                    <Button 
                      onClick={startTraining}
                      className="flex-1 bg-docvault-accent hover:bg-docvault-accent/80"
                    >
                      <Play className="mr-2" size={16} />
                      {trainingStatus === 'paused' ? 
                        (language === 'ar' ? 'استئناف' : 'Resume') : 
                        (language === 'ar' ? 'بدء التدريب' : 'Start Training')
                      }
                    </Button>
                  ) : trainingStatus === 'training' ? (
                    <Button 
                      onClick={pauseTraining}
                      variant="outline"
                      className="flex-1"
                    >
                      <Pause className="mr-2" size={16} />
                      {language === 'ar' ? 'إيقاف مؤقت' : 'Pause'}
                    </Button>
                  ) : null}
                  
                  {trainingStatus !== 'idle' && (
                    <Button 
                      onClick={stopTraining}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Square className="mr-2" size={16} />
                      {language === 'ar' ? 'إيقاف' : 'Stop'}
                    </Button>
                  )}
                </div>

                {trainingStatus === 'completed' && (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Download className="mr-2" size={16} />
                    {language === 'ar' ? 'تحميل النموذج' : 'Download Model'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Training Data */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2" size={20} />
                  {language === 'ar' ? 'بيانات التدريب' : 'Training Data'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-docvault-accent/30 rounded-lg p-6 text-center">
                  <Upload className="mx-auto mb-4 text-docvault-accent" size={32} />
                  <p className="text-sm text-docvault-gray mb-4">
                    {language === 'ar' 
                      ? 'اسحب وأفلت الملفات هنا أو انقر للاختيار'
                      : 'Drag and drop files here or click to select'
                    }
                  </p>
                  <Button variant="outline" className="border-docvault-accent/30">
                    {language === 'ar' ? 'اختيار الملفات' : 'Select Files'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Model Performance */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2" size={20} />
                  {language === 'ar' ? 'أداء النموذج' : 'Model Performance'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-docvault-accent">94.5%</p>
                    <p className="text-sm text-docvault-gray">
                      {language === 'ar' ? 'الدقة' : 'Accuracy'}
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-docvault-accent">92.1%</p>
                    <p className="text-sm text-docvault-gray">
                      {language === 'ar' ? 'الدقة' : 'Precision'}
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-docvault-accent">89.7%</p>
                    <p className="text-sm text-docvault-gray">
                      {language === 'ar' ? 'الاستدعاء' : 'Recall'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="mr-2" size={20} />
                    {language === 'ar' ? 'مساعد الذكاء الاصطناعي' : 'AI Assistant'}
                  </div>
                  <Badge className="bg-docvault-accent">
                    <Brain className="mr-1" size={12} />
                    DeepSec
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {language === 'ar' 
                    ? 'تفاعل مع المساعد الذكي متعدد اللغات'
                    : 'Interact with the multilingual AI assistant'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AdvancedAIChat enableDeepSec={true} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AITraining;
