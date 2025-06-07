
import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={20} />;
      case 'dark':
        return <Moon size={20} />;
      default:
        return <Monitor size={20} />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          {getThemeIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-docvault-dark border-docvault-accent/30">
        <DropdownMenuItem 
          onClick={() => setTheme('auto')}
          className={`cursor-pointer ${theme === 'auto' ? 'bg-docvault-accent/20 text-docvault-accent' : 'text-docvault-light hover:bg-docvault-accent/10'}`}
        >
          <Monitor className="mr-2" size={16} />
          {t('auto')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className={`cursor-pointer ${theme === 'light' ? 'bg-docvault-accent/20 text-docvault-accent' : 'text-docvault-light hover:bg-docvault-accent/10'}`}
        >
          <Sun className="mr-2" size={16} />
          {t('light')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className={`cursor-pointer ${theme === 'dark' ? 'bg-docvault-accent/20 text-docvault-accent' : 'text-docvault-light hover:bg-docvault-accent/10'}`}
        >
          <Moon className="mr-2" size={16} />
          {t('dark')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
