import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';

function normalizeLandingPage(value) {
  if (!value || !value.id || !value.slug || !value.title || !value.type || !Array.isArray(value.tours)) {
    throw new Error('Invalid landing page response');
  }

  return {
    ...value,
    tours: value.tours.map((tour) => {
      if (!tour?.id || !tour.slug || typeof tour.title !== 'string' || typeof tour.basePriceUsd !== 'string' || typeof tour.currency !== 'string') {
        throw new Error(`Invalid landing page tour for ${value.slug}`);
      }
      return tour;
    }),
  };
}

export function useLandingPage(slug, { destinationOnly = false } = {}) {
  const { i18n } = useTranslation();
  const locale = supportedLocale(i18n.language);
  const [landingPage, setLandingPage] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    if (!slug) return undefined;

    const endpoint = destinationOnly ? '/destinations' : '/tour-landing-pages';
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const page = normalizeLandingPage(
          await api.get(`${endpoint}/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`),
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
  }, [destinationOnly, locale, slug]);

  return { landingPage, loading, error };
}

export default useLandingPage;
