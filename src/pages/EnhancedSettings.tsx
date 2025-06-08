
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Download, 
  Upload, 
  Trash2, 
  Database,
  Globe,
  Moon,
  Sun,
  Brain,
  Zap,
  Smartphone,
  HardDrive,
  Languages,
  Cpu,
  Shield
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';

const EnhancedSettings = () => {
  const { 
    documents, 
    wantedPersons, 
    settings, 
    isLoading,
    clearAllData, 
    loadSampleData, 
    loadLargeDataset,
    exportData, 
    importData, 
    updateSettings 
  } = useData();
  
  const { language, setLanguage, t } = useLanguage();
  const [importText, setImportText] = useState('');
  const [deepSecEnabled, setDeepSecEnabled] = useState(true);
  const [aiModels, setAiModels] = useState({
    ocr: 'DeepSec-OCR-v2',
    classification: 'DeepSec-Classify-v1',
    faceRecognition: 'DeepSec-Face-v3'
  });

  const handleLanguageChange = (newLanguage: 'en' | 'ar') => {
    setLanguage(newLanguage);
    toast({
      title: t('settings'),
      description: newLanguage === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English'
    });
  };

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `docvault-enhanced-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: t('dataExportedSuccessfully'),
        description: language === 'ar' ? 'تم تصدير البيانات بنجاح' : 'Data exported successfully'
      });
    } catch (error) {
      toast({
        title: t('export'),
        description: language === 'ar' ? 'فشل في تصدير البيانات' : 'Failed to export data',
        variant: "destructive"
      });
    }
  };

  const handleImport = async () => {
    if (!importText.trim()) {
      toast({
        title: t('import'),
        description: language === 'ar' ? 'يرجى لصق بيانات النسخ الاحتياطي' : 'Please paste your backup data',
        variant: "destructive"
      });
      return;
    }

    const success = await importData(importText);
    if (success) {
      toast({
        title: t('dataImportedSuccessfully'),
        description: language === 'ar' ? 'تم استيراد البيانات بنجاح' : 'Data imported successfully'
      });
      setImportText('');
    } else {
      toast({
        title: t('import'),
        description: t('invalidJsonFormat'),
        variant: "destructive"
      });
    }
  };

  const handleClearData = () => {
    const confirmMessage = language === 'ar' 
      ? 'هل أنت متأكد أنك تريد حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.'
      : 'Are you sure you want to delete all data? This action cannot be undone.';
    
    if (confirm(confirmMessage)) {
      clearAllData();
      toast({
        title: t('allDataClearedSuccessfully'),
        description: language === 'ar' ? 'تم حذف جميع البيانات' : 'All data has been deleted'
      });
    }
  };

  const handleLoadSampleData = () => {
    if (documents.length > 0 || wantedPersons.length > 0) {
      const confirmMessage = language === 'ar'
        ? 'سيؤدي هذا إلى استبدال بياناتك الحالية. هل تريد المتابعة؟'
        : 'This will replace your current data. Continue?';
      if (!confirm(confirmMessage)) return;
    }
    
    loadSampleData();
    toast({
      title: t('sampleDataLoadedSuccessfully'),
      description: language === 'ar' ? 'تم تحميل 50 مستند و 25 شخص مطلوب' : '50 sample documents and 25 wanted persons added'
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <SettingsIcon className="mx-auto mb-4 text-docvault-accent animate-pulse" size={48} />
            <p className="text-docvault-gray">{t('settings')}...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fade-in" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gradient flex items-center">
            <SettingsIcon className="mr-2 text-docvault-accent" size={24} />
            {t('settings')}
          </h1>
          <p className="text-docvault-gray text-sm">
            {language === 'ar' 
              ? 'إدارة تفضيلات التطبيق والبيانات المحلية والذكاء الاصطناعي'
              : 'Manage your app preferences, local data, and AI features'
            }
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Language & Appearance */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Languages className="mr-2" size={20} />
                {language === 'ar' ? 'اللغة والمظهر' : 'Language & Appearance'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'تخصيص تجربة التطبيق'
                  : 'Customize your app experience'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">
                  <Globe className="inline mr-2" size={16} />
                  {t('language')}
                </Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="bg-docvault-dark/50 border-docvault-accent/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="bg-docvault-accent/20" />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex items-center">
                  {settings.darkMode ? <Moon className="mr-2" size={16} /> : <Sun className="mr-2" size={16} />}
                  {t('darkMode')}
                </Label>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="onboarding">{t('showOnboarding')}</Label>
                <Switch
                  id="onboarding"
                  checked={settings.showOnboarding}
                  onCheckedChange={(checked) => updateSettings({ showOnboarding: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Advanced AI Configuration */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Brain className="mr-2" size={20} />
                  {language === 'ar' ? 'الذكاء الاصطناعي المتقدم' : 'Advanced AI'}
                </div>
                <Badge className="bg-docvault-accent">
                  <Zap className="mr-1" size={12} />
                  DeepSec
                </Badge>
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'إدارة نماذج الذكاء الاصطناعي والميزات المتقدمة'
                  : 'Manage AI models and advanced features'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="deepsec-enabled" className="flex items-center">
                  <Shield className="mr-2" size={16} />
                  {language === 'ar' ? 'تمكين DeepSec' : 'Enable DeepSec'}
                </Label>
                <Switch
                  id="deepsec-enabled"
                  checked={deepSecEnabled}
                  onCheckedChange={setDeepSecEnabled}
                />
              </div>
              
              <Separator className="bg-docvault-accent/20" />
              
              <div className="space-y-3">
                <Label>{language === 'ar' ? 'نماذج الذكاء الاصطناعي' : 'AI Models'}</Label>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>{language === 'ar' ? 'التعرف الضوئي' : 'OCR Model'}</span>
                    <Badge variant="outline">{aiModels.ocr}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span>{language === 'ar' ? 'التصنيف' : 'Classification'}</span>
                    <Badge variant="outline">{aiModels.classification}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span>{language === 'ar' ? 'التعرف على الوجوه' : 'Face Recognition'}</span>
                    <Badge variant="outline">{aiModels.faceRecognition}</Badge>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-docvault-accent hover:bg-docvault-accent/80"
              >
                <Cpu className="mr-2" size={16} />
                {language === 'ar' ? 'إدارة النماذج' : 'Manage Models'}
              </Button>
            </CardContent>
          </Card>

          {/* Local Data Management */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2" size={20} />
                {language === 'ar' ? 'إدارة البيانات المحلية' : 'Local Data Management'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'إدارة قاعدة البيانات المحلية'
                  : 'Manage your offline database'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-docvault-gray mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-docvault-dark/30 p-3 rounded">
                    <p className="font-medium">{t('documents')}</p>
                    <p className="text-lg text-docvault-accent">{documents.length}</p>
                  </div>
                  <div className="bg-docvault-dark/30 p-3 rounded">
                    <p className="font-medium">{t('wantedPersons')}</p>
                    <p className="text-lg text-docvault-accent">{wantedPersons.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleLoadSampleData}
                  className="w-full bg-docvault-accent hover:bg-docvault-accent/80"
                >
                  <Database className="mr-2" size={16} />
                  {t('loadSampleData')}
                </Button>
                
                <Button 
                  onClick={handleClearData}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="mr-2" size={16} />
                  {t('clearAllData')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HardDrive className="mr-2" size={20} />
                {language === 'ar' ? 'حالة النظام' : 'System Status'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'مراقبة النظام المحلي'
                  : 'Monitor your offline system'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{language === 'ar' ? 'الوضع المحلي' : 'Offline Mode'}</span>
                  <span className="text-green-400 text-sm font-medium">
                    {language === 'ar' ? 'نشط' : 'Active'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">{language === 'ar' ? 'قاعدة البيانات' : 'Local Database'}</span>
                  <span className="text-green-400 text-sm font-medium">
                    {language === 'ar' ? 'متصل' : 'Connected'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">{language === 'ar' ? 'خدمات الذكاء الاصطناعي' : 'AI Services'}</span>
                  <span className="text-green-400 text-sm font-medium">
                    {language === 'ar' ? 'جاهز' : 'Ready'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">{language === 'ar' ? 'الوصول للكاميرا' : 'Camera Access'}</span>
                  <span className="text-green-400 text-sm font-medium">
                    {language === 'ar' ? 'متاح' : 'Available'}
                  </span>
                </div>
              </div>
              
              <Separator className="bg-docvault-accent/20" />
              
              <div className="text-xs text-docvault-gray">
                <p>
                  {language === 'ar' 
                    ? 'جميع البيانات محفوظة محلياً على جهازك. لا حاجة لاتصال الإنترنت للعمل.'
                    : 'All data is stored locally on your device. No internet connection required for operation.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Backup & Restore */}
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="mr-2" size={20} />
              {language === 'ar' ? 'النسخ الاحتياطي والاستعادة' : 'Backup & Restore'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? 'تصدير البيانات أو الاستيراد من ملف احتياطي'
                : 'Export your data or import from a backup file'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleExport}
                className="flex-1 bg-docvault-accent hover:bg-docvault-accent/80"
              >
                <Download className="mr-2" size={16} />
                {language === 'ar' ? 'تصدير البيانات' : 'Export Data'}
              </Button>
              
              <Button 
                onClick={handleImport}
                variant="outline"
                className="flex-1 border-docvault-accent/30"
                disabled={!importText.trim()}
              >
                <Upload className="mr-2" size={16} />
                {language === 'ar' ? 'استيراد البيانات' : 'Import Data'}
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="import-data">
                {language === 'ar' ? 'استيراد البيانات الاحتياطية' : 'Import Backup Data'}
              </Label>
              <Textarea
                id="import-data"
                placeholder={language === 'ar' 
                  ? 'الصق بيانات النسخ الاحتياطي هنا...'
                  : 'Paste your exported backup data here...'
                }
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="bg-docvault-dark/50 border-docvault-accent/30 h-32"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EnhancedSettings;
