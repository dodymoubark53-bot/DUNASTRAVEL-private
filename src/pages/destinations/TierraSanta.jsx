import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useTours } from '../../hooks/useTours';
import TourCard from '../../components/tour/TourCard';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

const TierraSanta = () => {
  const { t } = useTranslation();
  const { tours, loading, error } = useTours({ search: 'holy', limit: 100 });

  return (
    <main className="min-h-screen bg-obsidian-50 px-6 pb-24 pt-32">
      <Helmet>
        <title>{t('dest.holyland.seoTitle', 'Holy Land Tours | Dunas Travel')}</title>
        <meta name="description" content={t('dest.holyland.seoDesc', 'Explore available Holy Land journeys from the Dunas Travel catalog.')} />
      </Helmet>
      <div className="container mx-auto">
        <h1 className="mb-12 text-center text-4xl font-bold text-obsidian-900">
          {t('dest.holyland.title', 'Holy Land')}
        </h1>
        {loading ? <SkeletonLoader count={3} /> : null}
        {error ? <ErrorState message={error.message || t('tours.loadError', 'Tours could not be loaded.')} /> : null}
        {!loading && !error && tours.length === 0 ? (
          <EmptyState message={t('tours.empty', 'No published tours are available for this destination.')} />
        ) : null}
        {!loading && !error && tours.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default TierraSanta;
