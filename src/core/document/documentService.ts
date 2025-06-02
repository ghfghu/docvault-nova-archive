
import { DocumentCreateInput, BaseDocument } from '@/types/document';
import { DocumentValidationResult, DocumentValidationError } from '@/types/document';

export class DocumentService {
  static validateDocument(document: Partial<DocumentCreateInput>): DocumentValidationResult {
    const errors: DocumentValidationError[] = [];
    
    if (!document.name?.trim()) {
      errors.push({ field: 'name', message: 'Document name is required' });
    }
    
    if (!document.type) {
      errors.push({ field: 'type', message: 'Document type is required' });
    }
    
    if (!document.images || document.images.length === 0) {
      errors.push({ field: 'images', message: 'At least one image is required' });
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static createDocument(input: DocumentCreateInput): BaseDocument {
    return {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name: input.name.trim(),
      date: input.date,
      type: input.type,
      priority: Number(input.priority) || 5,
      notes: input.notes?.trim() || '',
      viewingTag: input.viewingTag,
      images: input.images
    };
  }
}
