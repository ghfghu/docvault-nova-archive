
export const initializeMobileSplash = () => {
  // Only run in Capacitor environment
  if (!window.Capacitor?.isNativePlatform()) {
    return;
  }
  
  console.log('Running in Capacitor mobile app');
  
  // Hide splash screen after app loads
  setTimeout(() => {
    // Use modern Capacitor API
    import('@capacitor/splash-screen').then(({ SplashScreen }) => {
      SplashScreen.hide().catch(() => {
        console.log('Splash screen hide failed - plugin may not be available');
      });
    }).catch(() => {
      console.log('Splash screen plugin not available');
    });
  }, 1000);
};
