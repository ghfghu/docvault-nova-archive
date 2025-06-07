
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus, RotateCcw, TrendingUp, Target, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Layout from '@/components/Layout';

const Counter = () => {
  const { t, language } = useLanguage();
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState<number[]>([0]);
  
  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    setHistory(prev => [...prev, newCount]);
  };
  
  const decrement = () => {
    const newCount = count - 1;
    setCount(newCount);
    setHistory(prev => [...prev, newCount]);
  };
  
  const reset = () => {
    setCount(0);
    setHistory([0]);
  };
  
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const maxValue = Math.max(...history);
  const minValue = Math.min(...history);
  const totalChanges = history.length - 1;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fade-in" dir={dir}>
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            {t('counter')}
          </h1>
          <p className="text-docvault-gray">Smart counting with analytics</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Counter */}
          <div className="lg:col-span-2">
            <Card className="glass-card h-full">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-docvault-accent flex items-center justify-center">
                  <Target className="mr-2" size={24} />
                  {t('currentCount')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Counter Display */}
                <div className="text-center">
                  <div className="relative">
                    <div className="text-9xl font-bold text-docvault-accent mb-4 relative z-10">
                      {count}
                    </div>
                    <div className="absolute inset-0 text-9xl font-bold text-docvault-accent/10 blur-lg">
                      {count}
                    </div>
                  </div>
                  <div className="h-2 bg-docvault-dark rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-docvault-accent/50 to-docvault-accent transition-all duration-300"
                      style={{ width: `${Math.min(Math.abs(count) * 2, 100)}%` }}
                    />
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={decrement}
                    size="lg"
                    variant="outline"
                    className="border-docvault-accent/30 hover:bg-docvault-accent/10 w-16 h-16 rounded-full"
                  >
                    <Minus size={32} />
                  </Button>
                  
                  <Button
                    onClick={reset}
                    size="lg"
                    variant="outline"
                    className="border-docvault-accent/30 hover:bg-docvault-accent/10 w-16 h-16 rounded-full"
                  >
                    <RotateCcw size={24} />
                  </Button>
                  
                  <Button
                    onClick={increment}
                    size="lg"
                    className="bg-docvault-accent hover:bg-docvault-accent/80 w-16 h-16 rounded-full"
                  >
                    <Plus size={32} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="glass-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="mr-2 text-docvault-accent" size={20} />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded bg-docvault-dark/50">
                  <span className="text-docvault-gray">Current</span>
                  <span className="text-xl font-bold text-docvault-accent">
                    {count > 0 ? '+' : ''}{count}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded bg-docvault-dark/50">
                  <span className="text-docvault-gray">Absolute</span>
                  <span className="text-xl font-bold text-docvault-accent">
                    {Math.abs(count)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded bg-docvault-dark/50">
                  <span className="text-docvault-gray">Max Value</span>
                  <span className="text-lg font-semibold text-green-400">
                    {maxValue}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded bg-docvault-dark/50">
                  <span className="text-docvault-gray">Min Value</span>
                  <span className="text-lg font-semibold text-red-400">
                    {minValue}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Activity */}
            <Card className="glass-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Zap className="mr-2 text-docvault-accent" size={20} />
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-docvault-gray">Total Changes</span>
                    <span className="font-semibold">{totalChanges}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-docvault-gray">Range</span>
                    <span className="font-semibold">{maxValue - minValue}</span>
                  </div>
                  
                  {history.length > 1 && (
                    <div className="mt-4">
                      <span className="text-sm text-docvault-gray">Recent History</span>
                      <div className="mt-2 flex gap-1 overflow-x-auto">
                        {history.slice(-10).map((value, index) => (
                          <div
                            key={index}
                            className="min-w-[32px] h-8 bg-docvault-accent/20 rounded flex items-center justify-center text-xs"
                          >
                            {value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Counter;
