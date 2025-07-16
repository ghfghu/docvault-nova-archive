import { useCallback } from 'react';
import { CameraState } from './useCameraState';
import { useCameraErrorHandling } from './useCameraErrorHandling';

interface UseCameraControlsProps {
  state: CameraState;
  updateState: (updates: Partial<CameraState>) => void;
  resetState: () => void;
  stopStream: () => void;
  createStream: (facingMode: 'environment' | 'user') => Promise<MediaStream>;
  attachStreamToVideo: (stream: MediaStream) => Promise<void>;
  checkCameraDevices: () => Promise<boolean>;
  streamRef: React.MutableRefObject<MediaStream | null>;
}

export const useCameraControls = ({
  state,
  updateState,
  resetState,
  stopStream,
  createStream,
  attachStreamToVideo,
  checkCameraDevices,
  streamRef
}: UseCameraControlsProps) => {
  const { getErrorMessage } = useCameraErrorHandling();

  const startCamera = useCallback(async () => {
    console.log('Starting camera with facingMode:', state.facingMode);
    updateState({ isLoading: true, hasError: false, errorMessage: '', isReady: false });
    
    try {
      // Stop any existing stream
      stopStream();

      // Create new stream
      const stream = await createStream(state.facingMode);
      streamRef.current = stream;
      
      // Attach stream to video
      await attachStreamToVideo(stream);
      
      // Check for multiple cameras
      const canSwitch = await checkCameraDevices();
      
      updateState({ 
        isActive: true, 
        isLoading: false, 
        isReady: true,
        hasError: false,
        errorMessage: '',
        canSwitchCamera: canSwitch
      });
    } catch (error) {
      console.error('Camera initialization failed:', error);
      const errorMessage = getErrorMessage(error as DOMException | Error);
      
      if (error instanceof DOMException && error.name === 'OverconstrainedError') {
        // Retry with user camera
        setTimeout(() => {
          updateState({ facingMode: 'user' });
          startCamera();
        }, 1000);
        return;
      }
      
      updateState({
        isLoading: false,
        hasError: true,
        errorMessage,
        isActive: false,
        isReady: false
      });
    }
  }, [state.facingMode, updateState, stopStream, createStream, attachStreamToVideo, checkCameraDevices, streamRef, getErrorMessage]);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera...');
    stopStream();
    resetState();
  }, [stopStream, resetState]);

  const switchCamera = useCallback(async () => {
    if (!state.canSwitchCamera) {
      console.log('Camera switching not available');
      return;
    }
    
    console.log('Switching camera from', state.facingMode);
    const newFacingMode = state.facingMode === 'environment' ? 'user' : 'environment';
    
    stopCamera();
    
    setTimeout(() => {
      updateState({ facingMode: newFacingMode });
      startCamera();
    }, 500);
  }, [state.canSwitchCamera, state.facingMode, stopCamera, startCamera, updateState]);

  return {
    startCamera,
    stopCamera,
    switchCamera
  };
};