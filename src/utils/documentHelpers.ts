
import { BaseDocument } from '@/types/document';

export const sortDocumentsByDate = (documents: BaseDocument[], ascending = false): BaseDocument[] => {
  return [...documents].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });
};

export const filterDocumentsByType = (documents: BaseDocument[], type: string): BaseDocument[] => {
  return documents.filter(doc => doc.type === type);
};

export const searchDocuments = (documents: BaseDocument[], query: string): BaseDocument[] => {
  const lowercaseQuery = query.toLowerCase();
  return documents.filter(doc => 
    doc.name.toLowerCase().includes(lowercaseQuery) ||
    doc.notes.toLowerCase().includes(lowercaseQuery) ||
    doc.type.toLowerCase().includes(lowercaseQuery)
  );
};

export const getDocumentsByPriority = (documents: BaseDocument[], minPriority: number): BaseDocument[] => {
  return documents.filter(doc => doc.priority >= minPriority);
};

export const formatDocumentDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
