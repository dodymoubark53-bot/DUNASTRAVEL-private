import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaCalendarAlt,
  FaClock,
  FaGlobe,
  FaStar,
  FaUsers,
  FaBookmark,
  FaCheck,
  FaMinus,
  FaPlus,
  FaFileInvoice,
  FaTrain,
  FaBus,
  FaCheckCircle,
  FaBuilding,
  FaMapMarkerAlt,
  FaUserCheck
} from 'react-icons/fa';
import InvoiceModal from './InvoiceModal';
import api from '../../utils/api';
import { redirectToPayLinkCheckout } from '../../utils/paylink';
import { useAuth } from '../../context/AuthContext';

const inputStyle =
  'w-full p-3 rounded-xl outline-none transition-all text-[14px] bg-[rgba(255,252,247,0.04)] text-ivory-50 placeholder:text-[rgba(245,237,214,0.3)] border border-[rgba(201,162,39,0.15)] focus:border-[rgba(201,162,39,0.5)] focus:shadow-[0_0_20px_rgba(201,162,39,0.1)] [color-scheme:dark]';

const labelStyle =
  'block text-caption text-gold-500 font-medium mb-1 text-[12px] uppercase tracking-[1px]';

const countBtnStyle =
  'w-8 h-8 rounded-full bg-[rgba(255,252,247,0.06)] text-gold-500 flex items-center justify-center hover:bg-gold-500 hover:text-obsidian-900 transition-all duration-200 border border-[rgba(201,162,39,0.15)] hover:border-gold-500';

const tabStyle = (active) =>
  `flex-1 py-3 text-[13px] font-semibold uppercase tracking-[2px] transition-all duration-200 cursor-pointer ${
    active
      ? 'text-gold-500 border-b-2 border-gold-500 bg-[rgba(201,162,39,0.06)]'
      : 'text-ivory-400 hover:text-ivory-300 border-b-2 border-transparent'
  }`;

const LANGUAGES = [
  { value: 'es', flag: '🇪🇸', labelKey: 'languages.spanish', fallback: 'Spanish' },
  { value: 'pt', flag: '🇧🇷', labelKey: 'languages.portuguese', fallback: 'Portuguese' },
  { value: 'it', flag: '🇮🇹', labelKey: 'languages.italian', fallback: 'Italian' },
  { value: 'en', flag: '🇬🇧', labelKey: 'languages.english', fallback: 'English' },
  { value: 'ar', flag: '🇪🇬', labelKey: 'languages.arabic', fallback: 'Arabic' }
];

