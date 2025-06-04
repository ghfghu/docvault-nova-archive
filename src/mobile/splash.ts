
export const initializeMobileSplash = () => {
  // Mobile-specific initialization
  if (window.location.href.includes('capacitor://')) {
    console.log('Running in Capacitor mobile app');
    
    // Hide splash screen after app loads
    setTimeout(() => {
      if (window.navigator?.splashscreen?.hide) {
        window.navigator.splashscreen.hide();
      }
    }, 1000);
  }
};
