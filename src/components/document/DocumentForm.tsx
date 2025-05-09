
import { useState } from 'react';
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
import { documentTypes, viewingTags, DocumentData } from '@/types/camera';

interface DocumentFormProps {
  name: string;
  setName: (name: string) => void;
  date: string;
  setDate: (date: string) => void;
  docType: string;
  setDocType: (type: string) => void;
  priority: number;
  setPriority: (priority: number) => void;
  notes: string;
  setNotes: (notes: string) => void;
  viewingTag: string;
  setViewingTag: (tag: string) => void;
}

const DocumentForm = ({
  name, setName,
  date, setDate,
  docType, setDocType,
  priority, setPriority,
  notes, setNotes,
  viewingTag, setViewingTag
}: DocumentFormProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="name">{t('documentName')}</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-docvault-dark/50 border-docvault-accent/30"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="docType">{t('documentType')}</Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger className="bg-docvault-dark/50 border-docvault-accent/30">
                <SelectValue placeholder={t('selectType')} />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
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
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                min={1}
                max={10}
                className="bg-docvault-dark/50 border-docvault-accent/30"
              />
              
              <div className="w-8 h-8 flex items-center justify-center rounded-full" style={{
                backgroundColor: `rgba(30, 174, 219, ${priority / 10})`,
                boxShadow: `0 0 ${priority * 2}px rgba(30, 174, 219, ${priority / 10})`
              }}>
                {priority}
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="viewingTag">{t('viewingTag')}</Label>
            <Select value={viewingTag} onValueChange={setViewingTag}>
              <SelectTrigger className="bg-docvault-dark/50 border-docvault-accent/30">
                <SelectValue placeholder={t('selectTag')} />
              </SelectTrigger>
              <SelectContent>
                {viewingTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
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
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('enterNotes')}
            className="bg-docvault-dark/50 border-docvault-accent/30 min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentForm;
