import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaBed, FaUserFriends } from 'react-icons/fa';
import { useHotel } from '../../hooks/useHotels';
import { useCurrency } from '../../context/CurrencyContext';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import ErrorState from '../../components/ui/ErrorState';
import NotFound from '../NotFound';

const RoomDetails = () => {
  const { t } = useTranslation();
  const { hotelSlug, roomSlug } = useParams();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/programs') ? '/programs' : '/services';
  const { formatPrice } = useCurrency();
  const { hotel, loading, error } = useHotel(hotelSlug);

  if (loading) return <SkeletonLoader count={2} />;
  if (error) return <ErrorState message={error.message || t('hotel.room.loadError', 'Room data could not be loaded.')} />;
  if (!hotel) return <NotFound />;

  const room = Array.isArray(hotel.rooms)
    ? hotel.rooms.find((candidate) => candidate.slug === roomSlug)
    : null;
  if (!room) return <NotFound />;

  return (
    <main className="min-h-screen bg-obsidian-50 pb-24 text-obsidian-900">
      <Helmet>
        <title>{room.name} | {hotel.name} | Dunas Travel</title>
        <meta name="description" content={room.description || `${room.name} at ${hotel.name}`} />
      </Helmet>

      <section className="relative overflow-hidden bg-obsidian-900 py-20 text-white">
        {hotel.heroImageUrl ? <img src={hotel.heroImageUrl} alt={hotel.heroImageAlt || hotel.name} className="absolute inset-0 h-full w-full object-cover opacity-35" /> : null}
        <div className="absolute inset-0 bg-obsidian-900/70" />
        <div className="container relative z-10 mx-auto px-6">
          <Link to={`${basePath}/hotels/${encodeURIComponent(hotel.slug)}`} className="text-sm text-gold-400 hover:text-white">{hotel.name}</Link>
          <h1 className="mt-4 text-4xl font-bold font-display md:text-6xl">{room.name}</h1>
          {room.description ? <p className="mt-5 max-w-2xl text-lg text-white/80">{room.description}</p> : null}
        </div>
      </section>

      <section className="container mx-auto grid max-w-5xl gap-8 px-6 py-16 md:grid-cols-[1fr_320px]">
        <article className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold font-display">{t('hotel.room.details', 'Room details')}</h2>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div><dt className="text-sm text-obsidian-500">{t('hotel.mealPlan', 'Meal plan')}</dt><dd className="mt-1 font-semibold">{room.mealPlan || t('hotel.roomOnly', 'Room only')}</dd></div>
            <div><dt className="text-sm text-obsidian-500">{t('hotel.maxGuests', 'Maximum guests')}</dt><dd className="mt-1 flex items-center gap-2 font-semibold"><FaUserFriends className="text-gold-500" />{room.maxOccupancy}</dd></div>
            <div><dt className="text-sm text-obsidian-500">{t('hotel.inventory', 'Available inventory')}</dt><dd className="mt-1 flex items-center gap-2 font-semibold"><FaBed className="text-gold-500" />{room.inventory}</dd></div>
          </dl>
        </article>
        <aside className="h-fit rounded-2xl bg-obsidian-900 p-7 text-white shadow-xl">
          <span className="text-sm text-white/60">{t('hotel.perNight', 'Per night')}</span>
          <strong className="mt-2 block text-3xl text-gold-400">{formatPrice(room.ratePerNight)}</strong>
          <Link to={`/contact?hotel=${encodeURIComponent(hotel.slug)}&room=${encodeURIComponent(room.slug)}`} className="mt-7 block rounded-full bg-gold-500 px-6 py-3 text-center font-bold text-obsidian-900 hover:bg-gold-400">{t('hotel.requestBooking', 'Request reservation')}</Link>
        </aside>
      </section>
    </main>
  );
};

export default RoomDetails;
