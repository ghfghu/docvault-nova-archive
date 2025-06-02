
import { useCallback } from 'react';
import { useData } from '@/context/DataContext';
import { DocumentService } from '@/core/document/documentService';
import { DocumentCreateInput, BaseDocument } from '@/types/document';

export const useDocumentOperations = () => {
  const { addDocument, deleteDocument } = useData();

  const createDocument = useCallback((input: DocumentCreateInput): BaseDocument => {
    return DocumentService.createDocument(input);
  }, []);

  const saveDocument = useCallback((document: BaseDocument) => {
    addDocument(document);
  }, [addDocument]);

  const removeDocument = useCallback((id: string) => {
    deleteDocument(id);
  }, [deleteDocument]);

  return {
    createDocument,
    saveDocument,
    removeDocument
  };
};
