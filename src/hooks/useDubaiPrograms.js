import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTours } from './useTours';

function getLocalizedField(fieldObj, locale) {
  if (!fieldObj) return '';
  if (typeof fieldObj === 'string') return fieldObj;
  return fieldObj[locale] || fieldObj.en || fieldObj.ar || Object.values(fieldObj)[0] || '';
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function useDubaiPrograms() {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const locale = ['ar', 'en', 'es', 'pt', 'it'].includes(lang) ? lang : 'en';
  const { tours } = useTours({ destination: 'United Arab Emirates', limit: 100 });

  return useMemo(() => {
    return tours.map((program) => {
      const title = getLocalizedField(program.name || program.title, locale);
      const enTitle = getLocalizedField(program.name || program.title, 'en');
      const slug = program.slug || slugify(`${program.id}-${enTitle}`);
      const duration = getLocalizedField(program.duration, locale);
      const highlights = getLocalizedField(program.highlights, locale);
      const overview = getLocalizedField(program.overview, locale);
      const code = getLocalizedField(program.code, locale) || program.id;
      const minPax = getLocalizedField(program.minPax, locale);
      const includes = getLocalizedField(program.includes, locale);
      const excludes = getLocalizedField(program.excludes, locale);

      const days = Array.isArray(program.days)
        ? program.days.map((d) => ({
            day: d.day,
            description: getLocalizedField(d.description, locale),
            meals: d.meals ? getLocalizedField(d.meals, locale) : null,
          }))
        : [];

      const images = Array.isArray(program.images) ? program.images : [];

      const pricing = program.pricing
        ? {
            ...program.pricing,
            hotels: Array.isArray(program.pricing.hotels)
              ? program.pricing.hotels.map((h) => (typeof h === 'object' ? getLocalizedField(h, locale) : h))
              : [],
          }
        : null;

      const extraNightPrices = program.extraNightPrices
        ? {
            ...program.extraNightPrices,
            hotels: Array.isArray(program.extraNightPrices.hotels)
              ? program.extraNightPrices.hotels.map((h) => (typeof h === 'object' ? getLocalizedField(h, locale) : h))
              : [],
          }
        : null;

      const exhibitionSurcharges = program.exhibitionSurcharges
        ? {
            dubai: Array.isArray(program.exhibitionSurcharges.dubai)
              ? program.exhibitionSurcharges.dubai.map((item) => ({
                  ...item,
                  event: getLocalizedField(item.event, locale),
                  dates: getLocalizedField(item.dates, locale),
                }))
              : null,
            abuDhabi: Array.isArray(program.exhibitionSurcharges.abuDhabi)
              ? program.exhibitionSurcharges.abuDhabi.map((item) => ({
                  ...item,
                  event: getLocalizedField(item.event, locale),
                  dates: getLocalizedField(item.dates, locale),
                }))
              : null,
          }
        : null;

      return {
        ...program,
        id: program.id,
        title,
        slug,
        images,
        duration,
        highlights: Array.isArray(highlights) ? highlights : [],
        overview,
        code,
        minPax,
        includes,
        excludes,
        days,
        pricing,
        extraNightPrices,
        exhibitionSurcharges,
        raw: program,
      };
    });
  }, [locale, tours]);
}

export function getDubaiProgramBySlug(slug, locale = 'en') {
  // Detail resolution is asynchronous and must go through GET /api/tours/:slug.
  // This legacy synchronous helper is intentionally inert so it cannot read a local catalog.
  void slug;
  void locale;
  return null;
}

export default useDubaiPrograms;
