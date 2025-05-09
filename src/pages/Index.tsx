
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

const Index = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    const success = await login(username, password);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    const success = await register(username, password);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
            <LanguageSelector />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            {language === 'en' ? (
              <>Doc<span className="text-docvault-accent">Vault</span></>
            ) : (
              <>{t('appName')}</>
            )}
          </h1>
          <p className="text-docvault-gray text-sm">{t('tagline')}</p>
        </div>

        <Card className="glass-card">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-docvault-dark">
              <TabsTrigger value="login">{t('signIn')}</TabsTrigger>
              <TabsTrigger value="register">{t('createAccount')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>{t('welcomeBack')}</CardTitle>
                  <CardDescription>{t('enterCredentials')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder={t('username')}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-docvault-dark/50 border-docvault-accent/30"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder={t('password')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-docvault-dark/50 border-docvault-accent/30"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-docvault-accent hover:bg-docvault-accent/80"
                    disabled={loading}
                  >
                    {loading ? t('signingIn') : t('signIn')}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardHeader>
                  <CardTitle>{t('createAccount')}</CardTitle>
                  <CardDescription>{t('createNewAccount')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder={t('chooseUsername')}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-docvault-dark/50 border-docvault-accent/30"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder={t('createPassword')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-docvault-dark/50 border-docvault-accent/30"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-docvault-accent hover:bg-docvault-accent/80"
                    disabled={loading}
                  >
                    {loading ? t('creatingAccount') : t('createAccount')}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="mt-8 text-center text-docvault-gray text-xs">
          <p>{t('appInfo')}</p>
          <p className="mt-1">{t('dataStorage')}</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
