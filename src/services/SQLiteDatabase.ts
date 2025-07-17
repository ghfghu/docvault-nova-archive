import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

export interface Document {
  id: string;
  title: string;
  type: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  images: string[];
}

export interface WantedPerson {
  id: string;
  name: string;
  description: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ar';
  autoSave: boolean;
  maxFileSize: number;
  backupEnabled: boolean;
}

export class SQLiteDatabaseService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private isInitialized = false;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // SQLite is available on all platforms with capacitor-community/sqlite

      // Create/open database
      this.db = await this.sqlite.createConnection(
        'docvault_database',
        false,
        'no-encryption',
        1,
        false
      );

      await this.db.open();
      await this.createTables();
      await this.migrateFromLocalStorage();
      
      this.isInitialized = true;
      console.log('SQLite database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize SQLite database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const createDocumentsTable = `
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        content TEXT,
        tags TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        images TEXT
      );
    `;

    const createWantedPersonsTable = `
      CREATE TABLE IF NOT EXISTS wanted_persons (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        image TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `;

    const createSettingsTable = `
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        theme TEXT DEFAULT 'system',
        language TEXT DEFAULT 'ar',
        auto_save INTEGER DEFAULT 1,
        max_file_size INTEGER DEFAULT 10485760,
        backup_enabled INTEGER DEFAULT 1
      );
    `;

    await this.db.execute(createDocumentsTable);
    await this.db.execute(createWantedPersonsTable);
    await this.db.execute(createSettingsTable);

    // Insert default settings if not exists
    await this.db.run(
      'INSERT OR IGNORE INTO settings (id, theme, language, auto_save, max_file_size, backup_enabled) VALUES (1, ?, ?, ?, ?, ?)',
      ['system', 'ar', 1, 10485760, 1]
    );
  }

  private async migrateFromLocalStorage(): Promise<void> {
    try {
      // Migrate documents
      const documentsData = localStorage.getItem('documents');
      if (documentsData) {
        const documents = JSON.parse(documentsData);
        for (const doc of documents) {
          await this.addDocument(doc);
        }
        localStorage.removeItem('documents');
      }

      // Migrate wanted persons
      const wantedData = localStorage.getItem('wantedPersons');
      if (wantedData) {
        const persons = JSON.parse(wantedData);
        for (const person of persons) {
          await this.addWantedPerson(person);
        }
        localStorage.removeItem('wantedPersons');
      }

      // Migrate settings
      const settingsData = localStorage.getItem('settings');
      if (settingsData) {
        const settings = JSON.parse(settingsData);
        await this.updateSettings(settings);
        localStorage.removeItem('settings');
      }

      console.log('Data migration from localStorage completed');
    } catch (error) {
      console.error('Error during migration:', error);
    }
  }

  // Document operations
  async getAllDocuments(): Promise<Document[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.query('SELECT * FROM documents ORDER BY created_at DESC');
    return result.values?.map(row => ({
      id: row.id,
      title: row.title,
      type: row.type,
      content: row.content || '',
      tags: row.tags ? JSON.parse(row.tags) : [],
      created_at: row.created_at,
      updated_at: row.updated_at,
      images: row.images ? JSON.parse(row.images) : []
    })) || [];
  }

  async addDocument(document: Document): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.run(
      'INSERT OR REPLACE INTO documents (id, title, type, content, tags, created_at, updated_at, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        document.id,
        document.title,
        document.type,
        document.content,
        JSON.stringify(document.tags),
        document.created_at,
        document.updated_at,
        JSON.stringify(document.images)
      ]
    );
  }

  async deleteDocument(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.run('DELETE FROM documents WHERE id = ?', [id]);
  }

  // Wanted persons operations
  async getAllWantedPersons(): Promise<WantedPerson[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.query('SELECT * FROM wanted_persons ORDER BY created_at DESC');
    return result.values?.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description || '',
      image: row.image,
      created_at: row.created_at,
      updated_at: row.updated_at
    })) || [];
  }

  async addWantedPerson(person: WantedPerson): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.run(
      'INSERT OR REPLACE INTO wanted_persons (id, name, description, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [person.id, person.name, person.description, person.image, person.created_at, person.updated_at]
    );
  }

  async deleteWantedPerson(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.run('DELETE FROM wanted_persons WHERE id = ?', [id]);
  }

  // Settings operations
  async getSettings(): Promise<Settings> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.query('SELECT * FROM settings WHERE id = 1');
    const row = result.values?.[0];
    
    if (row) {
      return {
        theme: row.theme as 'light' | 'dark' | 'system',
        language: row.language as 'en' | 'ar',
        autoSave: Boolean(row.auto_save),
        maxFileSize: row.max_file_size,
        backupEnabled: Boolean(row.backup_enabled)
      };
    }
    
    // Return defaults if no settings found
    return {
      theme: 'system',
      language: 'ar',
      autoSave: true,
      maxFileSize: 10485760,
      backupEnabled: true
    };
  }

  async updateSettings(settings: Partial<Settings>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const currentSettings = await this.getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    
    await this.db.run(
      'UPDATE settings SET theme = ?, language = ?, auto_save = ?, max_file_size = ?, backup_enabled = ? WHERE id = 1',
      [
        updatedSettings.theme,
        updatedSettings.language,
        updatedSettings.autoSave ? 1 : 0,
        updatedSettings.maxFileSize,
        updatedSettings.backupEnabled ? 1 : 0
      ]
    );
  }

  // Export/Import operations
  async exportData(): Promise<string> {
    const documents = await this.getAllDocuments();
    const wantedPersons = await this.getAllWantedPersons();
    const settings = await this.getSettings();
    
    return JSON.stringify({
      documents,
      wantedPersons,
      settings,
      exportDate: new Date().toISOString()
    });
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.documents) {
        for (const doc of data.documents) {
          await this.addDocument(doc);
        }
      }
      
      if (data.wantedPersons) {
        for (const person of data.wantedPersons) {
          await this.addWantedPerson(person);
        }
      }
      
      if (data.settings) {
        await this.updateSettings(data.settings);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.run('DELETE FROM documents');
    await this.db.run('DELETE FROM wanted_persons');
    await this.db.run('UPDATE settings SET theme = ?, language = ?, auto_save = ?, max_file_size = ?, backup_enabled = ? WHERE id = 1',
      ['system', 'ar', 1, 10485760, 1]);
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      this.isInitialized = false;
    }
  }
}

export const sqliteDatabase = new SQLiteDatabaseService();