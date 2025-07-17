import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DocumentData } from '@/types/camera';
import { generateSampleDocuments } from '@/sample-data';
import { sqliteDatabase } from '@/services/SQLiteDatabase';

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
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ar';
  autoSave: boolean;
  maxFileSize: number;
  backupEnabled: boolean;
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
  theme: 'system',
  language: 'ar',
  autoSave: true,
  maxFileSize: 10485760,
  backupEnabled: true
};

// Provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [wantedPersons, setWantedPersons] = useState<WantedPerson[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize SQLite database and load data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        
        // Initialize SQLite database
        await sqliteDatabase.initialize();
        console.log('SQLite database initialized successfully');

        // Load documents
        const storedDocuments = await sqliteDatabase.getAllDocuments();
        const convertedDocuments = storedDocuments.map(doc => ({
          id: doc.id,
          name: doc.title,
          type: doc.type,
          date: doc.created_at,
          priority: 1,
          notes: doc.content,
          viewingTag: doc.tags?.[0],
          images: doc.images,
          createdAt: doc.created_at
        }));
        setDocuments(convertedDocuments);
        console.log(`Loaded ${convertedDocuments.length} documents from SQLite database`);

        // Load wanted persons
        const storedWantedPersons = await sqliteDatabase.getAllWantedPersons();
        const convertedPersons = storedWantedPersons.map(person => ({
          ...person,
          fullName: person.name,
          documentNumber: '',
          notes: person.description,
          createdAt: person.created_at
        }));
        setWantedPersons(convertedPersons);
        console.log(`Loaded ${convertedPersons.length} wanted persons from SQLite database`);

        // Load settings
        const storedSettings = await sqliteDatabase.getSettings();
        setSettings(storedSettings);

      } catch (error) {
        console.error('Error initializing SQLite data:', error);
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
      const sqliteDoc = {
        id: newDocument.id,
        title: newDocument.name || 'Untitled Document',
        type: newDocument.type || 'other',
        content: newDocument.notes || '',
        tags: newDocument.viewingTag ? [newDocument.viewingTag] : [],
        created_at: newDocument.createdAt,
        updated_at: newDocument.createdAt,
        images: newDocument.images || []
      };
      
      await sqliteDatabase.addDocument(sqliteDoc);
      setDocuments(prevDocuments => [...prevDocuments, newDocument]);
      console.log('Document added to SQLite database');
    } catch (error) {
      console.error('Failed to add document to database:', error);
      // Fallback to state only
      setDocuments(prevDocuments => [...prevDocuments, newDocument]);
    }
  };

  // Delete a document
  const deleteDocument = async (id: string) => {
    try {
      await sqliteDatabase.deleteDocument(id);
      setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== id));
      console.log('Document deleted from SQLite database');
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
      const sqlitePerson = {
        id: newPerson.id,
        name: newPerson.fullName,
        description: newPerson.notes || '',
        image: newPerson.photo,
        created_at: newPerson.createdAt,
        updated_at: newPerson.createdAt
      };
      
      await sqliteDatabase.addWantedPerson(sqlitePerson);
      setWantedPersons(prevPersons => [...prevPersons, newPerson]);
      console.log('Wanted person added to SQLite database');
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
      const sqlitePerson = {
        id: updatedPerson.id,
        name: updatedPerson.fullName,
        description: updatedPerson.notes || '',
        image: updatedPerson.photo,
        created_at: updatedPerson.createdAt,
        updated_at: new Date().toISOString()
      };
      
      await sqliteDatabase.addWantedPerson(sqlitePerson); // SQLite uses INSERT OR REPLACE
      setWantedPersons(prevPersons => 
        prevPersons.map(person => 
          person.id === id ? updatedPerson : person
        )
      );
      console.log('Wanted person updated in SQLite database');
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
      await sqliteDatabase.deleteWantedPerson(id);
      setWantedPersons(prevPersons => prevPersons.filter(person => person.id !== id));
      console.log('Wanted person deleted from SQLite database');
    } catch (error) {
      console.error('Failed to delete wanted person from database:', error);
      setWantedPersons(prevPersons => prevPersons.filter(person => person.id !== id));
    }
  };

  // Clear all data
  const clearAllData = async () => {
    try {
      await sqliteDatabase.clearAllData();
      setDocuments([]);
      setWantedPersons([]);
      setSettings(defaultSettings);
      console.log('All data cleared from SQLite database');
    } catch (error) {
      console.error('Failed to clear data from database:', error);
      setDocuments([]);
      setWantedPersons([]);
      setSettings(defaultSettings);
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
    
    // Convert and save to SQLite database
    Promise.all([
      ...sampleDocuments.map(doc => {
        const sqliteDoc = {
          id: doc.id,
          title: doc.title || 'Sample Document',
          type: doc.type || 'other',
          content: doc.description || '',
          tags: doc.tags || [],
          created_at: doc.createdAt,
          updated_at: doc.createdAt,
          images: doc.images || []
        };
        return sqliteDatabase.addDocument(sqliteDoc);
      }),
      ...sampleWantedPersons.map(person => {
        const sqlitePerson = {
          id: person.id,
          name: person.fullName,
          description: person.notes || '',
          image: person.photo,
          created_at: person.createdAt,
          updated_at: person.createdAt
        };
        return sqliteDatabase.addWantedPerson(sqlitePerson);
      })
    ]).then(() => {
      setDocuments(sampleDocuments);
      setWantedPersons(sampleWantedPersons);
      console.log(`Loaded ${sampleDocuments.length} sample documents and ${sampleWantedPersons.length} wanted persons`);
    }).catch(error => {
      console.error('Failed to save sample data to SQLite database:', error);
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
    
    // Convert and save to SQLite database
    Promise.all([
      ...largeDocuments.map(doc => {
        const sqliteDoc = {
          id: doc.id,
          title: doc.title || 'Large Dataset Document',
          type: doc.type || 'other',
          content: doc.description || '',
          tags: doc.tags || [],
          created_at: doc.createdAt,
          updated_at: doc.createdAt,
          images: doc.images || []
        };
        return sqliteDatabase.addDocument(sqliteDoc);
      }),
      ...largeWantedPersons.map(person => {
        const sqlitePerson = {
          id: person.id,
          name: person.fullName,
          description: person.notes || '',
          image: person.photo,
          created_at: person.createdAt,
          updated_at: person.createdAt
        };
        return sqliteDatabase.addWantedPerson(sqlitePerson);
      })
    ]).then(() => {
      setDocuments(largeDocuments);
      setWantedPersons(largeWantedPersons);
      console.log(`Loaded ${largeDocuments.length} documents and ${largeWantedPersons.length} wanted persons for stress testing`);
    }).catch(error => {
      console.error('Failed to save large dataset to SQLite database:', error);
      setDocuments(largeDocuments);
      setWantedPersons(largeWantedPersons);
    });
  };

  // Export data as JSON
  const exportData = async (): Promise<string> => {
    try {
      return await sqliteDatabase.exportData();
    } catch (error) {
      console.error('Failed to export from SQLite database:', error);
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
      const success = await sqliteDatabase.importData(jsonData);
      if (success) {
        // Reload data from SQLite database
        const [newDocuments, newPersons, newSettings] = await Promise.all([
          sqliteDatabase.getAllDocuments(),
          sqliteDatabase.getAllWantedPersons(),
          sqliteDatabase.getSettings()
        ]);
        
        // Convert SQLite format to app format
        const convertedDocuments = newDocuments.map(doc => ({
          id: doc.id,
          name: doc.title,
          type: doc.type,
          date: doc.created_at,
          priority: 1,
          notes: doc.content,
          viewingTag: doc.tags?.[0],
          images: doc.images,
          createdAt: doc.created_at
        }));
        
        const convertedPersons = newPersons.map(person => ({
          ...person,
          fullName: person.name,
          documentNumber: '',
          notes: person.description,
          createdAt: person.created_at
        }));
        
        setDocuments(convertedDocuments);
        setWantedPersons(convertedPersons);
        setSettings(newSettings);
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
      await sqliteDatabase.updateSettings(updatedSettings);
      setSettings(updatedSettings);
      console.log('Settings updated in SQLite database');
    } catch (error) {
      console.error('Failed to update settings in SQLite database:', error);
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