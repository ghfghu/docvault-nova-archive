
import { useState, useCallback } from 'react';
import { DocumentValidationResult, DocumentValidationError } from '@/types/document';
import { useLanguage } from '@/context/LanguageContext';

interface ValidateDocumentParams {
  name: string;
  docType: string;
  images: string[];
}

export const useDocumentValidation = () => {
  const { t } = useLanguage();
  const [validationErrors, setValidationErrors] = useState<DocumentValidationError[]>([]);

  const validateDocument = useCallback(({ name, docType, images }: ValidateDocumentParams): DocumentValidationResult => {
    const errors: DocumentValidationError[] = [];
    
    if (!name?.trim()) {
      errors.push({ field: 'name', message: t('documentNameRequired') });
    }
    
    if (!docType) {
      errors.push({ field: 'docType', message: t('documentTypeRequired') });
    }
    
    if (!images || images.length === 0) {
      errors.push({ field: 'images', message: t('atLeastOneImageRequired') });
    }
    
    setValidationErrors(errors);
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, [t]);

  const clearValidationErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  return {
    validationErrors,
    validateDocument,
    clearValidationErrors
  };
};
