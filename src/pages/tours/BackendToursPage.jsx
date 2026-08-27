import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useTours } from '../../hooks/useTours';
import TourCard from '../../components/tour/TourCard';

/** A catalog page backed exclusively by GET /api/tours. */
export default function BackendToursPage({ titleKey, titleDefault, filters = {} }) {
  const { t } = useTranslation();
  const { tours, loading, error } = useTours({ limit: 100, ...filters });
  const title = t(titleKey, titleDefault);

  return (
    <main className="min-h-screen bg-ivory-50 px-6 pb-24 pt-32">
      <Helmet>
        <title>{`${title} | Dunas Travel`}</title>
      </Helmet>
      <section className="container mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-display-xl text-obsidian-900">{title}</h1>
        </header>
        {loading ? (
          <div className="flex justify-center py-24" role="status">
            <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-gold-500" />
          </div>
        ) : error ? (
          <p className="mx-auto max-w-2xl rounded-2xl border border-red-300 bg-red-50 p-6 text-center text-red-800">
            {t('tours.loadError', 'Tours could not be loaded. Please try again later.')}
          </p>
        ) : tours.length === 0 ? (
          <p className="mx-auto max-w-2xl rounded-2xl border border-obsidian-200 bg-white p-8 text-center text-obsidian-600">
            {t('tours.empty', 'No tours are currently available.')}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
          </div>
        )}
      </section>
    </main>
  );
}
