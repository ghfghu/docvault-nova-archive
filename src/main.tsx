
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure React is fully loaded before initializing mobile features
const initializeApp = async () => {
  // Initialize mobile features after React is ready
  if (window.Capacitor?.isNativePlatform()) {
    const { initializeMobileSplash } = await import('./mobile/splash');
    initializeMobileSplash();
  }
  
  // Create and render the React app
  createRoot(document.getElementById("root")!).render(<App />);
};

initializeApp();
