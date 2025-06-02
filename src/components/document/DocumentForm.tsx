
import DocumentFormFields from '@/ui/forms/DocumentFormFields';

interface DocumentFormProps {
  formData: {
    name: string;
    date: string;
    docType: string;
    priority: number;
    notes: string;
    viewingTag: string;
  };
  onFieldChange: (field: string, value: any) => void;
}

const DocumentForm = ({ formData, onFieldChange }: DocumentFormProps) => {
  return <DocumentFormFields formData={formData} onFieldChange={onFieldChange} />;
};

export default DocumentForm;
