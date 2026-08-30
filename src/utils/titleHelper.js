/**
 * Resolve canonical Backend text without consulting a local tour catalogue.
 *
 * The customer application may still receive translation keys from legacy
 * records, so the i18n resolver is retained. Static tour/program title maps
 * are intentionally not used at runtime: the API response is authoritative.
 */
export function resolveLocalizedText(val, t = (key) => key, lang = 'en') {
  if (!val) return '';

  if (typeof val === 'object' && val !== null) {
    return val[lang] || val.en || val.ar || val.es || Object.values(val)[0] || '';
  }

  if (typeof val !== 'string') return String(val);

  const cleanVal = val.trim();
  const safeT = typeof t === 'function' ? t : (k) => k;

  const direct = safeT(cleanVal);
  if (direct && direct !== cleanVal) return direct;

  if (!cleanVal.startsWith('data.')) {
    const dataPrefixed = safeT(`data.${cleanVal}`);
    if (dataPrefixed && dataPrefixed !== `data.${cleanVal}`) return dataPrefixed;
  }

  if (cleanVal.startsWith('data.')) {
    const stripped = cleanVal.replace(/^data\./, '');
    const translatedStripped = safeT(stripped);
    if (translatedStripped && translatedStripped !== stripped) return translatedStripped;
  }

  return cleanVal.startsWith('data.') ? cleanVal.replace(/^data\./, '') : cleanVal;
}

export function resolveTourTitle(tour, t, lang = 'en') {
  if (!tour) return '';
  const safeT = typeof t === 'function' ? t : (k) => k;
  if (tour.titleKey) {
    const translated = safeT(tour.titleKey);
    if (translated && translated !== tour.titleKey) return translated;
  }
  return resolveLocalizedText(tour.title || tour.name || tour.slug, safeT, lang);
}

export function resolveTourOverview(tour, t, lang = 'en') {
  if (!tour) return '';
  const safeT = typeof t === 'function' ? t : (k) => k;
  const val = tour.overview || tour.description || tour.desc || tour.overviewKey;
  return resolveLocalizedText(val, safeT, lang);
}

export function resolveTourDuration(tour, t, lang = 'en') {
  if (!tour) return '';
  const safeT = typeof t === 'function' ? t : (k) => k;
  const val = tour.duration || tour.durationKey;
  return resolveLocalizedText(val, safeT, lang);
}

export default {
  resolveLocalizedText,
  resolveTourTitle,
  resolveTourOverview,
  resolveTourDuration,
};
