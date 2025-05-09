
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Button } from '@/components/ui/button';
import { BarChart3, PieChart as PieChartIcon, Download, Upload } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';

// Colors for the charts
const COLORS = ['#1EAEDB', '#9b87f5', '#D6BCFA', '#3F9EB9', '#6C5CE7', '#8A94FF'];

const Reports = () => {
  const { documents, wantedPersons, exportData, importData } = useData();
  const [activeChart, setActiveChart] = useState<'documents' | 'priority'>('documents');
  
  // Document count by type
  const documentsByType = documents.reduce((acc: { name: string; value: number }[], doc) => {
    const existing = acc.find(item => item.name === doc.type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: doc.type, value: 1 });
    }
    return acc;
  }, []);
  
  // Documents by priority level
  const documentsByPriority = Array.from({ length: 10 }, (_, i) => ({
    priority: i + 1,
    count: documents.filter(doc => doc.priority === i + 1).length
  }));
  
  // Format for tooltip
  const tooltipFormatter = (value: number) => [`${value} documents`, 'Count'];
  
  // Export data as JSON
  const handleExport = () => {
    try {
      const jsonData = exportData();
      
      // Create blob and download link
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `docvault_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data exported",
        description: "Your data has been exported successfully"
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data",
        variant: "destructive"
      });
    }
  };
  
  // Import data from JSON file
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string;
        const success = importData(jsonData);
        
        if (success) {
          toast({
            title: "Data imported",
            description: "Your data has been imported successfully"
          });
        }
      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: "Import failed",
          description: "There was an error importing your data",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
    
    // Reset the input
    e.target.value = '';
  };
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gradient">Reports & Analysis</h1>
          <p className="text-docvault-gray text-sm">
            View statistics and manage your data
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="mr-2 text-docvault-accent" size={20} />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{documents.length}</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <PieChartIcon className="mr-2 text-docvault-accent" size={20} />
                Wanted Persons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{wantedPersons.length}</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle>Document Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={activeChart === 'documents' ? 'default' : 'outline'}
                className={activeChart === 'documents' ? 'bg-docvault-accent' : 'border-docvault-accent/30'}
                onClick={() => setActiveChart('documents')}
              >
                By Type
              </Button>
              <Button
                variant={activeChart === 'priority' ? 'default' : 'outline'}
                className={activeChart === 'priority' ? 'bg-docvault-accent' : 'border-docvault-accent/30'}
                onClick={() => setActiveChart('priority')}
              >
                By Priority
              </Button>
            </div>
            
            {documents.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {activeChart === 'documents' ? (
                    <PieChart>
                      <Pie
                        data={documentsByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {documentsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={tooltipFormatter} />
                      <Legend />
                    </PieChart>
                  ) : (
                    <BarChart data={documentsByPriority}>
                      <XAxis 
                        dataKey="priority" 
                        stroke="#8E9196"
                      />
                      <YAxis 
                        stroke="#8E9196"
                      />
                      <Tooltip formatter={tooltipFormatter} />
                      <Bar 
                        dataKey="count" 
                        name="Documents" 
                        fill="#1EAEDB" 
                        background={{ fill: '#2A2F3C' }}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-docvault-gray">
                <p>No document data available for analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-docvault-gray mb-4">
              Export your data for backup or import previously exported data.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                className="bg-docvault-accent hover:bg-docvault-accent/80"
                onClick={handleExport}
              >
                <Download className="mr-2" size={18} />
                Export Data
              </Button>
              
              <label className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-docvault-accent/30"
                  asChild
                >
                  <div>
                    <Upload className="mr-2" size={18} />
                    Import Data
                    <input
                      type="file"
                      accept="application/json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </div>
                </Button>
              </label>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-docvault-gray">
            <p>
              All data is stored securely on your device. No information is sent to any server.
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
