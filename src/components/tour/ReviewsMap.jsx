import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaRegStar, FaStar, FaReply, FaQuoteLeft } from 'react-icons/fa';
import api from '../../utils/api';

const AVATAR_GRADIENTS = [
  'from-amber-500 to-orange-600',
  'from-indigo-600 to-blue-500',
  'from-purple-600 to-pink-500',
  'from-emerald-600 to-teal-500',
  'from-rose-500 to-pink-600',
  'from-cyan-600 to-blue-500',
];

function getAvatarInitials(name) {
  if (!name) return 'GT';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getAvatarGradient(name) {
  if (!name) return AVATAR_GRADIENTS[0];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
}

function Stars({ rating, onRate, readOnly = false, size = 'md' }) {
  const sizeClasses = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex gap-1 dir-ltr inline-flex" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onRate?.(star)}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-125'} transition-transform focus:outline-none`}
        >
          {star <= rating ? (
            <FaStar className={`${sizeClasses} text-amber-400 fill-amber-400`} />
          ) : (
            <FaRegStar className={`${sizeClasses} text-white/40`} />
          )}
        </button>
      ))}
    </div>
  );
}

function formatReview(review, locale) {
  return {
    id: review.id,
    name: review.reviewerName || 'Verified Traveler',
    rating: review.rating,
    comment: review.comment || '',
    adminReply: review.adminReply || null,
    date: new Date(review.createdAt).toLocaleDateString(locale, { month: 'long', year: 'numeric' }),
  };
}

