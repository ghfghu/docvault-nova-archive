
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Languages, 
  Lightbulb, 
  HardDrive,
  Database,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import Layout from '@/components/Layout';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const { user, logout, appPassword, updateAppPassword } = useAuth();
  const { settings, updateSettings } = useData();
  
  const [newAppPassword, setNewAppPassword] = useState('');
  
  // Handle app password change
  const handleAppPasswordChange = () => {
    if (!newAppPassword) {
      toast({
        title: "Invalid password",
        description: "Please enter a new app password",
        variant: "destructive"
      });
      return;
    }
    
    updateAppPassword(newAppPassword);
    setNewAppPassword('');
  };
  
  // Clear all user data
  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      // In a real app, we would clear all data from storage
      toast({
        title: "Data cleared",
        description: "All your data has been deleted"
      });
    }
  };
  
  // Format storage usage (this is just a placeholder in the demo)
  const formatStorage = () => {
    // In a real app, we would calculate actual storage usage
    return {
      used: '2.3 MB',
      total: 'Unlimited',
      percent: 5
    };
  };
  
  const storage = formatStorage();
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gradient">Settings</h1>
          <p className="text-docvault-gray text-sm">
            Customize your DocVault experience
          </p>
        </header>
        
        <Tabs defaultValue="general">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SettingsIcon className="mr-2 text-docvault-accent" size={20} />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-docvault-gray">
                      Use dark theme for the application
                    </p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Languages className="mr-2 text-docvault-accent" size={20} />
                  Language & Region
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="language">Application Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value: 'en' | 'es' | 'fr') => updateSettings({ language: value })}
                  >
                    <SelectTrigger className="bg-docvault-dark/50 border-docvault-accent/30 mt-1">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 text-docvault-accent" size={20} />
                  User Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showOnboarding">Onboarding Instructions</Label>
                    <p className="text-sm text-docvault-gray">
                      Show instructions for new users
                    </p>
                  </div>
                  <Switch
                    id="showOnboarding"
                    checked={settings.showOnboarding}
                    onCheckedChange={(checked) => updateSettings({ showOnboarding: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableAutoFill">Auto-Fill Presets</Label>
                    <p className="text-sm text-docvault-gray">
                      Enable auto-fill in document forms
                    </p>
                  </div>
                  <Switch
                    id="enableAutoFill"
                    checked={settings.enableAutoFill}
                    onCheckedChange={(checked) => updateSettings({ enableAutoFill: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableAssistantTips">Assistant Tips</Label>
                    <p className="text-sm text-docvault-gray">
                      Show helpful tips while using the app
                    </p>
                  </div>
                  <Switch
                    id="enableAssistantTips"
                    checked={settings.enableAssistantTips}
                    onCheckedChange={(checked) => updateSettings({ enableAssistantTips: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 text-docvault-accent" size={20} />
                  App Password
                </CardTitle>
                <CardDescription>
                  Set an app-wide password that's required each time you open the app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current App Password</Label>
                  <Input
                    id="currentPassword"
                    type="text"
                    value={appPassword}
                    readOnly
                    className="bg-docvault-dark/50 border-docvault-accent/30 mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="newPassword">New App Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newAppPassword}
                    onChange={(e) => setNewAppPassword(e.target.value)}
                    placeholder="Enter new app password"
                    className="bg-docvault-dark/50 border-docvault-accent/30 mt-1"
                  />
                  <p className="text-xs text-docvault-gray mt-1">
                    This password will be required every time the app is opened
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="bg-docvault-accent hover:bg-docvault-accent/80"
                  onClick={handleAppPasswordChange}
                  disabled={!newAppPassword}
                >
                  Update App Password
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="storage">
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HardDrive className="mr-2 text-docvault-accent" size={20} />
                  Storage Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Used: {storage.used}</span>
                    <span>Total: {storage.total}</span>
                  </div>
                  <div className="w-full h-2 bg-docvault-dark rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-docvault-accent"
                      style={{ width: `${storage.percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-docvault-gray mt-1">
                    Using {storage.percent}% of available storage
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 text-docvault-accent" size={20} />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Clear All Data</Label>
                  <p className="text-sm text-docvault-gray mb-2">
                    This will permanently delete all your documents and data
                  </p>
                  <Button 
                    variant="destructive"
                    onClick={handleClearData}
                  >
                    Clear All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 text-docvault-accent" size={20} />
                  Your Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Username</Label>
                  <p className="font-medium text-lg text-docvault-accent">{user?.username}</p>
                </div>
                
                <div className="pt-4">
                  <Button 
                    variant="destructive"
                    className="w-full sm:w-auto"
                    onClick={logout}
                  >
                    <LogOut className="mr-2" size={18} />
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 text-center text-docvault-gray text-xs">
          <p>DocVault - Secure Document Archiving</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
