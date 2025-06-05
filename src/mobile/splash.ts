
export const initializeMobileSplash = () => {
  // Mobile-specific initialization
  if (window.Capacitor?.isNativePlatform()) {
    console.log('Running in Capacitor mobile app');
    
    // Hide splash screen after app loads
    setTimeout(() => {
      // Use modern Capacitor API instead of legacy cordova
      import('@capacitor/splash-screen').then(({ SplashScreen }) => {
        SplashScreen.hide();
      }).catch(() => {
        // Fallback for environments without splash screen plugin
        console.log('Splash screen plugin not available');
      });
    }, 1000);
  }
};
