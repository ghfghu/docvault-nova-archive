import { useCallback } from 'react';

export const useCameraErrorHandling = () => {
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

  return { getErrorMessage };
};