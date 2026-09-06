import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa";
import { useMedia } from "../hooks/useMedia";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import ErrorState from "../components/ui/ErrorState";

const MediaGallery = () => {
  const { t } = useTranslation();
  const { galleryImages = [], loading, error } = useMedia({ category: 'general' });
  const displayImages = galleryImages.slice(0, 22);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selected = selectedIndex === null ? null : displayImages[selectedIndex];

  if (loading) return <SkeletonLoader count={8} />;
  if (error) return <ErrorState message={error.message || "Failed to load media"} />;

  return (
    <main className="min-h-screen bg-[#070D19] px-6 pb-24 pt-[140px] text-ivory-50">
      <Helmet>
        <title>{t("mediaGallery.seoTitle", "Media Gallery | Dunas Travel")}</title>
        <meta name="description" content={t("mediaGallery.seoDesc", "Explore Dunas Travel's published media gallery.")} />
      </Helmet>
      <section className="container mx-auto max-w-7xl">
        <div className="mb-10 text-center"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold-500">{t("mediaGallery.subheading", "Visual Journey")}</p><h1 className="font-display text-4xl text-white md:text-5xl">{t("mediaGallery.title", "Media Gallery")}</h1></div>
        {displayImages.length === 0 ? <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-ivory-300">{t("mediaGallery.empty", "No published media is available yet.")}</div> : <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{displayImages.map((asset, index) => <button type="button" key={asset.id} onClick={() => setSelectedIndex(index)} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0E1726] text-start focus:outline-none focus:ring-2 focus:ring-gold-500"><img src={asset.url} alt={asset.label} loading="lazy" className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105" /><span className="block truncate px-4 py-3 text-sm text-white">{asset.label}</span></button>)}</div>}
      </section>
      {selected && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6" role="dialog" aria-modal="true" aria-label={selected.label} onClick={() => setSelectedIndex(null)}><button type="button" className="absolute right-6 top-6 text-white" onClick={() => setSelectedIndex(null)} aria-label="Close"><FaTimes size={28} /></button><img src={selected.url} alt={selected.label} className="max-h-[85vh] max-w-[90vw] object-contain" onClick={(event) => event.stopPropagation()} /></div>}
    </main>
  );
};

export default MediaGallery;
