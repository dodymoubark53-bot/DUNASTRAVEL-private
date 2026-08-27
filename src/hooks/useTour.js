import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';

function normalizeTour(data) {
  if (!data?.id || !data?.slug || !data?.title || typeof data.currency !== 'string') {
    throw new Error('Invalid tour details response');
  }
  const price = Number(data.basePriceUsd);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`Invalid tour price for ${data.slug}`);
  }
  if (!Array.isArray(data.images) || !Array.isArray(data.itinerary)
    || !Array.isArray(data.includedServices) || !Array.isArray(data.excludedServices)) {
    throw new Error(`Invalid canonical tour presentation for ${data.slug}`);
  }
  const images = data.images.map((image) => {
    if (!image?.id || typeof image.imageUrl !== 'string') {
      throw new Error(`Invalid canonical tour image for ${data.slug}`);
    }
    return image.imageUrl;
  });
  const itinerary = data.itinerary.map((item) => {
    if (!item?.id || !Number.isInteger(item.sortOrder) || typeof item.description !== 'string') {
      throw new Error(`Invalid canonical itinerary item for ${data.slug}`);
    }
    return {
      ...item,
      day: item.sortOrder + 1,
      title: item.dayLabel || '',
      meals: item.meals || null,
    };
  });
  const normalizedCountry = String(data.country || '').trim().toLowerCase();
  const destination = normalizedCountry === 'united arab emirates'
    ? 'dubai'
    : normalizedCountry === 'multi country'
      ? 'multi-country'
      : normalizedCountry.replace(/\s+/g, '-');

  return {
    ...data,
    // The detail API returns a commercial country, while customer routes use
    // landing-page slugs. Do not redirect missing data to another country.
    destination: data.destination || destination || null,
    images,
    included: data.includedServices,
    excluded: data.excludedServices,
    pricingTiers: Array.isArray(data.seasonPricing?.pricingTiers)
      ? data.seasonPricing.pricingTiers
      : data.seasonPricing?.pricingTiers?.categories
        || data.seasonPricing?.pricing?.categories
        || [],
    optionalExcursionsPricing: data.seasonPricing?.optionalExcursionsPricing || null,
    accommodation: data.hotelInfo?.accommodation || null,
    hotels: data.hotelInfo?.hotels || null,
    hotelCategory: data.hotelInfo?.hotelCategory || null,
    excursions: data.terms?.excursions || [],
    transportOptions: data.transportation?.transportOptions || null,
    route: data.transportation?.route || null,
    itinerary,
    price,
  };
}

export function useTour(slug) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    let isMounted = true;
    if (!slug) return undefined;

    const fetchTour = async () => {
      try {
        setLoading(true);
        setError(null);
        setTour(null);
        const result = normalizeTour(
          await api.get(`/tours/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`),
        );
        if (isMounted) {
          setTour(result);
          setError(null);
        }
      } catch (requestError) {
        if (isMounted) {
          setTour(null);
          setError(requestError);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void fetchTour();
    return () => {
      isMounted = false;
    };
  }, [slug, lang, reloadNonce]);

  return { tour, loading, error, retry: () => setReloadNonce((value) => value + 1) };
}
