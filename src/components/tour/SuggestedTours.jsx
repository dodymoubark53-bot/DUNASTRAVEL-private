import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';
import { useTours } from '../../hooks/useTours';
import { useCurrency } from '../../context/CurrencyContext';
import {
  resolveTourTitle,
  resolveTourOverview,
  resolveTourDuration,
  resolveLocalizedText
} from '../../utils/titleHelper';

function resolveTourImage(tour) {
  if (!tour) return null;
  if (typeof tour.heroImage === 'string' && tour.heroImage.trim()) {
    return tour.heroImage.trim();
  }
  if (Array.isArray(tour.images) && tour.images.length > 0) {
    const first = tour.images[0];
    if (typeof first === 'string' && first.trim()) return first.trim();
    if (first?.imageUrl) return first.imageUrl;
    if (first?.url) return first.url;
  }
  if (typeof tour.image === 'string' && tour.image.trim()) {
    return tour.image.trim();
  }
  return null;
}

export default function SuggestedTours({ currentDestination = 'egypt', currentSlug = '' }) {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency();
  const lang = i18n.language || 'en';
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { tours } = useTours({ limit: 16 });

  const destLower = (currentDestination || 'egypt').toLowerCase();

  const allItems = [];

  if (Array.isArray(tours)) {
    tours.forEach((tour) => {
      if (!tour || !tour.slug) return;
      const image = resolveTourImage(tour);
      allItems.push({
        ...tour,
        id: tour.id || tour.slug,
        slug: tour.slug,
        destination: tour.destination || 'egypt',
        price: tour.price ?? Number(tour.basePriceUsd) ?? 0,
        rating: tour.rating || 4.9,
        image,
        link: `/tours/${tour.slug}`
      });
    });
  }

  // Filter out current active tour
  const availableItems = allItems.filter(
    (item) => item.slug !== currentSlug && item.id !== currentSlug
  );

  // Match destination items
  let matchingItems = availableItems.filter((item) => {
    const itemDest = (item.destination || '').toLowerCase();
    return (
      itemDest.includes(destLower) ||
      destLower.includes(itemDest) ||
      (destLower === 'egypt' && (itemDest.includes('cairo') || itemDest.includes('luxor') || itemDest.includes('nile') || itemDest.includes('hurghada') || itemDest.includes('sharm') || itemDest.includes('siwa'))) ||
      (destLower === 'jordan' && (itemDest.includes('amman') || itemDest.includes('petra') || itemDest.includes('jordan'))) ||
      (destLower === 'turkey' && (itemDest.includes('istanbul') || itemDest.includes('cappadocia') || itemDest.includes('turquia') || itemDest.includes('turkey'))) ||
      (destLower === 'dubai' && (itemDest.includes('dubai') || itemDest.includes('uae')))
    );
  });

  if (matchingItems.length < 4) {
    const otherItems = availableItems.filter((item) => !matchingItems.includes(item));
    matchingItems = [...matchingItems, ...otherItems];
  }

  const suggestedTours = Array.from(new Set(matchingItems.map((i) => i.slug)))
    .map((slug) => matchingItems.find((i) => i.slug === slug))
    .slice(0, 8);

  const isRtl = lang === 'ar';

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Auto-scroll loop
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        if (Math.abs(scrollLeft) >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: isRtl ? -360 : 360, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered, isRtl]);

  if (suggestedTours.length === 0) return null;

  return (
    <section className="w-full bg-obsidian-50 dark:bg-[#0c0d19] py-16 relative overflow-hidden border-t border-gold-500/10">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-caption text-gold-600 dark:text-gold-400 uppercase tracking-widest font-semibold mb-2 block">
              {t('suggested.badge', 'Handpicked Recommendations')}
            </span>
            <h2
              className="text-3xl md:text-4xl text-obsidian-900 dark:text-ivory-50 font-display"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t('suggested.title', 'Suggested Experiences')}
            </h2>
            <p className="text-body-sm text-obsidian-500 dark:text-ivory-300 mt-2 max-w-xl">
              {t(
                'suggested.subtitle',
                'Discover tailored journeys and exclusive add-ons curated to complement your travel adventure.'
              )}
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={() => scroll(isRtl ? 'right' : 'left')}
              className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a30] border border-obsidian-200 dark:border-gray-700 text-obsidian-900 dark:text-ivory-50 hover:border-gold-500 hover:text-gold-500 flex items-center justify-center transition-all shadow-sm"
              aria-label="Previous"
            >
              <FaChevronLeft className="rtl-flip text-xs" />
            </button>
            <button
              onClick={() => scroll(isRtl ? 'left' : 'right')}
              className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a30] border border-obsidian-200 dark:border-gray-700 text-obsidian-900 dark:text-ivory-50 hover:border-gold-500 hover:text-gold-500 flex items-center justify-center transition-all shadow-sm"
              aria-label="Next"
            >
              <FaChevronRight className="rtl-flip text-xs" />
            </button>
          </div>
        </div>

        {/* Auto-scrolling Carousel Container */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex gap-6 overflow-x-auto scrollbar-none pb-6 pt-2 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {suggestedTours.map((item) => {
            const resolvedTitle = resolveTourTitle(item, t, lang);
            const resolvedOverview = resolveTourOverview(item, t, lang);
            const resolvedDuration = resolveTourDuration(item, t, lang);
            const resolvedDestination = resolveLocalizedText(item.destination || item.location, t, lang);

            return (
              <motion.div
                key={item.id}
                className="snap-start shrink-0 w-[290px] sm:w-[330px] group bg-white dark:bg-[#1a1a30] rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-obsidian-200 dark:border-gray-700 hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] hover:border-gold-500 hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col justify-between cursor-pointer"
              >
                <Link to={item.link} className="flex flex-col h-full">
                  {/* Image */}
                  <div className="relative h-[220px] overflow-hidden bg-obsidian-800">
                    {resolvedDuration && (
                      <div className="absolute top-4 left-4 z-10 bg-obsidian-900/80 backdrop-blur-md text-gold-500 text-caption px-3 py-1 rounded-full border border-gold-500/30 shadow-glass">
                        {resolvedDuration}
                      </div>
                    )}

                    <div className="absolute top-4 right-4 z-10 bg-obsidian-900/80 backdrop-blur-md text-gold-400 text-caption px-2.5 py-1 rounded-full border border-gold-500/30 flex items-center gap-1 shadow-glass">
                      <FaStar size={11} className="text-gold-400" />
                      <span>{item.rating}</span>
                    </div>

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={resolvedTitle}
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-obsidian-800 px-6 text-center text-sm text-ivory-300">
                        {t('tour.imageUnavailable', 'No image has been added for this tour.')}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {resolvedDestination && (
                      <span className="text-caption text-gold-600 dark:text-gold-400 uppercase tracking-widest mb-1 block">
                        {resolvedDestination}
                      </span>
                    )}

                    <h3
                      className="text-display-md text-obsidian-900 dark:text-ivory-50 mb-3 line-clamp-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {resolvedTitle}
                    </h3>

                    {resolvedOverview && (
                      <p className="text-body-sm text-obsidian-600 dark:text-ivory-300 line-clamp-2 mb-4 flex-grow">
                        {resolvedOverview}
                      </p>
                    )}

                    {/* Footer & Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gold-500/10 dark:border-gray-700 mt-auto">
                      <div>
                        <span className="block text-caption text-obsidian-400 dark:text-ivory-400 mb-1">
                          {t('extensions.startingFrom', 'Starting From')}
                        </span>
                        <span className="text-display-md text-gold-700 dark:text-gold-400 font-bold">
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-900 font-bold px-5 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md text-xs border border-gold-400">
                        {t('suggested.explore', 'Explore Journey')}
                        <span className="rtl-flip">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
