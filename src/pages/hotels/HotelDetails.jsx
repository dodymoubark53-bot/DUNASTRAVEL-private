import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaMapMarkerAlt, FaStar, FaBed, FaChevronRight } from 'react-icons/fa';
import { useHotel } from '../../hooks/useHotels';
import { useCurrency } from '../../context/CurrencyContext';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import ErrorState from '../../components/ui/ErrorState';
import NotFound from '../NotFound';

const HotelDetails = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const routeLocation = useLocation();
  const basePath = routeLocation.pathname.startsWith('/programs') ? '/programs' : '/services';
  const { formatPrice } = useCurrency();
  const { hotel, loading, error } = useHotel(slug);

  if (loading) return <SkeletonLoader count={3} />;
  if (error) {
    return <ErrorState message={error.message || t('hotel.loadError', 'Hotel data could not be loaded.')} />;
  }
  if (!hotel) return <NotFound />;

  const stars = Number.isFinite(Number(hotel.stars)) ? Number(hotel.stars) : 0;
  const rating = Number.isFinite(Number(hotel.rating)) ? Number(hotel.rating) : null;
  const price = Number.isFinite(Number(hotel.pricePerNight)) ? Number(hotel.pricePerNight) : null;
  const amenities = Array.isArray(hotel.amenities)
    ? hotel.amenities.filter((item) => typeof item === 'string')
    : hotel.amenities && typeof hotel.amenities === 'object'
      ? Object.entries(hotel.amenities)
          .filter(([, enabled]) => enabled === true)
          .map(([name]) => name.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()))
      : [];
  const hotelLocation = [hotel.city, hotel.destinationSlug].filter(Boolean).join(', ');

  return (
    <main className="min-h-screen bg-obsidian-50 pb-24 text-obsidian-900">
      <Helmet>
        <title>{hotel.name} | Dunas Travel</title>
        <meta name="description" content={hotel.description || `${hotel.name} — ${hotelLocation}`} />
      </Helmet>

      {/* Hero Banner */}
      <section className="relative min-h-[480px] overflow-hidden bg-obsidian-900 text-white">
        {hotel.heroImageUrl ? <img src={hotel.heroImageUrl} alt={hotel.heroImageAlt || hotel.name} className="absolute inset-0 h-full w-full object-cover" /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/65 to-obsidian-900/20" />
        <div className="container relative z-10 mx-auto flex min-h-[480px] items-end px-6 py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 mb-4">
              <Link to="/" className="hover:text-white transition-colors">{t('nav.home', 'Home')}</Link>
              <span className="rtl-flip text-[10px]"><FaChevronRight /></span>
              <Link to="/services/hotels" className="hover:text-white transition-colors">{t('nav.hotels', 'Hotels')}</Link>
              <span className="rtl-flip text-[10px]"><FaChevronRight /></span>
              <span className="text-white/80">{hotel.name}</span>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-4 text-gold-400">
              {stars > 0 ? (
                <span className="flex items-center gap-1" aria-label={`${stars} stars`}>
                  {Array.from({ length: stars }, (_, index) => <FaStar key={index} />)}
                </span>
              ) : null}
              {hotelLocation ? (
                <span className="flex items-center gap-2 text-white/85"><FaMapMarkerAlt />{hotelLocation}</span>
              ) : null}
            </div>
            <h1 className="text-4xl font-bold md:text-6xl font-display" style={{ fontFamily: "'Playfair Display', serif" }}>{hotel.name}</h1>
            {hotel.description ? <p className="mt-6 max-w-2xl text-lg text-white/80 leading-relaxed">{hotel.description}</p> : null}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto grid gap-12 px-6 py-16 lg:grid-cols-[1fr_340px]">
        <div className="space-y-12">
          {/* Amenities */}
          <div>
            <h2 className="mb-6 text-3xl font-bold font-display" style={{ fontFamily: "'Playfair Display', serif" }}>{t('hotel.amenities', 'Amenities & Features')}</h2>
            {amenities.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 rounded-xl border border-gold-500/15 bg-white p-4 shadow-sm">
                    <FaCheckCircle className="shrink-0 text-gold-500" />
                    <span className="font-medium text-obsidian-800">{amenity}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-obsidian-600">{t('hotel.noAmenities', 'No amenities have been published for this hotel.')}</p>}
          </div>

          {/* Rooms & Suites */}
          {hotel.rooms?.length ? (
            <div>
              <h2 className="mb-6 text-3xl font-bold font-display" style={{ fontFamily: "'Playfair Display', serif" }}>{t('hotel.rooms', 'Available Rooms & Suites')}</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {hotel.rooms.map((room) => (
                  <div key={room.id || room.slug} className="rounded-2xl border border-gold-500/20 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-obsidian-900">{room.name}</h3>
                        <span className="rounded-full bg-gold-500/10 px-3 py-1 text-xs font-bold text-gold-700">
                          {room.mealPlan || t('hotel.roomOnly', 'Room Only')}
                        </span>
                      </div>
                      {room.description ? (
                        <p className="text-sm text-obsidian-600 mb-4">{room.description}</p>
                      ) : null}
                      {room.maxOccupancy ? (
                        <p className="text-xs text-obsidian-500 mb-4 flex items-center gap-1.5">
                          <FaBed className="text-gold-500" />
                          <span>{t('hotel.maxGuests', 'Up to {{count}} guests', { count: room.maxOccupancy })}</span>
                        </p>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                      <div>
                        <span className="block text-xs text-obsidian-400">{t('hotel.perNight', 'Per Night')}</span>
                        <strong className="text-xl text-gold-600">{formatPrice(room.ratePerNight)}</strong>
                      </div>
                      <Link
                        to={`${basePath}/hotels/${encodeURIComponent(hotel.slug)}/${encodeURIComponent(room.slug)}`}
                        className="rounded-full bg-gold-500 hover:bg-gold-600 px-4 py-2 text-xs font-bold text-obsidian-900 transition"
                      >
                        {t('hotel.bookRoom', 'Book Room')}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Sidebar Info */}
        <aside className="h-fit rounded-2xl bg-obsidian-900 p-7 text-white shadow-xl sticky top-28 border border-gold-500/20">
          {rating !== null ? (
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-5">
              <span className="text-ivory-200">{t('hotel.rating', 'Rating')}</span>
              <div className="flex items-center gap-1">
                <FaStar className="text-gold-500" />
                <strong className="text-gold-400">{rating.toFixed(1)} / 5</strong>
              </div>
            </div>
          ) : null}
          {price !== null ? (
            <div className="mb-7">
              <span className="block text-sm text-white/60">{t('hotel.pricePerNight', 'Starting from / night')}</span>
              <strong className="text-3xl text-gold-400 font-display">{formatPrice(price)}</strong>
            </div>
          ) : null}
          <Link
            to={`/contact?hotel=${encodeURIComponent(hotel.slug)}`}
            className="block rounded-full bg-gold-500 px-6 py-3 text-center font-bold text-obsidian-900 transition hover:bg-gold-400 shadow-gold-glow"
          >
            {t('hotel.requestBooking', 'Request Reservation')}
          </Link>
        </aside>
      </section>
    </main>
  );
};

export default HotelDetails;
