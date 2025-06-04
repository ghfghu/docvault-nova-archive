
// AI Services
export { DocumentAIService, VoiceAIService } from './ai/AIService';
export type { AIModel, AIRequest, AIResponse, DocumentAnalysisResult } from './ai/types';

// External Module System
export { ModuleManager, moduleManager } from './external/ModuleManager';
export type { ExternalModule, ModuleConfig, ExternalAPI } from './external/types';

// Platform Abstraction
export { PlatformManager, platformManager } from './platform/PlatformManager';
export { WebAdapter } from './platform/WebAdapter';
export type { PlatformAdapter, PlatformCapabilities, CrossPlatformConfig } from './platform/types';

// Extension System
export { ExtensionRegistry, extensionRegistry } from './extensions/ExtensionRegistry';
export type { Extension, ExtensionHook } from './extensions/ExtensionRegistry';

// Future-ready exports for easy integration
export const DevFeatures = {
  ai: {
    DocumentAIService,
    VoiceAIService
  },
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
