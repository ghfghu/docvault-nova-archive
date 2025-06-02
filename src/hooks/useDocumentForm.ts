
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { useDocumentValidation } from '@/hooks/useDocumentValidation';
import { useDocumentOperations } from '@/hooks/useDocumentOperations';
import { useFormState } from '@/hooks/useFormState';
import { DocumentFormData } from '@/types/document';

const initialFormData: DocumentFormData = {
  name: '',
  date: new Date().toISOString().split('T')[0],
  docType: '',
  priority: 5,
  notes: '',
  viewingTag: '',
};

export const useDocumentForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [images, setImages] = useState<string[]>([]);
  
  const { validateDocument } = useDocumentValidation();
  const { createDocument, saveDocument } = useDocumentOperations();
  
  const handleFormSubmit = (formData: DocumentFormData) => {
    console.log('Form submission attempt:', { 
      name: formData.name, 
      docType: formData.docType, 
      images: images?.length 
    });
    
    // Validate form
    const validation = validateDocument({
      name: formData.name,
      docType: formData.docType,
      images
    });
    
    if (!validation.isValid) {
      // Show first error
      const firstError = validation.errors[0];
      toast({
        title: t('validationError') || 'Validation Error',
        description: firstError.message,
        variant: "destructive"
      });
      return;
    }
    
    // Create document
    const newDocument = createDocument({
      name: formData.name,
      date: formData.date,
      type: formData.docType,
      priority: formData.priority,
      notes: formData.notes,
      viewingTag: formData.viewingTag,
      images
    });
    
    console.log('Creating document:', newDocument);
    
    // Save document
    saveDocument(newDocument);
    
    toast({
      title: t('documentAdded'),
      description: formData.name.trim()
    });
    
    // Navigate to documents page
    navigate('/documents');
  };
  
  const { formData, updateField, handleSubmit } = useFormState({
    initialState: initialFormData,
    onSubmit: handleFormSubmit
  });
  
  return {
    formData,
    images,
    setImages,
    updateField,
    submitDocument: handleSubmit
  };
};