export default function ReviewsMap({ tourId }) {
  const { t, i18n } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ averageRating: 5.0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ reviewerName: '', rating: 5, comment: '' });

  useEffect(() => {
    if (!tourId) return undefined;
    let active = true;
    setLoading(true);
    setLoadError('');

    api.get(`/tours/${encodeURIComponent(tourId)}/reviews`)
      .then((response) => {
        if (!active) return;
        const items = Array.isArray(response?.items)
          ? response.items
          : (Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []));
        setReviews(items.map((review) => formatReview(review, i18n.language || 'en')));
        const averageRating = items.length
          ? items.reduce((total, review) => total + Number(review.rating || 0), 0) / items.length
          : 5.0;
        setSummary(response?.ratingSummary || { averageRating, totalReviews: items.length });
      })
      .catch((requestError) => {
        if (!active) return;
        setReviews([]);
        setSummary({ averageRating: 5.0, totalReviews: 0 });
        setLoadError(requestError?.message || t('reviews.loadError', 'Reviews could not be loaded.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [tourId, i18n.language, t]);

  if (!tourId) return null;

  async function submit(event) {
    event.preventDefault();
    if (!form.reviewerName.trim() || !form.comment.trim()) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const payload = {
        reviewerName: form.reviewerName.trim(),
        rating: Number(form.rating),
        comment: form.comment.trim(),
      };
      await api.post(`/tours/${encodeURIComponent(tourId)}/reviews`, payload);
      setForm({ reviewerName: '', rating: 5, comment: '' });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error?.response?.data?.message ||
        error?.message ||
        t('reviews.submitError', 'Your review could not be submitted.')
      );
    } finally {
      setSubmitting(false);
    }
  }

  const averageRating = Number(summary.averageRating || 5.0).toFixed(1);

  return (
    <section className="reviews-section py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #070D19 0%, #0D2040 100%)' }}>
      <div className="mx-auto max-w-6xl px-6 text-white relative z-10">
        <header className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-400">
            {t('reviews.subheading', 'Guest Feedback')}
          </p>
          <h2 className="mb-4 text-3xl md:text-5xl font-medium tracking-tight text-white">
            {t('reviews.titleHeading', 'What People Say')}
          </h2>
          <div className="flex items-center justify-center gap-3">
            <Stars rating={Math.round(Number(averageRating))} readOnly size="lg" />
            <span className="text-3xl font-black text-amber-400">{averageRating}</span>
          </div>
          <p className="mt-2 text-sm text-white/70">
            {t('reviews.count', 'Based on {{count}} verified reviews', { count: summary.totalReviews })}
          </p>
          <div className="w-20 h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-6 rounded-full" />
        </header>

        {/* Reviews List */}
        <div aria-busy={loading} className="mb-16">
          {loadError && <p className="text-center text-rose-300 text-sm">{loadError}</p>}
          {!loading && !loadError && reviews.length === 0 && (
            <div className="text-center py-10 px-4 rounded-3xl bg-white/5 border border-white/10 max-w-md mx-auto">
              <FaStar className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <p className="text-sm text-white/80 font-medium">{t('reviews.empty', 'No verified reviews yet. Be the first to share your experience!')}</p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md p-6 shadow-xl flex flex-col justify-between hover:border-amber-400/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Reviewer Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${getAvatarGradient(
                          review.name
                        )} text-white flex items-center justify-center font-black text-sm shadow-md shrink-0`}
                      >
                        {getAvatarInitials(review.name)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">{review.name}</p>
                        <p className="text-[11px] text-white/60 font-mono">{review.date}</p>
                      </div>
                    </div>
                    <Stars rating={review.rating} readOnly size="sm" />
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-white/90 leading-relaxed italic">
                    “{review.comment}”
                  </p>

                  {/* Official Dunas Travel Reply */}
                  {review.adminReply && (
                    <div className="mt-3 p-3 rounded-2xl bg-amber-400/10 border border-amber-400/25 text-xs text-white/95">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px] mb-1">
                        <FaReply className="w-3 h-3" />
                        <span>Dunas Travel Team:</span>
                      </div>
                      <p className="leading-relaxed text-[11px]">{review.adminReply}</p>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Submit Review Form */}
        <form onSubmit={submit} className="mx-auto max-w-2xl rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl p-8 sm:p-10 shadow-2xl space-y-5">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold text-white">{t('tour.leaveReview', 'Write a Review')}</h3>
            <p className="text-xs text-white/70">
              {t('reviews.shareYourThoughts', 'Share your thoughts and rate your luxury travel experience.')}
            </p>
          </div>

          {submitted && (
            <div role="status" className="flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/20 px-4 py-3.5 text-sm text-emerald-200">
              <FaCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{t('reviews.reviewSuccess', 'Thank you! Your review has been submitted and will appear once approved by our team.')}</span>
            </div>
          )}

          {submitError && (
            <div role="alert" className="rounded-2xl border border-rose-500/40 bg-rose-500/20 px-4 py-3.5 text-sm text-rose-200">
              {submitError}
            </div>
          )}

          {/* Reviewer Name */}
          <div className="space-y-1.5">
            <label htmlFor="reviewer-name-input" className="block text-xs font-bold uppercase tracking-wider text-white">
              {t('reviews.yourName', 'Your Name')} *
            </label>
            <input
              id="reviewer-name-input"
              type="text"
              required
              value={form.reviewerName}
              onChange={(e) => setForm({ ...form, reviewerName: e.target.value })}
              placeholder="e.g. Sarah Jenkins"
              className="w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Rating Stars */}
          <div className="space-y-1.5">
            <span className="block text-xs font-bold uppercase tracking-wider text-white">
              {t('reviews.rating', 'Rating')} (1-5 ⭐) *
            </span>
            <div className="py-1">
              <Stars
                rating={form.rating}
                onRate={(rating) => setForm({ ...form, rating })}
                readOnly={false}
                size="lg"
              />
            </div>
          </div>

          {/* Comment Text */}
          <div className="space-y-1.5">
            <label htmlFor="review-body-text" className="block text-xs font-bold uppercase tracking-wider text-white">
              {t('reviews.reviewText', 'Your Review')} *
            </label>
            <textarea
              id="review-body-text"
              required
              rows={4}
              maxLength={5000}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder={t('reviews.commentPlaceholder', 'Tell us about your tour guide, accommodation, transport, and favorite moments...')}
              className="w-full resize-none rounded-xl border border-white/25 bg-white/10 p-4 text-sm text-white placeholder-white/50 focus:border-amber-400 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 py-4 text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-60 cursor-pointer"
          >
            {submitting ? t('reviews.submitting', 'Submitting…') : t('tour.submitReview', 'Submit Review')}
          </button>
        </form>
      </div>
    </section>
  );
}
