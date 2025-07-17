
// AI Services removed - project now uses SQLite database only

// External Module System
import { ModuleManager, moduleManager } from './external/ModuleManager';
export { ModuleManager, moduleManager } from './external/ModuleManager';
export type { ExternalModule, ModuleConfig, ExternalAPI } from './external/types';

// Platform Abstraction
import { PlatformManager, platformManager } from './platform/PlatformManager';
import { WebAdapter } from './platform/WebAdapter';
export { PlatformManager, platformManager } from './platform/PlatformManager';
export { WebAdapter } from './platform/WebAdapter';
export type { PlatformAdapter, PlatformCapabilities, CrossPlatformConfig } from './platform/types';

// Extension System
import { ExtensionRegistry, extensionRegistry } from './extensions/ExtensionRegistry';
export { ExtensionRegistry, extensionRegistry } from './extensions/ExtensionRegistry';
export type { Extension, ExtensionHook } from './extensions/ExtensionRegistry';

// Future-ready exports for easy integration
export const DevFeatures = {
  platform: {
    manager: platformManager,
    WebAdapter
  },
  modules: {
    manager: moduleManager
  },
  extensions: {
    registry: extensionRegistry
  }
};
