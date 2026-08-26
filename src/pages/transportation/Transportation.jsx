import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaCog, FaCheck, FaMapMarkerAlt } from 'react-icons/fa';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import { useServices } from '../../hooks/useServices';
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
  const { services: transportation, loading, error } = useServices('transportation');

  if (loading) return <SkeletonLoader count={4} />;
  if (error) return <ErrorState message={error.message || 'Failed to load transportation options'} />;

  const filters = [
    { id: 'All', label: t('transportation.filter.all', 'All') },
    ...[...new Set(transportation.map((service) => service.serviceType))]
      .filter(Boolean)
      .map((serviceType) => ({ id: serviceType, label: String(serviceType).replaceAll('_', ' ') })),
  ];

  const filteredVehicles = transportation.filter(vehicle => {
    if (activeFilter === 'All') return true;
    return vehicle.serviceType === activeFilter;
  });
  const fleetFeatures = [...new Set(transportation.flatMap((vehicle) => vehicle.features || []))];

  const handleReserveClick = (vehicleId = '') => {
    setSelectedVehicleId(vehicleId);
    const element = document.getElementById('reservation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          <motion.span variants={fadeInUp} className="text-gold-500 uppercase tracking-widest text-caption block mb-4">{t('services.subtitle', 'Tailored Experiences')}</motion.span>
          <motion.h1
            variants={fadeInUp}
            className="text-display-xl text-ivory-50"
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
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-8 py-3 rounded-full text-body-md font-semibold transition-all duration-300 ${activeFilter === filter.id
                  ? 'bg-gold-500 text-obsidian-900 shadow-[0_0_20px_rgba(201,162,39,0.4)]'
                  : 'bg-ivory-50 text-obsidian-700 hover:bg-gold-55 shadow-sm border border-gray-100'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Vehicles Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 ${isRtl ? 'text-right' : 'text-left'}`}>
          {filteredVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6, boxShadow: "0 0 32px rgba(201,162,39,0.22)", transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
              className="bg-ivory-50 rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 group"
            >
              <div
                onClick={() => handleReserveClick(vehicle.id)}
                className="block relative h-64 overflow-hidden cursor-pointer"
              >
                {vehicle.image ? <img src={vehicle.image} alt={t(`data.${vehicle.name}`, vehicle.name)} className="w-full h-full object-cover cinematic-transition group-hover:scale-[1.06]" /> : null}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-ivory-50 font-semibold flex items-center gap-2">
                    <span className={isRtl ? 'rtl-flip' : ''}>{t('transportation.reserveNow', 'Reserve Now')} &rarr;</span>
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-gold-600 uppercase tracking-widest text-[11px] font-bold block mb-1">
                      {String(vehicle.serviceType).replaceAll('_', ' ')}
                    </span>
                    <h3
                      onClick={() => handleReserveClick(vehicle.id)}
                      className="text-display-md text-xl text-obsidian-900 font-display cursor-pointer hover:text-gold-600 transition-colors"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {t(`data.${vehicle.name}`, vehicle.name)}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-caption text-obsidian-700">
                    <FaCog className="text-gold-500" />
                    {t('transportation.basePrice', 'Base transfer price')}
                  </div>
                </div>

                <ul className="mb-6 space-y-2">
                  {vehicle.features.slice(0, 2).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-caption text-obsidian-700">
                      <FaCheck className="text-sage-500 flex-shrink-0" size={12} />
                      <span className="truncate">{t(`data.${feature}`, feature)}</span>
                    </li>
                  ))}
                  {vehicle.features.length > 2 && (
                    <li className="text-caption text-obsidian-500 italic">
                      {t('transportation.moreFeatures', '+ {{count}} more features', { count: vehicle.features.length - 2 })}
                    </li>
                  )}
                </ul>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-body-lg font-bold text-obsidian-900">{formatPrice(vehicle.pricePerDay)}</span>
                    <span className="text-caption text-obsidian-500"> / {t('transportation.trip', 'trip')}</span>
                  </div>
                  <button
                    onClick={() => handleReserveClick(vehicle.id)}
                    className="text-body-md font-medium text-gold-600 hover:text-gold-700 transition-colors rounded-full cursor-pointer outline-none"
                  >
                    <span className={isRtl ? 'rtl-flip' : ''}>{t('transportation.reserveNow', 'Reserve Now')} &rarr;</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Private & Comfortable Transfers Block */}
      <section className="container mx-auto px-6 py-12 mb-20 bg-obsidian-900 rounded-3xl border border-[rgba(245,166,35,0.2)] text-ivory-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-6 md:p-10">
          <div>
            <span className="text-gold-500 uppercase tracking-widest text-caption block mb-4">
              {t('transportation.static.subtitle', 'Premium Transfer Services')}
            </span>
            <h2 className="text-display-md md:text-display-lg text-ivory-50 mb-6 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
              Private & Comfortable Transfers in Egypt
            </h2>
            <p className="text-body-lg text-ivory-300 mb-8 leading-relaxed">
              Enjoy a smooth and comfortable journey with our private transfer services. Our professional drivers and representatives will be waiting for you at the airport, hotel, or any requested location to ensure a safe and hassle-free experience.
            </p>

            <div className="mb-6">
              <h4 className="text-gold-400 font-semibold text-lg mb-4">{t('transportation.static.includeTitle', 'Our transfer services include:')}</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fleetFeatures.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-body-md text-ivory-300">
                    <span className="text-gold-500 text-lg font-bold">✓</span>
                    <span>{item}</span>
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
                {transportation.map((vehicle) => (
                  <li key={vehicle.id} className="flex items-start gap-3 text-body-md text-ivory-300">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2 shrink-0"></span>
                    <span>{vehicle.name} — {String(vehicle.serviceType).replaceAll('_', ' ')}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <Button
                variant="gold-glow"
                className="w-full py-4 text-lg font-semibold rounded-full uppercase tracking-wider"
                onClick={() => handleReserveClick('')}
              >
                Request your transfer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Form Section */}
      <section className="container mx-auto px-6 max-w-4xl" id="reservation">
        <div className="text-center mb-12">
          <h2 className="text-display-lg text-obsidian-900 mb-4 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>{t('transportation.makeReservation', 'Make a Reservation')}</h2>
          <p className="text-body-md text-obsidian-500 max-w-2xl mx-auto">
            {t('transportation.reservationDesc', 'Book your luxury transportation in advance. We provide professional chauffeurs and premium vehicles to ensure a comfortable and stylish journey.')}
          </p>
        </div>
        <TransportationForm preSelectedVehicleId={selectedVehicleId} />
      </section>
    </div>
  );
};

export default Transportation;
