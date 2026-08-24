import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { useCmsBlock } from '../../hooks/useCmsBlock';
import { useCurrency } from '../../context/CurrencyContext';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import ErrorState from '../../components/ui/ErrorState';
import NotFound from '../NotFound';

function readCatalog(block) {
  if (Array.isArray(block)) return block;
  if (Array.isArray(block?.content)) return block.content;
  return [];
}

const HotelDetails = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { formatPrice } = useCurrency();
  const { block, loading, error } = useCmsBlock('hotels_catalog');
  const hotel = readCatalog(block).find(
    (item) => item?.isActive !== false && (item.id === slug || item.slug === slug),
  );

  if (loading) return <SkeletonLoader count={3} />;
  if (error) {
    return <ErrorState message={error.message || t('hotel.loadError', 'Hotel data could not be loaded.')} />;
  }
  if (!hotel) return <NotFound />;

  const stars = Number.isFinite(Number(hotel.stars)) ? Number(hotel.stars) : 0;
  const rating = Number.isFinite(Number(hotel.rating)) ? Number(hotel.rating) : null;
  const price = Number.isFinite(Number(hotel.pricePerNight)) ? Number(hotel.pricePerNight) : null;
  const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];
  const location = [hotel.city, hotel.destination].filter(Boolean).join(', ');

  return (
    <main className="min-h-screen bg-obsidian-50 pb-24 text-obsidian-900">
      <Helmet>
        <title>{hotel.name} | Dunas Travel</title>
        <meta name="description" content={hotel.description || `${hotel.name} — ${location}`} />
      </Helmet>

      <section className="relative min-h-[480px] overflow-hidden bg-obsidian-900 text-white">
        {hotel.image ? (
          <img src={hotel.image} alt={hotel.name} className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/65 to-obsidian-900/20" />
        <div className="container relative z-10 mx-auto flex min-h-[480px] items-end px-6 py-16">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-4 text-gold-400">
              {stars > 0 ? (
                <span className="flex items-center gap-1" aria-label={`${stars} stars`}>
                  {Array.from({ length: stars }, (_, index) => <FaStar key={index} />)}
                </span>
              ) : null}
              {location ? (
                <span className="flex items-center gap-2 text-white/85"><FaMapMarkerAlt />{location}</span>
              ) : null}
            </div>
            <h1 className="text-4xl font-bold md:text-6xl">{hotel.name}</h1>
            {hotel.description ? <p className="mt-6 max-w-2xl text-lg text-white/80">{hotel.description}</p> : null}
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-6 py-16 lg:grid-cols-[1fr_340px]">
        <div>
          <h2 className="mb-6 text-3xl font-bold">{t('hotel.amenities', 'Amenities')}</h2>
          {amenities.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-3 rounded-xl border border-gold-500/15 bg-white p-4">
                  <FaCheckCircle className="shrink-0 text-gold-500" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-obsidian-500">{t('hotel.noAmenities', 'Amenities have not been added yet.')}</p>
          )}
        </div>

        <aside className="h-fit rounded-2xl bg-obsidian-900 p-7 text-white shadow-xl">
          {rating !== null ? (
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-5">
              <span>{t('hotel.rating', 'Rating')}</span>
              <strong className="text-gold-400">{rating.toFixed(1)} / 5</strong>
            </div>
          ) : null}
          {price !== null ? (
            <div className="mb-7">
              <span className="block text-sm text-white/60">{t('hotel.pricePerNight', 'Price per night')}</span>
              <strong className="text-3xl text-gold-400">{formatPrice(price)}</strong>
            </div>
          ) : null}
          <Link
            to={`/contact?hotel=${encodeURIComponent(hotel.id)}`}
            className="block rounded-full bg-gold-500 px-6 py-3 text-center font-bold text-obsidian-900 transition hover:bg-gold-400"
          >
            {t('hotel.requestBooking', 'Request this hotel')}
          </Link>
        </aside>
      </section>
    </main>
  );
};

export default HotelDetails;
