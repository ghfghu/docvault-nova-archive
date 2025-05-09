
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/LanguageSelector';
import { 
  Menu, 
  LayoutDashboard, 
  Camera, 
  Files, 
  Users, 
  BarChart3, 
  Settings,
  User,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: t('home'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('scan'), path: '/scan', icon: Camera },
    { name: t('documents'), path: '/documents', icon: Files },
    { name: t('wanted'), path: '/wanted', icon: Users },
    { name: t('reports'), path: '/reports', icon: BarChart3 },
    { name: t('settings'), path: '/settings', icon: Settings },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-docvault-dark/80 sticky top-0 z-50 backdrop-blur-lg border-b border-docvault-accent/10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-lg font-bold glow-effect">
              {language === 'en' ? (
                <>Doc<span className="text-docvault-accent">Vault</span></>
              ) : (
                <>{t('appName')}</>
              )}
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  className={`flex items-center space-x-1 ${
                    isActive(item.path) 
                      ? 'bg-docvault-accent/20 text-docvault-accent animate-pulse-glow'
                      : 'hover:bg-docvault-accent/10 hover:text-docvault-accent'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}
            <LanguageSelector />
          </div>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full p-2">
                <User size={20} className="text-docvault-accent" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-card w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-normal opacity-75">{t('signIn')}</span>
                  <span className="font-medium text-docvault-accent">{user?.username}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-docvault-accent/20" />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings size={16} className="mr-2" />
                  <span>{t('settings')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400">
                <LogOut size={16} className="mr-2" />
                <span>{t('signIn')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu />
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="mt-3 pb-2 pt-2 border-t border-docvault-accent/10 md:hidden animate-fade-in">
            <div className="grid grid-cols-3 gap-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                  <div 
                    className={`flex flex-col items-center p-2 rounded ${
                      isActive(item.path) 
                        ? 'bg-docvault-accent/20 text-docvault-accent glow-border'
                        : 'hover:bg-docvault-accent/10'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="text-xs mt-1">{item.name}</span>
                  </div>
                </Link>
              ))}
              <div className="flex flex-col items-center p-2 rounded hover:bg-docvault-accent/10">
                <LanguageSelector />
                <span className="text-xs mt-1">{t('language')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
