import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaChevronLeft, FaChevronRight, FaPlay, FaImage, FaVideo } from "react-icons/fa";
import { galleryImages, videos } from "../data/media";
import Button from "../components/ui/Button";

const getOptimizedImageUrl = (url, width = 600, height = 450) => {
  if (!url) return url;
  if (url.includes('cloudinary.com')) {
    return url.replace('/image/upload/', `/image/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`);
  }
  if (url.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('w', width.toString());
      urlObj.searchParams.set('q', '70');
      urlObj.searchParams.set('fm', 'webp');
      urlObj.searchParams.set('fit', 'crop');
      return urlObj.toString();
    } catch {
      return url;
    }
  }
  return url;
};

const MediaGallery = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isRtl = i18n.dir() === 'rtl';

  // Read initial tab from URL query params
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") === "videos" ? "videos" : "photos";
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);

  const cloudName = 'degbrq3ck';

  // Keep state synced with query parameter if page changes
  useEffect(() => {
    const tab = searchParams.get("tab") === "videos" ? "videos" : "photos";
    setActiveTab(tab);
  }, [location.search]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Update URL query parameter
    navigate(`/media-gallery?tab=${tab}`, { replace: true });
  };

  const nextPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const prevPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setZoomScale(1);
    setIsLightboxOpen(true);
  };

  const handleLightboxNext = (e) => {
    e.stopPropagation();
    setZoomScale(1);
    setLightboxIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleLightboxPrev = (e) => {
    e.stopPropagation();
    setZoomScale(1);
    setLightboxIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-[#070D19] text-ivory-50 pt-[110px] sm:pt-[120px] lg:pt-[140px] pb-24 relative overflow-hidden">
      <Helmet>
        <title>{t("mediaGallery.seoTitle", "Media Gallery | Dunas Travel")}</title>
        <meta name="description" content={t("mediaGallery.seoDesc", "Explore our beautiful travel photo and video collections. Experience Egypt, Turkey, Jordan, Dubai, and more.")} />
      </Helmet>

      {/* Decorative backdrop elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] z-0" 
        style={{ 
          background: 'radial-gradient(circle at 10% 20%, rgb(30,58,138) 0%, transparent 45%), radial-gradient(circle at 90% 80%, #F5A623 0%, transparent 45%)' 
        }} 
      />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Page Title */}
        <div className="text-center mb-10">
          <span className="text-gold-500 uppercase tracking-widest text-caption block mb-3 font-semibold">
            {t("mediaGallery.subheading", "Visual Journey")}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-display font-medium tracking-wide">
            {t("mediaGallery.title", "Media Gallery")}
          </h1>
          <div className="w-24 h-1 bg-gold-500 mx-auto mt-5"></div>
        </div>

        {/* FEATURED HERO AREA */}
        <div className="w-full bg-[#0E1726]/60 backdrop-blur-md rounded-[32px] border border-white/5 overflow-hidden shadow-2xl p-4 md:p-6 mb-12">
          <div className="relative aspect-video max-h-[60vh] mx-auto rounded-2xl overflow-hidden bg-black flex items-center justify-center group/hero">
            
            {activeTab === "photos" ? (
              <>
                <img
                  src={galleryImages[selectedPhotoIndex].src}
                  alt={galleryImages[selectedPhotoIndex].dest}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02] cursor-pointer"
                  onClick={() => openLightbox(selectedPhotoIndex)}
                />
                
                {/* Image Overlay details */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-start flex justify-between items-end">
                  <div>
                    <h3 className="text-xl md:text-2xl font-display text-white font-semibold mb-1">
                      {t(`data.${galleryImages[selectedPhotoIndex].dest}`, galleryImages[selectedPhotoIndex].dest)}
                    </h3>
                    <p className="text-gold-400 text-xs tracking-widest uppercase">
                      {t(`data.${galleryImages[selectedPhotoIndex].tag}`, galleryImages[selectedPhotoIndex].tag)}
                    </p>
                  </div>
                  <span className="bg-black/55 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-mono">
                    {selectedPhotoIndex + 1} / {galleryImages.length}
                  </span>
                </div>

                {/* Hero Navigation Controls */}
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center hover:bg-gold-500 hover:text-black transition-all opacity-0 group-hover/hero:opacity-100"
                  aria-label="Previous image"
                >
                  <FaChevronLeft size={18} />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center hover:bg-gold-500 hover:text-black transition-all opacity-0 group-hover/hero:opacity-100"
                  aria-label="Next image"
                >
                  <FaChevronRight size={18} />
                </button>
              </>
            ) : (
              <iframe
                src={`https://player.cloudinary.com/embed/?cloud_name=${cloudName}&public_id=${videos[selectedVideoIndex].publicId}&autoplay=false&controls=true`}
                className="w-full h-full"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title={videos[selectedVideoIndex].title}
              />
            )}
          </div>

          {/* Featured Video Title/Desc below Hero (Only for videos) */}
          {activeTab === "videos" && (
            <div className="mt-6 text-start px-2">
              <h3 className="text-2xl font-semibold text-white mb-2">
                {videos[selectedVideoIndex].title}
              </h3>
              <p className="text-ivory-300 text-sm leading-relaxed max-w-4xl">
                {videos[selectedVideoIndex].description}
              </p>
            </div>
          )}
        </div>

        {/* TAB TOGGLES */}
        <div className="flex justify-center mb-10">
          <div className="relative flex p-1.5 bg-[#0E1726]/80 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
            
            {/* Sliding Active Highlight */}
            <div 
              className={`absolute top-1.5 bottom-1.5 rounded-full bg-gradient-to-r from-gold-500 to-amber-500 transition-all duration-300 ease-out`}
              style={{
                width: 'calc(50% - 6px)',
                left: activeTab === 'photos' ? '6px' : 'calc(50%)',
              }}
            />

            {/* Photos Tab Button */}
            <button
              onClick={() => handleTabChange("photos")}
              className={`relative z-10 px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-colors duration-300 ${
                activeTab === "photos" ? "text-[#070D19]" : "text-ivory-300 hover:text-white"
              }`}
            >
              <FaImage size={16} />
              {t("mediaGallery.photosTab", "Photos")}
            </button>

            {/* Videos Tab Button */}
            <button
              onClick={() => handleTabChange("videos")}
              className={`relative z-10 px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-colors duration-300 ${
                activeTab === "videos" ? "text-[#070D19]" : "text-ivory-300 hover:text-white"
              }`}
            >
              <FaVideo size={16} />
              {t("mediaGallery.videosTab", "Videos")}
            </button>

          </div>
        </div>

        {/* GALLERY GRID SECTION */}
        <AnimatePresence mode="wait">
          {activeTab === "photos" ? (
            <motion.div
              key="photos-grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {galleryImages.map((img, index) => {
                const isSelected = index === selectedPhotoIndex;
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer shadow-lg group transition-all duration-300 border ${
                      isSelected 
                        ? "border-gold-500 scale-[1.02] ring-2 ring-gold-500/20" 
                        : "border-white/5 hover:border-gold-500/30 hover:scale-[1.02]"
                    }`}
                  >
                    <img
                      src={getOptimizedImageUrl(img.src, 400, 300)}
                      alt={img.dest}
                      loading="lazy"
                      className="w-full h-[200px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Hover Glow / Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070D19]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-start">
                      <h4 className="text-sm font-semibold text-white mb-0.5">
                        {t(`data.${img.dest}`, img.dest)}
                      </h4>
                      <p className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">
                        {t(`data.${img.tag}`, img.tag)}
                      </p>
                    </div>

                    {/* Active Border Overlay Indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-gold-500 text-[#070D19] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="videos-grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {videos.map((vid, index) => {
                const isSelected = index === selectedVideoIndex;
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedVideoIndex(index)}
                    className={`relative bg-[#0E1726]/40 rounded-2xl overflow-hidden cursor-pointer shadow-lg group transition-all duration-300 border text-start flex flex-col ${
                      isSelected 
                        ? "border-gold-500 scale-[1.02] ring-2 ring-gold-500/20" 
                        : "border-white/5 hover:border-gold-500/30 hover:scale-[1.02]"
                    }`}
                  >
                    {/* Thumbnail video frame */}
                    <div className="relative w-full h-[180px] overflow-hidden bg-black shrink-0">
                      <img
                        src={`https://res.cloudinary.com/${cloudName}/video/upload/w_400,h_240,c_fill/${vid.publicId}.jpg`}
                        alt={vid.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Play overlay button */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gold-500/90 flex items-center justify-center text-black shadow-lg transform group-hover:scale-110 transition-transform">
                          <FaPlay className="w-4 h-4 ml-0.5" />
                        </div>
                      </div>

                      {/* Active Indicator checkmark */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 bg-gold-500 text-[#070D19] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                          ✓
                        </div>
                      )}
                    </div>

                    {/* Metadata Card Content */}
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-gold-400 transition-colors mb-1.5 text-white">
                          {vid.title}
                        </h4>
                        <p className="text-xs text-ivory-300 line-clamp-2 leading-relaxed">
                          {vid.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* FULL SCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white hover:text-gold-500 transition-colors z-[10000] p-2"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(false);
              }}
            >
              <FaTimes size={30} />
            </button>

            {/* Left Nav */}
            <button
              className={`absolute ${isRtl ? 'right-6 md:right-10' : 'left-6 md:left-10'} text-white hover:text-gold-500 transition-colors z-[10000] p-4`}
              onClick={isRtl ? handleLightboxNext : handleLightboxPrev}
            >
              <FaChevronLeft size={36} />
            </button>

            {/* Lightbox Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: zoomScale }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              src={galleryImages[lightboxIndex].src}
              alt={galleryImages[lightboxIndex].dest}
              className="max-w-[90vw] max-h-[85vh] object-contain shadow-2xl rounded-md cursor-zoom-in"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => {
                e.stopPropagation();
                const delta = e.deltaY > 0 ? -0.25 : 0.25;
                setZoomScale((s) => Math.max(1, Math.min(4, s + delta)));
              }}
            />

            {/* Zoom Controls */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[10000] flex gap-3 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
              <button
                onClick={(e) => { e.stopPropagation(); setZoomScale((s) => Math.max(1, s - 0.5)); }}
                className="text-white hover:text-gold-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-lg font-bold"
              >
                -
              </button>
              <span className="text-white text-sm flex items-center">{Math.round(zoomScale * 100)}%</span>
              <button
                onClick={(e) => { e.stopPropagation(); setZoomScale((s) => Math.min(4, s + 0.5)); }}
                className="text-white hover:text-gold-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-lg font-bold"
              >
                +
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setZoomScale(1); }}
                className="text-gold-500 hover:text-gold-400 transition-colors text-xs font-semibold px-2"
              >
                RESET
              </button>
            </div>

            {/* Right Nav */}
            <button
              className={`absolute ${isRtl ? 'left-6 md:left-10' : 'right-6 md:right-10'} text-white hover:text-gold-500 transition-colors z-[10000] p-4`}
              onClick={isRtl ? handleLightboxPrev : handleLightboxNext}
            >
              <FaChevronRight size={36} />
            </button>

            {/* Bottom details */}
            <div className="absolute bottom-6 left-0 right-0 text-center text-white pointer-events-none">
              <p className="font-display text-xl mb-1 drop-shadow-md">
                {t(`data.${galleryImages[lightboxIndex].dest}`, galleryImages[lightboxIndex].dest)}
              </p>
              <p className="text-gold-500 tracking-widest text-xs uppercase drop-shadow-md">
                {t(`data.${galleryImages[lightboxIndex].tag}`, galleryImages[lightboxIndex].tag)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaGallery;
