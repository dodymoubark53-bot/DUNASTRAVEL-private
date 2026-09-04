import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaMinus,
  FaCheckCircle,
  FaPaperPlane,
  FaGlobeAmericas,
  FaUser,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaClock,
  FaStar,
  FaChevronDown,
  FaShieldAlt,
  FaTag,
  FaUserCheck,
  FaBuilding
} from 'react-icons/fa';
import InvoiceModal from './InvoiceModal';
import api from '../../utils/api';
import { redirectToPayLinkCheckout } from '../../utils/paylink';
import { trackEvent } from '../../utils/analytics';
import { useAuth } from '../../context/AuthContext';

const inputClass =
  'w-full px-3.5 py-3 rounded-xl bg-[rgba(255,252,247,0.03)] text-ivory-50 placeholder:text-ivory-400/40 border border-[rgba(201,162,39,0.18)] focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none text-[13.5px] transition-all [color-scheme:dark]';

const labelClass =
  'block text-[11px] font-semibold text-gold-400 uppercase tracking-[1.2px] mb-1.5 flex items-center gap-1.5';

const counterBtnClass =
  'w-8 h-8 rounded-lg bg-gold-500/10 hover:bg-gold-500 text-gold-400 hover:text-obsidian-900 border border-gold-500/25 flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gold-500/10 disabled:hover:text-gold-400';

const omitEmptyFields = (payload) =>
  Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  );

const languages = [
  { value: 'es', flag: '🇪🇸', labelKey: 'languages.spanish', fallback: 'Spanish' },
  { value: 'pt', flag: '🇧🇷', labelKey: 'languages.portuguese', fallback: 'Portuguese' },
  { value: 'it', flag: '🇮🇹', labelKey: 'languages.italian', fallback: 'Italian' },
  { value: 'en', flag: '🇬🇧', labelKey: 'languages.english', fallback: 'English' },
  { value: 'ar', flag: '🇪🇬', labelKey: 'languages.arabic', fallback: 'Arabic' },
];

