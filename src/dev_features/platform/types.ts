
export type PlatformType = 'web' | 'mobile' | 'desktop' | 'embedded';

export interface PlatformCapabilities {
  hasCamera: boolean;
  hasMicrophone: boolean;
  hasFileSystem: boolean;
  hasNotifications: boolean;
  hasOfflineStorage: boolean;
  maxStorageSize: number;
  supportedFormats: string[];
}

export interface PlatformAdapter {
  type: PlatformType;
  capabilities: PlatformCapabilities;
  
  // Storage methods
  saveFile(data: Blob, filename: string): Promise<boolean>;
  readFile(filename: string): Promise<Blob | null>;
  deleteFile(filename: string): Promise<boolean>;
  
  // Camera methods
  captureImage(): Promise<Blob | null>;
  captureVideo(): Promise<Blob | null>;
  
  // Audio methods
  recordAudio(): Promise<Blob | null>;
  playAudio(data: Blob): Promise<boolean>;
  
  // Notification methods
  showNotification(title: string, message: string): Promise<boolean>;
  
  // System integration
  shareContent(content: any): Promise<boolean>;
  openExternalUrl(url: string): Promise<boolean>;
}

export interface CrossPlatformConfig {
  targetPlatforms: PlatformType[];
  sharedComponents: string[];
  platformSpecificFeatures: Record<PlatformType, string[]>;
  buildSettings: Record<PlatformType, any>;
}
