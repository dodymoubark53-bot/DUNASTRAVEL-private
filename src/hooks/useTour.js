import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

function parseList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
}

function normalizeTour(data) {
  if (!data?.id || !data?.slug || !data?.title) {
    throw new Error('Invalid tour details response');
  }
  const price = Number(data.price ?? data.basePriceUsd);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`Invalid tour price for ${data.slug}`);
  }
  const images = Array.isArray(data.images)
    ? data.images
        .map((image) => (typeof image === 'string' ? image : image?.imageUrl || image?.url || ''))
        .filter(Boolean)
    : data.heroImage
      ? [data.heroImage]
      : [];
  const itinerary = Array.isArray(data.itinerary)
    ? data.itinerary.map((item, index) => ({
        ...item,
        day: item.day || (typeof item.sortOrder === 'number' ? item.sortOrder + 1 : index + 1),
        title: item.title || item.dayLabel || '',
        description: item.description || item.desc || '',
        meals: item.meals || null,
      }))
    : [];

  return {
    ...data,
    images,
    included: parseList(data.included || data.includedServices),
    excluded: parseList(data.excluded || data.excludedServices),
    itinerary,
    price,
  };
}

export function useTour(slug) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!slug) return undefined;

    const fetchTour = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = normalizeTour(
          await api.get(`/tours/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`),
        );
        if (isMounted) setTour(result);
      } catch (requestError) {
        if (isMounted) {
          setError(requestError);
          setTour(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void fetchTour();
    return () => {
      isMounted = false;
    };
  }, [slug, lang]);

  return { tour, loading, error };
}
