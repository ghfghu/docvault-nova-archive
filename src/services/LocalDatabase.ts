
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Document, WantedPerson, Settings } from '@/context/DataContext';

interface DocVaultDB extends DBSchema {
  documents: {
    key: string;
    value: Document;
    indexes: { 'by-date': string; 'by-type': string };
  };
  wantedPersons: {
    key: string;
    value: WantedPerson;
    indexes: { 'by-name': string };
  };
  settings: {
    key: string;
    value: Settings & { id: string }; // Add id to Settings type for storage
  };
  aiModels: {
    key: string;
    value: {
      id: string;
      name: string;
      type: string;
      modelData: ArrayBuffer;
      metadata: any;
      createdAt: string;
    };
  };
  trainingData: {
    key: string;
    value: {
      id: string;
      modelId: string;
      data: any;
      labels: string[];
      createdAt: string;
    };
  };
}

class LocalDatabaseService {
  private db: IDBPDatabase<DocVaultDB> | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.db = await openDB<DocVaultDB>('DocVaultDB', 2, {
        upgrade(db, oldVersion, newVersion, transaction) {
          console.log('Upgrading database from version', oldVersion, 'to', newVersion);

          // Documents store
          if (!db.objectStoreNames.contains('documents')) {
            const documentsStore = db.createObjectStore('documents', { keyPath: 'id' });
            documentsStore.createIndex('by-date', 'createdAt');
            documentsStore.createIndex('by-type', 'type');
          }

          // Wanted persons store
          if (!db.objectStoreNames.contains('wantedPersons')) {
            const personsStore = db.createObjectStore('wantedPersons', { keyPath: 'id' });
            personsStore.createIndex('by-name', 'fullName');
          }

          // Settings store
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'id' });
          }

          // AI Models store
          if (!db.objectStoreNames.contains('aiModels')) {
            db.createObjectStore('aiModels', { keyPath: 'id' });
          }

          // Training data store
          if (!db.objectStoreNames.contains('trainingData')) {
            db.createObjectStore('trainingData', { keyPath: 'id' });
          }
        },
      });

      this.isInitialized = true;
      console.log('Local database initialized successfully');
      
      // Migrate data from localStorage if needed
      await this.migrateFromLocalStorage();
    } catch (error) {
      console.error('Failed to initialize local database:', error);
      throw error;
    }
  }

  private async migrateFromLocalStorage(): Promise<void> {
    try {
      // Migrate documents
      const storedDocuments = localStorage.getItem('docvault_documents');
      if (storedDocuments && this.db) {
        const documents = JSON.parse(storedDocuments);
        const tx = this.db.transaction('documents', 'readwrite');
        for (const doc of documents) {
          await tx.objectStore('documents').put(doc);
        }
        await tx.done;
        console.log(`Migrated ${documents.length} documents from localStorage`);
        localStorage.removeItem('docvault_documents');
      }

      // Migrate wanted persons
      const storedPersons = localStorage.getItem('docvault_wanted_persons');
      if (storedPersons && this.db) {
        const persons = JSON.parse(storedPersons);
        const tx = this.db.transaction('wantedPersons', 'readwrite');
        for (const person of persons) {
          await tx.objectStore('wantedPersons').put(person);
        }
        await tx.done;
        console.log(`Migrated ${persons.length} wanted persons from localStorage`);
        localStorage.removeItem('docvault_wanted_persons');
      }

      // Migrate settings
      const storedSettings = localStorage.getItem('docvault_settings');
      if (storedSettings && this.db) {
        const settings = JSON.parse(storedSettings);
        await this.db.put('settings', { ...settings, id: 'main' }); // Add id for settings
        console.log('Migrated settings from localStorage');
        localStorage.removeItem('docvault_settings');
      }
    } catch (error) {
      console.error('Migration from localStorage failed:', error);
    }
  }

  // Document operations
  async getAllDocuments(): Promise<Document[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAll('documents');
  }

  async addDocument(document: Document): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('documents', document);
  }

  async deleteDocument(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.delete('documents', id);
  }

  // Wanted persons operations
  async getAllWantedPersons(): Promise<WantedPerson[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAll('wantedPersons');
  }

  async addWantedPerson(person: WantedPerson): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('wantedPersons', person);
  }

  async updateWantedPerson(id: string, person: WantedPerson): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('wantedPersons', { ...person, id });
  }

  async deleteWantedPerson(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.delete('wantedPersons', id);
  }

  // Settings operations
  async getSettings(): Promise<Settings | null> {
    if (!this.db) throw new Error('Database not initialized');
    const result = await this.db.get('settings', 'main');
    if (!result) return null;
    
    // Remove the id field when returning Settings
    const { id, ...settings } = result;
    return settings as Settings;
  }

  async updateSettings(settings: Settings): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('settings', { ...settings, id: 'main' }); // Add id for storage
  }

  // AI Model operations
  async saveAIModel(model: { id: string; name: string; type: string; modelData: ArrayBuffer; metadata: any }): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('aiModels', {
      ...model,
      createdAt: new Date().toISOString()
    });
  }

  async getAIModels(): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAll('aiModels');
  }

  async deleteAIModel(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.delete('aiModels', id);
  }

  // Training data operations
  async saveTrainingData(data: { modelId: string; data: any; labels: string[] }): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('trainingData', {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString()
    });
  }

  async getTrainingData(modelId?: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    const allData = await this.db.getAll('trainingData');
    return modelId ? allData.filter(d => d.modelId === modelId) : allData;
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const tx = this.db.transaction(['documents', 'wantedPersons', 'aiModels', 'trainingData'], 'readwrite');
    await Promise.all([
      tx.objectStore('documents').clear(),
      tx.objectStore('wantedPersons').clear(),
      tx.objectStore('aiModels').clear(),
      tx.objectStore('trainingData').clear()
    ]);
    await tx.done;
    console.log('All data cleared from local database');
  }

  // Export all data
  async exportData(): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');
    
    const [documents, wantedPersons, settings, models, trainingData] = await Promise.all([
      this.getAllDocuments(),
      this.getAllWantedPersons(),
      this.getSettings(),
      this.getAIModels(),
      this.getTrainingData()
    ]);

    return JSON.stringify({
      documents,
      wantedPersons,
      settings,
      aiModels: models,
      trainingData,
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  // Import data
  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      
      if (!this.db) throw new Error('Database not initialized');

      const tx = this.db.transaction(['documents', 'wantedPersons', 'settings', 'aiModels', 'trainingData'], 'readwrite');

      if (data.documents?.length) {
        for (const doc of data.documents) {
          await tx.objectStore('documents').put(doc);
        }
      }

      if (data.wantedPersons?.length) {
        for (const person of data.wantedPersons) {
          await tx.objectStore('wantedPersons').put(person);
        }
      }

      if (data.settings) {
        await tx.objectStore('settings').put({ ...data.settings, id: 'main' }); // Add id for storage
      }

      if (data.aiModels?.length) {
        for (const model of data.aiModels) {
          await tx.objectStore('aiModels').put(model);
        }
      }

      if (data.trainingData?.length) {
        for (const training of data.trainingData) {
          await tx.objectStore('trainingData').put(training);
        }
      }

      await tx.done;
      console.log('Data imported successfully');
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }
}

export const localDatabase = new LocalDatabaseService();
