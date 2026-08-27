import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TourCard from '../../components/tour/TourCard';
import { useLandingPage } from '../../hooks/useLandingPage';

function readableSections(sections) {
  if (!Array.isArray(sections)) return [];
  return sections.filter((section) => typeof section === 'string' && section.trim());
}

export default function LandingPageDetails({ destinationOnly = false }) {
  const params = useParams();
  const slug = params.slug || params.programSlug || params.programId || params.id;
  const { t } = useTranslation();
  const { landingPage, loading, error } = useLandingPage(slug, { destinationOnly });

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center bg-obsidian-50"><div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" /></div>;
  if (error || !landingPage) return <section className="mx-auto max-w-3xl px-6 py-24 text-center"><h1 className="text-display-lg text-obsidian-900">{t('destinations.unavailable', 'This destination is unavailable')}</h1><p className="mt-4 text-obsidian-600">{t('destinations.unavailableDescription', 'It may be unpublished, inactive, or no longer offered.')}</p><Link className="mt-8 inline-flex rounded-xl bg-gold-500 px-5 py-3 font-semibold text-obsidian-900" to="/destinations">{t('destinations.back', 'Browse destinations')}</Link></section>;

  const sections = readableSections(landingPage.sections);
  return <main className="bg-obsidian-50 pb-24">
    <Helmet>
      <title>{landingPage.seoTitle || landingPage.title}</title>
      {landingPage.seoDescription && <meta name="description" content={landingPage.seoDescription} />}
    </Helmet>

    <section className="relative isolate overflow-hidden bg-obsidian-900 text-ivory-50">
      {landingPage.heroImageUrl && <img src={landingPage.heroImageUrl} alt={landingPage.title} className="absolute inset-0 -z-20 h-full w-full object-cover" />}
      <div className="absolute inset-0 -z-10 bg-obsidian-900/70" />
      <div className="container mx-auto px-6 py-24 md:py-36">
        <Link to={destinationOnly ? '/destinations' : '/programs'} className="text-sm font-semibold uppercase tracking-widest text-gold-400">{destinationOnly ? t('destinations.all', 'All destinations') : t('programs.all', 'All programs')}</Link>
        <h1 className="mt-5 max-w-4xl text-display-xl">{landingPage.title}</h1>
        {landingPage.subtitle && <p className="mt-5 max-w-2xl text-xl text-ivory-200">{landingPage.subtitle}</p>}
        {landingPage.brief && <p className="mt-6 max-w-3xl leading-relaxed text-ivory-200">{landingPage.brief}</p>}
      </div>
    </section>

    <section className="container mx-auto px-6 py-16">
      {landingPage.description && <p className="mx-auto max-w-4xl whitespace-pre-line text-lg leading-relaxed text-obsidian-700">{landingPage.description}</p>}
      {sections.length > 0 && <div className="mx-auto mt-12 grid max-w-4xl gap-4">{sections.map((section, index) => <p key={`${index}-${section.slice(0, 20)}`} className="rounded-2xl border border-gold-500/15 bg-white p-6 text-obsidian-700">{section}</p>)}</div>}
    </section>

    <section className="container mx-auto px-6">
      <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-widest text-gold-600">{t('destinations.experiences', 'Curated experiences')}</p><h2 className="mt-2 text-display-lg text-obsidian-900">{t('destinations.tours', 'Tours')}</h2></div><span className="rounded-full bg-obsidian-100 px-3 py-1 text-sm text-obsidian-600">{landingPage.tours.length}</span></div>
      {landingPage.tours.length > 0 ? <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">{landingPage.tours.map((tour) => <TourCard key={tour.id} tour={{ ...tour, price: Number(tour.basePriceUsd), images: tour.images, destination: tour.country, badge: tour.customBadge }} />)}</div> : <p className="rounded-2xl border border-obsidian-200 bg-white p-8 text-center text-obsidian-600">{t('destinations.noTours', 'No published tours are currently available for this page.')}</p>}
    </section>
  </main>;
}
