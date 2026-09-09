import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTours } from '../../hooks/useTours';
import TourCard from '../../components/tour/TourCard';
import ErrorState from '../../components/ui/ErrorState';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';

/** A catalog page backed exclusively by GET /api/tours with pagination support. */
export default function BackendToursPage({ titleKey, titleDefault, filters = {}, limit = 12, bgImage }) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const { tours, total, totalPages, page, hasNextPage, hasPrevPage, loading, error, retry } = useTours({
    limit,
    page: currentPage,
    ...filters,
  });
  const title = t(titleKey, titleDefault);

  const heroImage = bgImage || (
    filters.category === 'Religious'
      ? 'https://images.akhbarelyom.com/UP/20240601193248245.jpg'
      : 'https://res.cloudinary.com/degbrq3ck/image/upload/v1783023886/3776ecde-249e-4183-9840-e9fd900ad96b_xvmumu.jpg'
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-ivory-50 dark:bg-[#0c0d19] pb-24 text-start">
      <Helmet>
        <title>{`${title} | Dunas Travel`}</title>
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('tours.catalogBadge', 'EXPLORE THE EXTRAORDINARY')}
        title={title}
        subtitle={total > 0 && !loading ? t('tours.totalCount', '{{total}} Luxury Journeys Available', { total }) : ''}
        bgImage={heroImage}
        primaryCta={null}
        secondaryCta={null}
        zoomDuration={6}
        zoomScale={1.25}
        ease="easeInOut"
      />

      <section className="container mx-auto px-6 mt-16" id="tours-grid">

        {loading ? (
          <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-2 lg:grid-cols-3" role="status" aria-label={t('common.loading', 'Loading tours')}>
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-96 animate-pulse rounded-2xl bg-obsidian-200/60 dark:bg-obsidian-800/50" />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title={t('common.errorOccurred', 'Unable to load tours')}
            message={t('tours.loadError', 'Tours could not be loaded. Please try again later.')}
            actionLabel={t('common.tryAgain', 'Try again')}
            onRetry={retry}
          />
        ) : tours.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-2xl border border-obsidian-200 dark:border-gray-800 bg-white dark:bg-[#1a1a30] p-10 text-center text-obsidian-600 dark:text-ivory-300 shadow-card">
            <p className="text-body-lg font-medium mb-2">{t('tours.emptyTitle', 'No Journeys Found')}</p>
            <p className="text-body-sm text-obsidian-400 dark:text-ivory-400">
              {t('tours.empty', 'No tours match your current criteria. Explore our full catalog or check back soon.')}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
            </div>

            {/* Canonical Pagination Controls */}
            {totalPages > 1 && (
              <nav aria-label={t('pagination.label', 'Tours pagination')} className="mt-16 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={!hasPrevPage && page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-obsidian-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-obsidian-900 dark:text-ivory-50 hover:border-gold-500 hover:text-gold-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-semibold uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  <FaChevronLeft className="rtl-flip text-[10px]" />
                  <span>{t('pagination.previous', 'Previous')}</span>
                </button>

                <div className="flex items-center gap-1.5 px-3">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                        pageNum === page
                          ? 'bg-gold-500 text-obsidian-950 shadow-md font-bold'
                          : 'border border-obsidian-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-obsidian-700 dark:text-ivory-200 hover:border-gold-500 hover:text-gold-500'
                      }`}
                      aria-current={pageNum === page ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!hasNextPage && page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-obsidian-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-obsidian-900 dark:text-ivory-50 hover:border-gold-500 hover:text-gold-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-semibold uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  <span>{t('pagination.next', 'Next')}</span>
                  <FaChevronRight className="rtl-flip text-[10px]" />
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}
