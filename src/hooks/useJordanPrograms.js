import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { jordanTours } from '../data/jordanTours.js';

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

  return useMemo(() => {
    return jordanTours.map((program) => {
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
        images: Array.isArray(program.images) && program.images.length > 0 ? program.images : [program.heroImage],
        duration,
        highlights: Array.isArray(highlights) ? highlights : [],
        overview,
        code,
        minPax,
        days,
        raw: program,
      };
    });
  }, [locale]);
}

export function getJordanProgramBySlug(slug, locale = 'en') {
  if (!slug) return null;
  const normSlug = String(slug).toLowerCase();
  
  const targetLocale = ['ar', 'en', 'es', 'pt', 'it'].includes(locale) ? locale : 'en';

  const matched = jordanTours.find((p) => {
    const pSlug = p.slug || slugify(`${p.id}-${getLocalizedField(p.name, 'en')}`);
    return pSlug.toLowerCase() === normSlug || p.id.toLowerCase() === normSlug;
  });

  if (!matched) return null;

  const title = getLocalizedField(matched.name || matched.title, targetLocale);
  const duration = getLocalizedField(matched.duration, targetLocale);
  const highlights = getLocalizedField(matched.highlights, targetLocale);
  const overview = getLocalizedField(matched.overview, targetLocale);
  const code = getLocalizedField(matched.code, targetLocale) || matched.id;
  const minPax = getLocalizedField(matched.minPax, targetLocale);

  const days = Array.isArray(matched.days)
    ? matched.days.map((d) => ({
        day: d.day,
        title: getLocalizedField(d.title, targetLocale),
        description: getLocalizedField(d.description, targetLocale),
        meals: d.meals ? getLocalizedField(d.meals, targetLocale) : null,
      }))
    : [];

  return {
    ...matched,
    id: matched.id,
    title,
    slug: matched.slug || slugify(`${matched.id}-${getLocalizedField(matched.name, 'en')}`),
    images: Array.isArray(matched.images) && matched.images.length > 0 ? matched.images : [matched.heroImage],
    duration,
    highlights: Array.isArray(highlights) ? highlights : [],
    overview,
    code,
    minPax,
    days,
    raw: matched,
  };
}

export default useJordanPrograms;
