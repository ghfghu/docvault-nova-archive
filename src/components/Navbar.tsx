
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import LanguageSelector from './LanguageSelector';
import ThemeSelector from './ThemeSelector';

const NavbarContent = () => {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  return (
    <>
      <div className="flex items-center justify-between h-16 px-6 bg-docvault-dark/95 backdrop-blur-sm border-b border-docvault-accent/20">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-xl font-bold text-docvault-accent">
            {t('appName')}
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/dashboard" 
            className="text-docvault-gray hover:text-docvault-accent transition-colors"
          >
            {t('dashboard')}
          </Link>
          <Link 
            to="/scan" 
            className="text-docvault-gray hover:text-docvault-accent transition-colors"
          >
            {t('scan')}
          </Link>
          <Link 
            to="/documents" 
            className="text-docvault-gray hover:text-docvault-accent transition-colors"
          >
            {t('documents')}
          </Link>
          <Link 
            to="/wanted" 
            className="text-docvault-gray hover:text-docvault-accent transition-colors"
          >
            {t('wanted')}
          </Link>
          <Link 
            to="/reports" 
            className="text-docvault-gray hover:text-docvault-accent transition-colors"
          >
            {t('reports')}
          </Link>
          <Link 
            to="/enhanced-settings" 
            className="text-docvault-gray hover:text-docvault-accent transition-colors"
          >
            {t('settings')}
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <ThemeSelector />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLogoutDialog(true)}
            className="text-docvault-gray hover:text-docvault-accent"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmLogout')}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('no')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              {t('yes')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Add default export
const Navbar = () => <NavbarContent />;

export default Navbar;
