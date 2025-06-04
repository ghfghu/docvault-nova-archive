
import { ExternalModule, ModuleConfig, ModuleEventData } from './types';

export class ModuleManager {
  private modules: Map<string, ExternalModule> = new Map();
  private configs: Map<string, ModuleConfig> = new Map();
  private eventListeners: Map<string, ((data: ModuleEventData) => void)[]> = new Map();
  
  async loadModule(moduleData: ExternalModule): Promise<boolean> {
    try {
      // Validate module permissions and dependencies
      const isValid = await this.validateModule(moduleData);
      if (!isValid) {
        throw new Error('Module validation failed');
      }
      
      this.modules.set(moduleData.id, moduleData);
      console.log(`Module ${moduleData.name} loaded successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to load module ${moduleData.name}:`, error);
      return false;
    }
  }
  
  async unloadModule(moduleId: string): Promise<boolean> {
    try {
      const module = this.modules.get(moduleId);
      if (!module) {
        throw new Error('Module not found');
      }
      
      // Clean up module resources
      this.modules.delete(moduleId);
      this.configs.delete(moduleId);
      this.eventListeners.delete(moduleId);
      
      console.log(`Module ${module.name} unloaded successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to unload module ${moduleId}:`, error);
      return false;
    }
  }
  
  getModule(moduleId: string): ExternalModule | undefined {
    return this.modules.get(moduleId);
  }
  
  getActiveModules(): ExternalModule[] {
    return Array.from(this.modules.values()).filter(module => module.isActive);
  }
  
  updateModuleConfig(moduleId: string, config: Partial<ModuleConfig>): void {
    const existingConfig = this.configs.get(moduleId) || {
      moduleId,
      settings: {},
      enabled: true
    };
    
    this.configs.set(moduleId, { ...existingConfig, ...config });
  }
  
  getModuleConfig(moduleId: string): ModuleConfig | undefined {
    return this.configs.get(moduleId);
  }
  
  addEventListener(moduleId: string, callback: (data: ModuleEventData) => void): void {
    const listeners = this.eventListeners.get(moduleId) || [];
    listeners.push(callback);
    this.eventListeners.set(moduleId, listeners);
  }
  
  removeEventListener(moduleId: string, callback: (data: ModuleEventData) => void): void {
    const listeners = this.eventListeners.get(moduleId) || [];
    const filteredListeners = listeners.filter(listener => listener !== callback);
    this.eventListeners.set(moduleId, filteredListeners);
  }
  
  emitEvent(data: ModuleEventData): void {
    const listeners = this.eventListeners.get(data.moduleId) || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in module event listener:`, error);
      }
    });
  }
  
  private async validateModule(module: ExternalModule): Promise<boolean> {
    // Validate dependencies
    for (const dependency of module.dependencies) {
      if (!this.modules.has(dependency)) {
        console.error(`Missing dependency: ${dependency}`);
        return false;
      }
    }
    
    // Validate permissions (basic check)
    for (const permission of module.permissions) {
      if (permission.required && !this.checkPermission(permission.type)) {
        console.error(`Missing required permission: ${permission.type}`);
        return false;
      }
    }
    
    return true;
  }
  
  private checkPermission(type: string): boolean {
    // Basic permission checking - would be more sophisticated in real implementation
    switch (type) {
      case 'storage':
        return typeof localStorage !== 'undefined';
      case 'camera':
        return navigator.mediaDevices && navigator.mediaDevices.getUserMedia !== undefined;
      case 'microphone':
        return navigator.mediaDevices && navigator.mediaDevices.getUserMedia !== undefined;
      case 'network':
        return typeof fetch !== 'undefined';
      case 'files':
        return typeof FileReader !== 'undefined';
      default:
        return false;
    }
  }
}

export const moduleManager = new ModuleManager();
