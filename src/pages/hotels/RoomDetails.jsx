import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBed,
  FaUserFriends,
  FaArrowLeft,
  FaWifi,
  FaSnowflake,
  FaBath,
  FaWineGlass,
  FaCoffee,
  FaTv,
  FaLock,
  FaShieldAlt,
  FaPhoneAlt,
  FaStar,
  FaCheck,
  FaTimes,
  FaBan,
  FaPaw,
  FaSearchPlus,
  FaCheckCircle,
  FaFacebook,
  FaInstagram,
  FaGlobe,
} from 'react-icons/fa';
import { useCurrency } from '../../context/CurrencyContext';
import Button from '../../components/ui/Button';

const RoomDetails = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const { roomSlug } = useParams();
  const location = useLocation();
  const { formatPrice } = useCurrency();

  const [activeImage, setActiveImage] = useState(null);
  const basePath = location.pathname.startsWith('/programs') ? '/programs' : '/services';

  const roomDataMap = {
    'double-room': {
      id: 'double-room',
      name: t('hotel.room.doubleTitle', 'Double Room'),
      price: 85,
      capacity: t('hotel.room.doubleCapacity', '1–2 Guests'),
      bed: t('hotel.room.doubleBed', '1 King Bed'),
      view: t('hotel.room.doubleView', 'Pyramids View'),
      image: 'https://www.solpyramid-egypt.com/wp-content/uploads/2022/08/Single-900x500.jpg',
      gallery: [
        'https://www.solpyramid-egypt.com/wp-content/uploads/2022/08/Single-900x500.jpg',
        'https://www.solpyramid-egypt.com/wp-content/uploads/2022/08/IMG-20251007-WA0013.jpg',
        'https://www.solpyramid-egypt.com/wp-content/uploads/2022/08/IMG-20251007-WA0010.jpg',
        'https://www.solpyramid-egypt.com/wp-content/uploads/2022/08/TV-Unit.jpg',
        'https://www.solpyramid-egypt.com/wp-content/uploads/2022/08/Tea-Tabel.jpg',
        'https://www.solpyramid-egypt.com/wp-content/uploads/2022/08/View.jpg',
      ],
    },
    'twin-room': {
      id: 'twin-room',
      name: t('hotel.room.twinTitle', 'Twin Room'),
      price: 85,
      capacity: t('hotel.room.twinCapacity', '2 Guests'),
      bed: t('hotel.room.twinBed', 'Double/Twin'),
      view: t('hotel.room.twinView', 'Standard View'),
      image: 'https://www.solpyramid-egypt.com/wp-content/uploads/2026/02/Double-900x500.jpg',
      gallery: [
        'https://www.solpyramid-egypt.com/wp-content/uploads/2026/02/Double-900x500.jpg',
        'https://www.solpyramid-egypt.com/wp-content/uploads/2022/08/IMG-20251007-WA0009.jpg',
        'https://www.solpyramid-egypt.com/wp-content/uploads/2022/08/IMG-20251007-WA0006.jpg',
        'https://www.solpyramid-egypt.com/wp-content/uploads/2022/08/TV-Unit.jpg',
        'https://www.solpyramid-egypt.com/wp-content/uploads/2022/08/Tea-Tabel.jpg',
      ],
    },
    'triple-room': {
      id: 'triple-room',
      name: t('hotel.room.tripleTitle', 'Triple Room'),
      price: 110,
      capacity: t('hotel.room.tripleCapacity', '3 Guests'),
      bed: t('hotel.room.tripleBed', 'Double/Twin'),
      view: t('hotel.room.tripleView', 'Standard View'),
      image: 'https://www.solpyramid-egypt.com/wp-content/uploads/2026/02/Triple-900x500.jpg',
      gallery: [
        'https://www.solpyramid-egypt.com/wp-content/uploads/2026/02/Triple-900x500.jpg',
        'https://www.solpyramid-egypt.com/wp-content/uploads/2022/08/IMG-20251007-WA0002.jpg',
        'https://www.solpyramid-egypt.com/wp-content/uploads/2022/08/IMG-20251007-WA0004.jpg',
        'https://www.solpyramid-egypt.com/wp-content/uploads/2022/08/TV-Unit.jpg',
        'https://www.solpyramid-egypt.com/wp-content/uploads/2022/08/Tea-Tabel.jpg',
      ],
    },
  };

  const room = roomDataMap[roomSlug];

  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    guests: '1',
    specialRequests: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const [reviews, setReviews] = useState([
    {
      name: 'Sofia Rodriguez',
      rating: 5,
      date: '2026-05-12',
      text: 'Stunning Pyramids views straight from the window! Extremely comfortable cotton sheets and very helpful service.',
    },
    {
      name: 'Marco Rossi',
      rating: 4,
      date: '2026-04-20',
      text: 'Comfortable beds, reliable Wi-Fi, and a quiet AC unit. Highly recommended for visiting the pyramids.',
    },
  ]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [roomSlug]);

  if (!room) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-obsidian-900 flex flex-col items-center justify-center p-6 text-slate-800 dark:text-slate-200">
        <h2 className="text-display-md text-red-600 font-display mb-4">
          {t('hotel.room.notFound', 'Room Not Found')}
        </h2>
        <p className="text-body-md mb-8">
          {t('hotel.room.notFoundDesc', 'The requested room type could not be loaded.')}
        </p>
        <Link to={`${basePath}/hotels/sol-pyramid-hotel`}>
          <Button variant="gold-glow">{t('hotel.room.backToHotel', 'Back to Hotel Details')}</Button>
        </Link>
      </div>
    );
  }

  const roomAmenitiesList = [
    { label: t('hotel.fac.wifi', 'Free Wi-Fi'), icon: <FaWifi className="text-gold-500 text-lg" /> },
    { label: t('hotel.fac.ac', 'Air conditioning (cold & heat)'), icon: <FaSnowflake className="text-gold-500 text-lg" /> },
    { label: t('hotel.fac.bathroom', 'Private bathroom with amenities'), icon: <FaBath className="text-gold-500 text-lg" /> },
    { label: t('hotel.fac.minibar', 'Mini bar — refrigerated, stocked (against charge)'), icon: <FaWineGlass className="text-gold-500 text-lg" /> },
    { label: t('hotel.fac.coffee', 'Coffee & tea — daily refreshment basis'), icon: <FaCoffee className="text-gold-500 text-lg" /> },
    { label: t('hotel.fac.linen', '100% Egyptian cotton linen & bed covers'), icon: <FaBed className="text-gold-500 text-lg" /> },
    { label: t('hotel.fac.tv', 'TV — Italian, Spanish, English, Portuguese, Sport, Kids, Arabic channels'), icon: <FaTv className="text-gold-500 text-lg" /> },
    { label: t('hotel.fac.safe', 'Free safe box'), icon: <FaLock className="text-gold-500 text-lg" /> },
    { label: t('hotel.fac.iron', 'Iron & ironing board (upon request)'), icon: <FaShieldAlt className="text-gold-500 text-lg" /> },
    { label: t('hotel.fac.phone', 'In-room phone'), icon: <FaPhoneAlt className="text-gold-500 text-lg" /> },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (bookingForm.checkInDate && bookingForm.checkInDate < todayStr) return;
    setIsSending(true);
    const subject = encodeURIComponent(`Booking Request: ${room.name} - Sol Pyramid Hotel`);
    const bodyText = `New Booking Request Details:\n\nRoom Type: ${room.name}\nFull Name: ${bookingForm.fullName}\nEmail: ${bookingForm.email}\nPhone Number: ${bookingForm.phone}\nCheck-in Date: ${bookingForm.checkInDate}\nCheck-out Date: ${bookingForm.checkOutDate}\nNumber of Guests: ${bookingForm.guests}\nSpecial Requests: ${bookingForm.specialRequests || 'None'}\n\nPlease check availability and confirm.`;
    const mailtoUrl = `mailto:info@solpyramid-egypt.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    setTimeout(() => {
      setIsSending(false);
      setRequestSent(true);
      window.location.href = mailtoUrl;
    }, 1200);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    const reviewObj = {
      name: newReview.name,
      rating: parseInt(newReview.rating),
      date: new Date().toISOString().split('T')[0],
      text: newReview.text,
    };
    setReviews([reviewObj, ...reviews]);
    setNewReview({ name: '', rating: 5, text: '' });
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const hotelContact = {
    location:
      '05 Rawdet al Ahram, Behind Le Meridien Pyramids St., Old Hadayek al Ahram – Haram – Giza – Egypt',
    telephones: ['+2 02 33775511', '+2 02 33775522'],
    cell: '(+2) 01149401111',
    email: 'info@solpyramid-egypt.com',
    facebook: 'https://www.facebook.com/share/1aiB2ma5oi/',
    instagram: 'https://www.instagram.com/solpyramidhotel',
    website: 'https://www.solpyramid-egypt.com/',
  };

  return (
    <div className="w-full bg-[#FAF9F5] dark:bg-obsidian-900 pb-24 text-slate-800 dark:text-slate-200 leading-relaxed font-body">
      <Helmet>
        <title>{`${room.name} | Sol Pyramid Hotel | Dunas Travel`}</title>
        <meta
          name="description"
          content={`Book the elegant ${room.name} at Sol Pyramid Hotel. Enjoy premium Giza amenities, 100% Egyptian cotton linen, direct pyramid views, and luxury concierge support.`}
        />
      </Helmet>

      {/* Header Banner */}
      <section className="relative min-h-[100svh] md:h-[60vh] md:min-h-[400px] flex items-end justify-center overflow-hidden pb-12 pt-32 md:pb-16 md:pt-0">
        <div className="absolute inset-0 z-0">
          <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/60 bg-gradient-to-t from-[#FAF9F5] via-slate-900/40 to-transparent dark:from-obsidian-900" />
        </div>
        <div className="relative z-10 container mx-auto px-6 max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full">
          <div className="text-left w-full md:w-auto rtl:text-right">
            <Link
              to={`${basePath}/hotels/sol-pyramid-hotel`}
              className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-600 font-semibold mb-4 transition-colors"
            >
              <FaArrowLeft className={isRtl ? 'rotate-180' : ''} />
              <span>{t('common.back', 'Back to Hotel')}</span>
            </Link>
            <h1 className="text-4xl md:text-6xl text-white font-display font-semibold drop-shadow-md mb-2 leading-tight">
              {room.name}
            </h1>
            <p className="text-white/95 text-base md:text-lg font-medium flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="flex items-center gap-1 text-gold-500">
                <FaBed className="shrink-0" /> {room.bed}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1 text-gold-500">
                <FaUserFriends className="shrink-0" /> {room.capacity}
              </span>
              {room.view && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-gold-500 w-full sm:w-auto">{room.view}</span>
                </>
              )}
            </p>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-white w-full md:w-auto shadow-xl shrink-0 text-center md:text-right rtl:md:text-left">
            <div className="text-gold-500 text-xs uppercase tracking-widest mb-1">
              {t('tourCard.startingFrom', 'Price')}
            </div>
            <div className="text-3xl font-semibold text-gold-400 mb-1">
              {formatPrice(room.price)}
              <span className="text-sm font-normal text-slate-300"> / {t('hotel.night', 'night')}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {t('hotel.room.taxesInc', 'Taxes & fees included')}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-12 text-left rtl:text-right">
            {/* Room Features Bar */}
            <div className="bg-white dark:bg-obsidian-800 p-5 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-obsidian-700 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-300 block mb-1 font-bold">
                  {t('hotel.room.priceLabel', 'Price')}
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatPrice(room.price)} / {t('hotel.night', 'night')}
                </span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-300 block mb-1 font-bold">
                  {t('hotel.room.capacityLabel', 'Capacity')}
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{room.capacity}</span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-300 block mb-1 font-bold">
                  {t('hotel.room.bedTypeLabel', 'Bed Type')}
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{room.bed}</span>
              </div>
              {room.view && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-300 block mb-1 font-bold">
                    {t('hotel.room.viewLabel', 'View')}
                  </span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{room.view}</span>
                </div>
              )}
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-300 block mb-1 font-bold">
                  {t('hotel.room.smokingLabel', 'Smoking')}
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FaBan className="text-red-500 text-sm" /> {t('hotel.room.notAllowed', 'Not allowed')}
                </span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-300 block mb-1 font-bold">
                  {t('hotel.room.petsLabel', 'Pets')}
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FaPaw className="text-red-500 text-sm" /> {t('hotel.room.notAllowed', 'Not allowed')}
                </span>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="bg-white dark:bg-obsidian-800 p-5 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-obsidian-700">
              <h2 className="text-2xl font-display font-semibold text-slate-900 dark:text-white mb-6 pb-3 border-b border-slate-100 dark:border-obsidian-700 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
                {t('hotel.room.amenities', 'Room Amenities')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roomAmenitiesList.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 py-1 text-slate-800 dark:text-slate-200">
                    <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-[15px] font-medium pt-1.5">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Gallery Grid */}
            <div className="bg-white dark:bg-obsidian-800 p-5 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-obsidian-700">
              <h2 className="text-2xl font-display font-semibold text-slate-900 dark:text-white mb-6 pb-3 border-b border-slate-100 dark:border-obsidian-700 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
                {t('hotel.room.galleryTitle', 'Room Gallery')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.gallery.map((url, idx) => (
                  <div
                    key={idx}
                    className="h-32 sm:h-40 rounded-xl overflow-hidden cursor-pointer relative group border border-slate-100 shadow-sm"
                    onClick={() => setActiveImage(url)}
                  >
                    <img src={url} alt={`${room.name} Interior ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <FaSearchPlus className="text-white text-xl" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-obsidian-800 p-5 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-obsidian-700">
              <h2 className="text-2xl font-display font-semibold text-slate-900 dark:text-white mb-6 pb-3 border-b border-slate-100 dark:border-obsidian-700 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
                {t('hotel.room.reviewsTitle', 'Room Reviews')}
              </h2>

              <div className="space-y-6 mb-10">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 dark:bg-obsidian-700/50 rounded-xl border border-slate-100 dark:border-obsidian-600 text-left rtl:text-right">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-slate-900 dark:text-white">{rev.name}</h4>
                      <span className="text-xs text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex gap-1 mb-3 text-gold-500">
                      {[...Array(rev.rating)].map((_, rIdx) => (
                        <FaStar key={rIdx} />
                      ))}
                    </div>
                    <p className="text-[14px] text-slate-700 dark:text-slate-200 leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleReviewSubmit} className="bg-slate-50 dark:bg-obsidian-700/50 p-6 rounded-xl border border-slate-200/60 dark:border-obsidian-600 text-left rtl:text-right">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  {t('tour.leaveReview', 'Write a Review')}
                </h3>
                {reviewSubmitted && (
                  <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
                    <FaCheckCircle /> {t('hotel.room.reviewSuccess', 'Review submitted successfully!')}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-300 mb-1.5 font-bold">
                      {t('booking.fullName', 'Name')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t('booking.fullName', 'Name')}
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full p-3 rounded-lg border border-slate-300 dark:border-obsidian-600 text-slate-900 dark:text-white text-sm bg-white dark:bg-obsidian-700 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-300 mb-1.5 font-bold">
                      {t('hotel.room.ratingLabel', 'Rating')}
                    </label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                      className="w-full p-3 rounded-lg border border-slate-300 dark:border-obsidian-600 text-slate-900 dark:text-white text-sm bg-white dark:bg-obsidian-700 outline-none"
                    >
                      <option value="5">{t('hotel.room.starsOption5', '⭐⭐⭐⭐⭐ (5 Stars)')}</option>
                      <option value="4">{t('hotel.room.starsOption4', '⭐⭐⭐⭐ (4 Stars)')}</option>
                      <option value="3">{t('hotel.room.starsOption3', '⭐⭐⭐ (3 Stars)')}</option>
                      <option value="2">{t('hotel.room.starsOption2', '⭐⭐ (2 Stars)')}</option>
                      <option value="1">{t('hotel.room.starsOption1', '⭐ (1 Star)')}</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-300 mb-1.5 font-bold">
                    {t('hotel.room.commentLabel', 'Comment')}
                  </label>
                  <textarea
                    required
                    rows="3"
                    placeholder={t('hotel.room.commentPlaceholder', 'Share your experience with this room...')}
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-obsidian-600 text-slate-900 dark:text-white text-sm bg-white dark:bg-obsidian-700 outline-none resize-none"
                  />
                </div>
                <Button type="submit" variant="gold-glow" className="px-5 py-2 text-sm uppercase font-semibold">
                  {t('tour.submitReview', 'Submit Review')}
                </Button>
              </form>
            </div>
          </div>

          {/* Booking Sidebar Form */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 text-white p-5 md:p-8 rounded-2xl border border-slate-800 shadow-xl sticky top-24 text-left rtl:text-right">
              <h3 className="text-xl font-display font-semibold text-gold-400 mb-2">
                {t('hotel.room.requestBooking', 'Request Booking')}
              </h3>
              <p className="text-slate-300 text-xs mb-6">
                {t('hotel.room.bookingDesc', 'Submit this request to check availability. We will pre-fill a draft to: ')}{' '}
                <span className="text-gold-300 font-semibold">info@solpyramid-egypt.com</span>
              </p>

              {requestSent ? (
                <div className="bg-gold-500/10 border border-gold-500/30 p-6 rounded-xl text-center space-y-4">
                  <FaCheckCircle className="text-gold-500 text-4xl mx-auto" />
                  <h4 className="font-semibold text-white">{t('hotel.room.requestDrafted', 'Request Drafted')}</h4>
                  <p className="text-xs text-slate-300">
                    {t(
                      'hotel.room.requestDraftedDesc',
                      'Your request was successfully generated. Please check your default email client to send the prefilled request directly.'
                    )}
                  </p>
                  <Button variant="gold-glow" className="w-full text-xs uppercase py-2" onClick={() => setRequestSent(false)}>
                    {t('hotel.room.newRequest', 'New Request')}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-gold-500 font-bold mb-1">
                      {t('booking.fullName', 'Full Name')}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder={t('hotel.room.fullNamePlaceholder', 'Enter Full Name')}
                      value={bookingForm.fullName}
                      onChange={handleInputChange}
                      className="w-full p-3.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-sm outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-gold-500 font-bold mb-1">
                      {t('booking.email', 'Email Address')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder={t('hotel.room.emailPlaceholder', 'your.email@example.com')}
                      value={bookingForm.email}
                      onChange={handleInputChange}
                      className="w-full p-3.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-sm outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-gold-500 font-bold mb-1">
                      {t('booking.phone', 'Phone Number')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder={t('hotel.room.phonePlaceholder', 'e.g. +1 555-0199')}
                      value={bookingForm.phone}
                      onChange={handleInputChange}
                      className="w-full p-3.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-sm outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-gold-500 font-bold mb-1">
                        {t('hotel.room.checkInLabel', 'Check-in')}
                      </label>
                      <input
                        type="date"
                        name="checkInDate"
                        required
                        value={bookingForm.checkInDate}
                        min={todayStr}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-gold-500 font-bold mb-1">
                        {t('hotel.room.checkOutLabel', 'Check-out')}
                      </label>
                      <input
                        type="date"
                        name="checkOutDate"
                        required
                        value={bookingForm.checkOutDate}
                        min={bookingForm.checkInDate || todayStr}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-gold-500 font-bold mb-1">
                      {t('hotel.room.guestsLabel', 'Number of Guests')}
                    </label>
                    <select
                      name="guests"
                      value={bookingForm.guests}
                      onChange={handleInputChange}
                      className="w-full p-3.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-gold-500"
                    >
                      <option value="1">{t('hotel.room.guest1', '1 Guest')}</option>
                      <option value="2">{t('hotel.room.guests2', '2 Guests')}</option>
                      <option value="3">{t('hotel.room.guests3', '3 Guests')}</option>
                      <option value="4">{t('hotel.room.guests4', '4 Guests')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-gold-500 font-bold mb-1">
                      {t('hotel.room.specialRequestsLabel', 'Special Requests (Optional)')}
                    </label>
                    <textarea
                      name="specialRequests"
                      rows="2"
                      placeholder={t('hotel.room.specialRequestsPlaceholder', 'Any specific requests or requirements...')}
                      value={bookingForm.specialRequests}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-xs outline-none focus:border-gold-500 resize-none"
                    />
                  </div>

                  <Button type="submit" variant="gold-glow" className="w-full py-3.5 text-sm uppercase font-semibold text-center" disabled={isSending}>
                    {isSending ? t('common.sending', 'Sending...') : t('hotel.room.requestBookingBtn', 'Request Booking')}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Contact Card */}
      <section className="container mx-auto px-6 py-6 max-w-6xl mt-12 border-t border-slate-200 dark:border-obsidian-700">
        <div className="bg-slate-900 text-white p-5 md:p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 text-left rtl:text-right">
          <div>
            <h3 className="text-xl font-display font-semibold text-gold-400 mb-2">Sol Pyramid Hotel</h3>
            <p className="text-xs text-slate-400 max-w-md">{hotelContact.location}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-slate-300">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                📞 {t('booking.phone', 'Phone')}
              </span>
              <span className="font-semibold block">{hotelContact.telephones.join(' / ')}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                📱 {t('hotel.room.cellLabel', 'Cell')}
              </span>
              <span className="font-semibold block">{hotelContact.cell}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                ✉️ {t('booking.email', 'Email')}
              </span>
              <span className="font-semibold block">{hotelContact.email}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <a
              href={hotelContact.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gold-500 hover:text-slate-900 transition-all text-slate-300"
              aria-label="Facebook"
            >
              <FaFacebook size={18} />
            </a>
            <a
              href={hotelContact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gold-500 hover:text-slate-900 transition-all text-slate-300"
              aria-label="Instagram"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href={hotelContact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gold-500 hover:text-slate-900 transition-all text-slate-300"
              aria-label="Website"
            >
              <FaGlobe size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-gold-500 z-50 transition-colors"
              onClick={() => setActiveImage(null)}
              aria-label="Close image preview"
            >
              <FaTimes size={32} />
            </button>
            <img src={activeImage} className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" alt="Room preview" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomDetails;
