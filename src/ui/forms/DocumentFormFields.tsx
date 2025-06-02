
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { documentTypes, viewingTags } from '@/types/camera';
import { DocumentFormData } from '@/types/document';

interface DocumentFormFieldsProps {
  formData: DocumentFormData;
  onFieldChange: (field: keyof DocumentFormData, value: any) => void;
}

const DocumentFormFields = ({ formData, onFieldChange }: DocumentFormFieldsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="name">{t('documentName')}</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onFieldChange('name', e.target.value)}
            placeholder={t('enterDocumentName')}
            className="bg-docvault-dark/50 border-docvault-accent/30"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">{t('date')}</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => onFieldChange('date', e.target.value)}
              className="bg-docvault-dark/50 border-docvault-accent/30"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="docType">{t('documentType')} *</Label>
            <Select value={formData.docType} onValueChange={(value) => onFieldChange('docType', value)} required>
              <SelectTrigger className="bg-docvault-dark/50 border-docvault-accent/30">
                <SelectValue placeholder={t('selectType')} />
              </SelectTrigger>
              <SelectContent className="bg-docvault-dark border-docvault-accent/30 z-50">
                {documentTypes.map((type) => (
                  <SelectItem 
                    key={type} 
                    value={type}
                    className="hover:bg-docvault-accent/20 focus:bg-docvault-accent/20"
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priority">{t('priority')}</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="priority"
                type="number"
                value={formData.priority}
                onChange={(e) => onFieldChange('priority', Number(e.target.value))}
                min={1}
                max={10}
                className="bg-docvault-dark/50 border-docvault-accent/30"
              />
              
              <div className="w-8 h-8 flex items-center justify-center rounded-full" style={{
                backgroundColor: `rgba(30, 174, 219, ${formData.priority / 10})`,
                boxShadow: `0 0 ${formData.priority * 2}px rgba(30, 174, 219, ${formData.priority / 10})`
              }}>
                {formData.priority}
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="viewingTag">{t('viewingTag')}</Label>
            <Select value={formData.viewingTag} onValueChange={(value) => onFieldChange('viewingTag', value)}>
              <SelectTrigger className="bg-docvault-dark/50 border-docvault-accent/30">
                <SelectValue placeholder={t('selectTag')} />
              </SelectTrigger>
              <SelectContent className="bg-docvault-dark border-docvault-accent/30 z-50">
                {viewingTags.map((tag) => (
                  <SelectItem 
                    key={tag} 
                    value={tag}
                    className="hover:bg-docvault-accent/20 focus:bg-docvault-accent/20"
                  >
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="notes">{t('observationNotes')}</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => onFieldChange('notes', e.target.value)}
            placeholder={t('enterNotes')}
            className="bg-docvault-dark/50 border-docvault-accent/30 min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentFormFields;
