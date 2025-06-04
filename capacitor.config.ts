
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b82ac8102632465ba3127d567437944c',
  appName: 'docvault-nova-archive',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: "https://b82ac810-2632-465b-a312-7d567437944c.lovableproject.com?forceHideBadge=true",
    cleartext: true
  }
};

export default config;
