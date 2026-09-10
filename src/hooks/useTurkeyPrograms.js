import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTours } from './useTours';
import { supportedLocale } from '../utils/locale.js';

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

  // Normalize only the canonical Backend tour representation.
  const title = getLocalizedField(program.titleJsonb || program.name || program.title, locale);
  const enTitle = getLocalizedField(program.titleJsonb || program.name || program.title, 'en');
  const slug = program.slug || slugify(`${program.id}-${enTitle}`);
  const duration = getLocalizedField(program.durationJsonb || program.duration, locale);
  const highlights = getLocalizedField(program.highlightsJsonb || program.highlights, locale);
  const overview = getLocalizedField(program.overviewJsonb || program.overview, locale);
  const code = getLocalizedField(program.sourceCodeJsonb || program.code, locale) || program.id || slug;
  const minPax = getLocalizedField(program.minPaxJsonb || program.minPax, locale);
  const transportOptions = program.transportationJsonb || program.transportOptions
    ? getLocalizedField(program.transportationJsonb || program.transportOptions, locale)
    : null;
  const includes = getLocalizedField(program.includedServicesJsonb || program.includes, locale);
  const excludes = getLocalizedField(program.excludedServicesJsonb || program.excludes, locale);

  const rawItinerary = program.itineraries || program.itinerary || program.days || [];
  const days = Array.isArray(rawItinerary)
    ? rawItinerary.map((d, index) => ({
        day: d.day || d.sortOrder || String(index + 1),
        title: getLocalizedField(d.titleJsonb || d.title || d.dayLabel, locale),
        description: getLocalizedField(d.descriptionJsonb || d.description, locale),
        meals: d.mealsJsonb || d.meals ? getLocalizedField(d.mealsJsonb || d.meals, locale) : null,
      }))
    : [];

  let images = [];
  if (Array.isArray(program.images) && program.images.length > 0) {
    images = program.images.map((img) => (typeof img === 'string' ? img : img.url || img.heroImageUrl)).filter(Boolean);
  } else if (program.heroImage) {
    images = [program.heroImage];
  } else if (program.heroImageUrl) {
    images = [program.heroImageUrl];
  }

  // Missing media remains missing and is rendered as an explicit UI state.

  const basePriceUsd = Number(program.basePriceUsd ?? program.price);

  return {
    ...program,
    id: program.id || slug,
    title: title || enTitle || '',
    slug,
    images,
    price: Number.isFinite(basePriceUsd) ? basePriceUsd : null,
    basePriceUsd,
    duration: duration || '',
    highlights: Array.isArray(highlights) ? highlights : (highlights ? [highlights] : []),
    overview: overview || '',
    code,
    minPax: minPax || '2 Pax',
    transportOptions,
    includes,
    excludes,
    days,
    raw: program,
  };
}

export function useTurkeyPrograms() {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language || 'en');
  const { tours } = useTours({ destination: 'Turkey', limit: 50 });

  return useMemo(() => {
    return tours.map((program) => formatTurkeyProgram(program, lang));
  }, [tours, lang]);
}

export function getTurkeyProgramBySlug(targetSlug, locale = 'en') {
  // Use the canonical async detail hook/API instead of a local synchronous catalog.
  void targetSlug;
  void locale;
  return null;
}
