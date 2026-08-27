import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { turkeyTours } from '../data/turkeyTours.js';

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

export function formatTurkeyProgram(program, locale = 'en') {
  if (!program) return null;
  const title = getLocalizedField(program.name || program.title, locale);
  const enTitle = getLocalizedField(program.name || program.title, 'en');
  const slug = program.slug || slugify(`${program.id}-${enTitle}`);
  const duration = getLocalizedField(program.duration, locale);
  const highlights = getLocalizedField(program.highlights, locale);
  const overview = getLocalizedField(program.overview, locale);
  const code = getLocalizedField(program.code, locale) || program.id;
  const minPax = getLocalizedField(program.minPax, locale);
  const transportOptions = program.transportOptions ? getLocalizedField(program.transportOptions, locale) : null;
  const includes = getLocalizedField(program.includes, locale);
  const excludes = getLocalizedField(program.excludes, locale);

  const days = Array.isArray(program.days)
    ? program.days.map((d) => ({
        day: d.day,
        title: getLocalizedField(d.title, locale),
        description: getLocalizedField(d.description, locale),
        meals: d.meals ? getLocalizedField(d.meals, locale) : null,
      }))
    : [];

  const images = Array.isArray(program.images) && program.images.length > 0
    ? program.images
    : [program.heroImage || 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80'];

  return {
    ...program,
    id: program.id,
    title,
    slug,
    images,
    duration,
    highlights: Array.isArray(highlights) ? highlights : (highlights ? [highlights] : []),
    overview,
    code,
    minPax,
    transportOptions,
    includes,
    excludes,
    days,
    raw: program,
  };
}

export function useTurkeyPrograms() {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const locale = ['ar', 'en', 'es', 'pt', 'it'].includes(lang) ? lang : 'en';

  return useMemo(() => {
    return turkeyTours.map((program) => formatTurkeyProgram(program, locale));
  }, [locale]);
}

export function getTurkeyProgramBySlug(targetSlug, locale = 'en') {
  if (!targetSlug) return null;
  const cleanTarget = String(targetSlug).toLowerCase().trim();
  const rawProgram = turkeyTours.find(
    (p) =>
      p.id.toLowerCase() === cleanTarget ||
      (p.slug && p.slug.toLowerCase() === cleanTarget) ||
      slugify(p.id) === cleanTarget ||
      slugify(`${p.id}-${getLocalizedField(p.name || p.title, 'en')}`) === cleanTarget ||
      cleanTarget.startsWith(p.id.toLowerCase()) ||
      cleanTarget.startsWith(slugify(p.id)) ||
      (p.slug && cleanTarget.includes(p.slug.toLowerCase()))
  );
  if (!rawProgram) return null;
  return formatTurkeyProgram(rawProgram, locale);
}
