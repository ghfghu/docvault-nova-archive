
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DocumentData } from '@/types/camera';
import { generateSampleDocuments } from '@/sample-data';

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
}

// Define the context type
interface DataContextType {
  documents: Document[];
  wantedPersons: WantedPerson[];
  settings: Settings;
  addDocument: (document: DocumentData) => void;
  deleteDocument: (id: string) => void;
  addWantedPerson: (person: Omit<WantedPerson, 'id' | 'createdAt'>) => void;
  updateWantedPerson: (id: string, data: Omit<WantedPerson, 'id' | 'createdAt'>) => void;
  deleteWantedPerson: (id: string) => void;
  clearAllData: () => void;
  loadSampleData: () => void;
  loadLargeDataset: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
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
  enableAssistantTips: true
};

// Provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [wantedPersons, setWantedPersons] = useState<WantedPerson[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load data from localStorage on initial render
  useEffect(() => {
    // Load documents
    const storedDocuments = localStorage.getItem('docvault_documents');
    if (storedDocuments) {
      try {
        const parsed = JSON.parse(storedDocuments);
        console.log(`Loaded ${parsed.length} documents from storage`);
        setDocuments(parsed);
      } catch (error) {
        console.error('Error parsing stored documents:', error);
        localStorage.removeItem('docvault_documents');
      }
    }

    // Load wanted persons
    const storedWantedPersons = localStorage.getItem('docvault_wanted_persons');
    if (storedWantedPersons) {
      try {
        const parsed = JSON.parse(storedWantedPersons);
        console.log(`Loaded ${parsed.length} wanted persons from storage`);
        setWantedPersons(parsed);
      } catch (error) {
        console.error('Error parsing stored wanted persons:', error);
        localStorage.removeItem('docvault_wanted_persons');
      }
    }

    // Load settings
    const storedSettings = localStorage.getItem('docvault_settings');
    if (storedSettings) {
      try {
        setSettings({...defaultSettings, ...JSON.parse(storedSettings)});
      } catch (error) {
        console.error('Error parsing stored settings:', error);
        localStorage.removeItem('docvault_settings');
      }
    }
  }, []);

  // Update localStorage when data changes (with batch updates to prevent performance issues)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('docvault_documents', JSON.stringify(documents));
        console.log(`Saved ${documents.length} documents to storage`);
      } catch (error) {
        console.error('Error saving documents to storage:', error);
        // If storage is full, try to clear some space
        if (error instanceof DOMException && error.code === 22) {
          console.warn('Storage quota exceeded, clearing old data');
          localStorage.removeItem('docvault_documents');
        }
      }
    }, 1000); // Debounce saves
    
    return () => clearTimeout(timeoutId);
  }, [documents]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('docvault_wanted_persons', JSON.stringify(wantedPersons));
        console.log(`Saved ${wantedPersons.length} wanted persons to storage`);
      } catch (error) {
        console.error('Error saving wanted persons to storage:', error);
      }
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [wantedPersons]);

  useEffect(() => {
    localStorage.setItem('docvault_settings', JSON.stringify(settings));
  }, [settings]);

  // Add a new document
  const addDocument = (document: DocumentData) => {
    const newDocument: Document = {
      ...document,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setDocuments(prevDocuments => [...prevDocuments, newDocument]);
  };

  // Delete a document
  const deleteDocument = (id: string) => {
    setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== id));
  };

  // Add a new wanted person
  const addWantedPerson = (person: Omit<WantedPerson, 'id' | 'createdAt'>) => {
    const newPerson: WantedPerson = {
      ...person,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setWantedPersons(prevPersons => [...prevPersons, newPerson]);
  };

  // Update a wanted person
  const updateWantedPerson = (id: string, data: Omit<WantedPerson, 'id' | 'createdAt'>) => {
    setWantedPersons(prevPersons => 
      prevPersons.map(person => 
        person.id === id ? { ...person, ...data } : person
      )
    );
  };

  // Delete a wanted person
  const deleteWantedPerson = (id: string) => {
    setWantedPersons(prevPersons => prevPersons.filter(person => person.id !== id));
  };

  // Clear all data
  const clearAllData = () => {
    setDocuments([]);
    setWantedPersons([]);
    localStorage.removeItem('docvault_documents');
    localStorage.removeItem('docvault_wanted_persons');
    console.log('All data cleared');
  };
  
  // Load sample data for testing
  const loadSampleData = () => {
    const { generateSampleDocuments, generateSampleWantedPersons } = require('@/sample-data');
    
    const sampleDocuments = generateSampleDocuments(50).map(doc => ({
      ...doc,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    }));
    
    const sampleWantedPersons = generateSampleWantedPersons(25);
    
    setDocuments(sampleDocuments);
    setWantedPersons(sampleWantedPersons);
    
    console.log(`Loaded ${sampleDocuments.length} sample documents and ${sampleWantedPersons.length} wanted persons`);
  };

  // Load large dataset for stress testing
  const loadLargeDataset = () => {
    const { generateLargeDataset, generateSampleWantedPersons } = require('@/sample-data');
    
    const largeDocuments = generateLargeDataset().map(doc => ({
      ...doc,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    }));
    
    const largeWantedPersons = generateSampleWantedPersons(50);
    
    setDocuments(largeDocuments);
    setWantedPersons(largeWantedPersons);
    
    console.log(`Loaded ${largeDocuments.length} documents and ${largeWantedPersons.length} wanted persons for stress testing`);
  };

  // Export data as JSON
  const exportData = () => {
    const data = {
      documents,
      wantedPersons,
      settings,
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  // Import data from JSON
  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.documents && Array.isArray(data.documents)) {
        setDocuments(data.documents);
      }
      
      if (data.wantedPersons && Array.isArray(data.wantedPersons)) {
        setWantedPersons(data.wantedPersons);
      }
      
      if (data.settings) {
        setSettings({...defaultSettings, ...data.settings});
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  // Update settings
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  return (
    <DataContext.Provider value={{ 
      documents, 
      wantedPersons, 
      settings,
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
