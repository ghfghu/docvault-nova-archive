
import { ExternalModule } from '../external/types';

export interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  category: 'ai' | 'storage' | 'ui' | 'analytics' | 'integration';
  entryPoint: string;
  dependencies: string[];
  permissions: string[];
  isEnabled: boolean;
}

export interface ExtensionHook {
  name: string;
  priority: number;
  handler: (...args: any[]) => Promise<any>;
}

export class ExtensionRegistry {
  private extensions: Map<string, Extension> = new Map();
  private hooks: Map<string, ExtensionHook[]> = new Map();
  
  async registerExtension(extension: Extension): Promise<boolean> {
    try {
      // Validate extension
      if (!this.validateExtension(extension)) {
        throw new Error('Extension validation failed');
      }
      
      this.extensions.set(extension.id, extension);
      console.log(`Extension ${extension.name} registered successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to register extension ${extension.name}:`, error);
      return false;
    }
  }
  
  async unregisterExtension(extensionId: string): Promise<boolean> {
    try {
      const extension = this.extensions.get(extensionId);
      if (!extension) {
        throw new Error('Extension not found');
      }
      
      // Remove all hooks from this extension
      this.removeExtensionHooks(extensionId);
      
      this.extensions.delete(extensionId);
      console.log(`Extension ${extension.name} unregistered successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to unregister extension ${extensionId}:`, error);
      return false;
    }
  }
  
  getExtension(extensionId: string): Extension | undefined {
    return this.extensions.get(extensionId);
  }
  
  getExtensionsByCategory(category: Extension['category']): Extension[] {
    return Array.from(this.extensions.values()).filter(ext => ext.category === category);
  }
  
  addHook(hookName: string, handler: ExtensionHook): void {
    const hooks = this.hooks.get(hookName) || [];
    hooks.push(handler);
    hooks.sort((a, b) => b.priority - a.priority); // Higher priority first
    this.hooks.set(hookName, hooks);
  }
  
  removeHook(hookName: string, handlerName: string): void {
    const hooks = this.hooks.get(hookName) || [];
    const filteredHooks = hooks.filter(hook => hook.name !== handlerName);
    this.hooks.set(hookName, filteredHooks);
  }
  
  async executeHooks(hookName: string, ...args: any[]): Promise<any[]> {
    const hooks = this.hooks.get(hookName) || [];
    const results = [];
    
    for (const hook of hooks) {
      try {
        const result = await hook.handler(...args);
        results.push(result);
      } catch (error) {
        console.error(`Error executing hook ${hook.name}:`, error);
        results.push(null);
      }
    }
    
    return results;
  }
  
  private validateExtension(extension: Extension): boolean {
    // Basic validation
    if (!extension.id || !extension.name || !extension.version) {
      return false;
    }
    
    // Check for duplicate IDs
    if (this.extensions.has(extension.id)) {
      console.error(`Extension with ID ${extension.id} already exists`);
      return false;
    }
    
    return true;
  }
  
  private removeExtensionHooks(extensionId: string): void {
    for (const [hookName, hooks] of this.hooks.entries()) {
      const filteredHooks = hooks.filter(hook => !hook.name.startsWith(extensionId));
      this.hooks.set(hookName, filteredHooks);
    }
  }
}

export const extensionRegistry = new ExtensionRegistry();
