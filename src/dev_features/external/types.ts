
export interface ExternalModule {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  type: 'plugin' | 'integration' | 'extension';
  isActive: boolean;
  dependencies: string[];
  permissions: ModulePermission[];
}

export interface ModulePermission {
  type: 'storage' | 'camera' | 'microphone' | 'network' | 'files';
  description: string;
  required: boolean;
}

export interface ModuleConfig {
  moduleId: string;
  settings: Record<string, any>;
  enabled: boolean;
}

export interface ExternalAPI {
  name: string;
  baseUrl: string;
  apiKey?: string;
  headers?: Record<string, string>;
  endpoints: APIEndpoint[];
}

export interface APIEndpoint {
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  parameters: APIParameter[];
}

export interface APIParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ModuleEventData {
  moduleId: string;
  eventType: string;
  payload: any;
  timestamp: number;
}
