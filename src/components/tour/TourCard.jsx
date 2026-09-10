import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { variants } from '../../animations/variants';
import Button from '../ui/Button';
import { useCurrency } from '../../context/CurrencyContext';
import { useWishlist } from '../../hooks/useWishlist';
import { trackEvent } from '../../utils/analytics';
import { resolveTourTitle, resolveTourDuration, resolveTourOverview, resolveLocalizedText } from '../../utils/titleHelper';

const marketFlag = (market) => {
  const flags = { Brasil: '🇧🇷', Italia: '🇮🇹', Spain: '🇪🇸' };
  return flags[market] ?? '🌍';
};

const TourCard = ({
  tour,
  linkBase = '/tours',
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const { formatPrice } = useCurrency();
  const { isFavorite, toggleFavorite } = useWishlist();
  const navigate = useNavigate();

  if (!tour) return null;

  const title = resolveTourTitle(tour, t, lang);
  const overview = resolveTourOverview(tour, t, lang);
  const duration = resolveTourDuration(tour, t, lang);
  const durationStr = typeof duration === 'string' ? duration : String(duration || '');
  const durationLabel = durationStr.includes('/') ? durationStr.split('/')[0].trim() : durationStr;

  const parsedPrice = Number(tour.price ?? tour.basePriceUsd ?? tour.raw?.price);
  const tourPrice = Number.isFinite(parsedPrice) ? parsedPrice : null;
  const firstImage = Array.isArray(tour.images) && tour.images.length > 0 ? tour.images[0] : null;
  const tourImage = typeof firstImage === 'string'
    ? firstImage
    : firstImage?.imageUrl || firstImage?.url || tour.heroImage || null;

  const codeText = resolveLocalizedText(tour.code, t, lang);
  const minPaxText = resolveLocalizedText(tour.minPax, t, lang);

  const detailUrl = `${linkBase}/${tour.slug || tour.id}`;
  const fav = isFavorite(tour.id || tour.slug);

  const handleCardClick = () => {
    trackEvent('tour_card_click', {
      tourSlug: tour.slug,
      interfaceSlug: typeof window !== 'undefined' ? sessionStorage.getItem('dunas_origin_interface') : undefined,
    });
    navigate(detailUrl);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(tour);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className="bg-white dark:bg-[#1a1a30] rounded-xl overflow-hidden flex flex-col h-full group cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-obsidian-200 dark:border-gray-700 hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] hover:border-gold-500 hover:-translate-y-2 transition-all duration-300 ease-out z-10 hover:z-20 relative text-left rtl:text-right"
      variants={variants.fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {/* Image as Link */}
      <Link to={detailUrl} className="block relative h-[240px] overflow-hidden bg-obsidian-900">
        {/* Wishlist Button - Top Right (LTR) / Top Left (RTL) */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label="Toggle wishlist"
          className="absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 z-20 w-9 h-9 rounded-full bg-obsidian-900/80 backdrop-blur-md flex items-center justify-center border border-gold-500/40 text-gold-400 hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer"
        >
          {fav ? <FaHeart className="text-red-500" size={15} /> : <FaRegHeart size={15} />}
        </button>

        {/* Duration / Pax Badge */}
        {durationLabel && (
          <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10 bg-obsidian-900/80 backdrop-blur-md text-gold-500 text-caption px-4 py-1.5 rounded-full border border-gold-500/30 shadow-glass">
            {minPaxText ? `${minPaxText} · ` : ''}{durationLabel}
          </div>
        )}

        {/* Custom Tour Badge (if provided) */}
        {tour.badge && (
          <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 z-10 bg-gold-500 text-obsidian-900 text-caption font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
            {resolveLocalizedText(tour.badge, t, lang)}
          </div>
        )}

        {/* Market Flag (if provided) */}
        {tour.market && (
          <div className="absolute bottom-4 right-4 rtl:right-auto rtl:left-4 z-10 bg-obsidian-900/60 backdrop-blur-md text-base px-2.5 py-1 rounded-full border border-white/10 shadow-glass select-none">
            {marketFlag(tour.market)}
          </div>
        )}

        {tourImage ? (
          <img
            src={tourImage}
            alt={`${title} — ${resolveLocalizedText(tour.destination, t, lang) || ''}`}
            className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
            decoding="async"
            width="400"
            height="240"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-obsidian-800 px-6 text-center text-sm text-ivory-300">
            {t('tour.imageUnavailable', 'No image has been added for this tour.')}
          </div>
        )}

        {/* Subtle Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/60 via-transparent to-black/20 pointer-events-none group-hover:opacity-40 transition-opacity duration-300" />
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-caption text-gold-600 dark:text-gold-400 uppercase tracking-widest mb-1 block">
          {codeText || resolveLocalizedText(tour.subtitle || tour.destination, t, lang)}
        </span>

        {tour.transportOptions && (
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-obsidian-700 dark:text-ivory-200 bg-gold-100 dark:bg-gold-900/40 border border-gold-300 dark:border-gold-700 px-2.5 py-1 rounded-full">
              {tour.transportOptions}
            </span>
          </div>
        )}

        <Link to={detailUrl}>
          <h3 className="text-display-md text-obsidian-900 dark:text-ivory-50 mb-3 line-clamp-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h3>
        </Link>

        <p className="text-body-sm text-obsidian-600 dark:text-ivory-300 line-clamp-3 mb-4 flex-grow">
          {overview}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gold-500/10 dark:border-gray-700 mt-auto">
          {tourPrice !== null && tourPrice > 0 ? (
            <div>
              <span className="block text-caption text-obsidian-400 dark:text-ivory-400 mb-1">
                {t('tourCard.from', 'from')}
              </span>
              <span className="text-display-md text-gold-700 dark:text-gold-400 font-bold">
                {formatPrice(tourPrice)}
              </span>
            </div>
          ) : (
            <div>
              <span className="inline-block text-[11px] font-semibold text-gold-600 dark:text-gold-400 uppercase tracking-wider bg-gold-50 dark:bg-gold-950/40 px-2.5 py-1 rounded-md border border-gold-500/20">
                {t('tourCard.onQuote', 'On Request')}
              </span>
            </div>
          )}

          <Link to={detailUrl} aria-label={`${t('tourCard.viewDetails', 'View Details')} - ${title}`}>
            <Button variant="outline-gold" className="px-6 py-2 flex items-center gap-2">
              {t('tourCard.viewDetails', 'View Details')} <span className="rtl-flip">&rarr;</span>
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(TourCard);
