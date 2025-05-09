
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

export interface Document {
  id: string;
  userId: string;
  name: string;
  date: string;
  type: string;
  priority: number;
  notes: string;
  viewingTag?: string;
  images: string[]; // base64 encoded images
  createdAt: string;
}

export interface WantedPerson {
  id: string;
  userId: string;
  fullName: string;
  photo?: string; // base64 encoded image
  documentNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface AppSettings {
  darkMode: boolean;
  language: 'en' | 'es' | 'fr'; // Default languages
  showOnboarding: boolean;
  enableAutoFill: boolean;
  enableAssistantTips: boolean;
}

interface DataContextType {
  documents: Document[];
  wantedPersons: WantedPerson[];
  settings: AppSettings;
  addDocument: (document: Omit<Document, 'id' | 'userId' | 'createdAt'>) => void;
  updateDocument: (id: string, document: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  addWantedPerson: (person: Omit<WantedPerson, 'id' | 'userId' | 'createdAt'>) => void;
  updateWantedPerson: (id: string, person: Partial<WantedPerson>) => void;
  deleteWantedPerson: (id: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

// Default settings
const defaultSettings: AppSettings = {
  darkMode: true,
  language: 'en',
  showOnboarding: true,
  enableAutoFill: true,
  enableAssistantTips: true
};

export const DataProvider = ({ children }: DataProviderProps) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [wantedPersons, setWantedPersons] = useState<WantedPerson[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  
  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadUserData(user);
    } else {
      // Clear data when user logs out
      setDocuments([]);
      setWantedPersons([]);
      setSettings(defaultSettings);
    }
  }, [user]);
  
  const loadUserData = (user: User) => {
    try {
      // Load documents
      const savedDocuments = localStorage.getItem(`${user.id}_documents`);
      if (savedDocuments) {
        setDocuments(JSON.parse(savedDocuments));
      }
      
      // Load wanted persons
      const savedWantedPersons = localStorage.getItem(`${user.id}_wantedPersons`);
      if (savedWantedPersons) {
        setWantedPersons(JSON.parse(savedWantedPersons));
      }
      
      // Load settings
      const savedSettings = localStorage.getItem(`${user.id}_settings`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      } else {
        // If no settings saved, use defaults and save them
        localStorage.setItem(`${user.id}_settings`, JSON.stringify(defaultSettings));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Data loading error",
        description: "There was an error loading your data",
        variant: "destructive"
      });
    }
  };
  
  const saveData = (key: string, data: any) => {
    if (!user) return;
    
    try {
      localStorage.setItem(`${user.id}_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      toast({
        title: "Data saving error",
        description: `There was an error saving your ${key}`,
        variant: "destructive"
      });
    }
  };
  
  // Document operations
  const addDocument = (document: Omit<Document, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    
    const newDocument: Document = {
      ...document,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date().toISOString()
    };
    
    const updatedDocuments = [...documents, newDocument];
    setDocuments(updatedDocuments);
    saveData('documents', updatedDocuments);
    
    toast({
      title: "Document added",
      description: "Your document has been saved successfully"
    });
  };
  
  const updateDocument = (id: string, document: Partial<Document>) => {
    const updatedDocuments = documents.map(doc => 
      doc.id === id ? { ...doc, ...document } : doc
    );
    
    setDocuments(updatedDocuments);
    saveData('documents', updatedDocuments);
    
    toast({
      title: "Document updated",
      description: "Your document has been updated successfully"
    });
  };
  
  const deleteDocument = (id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    
    setDocuments(updatedDocuments);
    saveData('documents', updatedDocuments);
    
    toast({
      title: "Document deleted",
      description: "Your document has been deleted successfully"
    });
  };
  
  // Wanted persons operations
  const addWantedPerson = (person: Omit<WantedPerson, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    
    const newPerson: WantedPerson = {
      ...person,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date().toISOString()
    };
    
    const updatedPersons = [...wantedPersons, newPerson];
    setWantedPersons(updatedPersons);
    saveData('wantedPersons', updatedPersons);
    
    toast({
      title: "Person added",
      description: "Person has been added to the database successfully"
    });
  };
  
  const updateWantedPerson = (id: string, person: Partial<WantedPerson>) => {
    const updatedPersons = wantedPersons.map(p => 
      p.id === id ? { ...p, ...person } : p
    );
    
    setWantedPersons(updatedPersons);
    saveData('wantedPersons', updatedPersons);
    
    toast({
      title: "Person updated",
      description: "Person has been updated successfully"
    });
  };
  
  const deleteWantedPerson = (id: string) => {
    const updatedPersons = wantedPersons.filter(p => p.id !== id);
    
    setWantedPersons(updatedPersons);
    saveData('wantedPersons', updatedPersons);
    
    toast({
      title: "Person deleted",
      description: "Person has been removed from the database"
    });
  };
  
  // Settings operations
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    if (!user) return;
    
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    saveData('settings', updatedSettings);
    
    toast({
      title: "Settings updated",
      description: "Your settings have been saved"
    });
  };
  
  // Export all user data as JSON
  const exportData = () => {
    if (!user) return '';
    
    const exportObj = {
      documents,
      wantedPersons,
      settings,
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(exportObj);
  };
  
  // Import data from JSON
  const importData = (jsonData: string): boolean => {
    if (!user) return false;
    
    try {
      const importedData = JSON.parse(jsonData);
      
      // Validate data structure
      if (!importedData.documents || !importedData.wantedPersons || !importedData.settings) {
        throw new Error('Invalid data format');
      }
      
      // Update documents with current user ID
      const updatedDocuments = importedData.documents.map((doc: Document) => ({
        ...doc,
        userId: user.id
      }));
      setDocuments(updatedDocuments);
      saveData('documents', updatedDocuments);
      
      // Update wanted persons with current user ID
      const updatedPersons = importedData.wantedPersons.map((person: WantedPerson) => ({
        ...person,
        userId: user.id
      }));
      setWantedPersons(updatedPersons);
      saveData('wantedPersons', updatedPersons);
      
      // Update settings
      setSettings(importedData.settings);
      saveData('settings', importedData.settings);
      
      toast({
        title: "Data imported",
        description: "Your data has been imported successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "There was an error with the imported data",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return (
    <DataContext.Provider value={{
      documents,
      wantedPersons,
      settings,
      addDocument,
      updateDocument,
      deleteDocument,
      addWantedPerson,
      updateWantedPerson,
      deleteWantedPerson,
      updateSettings,
      exportData,
      importData
    }}>
      {children}
    </DataContext.Provider>
  );
};
