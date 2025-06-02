
import { DocumentData } from '@/types/camera';

// Import the Document type from DataContext since it includes id and createdAt
type Document = DocumentData & {
  id: string;
  createdAt: string;
};

export class DocumentService {
  static validateDocument(document: Partial<DocumentData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!document.name?.trim()) {
      errors.push('Document name is required');
    }
    
    if (!document.type) {
      errors.push('Document type is required');
    }
    
    if (!document.images || document.images.length === 0) {
      errors.push('At least one image is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static createDocument(data: Omit<DocumentData, 'id' | 'createdAt'>): Document {
    return {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name: data.name.trim(),
      date: data.date,
      type: data.type,
      priority: Number(data.priority) || 5,
      notes: data.notes?.trim() || '',
      viewingTag: data.viewingTag,
      images: data.images
    };
  }
}
