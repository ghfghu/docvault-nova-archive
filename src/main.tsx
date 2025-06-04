
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeMobileSplash } from './mobile/splash'

// Initialize mobile features
initializeMobileSplash();

createRoot(document.getElementById("root")!).render(<App />);
