
declare global {
  interface Navigator {
    splashscreen?: {
      hide(): void;
      show(): void;
    };
  }
  
  interface Window {
    Capacitor?: {
      isNativePlatform(): boolean;
      getPlatform(): string;
    };
  }
}

export {};
