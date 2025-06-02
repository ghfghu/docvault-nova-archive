
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { DocumentService } from '@/core/document/documentService';
import { FormValidator } from '@/core/validation/formValidation';

export const useDocumentForm = () => {
  const navigate = useNavigate();
  const { addDocument } = useData();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    docType: '',
    priority: 5,
    notes: '',
    viewingTag: '',
  });
  
  const [images, setImages] = useState<string[]>([]);
  
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const submitDocument = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission attempt:', { 
      name: formData.name, 
      docType: formData.docType, 
      images: images?.length 
    });
    
    // Validate form
    const validation = FormValidator.validateDocumentForm({
      name: formData.name,
      docType: formData.docType,
      images
    });
    
    if (!validation.isValid) {
      // Show first error
      const firstError = Object.values(validation.errors)[0];
      toast({
        title: t('validationError') || 'Validation Error',
        description: firstError,
        variant: "destructive"
      });
      return;
    }
    
    // Create document
    const newDocument = DocumentService.createDocument({
      name: formData.name,
      date: formData.date,
      type: formData.docType,
      priority: formData.priority,
      notes: formData.notes,
      viewingTag: formData.viewingTag,
      images
    });
    
    console.log('Creating document:', newDocument);
    
    // Add document
    if (addDocument) {
      addDocument(newDocument);
      
      toast({
        title: t('documentAdded'),
        description: formData.name.trim()
      });
    }
    
    // Navigate to documents page
    navigate('/documents');
  };
  
  return {
    formData,
    images,
    setImages,
    updateField,
    submitDocument
  };
};
