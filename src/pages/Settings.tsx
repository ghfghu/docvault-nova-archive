
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  Download, 
  Upload, 
  Trash2, 
  Database,
  Globe,
  Moon,
  Sun,
  Info,
  AlertTriangle
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';

const Settings = () => {
  const { 
    documents, 
    wantedPersons, 
    settings, 
    clearAllData, 
    loadSampleData, 
    loadLargeDataset,
    exportData, 
    importData, 
    updateSettings 
  } = useData();
  
  const [importText, setImportText] = useState('');

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `docvault-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Your data has been exported successfully"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive"
      });
    }
  };

  const handleImport = () => {
    if (!importText.trim()) {
      toast({
        title: "Import Error",
        description: "Please paste your backup data",
        variant: "destructive"
      });
      return;
    }

    const success = importData(importText);
    if (success) {
      toast({
        title: "Data Imported",
        description: "Your data has been imported successfully"
      });
      setImportText('');
    } else {
      toast({
        title: "Import Failed",
        description: "Invalid backup data format",
        variant: "destructive"
      });
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      clearAllData();
      toast({
        title: "Data Cleared",
        description: "All data has been deleted"
      });
    }
  };

  const handleLoadSampleData = () => {
    if (documents.length > 0 || wantedPersons.length > 0) {
      if (!confirm('This will replace your current data. Continue?')) {
        return;
      }
    }
    
    loadSampleData();
    toast({
      title: "Sample Data Loaded",
      description: "50 sample documents and 25 wanted persons added"
    });
  };

  const handleLoadLargeDataset = () => {
    if (documents.length > 0 || wantedPersons.length > 0) {
      if (!confirm('This will replace your current data with a large dataset for testing. This may impact performance. Continue?')) {
        return;
      }
    }
    
    loadLargeDataset();
    toast({
      title: "Large Dataset Loaded",
      description: "200 documents and 50 wanted persons added for stress testing"
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gradient flex items-center">
            <SettingsIcon className="mr-2 text-docvault-accent" size={24} />
            Settings
          </h1>
          <p className="text-docvault-gray text-sm">
            Manage your application preferences and data
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* App Preferences */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2" size={20} />
                App Preferences
              </CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex items-center">
                  {settings.darkMode ? <Moon className="mr-2" size={16} /> : <Sun className="mr-2" size={16} />}
                  Dark Mode
                </Label>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
                />
              </div>
              
              <Separator className="bg-docvault-accent/20" />
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => updateSettings({ language: value as any })}
                >
                  <SelectTrigger className="bg-docvault-dark/50 border-docvault-accent/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="bg-docvault-accent/20" />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="onboarding">Show Onboarding</Label>
                <Switch
                  id="onboarding"
                  checked={settings.showOnboarding}
                  onCheckedChange={(checked) => updateSettings({ showOnboarding: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="autofill">Enable Auto-fill</Label>
                <Switch
                  id="autofill"
                  checked={settings.enableAutoFill}
                  onCheckedChange={(checked) => updateSettings({ enableAutoFill: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="tips">Assistant Tips</Label>
                <Switch
                  id="tips"
                  checked={settings.enableAssistantTips}
                  onCheckedChange={(checked) => updateSettings({ enableAssistantTips: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2" size={20} />
                Data Management
              </CardTitle>
              <CardDescription>
                Manage your documents and database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-docvault-gray mb-4">
                <p>Documents: <span className="text-docvault-accent font-medium">{documents.length}</span></p>
                <p>Wanted Persons: <span className="text-docvault-accent font-medium">{wantedPersons.length}</span></p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleLoadSampleData}
                  className="w-full bg-docvault-accent hover:bg-docvault-accent/80"
                >
                  <Database className="mr-2" size={16} />
                  Load Sample Data (50 items)
                </Button>
                
                <Button 
                  onClick={handleLoadLargeDataset}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  <Database className="mr-2" size={16} />
                  Load Large Dataset (200 items)
                </Button>
                
                <div className="flex items-center text-xs text-yellow-400 mb-2">
                  <AlertTriangle className="mr-1" size={12} />
                  Large datasets may impact performance on mobile devices
                </div>
                
                <Button 
                  onClick={handleClearData}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="mr-2" size={16} />
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Backup & Restore */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="mr-2" size={20} />
                Backup & Restore
              </CardTitle>
              <CardDescription>
                Export your data or import from a backup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleExport}
                  className="flex-1 bg-docvault-accent hover:bg-docvault-accent/80"
                >
                  <Download className="mr-2" size={16} />
                  Export Data
                </Button>
                
                <Button 
                  onClick={handleImport}
                  variant="outline"
                  className="flex-1 border-docvault-accent/30"
                  disabled={!importText.trim()}
                >
                  <Upload className="mr-2" size={16} />
                  Import Data
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="import-data">Import Backup Data</Label>
                <Textarea
                  id="import-data"
                  placeholder="Paste your exported backup data here..."
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="bg-docvault-dark/50 border-docvault-accent/30 h-32"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2" size={20} />
              About DocVault
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-docvault-accent mb-1">Version</h4>
                <p className="text-docvault-gray">1.0.0</p>
              </div>
              <div>
                <h4 className="font-medium text-docvault-accent mb-1">Build</h4>
                <p className="text-docvault-gray">Mobile Optimized</p>
              </div>
              <div>
                <h4 className="font-medium text-docvault-accent mb-1">Storage</h4>
                <p className="text-docvault-gray">Local Device</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
