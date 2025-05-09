
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DocumentData } from '@/types/camera';
import { generateSampleDocuments } from '@/sample-data';

// Define the context type
interface DataContextType {
  documents: DocumentData[];
  addDocument: (document: DocumentData) => void;
  clearAllData: () => void;
  loadSampleData: () => void;
}

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);

  // Load documents from localStorage on initial render
  useEffect(() => {
    const storedDocuments = localStorage.getItem('docvault_documents');
    if (storedDocuments) {
      try {
        setDocuments(JSON.parse(storedDocuments));
      } catch (error) {
        console.error('Error parsing stored documents:', error);
        localStorage.removeItem('docvault_documents');
      }
    }
  }, []);

  // Update localStorage when documents change
  useEffect(() => {
    localStorage.setItem('docvault_documents', JSON.stringify(documents));
  }, [documents]);

  // Add a new document
  const addDocument = (document: DocumentData) => {
    setDocuments(prevDocuments => [...prevDocuments, document]);
  };

  // Clear all data
  const clearAllData = () => {
    setDocuments([]);
    localStorage.removeItem('docvault_documents');
  };
  
  // Load sample data for testing
  const loadSampleData = () => {
    const sampleDocuments = generateSampleDocuments();
    setDocuments(sampleDocuments);
  };

  return (
    <DataContext.Provider value={{ documents, addDocument, clearAllData, loadSampleData }}>
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
