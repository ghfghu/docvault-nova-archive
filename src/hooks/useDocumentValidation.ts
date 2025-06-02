
import { useState, useCallback } from 'react';
import { DocumentValidationResult, DocumentValidationError } from '@/types/document';

interface ValidateDocumentParams {
  name: string;
  docType: string;
  images: string[];
}

export const useDocumentValidation = () => {
  const [validationErrors, setValidationErrors] = useState<DocumentValidationError[]>([]);

  const validateDocument = useCallback(({ name, docType, images }: ValidateDocumentParams): DocumentValidationResult => {
    const errors: DocumentValidationError[] = [];
    
    if (!name?.trim()) {
      errors.push({ field: 'name', message: 'Document name is required' });
    }
    
    if (!docType) {
      errors.push({ field: 'docType', message: 'Document type is required' });
    }
    
    if (!images || images.length === 0) {
      errors.push({ field: 'images', message: 'At least one image is required' });
    }
    
    setValidationErrors(errors);
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const clearValidationErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  return {
    validationErrors,
    validateDocument,
    clearValidationErrors
  };
};
