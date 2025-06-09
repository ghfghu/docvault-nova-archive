
import { useCallback, useEffect } from 'react';
import { useCameraState } from './camera/useCameraState';
import { useCameraStream } from './camera/useCameraStream';
import { useCameraCapture } from './camera/useCameraCapture';

export const useSimpleCamera = () => {
  const { state, updateState, resetState } = useCameraState();
  const { videoRef, streamRef, checkCameraDevices, createStream, attachStreamToVideo, stopStream } = useCameraStream();
  const { canvasRef, captureImage: captureImageFromVideo } = useCameraCapture();

  const getErrorMessage = useCallback((error: DOMException | Error) => {
    if (error instanceof DOMException) {
      switch (error.name) {
        case 'NotAllowedError':
          return 'تم رفض إذن الكاميرا. يرجى السماح بالوصول للكاميرا في إعدادات المتصفح وإعادة تحديث الصفحة.';
        case 'NotFoundError':
          return 'لم يتم العثور على كاميرا في هذا الجهاز.';
        case 'NotReadableError':
          return 'الكاميرا قيد الاستخدام من تطبيق آخر. يرجى إغلاق التطبيقات الأخرى التي تستخدم الكاميرا.';
        case 'OverconstrainedError':
          return 'إعدادات الكاميرا غير متوافقة. جاري المحاولة بإعدادات أساسية...';
        default:
          return `خطأ في الكاميرا: ${error.message}`;
      }
    }
    return error.message || 'غير قادر على الوصول للكاميرا';
  }, []);

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
