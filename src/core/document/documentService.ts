
import { DocumentData } from '@/types/camera';

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
  
  static createDocument(data: Omit<DocumentData, 'id' | 'createdAt'>): DocumentData {
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
