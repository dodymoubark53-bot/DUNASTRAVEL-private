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

  const rawImages = Array.isArray(data.images) ? data.images : [];
  const structuredImages = rawImages.map((image, index) => {
    if (typeof image === 'string') {
      return { id: `img-${index}`, imageUrl: image, isHero: index === 0, altText: null, sortOrder: index };
    }
    if (!image?.imageUrl) {
      throw new Error(`Invalid canonical tour image for ${data.slug}`);
    }
    return {
      id: image.id || `img-${index}`,
      imageUrl: image.imageUrl,
      isHero: Boolean(image.isHero),
      altText: image.altText || null,
      sortOrder: Number.isInteger(image.sortOrder) ? image.sortOrder : index,
    };
  }).sort((a, b) => (b.isHero ? 1 : 0) - (a.isHero ? 1 : 0) || a.sortOrder - b.sortOrder);

  const images = structuredImages.map((img) => img.imageUrl);
  const heroImage = structuredImages.find((img) => img.isHero)?.imageUrl || structuredImages[0]?.imageUrl || null;

  const itinerary = data.itinerary.map((item, idx) => {
    if (!item?.id || !Number.isInteger(item.sortOrder) || typeof item.description !== 'string') {
      throw new Error(`Invalid canonical itinerary item for ${data.slug}`);
    }
    const dayLabelStr = String(item.dayLabel || '').trim();
    const dayNumFromLabel = Number(dayLabelStr);
    const day = Number.isInteger(dayNumFromLabel) && dayNumFromLabel > 0
      ? dayNumFromLabel
      : (item.sortOrder > 0 ? item.sortOrder : idx + 1);
    const title = dayLabelStr && isNaN(dayNumFromLabel) ? dayLabelStr : '';

    return {
      ...item,
      day,
      title,
      meals: item.meals || null,
      description: item.description,
      activities: item.activities || null,
      hotels: item.hotels || null,
      notes: item.notes || null,
      transportation: item.transportation || null,
    };
  }).sort((a, b) => a.sortOrder - b.sortOrder);

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
    galleryImages: structuredImages,
    heroImage: data.heroImage || heroImage,
    heroVideoUrl: data.heroVideoUrl || null,
    city: data.city || null,
    minPax: data.minPax || null,
    departureTime: data.departureTime || null,
    returnTime: data.returnTime || null,
    ageRestrictions: data.ageRestrictions || null,
    pickupLocations: Array.isArray(data.pickupLocations) ? data.pickupLocations : [],
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    customBadge: data.customBadge || null,
    included: data.includedServices || [],
    excluded: data.excludedServices || [],
    highlights: Array.isArray(data.highlights) ? data.highlights : [],
    seasonPricing: data.seasonPricing || null,
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
    departureInfo: data.departureInfo || null,
    cancellationPolicy: data.cancellationPolicy || null,
    sourceRating: data.sourceRating || null,
    sourceReviewCount: data.sourceReviewCount || null,
    difficultyLevel: data.difficultyLevel || null,
    meetingPoint: data.meetingPoint || null,
    market: data.market || null,
    sourceCode: data.sourceCode || null,
    tags: Array.isArray(data.tags) ? data.tags : [],
    languages: Array.isArray(data.languages) ? data.languages : ['en'],
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
