import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { variants } from '../../animations/variants';
import Button from '../ui/Button';
import { useCurrency } from '../../context/CurrencyContext';
import { trackEvent } from '../../utils/analytics';

const marketFlag = (market) => {
  const flags = { Brasil: '🇧🇷', Italia: '🇮🇹' };
  return flags[market] ?? '🌍';
};

const TourCard = ({
  tour,
  linkBase = '/tours',
}) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const translatedDuration = t(`data.${tour.duration}`, tour.duration);
  const durationLabel = translatedDuration.split('/')[0].trim();

  const detailUrl = `${linkBase}/${tour.slug}`;

  const handleCardClick = (e) => {
    trackEvent('tour_card_click', {
      tourSlug: tour.slug,
      interfaceSlug: typeof window !== 'undefined' ? sessionStorage.getItem('dunas_origin_interface') : undefined,
    });
    navigate(detailUrl);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className="bg-white rounded-xl overflow-hidden flex flex-col h-full group cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-obsidian-200 hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] hover:border-gold-500 hover:-translate-y-2 transition-all duration-300 ease-out z-10 hover:z-20 relative"
      variants={variants.fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {/* Image as Link */}
      <Link to={detailUrl} className="block relative h-[240px] overflow-hidden">
        <div className="absolute top-4 left-4 z-10 bg-obsidian-900/80 backdrop-blur-md text-gold-500 text-caption px-4 py-1.5 rounded-full border border-gold-500/30 shadow-glass">
          {tour.minPax ? `${tour.minPax} · ` : ''}{durationLabel}
        </div>

        {tour.badge && (
          <div className="absolute top-4 right-4 z-10 bg-gold-500 text-obsidian-900 text-caption font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
            {t(`data.${tour.badge}`, tour.badge)}
          </div>
        )}

        {tour.market && (
          <div className="absolute top-4 right-4 z-10 bg-obsidian-900/60 backdrop-blur-md text-base px-2.5 py-1 rounded-full border border-white/10 shadow-glass select-none">
            {marketFlag(tour.market)}
          </div>
        )}

        <img
          src={tour.images[0]}
          alt={`${t(`data.${tour.title}`, tour.title)} — ${t(`nav.${tour.destination}`, tour.destination)}`}
          className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700"
          loading="lazy"
        />

        {/* Hover Detail Card Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/90 via-obsidian-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-5 translate-y-4 group-hover:translate-y-0">
          <span className="text-gold-400 text-caption uppercase tracking-widest font-semibold mb-1">
            {tour.code || t(`data.${tour.subtitle || tour.destination}`, tour.subtitle || tour.destination)}
          </span>
          <h4 className="text-white text-display-sm font-semibold mb-2 line-clamp-2">
            {t(`data.${tour.title}`, tour.title)}
          </h4>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-gold-400 text-caption font-bold">
              {formatPrice(tour.price)}
            </span>
            <span className="text-white/60 text-caption">|</span>
            <span className="text-white/80 text-caption">
              {durationLabel}
            </span>
          </div>
          <p className="text-white/70 text-body-sm line-clamp-2 mb-2">
            {t(`data.${tour.description}`, tour.description)}
          </p>
          <span className="text-gold-400 text-caption font-semibold tracking-wider uppercase">
            {t('tourCard.viewDetails', 'View Details')} &rarr;
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-caption text-gold-600 uppercase tracking-widest mb-1 block">
          {tour.code || t(`data.${tour.subtitle || tour.destination}`, tour.subtitle || tour.destination)}
        </span>

        {tour.transportOptions && (
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-obsidian-700 bg-gold-100 border border-gold-300 px-2.5 py-1 rounded-full">
              {tour.transportOptions}
            </span>
          </div>
        )}

        <Link to={detailUrl}>
          <h3 className="text-display-md text-obsidian-900 mb-3 line-clamp-2 group-hover:text-gold-700 transition-colors">
            {t(`data.${tour.title}`, tour.title)}
          </h3>
        </Link>

        <p className="text-body-sm text-obsidian-500 line-clamp-3 mb-4 flex-grow">
          {t(`data.${tour.description}`, tour.description)}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gold-500/10 mt-auto">
          <div>
            <span className="block text-caption text-obsidian-300 mb-1">
              {t('tourCard.from', 'from')}
            </span>
            <span className="text-display-md text-gold-700">
              {formatPrice(tour.price)}
            </span>
          </div>

          <Link to={detailUrl}>
            <Button variant="outline-gold" className="px-6 py-2 flex items-center gap-2">
              {t('tourCard.viewDetails', 'View Details')} <span className="rtl-flip">&rarr;</span>
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;