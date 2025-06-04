
export interface AIModel {
  id: string;
  name: string;
  type: 'text' | 'vision' | 'speech' | 'embedding';
  provider: 'huggingface' | 'tensorflow' | 'elevenlabs' | 'custom';
  isLoaded: boolean;
  capabilities: AICapability[];
}

export interface AICapability {
  name: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
}

export interface AIRequest {
  modelId: string;
  input: any;
  options?: Record<string, any>;
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  confidence?: number;
  processingTime: number;
}

export interface DocumentAnalysisResult {
  extractedText: string;
  documentType: string;
  confidence: number;
  entities: ExtractedEntity[];
  summary?: string;
}

export interface ExtractedEntity {
  type: 'person' | 'date' | 'id' | 'address' | 'organization';
  value: string;
  confidence: number;
  position: { start: number; end: number };
}

export interface VoiceCommand {
  command: string;
  parameters: Record<string, any>;
  confidence: number;
}
