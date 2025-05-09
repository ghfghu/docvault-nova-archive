
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
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="name">Document Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter document name"
            className="bg-docvault-dark/50 border-docvault-accent/30"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
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
            <Label htmlFor="docType">Document Type</Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger className="bg-docvault-dark/50 border-docvault-accent/30">
                <SelectValue placeholder="Select type" />
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
            <Label htmlFor="priority">Priority (1-10)</Label>
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
            <Label htmlFor="viewingTag">Viewing Tag (Optional)</Label>
            <Select value={viewingTag} onValueChange={setViewingTag}>
              <SelectTrigger className="bg-docvault-dark/50 border-docvault-accent/30">
                <SelectValue placeholder="Select tag" />
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
          <Label htmlFor="notes">Observation Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any additional notes or observations"
            className="bg-docvault-dark/50 border-docvault-accent/30 min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentForm;
