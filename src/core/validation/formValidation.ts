
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class FormValidator {
  static validateDocumentForm(data: {
    name: string;
    docType: string;
    images: string[];
  }): ValidationResult {
    const errors: Record<string, string> = {};
    
    if (!data.name?.trim()) {
      errors.name = 'Document name is required';
    }
    
    if (!data.docType) {
      errors.docType = 'Document type is required';
    }
    
    if (!data.images || data.images.length === 0) {
      errors.images = 'At least one image is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
