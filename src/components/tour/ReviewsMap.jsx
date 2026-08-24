import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaRegStar, FaStar } from 'react-icons/fa';
import api from '../../utils/api';

function Stars({ rating, onRate, readOnly = false }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" disabled={readOnly} onClick={() => onRate?.(star)} className={readOnly ? 'cursor-default' : 'cursor-pointer'}>
          {star <= rating ? <FaStar className="w-4 h-4 text-white" /> : <FaRegStar className="w-4 h-4 text-white" />}
        </button>
      ))}
    </div>
  );
}

function formatReview(review, locale) {
  return {
    id: review.id,
    name: review.reviewerName || 'Anonymous traveler',
    rating: review.rating,
    comment: review.comment || '',
    date: new Date(review.createdAt).toLocaleDateString(locale, { month: 'long', year: 'numeric' }),
  };
}

export default function ReviewsMap({ tourId }) {
  const { t, i18n } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ bookingId: '', rating: 5, comment: '' });

  useEffect(() => {
    if (!tourId) return undefined;
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return;
      setLoading(true);
      setLoadError('');
    });
    api.get(`/tours/${encodeURIComponent(tourId)}/reviews`)
      .then((response) => {
        if (!active) return;
        const items = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
        setReviews(items.map((review) => formatReview(review, i18n.language || 'en')));
        const averageRating = items.length
          ? items.reduce((total, review) => total + Number(review.rating || 0), 0) / items.length
          : 0;
        setSummary(response?.ratingSummary || { averageRating, totalReviews: items.length });
      })
      .catch((requestError) => {
        if (!active) return;
        setReviews([]);
        setSummary({ averageRating: 0, totalReviews: 0 });
        setLoadError(requestError?.message || t('reviews.loadError', 'Reviews could not be loaded.'));
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [tourId, i18n.language, t]);

  if (!tourId) return null;

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const payload = {
        rating: Number(form.rating),
        comment: form.comment,
      };
      if (form.bookingId) payload.bookingId = form.bookingId;

      await api.post(`/tours/${encodeURIComponent(tourId)}/reviews`, payload);
      setForm({ bookingId: '', rating: 5, comment: '' });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error?.message || t('reviews.submitError', 'Your review could not be submitted.'));
    } finally {
      setSubmitting(false);
    }
  }

  const averageRating = Number(summary.averageRating || 0).toFixed(1);
  return (
    <section className="reviews-section py-20" style={{ background: 'linear-gradient(135deg, #070D19 0%, #0D2040 100%)' }}>
      <div className="mx-auto max-w-6xl px-6 text-white">
        <header className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest">{t('reviews.subheading', 'Guest Feedback')}</p>
          <h2 className="mb-4 text-4xl font-medium">{t('reviews.titleHeading', 'What People Say')}</h2>
          <div className="flex items-center justify-center gap-3"><Stars rating={Math.round(Number(averageRating))} readOnly /><span className="text-2xl font-bold">{averageRating}</span></div>
          <p className="mt-2 text-sm">{t('reviews.count', 'Based on {{count}} reviews', { count: summary.totalReviews })}</p>
        </header>

        <div aria-busy={loading} className="mb-12">
          {loadError && <p className="text-center">{loadError}</p>}
          {!loading && !loadError && reviews.length === 0 && <p className="text-center">{t('reviews.empty', 'No verified reviews yet.')}</p>}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex items-center justify-between gap-3"><p className="font-semibold">{review.name}</p><Stars rating={review.rating} readOnly /></div>
                <p className="text-sm leading-relaxed">“{review.comment}”</p>
                <p className="mt-4 text-right text-xs font-semibold uppercase tracking-wider">{review.date}</p>
              </article>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8">
          <h3 className="mb-6 text-center text-2xl font-medium">{t('tour.leaveReview', 'Write a Review')}</h3>
          {submitted && <div role="status" className="mb-6 flex gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"><FaCheckCircle />{t('reviews.reviewSuccess', 'Review submitted successfully!')}</div>}
          {submitError && <div role="alert" className="mb-6 rounded-xl border border-red-300/40 bg-red-500/20 px-4 py-3 text-sm">{submitError}</div>}
          <label htmlFor="review-booking-id" className="mb-1.5 block text-xs font-bold uppercase tracking-wider">{t('reviews.bookingId', 'Completed booking ID')} *</label>
          <input id="review-booking-id" required value={form.bookingId} onChange={(event) => setForm((current) => ({ ...current, bookingId: event.target.value }))} className="mb-5 w-full rounded-xl border border-white/20 bg-white/10 p-3" />
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wider">{t('reviews.rating', 'Rating')}</p>
          <div className="mb-5"><Stars rating={form.rating} onRate={(rating) => setForm((current) => ({ ...current, rating }))} /></div>
          <label htmlFor="review-body-text" className="mb-1.5 block text-xs font-bold uppercase tracking-wider">{t('reviews.reviewText', 'Your Review')} *</label>
          <textarea id="review-body-text" required rows="3" maxLength="5000" value={form.comment} onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))} className="mb-5 w-full resize-none rounded-xl border border-white/20 bg-white/10 p-3" />
          <button type="submit" disabled={submitting} className="w-full rounded-full border border-white/20 bg-white/10 py-4 text-xs font-bold uppercase tracking-widest disabled:opacity-60">{submitting ? t('reviews.submitting', 'Submitting…') : t('tour.submitReview', 'Submit Review')}</button>
        </form>
      </div>
    </section>
  );
}
