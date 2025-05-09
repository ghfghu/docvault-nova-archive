
import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from './Navbar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, appPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/') {
      navigate('/');
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    // Check if we need to show the app password dialog
    if (isAuthenticated && !sessionStorage.getItem('passwordVerified')) {
      setShowPasswordModal(true);
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = () => {
    if (inputPassword === appPassword) {
      sessionStorage.setItem('passwordVerified', 'true');
      setShowPasswordModal(false);
      setIsPasswordIncorrect(false);
    } else {
      setIsPasswordIncorrect(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated && <Navbar />}
      
      <main className="flex-1 p-4 md:p-6 container">
        {children}
      </main>
      
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="text-xl text-gradient">App Password Required</DialogTitle>
            <DialogDescription>
              Enter the app password to continue (default: 1234)
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="Enter app password"
              className={`bg-docvault-dark/50 border ${isPasswordIncorrect ? 'border-red-500' : 'border-docvault-accent/30'}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePasswordSubmit();
              }}
            />
            {isPasswordIncorrect && (
              <p className="text-red-500 text-sm mt-2">Incorrect password. Please try again.</p>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              className="bg-docvault-accent hover:bg-docvault-accent/80 text-white"
              onClick={handlePasswordSubmit}
            >
              Unlock App
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Layout;
