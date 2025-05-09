
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, UserPlus, User, X, Camera, Trash, Edit } from 'lucide-react';
import { useData, WantedPerson } from '@/context/DataContext';
import Layout from '@/components/Layout';

const WantedPersons = () => {
  const { wantedPersons, addWantedPerson, updateWantedPerson, deleteWantedPerson } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [displayPersons, setDisplayPersons] = useState<WantedPerson[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<WantedPerson | null>(null);
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [documentNumber, setDocumentNumber] = useState('');
  const [notes, setNotes] = useState('');
  
  // Filter persons
  useEffect(() => {
    let filtered = [...wantedPersons];
    
    if (searchTerm) {
      filtered = filtered.filter(person => 
        person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (person.documentNumber && person.documentNumber.includes(searchTerm)) ||
        (person.notes && person.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Sort by name
    filtered.sort((a, b) => a.fullName.localeCompare(b.fullName));
    
    setDisplayPersons(filtered);
  }, [wantedPersons, searchTerm]);
  
  // Reset form
  const resetForm = () => {
    setFullName('');
    setPhoto(undefined);
    setDocumentNumber('');
    setNotes('');
    setEditingPerson(null);
  };
  
  // Open dialog for creating a new person
  const openNewPersonDialog = () => {
    resetForm();
    setDialogOpen(true);
  };
  
  // Open dialog for editing a person
  const openEditPersonDialog = (person: WantedPerson) => {
    setEditingPerson(person);
    setFullName(person.fullName);
    setPhoto(person.photo);
    setDocumentNumber(person.documentNumber || '');
    setNotes(person.notes || '');
    setDialogOpen(true);
  };
  
  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
    resetForm();
  };
  
  // Handle photo capture/upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Clear photo
  const clearPhoto = () => {
    setPhoto(undefined);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName) return;
    
    const personData = {
      fullName,
      photo,
      documentNumber: documentNumber || undefined,
      notes: notes || undefined,
    };
    
    if (editingPerson) {
      updateWantedPerson(editingPerson.id, personData);
    } else {
      addWantedPerson(personData);
    }
    
    handleDialogClose();
  };
  
  // Delete person
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this person?')) {
      deleteWantedPerson(id);
    }
  };
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gradient">Wanted Persons</h1>
            <p className="text-docvault-gray text-sm">
              {displayPersons.length} person{displayPersons.length !== 1 ? 's' : ''} in database
            </p>
          </div>
          
          <Button 
            className="mt-2 sm:mt-0 bg-docvault-accent hover:bg-docvault-accent/80"
            onClick={openNewPersonDialog}
          >
            <UserPlus className="mr-2" size={18} />
            Add Person
          </Button>
        </header>
        
        <Card className="glass-card mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-docvault-gray" size={18} />
              <Input
                placeholder="Search by name, ID or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-docvault-dark/50 border-docvault-accent/30"
              />
            </div>
          </CardContent>
        </Card>
        
        {displayPersons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayPersons.map((person) => (
              <Card key={person.id} className="glass-card overflow-hidden hover:border-docvault-accent/50 transition-all">
                <div className="h-48 overflow-hidden bg-docvault-dark relative flex items-center justify-center">
                  {person.photo ? (
                    <img 
                      src={person.photo} 
                      alt={person.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={80} className="text-docvault-accent/30" />
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg mb-1">{person.fullName}</h3>
                  
                  {person.documentNumber && (
                    <div className="mb-2 text-sm text-docvault-gray">
                      <span className="font-semibold">ID:</span> {person.documentNumber}
                    </div>
                  )}
                  
                  {person.notes && (
                    <div className="text-sm text-docvault-gray line-clamp-2">
                      {person.notes}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-end space-x-2 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-docvault-accent/30"
                    onClick={() => openEditPersonDialog(person)}
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(person.id)}
                  >
                    <Trash size={16} className="mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass-card p-8 text-center">
            <div className="flex flex-col items-center">
              <User size={48} className="text-docvault-accent/50 mb-4" />
              <h3 className="text-xl font-bold text-gradient mb-2">No Persons Found</h3>
              <p className="text-docvault-gray mb-4">
                {searchTerm ? 
                  'No persons match your search criteria.' : 
                  'Your wanted persons database is empty.'}
              </p>
              {searchTerm ? (
                <Button 
                  variant="outline" 
                  className="border-docvault-accent/30"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              ) : (
                <Button 
                  className="bg-docvault-accent hover:bg-docvault-accent/80"
                  onClick={openNewPersonDialog}
                >
                  <UserPlus className="mr-2" size={18} />
                  Add First Person
                </Button>
              )}
            </div>
          </Card>
        )}
        
        {/* Add/Edit Person Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="glass-card sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPerson ? 'Edit Person' : 'Add Person'}
              </DialogTitle>
              <DialogDescription>
                {editingPerson ? 
                  'Update information for this person' : 
                  'Add a new person to the wanted database'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="bg-docvault-dark/50 border-docvault-accent/30"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Photo (Optional)</Label>
                  
                  {photo ? (
                    <div className="relative h-48 rounded-md overflow-hidden">
                      <img 
                        src={photo} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={clearPhoto}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 bg-docvault-dark/50 rounded-md">
                      <label 
                        htmlFor="photoUpload" 
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <Camera size={40} className="text-docvault-accent mb-2" />
                        <span className="text-sm">Upload Photo</span>
                        <input
                          id="photoUpload"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="documentNumber">Document/ID Number (Optional)</Label>
                  <Input
                    id="documentNumber"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    placeholder="Enter ID number"
                    className="bg-docvault-dark/50 border-docvault-accent/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter additional notes or description"
                    className="bg-docvault-dark/50 border-docvault-accent/30 min-h-[100px]"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-docvault-accent/30"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-docvault-accent hover:bg-docvault-accent/80">
                  {editingPerson ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default WantedPersons;
