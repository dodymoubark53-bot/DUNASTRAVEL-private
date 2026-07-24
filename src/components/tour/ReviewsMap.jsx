import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaStar, FaRegStar, FaCheckCircle } from 'react-icons/fa';

const seedReviews = [
  { name: 'Carlos García', country: 'Spain', rating: 5, textKey: 'reviews.r1', dateKey: 'data.reviewDate1', date: 'October 2025' },
  { name: 'Sofia Conti', country: 'Italy', rating: 5, textKey: 'reviews.r2', dateKey: 'data.reviewDate2', date: 'September 2025' },
  { name: 'Martín Fernández', country: 'Argentina', rating: 5, textKey: 'reviews.r3', date: 'November 2025' },
  { name: 'Ana Lucía Hernández', country: 'Mexico', rating: 5, textKey: 'reviews.r4', date: 'December 2025' },
  { name: 'João Silva', country: 'Portugal', rating: 5, textKey: 'reviews.r5', date: 'January 2026' },
  { name: 'Rafael Oliveira', country: 'Brazil', rating: 5, textKey: 'reviews.r6', date: 'February 2026' },
  { name: 'Jennifer Adams', country: 'USA', rating: 5, textKey: 'reviews.r7', date: 'March 2026' },
  { name: 'James Mitchell', country: 'Australia', rating: 5, textKey: 'reviews.r8', date: 'April 2026' },
];

const StarRating = ({ rating, onRate, readonly }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        disabled={readonly}
        onClick={() => onRate?.(star)}
        className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
      >
        {star <= rating ? (
          <FaStar className="w-4 h-4 text-white" />
        ) : (
          <FaRegStar className="w-4 h-4 text-white" />
        )}
      </button>
    ))}
  </div>
);

const getAvatarInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const getAvatarGradient = (name) => {
  const gradients = [
    "from-indigo-600 to-blue-500",
    "from-purple-600 to-pink-500",
    "from-amber-500 to-orange-600",
    "from-emerald-600 to-teal-500",
    "from-rose-500 to-pink-600",
    "from-cyan-600 to-blue-500",
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return gradients[sum % gradients.length];
};

const ReviewsMap = ({ tourId }) => {
  const { t, i18n } = useTranslation();
  
  // State to hold reviews, keyed by tourId in localStorage.
  // Falls back to seedReviews if not yet created.
  const [reviews, setReviews] = useState(() => {
    const storageKey = `reviews_${tourId || 'global'}`;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : seedReviews;
  });

  const [newReview, setNewReview] = useState({ name: '', country: '', rating: 5, text: '' });
  const [success, setSuccess] = useState(false);
  const isRtl = i18n.dir() === 'rtl';

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  // Sync reviews state if tourId changes (navigation between tours/programs)
  useEffect(() => {
    const storageKey = `reviews_${tourId || 'global'}`;
    const saved = localStorage.getItem(storageKey);
    setReviews(saved ? JSON.parse(saved) : seedReviews);
  }, [tourId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    
    // Dynamically format current date based on active locale
    const formattedDate = new Date().toLocaleDateString(i18n.language || 'en', { month: 'long', year: 'numeric' });
    
    const newReviewData = { 
      name: newReview.name, 
      country: newReview.country, 
      rating: parseInt(newReview.rating), 
      text: newReview.text,
      date: formattedDate
    };
    
    const updatedReviews = [newReviewData, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${tourId || 'global'}`, JSON.stringify(updatedReviews));

    setNewReview({ name: '', country: '', rating: 5, text: '' });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <section className="reviews-section py-20 overflow-hidden relative w-full" style={{ background: 'linear-gradient(135deg, #070D19 0%, #0D2040 100%)' }}>
      
      {/* CSS Styles for Ticker & Force White Colors globally for Task 2 */}
      <style>
        {`
          @keyframes scrollReviews {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scrollReviewsRtl {
            0% { transform: translateX(0); }
            100% { transform: translateX(50%); }
          }
          .reviews-ticker-track {
            display: flex;
            width: max-content;
            gap: 24px;
            animation: ${isRtl ? 'scrollReviewsRtl' : 'scrollReviews'} 45s linear infinite;
          }
          .reviews-ticker-track:hover {
            animation-play-state: paused;
          }

          /* Force all text in the reviews section to be white in both light & dark mode */
          .reviews-section,
          .reviews-section * {
            color: #ffffff !important;
          }
          .reviews-section input,
          .reviews-section textarea {
            color: #ffffff !important;
            border-color: rgba(255, 255, 255, 0.25) !important;
            background-color: rgba(255, 255, 255, 0.08) !important;
          }
          .reviews-section input::placeholder,
          .reviews-section textarea::placeholder {
            color: rgba(255, 255, 255, 0.5) !important;
          }
          .reviews-section svg,
          .reviews-section path {
            fill: #ffffff !important;
            color: #ffffff !important;
          }
        `}
      </style>

      {/* Fade-out overlays */}
      <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#070D19] to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#070D19] to-transparent pointer-events-none z-10" />

      <div className="w-full relative z-0">
        {/* Title & Average Rating */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 px-6"
        >
          <span className="text-white uppercase tracking-widest text-caption block mb-3 font-semibold">
            {t('reviews.subheading', 'Guest Feedback')}
          </span>
          <h2 className="text-4xl md:text-5xl text-white font-display font-medium tracking-wide mb-4">
            {t('reviews.titleHeading', 'What People Say')}
          </h2>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <StarRating rating={Math.round(parseFloat(avgRating))} readonly />
            <span className="text-2xl text-white font-bold">{avgRating}</span>
          </div>
          <p className="text-white text-sm">
            {t('reviews.count', 'Based on {{count}} reviews', { count: reviews.length })}
          </p>
          <div className="w-20 h-[3px] bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* Scrolling Ticker Track */}
        <div className="w-full overflow-hidden py-4 mb-16 relative">
          <div className="reviews-ticker-track">
            {/* Render reviews twice for seamless infinite scrolling */}
            {[...reviews, ...reviews].map((rev, idx) => {
              const initials = getAvatarInitials(rev.name);
              const grad = getAvatarGradient(rev.name);
              return (
                <div
                  key={idx}
                  className="w-[320px] md:w-[380px] shrink-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div>
                    {/* Top Row: User Avatar & Info */}
                    <div className="flex items-center justify-between mb-4 text-start">
                      <div className="flex items-center gap-3">
                        {/* Circular Initials Avatar */}
                        <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${grad} flex items-center justify-center text-white font-bold text-sm tracking-wide shadow-md`}>
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm line-clamp-1">{rev.name}</p>
                          {rev.country && (
                            <p className="text-xs text-white/80">{rev.country}</p>
                          )}
                        </div>
                      </div>
                      <StarRating rating={rev.rating} readonly />
                    </div>
                    {/* Comment text */}
                    <p className="text-white/95 text-[13px] md:text-sm leading-relaxed italic text-start font-light line-clamp-3">
                      "{rev.textKey ? t(rev.textKey) : rev.text}"
                    </p>
                  </div>
                  {/* Date footer */}
                  <p className="text-[10px] text-white/90 font-bold uppercase tracking-wider text-end mt-4">
                    {rev.dateKey ? t(rev.dateKey) : rev.date}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Write Review Form */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl mx-auto bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl mx-6 md:mx-auto text-start"
        >
          <h3 className="text-2xl font-display text-white font-medium mb-6 text-center">
            {t('tour.leaveReview', 'Write a Review')}
          </h3>
          {success && (
            <div className="flex items-center gap-2 text-white bg-white/10 border border-white/20 rounded-xl px-4 py-3 mb-6 text-sm">
              <FaCheckCircle className="text-white" />
              {t('reviews.reviewSuccess', 'Review submitted successfully!')}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white mb-1.5 font-bold">{t('reviews.yourName', 'Your Name')} *</label>
                <input
                  type="text"
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview(p => ({ ...p, name: e.target.value }))}
                  className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl focus:border-white/50 outline-none text-white text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-white mb-1.5 font-bold">{t('reviews.country', 'Country')}</label>
                <input
                  type="text"
                  value={newReview.country}
                  onChange={(e) => setNewReview(p => ({ ...p, country: e.target.value }))}
                  className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl focus:border-white/50 outline-none text-white text-sm transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-white mb-1.5 font-bold">{t('reviews.rating', 'Rating')}</label>
              <StarRating rating={newReview.rating} onRate={(val) => setNewReview(p => ({ ...p, rating: val }))} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-white mb-1.5 font-bold">{t('reviews.reviewText', 'Your Review')} *</label>
              <textarea
                required
                rows="3"
                value={newReview.text}
                onChange={(e) => setNewReview(p => ({ ...p, text: e.target.value }))}
                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl focus:border-white/50 outline-none text-white text-sm transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold tracking-widest uppercase text-xs rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              {t('tour.submitReview', 'Submit Review')}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsMap;
