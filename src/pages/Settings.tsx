
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
  AlertTriangle,
  Brain,
  Smartphone,
  HardDrive
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';

const Settings = () => {
  const navigate = useNavigate();
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
  
  const [importText, setImportText] = useState('');

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `docvault-offline-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Your offline data has been exported successfully"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive"
      });
    }
  };

  const handleImport = async () => {
    if (!importText.trim()) {
      toast({
        title: "Import Error",
        description: "Please paste your backup data",
        variant: "destructive"
      });
      return;
    }

    const success = await importData(importText);
    if (success) {
      toast({
        title: "Data Imported",
        description: "Your offline data has been imported successfully"
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
        description: "All offline data has been deleted"
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

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <SettingsIcon className="mx-auto mb-4 text-docvault-accent animate-pulse" size={48} />
            <p className="text-docvault-gray">Loading Settings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gradient flex items-center">
            <SettingsIcon className="mr-2 text-docvault-accent" size={24} />
            Settings
          </h1>
          <p className="text-docvault-gray text-sm">
            Manage your offline application preferences and data
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
              <CardDescription>Customize your offline app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => updateSettings({ language: value as 'en' | 'ar' })}
                >
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
                <Label htmlFor="auto-save">Auto Save</Label>
                <Switch
                  id="auto-save"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => updateSettings({ autoSave: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="backup">Backup Enabled</Label>
                <Switch
                  id="backup"
                  checked={settings.backupEnabled}
                  onCheckedChange={(checked) => updateSettings({ backupEnabled: checked })}
                />
              </div>
            </CardContent>
          </Card>


          {/* Data Management */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2" size={20} />
                Local Data Management
              </CardTitle>
              <CardDescription>
                Manage your offline database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-docvault-gray mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-docvault-dark/30 p-3 rounded">
                    <p className="font-medium">Documents</p>
                    <p className="text-lg text-docvault-accent">{documents.length}</p>
                  </div>
                  <div className="bg-docvault-dark/30 p-3 rounded">
                    <p className="font-medium">Wanted Persons</p>
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

          {/* System Status */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HardDrive className="mr-2" size={20} />
                System Status
              </CardTitle>
              <CardDescription>
                Monitor your offline system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Offline Mode</span>
                  <span className="text-green-400 text-sm font-medium">Active</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Local Database</span>
                  <span className="text-green-400 text-sm font-medium">Connected</span>
                </div>
                
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Camera Access</span>
                  <span className="text-green-400 text-sm font-medium">Available</span>
                </div>
              </div>
              
              <Separator className="bg-docvault-accent/20" />
              
              <div className="text-xs text-docvault-gray">
                <p>All data is stored locally on your device.</p>
                <p>No internet connection required for operation.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Backup & Restore */}
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="mr-2" size={20} />
              Offline Backup & Restore
            </CardTitle>
            <CardDescription>
              Export your data or import from a backup file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleExport}
                className="flex-1 bg-docvault-accent hover:bg-docvault-accent/80"
              >
                <Download className="mr-2" size={16} />
                Export Offline Data
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

        {/* Info Section */}
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2" size={20} />
              About DocVault Offline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-docvault-accent mb-1">Version</h4>
                <p className="text-docvault-gray">1.0.0 Offline</p>
              </div>
              <div>
                <h4 className="font-medium text-docvault-accent mb-1">Build</h4>
                <p className="text-docvault-gray">Mobile + AI Ready</p>
              </div>
              <div>
                <h4 className="font-medium text-docvault-accent mb-1">Storage</h4>
                <p className="text-docvault-gray">SQLite Database</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
