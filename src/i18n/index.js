import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ar from './locales/ar.json';
import en from './locales/en.json';
import es from './locales/es.json';
import it from './locales/it.json';
import pt from './locales/pt.json';

const supportedLngs = ['en', 'ar', 'es', 'pt', 'it'];

const resources = {
  ar: { translation: ar },
  en: { translation: en },
  es: { translation: es },
  it: { translation: it },
  pt: { translation: pt },
};

const getDefaultLng = () => {
  try {
    const stored = localStorage.getItem('i18nextLng');
    if (stored) {
      const lang = stored.split('-')[0];
      if (supportedLngs.includes(lang)) return lang;
    }
  } catch {
    // ignore
  }
  const navLng = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
  return supportedLngs.includes(navLng) ? navLng : 'en';
};

i18n.use(LanguageDetector).use(initReactI18next);

let initPromise = null;

export const initI18n = async () => {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const lng = getDefaultLng();
      await i18n.init({
        resources,
        fallbackLng: 'en',
        lng,
        interpolation: { escapeValue: false },
        keySeparator: false,
      });
    } catch (err) {
      console.warn('initI18n fallback triggered:', err);
    }
  })();
  return initPromise;
};

export default i18n;
