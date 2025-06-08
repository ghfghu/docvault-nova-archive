
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ScanDocument from "./pages/ScanDocument";
import Documents from "./pages/Documents";
import WantedPersons from "./pages/WantedPersons";
import Reports from "./pages/Reports";
import EnhancedSettings from "./pages/EnhancedSettings";
import AIManagement from "./pages/AIManagement";
import Counter from "./pages/Counter";
import AITraining from "./pages/AITraining";
import Extensions from "./pages/Extensions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <AuthProvider>
              <DataProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/scan" element={<ScanDocument />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/wanted" element={<WantedPersons />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<EnhancedSettings />} />
                  <Route path="/enhanced-settings" element={<EnhancedSettings />} />
                  <Route path="/ai-management" element={<AIManagement />} />
                  <Route path="/counter" element={<Counter />} />
                  <Route path="/ai-training" element={<AITraining />} />
                  <Route path="/extensions" element={<Extensions />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </DataProvider>
            </AuthProvider>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
