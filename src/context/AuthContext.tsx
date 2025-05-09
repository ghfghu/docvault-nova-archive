
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  appPassword: string;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateAppPassword: (newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appPassword, setAppPassword] = useState('1234'); // Default app password
  
  useEffect(() => {
    // Check for saved user on mount
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
      }
    }
    
    // Check for saved app password
    const savedAppPassword = localStorage.getItem('appPassword');
    if (savedAppPassword) {
      setAppPassword(savedAppPassword);
    } else {
      // If no app password is saved, save the default
      localStorage.setItem('appPassword', appPassword);
    }
  }, []);
  
  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, we would validate against a server
    // For now, we'll check against localStorage
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: any) => 
        u.username === username && u.password === password
      );
      
      if (foundUser) {
        const userObj = {
          id: foundUser.id,
          username: foundUser.username
        };
        setUser(userObj);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(userObj));
        toast({
          title: "Login successful",
          description: `Welcome back, ${username}!`,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if username already exists
      if (users.some((u: any) => u.username === username)) {
        toast({
          title: "Registration failed",
          description: "Username already exists",
          variant: "destructive"
        });
        return false;
      }
      
      // Create new user
      const newUser = {
        id: crypto.randomUUID(),
        username,
        password
      };
      
      // Add to users array
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto login
      const userObj = {
        id: newUser.id,
        username: newUser.username
      };
      setUser(userObj);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userObj));
      
      toast({
        title: "Account created",
        description: `Welcome, ${username}!`,
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
  };
  
  const updateAppPassword = (newPassword: string) => {
    setAppPassword(newPassword);
    localStorage.setItem('appPassword', newPassword);
    toast({
      title: "App password updated",
      description: "Your new app password has been saved"
    });
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      appPassword,
      login,
      register,
      logout,
      updateAppPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};
