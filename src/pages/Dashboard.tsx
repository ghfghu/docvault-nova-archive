
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Camera, Files, Users, BarChart3, Clock } from 'lucide-react';
import Layout from '@/components/Layout';

const Dashboard = () => {
  const { user } = useAuth();
  const { documents, wantedPersons } = useData();

  // Quick stats
  const totalDocuments = documents.length;
  const totalWanted = wantedPersons.length;
  const recentDocuments = documents.slice(0, 3); // Get 3 most recent

  // Get last activity timestamp
  const getLastActivityDate = () => {
    const allItems = [
      ...documents.map(d => ({ date: d.createdAt })),
      ...wantedPersons.map(w => ({ date: w.createdAt }))
    ];
    
    if (allItems.length === 0) return 'No activity yet';
    
    allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastDate = new Date(allItems[0].date);
    
    return lastDate.toLocaleString();
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gradient">
            Welcome, <span className="text-docvault-accent">{user?.username}</span>
          </h1>
          <p className="text-docvault-gray mt-2">
            Manage your documents and database securely
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Quick Stats Cards */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Files className="mr-2 text-docvault-accent" size={20} />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{totalDocuments}</p>
            </CardContent>
            <CardFooter>
              <Link to="/documents" className="w-full">
                <Button variant="outline" className="w-full border-docvault-accent/30 hover:bg-docvault-accent/20">
                  View All
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 text-docvault-accent" size={20} />
                Wanted Persons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{totalWanted}</p>
            </CardContent>
            <CardFooter>
              <Link to="/wanted" className="w-full">
                <Button variant="outline" className="w-full border-docvault-accent/30 hover:bg-docvault-accent/20">
                  View Database
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 text-docvault-accent" size={20} />
                Last Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{getLastActivityDate()}</p>
            </CardContent>
            <CardFooter>
              <Link to="/reports" className="w-full">
                <Button variant="outline" className="w-full border-docvault-accent/30 hover:bg-docvault-accent/20">
                  View Reports
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Camera className="mr-2 text-docvault-accent" size={20} />
                Scan Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Quickly scan a new document</p>
            </CardContent>
            <CardFooter>
              <Link to="/scan" className="w-full">
                <Button className="w-full bg-docvault-accent hover:bg-docvault-accent/80">
                  Scan Now
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>Recently scanned documents</CardDescription>
            </CardHeader>
            <CardContent>
              {recentDocuments.length > 0 ? (
                <div className="space-y-4">
                  {recentDocuments.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="p-3 rounded-md bg-docvault-dark border border-docvault-accent/10 hover:border-docvault-accent/30 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          <p className="text-xs text-docvault-gray">
                            {new Date(doc.date).toLocaleDateString()} • {doc.type}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-docvault-accent/20 text-docvault-accent">
                          Priority: {doc.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-docvault-gray">
                  <p>No documents yet</p>
                  <Link to="/scan" className="text-docvault-accent text-sm mt-2 inline-block">
                    Scan your first document
                  </Link>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link to="/documents" className="w-full">
                <Button variant="outline" className="w-full border-docvault-accent/30">
                  View All Documents
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Quick Actions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/scan" className="w-full">
                  <Button className="w-full bg-docvault-accent hover:bg-docvault-accent/80 h-24 flex flex-col">
                    <Camera size={28} className="mb-2" />
                    <span>Scan Document</span>
                  </Button>
                </Link>
                
                <Link to="/wanted" className="w-full">
                  <Button variant="outline" className="w-full border-docvault-accent/30 h-24 flex flex-col">
                    <Users size={28} className="mb-2" />
                    <span>Wanted Database</span>
                  </Button>
                </Link>
                
                <Link to="/reports" className="w-full">
                  <Button variant="outline" className="w-full border-docvault-accent/30 h-24 flex flex-col">
                    <BarChart3 size={28} className="mb-2" />
                    <span>View Reports</span>
                  </Button>
                </Link>
                
                <Link to="/settings" className="w-full">
                  <Button variant="outline" className="w-full border-docvault-accent/30 h-24 flex flex-col">
                    <Files size={28} className="mb-2" />
                    <span>Manage Data</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
