
import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../animations/variants';
import Button from '../components/ui/Button';
import { useServices } from '../hooks/useServices';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import ErrorState from '../components/ui/ErrorState';
import { useCurrency } from '../context/CurrencyContext';
import { resolveLocalizedText } from '../utils/titleHelper';

import HotelDetails from './hotels/HotelDetails';

const Services = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const { formatPrice } = useCurrency();
  const params = useParams();
  const location = useLocation();
  const service = params.service || (location.pathname.includes('/hotels') ? 'hotels' : null);
  const prefix = location.pathname.startsWith('/programs') ? '/programs' : '/services';
  const { services: allServicesData, loading, error } = useServices(service);

  const categories = [
    { id: 'hotels', title: t('nav.hotels', 'Luxury Hotels'), desc: t('services.hotelsDesc', 'Hand-picked 5-star accommodations offering unparalleled views and comfort.') },
    { id: 'safari', title: t('nav.safari', 'Desert Safari'), desc: t('services.safariDesc', 'Thrilling off-road adventures with premium SUVs and expert drivers.') },
    { id: 'camping', title: t('nav.camping', 'Glamping'), desc: t('services.campingDesc', 'Luxury tented camps under the stars with private chefs and amenities.') },
    { id: 'cruises', title: t('nav.cruises', 'Nile Cruises'), desc: t('services.cruisesDesc', 'Boutique Dahabiyas and luxury ships sailing the timeless river.') },
    { id: 'transportation', title: t('nav.transportation', 'Transportation'), desc: t('services.transportationShortDesc', 'Premium vehicles with professional drivers.') }
  ];

  const filteredServices = service ? allServicesData.filter(s => s.category === service) : allServicesData;

  if (loading) return <SkeletonLoader count={6} />;
  if (error) return <ErrorState message={error.message || 'Failed to load services'} />;

  return (
    <div className="w-full bg-obsidian-50 dark:bg-[#0f0f1a] pb-24 text-left rtl:text-right">
      <Helmet>
        <title>{service ? `${t(`nav.${service}`, service.charAt(0).toUpperCase() + service.slice(1))} | ${t('services.seoServices', 'Luxury Services')}` : t('services.seoTitle', 'Our Services | Luxury Travel')}</title>
        <meta name="description" content={t('services.seoDesc', 'Discover our tailored luxury services including 5-star hotels, desert safaris, glamping, and private Nile cruises.')} />
      </Helmet>
      <section className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {service === 'safari' ? (
            <>
              <img
                src="https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_1920,c_fill/v1783026771/6_q4vcdg.jpg"
                alt="Desert Safari Sunset"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15,13,11,0.3), rgba(15,13,11,0.65))' }}
              ></div>
            </>
          ) : service === 'cruises' ? (
            <>
              <img
                src="/imgs/italy/Nile and Red Sea with Hurghada - Classic Version.jpg"
                alt="Nile River Cruise Luxury Egypt Sunset"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15,13,11,0.3), rgba(15,13,11,0.65))' }}
              ></div>
            </>
          ) : service === 'camping' ? (
            <>
              <img
                src="https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_1920,c_fill/v1783026771/8_mpyvu4.jpg"
                alt="Luxury Desert Camping Starry Night"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15,13,11,0.3), rgba(15,13,11,0.65))' }}
              ></div>
            </>
          ) : service === 'hotels' ? (
            <>
              <img
                src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/0d/4e/68/henann-park-resort.jpg?w=600&h=600&s=1"
                alt="Luxury Hotel Exterior"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15,13,11,0.3), rgba(15,13,11,0.65))' }}
              ></div>
            </>
          ) : service === 'transportation' ? (
            <>
              <img
                src="/imgs/services/transportation-cover.webp"
                alt="Luxury Car Scenic Road"
                width="1200"
                height="686"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15,13,11,0.3), rgba(15,13,11,0.65))' }}
              ></div>
            </>
          ) : (
            <>
              <img
                src="https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_1920,c_fill/v1783026771/11_xydddd.jpg"
                alt="Luxury Travel Resort Sunset"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15,13,11,0.4), rgba(15,13,11,0.7))' }}
              ></div>
            </>
          )}
        </div>
        <motion.div className="relative z-10 text-center px-6 mt-20" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.span variants={fadeInUp} className="text-gold-500 uppercase tracking-widest text-caption block mb-4">{t('services.subtitle', 'Tailored Experiences')}</motion.span>
          <motion.h1
            variants={fadeInUp}
            className="text-display-xl text-ivory-50"
            style={['safari', 'cruises', 'camping', 'hotels', 'transportation', 'classic'].includes(service) ? { fontFamily: "'Playfair Display', serif" } : {}}
          >
            {service === 'safari' ? t('nav.safari', 'Desert Safari') :
              service === 'cruises' ? t('nav.cruises', 'Nile Cruises') :
                service === 'camping' ? t('nav.camping', 'Glamping') :
                  service === 'hotels' ? t('nav.hotels', 'Luxury Hotels') :
                    service === 'transportation' ? t('nav.transportation', 'Transportation') :
                      service === 'classic' ? t('nav.classicPrograms', 'Classic Programs') : t('services.ourServices', 'Our Services')}
          </motion.h1>
          {service === 'safari' ? (
            <motion.p variants={fadeInUp} className="text-body-lg text-ivory-300 mt-4 max-w-2xl mx-auto">
              {t('services.safariDesc', 'Embark on an unforgettable off-road adventure through shifting sands and majestic desert landscapes.')}
            </motion.p>
          ) : service === 'cruises' ? (
            <motion.p variants={fadeInUp} className="text-body-lg text-ivory-300 mt-4 max-w-2xl mx-auto">
              {t('services.cruisesDesc', 'Sail Through the Heart of Ancient Egypt')}
            </motion.p>
          ) : service === 'camping' ? (
            <motion.p variants={fadeInUp} className="text-body-lg text-ivory-300 mt-4 max-w-2xl mx-auto">
              {t('services.campingDesc', 'Experience luxury tented camps under the stars with private chefs and premium amenities.')}
            </motion.p>
          ) : service === 'hotels' ? (
            <motion.p variants={fadeInUp} className="text-body-lg text-ivory-300 mt-4 max-w-2xl mx-auto">
              {t('services.hotelsDesc', 'Hand-picked 5-star accommodations offering unparalleled views and absolute comfort.')}
            </motion.p>
          ) : service === 'transportation' ? (
            <motion.p variants={fadeInUp} className="text-body-lg text-ivory-300 mt-4 max-w-2xl mx-auto">
              {t('services.transportationDesc', 'Premium vehicles with professional drivers ensuring absolute comfort and safety.')}
            </motion.p>
          ) : (service && service !== 'classic') && (
            <motion.p variants={fadeInUp} className="text-body-lg text-ivory-300 mt-4 capitalize">
              {t('services.explore', 'Explore')} {t(`nav.${service}`, service)}
            </motion.p>
          )}
        </motion.div>
      </section>

      <section className="container mx-auto px-6 py-12">
        {/* Category Selector */}
        {!service && (
          <div className="flex overflow-x-auto hide-scrollbar md:flex-wrap md:justify-center gap-4 mb-16 pb-4">
            <Link to={prefix} className="shrink-0">
              <Button variant={!service ? 'gold-glow' : 'outline-gold'} className="px-6 py-2 text-sm">{t('services.allServices', 'All Services')}</Button>
            </Link>
            {categories.map(cat => (
              <Link key={cat.id} to={`${prefix}/${cat.id}`} className="shrink-0">
                <Button variant={service === cat.id ? 'gold-glow' : 'outline-gold'} className="px-6 py-2 text-sm">{cat.title}</Button>
              </Link>
            ))}
          </div>
        )}

        {/* Services Grid */}
        {filteredServices.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {filteredServices.map((item) => {
              const isSiwa = item.slug === 'siwa-oasis-alexandria';
              return (
                <Link
                  key={item.id}
                  to={['hurghada-4d3n', 'sharm-4d3n', 'siwa-oasis-alexandria'].includes(item.slug) ? `/trips/${item.slug}` : `${prefix}/${item.category}/${item.slug}`}
                  className="group h-full flex flex-col cursor-pointer no-underline"
                >
                  <motion.div
                    variants={fadeInUp}
                    className="bg-ivory-50 dark:bg-[#1a1a30] rounded-2xl overflow-hidden shadow-card group h-full flex flex-col transition-all border border-obsidian-200/40 dark:border-gray-700"
                  >
                    <div className="relative h-60 overflow-hidden">
                      <div className="absolute top-4 left-4 z-10 bg-gold-500 text-obsidian-900 text-caption uppercase px-3 py-1 rounded-full shadow-md font-bold">
                        {resolveLocalizedText(item.location, t, lang)}
                      </div>
                      {isSiwa && (
                        <div className="absolute top-4 right-4 z-10 bg-obsidian-900/80 backdrop-blur-md text-gold-500 text-caption px-3 py-1 rounded-full border border-gold-500/20 shadow-md">
                          {resolveLocalizedText('tour_siwa_duration', t, lang)}
                        </div>
                      )}
                      {item.images?.[0] || item.heroImage || item.image ? <img src={item.images?.[0] || item.heroImage || item.image} alt={resolveLocalizedText(item.title || item.name, t, lang)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" /> : <div className="h-full w-full bg-obsidian-200 dark:bg-obsidian-800" aria-label={t('common.imageUnavailable', 'Image unavailable')} />}
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      {isSiwa ? (
                        <>
                          <h3 className="text-display-md text-obsidian-900 dark:text-ivory-50 mb-3 text-xl line-clamp-1 font-semibold">{resolveLocalizedText(item.title, t, lang)}</h3>
                          <p className="text-body-sm text-obsidian-600 dark:text-ivory-300 line-clamp-2 mb-6">{resolveLocalizedText(item.shortDesc, t, lang)}</p>
                          <div className="flex justify-end items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                            <Button variant="outline-gold" className="px-4 py-2 text-sm group-hover:bg-gold-500 group-hover:text-obsidian-900 group-hover:shadow-[0_0_15px_rgba(201,162,39,0.4)] transition-all">{t('tourCard.viewDetails', 'View Details')}</Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-caption text-obsidian-400 dark:text-ivory-400 uppercase tracking-widest">{t(`nav.${item.category}`, item.category)}</span>
                            <div className="flex items-center text-gold-600 dark:text-gold-400 text-caption font-medium">
                              <span className="mr-1">★</span> {item.rating}
                            </div>
                          </div>
                          <h3 className="text-display-md text-obsidian-900 dark:text-ivory-50 mb-3 text-xl line-clamp-1 font-semibold">{resolveLocalizedText(item.title, t, lang)}</h3>
                          <p className="text-body-sm text-obsidian-600 dark:text-ivory-300 line-clamp-2 mb-6">{resolveLocalizedText(item.shortDesc, t, lang)}</p>
                          <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div>
                              <span className="text-caption text-obsidian-400 dark:text-ivory-400 block">{t('tourCard.from', 'From')}</span>
                              <span className="text-body-lg font-semibold text-obsidian-900 dark:text-gold-400">{formatPrice(item.price)}</span>
                            </div>
                            <Button variant="outline-gold" className="px-4 py-2 text-sm group-hover:bg-gold-500 group-hover:text-obsidian-900 group-hover:shadow-[0_0_15px_rgba(201,162,39,0.4)] transition-all">{t('tourCard.viewDetails', 'View Details')}</Button>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </section>

    </div>
  );
};

export default Services;
