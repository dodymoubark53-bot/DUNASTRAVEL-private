import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';

function normalizeLandingPage(value) {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid landing page response');
  }

  const slug = value.slug || value.id;
  if (!slug) {
    throw new Error('Missing landing page slug');
  }

  const rawTours = Array.isArray(value.tours) ? value.tours : [];

  return {
    ...value,
    id: value.id || slug,
    slug,
    title: typeof value.title === 'string' && value.title.trim() ? value.title : slug,
    subtitle: typeof value.subtitle === 'string' ? value.subtitle : '',
    description: typeof value.description === 'string' ? value.description : '',
    brief: typeof value.brief === 'string' ? value.brief : '',
    type: value.type || 'DESTINATION',
    sections: Array.isArray(value.sections) ? value.sections : [],
    tours: rawTours.map((tour, idx) => {
      const tourId = tour?.id || tour?.slug || `tour-${idx}`;
      const tourSlug = tour?.slug || tourId;
      const title = typeof tour?.title === 'string' && tour.title.trim()
        ? tour.title
        : (tour?.title?.en || tour?.title?.ar || tourSlug || 'Tour');
      const basePriceUsd = tour?.basePriceUsd != null ? String(tour.basePriceUsd) : '0';
      const currency = typeof tour?.currency === 'string' && tour.currency.trim() ? tour.currency : 'USD';
      const images = Array.isArray(tour?.images) ? tour.images : (tour?.heroImage ? [tour.heroImage] : []);

      return {
        ...tour,
        id: tourId,
        slug: tourSlug,
        title,
        basePriceUsd,
        currency,
        images,
        heroImage: tour?.heroImage || images[0] || null,
        country: tour?.country || '',
        city: tour?.city || '',
        customBadge: tour?.customBadge || null,
      };
    }),
  };
}

const destinationSlugAliases = {
  egito: 'egypt',
  egipto: 'egypt',
  turquia: 'turkey',
  jordania: 'jordan',
  marruecos: 'morocco',
  marrocos: 'morocco',
  grecia: 'greece',
  tunez: 'tunisia',
  tunisie: 'tunisia',
};

export function useLandingPage(slug, { destinationOnly = false } = {}) {
  const { i18n } = useTranslation();
  const locale = supportedLocale(i18n.language);
  const [landingPage, setLandingPage] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    let active = true;
    if (!slug) return undefined;

    const endpoint = destinationOnly ? '/destinations' : '/tour-landing-pages';
    const canonicalSlug = destinationOnly
      ? (destinationSlugAliases[String(slug).toLowerCase()] || slug)
      : slug;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        setLandingPage(null);
        const page = normalizeLandingPage(
          await api.get(`${endpoint}/${encodeURIComponent(canonicalSlug)}?locale=${encodeURIComponent(locale)}`),
        );
        if (active) setLandingPage(page);
      } catch (reason) {
        if (active) {
          setLandingPage(null);
          setError(reason);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => { active = false; };
  }, [destinationOnly, locale, slug, reloadNonce]);

  return { landingPage, loading, error, retry: () => setReloadNonce((value) => value + 1) };
}

export default useLandingPage;