const BookingForm = ({ tourId, tourSlug, tourTitle, transportChoice, requireTransportChoice, initialPrice = 0 }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const bookingTourKey = tourSlug || tourId;

  useEffect(() => {
    trackEvent('booking_started', { tourSlug: tourTitle || tourId });
  }, [tourTitle, tourId]);

  const [tab, setTab] = useState('booking');
  const [status, setStatus] = useState('idle');
  const [langOpen, setLangOpen] = useState(null);
  const [activityOpen, setActivityOpen] = useState(false);
  const [transportAlert, setTransportAlert] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [error, setError] = useState('');
  const [pricePreview, setPricePreview] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [availabilityStatus, setAvailabilityStatus] = useState('loading');
  const langRef = useRef(null);
  const activityRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(null);
      if (activityRef.current && !activityRef.current.contains(e.target)) setActivityOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;

  const [b, setB] = useState({
    arrivalDate: todayStr,
    departureDate: '',
    arrivalTime: '',
    departureTime: '',
    language: user?.preferredLanguage || i18n.language || 'en',
    activityType: '',
    adults: 1,
    children: 0,
    infants: 0,
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    invoiceType: 'PERSONAL',
    companyName: '',
    taxId: '',
    address: '',
    city: '',
    country: '',
    notes: '',
    _showBilling: false,
  });

  const [passengerNames, setPassengerNames] = useState({});

  const [inq, setInq] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    language: user?.preferredLanguage || i18n.language || 'en',
    message: '',
  });

  // Restore booking intent if user was redirected to login
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const rawIntent = sessionStorage.getItem('dunas_pending_booking_intent');
      if (rawIntent) {
        const intent = JSON.parse(rawIntent);
        const isMatch =
          intent?.tourId === bookingTourKey ||
          intent?.tourSlug === tourSlug ||
          intent?.tourTitle === tourTitle;

        if (isMatch) {
          if (intent.b) {
            setB((prev) => ({
              ...prev,
              ...intent.b,
              fullName: user?.name || intent.b.fullName || prev.fullName,
              email: user?.email || intent.b.email || prev.email,
              phone: user?.phone || intent.b.phone || prev.phone,
            }));
          }
          if (intent.passengerNames) {
            setPassengerNames(intent.passengerNames);
          }
          sessionStorage.removeItem('dunas_pending_booking_intent');
        }
      }
    } catch {
      sessionStorage.removeItem('dunas_pending_booking_intent');
    }
  }, [bookingTourKey, tourSlug, tourTitle, user]);

  useEffect(() => {
    let isMounted = true;
    const availabilityKey = tourSlug || tourId;
    if (!availabilityKey) return undefined;
    queueMicrotask(() => {
      if (isMounted) setAvailabilityStatus('loading');
    });
    api
      .get(`/tours/${encodeURIComponent(availabilityKey)}/availability`)
      .then((response) => {
        if (!isMounted) return;
        const slots = Array.isArray(response?.availabilities)
          ? response.availabilities
          : Array.isArray(response?.data?.availabilities)
          ? response.data.availabilities
          : [];
        setAvailabilities(slots);
        setAvailabilityStatus(slots.length > 0 ? 'ready' : 'empty');
        if (slots.length > 0) {
          const firstDate = String(slots[0].date).slice(0, 10);
          setB((current) => ({
            ...current,
            arrivalDate: slots.some((slot) => String(slot.date).slice(0, 10) === current.arrivalDate)
              ? current.arrivalDate
              : firstDate,
          }));
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setAvailabilities([]);
        setAvailabilityStatus('error');
      });
    return () => {
      isMounted = false;
    };
  }, [tourId, tourSlug]);

  const selectedAvailability = availabilities.find(
    (slot) => String(slot.date).slice(0, 10) === b.arrivalDate
  );

  useEffect(() => {
    if (!user) return undefined;
    let isMounted = true;
    queueMicrotask(() => {
      if (!isMounted) return;
      setB((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        language: prev.language || user.preferredLanguage || i18n.language || 'en',
      }));
      setInq((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        language: prev.language || user.preferredLanguage || i18n.language || 'en',
      }));
    });
    return () => {
      isMounted = false;
    };
  }, [user, i18n.language]);

  const updateB = (k, v) => {
    const num = ['adults', 'children', 'infants'];
    setB((p) => ({ ...p, [k]: num.includes(k) ? Math.max(0, parseInt(v, 10) || 0) : v }));
  };

  const passengerFields = [
    ...Array.from({ length: b.adults }, (_, i) => ({
      type: 'Adult',
      num: i + 1,
      key: `adult_${i}`,
      isLead: i === 0,
    })),
    ...Array.from({ length: b.children }, (_, i) => ({
      type: 'Child',
      num: i + 1,
      key: `child_${i}`,
      isLead: false,
    })),
    ...Array.from({ length: b.infants }, (_, i) => ({
      type: 'Infant',
      num: i + 1,
      key: `infant_${i}`,
      isLead: false,
    })),
  ];

  useEffect(() => {
    if (!bookingTourKey || tab !== 'booking') return;
    const fetchPrice = async () => {
      try {
        const data = await api.post(
          '/bookings/calculate',
          omitEmptyFields({
            tourId: bookingTourKey,
            availabilityId: selectedAvailability?.id,
            date: b.arrivalDate,
            adults: b.adults,
            children: b.children,
            infants: b.infants,
            language: b.language,
          })
        );
        setPricePreview(data);
      } catch {
        setPricePreview(null);
      }
    };
    const debounce = setTimeout(fetchPrice, 350);
    return () => clearTimeout(debounce);
  }, [
    bookingTourKey,
    selectedAvailability?.id,
    b.arrivalDate,
    b.adults,
    b.children,
    b.infants,
    b.language,
    tab,
  ]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Require authentication before submitting booking
    if (!user) {
      if (typeof window !== 'undefined') {
        const draftIntent = {
          tourId: bookingTourKey,
          tourSlug,
          tourTitle,
          transportChoice,
          b,
          passengerNames,
          timestamp: Date.now(),
        };
        sessionStorage.setItem('dunas_pending_booking_intent', JSON.stringify(draftIntent));
        const redirectUrl = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        window.location.assign(redirectUrl);
      }
      return;
    }

    if (requireTransportChoice && !transportChoice) {
      setTransportAlert(true);
      const el = document.getElementById('transport-selector');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setTransportAlert(false);
    if (!selectedAvailability?.id) {
      setError(
        t(
          'booking.noAvailability',
          'No bookable departure is available for this date. Please select another departure or send an inquiry.'
        )
      );
      return;
    }
    setStatus('submitting');
    try {
      const payload = omitEmptyFields({
        type: 'booking',
        tourId: bookingTourKey,
        availabilityId: selectedAvailability.id,
        tourTitle,
        transportChoice: transportChoice || '',
        arrivalDate: b.arrivalDate,
        departureDate: b.departureDate,
        arrivalTime: b.arrivalTime,
        departureTime: b.departureTime,
        language: ['en', 'ar', 'es', 'pt', 'it'].includes(b.language?.toLowerCase())
          ? b.language.toLowerCase()
          : 'en',
        activityType: b.activityType,
        adults: b.adults,
        children: b.children,
        infants: b.infants,
        passengerNames: Object.fromEntries(Object.entries(passengerNames)),
        notes: b.notes,
        fullName: b.fullName,
        email: b.email,
        phone: b.phone,
        invoiceType: b.invoiceType,
        companyName: b.companyName,
        taxId: b.taxId,
        address: b.address,
        city: b.city,
        country: b.country,
        analyticsSessionId:
          typeof window !== 'undefined' ? localStorage.getItem('dunas_analytics_sid') : undefined,
        originInterfaceSlug:
          typeof window !== 'undefined' ? sessionStorage.getItem('dunas_origin_interface') : undefined,
      });

      const data = await api.post('/bookings', payload);

      const bookingResultData = { ...data, type: 'booking' };
      if ((data?.id || data?.referenceCode) && data?.paymentRequired !== false) {
        try {
          const readiness = await api.get('/payments/readiness');
          if (readiness?.enabled && readiness?.configured) {
            const targetId = data?.id || data?.data?.id;
            if (targetId) {
              const payData = await api.post('/payments/initiate', { bookingId: targetId });
              const sessionUrl = payData?.sessionUrl || payData?.url;
              if (sessionUrl) {
                redirectToPayLinkCheckout(sessionUrl);
                return;
              }
            }
          } else {
            bookingResultData.paymentUnavailable = true;
            bookingResultData.paymentProvider = readiness?.provider || 'GETPAYIN';
          }
        } catch (payErr) {
          console.error('Payment initiation failed', payErr);
          bookingResultData.paymentUnavailable = true;
          bookingResultData.paymentProvider = 'GETPAYIN';
        }
      }

      setBookingResult(bookingResultData);
      setStatus('success');
    } catch (err) {
      if (err.status === 409) {
        setError(
          t(
            'booking.errorConflict',
            'A booking conflict exists for the selected dates. Please adjust your itinerary.'
          )
        );
      } else if (err.status === 422) {
        setError(
          t('booking.errorValidation', 'Please verify passenger and date information before proceeding.')
        );
      } else {
        setError(err.message || 'Error processing request');
      }
      setStatus('idle');
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('submitting');
    try {
      const payload = omitEmptyFields({
        fullName: inq.name,
        email: inq.email,
        phone: inq.phone,
        preferredLanguage: ['en', 'ar', 'es', 'pt', 'it', 'fr', 'de'].includes(
          inq.language?.toLowerCase()
        )
          ? inq.language.toLowerCase()
          : 'en',
        destinations: [tourTitle || tourId || 'Custom Experience'],
        adults: 1,
        children: 0,
        notes: inq.message,
      });
      const data = await api.post('/inquiries', payload);
      setBookingResult({ ...data, type: 'inquiry' });
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Error processing request');
      setStatus('idle');
    }
  };

  return (
    <div
      ref={langRef}
      className="bg-[#121118]/95 backdrop-blur-xl text-ivory-50 rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.55)] border border-[rgba(201,162,39,0.22)] hover:border-gold-500/40 transition-all duration-300 overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {status === 'success' && bookingResult ? (
          <motion.div
            key="success-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center text-center py-10 px-6"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(201,162,39,0.35)] ring-4 ring-gold-500/20">
              <FaCheckCircle className="text-obsidian-900 text-2xl" />
            </div>
            <span className="text-[11px] font-mono text-gold-400 uppercase tracking-widest block mb-1">
              Ref: #{bookingResult.referenceCode || bookingResult.id || 'CONFIRMED'}
            </span>
            <h3 className="text-display-sm text-ivory-50 mb-2 font-display">
              {bookingResult.type === 'booking'
                ? t('booking.created', 'Booking Created')
                : t('booking.inquirySent', 'Inquiry Sent')}
            </h3>
            <p className="text-body-sm text-ivory-300 max-w-sm mx-auto leading-relaxed">
              {bookingResult.paymentUnavailable
                ? t(
                    'payment.getPayInPending',
                    'Your reservation is securely created. An official GatePayIn payment invoice will be dispatched to your email.'
                  )
                : t('booking.successDesc', 'Our private travel concierge will reach out to you within 24 hours.')}
            </p>

            {bookingResult.type === 'booking' && bookingResult.invoiceNumber && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowInvoice(true);
                }}
                className="mt-5 px-6 py-3 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-900 font-bold rounded-xl hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] hover:scale-105 active:scale-95 transition-all text-[12px] uppercase tracking-[1.5px] flex items-center gap-2 cursor-pointer"
              >
                <FaFileInvoiceDollar size={14} /> {t('booking.viewInvoice', 'Inspect Official Invoice')}
              </button>
            )}

            {transportChoice && (
              <div className="mt-4 bg-gold-500/10 border border-gold-500/30 rounded-xl px-4 py-2.5 text-start w-full">
                <p className="text-[10px] text-gold-400 uppercase tracking-widest font-semibold mb-0.5">
                  {t('booking.transport', 'Selected Transport')}
                </p>
                <p className="text-body-sm text-ivory-100 font-medium">
                  {transportChoice === 'train'
                    ? `🚄 ${t('tour.highSpeedTrain', 'High-Speed Luxury Rail')}`
                    : `🚌 ${t('tour.bus', 'Panoramic Coach')} ${t('tour.viaGrandBazaar', 'via Grand Bazaar')}`}
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <div key="form-view">
            {/* Header */}
            <div className="px-5 pt-5 pb-3 border-b border-[rgba(201,162,39,0.12)] bg-gradient-to-b from-[rgba(201,162,39,0.06)] to-transparent">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <FaPaperPlane className="text-[11px]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-body-lg text-ivory-50 font-display font-semibold truncate leading-tight">
                    {t('booking.formTitle', 'Reserve Your Experience')}
                  </h3>
                  <p className="text-[11px] text-ivory-400 truncate mt-0.5">{tourTitle || 'Exclusive Itinerary'}</p>
                </div>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="px-5 pt-3">
              <div className="flex p-1 bg-[rgba(255,252,247,0.03)] rounded-xl border border-gold-500/15">
                <button
                  type="button"
                  onClick={() => setTab('booking')}
                  className={`flex-1 py-2 rounded-lg text-[12px] font-bold uppercase tracking-[1.5px] transition-all flex items-center justify-center gap-1.5 ${
                    tab === 'booking'
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-900 shadow-[0_2px_10px_rgba(245,166,35,0.25)]'
                      : 'text-ivory-400 hover:text-ivory-100'
                  }`}
                >
                  <FaCalendarAlt size={11} /> {t('booking.tabBooking', 'Book Trip')}
                </button>
                <button
                  type="button"
                  onClick={() => setTab('inquiry')}
                  className={`flex-1 py-2 rounded-lg text-[12px] font-bold uppercase tracking-[1.5px] transition-all flex items-center justify-center gap-1.5 ${
                    tab === 'inquiry'
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-900 shadow-[0_2px_10px_rgba(245,166,35,0.25)]'
                      : 'text-ivory-400 hover:text-ivory-100'
                  }`}
                >
                  <FaPaperPlane size={10} /> {t('booking.tabInquiry', 'Inquiry')}
                </button>
              </div>
            </div>

            {error && (
              <div className="mx-5 mt-3 bg-red-500/15 border border-red-500/40 rounded-xl px-4 py-3 text-center">
                <p className="text-body-sm text-red-400 font-medium">{typeof error === 'object' && error !== null ? (error.message || String(error)) : error}</p>
              </div>
            )}

            {tab === 'booking' ? (
              <form onSubmit={handleBookingSubmit} className="px-5 py-4 space-y-4">
                {/* Dates Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="arrival-date-input" className={labelClass}>
                      <FaCalendarAlt className="text-gold-400" size={11} />
                      {t('booking.arrivalDate', 'Arrival Date')}
                    </label>
                    {availabilities.length > 0 ? (
                      <select
                        id="arrival-date-input"
                        value={b.arrivalDate}
                        onChange={(e) => updateB('arrivalDate', e.target.value)}
                        required
                        className={`${inputClass} appearance-none font-mono text-[12.5px]`}
                      >
                        {availabilities.map((slot) => {
                          const date = String(slot.date).slice(0, 10);
                          return (
                            <option key={slot.id} value={date} className="bg-[#1a1a2e] text-ivory-50">
                              {date} ({slot.remainingSeats} {t('booking.seatsLeft', 'seats')})
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <input
                        id="arrival-date-input"
                        type="date"
                        value={b.arrivalDate}
                        min={todayStr}
                        onChange={(e) => updateB('arrivalDate', e.target.value)}
                        required
                        className={inputClass}
                        disabled={availabilityStatus === 'loading'}
                      />
                    )}
                  </div>
                  <div>
                    <label htmlFor="departure-date-input" className={labelClass}>
                      <FaCalendarAlt className="text-gold-400" size={11} />
                      {t('booking.departureDate', 'Departure Date')}
                    </label>
                    <input
                      id="departure-date-input"
                      type="date"
                      value={b.departureDate}
                      min={b.arrivalDate || todayStr}
                      onChange={(e) => updateB('departureDate', e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>


                {/* Times */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="arrival-time-input" className={labelClass}>
                      <FaClock className="text-gold-400" size={11} />
                      {t('booking.arrivalTime', 'Arrival Time')}
                    </label>
                    <input
                      id="arrival-time-input"
                      type="time"
                      value={b.arrivalTime}
                      onChange={(e) => updateB('arrivalTime', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="departure-time-input" className={labelClass}>
                      <FaClock className="text-gold-400" size={11} />
                      {t('booking.departureTime', 'Departure Time')}
                    </label>
                    <input
                      id="departure-time-input"
                      type="time"
                      value={b.departureTime}
                      onChange={(e) => updateB('departureTime', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Language & Activity Preferences */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <label htmlFor="language-btn" className={labelClass}>
                      <FaGlobeAmericas className="text-gold-400" size={11} />
                      {t('booking.preferredLanguage', 'Tour Language')}
                    </label>
                    <button
                      id="language-btn"
                      type="button"
                      onClick={() => setLangOpen(langOpen === 'booking' ? null : 'booking')}
                      className={`${inputClass} text-left flex items-center justify-between`}
                    >
                      {b.language ? (
                        <div className="flex items-center gap-2">
                          <span className="text-base">{languages.find((l) => l.value === b.language)?.flag}</span>
                          <span className="text-ivory-100">
                            {t(
                              languages.find((l) => l.value === b.language)?.labelKey,
                              languages.find((l) => l.value === b.language)?.fallback
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="text-ivory-400">{t('booking.selectLanguage', 'Select...')}</span>
                      )}
                      <FaChevronDown size={10} className="text-gold-400" />
                    </button>
                    {langOpen === 'booking' && (
                      <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-gold-500/30 rounded-xl overflow-hidden shadow-2xl backdrop-blur-lg">
                        {languages.map((lang) => (
                          <button
                            key={lang.value}
                            type="button"
                            onClick={() => {
                              updateB('language', lang.value);
                              setLangOpen(null);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 text-body-sm transition-colors hover:bg-gold-500/10 ${
                              b.language === lang.value ? 'text-gold-400 bg-gold-500/15 font-semibold' : 'text-ivory-100'
                            }`}
                          >
                            <span className="text-base">{lang.flag}</span>
                            <span>{t(lang.labelKey, lang.fallback)}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={activityRef}>
                    <label htmlFor="activity-btn" className={labelClass}>
                      <FaStar className="text-gold-400" size={11} />
                      {t('booking.activityType', 'Tier Category')}
                    </label>
                    <button
                      id="activity-btn"
                      type="button"
                      onClick={() => setActivityOpen(!activityOpen)}
                      className={`${inputClass} text-left flex items-center justify-between`}
                    >
                      {b.activityType ? (
                        <span className="text-ivory-100">
                          {b.activityType === 'standard'
                            ? t('booking.standardCategory', 'Classic Luxury')
                            : t('booking.premiumCategory', 'VIP Signature')}
                        </span>
                      ) : (
                        <span className="text-ivory-400">{t('booking.selectActivity', 'Select Tier')}</span>
                      )}
                      <FaChevronDown size={10} className="text-gold-400" />
                    </button>
                    {activityOpen && (
                      <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-gold-500/30 rounded-xl overflow-hidden shadow-2xl">
                        <button
                          type="button"
                          onClick={() => {
                            updateB('activityType', 'standard');
                            setActivityOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 text-body-sm transition-colors hover:bg-gold-500/10 ${
                            b.activityType === 'standard' ? 'text-gold-400 bg-gold-500/15 font-semibold' : 'text-ivory-100'
                          }`}
                        >
                          {t('booking.standardCategory', 'Classic Luxury')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateB('activityType', 'premium');
                            setActivityOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 text-body-sm transition-colors hover:bg-gold-500/10 ${
                            b.activityType === 'premium' ? 'text-gold-400 bg-gold-500/15 font-semibold' : 'text-ivory-100'
                          }`}
                        >
                          {t('booking.premiumCategory', 'VIP Signature')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Passengers Selection */}
                <div>
                  <span className={labelClass}>
                    <FaUser className="text-gold-400" size={11} />
                    {t('booking.passengers', 'Travelers Count')}
                  </span>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { k: 'adults', lbl: t('booking.adults', 'Adults'), min: 1, sub: '12+ yrs' },
                      { k: 'children', lbl: t('booking.children', 'Children'), min: 0, sub: '2-11 yrs' },
                      { k: 'infants', lbl: t('booking.infants', 'Infants'), min: 0, sub: '<2 yrs' },
                    ].map(({ k, lbl, min, sub }) => (
                      <div
                        key={k}
                        className="bg-[rgba(255,252,247,0.02)] rounded-xl p-2.5 border border-gold-500/15 text-center flex flex-col justify-between"
                      >
                        <div>
                          <span className="block text-[11px] font-semibold text-ivory-200">{lbl}</span>
                          <span className="block text-[9px] text-ivory-400 mb-1.5">{sub}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateB(k, b[k] - 1)}
                            disabled={b[k] <= min}
                            aria-label={`Decrease ${lbl}`}
                            className={counterBtnClass}
                          >
                            <FaMinus size={9} />
                          </button>
                          <span className="text-body-md text-ivory-50 w-5 text-center font-bold tabular-nums">
                            {b[k]}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateB(k, b[k] + 1)}
                            aria-label={`Increase ${lbl}`}
                            className={counterBtnClass}
                          >
                            <FaPlus size={9} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transport Choice Alert if Selected */}
                {transportChoice && (
                  <div className="bg-gold-500/10 border border-gold-500/25 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                    <div>
                      <label className="block text-[10px] text-gold-400 uppercase tracking-wider font-semibold">
                        {t('booking.transport', 'Included Transport')}
                      </label>
                      <p className="text-body-sm text-ivory-100 font-medium">
                        {transportChoice === 'train'
                          ? `🚄 ${t('tour.highSpeedTrain', 'High-Speed Rail')}`
                          : `🚌 ${t('tour.bus', 'Luxury Bus')} ${t('tour.viaGrandBazaar', 'via Grand Bazaar')}`}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-gold-500/20 text-gold-400 font-bold uppercase">
                      {t('booking.selected', 'Selected')}
                    </span>
                  </div>
                )}

                {/* Passenger Names Fields */}
                {passengerFields.length > 0 && (
                  <div className="bg-[rgba(255,252,247,0.02)] rounded-xl p-3.5 border border-gold-500/15 space-y-2.5">
                    <p className="text-[11px] font-semibold text-gold-400 uppercase tracking-widest flex items-center gap-1.5">
                      <FaUserCheck size={12} />
                      {t('booking.passengerNames', 'Guest Information')}
                    </p>
                    <div className="space-y-2">
                      {passengerFields.map((p) => (
                        <div key={p.key}>
                          <label
                            htmlFor={`passenger-name-${p.key}`}
                            className="text-[10px] text-ivory-400 mb-1 flex items-center justify-between"
                          >
                            <span>
                              {p.type === 'Adult' ? '👤' : p.type === 'Child' ? '🧒' : '👶'}{' '}
                              {t(`booking.${p.type.toLowerCase()}`, p.type)} {p.num}
                            </span>
                            {p.isLead && (
                              <span className="text-gold-400 text-[9px] uppercase tracking-wider font-semibold">
                                {t('booking.leadTraveler', 'Lead Traveler')}
                              </span>
                            )}
                          </label>
                          <input
                            id={`passenger-name-${p.key}`}
                            type="text"
                            placeholder={t('booking.fullNameOf', 'Full Passport Name')}
                            onChange={(e) =>
                              setPassengerNames((prev) => ({ ...prev, [p.key]: e.target.value }))
                            }
                            className={`${inputClass} py-2.5 text-[12.5px]`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Primary Contact Information */}
                <div className="space-y-3">
                  <span className={labelClass}>
                    <FaUser className="text-gold-400" size={11} />
                    {t('booking.contactInfo', 'Primary Contact')}
                  </span>
                  <input
                    id="contact-fullname"
                    type="text"
                    placeholder={t('booking.fullName', 'Full Name')}
                    value={b.fullName}
                    onChange={(e) => updateB('fullName', e.target.value)}
                    required
                    className={inputClass}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      id="contact-email"
                      type="email"
                      placeholder={t('booking.email', 'Email Address')}
                      value={b.email}
                      onChange={(e) => updateB('email', e.target.value)}
                      required
                      className={inputClass}
                    />
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder={t('booking.phone', 'Phone Number')}
                      value={b.phone}
                      onChange={(e) => updateB('phone', e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Billing Info Accordion */}
                <div>
                  <button
                    type="button"
                    onClick={() => updateB('_showBilling', !b._showBilling)}
                    className="w-full py-2.5 px-3 bg-[rgba(255,252,247,0.02)] hover:bg-[rgba(255,252,247,0.05)] border border-gold-500/15 rounded-xl text-left flex items-center justify-between text-[11px] font-semibold text-gold-400 uppercase tracking-widest transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <FaBuilding size={12} />
                      {t('booking.billingInfo', 'Invoice / Billing Details')}
                    </span>
                    <FaChevronDown
                      size={10}
                      className={`text-gold-400 transition-transform duration-200 ${
                        b._showBilling ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {b._showBilling && (
                    <div className="mt-2.5 space-y-3 bg-[rgba(255,252,247,0.02)] rounded-xl p-3.5 border border-gold-500/15">
                      <select
                        id="invoice-type-select"
                        value={b.invoiceType}
                        onChange={(e) => updateB('invoiceType', e.target.value)}
                        className={`${inputClass} appearance-none`}
                      >
                        <option value="PERSONAL" className="bg-[#1a1a2e]">
                          {t('booking.personal', 'Individual Invoice')}
                        </option>
                        <option value="COMPANY" className="bg-[#1a1a2e]">
                          {t('booking.company', 'Corporate / Company Invoice')}
                        </option>
                      </select>
                      {b.invoiceType === 'COMPANY' && (
                        <div className="grid grid-cols-2 gap-2.5">
                          <input
                            id="company-name-input"
                            type="text"
                            placeholder={t('booking.companyName', 'Company Name')}
                            value={b.companyName}
                            onChange={(e) => updateB('companyName', e.target.value)}
                            className={inputClass}
                          />
                          <input
                            id="tax-id-input"
                            type="text"
                            placeholder={t('booking.taxId', 'Tax / VAT ID')}
                            value={b.taxId}
                            onChange={(e) => updateB('taxId', e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      )}
                      <input
                        id="address-input"
                        type="text"
                        placeholder={t('booking.address', 'Billing Street Address')}
                        value={b.address}
                        onChange={(e) => updateB('address', e.target.value)}
                        className={inputClass}
                      />
                      <div className="grid grid-cols-2 gap-2.5">
                        <input
                          id="city-input"
                          type="text"
                          placeholder={t('booking.city', 'City')}
                          value={b.city}
                          onChange={(e) => updateB('city', e.target.value)}
                          className={inputClass}
                        />
                        <input
                          id="country-input"
                          type="text"
                          placeholder={t('booking.country', 'Country')}
                          value={b.country}
                          onChange={(e) => updateB('country', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Special Requests */}
                <div>
                  <label htmlFor="notes-textarea" className={labelClass}>
                    {t('booking.specialRequests', 'Special Inquiries / Dietary / Notes')}
                  </label>
                  <textarea
                    id="notes-textarea"
                    placeholder={t(
                      'booking.notesPlaceholder',
                      'Flight details, dietary preferences, or private celebrations...'
                    )}
                    value={b.notes}
                    onChange={(e) => updateB('notes', e.target.value)}
                    rows="2"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Transport Alert if required but missing */}
                {transportAlert && (
                  <div className="bg-red-500/15 border border-red-500/40 rounded-xl px-4 py-3 text-center animate-pulse">
                    <p className="text-body-sm text-red-400 font-semibold">
                      {t(
                        'booking.transportRequired',
                        'Please select a transport option (High-Speed Train or Bus) before booking.'
                      )}
                    </p>
                  </div>
                )}

                {/* Pricing Summary Breakdown Card */}
                {(() => {
                  const baseRate = Number(initialPrice) || Number(pricePreview?.basePriceUsd) || 0;
                  const clientTotal = (baseRate * b.adults) + (baseRate * 0.5 * b.children);
                  const rawTotal = pricePreview?.totalAmountUsd !== undefined ? Number(pricePreview.totalAmountUsd) : clientTotal;
                  const totalToDisplay = Number.isFinite(rawTotal) && rawTotal >= 0 ? rawTotal : 0;
                  const formattedPrice = totalToDisplay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                  return (
                    <div className="bg-gradient-to-br from-[rgba(201,162,39,0.08)] to-transparent border border-gold-500/30 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-ivory-400">
                        <span className="uppercase tracking-wider">
                          {b.adults + b.children} {t('booking.passengers', 'Guest(s)')}
                        </span>
                        <span>{b.arrivalDate}</span>
                      </div>

                      <div className="flex items-baseline justify-between pt-1 border-t border-gold-500/15">
                        <span className="text-[12px] font-semibold text-ivory-200 uppercase tracking-wider">
                          {t('booking.totalPrice', 'Authoritative Total')}
                        </span>
                        <div className="text-right">
                          <span className="text-display-sm text-gold-400 font-display font-bold">
                            ${formattedPrice}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-ivory-400/80 pt-1">
                        <FaShieldAlt className="text-gold-400" size={10} />
                        <span>{t('booking.gatePayInGuarantee', 'GatePayIn SSL Secured Checkout')}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-900 font-bold rounded-xl shadow-[0_4px_20px_rgba(245,166,35,0.3)] hover:shadow-[0_6px_30px_rgba(245,166,35,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-[13px] uppercase tracking-[1.5px] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {status === 'submitting' ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin" />
                      {t('common.sending', 'Locking Experience...')}
                    </span>
                  ) : !user ? (
                    <>
                      <FaUserCheck size={13} />
                      {t('booking.signInToBook', 'Sign in & Confirm Booking')}
                    </>
                  ) : (
                    <>
                      <FaPaperPlane size={12} />
                      {t('booking.sendInquiry', 'Confirm & Proceed to Payment')}
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Inquiry Form */
              <form onSubmit={handleInquirySubmit} className="px-5 py-4 space-y-3.5">
                <p className="text-body-sm text-ivory-300 leading-relaxed">
                  {t(
                    'booking.inquiryFormDesc',
                    'Looking for bespoke adjustments, custom hotel upgrades, or private aircraft transfers? Share your wishes below.'
                  )}
                </p>
                <div>
                  <label htmlFor="inquiry-name" className={labelClass}>
                    {t('booking.fullName', 'Full Name')}
                  </label>
                  <input
                    id="inquiry-name"
                    type="text"
                    value={inq.name}
                    onChange={(e) => setInq((p) => ({ ...p, name: e.target.value }))}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="inquiry-email" className={labelClass}>
                    {t('booking.email', 'Email Address')}
                  </label>
                  <input
                    id="inquiry-email"
                    type="email"
                    value={inq.email}
                    onChange={(e) => setInq((p) => ({ ...p, email: e.target.value }))}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="inquiry-phone" className={labelClass}>
                    {t('booking.phone', 'Phone Number')}
                  </label>
                  <input
                    id="inquiry-phone"
                    type="tel"
                    value={inq.phone}
                    onChange={(e) => setInq((p) => ({ ...p, phone: e.target.value }))}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="relative">
                  <label htmlFor="inquiry-lang" className={labelClass}>
                    <FaGlobeAmericas className="text-gold-400" size={11} />
                    {t('booking.preferredLanguage', 'Preferred Response Language')}
                  </label>
                  <button
                    id="inquiry-lang"
                    type="button"
                    onClick={() => setLangOpen(langOpen === 'inquiry' ? null : 'inquiry')}
                    className={`${inputClass} text-left flex items-center justify-between`}
                  >
                    {inq.language ? (
                      <div className="flex items-center gap-2">
                        <span className="text-base">{languages.find((l) => l.value === inq.language)?.flag}</span>
                        <span className="text-ivory-100">
                          {t(
                            languages.find((l) => l.value === inq.language)?.labelKey,
                            languages.find((l) => l.value === inq.language)?.fallback
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="text-ivory-400">{t('booking.selectLanguage', 'Select...')}</span>
                    )}
                    <FaChevronDown size={10} className="text-gold-400" />
                  </button>
                  {langOpen === 'inquiry' && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-gold-500/30 rounded-xl overflow-hidden shadow-2xl">
                      {languages.map((lang) => (
                        <button
                          key={lang.value}
                          type="button"
                          onClick={() => {
                            setInq((p) => ({ ...p, language: lang.value }));
                            setLangOpen(null);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 text-body-sm transition-colors hover:bg-gold-500/10 ${
                            inq.language === lang.value ? 'text-gold-400 bg-gold-500/15 font-semibold' : 'text-ivory-100'
                          }`}
                        >
                          <span className="text-base">{lang.flag}</span>
                          <span>{t(lang.labelKey, lang.fallback)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="inquiry-msg" className={labelClass}>
                    {t('booking.specialRequests', 'Your Message / Requirements')}
                  </label>
                  <textarea
                    id="inquiry-msg"
                    placeholder={t(
                      'booking.inquiryPlaceholder',
                      'Describe your dream journey or custom itinerary requirements...'
                    )}
                    value={inq.message}
                    onChange={(e) => setInq((p) => ({ ...p, message: e.target.value }))}
                    rows="3"
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-900 font-bold rounded-xl shadow-[0_4px_20px_rgba(245,166,35,0.3)] hover:shadow-[0_6px_30px_rgba(245,166,35,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-[13px] uppercase tracking-[1.5px] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {status === 'submitting' ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin" />
                      {t('common.sending', 'Transmitting Inquiry...')}
                    </span>
                  ) : (
                    <>
                      <FaPaperPlane size={12} />
                      {t('booking.sendInquiry', 'Transmit Custom Inquiry')}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </AnimatePresence>

      {showInvoice && bookingResult && (
        <InvoiceModal booking={bookingResult} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
};

export default BookingForm;
