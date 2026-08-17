import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const supportedLngs = ['en', 'ar', 'es', 'pt', 'it'];

const localeModules = import.meta.glob('./locales/*.json', { eager: false });

i18n.use(LanguageDetector).use(initReactI18next);

let initPromise = null;

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

export const initI18n = async () => {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const lng = getDefaultLng();
      const loader = localeModules[`./locales/${lng}.json`] || localeModules['./locales/en.json'];
      const mod = loader ? await loader() : { default: {} };
      await i18n.init({
        resources: {
          [lng]: { translation: mod.default || {} },
        },
        fallbackLng: 'en',
        lng,
        interpolation: { escapeValue: false },
        keySeparator: false,
      });
    } catch (err) {
      console.warn('initI18n fallback triggered:', err);
      try {
        await i18n.init({
          fallbackLng: 'en',
          lng: 'en',
          interpolation: { escapeValue: false },
          keySeparator: false,
        });
      } catch {
        // ignore
      }
    }
  })();
  return initPromise;
};

const origChangeLanguage = i18n.changeLanguage.bind(i18n);
i18n.changeLanguage = async (lng, callback) => {
  try {
    if (!i18n.hasResourceBundle(lng, 'translation')) {
      const mod = await localeModules[`./locales/${lng}.json`]();
      i18n.addResourceBundle(lng, 'translation', mod.default);
    }
    return origChangeLanguage(lng, callback);
  } catch (err) {
    console.error('Failed to load locale:', lng, err);
    return origChangeLanguage('en', callback);
  }
};

export default i18n;
