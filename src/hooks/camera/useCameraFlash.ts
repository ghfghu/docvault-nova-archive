
import { useCallback } from 'react';
import { MediaTrackConstraintsWithTorch } from '@/types/camera';

interface UseCameraFlashProps {
  streamRef: React.RefObject<MediaStream | null>;
  flashSupported: boolean;
  flashEnabled: boolean;
  setFlashEnabled: (enabled: boolean) => void;
}

export const useCameraFlash = ({ streamRef, flashSupported, flashEnabled, setFlashEnabled }: UseCameraFlashProps) => {
  const toggleFlash = useCallback(async () => {
    if (!flashSupported || !streamRef.current) return;

    try {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        const constraints: MediaTrackConstraintsWithTorch = {
          advanced: [{ torch: !flashEnabled }]
        };
        await videoTrack.applyConstraints(constraints);
        setFlashEnabled(!flashEnabled);
        console.log(`Flash ${!flashEnabled ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      console.error('Flash toggle error:', error);
    }
  }, [flashSupported, flashEnabled, setFlashEnabled, streamRef]);

  return { toggleFlash };
};
