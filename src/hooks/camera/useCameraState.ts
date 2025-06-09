
import { useState, useCallback } from 'react';

export interface CameraState {
  isActive: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  isReady: boolean;
  canSwitchCamera: boolean;
  facingMode: 'environment' | 'user';
}

export const useCameraState = () => {
  const [state, setState] = useState<CameraState>({
    isActive: false,
    isLoading: false,
    hasError: false,
    errorMessage: '',
    isReady: false,
    canSwitchCamera: false,
    facingMode: 'environment'
  });

  const updateState = useCallback((updates: Partial<CameraState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      isActive: false,
      isLoading: false,
      hasError: false,
      errorMessage: '',
      isReady: false,
      canSwitchCamera: false,
      facingMode: 'environment'
    });
  }, []);

  return {
    state,
    updateState,
    resetState
  };
};
