import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FaCheck,
  FaMapMarkerAlt,
  FaStar,
  FaUserFriends,
  FaDoorClosed,
  FaCogs,
  FaExpandAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from 'react-icons/fa';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import { useServices } from '../../hooks/useServices';
import { useMedia } from '../../hooks/useMedia';
import { transportation as fallbackTransportation } from '../../data/transportation';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import ErrorState from '../../components/ui/ErrorState';
import TransportationForm from '../../components/booking/TransportationForm';
import { useCurrency } from '../../context/CurrencyContext';
import Button from '../../components/ui/Button';

const Transportation = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const { formatPrice } = useCurrency();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { services: rawTransportation = [], loading, error } = useServices('transportation');
  const { galleryImages: mediaLibraryFleet = [] } = useMedia({ category: 'transport' });

  const transportationList = useMemo(() => {
    if (Array.isArray(rawTransportation) && rawTransportation.length > 0) {
      return fallbackTransportation.map((staticItem) => {
        const apiMatch = rawTransportation.find(
          (api) => api.id === staticItem.id || api.name === staticItem.name
        );
        return apiMatch ? { ...staticItem, ...apiMatch } : staticItem;
      });
    }
    return fallbackTransportation;
  }, [rawTransportation]);

  // Gallery marquee images derived dynamically from Media Library "Transportation Fleet" category,
  // falling back to vehicle fleet cards if no media library assets have been uploaded yet.
  const galleryImages = useMemo(() => {
    if (Array.isArray(mediaLibraryFleet) && mediaLibraryFleet.length > 0) {
      const urls = mediaLibraryFleet
        .map((img) => (typeof img === 'string' ? img : img.url || img.secureUrl))
        .filter(Boolean);
      if (urls.length > 0) return urls;
    }
    const list = transportationList.map((v) => v.image || v.heroImageUrl).filter(Boolean);
    return list.length > 0 ? list : fallbackTransportation.map((v) => v.image);
  }, [mediaLibraryFleet, transportationList]);

  // Autoplay slider effect
  useEffect(() => {
    if (!isAutoPlaying || isLightboxOpen || galleryImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isAutoPlaying, isLightboxOpen, galleryImages.length]);

  const filters = [
    { id: 'All', label: t('transportation.filter.all', 'All') },
    { id: 'Buses', label: t('transportation.filter.buses', 'Buses') },
    { id: 'Coaster Vehicles', label: t('transportation.filter.coasters', 'Coaster Vehicles') },
    { id: 'Private Vehicles', label: t('transportation.filter.private', 'Private Vehicles') },
  ];

  const filteredVehicles = transportationList.filter((vehicle) => {
    const cat = (vehicle.vehicleCategory || vehicle.category || vehicle.serviceType || '').toLowerCase();
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Buses') return cat === 'bus';
    if (activeFilter === 'Coaster Vehicles') return cat === 'coaster';
    if (activeFilter === 'Private Vehicles') return cat === 'private';
    return true;
  });

  const fleetFeatures = [...new Set(transportationList.flatMap((vehicle) => vehicle.features || []))];

  const handleReserveClick = (vehicleId = '') => {
    setSelectedVehicleId(vehicleId);
    const element = document.getElementById('reservation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openLightbox = (index) => {
    setActiveGalleryIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const prevGalleryImage = (e) => {
    e?.stopPropagation();
    setActiveGalleryIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  };

  const nextGalleryImage = (e) => {
    e?.stopPropagation();
    setActiveGalleryIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  };

  if (loading && (!transportationList || transportationList.length === 0)) {
    return <SkeletonLoader count={4} />;
  }

  if (error && (!transportationList || transportationList.length === 0)) {
    return <ErrorState message={error.message || t('transportation.loadError', 'Transportation services could not be loaded.')} />;
  }

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('nav.transportation', 'Transportation')} | {t('services.seoServices', 'Luxury Services')}</title>
        <meta name="description" content={t('transportation.seoDesc', 'Premium vehicles with professional drivers across Egypt, Jordan & Turkey')} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/imgs/services/transportation-cover.webp"
            alt="Transportation Hero"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15,13,11,0.3), rgba(15,13,11,0.65))' }}
          ></div>
        </div>
        <motion.div className="relative z-10 text-center px-6 mt-20" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.span variants={fadeInUp} className="text-gold-500 uppercase tracking-widest text-caption block mb-4">
            {t('services.subtitle', 'Tailored Experiences')}
          </motion.span>
          <motion.h1
            variants={fadeInUp}
            className="text-display-xl text-ivory-50 font-display"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('nav.transportation', 'Transportation')}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body-lg text-ivory-300 mt-4 max-w-2xl mx-auto">
            {t('transportation.heroDesc', 'Travel in Comfort & Style')}
          </motion.p>
        </motion.div>
      </section>

      {/* Filter Tabs */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-8 py-3 rounded-full text-body-md font-semibold transition-all duration-300 cursor-pointer ${
                activeFilter === filter.id
                  ? 'bg-gold-500 text-obsidian-900 shadow-[0_0_20px_rgba(201,162,39,0.4)]'
                  : 'bg-ivory-50 text-obsidian-700 hover:bg-gold-50 shadow-sm border border-gray-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Vehicles Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 ${isRtl ? 'text-right' : 'text-left'}`}>
          {filteredVehicles.map((vehicle, index) => {
            const cat = (vehicle.vehicleCategory || vehicle.category || vehicle.serviceType || 'bus').toLowerCase();
            const categoryBadge =
              cat === 'bus'
                ? t('transportation.filter.buses', 'Buses')
                : cat === 'coaster'
                ? t('transportation.filter.coasters', 'Coaster Vehicles')
                : t('transportation.filter.private', 'Private Vehicles');

            const vehicleImg =
              vehicle.image ||
              vehicle.heroImageUrl ||
              (cat === 'private'
                ? '/imgs/transportation/privte.jpeg'
                : cat === 'coaster'
                ? '/imgs/transportation/costar.jpeg'
                : '/imgs/transportation/bus1.jpeg');

            return (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{
                  y: -6,
                  boxShadow: '0 0 32px rgba(201,162,39,0.22)',
                  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                }}
                className="bg-ivory-50 rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => handleReserveClick(vehicle.id)}
                    className="block relative h-64 overflow-hidden cursor-pointer bg-obsidian-900"
                  >
                    <img
                      src={vehicleImg}
                      alt={t(`data.${vehicle.name}`, vehicle.name)}
                      className="w-full h-full object-cover cinematic-transition group-hover:scale-[1.06]"
                      onError={(e) => {
                        e.currentTarget.src = '/imgs/transportation/bus1.jpeg';
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-gold-500 text-obsidian-900 text-caption uppercase px-3 py-1 rounded-full shadow-md font-bold">
                      {categoryBadge}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-ivory-50 font-semibold flex items-center gap-2">
                        <span>{t('transportation.reserveNow', 'Reserve Now')}</span>
                        <span className={isRtl ? 'rotate-180 inline-block' : 'inline-block'}>&rarr;</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3
                          onClick={() => handleReserveClick(vehicle.id)}
                          className="text-display-md text-xl text-obsidian-900 font-display cursor-pointer hover:text-gold-600 transition-colors"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {t(`data.${vehicle.name}`, vehicle.name)}
                        </h3>
                        {vehicle.rating && (
                          <div className="flex items-center gap-1.5 mt-1 text-sm text-gold-600">
                            <FaStar className="text-gold-500" />
                            <span className="font-bold">{vehicle.rating}</span>
                            {vehicle.reviews && (
                              <span className="text-obsidian-400 text-xs">
                                ({vehicle.reviews} {t('common.reviews', 'reviews')})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-caption text-obsidian-700 mb-4 pb-4 border-b border-gray-100">
                      <span className="flex items-center gap-1">
                        <FaUserFriends className="text-gold-500" /> {vehicle.seats || vehicle.capacity || 50} {t('transportation.seatsCount', 'Seats')}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCogs className="text-gold-500" /> {vehicle.transmission || 'Auto'}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaDoorClosed className="text-gold-500" /> {vehicle.doors || 2} {t('transportation.doorsCount', 'Doors')}
                      </span>
                    </div>

                    <ul className="mb-6 space-y-2">
                      {vehicle.features?.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-caption text-obsidian-700">
                          <FaCheck className="text-sage-500 flex-shrink-0" size={12} />
                          <span className="truncate">{t(`data.${feature}`, feature)}</span>
                        </li>
                      ))}
                      {vehicle.features?.length > 3 && (
                        <li className="text-caption text-obsidian-500 italic">
                          {t('transportation.moreFeatures', '+ {{count}} more features', {
                            count: vehicle.features.length - 3,
                          })}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-gray-100 mt-auto">
                  <div>
                    <span className="text-body-lg font-bold text-obsidian-900">
                      {formatPrice(vehicle.pricePerDay || vehicle.pricePerTrip || vehicle.basePriceUsd || 0)}
                    </span>
                    <span className="text-caption text-obsidian-500"> / {t('transportation.trip', 'trip')}</span>
                  </div>
                  <button
                    onClick={() => handleReserveClick(vehicle.id)}
                    className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-obsidian-900 font-bold rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(201,162,39,0.3)] hover:shadow-[0_0_20px_rgba(201,162,39,0.5)] cursor-pointer text-sm flex items-center gap-1.5"
                  >
                    <span>{t('transportation.reserveNow', 'Reserve Now')}</span>
                    <span className={isRtl ? 'rotate-180 inline-block' : ''}>&rarr;</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Private & Comfortable Transfers Block */}
      {transportationList.length > 0 && (
        <section className="container mx-auto px-6 py-12 mb-20 bg-obsidian-900 rounded-3xl border border-[rgba(245,166,35,0.2)] text-ivory-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-6 md:p-10">
            <div>
              <span className="text-gold-500 uppercase tracking-widest text-caption block mb-4">
                {t('transportation.static.subtitle', 'Premium Transfer Services')}
              </span>
              <h2
                className="text-display-md md:text-display-lg text-ivory-50 mb-6 font-display"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t('transportation.static.title', 'Private & Comfortable Transfers in Egypt')}
              </h2>
              <p className="text-body-lg text-ivory-300 mb-8 leading-relaxed">
                {t(
                  'transportation.static.desc',
                  'Enjoy a smooth and comfortable journey with our private transfer services. Our professional drivers and representatives will be waiting for you at the airport, hotel, or any requested location to ensure a safe and hassle-free experience.'
                )}
              </p>

              <div className="mb-6">
                <h4 className="text-gold-400 font-semibold text-lg mb-4">
                  {t('transportation.static.includeTitle', 'Our transfer services include:')}
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fleetFeatures.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-body-md text-ivory-300">
                      <span className="text-gold-500 text-lg font-bold">✓</span>
                      <span>{t(`data.${item}`, item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-obsidian-800/80 backdrop-blur-sm rounded-2xl p-8 border border-ivory-50/5 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-xl font-display text-gold-500 mb-6 flex items-center gap-2 border-b border-ivory-50/10 pb-4">
                  <FaMapMarkerAlt className="text-gold-500" />
                  {t('transportation.static.destTitle', 'Popular Destinations')}
                </h3>
                <ul className="space-y-4">
                  {transportationList.map((vehicle) => {
                    const cat = (vehicle.vehicleCategory || vehicle.category || vehicle.serviceType || 'bus').toLowerCase();
                    return (
                      <li key={vehicle.id} className="flex items-start gap-3 text-body-md text-ivory-300">
                        <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2 shrink-0"></span>
                        <span>
                          {t(`data.${vehicle.name}`, vehicle.name)} —{' '}
                          {t(`transportation.category.${cat}`, cat)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-8">
                <Button
                  variant="gold-glow"
                  className="w-full py-4 text-lg font-bold rounded-full uppercase tracking-wider cursor-pointer"
                  onClick={() => handleReserveClick('')}
                >
                  {t('transportation.reserveNow', 'Reserve Now')}
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Infinite Moving Marquee Strip Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="w-full py-12 mb-20 bg-obsidian-950 overflow-hidden relative" dir="ltr">
          <style>{`
            @keyframes dunasMarqueeLtr {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            .dunas-marquee-track {
              display: flex;
              width: max-content;
              animation: dunasMarqueeLtr 65s linear infinite;
              will-change: transform;
            }
            .dunas-marquee-track:hover {
              animation-play-state: paused;
            }
          `}</style>

          {/* Gradient Edge Fade Overlays for cinematic look */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-obsidian-950 to-transparent z-20"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-obsidian-950 to-transparent z-20"></div>

          {/* Infinite Track Container */}
          <div className="w-full overflow-hidden">
            <div className="dunas-marquee-track flex gap-6 px-4">
              {[...galleryImages, ...galleryImages, ...galleryImages, ...galleryImages].map((imgUrl, idx) => {
                const originalIndex = idx % galleryImages.length;
                return (
                  <div
                    key={idx}
                    onClick={() => openLightbox(originalIndex)}
                    className="relative w-72 sm:w-80 md:w-96 h-56 sm:h-64 md:h-72 flex-shrink-0 rounded-3xl overflow-hidden cursor-pointer group border border-gold-500/25 bg-obsidian-900 shadow-[0_15px_35px_rgba(0,0,0,0.7)] transition-transform duration-500 hover:scale-105 hover:border-gold-500/60"
                  >
                    <img
                      src={imgUrl}
                      alt={`Dunas VIP Fleet ${originalIndex + 1}`}
                      className="w-full h-full object-cover cinematic-transition group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-ivory-50 z-10">
                      <span className="text-caption text-gold-400 font-bold tracking-widest uppercase">
                        DUNAS VIP FLEET
                      </span>
                      <div className="w-8 h-8 rounded-full bg-obsidian-900/80 border border-gold-500/40 text-gold-400 flex items-center justify-center text-xs group-hover:bg-gold-500 group-hover:text-obsidian-900 transition-all">
                        <FaExpandAlt />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal - Click anywhere to close */}
      <AnimatePresence>
        {isLightboxOpen && activeGalleryIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-8 cursor-pointer"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between z-50 text-ivory-50">
              <div className="flex items-center gap-3">
                <span
                  className="text-gold-500 font-bold text-lg font-display"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  DUNAS FLEET
                </span>
                <span className="text-caption text-ivory-400 border-l border-ivory-50/20 pl-3">
                  {activeGalleryIndex + 1} / {galleryImages.length}
                </span>
              </div>
              <button
                onClick={closeLightbox}
                className="w-12 h-12 rounded-full bg-ivory-50/10 hover:bg-gold-500 hover:text-obsidian-900 text-ivory-50 flex items-center justify-center transition-all cursor-pointer text-xl"
              >
                <FaTimes />
              </button>
            </div>

            {/* Main Lightbox View - Clicking image or backdrop closes modal */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevGalleryImage();
                }}
                className="absolute left-2 md:left-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-obsidian-900/80 border border-gold-500/30 hover:bg-gold-500 hover:text-obsidian-900 text-gold-400 flex items-center justify-center transition-all cursor-pointer shadow-2xl text-xl"
              >
                <FaChevronLeft className={isRtl ? 'rotate-180' : ''} />
              </button>

              {/* Main Image */}
              <motion.img
                key={activeGalleryIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                src={galleryImages[activeGalleryIndex]}
                alt={`Dunas Luxury Vehicle ${activeGalleryIndex + 1}`}
                className="max-h-[75vh] max-w-[92vw] object-contain rounded-2xl border border-gold-500/30 shadow-[0_0_50px_rgba(201,162,39,0.3)] cursor-pointer"
              />

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextGalleryImage();
                }}
                className="absolute right-2 md:right-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-obsidian-900/80 border border-gold-500/30 hover:bg-gold-500 hover:text-obsidian-900 text-gold-400 flex items-center justify-center transition-all cursor-pointer shadow-2xl text-xl"
              >
                <FaChevronRight className={isRtl ? 'rotate-180' : ''} />
              </button>
            </div>

            {/* Bottom Thumbnail Strip */}
            <div className="flex justify-center items-center gap-3 overflow-x-auto py-2 z-50 scrollbar-none">
              {galleryImages.map((thumbUrl, tIdx) => (
                <button
                  key={tIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveGalleryIndex(tIdx);
                  }}
                  className={`relative w-16 h-12 md:w-20 md:h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                    tIdx === activeGalleryIndex
                      ? 'border-gold-500 scale-110 shadow-[0_0_15px_rgba(201,162,39,0.6)]'
                      : 'border-transparent opacity-40 hover:opacity-100'
                  }`}
                >
                  <img src={thumbUrl} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reservation Form Section */}
      <section className="container mx-auto px-6 max-w-4xl" id="reservation">
        <div className="text-center mb-12">
          <h2
            className="text-display-lg text-obsidian-900 mb-4 font-display"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('transportation.makeReservation', 'Make a Reservation')}
          </h2>
          <p className="text-body-md text-obsidian-500 max-w-2xl mx-auto">
            {t(
              'transportation.reservationDesc',
              'Book your luxury transportation in advance. We provide professional chauffeurs and premium vehicles to ensure a comfortable and stylish journey.'
            )}
          </p>
        </div>
        <TransportationForm preSelectedVehicleId={selectedVehicleId} />
      </section>
    </div>
  );
};

export default Transportation;
