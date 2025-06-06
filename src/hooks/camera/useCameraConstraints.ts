
import { useCallback } from 'react';

export const useCameraConstraints = () => {
  const getCameraConstraints = useCallback(() => {
    const baseConstraints = {
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920, min: 640 },
        height: { ideal: 1080, min: 480 },
        aspectRatio: { ideal: 16/9 }
      },
      audio: false
    };

    // Add mobile-specific constraints
    if (window.Capacitor?.isNativePlatform()) {
      return {
        ...baseConstraints,
        video: {
          ...baseConstraints.video,
          frameRate: { ideal: 30, max: 30 }
        }
      };
    }

    return baseConstraints;
  }, []);

  return { getCameraConstraints };
};
