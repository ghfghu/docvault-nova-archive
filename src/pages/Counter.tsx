
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Layout from '@/components/Layout';

const Counter = () => {
  const { t, language } = useLanguage();
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);
  
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <Layout>
      <div className="max-w-md mx-auto animate-fade-in" dir={dir}>
        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-gradient">
              {t('counter')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Counter Display */}
            <div className="text-center">
              <div className="text-8xl font-bold text-docvault-accent mb-4">
                {count}
              </div>
              <p className="text-docvault-gray">{t('currentCount')}</p>
            </div>
            
            {/* Counter Controls */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={decrement}
                size="lg"
                variant="outline"
                className="border-docvault-accent/30 hover:bg-docvault-accent/10"
              >
                <Minus size={24} />
              </Button>
              
              <Button
                onClick={reset}
                size="lg"
                variant="outline"
                className="border-docvault-accent/30 hover:bg-docvault-accent/10"
              >
                <RotateCcw size={20} />
              </Button>
              
              <Button
                onClick={increment}
                size="lg"
                className="bg-docvault-accent hover:bg-docvault-accent/80"
              >
                <Plus size={24} />
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-docvault-accent/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-docvault-accent">
                  {count > 0 ? '+' : ''}{count}
                </div>
                <p className="text-sm text-docvault-gray">{t('total')}</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-docvault-accent">
                  {Math.abs(count)}
                </div>
                <p className="text-sm text-docvault-gray">{t('absolute')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Counter;
