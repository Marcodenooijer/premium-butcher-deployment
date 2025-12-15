import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslations from './locales/en.json';
import nlTranslations from './locales/nl.json';

const resources = {
  en: { translation: enTranslations },
  nl: { translation: nlTranslations }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already protects from XSS
    }
  });

export default i18n;
