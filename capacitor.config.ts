
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b82ac8102632465ba3127d567437944c',
  appName: 'docvault-nova-archive',
  webDir: 'dist',
  bundledWebRuntime: false,
  // Removed server config for offline operation
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1a1a2e",
      showSpinner: false
    },
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;
