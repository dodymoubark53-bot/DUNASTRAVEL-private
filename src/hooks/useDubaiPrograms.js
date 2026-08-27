import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { dubaiTours } from '../data/dubaiTours.js';

const programImages = {
  "REG-22": ["https://wallpaperaccess.com/full/222675.jpg"],
  "REG-23": ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"],
  "REG-24": ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/cf/55/ba/caption.jpg?w=1200&h=1200&s=1"],
  "REG-25": ["https://www.yasmina.com/tachyon/sites/5/2022/01/7f96899cbdde462971ae6a503d3a61cfc65f50a1.jpg"],
  "REG-26": ["https://i.pinimg.com/736x/7b/a8/4e/7ba84eb916025464c345151b07fc4604.jpg"],
  "REG-27": ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"],
  "REG-28": ["https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&w=800&q=80"],
  "HM001": ["https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"],
  "HM002": ["https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/07/19/7f/2e.jpg"]
};

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

  return useMemo(() => {
    return dubaiTours.map((program) => {
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

      const images = (Array.isArray(program.images) && program.images.length > 0 && !program.images[0].startsWith('/imgs/'))
        ? program.images
        : (programImages[program.id] || ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"]);

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
  }, [locale]);
}

export function getDubaiProgramBySlug(slug, locale = 'en') {
  if (!slug) return null;
  const normSlug = String(slug).toLowerCase();
  const targetLocale = ['ar', 'en', 'es', 'pt', 'it'].includes(locale) ? locale : 'en';

  const matched = dubaiTours.find((p) => {
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
  const includes = getLocalizedField(matched.includes, targetLocale);
  const excludes = getLocalizedField(matched.excludes, targetLocale);

  const days = Array.isArray(matched.days)
    ? matched.days.map((d) => ({
        day: d.day,
        description: getLocalizedField(d.description, targetLocale),
        meals: d.meals ? getLocalizedField(d.meals, targetLocale) : null,
      }))
    : [];

  const images = (Array.isArray(matched.images) && matched.images.length > 0 && !matched.images[0].startsWith('/imgs/'))
    ? matched.images
    : (programImages[matched.id] || ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"]);

  const pricing = matched.pricing
    ? {
        ...matched.pricing,
        hotels: Array.isArray(matched.pricing.hotels)
          ? matched.pricing.hotels.map((h) => (typeof h === 'object' ? getLocalizedField(h, targetLocale) : h))
          : [],
      }
    : null;

  const extraNightPrices = matched.extraNightPrices
    ? {
        ...matched.extraNightPrices,
        hotels: Array.isArray(matched.extraNightPrices.hotels)
          ? matched.extraNightPrices.hotels.map((h) => (typeof h === 'object' ? getLocalizedField(h, targetLocale) : h))
          : [],
      }
    : null;

  const exhibitionSurcharges = matched.exhibitionSurcharges
    ? {
        dubai: Array.isArray(matched.exhibitionSurcharges.dubai)
          ? matched.exhibitionSurcharges.dubai.map((item) => ({
              ...item,
              event: getLocalizedField(item.event, targetLocale),
              dates: getLocalizedField(item.dates, targetLocale),
            }))
          : null,
        abuDhabi: Array.isArray(matched.exhibitionSurcharges.abuDhabi)
          ? matched.exhibitionSurcharges.abuDhabi.map((item) => ({
              ...item,
              event: getLocalizedField(item.event, targetLocale),
              dates: getLocalizedField(item.dates, targetLocale),
            }))
          : null,
      }
    : null;

  return {
    ...matched,
    id: matched.id,
    title,
    slug: matched.slug || slugify(`${matched.id}-${getLocalizedField(matched.name, 'en')}`),
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
    raw: matched,
  };
}

export default useDubaiPrograms;
