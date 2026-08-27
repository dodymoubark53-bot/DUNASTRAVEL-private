const SUPPORTED_LOCALES = new Set(['en', 'ar', 'es', 'pt', 'it']);

export function supportedLocale(language, fallback = 'en') {
  const locale = String(language || '').toLowerCase().split('-')[0];
  return SUPPORTED_LOCALES.has(locale) ? locale : fallback;
}

