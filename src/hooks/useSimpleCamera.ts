
import { useCallback, useEffect } from 'react';
import { useCameraState } from './camera/useCameraState';
import { useCameraStream } from './camera/useCameraStream';
import { useCameraCapture } from './camera/useCameraCapture';
import { useCameraControls } from './camera/useCameraControls';

export const useSimpleCamera = () => {
  const { state, updateState, resetState } = useCameraState();
  const { videoRef, streamRef, checkCameraDevices, createStream, attachStreamToVideo, stopStream } = useCameraStream();
  const { canvasRef, captureImage: captureImageFromVideo } = useCameraCapture();

  const { startCamera, stopCamera, switchCamera } = useCameraControls({
    state,
    updateState,
    resetState,
    stopStream,
    createStream,
    attachStreamToVideo,
    checkCameraDevices,
    streamRef
  });

  const captureImage = useCallback((): string | null => {
    if (!state.isReady || !state.isActive) {
      console.error('Camera not ready for capture', { isReady: state.isReady, isActive: state.isActive });
      return null;
    }

    return captureImageFromVideo(videoRef);
  }, [state.isReady, state.isActive, captureImageFromVideo, videoRef]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        console.log('Cleaning up camera stream on unmount');
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [streamRef]);

  return {
    videoRef,
    canvasRef,
    ...state,
    startCamera,
    stopCamera,
    switchCamera,
    captureImage
  };
};
