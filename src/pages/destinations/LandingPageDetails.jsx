import { Helmet } from 'react-helmet-async';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaPlay, FaCompass } from 'react-icons/fa';
import TourCard from '../../components/tour/TourCard';
import { useLandingPage } from '../../hooks/useLandingPage';
import ErrorState from '../../components/ui/ErrorState';

function readableSections(sections) {
  if (!Array.isArray(sections)) return [];
  return sections.filter((section) => typeof section === 'string' && section.trim());
}

export default function LandingPageDetails({ destinationOnly = false, slug: slugProp }) {
  const params = useParams();
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const routeSlug = params.slug || params.programSlug || params.programId || params.id;
  const slug = slugProp || routeSlug || (pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : undefined);
  const { t } = useTranslation();
  const { landingPage, loading, error, retry } = useLandingPage(slug, { destinationOnly });

  if (loading) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-6xl grid-cols-1 gap-8 px-6 py-24 md:grid-cols-3" role="status" aria-label={t('common.loading', 'Loading destination')}>
        {[0, 1, 2].map((item) => <div key={item} className="h-80 animate-pulse rounded-2xl bg-obsidian-200/70 dark:bg-obsidian-800/50" />)}
      </div>
    );
  }

  if (error) {
    const isMissing = error.status === 404;
    const isUnauthorized = error.status === 401 || error.status === 403;
    const title = isMissing
      ? t('destinations.unavailable', 'This destination is unavailable')
      : t('destinations.loadError', 'Destination details could not be loaded');
    const message = isMissing
      ? t('destinations.unavailableDescription', 'It may be unpublished, inactive, or no longer offered.')
      : isUnauthorized
        ? t('destinations.accessError', 'You do not have permission to view this destination.')
        : error.message || t('destinations.retryDescription', 'Please try again in a moment.');
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-start">
        <ErrorState
          title={title}
          message={message}
          actionLabel={t('common.tryAgain', 'Try again')}
          onRetry={retry}
        />
        <Link
          className="mx-auto mt-4 inline-flex min-h-11 items-center rounded-full border border-gold-500/30 px-5 py-3 font-semibold text-obsidian-900 dark:text-ivory-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          to="/destinations"
        >
          {t('destinations.back', 'Browse destinations')}
        </Link>
      </section>
    );
  }

  if (!landingPage) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-start">
        <ErrorState
          title={t('destinations.unavailable', 'This destination is unavailable')}
          message={t('destinations.unavailableDescription', 'It may be unpublished, inactive, or no longer offered.')}
          actionLabel={t('common.tryAgain', 'Try again')}
          onRetry={retry}
        />
        <Link
          className="mx-auto mt-4 inline-flex min-h-11 items-center rounded-full border border-gold-500/30 px-5 py-3 font-semibold text-obsidian-900 dark:text-ivory-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          to="/destinations"
        >
          {t('destinations.back', 'Browse destinations')}
        </Link>
      </section>
    );
  }

  const sections = readableSections(landingPage.sections);
  const sortedTours = Array.isArray(landingPage.tours)
    ? [...landingPage.tours].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    : [];

  return (
    <main className="bg-obsidian-50 dark:bg-[#0c0d19] pb-24 text-start">
      <Helmet>
        <title>{`${landingPage.seoTitle || landingPage.title} | Dunas Travel`}</title>
        {landingPage.seoDescription && <meta name="description" content={landingPage.seoDescription} />}
        {landingPage.seoKeywords && <meta name="keywords" content={landingPage.seoKeywords} />}
      </Helmet>

      {/* Hero Banner with Image or Video */}
      <section className="relative isolate overflow-hidden bg-obsidian-900 text-ivory-50">
        {landingPage.heroVideoUrl ? (
          <video
            src={landingPage.heroVideoUrl}
            poster={landingPage.heroImageUrl || undefined}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-60"
          />
        ) : landingPage.heroImageUrl ? (
          <img
            src={landingPage.heroImageUrl}
            alt={landingPage.title}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
        ) : null}

        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian-950 via-obsidian-900/70 to-obsidian-950/40" />

        <div className="container mx-auto px-6 py-24 md:py-36">
          <Link
            to={destinationOnly ? '/destinations' : '/programs'}
            className="text-xs font-semibold uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors inline-flex items-center gap-1.5"
          >
            <FaCompass className="text-[11px]" />
            <span>{destinationOnly ? t('destinations.all', 'All destinations') : t('programs.all', 'All programs')}</span>
          </Link>
          <h1 className="mt-4 max-w-4xl text-display-xl font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
            {landingPage.title}
          </h1>
          {landingPage.subtitle && (
            <p className="mt-3 max-w-2xl text-xl text-gold-300 font-medium">{landingPage.subtitle}</p>
          )}
          {landingPage.brief && (
            <p className="mt-5 max-w-3xl leading-relaxed text-ivory-200 text-body-lg">{landingPage.brief}</p>
          )}
        </div>
      </section>

      {/* Description & Overview Sections */}
      {(landingPage.description || sections.length > 0) && (
        <section className="container mx-auto px-6 py-16">
          {landingPage.description && (
            <p className="mx-auto max-w-4xl whitespace-pre-line text-lg leading-relaxed text-obsidian-700 dark:text-ivory-200">
              {landingPage.description}
            </p>
          )}
          {sections.length > 0 && (
            <div className="mx-auto mt-12 grid max-w-4xl gap-4">
              {sections.map((section, index) => (
                <div
                  key={`${index}-${section.slice(0, 20)}`}
                  className="rounded-2xl border border-gold-500/15 bg-white dark:bg-[#1a1a30] p-6 text-obsidian-700 dark:text-ivory-200 shadow-sm"
                >
                  <p className="leading-relaxed">{section}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Curated Destination Tours Section */}
      <section className="container mx-auto px-6">
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-gold-500/15 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400">
              {t('destinations.experiences', 'Curated Journeys')}
            </p>
            <h2 className="mt-1 text-display-lg text-obsidian-900 dark:text-ivory-50 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t('destinations.tours', 'Featured Experiences')}
            </h2>
          </div>
          <span className="rounded-full bg-gold-500/15 px-3.5 py-1 text-xs font-bold text-gold-700 dark:text-gold-400 border border-gold-500/30">
            {sortedTours.length} {sortedTours.length === 1 ? t('tours.tourSingular', 'Tour') : t('tours.tourPlural', 'Tours')}
          </span>
        </div>

        {sortedTours.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sortedTours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={{
                  ...tour,
                  price: Number(tour.basePriceUsd),
                  images: Array.isArray(tour.images) ? tour.images : (tour.heroImage ? [tour.heroImage] : []),
                  destination: tour.country,
                  badge: tour.customBadge,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-obsidian-200 dark:border-gray-800 bg-white dark:bg-[#1a1a30] p-10 text-center text-obsidian-600 dark:text-ivory-400 shadow-card">
            <p>{t('destinations.noTours', 'No published tours are currently available for this destination.')}</p>
          </div>
        )}
      </section>
    </main>
  );
}
