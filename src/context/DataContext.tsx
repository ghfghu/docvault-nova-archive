
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DocumentData } from '@/types/camera';
import { generateSampleDocuments } from '@/sample-data';
import { localDatabase } from '@/services/LocalDatabase';

// Define types for documents and wanted persons
export interface Document extends DocumentData {
  id: string;
  createdAt: string;
}

export interface WantedPerson {
  id: string;
  fullName: string;
  photo?: string;
  documentNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface Settings {
  darkMode: boolean;
  language: 'en' | 'es' | 'fr';
  showOnboarding: boolean;
  enableAutoFill: boolean;
  enableAssistantTips: boolean;
  offlineMode: boolean;
  aiProcessingEnabled: boolean;
}

// Define the context type
interface DataContextType {
  documents: Document[];
  wantedPersons: WantedPerson[];
  settings: Settings;
  isLoading: boolean;
  addDocument: (document: DocumentData) => void;
  deleteDocument: (id: string) => void;
  addWantedPerson: (person: Omit<WantedPerson, 'id' | 'createdAt'>) => void;
  updateWantedPerson: (id: string, data: Omit<WantedPerson, 'id' | 'createdAt'>) => void;
  deleteWantedPerson: (id: string) => void;
  clearAllData: () => void;
  loadSampleData: () => void;
  loadLargeDataset: () => void;
  exportData: () => Promise<string>;
  importData: (jsonData: string) => Promise<boolean>;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Default settings
const defaultSettings: Settings = {
  darkMode: true,
  language: 'en',
  showOnboarding: true,
  enableAutoFill: true,
  enableAssistantTips: true,
  offlineMode: true,
  aiProcessingEnabled: true
};

// Provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [wantedPersons, setWantedPersons] = useState<WantedPerson[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize local database and load data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        
        // Initialize local database
        await localDatabase.initialize();
        console.log('Local database initialized');

        // Load documents
        const storedDocuments = await localDatabase.getAllDocuments();
        setDocuments(storedDocuments);
        console.log(`Loaded ${storedDocuments.length} documents from local database`);

        // Load wanted persons
        const storedWantedPersons = await localDatabase.getAllWantedPersons();
        setWantedPersons(storedWantedPersons);
        console.log(`Loaded ${storedWantedPersons.length} wanted persons from local database`);

        // Load settings
        const storedSettings = await localDatabase.getSettings();
        if (storedSettings) {
          setSettings({ ...defaultSettings, ...storedSettings });
        }

      } catch (error) {
        console.error('Error initializing data:', error);
        // Fallback to localStorage if database fails
        try {
          const documentsFromStorage = localStorage.getItem('docvault_documents');
          if (documentsFromStorage) {
            setDocuments(JSON.parse(documentsFromStorage));
          }
          
          const personsFromStorage = localStorage.getItem('docvault_wanted_persons');
          if (personsFromStorage) {
            setWantedPersons(JSON.parse(personsFromStorage));
          }
        } catch (fallbackError) {
          console.error('Fallback to localStorage also failed:', fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Add a new document
  const addDocument = async (document: DocumentData) => {
    const newDocument: Document = {
      ...document,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    
    try {
      await localDatabase.addDocument(newDocument);
      setDocuments(prevDocuments => [...prevDocuments, newDocument]);
      console.log('Document added to local database');
    } catch (error) {
      console.error('Failed to add document to database:', error);
      // Fallback to state only
      setDocuments(prevDocuments => [...prevDocuments, newDocument]);
    }
  };

  // Delete a document
  const deleteDocument = async (id: string) => {
    try {
      await localDatabase.deleteDocument(id);
      setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== id));
      console.log('Document deleted from local database');
    } catch (error) {
      console.error('Failed to delete document from database:', error);
      // Fallback to state only
      setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== id));
    }
  };

