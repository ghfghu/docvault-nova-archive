
import DocumentFormFields from '@/ui/forms/DocumentFormFields';
import { DocumentFormData } from '@/types/document';

interface DocumentFormProps {
  formData: DocumentFormData;
  onFieldChange: (field: keyof DocumentFormData, value: any) => void;
}

const DocumentForm = ({ formData, onFieldChange }: DocumentFormProps) => {
  return <DocumentFormFields formData={formData} onFieldChange={onFieldChange} />;
};

export default DocumentForm;