export default function TurkeySidebarBooking({ tourTitle, transportChoice, requireTransportChoice }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tab, setTab] = useState('booking'); // 'booking' | 'inquiry'
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'submitting' | 'success'
  const [openDropdown, setOpenDropdown] = useState(null); // 'booking' | 'inquiry' | null
  const [activityOpen, setActivityOpen] = useState(false);
  const [showTransportError, setShowTransportError] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const langRef = useRef(null);
  const actRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setOpenDropdown(null);
      if (actRef.current && !actRef.current.contains(e.target)) setActivityOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const [bookingForm, setBookingForm] = useState({
    arrivalDate: '',
    departureDate: '',
    arrivalTime: '',
    departureTime: '',
    language: '',
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
    _showBilling: false
  });

  const [passengerNames, setPassengerNames] = useState({});

  // Restore booking intent if user was redirected to login
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const rawIntent = sessionStorage.getItem('dunas_pending_booking_intent');
      if (rawIntent) {
        const intent = JSON.parse(rawIntent);
        if (intent?.tourTitle === tourTitle || intent?.tourId === tourTitle) {
          if (intent.b) {
            setBookingForm((prev) => ({
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
  }, [tourTitle, user]);

  const [inquiryForm, setInquiryForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    language: '',
    message: ''
  });

  const updateBookingField = (key, val) => {
    const numFields = ['adults', 'children', 'infants'];
    setBookingForm((prev) => ({
      ...prev,
      [key]: numFields.includes(key) ? Math.max(0, parseInt(val) || 0) : val
    }));
  };

  const passengerList = [
    ...Array.from({ length: bookingForm.adults }, (_, i) => ({
      type: 'Adult',
      num: i + 1,
      key: `adult_${i}`
    })),
    ...Array.from({ length: bookingForm.children }, (_, i) => ({
      type: 'Child',
      num: i + 1,
      key: `child_${i}`
    })),
    ...Array.from({ length: bookingForm.infants }, (_, i) => ({
      type: 'Infant',
      num: i + 1,
      key: `infant_${i}`
    }))
  ];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Require authentication before submitting booking
    if (!user) {
      if (typeof window !== 'undefined') {
        const draftIntent = {
          tourId: tourTitle,
          tourTitle,
          transportChoice,
          b: bookingForm,
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
      setShowTransportError(true);
      const el = document.getElementById('transport-selector');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setShowTransportError(false);
    setSubmitStatus('submitting');

    try {
      const payload = {
        type: 'booking',
        tourId: tourTitle,
        tourTitle,
        transportChoice: transportChoice || '',
        arrivalDate: bookingForm.arrivalDate,
        departureDate: bookingForm.departureDate,
        arrivalTime: bookingForm.arrivalTime,
        departureTime: bookingForm.departureTime,
        language: ['en', 'ar', 'es', 'pt', 'it'].includes(bookingForm.language?.toLowerCase()) ? bookingForm.language.toLowerCase() : 'en',
        activityType: bookingForm.activityType,
        adults: bookingForm.adults,
        children: bookingForm.children,
        infants: bookingForm.infants,
        passengerNames,
        fullName: bookingForm.fullName,
        email: bookingForm.email,
        phone: bookingForm.phone,
        invoiceType: bookingForm.invoiceType,
        companyName: bookingForm.companyName || undefined,
        taxId: bookingForm.taxId || undefined,
        address: bookingForm.address || undefined,
        city: bookingForm.city || undefined,
        country: bookingForm.country || undefined,
        notes: bookingForm.notes || undefined,
      };

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

      setSubmittedData(bookingResultData);
      setSubmitStatus('success');
    } catch (err) {
      if (err.status === 409) {
        setErrorMessage(t('booking.errorConflict', 'A booking conflict exists for the selected dates. Please adjust your itinerary.'));
      } else if (err.status === 422) {
        setErrorMessage(t('booking.errorValidation', 'Please verify passenger and date information before proceeding.'));
      } else {
        setErrorMessage(err.message || t('common.errorOccurred', 'Error processing request'));
      }
      setSubmitStatus('idle');
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitStatus('submitting');

    try {
      const payload = {
        fullName: inquiryForm.name,
        email: inquiryForm.email,
        phone: inquiryForm.phone,
        preferredLanguage: ['en', 'ar', 'es', 'pt', 'it'].includes(inquiryForm.language?.toLowerCase())
          ? inquiryForm.language.toLowerCase()
          : 'en',
        destinations: [tourTitle || 'Turkey Experience'],
        adults: 1,
        children: 0,
        notes: inquiryForm.message
      };

      const data = await api.post('/inquiries', payload);
      setSubmittedData({ ...data, type: 'inquiry' });
      setSubmitStatus('success');
    } catch (err) {
      setErrorMessage(err.message || t('common.errorOccurred', 'Error processing request'));
      setSubmitStatus('idle');
    }
  };

  return (
    <div
      ref={langRef}
      className="bg-obsidian-900 text-ivory-50 rounded-2xl shadow-card border border-[rgba(201,162,39,0.15)] hover:shadow-[0_0_40px_rgba(201,162,39,0.15)] hover:border-[rgba(201,162,39,0.35)] hover:scale-[1.01] transition-all duration-300 sticky top-28 self-start z-30"
    >
      {submitStatus === 'success' && submittedData ? (
        <div className="flex flex-col items-center text-center py-12 px-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(201,162,39,0.3)]">
            <FaCheck className="text-obsidian-900 text-xl" />
          </div>
          <h3 className="text-display-md text-ivory-50 mb-2 font-serif">
            {submittedData.type === 'booking' ? t('booking.created', 'Booking Created') : t('booking.inquirySent', 'Inquiry Sent')}
          </h3>
          <p className="text-body-sm text-ivory-400">
            {submittedData.paymentUnavailable
              ? t('payment.getPayInPending', 'Your booking is saved. Secure online payment will be available after GetPayIn activation; our team will contact you with the next step.')
              : t('booking.successDesc', 'Our team will contact you within 24 hours.')}
          </p>

          {submittedData.type === 'booking' && submittedData.invoiceNumber && (
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-700 text-obsidian-900 font-bold rounded-xl text-[13px] uppercase tracking-[1px] flex items-center gap-2 cursor-pointer"
            >
              <FaFileInvoice /> {t('booking.viewInvoice', 'View Invoice')}
            </button>
          )}

          {transportChoice && (
            <div className="mt-4 bg-[rgba(201,162,39,0.1)] border border-gold-500/30 rounded-xl px-5 py-3 w-full text-left rtl:text-right">
              <p className="text-caption text-gold-500 text-[11px] uppercase tracking-[1px] mb-1">
                {t('booking.transport', 'Transport')}
              </p>
              <p className="text-body-md text-ivory-50 font-semibold flex items-center gap-2">
                {transportChoice === 'train' ? <FaTrain className="text-gold-400" /> : <FaBus className="text-gold-400" />}
                {transportChoice === 'train'
                  ? `🚄 ${t('tour.highSpeedTrain', 'High-Speed Train')}`
                  : `🚌 ${t('tour.bus', 'Bus')} ${t('tour.viaGrandBazaar', 'via Grand Bazaar')}`}
              </p>
            </div>
          )}

          <button
            onClick={() => {
              setSubmitStatus('idle');
              setSubmittedData(null);
            }}
            className="mt-6 text-xs text-gold-500 hover:underline cursor-pointer"
          >
            {t('booking.newRequest', 'Submit Another Request')}
          </button>
        </div>
      ) : (
        <div>
          {/* Top Title Banner */}
          <div className="px-5 pt-5 pb-3 border-b border-[rgba(201,162,39,0.1)]">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center shrink-0">
                <FaBookmark className="text-obsidian-900 text-[10px]" />
              </div>
              <h3 className="text-body-lg text-ivory-50 font-serif font-semibold truncate">
                {t('booking.formTitle', 'Book Your Trip')}
              </h3>
            </div>
            <p className="text-caption text-ivory-400 truncate pl-9 text-xs">{tourTitle}</p>
          </div>

          {/* Form Tabs */}
          <div className="flex px-5 pt-3 pb-0 gap-0 border-b border-[rgba(201,162,39,0.1)]">
            <button type="button" onClick={() => setTab('booking')} className={tabStyle(tab === 'booking')}>
              {t('booking.tabBooking', 'Book Trip')}
            </button>
            <button type="button" onClick={() => setTab('inquiry')} className={tabStyle(tab === 'inquiry')}>
              {t('booking.tabInquiry', 'Inquiry')}
            </button>
          </div>

          {errorMessage && (
            <div className="mx-5 mt-3 bg-red-500/15 border border-red-500/40 rounded-xl px-4 py-3 text-center">
              <p className="text-body-sm text-red-400">{errorMessage}</p>
            </div>
          )}

          {tab === 'booking' ? (
            /* Booking Form */
            <form onSubmit={handleBookingSubmit} className="px-5 py-4 space-y-3.5">
              {/* Dates Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="arrival-date-input" className={labelStyle}>
                    <FaCalendarAlt className="inline mr-1.5 text-gold-400 text-[11px]" />
                    {t('booking.arrivalDate', 'Arrival Date')}
                  </label>
                  <input
                    id="arrival-date-input"
                    type="date"
                    value={bookingForm.arrivalDate}
                    min={todayStr}
                    onChange={(e) => updateBookingField('arrivalDate', e.target.value)}
                    required
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="departure-date-input" className={labelStyle}>
                    <FaCalendarAlt className="inline mr-1.5 text-gold-400 text-[11px]" />
                    {t('booking.departureDate', 'Departure Date')}
                  </label>
                  <input
                    id="departure-date-input"
                    type="date"
                    value={bookingForm.departureDate}
                    min={bookingForm.arrivalDate || todayStr}
                    onChange={(e) => updateBookingField('departureDate', e.target.value)}
                    required
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* Times Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="arrival-time-input" className={labelStyle}>
                    <FaClock className="inline mr-1.5 text-gold-400 text-[11px]" />
                    {t('booking.arrivalTime', 'Arrival Time')}
                  </label>
                  <input
                    id="arrival-time-input"
                    type="time"
                    value={bookingForm.arrivalTime}
                    onChange={(e) => updateBookingField('arrivalTime', e.target.value)}
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="departure-time-input" className={labelStyle}>
                    <FaClock className="inline mr-1.5 text-gold-400 text-[11px]" />
                    {t('booking.departureTime', 'Departure Time')}
                  </label>
                  <input
                    id="departure-time-input"
                    type="time"
                    value={bookingForm.departureTime}
                    onChange={(e) => updateBookingField('departureTime', e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* Language Selection */}
              <div className="relative">
                <label htmlFor="language-btn" className={labelStyle}>
                  <FaGlobe className="inline mr-1.5 text-gold-400 text-[11px]" />
                  {t('booking.preferredLanguage', 'Language')}
                </label>
                <button
                  id="language-btn"
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'booking' ? null : 'booking')}
                  className={`${inputStyle} text-left flex items-center gap-2 cursor-pointer`}
                >
                  {bookingForm.language ? (
                    <>
                      <span className="text-lg">
                        {LANGUAGES.find((l) => l.value === bookingForm.language)?.flag}
                      </span>
                      <span>
                        {t(
                          LANGUAGES.find((l) => l.value === bookingForm.language)?.labelKey,
                          LANGUAGES.find((l) => l.value === bookingForm.language)?.fallback
                        )}
                      </span>
                    </>
                  ) : (
                    <span className="text-ivory-400">{t('booking.selectLanguage', 'Select...')}</span>
                  )}
                </button>

                {openDropdown === 'booking' && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-[rgba(201,162,39,0.15)] rounded-xl overflow-hidden shadow-xl">
                    {LANGUAGES.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          updateBookingField('language', item.value);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-3 flex items-center gap-2 text-body-md transition-colors hover:bg-[rgba(255,252,247,0.06)] cursor-pointer ${
                          bookingForm.language === item.value ? 'text-gold-500 bg-[rgba(201,162,39,0.06)]' : 'text-ivory-50'
                        }`}
                      >
                        <span className="text-lg">{item.flag}</span>
                        <span>{t(item.labelKey, item.fallback)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Type of Activity Category */}
              <div className="relative" ref={actRef}>
                <label htmlFor="activity-btn" className={labelStyle}>
                  <FaStar className="inline mr-1.5 text-gold-400 text-[11px]" />
                  {t('booking.activityType', 'Type of Activity')}
                </label>
                <button
                  id="activity-btn"
                  type="button"
                  onClick={() => setActivityOpen(!activityOpen)}
                  className={`${inputStyle} text-left flex items-center gap-2 cursor-pointer`}
                >
                  {bookingForm.activityType ? (
                    <span>
                      {bookingForm.activityType === 'standard'
                        ? t('booking.standardCategory', 'Standard Category')
                        : t('booking.premiumCategory', 'Premium Category')}
                    </span>
                  ) : (
                    <span className="text-ivory-400">{t('booking.selectActivity', 'Select...')}</span>
                  )}
                </button>

                {activityOpen && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-[rgba(201,162,39,0.15)] rounded-xl overflow-hidden shadow-xl">
                    <button
                      type="button"
                      onClick={() => {
                        updateBookingField('activityType', 'standard');
                        setActivityOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-2 text-body-md transition-colors hover:bg-[rgba(255,252,247,0.06)] cursor-pointer ${
                        bookingForm.activityType === 'standard' ? 'text-gold-500 bg-[rgba(201,162,39,0.06)]' : 'text-ivory-50'
                      }`}
                    >
                      {t('booking.standardCategory', 'Standard Category')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateBookingField('activityType', 'premium');
                        setActivityOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-2 text-body-md transition-colors hover:bg-[rgba(255,252,247,0.06)] cursor-pointer ${
                        bookingForm.activityType === 'premium' ? 'text-gold-500 bg-[rgba(201,162,39,0.06)]' : 'text-ivory-50'
                      }`}
                    >
                      {t('booking.premiumCategory', 'Premium Category')}
                    </button>
                  </div>
                )}
              </div>

              {/* Passengers Counters */}
              <div>
                <span className={labelStyle}>
                  <FaUsers className="inline mr-1.5 text-gold-400 text-[11px]" />
                  {t('booking.passengers', 'Passengers')}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'adults', label: t('booking.adults', 'Adults'), min: 1 },
                    { key: 'children', label: t('booking.children', 'Children'), min: 0 },
                    { key: 'infants', label: t('booking.infants', 'Infants'), min: 0 }
                  ].map(({ key, label, min }) => (
                    <div
                      key={key}
                      className="bg-[rgba(255,252,247,0.03)] rounded-xl p-2.5 border border-[rgba(201,162,39,0.08)] text-center"
                    >
                      <span className="block text-caption text-ivory-400 mb-1.5 text-[11px]">{label}</span>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateBookingField(key, bookingForm[key] - 1)}
                          disabled={bookingForm[key] <= min}
                          aria-label={`Decrease ${label}`}
                          className={`${countBtnStyle} w-7 h-7 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer`}
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="text-body-lg text-ivory-50 w-6 text-center font-semibold tabular-nums">
                          {bookingForm[key]}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateBookingField(key, bookingForm[key] + 1)}
                          aria-label={`Increase ${label}`}
                          className={`${countBtnStyle} w-7 h-7 cursor-pointer`}
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Transport Choice Badge */}
              {transportChoice && (
                <div className="bg-[rgba(201,162,39,0.08)] border border-gold-500/20 rounded-xl px-4 py-3">
                  <label className={labelStyle}>{t('booking.transport', 'Transport')}</label>
                  <p className="text-body-sm text-gold-300 flex items-center gap-2">
                    <span>
                      {transportChoice === 'train'
                        ? `🚄 ${t('tour.highSpeedTrain', 'High-Speed Train')}`
                        : `🚌 ${t('tour.bus', 'Bus')} ${t('tour.viaGrandBazaar', 'via Grand Bazaar')}`}
                    </span>
                    <span className="text-[10px] text-ivory-400">({t('booking.selected', 'selected')})</span>
                  </p>
                </div>
              )}

              {/* Passenger Names List */}
              {passengerList.length > 0 && (
                <div className="bg-[rgba(255,252,247,0.02)] rounded-xl p-3 border border-[rgba(201,162,39,0.08)]">
                  <p className="text-caption text-gold-500 font-semibold mb-2 text-[11px] uppercase tracking-[1px]">
                    {t('booking.passengerNames', 'Passenger Names')}
                  </p>
                  <div className="space-y-2">
                    {passengerList.map((pItem) => (
                      <div key={pItem.key}>
                        <label
                          htmlFor={`passenger-name-${pItem.key}`}
                          className="block text-caption text-ivory-400 text-[11px] mb-0.5"
                        >
                          {pItem.type === 'Adult' ? '👤' : pItem.type === 'Child' ? '🧒' : '👶'}{' '}
                          {t(`booking.${pItem.type.toLowerCase()}`, pItem.type)} {pItem.num}
                        </label>
                        <input
                          id={`passenger-name-${pItem.key}`}
                          type="text"
                          placeholder={t('booking.fullNameOf', 'Name')}
                          value={passengerNames[pItem.key] || ''}
                          onChange={(e) =>
                            setPassengerNames((prev) => ({ ...prev, [pItem.key]: e.target.value }))
                          }
                          className={`${inputStyle} p-2.5 text-[13px]`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Inputs */}
              <div className="space-y-3">
                <p className={labelStyle}>
                  <FaBookmark className="inline mr-1.5 text-gold-400 text-[11px]" />
                  {t('booking.contactInfo', 'Contact')}
                </p>
                <input
                  id="contact-fullname"
                  type="text"
                  placeholder={t('booking.fullName', 'Full Name')}
                  value={bookingForm.fullName}
                  onChange={(e) => updateBookingField('fullName', e.target.value)}
                  required
                  className={inputStyle}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    id="contact-email"
                    type="email"
                    placeholder={t('booking.email', 'Email')}
                    value={bookingForm.email}
                    onChange={(e) => updateBookingField('email', e.target.value)}
                    required
                    className={inputStyle}
                  />
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder={t('booking.phone', 'Phone')}
                    value={bookingForm.phone}
                    onChange={(e) => updateBookingField('phone', e.target.value)}
                    required
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* Billing Information Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => updateBookingField('_showBilling', !bookingForm._showBilling)}
                  className={`${labelStyle} w-full text-left flex items-center justify-between cursor-pointer ${
                    bookingForm._showBilling ? 'text-gold-500' : ''
                  }`}
                >
                  <span>
                    <FaFileInvoice className="inline mr-1.5 text-gold-400 text-[11px]" />
                    {t('booking.billingInfo', 'Billing')}
                  </span>
                  <span className="text-[10px]">{bookingForm._showBilling ? '▲' : '▼'}</span>
                </button>

                {bookingForm._showBilling && (
                  <div className="mt-3 space-y-3 bg-[rgba(255,252,247,0.02)] rounded-xl p-3 border border-[rgba(201,162,39,0.08)]">
                    <select
                      id="invoice-type-select"
                      value={bookingForm.invoiceType}
                      onChange={(e) => updateBookingField('invoiceType', e.target.value)}
                      className={`${inputStyle} appearance-none cursor-pointer`}
                    >
                      <option value="PERSONAL" className="bg-[#1a1a2e] text-ivory-50">
                        {t('booking.personal', 'Personal')}
                      </option>
                      <option value="COMPANY" className="bg-[#1a1a2e] text-ivory-50">
                        {t('booking.company', 'Company')}
                      </option>
                    </select>

                    {bookingForm.invoiceType === 'COMPANY' && (
                      <>
                        <input
                          id="company-name-input"
                          type="text"
                          placeholder={t('booking.companyName', 'Company Name')}
                          value={bookingForm.companyName}
                          onChange={(e) => updateBookingField('companyName', e.target.value)}
                          className={inputStyle}
                        />
                        <input
                          id="tax-id-input"
                          type="text"
                          placeholder={t('booking.taxId', 'Tax ID')}
                          value={bookingForm.taxId}
                          onChange={(e) => updateBookingField('taxId', e.target.value)}
                          className={inputStyle}
                        />
                      </>
                    )}

                    <input
                      id="address-input"
                      type="text"
                      placeholder={t('booking.address', 'Address')}
                      value={bookingForm.address}
                      onChange={(e) => updateBookingField('address', e.target.value)}
                      className={inputStyle}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        id="city-input"
                        type="text"
                        placeholder={t('booking.city', 'City')}
                        value={bookingForm.city}
                        onChange={(e) => updateBookingField('city', e.target.value)}
                        className={inputStyle}
                      />
                      <input
                        id="country-input"
                        type="text"
                        placeholder={t('booking.country', 'Country')}
                        value={bookingForm.country}
                        onChange={(e) => updateBookingField('country', e.target.value)}
                        className={inputStyle}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Special Requests / Notes */}
              <div>
                <label htmlFor="notes-textarea" className="sr-only">
                  {t('booking.notesPlaceholder', 'Special requests...')}
                </label>
                <textarea
                  id="notes-textarea"
                  placeholder={t('booking.notesPlaceholder', 'Special requests...')}
                  value={bookingForm.notes}
                  onChange={(e) => updateBookingField('notes', e.target.value)}
                  rows="2"
                  className={`${inputStyle} resize-none`}
                />
              </div>

              {/* Transport Choice Validation Warning */}
              {showTransportError && (
                <div className="bg-red-500/15 border border-red-500/40 rounded-xl px-4 py-3 text-center animate-pulse">
                  <p className="text-body-sm text-red-400 font-semibold text-xs">
                    {t(
                      'booking.transportRequired',
                      'Please select a transport option (High-Speed Train or Bus) before booking.'
                    )}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitStatus === 'submitting'}
                className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-700 text-obsidian-900 font-bold rounded-xl shadow-[0_0_25px_rgba(201,162,39,0.2)] hover:shadow-[0_0_35px_rgba(201,162,39,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-[13px] uppercase tracking-[1.5px] flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitStatus === 'submitting' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin" />
                    {t('common.sending', 'Sending...')}
                  </span>
                ) : !user ? (
                  <>
                    <FaUserCheck size={13} />
                    {t('booking.signInToBook', 'Sign in & Book')}
                  </>
                ) : (
                  <>
                    <FaBookmark size={12} />
                    {t('booking.sendInquiry', 'Book Now')}
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Quick Inquiry Form */
            <form onSubmit={handleInquirySubmit} className="px-5 py-4 space-y-3.5">
              <p className="text-body-sm text-ivory-400 text-xs">
                {t('booking.inquiryFormDesc', "Have a question? Send us a message and we'll get back to you.")}
              </p>

              <div>
                <label htmlFor="inquiry-name" className={labelStyle}>
                  {t('booking.fullName', 'Full Name')}
                </label>
                <input
                  id="inquiry-name"
                  type="text"
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="inquiry-email" className={labelStyle}>
                  {t('booking.email', 'Email')}
                </label>
                <input
                  id="inquiry-email"
                  type="email"
                  value={inquiryForm.email}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="inquiry-phone" className={labelStyle}>
                  {t('booking.phone', 'Phone')}
                </label>
                <input
                  id="inquiry-phone"
                  type="tel"
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                  required
                  className={inputStyle}
                />
              </div>

              {/* Inquiry Language */}
              <div className="relative">
                <label htmlFor="inquiry-lang" className={labelStyle}>
                  <FaGlobe className="inline mr-1.5 text-gold-400 text-[11px]" />
                  {t('booking.preferredLanguage', 'Language')}
                </label>
                <button
                  id="inquiry-lang"
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'inquiry' ? null : 'inquiry')}
                  className={`${inputStyle} text-left flex items-center gap-2 cursor-pointer`}
                >
                  {inquiryForm.language ? (
                    <>
                      <span className="text-lg">
                        {LANGUAGES.find((l) => l.value === inquiryForm.language)?.flag}
                      </span>
                      <span>
                        {t(
                          LANGUAGES.find((l) => l.value === inquiryForm.language)?.labelKey,
                          LANGUAGES.find((l) => l.value === inquiryForm.language)?.fallback
                        )}
                      </span>
                    </>
                  ) : (
                    <span className="text-ivory-400">{t('booking.selectLanguage', 'Select...')}</span>
                  )}
                </button>

                {openDropdown === 'inquiry' && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-[rgba(201,162,39,0.15)] rounded-xl overflow-hidden shadow-xl">
                    {LANGUAGES.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setInquiryForm({ ...inquiryForm, language: item.value });
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-3 flex items-center gap-2 text-body-md transition-colors hover:bg-[rgba(255,252,247,0.06)] cursor-pointer ${
                          inquiryForm.language === item.value ? 'text-gold-500 bg-[rgba(201,162,39,0.06)]' : 'text-ivory-50'
                        }`}
                      >
                        <span className="text-lg">{item.flag}</span>
                        <span>{t(item.labelKey, item.fallback)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="inquiry-msg" className={labelStyle}>
                  {t('booking.specialRequests', 'Message')}
                </label>
                <textarea
                  id="inquiry-msg"
                  placeholder={t('booking.inquiryPlaceholder', 'Your message...')}
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  rows="4"
                  className={`${inputStyle} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={submitStatus === 'submitting'}
                className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-700 text-obsidian-900 font-bold rounded-xl shadow-[0_0_25px_rgba(201,162,39,0.2)] hover:shadow-[0_0_35px_rgba(201,162,39,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-[13px] uppercase tracking-[1.5px] flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitStatus === 'submitting' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin" />
                    {t('common.sending', 'Sending...')}
                  </span>
                ) : (
                  <>
                    <FaBookmark size={12} />
                    {t('booking.sendInquiry', 'Book Now')}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Invoice Modal Popup */}
      {showInvoiceModal && submittedData && (
        <InvoiceModal booking={submittedData} onClose={() => setShowInvoiceModal(false)} />
      )}
    </div>
  );
}
