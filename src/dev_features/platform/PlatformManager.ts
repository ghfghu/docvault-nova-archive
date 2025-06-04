
import { PlatformAdapter, PlatformType, CrossPlatformConfig } from './types';
import { WebAdapter } from './WebAdapter';

export class PlatformManager {
  private adapter: PlatformAdapter;
  private config: CrossPlatformConfig;
  
  constructor() {
    this.adapter = this.detectPlatform();
    this.config = this.loadConfig();
  }
  
  private detectPlatform(): PlatformAdapter {
    // For now, we only support web platform
    // Future implementations would detect mobile/desktop/embedded
    return new WebAdapter();
  }
  
  private loadConfig(): CrossPlatformConfig {
    return {
      targetPlatforms: ['web'],
      sharedComponents: [
        'DocumentForm',
        'CameraCapture',
        'DataContext',
        'LanguageContext'
      ],
      platformSpecificFeatures: {
        web: ['localStorage', 'indexedDB', 'webRTC'],
        mobile: ['nativeCamera', 'biometrics', 'pushNotifications'],
        desktop: ['fileSystem', 'systemTray', 'autoUpdater'],
        embedded: ['lowPower', 'limitedUI', 'sensors']
      },
      buildSettings: {
        web: { target: 'es2020', format: 'esm' },
        mobile: { cordova: true, capacitor: true },
        desktop: { electron: true, tauri: true },
        embedded: { optimization: 'size', runtime: 'minimal' }
      }
    };
  }
  
  getCurrentPlatform(): PlatformType {
    return this.adapter.type;
  }
  
  getAdapter(): PlatformAdapter {
    return this.adapter;
  }
  
  getCapabilities() {
    return this.adapter.capabilities;
  }
  
  getConfig(): CrossPlatformConfig {
    return this.config;
  }
  
  isFeatureSupported(feature: string): boolean {
    const platformFeatures = this.config.platformSpecificFeatures[this.adapter.type];
    return platformFeatures.includes(feature);
  }
  
  async switchPlatform(platformType: PlatformType): Promise<boolean> {
    try {
      // This would be implemented when we support multiple platforms
      console.log(`Platform switching to ${platformType} not yet implemented`);
      return false;
    } catch (error) {
      console.error('Failed to switch platform:', error);
      return false;
    }
  }
}

export const platformManager = new PlatformManager();
