
import { enTranslations } from './en';
import { arTranslations } from './ar';

// Export all translations in a single object
export const translations = {
  en: enTranslations,
  ar: arTranslations,
};

// Define type for language code
export type LanguageCode = 'en' | 'ar';

// Define type for translation keys
export type TranslationKey = keyof typeof enTranslations;
