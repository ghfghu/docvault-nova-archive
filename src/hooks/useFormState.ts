
import { useState, useCallback } from 'react';

export interface UseFormStateOptions<T> {
  initialState: T;
  onSubmit?: (data: T) => void;
}

export const useFormState = <T extends Record<string, any>>({ 
  initialState, 
  onSubmit 
}: UseFormStateOptions<T>) => {
  const [formData, setFormData] = useState<T>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
  }, [initialState]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [formData, onSubmit, isSubmitting]);

  return {
    formData,
    updateField,
    resetForm,
    handleSubmit,
    isSubmitting
  };
};
