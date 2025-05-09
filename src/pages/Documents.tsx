
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Camera, 
  Search, 
  Filter, 
  Grid, 
  List, 
  SlidersHorizontal,
  ChevronDown,
  Share2,
  File,
  Trash,
  Eye
} from 'lucide-react';
import { useData, Document } from '@/context/DataContext';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';

const Documents = () => {
  const { documents, deleteDocument } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [displayDocuments, setDisplayDocuments] = useState<Document[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  
  // Get all unique document types
  const documentTypes = ['All Types', ...new Set(documents.map(doc => doc.type))];
  
  // Filter and sort documents
  useEffect(() => {
    let filtered = [...documents];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (selectedType && selectedType !== 'All Types') {
      filtered = filtered.filter(doc => doc.type === selectedType);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'priority-asc':
        filtered.sort((a, b) => a.priority - b.priority);
        break;
      case 'priority-desc':
        filtered.sort((a, b) => b.priority - a.priority);
        break;
      default:
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    setDisplayDocuments(filtered);
  }, [documents, searchTerm, selectedType, sortBy]);
  
  // Delete document handler
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument(id);
    }
  };
  
  // Share document
  const handleShare = (doc: Document) => {
    // In a real app, we would use the Web Share API
    // For now, we'll just show a toast
    toast({
      title: "Share Document",
      description: `Sharing ${doc.name} is not implemented in this demo`
    });
  };
  
  // View document
  const viewDocument = (doc: Document) => {
    // In the full app, this would open a detailed view
    toast({
      title: "View Document",
      description: `Viewing details for ${doc.name}`
    });
  };
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gradient">Documents</h1>
            <p className="text-docvault-gray text-sm">
              {displayDocuments.length} document{displayDocuments.length !== 1 ? 's' : ''} in archive
            </p>
          </div>
          
          <Link to="/scan">
            <Button className="mt-2 sm:mt-0 bg-docvault-accent hover:bg-docvault-accent/80">
              <Camera className="mr-2" size={18} />
              Scan New
            </Button>
          </Link>
        </header>
        
        <Card className="glass-card mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-3 justify-between">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-docvault-gray" size={18} />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-docvault-dark/50 border-docvault-accent/30"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {/* Filter by Type */}
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[130px] bg-docvault-dark/50 border-docvault-accent/30">
                    <Filter size={16} className="mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Sort By */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[130px] bg-docvault-dark/50 border-docvault-accent/30">
                    <SlidersHorizontal size={16} className="mr-2" />
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="priority-desc">Highest Priority</SelectItem>
                    <SelectItem value="priority-asc">Lowest Priority</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* View Mode */}
                <div className="flex border border-docvault-accent/30 rounded-md overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    className={`h-10 px-3 rounded-none ${viewMode === 'grid' ? 'bg-docvault-accent' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={16} />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    className={`h-10 px-3 rounded-none ${viewMode === 'list' ? 'bg-docvault-accent' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {displayDocuments.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
            {displayDocuments.map((doc) => (
              viewMode === 'grid' ? (
                <Card key={doc.id} className="glass-card overflow-hidden hover:border-docvault-accent/50 transition-all">
                  <div className="aspect-video overflow-hidden bg-black relative">
                    {doc.images.length > 0 ? (
                      <img 
                        src={doc.images[0]} 
                        alt={doc.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-docvault-dark">
                        <File size={40} className="text-docvault-accent/50" />
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/50 backdrop-blur-md rounded-full">
                            <ChevronDown size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="glass-card">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-docvault-accent/20" />
                          <DropdownMenuItem onClick={() => viewDocument(doc)}>
                            <Eye size={16} className="mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(doc)}>
                            <Share2 size={16} className="mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(doc.id)}
                            className="text-red-400"
                          >
                            <Trash size={16} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium truncate">{doc.name}</h3>
                      <span 
                        className="px-2 py-0.5 text-xs rounded-full" 
                        style={{
                          backgroundColor: `rgba(30, 174, 219, ${doc.priority / 20})`,
                          boxShadow: `0 0 ${doc.priority * 1}px rgba(30, 174, 219, ${doc.priority / 10})`
                        }}
                      >
                        {doc.priority}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-docvault-gray">
                      <span>{doc.type}</span>
                      <span>{new Date(doc.date).toLocaleDateString()}</span>
                    </div>
                    
                    {doc.viewingTag && (
                      <div className="mt-2">
                        <span className="text-xs px-2 py-0.5 bg-docvault-accent/20 text-docvault-accent rounded-full">
                          {doc.viewingTag}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div 
                  key={doc.id} 
                  className="flex items-center p-3 glass-card rounded-lg hover:border-docvault-accent/50 transition-all"
                >
                  <div className="w-16 h-16 mr-4 overflow-hidden bg-black rounded-md flex-shrink-0">
                    {doc.images.length > 0 ? (
                      <img 
                        src={doc.images[0]} 
                        alt={doc.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-docvault-dark">
                        <File size={24} className="text-docvault-accent/50" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{doc.name}</h3>
                      <span 
                        className="ml-2 px-2 py-0.5 text-xs rounded-full flex-shrink-0" 
                        style={{
                          backgroundColor: `rgba(30, 174, 219, ${doc.priority / 20})`,
                          boxShadow: `0 0 ${doc.priority * 1}px rgba(30, 174, 219, ${doc.priority / 10})`
                        }}
                      >
                        P{doc.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-xs text-docvault-gray mt-1">
                      <span className="mr-3">{doc.type}</span>
                      <span>{new Date(doc.date).toLocaleDateString()}</span>
                      {doc.viewingTag && (
                        <span className="ml-3 px-2 py-0.5 bg-docvault-accent/20 text-docvault-accent rounded-full">
                          {doc.viewingTag}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => viewDocument(doc)}
                    >
                      <Eye size={16} />
                    </Button>
                    
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => handleShare(doc)}
                    >
                      <Share2 size={16} />
                    </Button>
                    
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-red-400"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <Card className="glass-card p-8 text-center">
            <div className="flex flex-col items-center">
              <File size={48} className="text-docvault-accent/50 mb-4" />
              <h3 className="text-xl font-bold text-gradient mb-2">No Documents Found</h3>
              <p className="text-docvault-gray mb-4">
                {searchTerm || selectedType !== '' ? 
                  'No documents match your search criteria.' : 
                  'Your document archive is empty.'}
              </p>
              {searchTerm || selectedType !== '' ? (
                <Button 
                  variant="outline" 
                  className="border-docvault-accent/30"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('');
                  }}
                >
                  Clear Filters
                </Button>
              ) : (
                <Link to="/scan">
                  <Button className="bg-docvault-accent hover:bg-docvault-accent/80">
                    <Camera className="mr-2" size={18} />
                    Scan Your First Document
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Documents;
