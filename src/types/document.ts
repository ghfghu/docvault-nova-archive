
export interface BaseDocument {
  id: string;
  name: string;
  date: string;
  type: string;
  priority: number;
  notes: string;
  viewingTag?: string;
  images: string[];
  createdAt: string;
}

export interface DocumentFormData {
  name: string;
  date: string;
  docType: string;
  priority: number;
  notes: string;
  viewingTag: string;
}

export interface DocumentValidationError {
  field: string;
  message: string;
}

export interface DocumentValidationResult {
  isValid: boolean;
  errors: DocumentValidationError[];
}

export interface DocumentCreateInput {
  name: string;
  date: string;
  type: string;
  priority: number;
  notes: string;
  viewingTag?: string;
  images: string[];
}
