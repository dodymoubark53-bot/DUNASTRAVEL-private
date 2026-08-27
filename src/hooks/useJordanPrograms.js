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

export function useJordanPrograms() {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const locale = ['ar', 'en', 'es', 'pt', 'it'].includes(lang) ? lang : 'en';
  const { tours } = useTours({ destination: 'Jordan', limit: 50 });

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

      const days = Array.isArray(program.days)
        ? program.days.map((d) => ({
            day: d.day,
            title: getLocalizedField(d.title, locale),
            description: getLocalizedField(d.description, locale),
            meals: d.meals ? getLocalizedField(d.meals, locale) : null,
          }))
        : [];

      return {
        ...program,
        id: program.id,
        title,
        slug,
        images: Array.isArray(program.images) && program.images.length > 0 ? program.images : (program.heroImage ? [program.heroImage] : []),
        duration,
        highlights: Array.isArray(highlights) ? highlights : [],
        overview,
        code,
        minPax,
        days,
        raw: program,
      };
    });
  }, [locale, tours]);
}

export function getJordanProgramBySlug(slug, locale = 'en') {
  // Detail resolution is asynchronous and must go through GET /api/tours/:slug.
  // Keep this legacy synchronous helper inert so it can never expose a local catalog.
  void slug;
  void locale;
  return null;
}

export default useJordanPrograms;