  // Add a new wanted person
  const addWantedPerson = async (person: Omit<WantedPerson, 'id' | 'createdAt'>) => {
    const newPerson: WantedPerson = {
      ...person,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    
    try {
      await localDatabase.addWantedPerson(newPerson);
      setWantedPersons(prevPersons => [...prevPersons, newPerson]);
      console.log('Wanted person added to local database');
    } catch (error) {
      console.error('Failed to add wanted person to database:', error);
      setWantedPersons(prevPersons => [...prevPersons, newPerson]);
    }
  };

  // Update a wanted person
  const updateWantedPerson = async (id: string, data: Omit<WantedPerson, 'id' | 'createdAt'>) => {
    const updatedPerson = { 
      ...data, 
      id, 
      createdAt: wantedPersons.find(p => p.id === id)?.createdAt || new Date().toISOString() 
    };
    
    try {
      await localDatabase.updateWantedPerson(id, updatedPerson);
      setWantedPersons(prevPersons => 
        prevPersons.map(person => 
          person.id === id ? updatedPerson : person
        )
      );
      console.log('Wanted person updated in local database');
    } catch (error) {
      console.error('Failed to update wanted person in database:', error);
      setWantedPersons(prevPersons => 
        prevPersons.map(person => 
          person.id === id ? updatedPerson : person
        )
      );
    }
  };

  // Delete a wanted person
  const deleteWantedPerson = async (id: string) => {
    try {
      await localDatabase.deleteWantedPerson(id);
      setWantedPersons(prevPersons => prevPersons.filter(person => person.id !== id));
      console.log('Wanted person deleted from local database');
    } catch (error) {
      console.error('Failed to delete wanted person from database:', error);
      setWantedPersons(prevPersons => prevPersons.filter(person => person.id !== id));
    }
  };

  // Clear all data
  const clearAllData = async () => {
    try {
      await localDatabase.clearAllData();
      setDocuments([]);
      setWantedPersons([]);
      console.log('All data cleared from local database');
    } catch (error) {
      console.error('Failed to clear data from database:', error);
      setDocuments([]);
      setWantedPersons([]);
    }
  };
  
  // Load sample data for testing
  const loadSampleData = () => {
    const { generateSampleDocuments, generateSampleWantedPersons } = require('@/sample-data');
    
    const sampleDocuments = generateSampleDocuments(50).map(doc => ({
      ...doc,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }));
    
    const sampleWantedPersons = generateSampleWantedPersons(25);
    
    // Save to database and update state
    Promise.all([
      ...sampleDocuments.map(doc => localDatabase.addDocument(doc)),
      ...sampleWantedPersons.map(person => localDatabase.addWantedPerson(person))
    ]).then(() => {
      setDocuments(sampleDocuments);
      setWantedPersons(sampleWantedPersons);
      console.log(`Loaded ${sampleDocuments.length} sample documents and ${sampleWantedPersons.length} wanted persons`);
    }).catch(error => {
      console.error('Failed to save sample data to database:', error);
      setDocuments(sampleDocuments);
      setWantedPersons(sampleWantedPersons);
    });
  };

  // Load large dataset for stress testing
  const loadLargeDataset = () => {
    const { generateLargeDataset, generateSampleWantedPersons } = require('@/sample-data');
    
    const largeDocuments = generateLargeDataset().map(doc => ({
      ...doc,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }));
    
    const largeWantedPersons = generateSampleWantedPersons(50);
    
    // Save to database and update state
    Promise.all([
      ...largeDocuments.map(doc => localDatabase.addDocument(doc)),
      ...largeWantedPersons.map(person => localDatabase.addWantedPerson(person))
    ]).then(() => {
      setDocuments(largeDocuments);
      setWantedPersons(largeWantedPersons);
      console.log(`Loaded ${largeDocuments.length} documents and ${largeWantedPersons.length} wanted persons for stress testing`);
    }).catch(error => {
      console.error('Failed to save large dataset to database:', error);
      setDocuments(largeDocuments);
      setWantedPersons(largeWantedPersons);
    });
  };

  // Export data as JSON
  const exportData = async (): Promise<string> => {
    try {
      return await localDatabase.exportData();
    } catch (error) {
      console.error('Failed to export from database:', error);
      // Fallback to current state
      const data = {
        documents,
        wantedPersons,
        settings,
        exportDate: new Date().toISOString()
      };
      return JSON.stringify(data, null, 2);
    }
  };

  // Import data from JSON
  const importData = async (jsonData: string): Promise<boolean> => {
    try {
      const success = await localDatabase.importData(jsonData);
      if (success) {
        // Reload data from database
        const [newDocuments, newPersons, newSettings] = await Promise.all([
          localDatabase.getAllDocuments(),
          localDatabase.getAllWantedPersons(),
          localDatabase.getSettings()
        ]);
        
        setDocuments(newDocuments);
        setWantedPersons(newPersons);
        if (newSettings) {
          setSettings({ ...defaultSettings, ...newSettings });
        }
      }
      return success;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  // Update settings
  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updatedSettings = {
      ...settings,
      ...newSettings
    };
    
    try {
      await localDatabase.updateSettings(updatedSettings);
      setSettings(updatedSettings);
      console.log('Settings updated in local database');
    } catch (error) {
      console.error('Failed to update settings in database:', error);
      setSettings(updatedSettings);
    }
  };

  return (
    <DataContext.Provider value={{ 
      documents, 
      wantedPersons, 
      settings,
      isLoading,
      addDocument, 
      deleteDocument,
      addWantedPerson,
      updateWantedPerson,
      deleteWantedPerson,
      clearAllData, 
      loadSampleData,
      loadLargeDataset,
      exportData,
      importData,
      updateSettings
    }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
