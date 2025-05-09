
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define available languages
export type LanguageType = 'en' | 'ar';

// Define translation schema
interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

// Define the translations
const translations: Translations = {
  appName: {
    en: 'DocVault',
    ar: 'وثائق الخزانة'
  },
  tagline: {
    en: 'Secure Document Archiving',
    ar: 'أرشفة الوثائق الآمنة'
  },
  welcomeBack: {
    en: 'Welcome Back',
    ar: 'مرحبًا بعودتك'
  },
  enterCredentials: {
    en: 'Enter your credentials to continue',
    ar: 'أدخل بيانات الاعتماد الخاصة بك للمتابعة'
  },
  username: {
    en: 'Username',
    ar: 'اسم المستخدم'
  },
  password: {
    en: 'Password',
    ar: 'كلمة المرور'
  },
  signIn: {
    en: 'Sign In',
    ar: 'تسجيل الدخول'
  },
  signingIn: {
    en: 'Signing in...',
    ar: 'جاري تسجيل الدخول...'
  },
  createAccount: {
    en: 'Create Account',
    ar: 'إنشاء حساب'
  },
  createNewAccount: {
    en: 'Create a new account to get started',
    ar: 'أنشئ حسابًا جديدًا للبدء'
  },
  chooseUsername: {
    en: 'Choose Username',
    ar: 'اختر اسم المستخدم'
  },
  createPassword: {
    en: 'Create Password',
    ar: 'إنشاء كلمة المرور'
  },
  creatingAccount: {
    en: 'Creating account...',
    ar: 'جاري إنشاء الحساب...'
  },
  appInfo: {
    en: 'DocVault - Secure Document Archiving',
    ar: 'وثائق الخزانة - أرشفة الوثائق الآمنة'
  },
  dataStorage: {
    en: 'All data is stored securely on your device',
    ar: 'يتم تخزين جميع البيانات بشكل آمن على جهازك'
  },
  home: {
    en: 'Home',
    ar: 'الرئيسية'
  },
  scan: {
    en: 'Scan',
    ar: 'مسح'
  },
  documents: {
    en: 'Documents',
    ar: 'الوثائق'
  },
  wanted: {
    en: 'Wanted',
    ar: 'مطلوبين'
  },
  reports: {
    en: 'Reports',
    ar: 'التقارير'
  },
  settings: {
    en: 'Settings',
    ar: 'الإعدادات'
  },
  language: {
    en: 'Language',
    ar: 'اللغة'
  },
  english: {
    en: 'English',
    ar: 'الإنجليزية'
  },
  arabic: {
    en: 'Arabic',
    ar: 'العربية'
  },
  scanDocument: {
    en: 'Scan Document',
    ar: 'مسح المستند'
  },
  captureDocument: {
    en: 'Capture and document important information',
    ar: 'التقاط وتوثيق المعلومات المهمة'
  },
  cameraCapture: {
    en: 'Camera Capture',
    ar: 'التقاط الكاميرا'
  },
  startCamera: {
    en: 'Start Camera',
    ar: 'تشغيل الكاميرا'
  },
  enableFlash: {
    en: 'Enable Flash',
    ar: 'تفعيل الفلاش'
  },
  disableFlash: {
    en: 'Disable Flash',
    ar: 'تعطيل الفلاش'
  },
  capture: {
    en: 'Capture',
    ar: 'التقاط'
  },
  imageCaptured: {
    en: 'Image captured',
    ar: 'تم التقاط الصورة'
  },
  ofImages: {
    en: 'of 2 images captured',
    ar: 'من 2 صور تم التقاطها'
  },
  addAnotherImage: {
    en: 'Add another image',
    ar: 'إضافة صورة أخرى'
  },
  documentInfo: {
    en: 'Document Information',
    ar: 'معلومات المستند'
  },
  documentName: {
    en: 'Document Name',
    ar: 'اسم المستند'
  },
  enterDocumentName: {
    en: 'Enter document name',
    ar: 'أدخل اسم المستند'
  },
  date: {
    en: 'Date',
    ar: 'التاريخ'
  },
  documentType: {
    en: 'Document Type',
    ar: 'نوع المستند'
  },
  selectType: {
    en: 'Select type',
    ar: 'اختر النوع'
  },
  priority: {
    en: 'Priority (1-10)',
    ar: 'الأولوية (1-10)'
  },
  viewingTag: {
    en: 'Viewing Tag (Optional)',
    ar: 'علامة العرض (اختياري)'
  },
  selectTag: {
    en: 'Select tag',
    ar: 'اختر العلامة'
  },
  observationNotes: {
    en: 'Observation Notes',
    ar: 'ملاحظات المراقبة'
  },
  enterNotes: {
    en: 'Enter any additional notes or observations',
    ar: 'أدخل أي ملاحظات أو مشاهدات إضافية'
  },
  cancel: {
    en: 'Cancel',
    ar: 'إلغاء'
  },
  saveDocument: {
    en: 'Save Document',
    ar: 'حفظ المستند'
  },
  noImages: {
    en: 'No images',
    ar: 'لا توجد صور'
  },
  captureImageFirst: {
    en: 'Please capture at least one image before saving',
    ar: 'يرجى التقاط صورة واحدة على الأقل قبل الحفظ'
  },
  cameraError: {
    en: 'Camera Error',
    ar: 'خطأ في الكاميرا'
  },
  cameraPermissionError: {
    en: 'Could not access your camera. Please check permissions.',
    ar: 'تعذر الوصول إلى الكاميرا. يرجى التحقق من الأذونات.'
  },
  flashNotSupported: {
    en: 'Flash not supported',
    ar: 'الفلاش غير مدعوم'
  },
  deviceNoFlash: {
    en: 'Your device camera does not support flash control',
    ar: 'كاميرا جهازك لا تدعم التحكم في الفلاش'
  }
};

// Create the context
interface LanguageContextType {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create provider
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageType>('en');

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create custom hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
