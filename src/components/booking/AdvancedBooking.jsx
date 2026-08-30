import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaPlus,
  FaMinus,
  FaPaperPlane,
  FaGlobeAmericas,
  FaTimes,
  FaChevronDown,
  FaCheckCircle,
  FaFileInvoiceDollar,
  FaSuitcase,
  FaBuilding,
  FaShieldAlt,
  FaUserCheck,
  FaPercent
} from 'react-icons/fa';
import InvoiceModal from './InvoiceModal';
import api from '../../utils/api';
import { redirectToPayLinkCheckout } from '../../utils/paylink';

const inputStyle =
  'w-full px-3.5 py-3 rounded-xl bg-[rgba(255,252,247,0.03)] text-ivory-50 placeholder:text-ivory-400/40 border border-[rgba(201,162,39,0.18)] focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none text-[13.5px] transition-all [color-scheme:dark]';

const labelStyle =
  'block text-[11px] font-semibold text-gold-400 uppercase tracking-[1.2px] mb-1.5 flex items-center gap-1.5';

const counterBtnStyle =
  'w-8 h-8 rounded-lg bg-gold-500/10 hover:bg-gold-500 text-gold-400 hover:text-obsidian-900 border border-gold-500/25 flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gold-500/10 disabled:hover:text-gold-400';

const languages = [
  { value: 'es', labelKey: 'languages.spanish', fallback: 'Spanish', flag: '🇪🇸' },
  { value: 'en', labelKey: 'languages.english', fallback: 'English', flag: '🇬🇧' },
  { value: 'pt', labelKey: 'languages.portuguese', fallback: 'Portuguese', flag: '🇧🇷' },
  { value: 'it', labelKey: 'languages.italian', fallback: 'Italian', flag: '🇮🇹' },
  { value: 'ar', labelKey: 'languages.arabic', fallback: 'Arabic', flag: '🇪🇬' },
];

export default function AdvancedBooking({
  onClose,
  tourTitle,
  initialTab = 'booking',
  predefinedTourId = null,
  transportChoice = null,
}) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [activityDropdownOpen, setActivityDropdownOpen] = useState(false);

  const containerRef = useRef(null);

  const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  };
  const todayStr = getTodayString();

  const [formData, setFormData] = useState({
    arrivalDate: todayStr,
    departureDate: '',
    arrivalTime: '',
    departureTime: '',
    language: 'en',
    activityType: '',
    adults: 1,
    children: 0,
    infants: 0,
    fullName: '',
    email: '',
    phone: '',
    invoiceType: 'PERSONAL',
    companyName: '',
    taxId: '',
    address: '',
    city: '',
    country: '',
    notes: '',
    message: '',
    _showBilling: false,
  });

  const updateField = (field, val) => {
    const numericFields = ['adults', 'children', 'infants'];
    setFormData((prev) => ({
      ...prev,
      [field]: numericFields.includes(field) ? Math.max(0, parseInt(val, 10) || 0) : val,
    }));
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
        setActivityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('submitting');

    try {
      if (activeTab === 'inquiry') {
        const payload = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          preferredLanguage: ['en', 'ar', 'es', 'pt', 'it'].includes(formData.language?.toLowerCase())
            ? formData.language.toLowerCase()
            : 'en',
          destinations: [tourTitle || 'Custom Luxury Experience'],
          adults: formData.adults,
          children: formData.children,
          notes: formData.message || formData.notes,
        };

        const data = await api.post('/inquiries', payload);
        setBookingResult({ ...data, type: 'inquiry' });
        setStatus('success');
      } else {
        const payload = {
          type: 'booking',
          tourId: predefinedTourId || tourTitle,
          tourTitle,
          transportChoice: transportChoice || '',
          arrivalDate: formData.arrivalDate,
          departureDate: formData.departureDate,
          arrivalTime: formData.arrivalTime,
          departureTime: formData.departureTime,
          language: ['en', 'ar', 'es', 'pt', 'it'].includes(formData.language?.toLowerCase())
            ? formData.language.toLowerCase()
            : 'en',
          activityType: formData.activityType,
          adults: formData.adults,
          children: formData.children,
          infants: formData.infants,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          invoiceType: formData.invoiceType,
          companyName: formData.companyName || undefined,
          taxId: formData.taxId || undefined,
          address: formData.address || undefined,
          city: formData.city || undefined,
          country: formData.country || undefined,
          notes: formData.notes || formData.message || undefined,
        };

        const data = await api.post('/bookings', payload);

        const tokenToSave = data?.guestToken || data?.data?.guestToken;
        if (tokenToSave && typeof window !== 'undefined') {
          localStorage.setItem('dunas_guest_token', tokenToSave);
        }

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
      }
    } catch (err) {
      if (err.status === 409) {
        setError(t('booking.errorConflict', 'A booking conflict exists for the selected dates. Please adjust your itinerary.'));
      } else if (err.status === 422) {
        setError(t('booking.errorValidation', 'Please verify passenger and date information before proceeding.'));
      } else {
        setError(err.message || t('common.errorOccurred', 'Error processing request'));
      }
      setStatus('idle');
    }
  };

  return (
    <div
      ref={containerRef}
      className={`bg-[#121118]/95 backdrop-blur-xl text-ivory-50 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-gold-500/25 hover:border-gold-500/40 transition-all duration-300 relative w-full overflow-hidden ${
        !onClose ? 'sticky top-28 self-start z-30' : ''
      }`}
    >
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg bg-[rgba(255,252,247,0.05)] hover:bg-gold-500/20 text-ivory-400 hover:text-gold-400 border border-gold-500/20 flex items-center justify-center transition-all cursor-pointer"
          aria-label="Close dialog"
        >
          <FaTimes size={13} />
        </button>
      )}

      {status === 'success' && bookingResult ? (
        <div className="flex flex-col items-center text-center py-10 px-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(201,162,39,0.35)] ring-4 ring-gold-500/20">
            <FaCheckCircle className="text-obsidian-900 text-2xl" />
          </div>
          <span className="text-[11px] font-mono text-gold-400 uppercase tracking-widest block mb-1">
            Ref: #{bookingResult.referenceCode || bookingResult.id || 'CONFIRMED'}
          </span>
          <h3 className="text-display-sm text-ivory-50 mb-2 font-display">
            {bookingResult.type === 'booking'
              ? t('booking.created', 'Booking Registered')
              : t('booking.inquirySent', 'Inquiry Dispatched')}
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
              onClick={() => setShowInvoice(true)}
              className="mt-5 px-6 py-3 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-900 font-bold rounded-xl hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] hover:scale-105 active:scale-95 transition-all text-[12px] uppercase tracking-[1.5px] flex items-center gap-2 cursor-pointer"
            >
              <FaFileInvoiceDollar size={14} />
              {t('booking.viewInvoice', 'Inspect Official Invoice')}
            </button>
          )}
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="px-5 pt-5 pb-3 border-b border-gold-500/15 bg-gradient-to-b from-gold-500/5 to-transparent">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                <FaSuitcase size={12} />
              </div>
              <div className="min-w-0 pr-6">
                <h3 className="text-body-lg text-ivory-50 font-display font-semibold truncate leading-tight">
                  {t('booking.formTitle', 'Book Your Journey')}
                </h3>
                <p className="text-[11px] text-ivory-400 truncate mt-0.5">{tourTitle || 'Curated Private Experience'}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-5 pt-3">
            <div className="flex p-1 bg-[rgba(255,252,247,0.03)] rounded-xl border border-gold-500/15">
              <button
                type="button"
                onClick={() => setActiveTab('booking')}
                className={`flex-1 py-2 rounded-lg text-[12px] font-bold uppercase tracking-[1.5px] transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'booking'
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-900 shadow-[0_2px_10px_rgba(245,166,35,0.25)]'
                    : 'text-ivory-400 hover:text-ivory-100'
                }`}
              >
                <FaCalendarAlt size={11} /> {t('booking.tabBooking', 'Book Trip')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('inquiry')}
                className={`flex-1 py-2 rounded-lg text-[12px] font-bold uppercase tracking-[1.5px] transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'inquiry'
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
              <p className="text-body-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          {activeTab === 'booking' ? (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-arrival-date" className={labelStyle}>
                    <FaCalendarAlt className="text-gold-400" size={11} />
                    {t('booking.arrivalDate', 'Arrival Date')}
                  </label>
                  <input
                    id="modal-arrival-date"
                    type="date"
                    value={formData.arrivalDate}
                    min={todayStr}
                    onChange={(e) => updateField('arrivalDate', e.target.value)}
                    required
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="modal-departure-date" className={labelStyle}>
                    <FaCalendarAlt className="text-gold-400" size={11} />
                    {t('booking.departureDate', 'Departure Date')}
                  </label>
                  <input
                    id="modal-departure-date"
                    type="date"
                    value={formData.departureDate}
                    min={formData.arrivalDate || todayStr}
                    onChange={(e) => updateField('departureDate', e.target.value)}
                    required
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* Times */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-arrival-time" className={labelStyle}>
                    <FaClock className="text-gold-400" size={11} />
                    {t('booking.arrivalTime', 'Arrival Time')}
                  </label>
                  <input
                    id="modal-arrival-time"
                    type="time"
                    value={formData.arrivalTime}
                    onChange={(e) => updateField('arrivalTime', e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="modal-departure-time" className={labelStyle}>
                    <FaClock className="text-gold-400" size={11} />
                    {t('booking.departureTime', 'Departure Time')}
                  </label>
                  <input
                    id="modal-departure-time"
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) => updateField('departureTime', e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* Preferred Language */}
              <div className="relative">
                <label htmlFor="modal-lang-btn" className={labelStyle}>
                  <FaGlobeAmericas className="text-gold-400" size={11} />
                  {t('booking.preferredLanguage', 'Tour Language')}
                </label>
                <button
                  id="modal-lang-btn"
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className={`${inputStyle} text-left flex items-center justify-between`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">
                      {languages.find((l) => l.value === formData.language)?.flag}
                    </span>
                    <span className="text-ivory-100">
                      {t(
                        languages.find((l) => l.value === formData.language)?.labelKey,
                        languages.find((l) => l.value === formData.language)?.fallback
                      )}
                    </span>
                  </span>
                  <FaChevronDown size={10} className="text-gold-400" />
                </button>

                {langDropdownOpen && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-gold-500/30 rounded-xl overflow-hidden shadow-2xl backdrop-blur-lg">
                    {languages.map((l) => (
                      <button
                        key={l.value}
                        type="button"
                        onClick={() => {
                          updateField('language', l.value);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 text-body-sm transition-colors hover:bg-gold-500/10 ${
                          formData.language === l.value
                            ? 'text-gold-400 bg-gold-500/15 font-semibold'
                            : 'text-ivory-100'
                        }`}
                      >
                        <span className="text-base">{l.flag}</span>
                        <span>{t(l.labelKey, l.fallback)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Activity Tier Category */}
              <div className="relative">
                <label htmlFor="modal-tier-btn" className={labelStyle}>
                  <FaBuilding className="text-gold-400" size={11} />
                  {t('booking.activityType', 'Hotel Category / Tier')}
                </label>
                <button
                  id="modal-tier-btn"
                  type="button"
                  onClick={() => setActivityDropdownOpen(!activityDropdownOpen)}
                  className={`${inputStyle} text-left flex items-center justify-between`}
                >
                  {formData.activityType ? (
                    <span className="text-ivory-100">
                      {formData.activityType === 'standard'
                        ? t('booking.standardCategory', 'Option 4* (Classic Luxury)')
                        : t('booking.premiumCategory', 'Option 5* (VIP Signature)')}
                    </span>
                  ) : (
                    <span className="text-ivory-400">
                      {t('booking.selectActivity', 'Select Hotel Tier...')}
                    </span>
                  )}
                  <FaChevronDown size={10} className="text-gold-400" />
                </button>

                {activityDropdownOpen && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-gold-500/30 rounded-xl overflow-hidden shadow-2xl">
                    <button
                      type="button"
                      onClick={() => {
                        updateField('activityType', 'standard');
                        setActivityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-body-sm transition-colors hover:bg-gold-500/10 ${
                        formData.activityType === 'standard'
                          ? 'text-gold-400 bg-gold-500/15 font-semibold'
                          : 'text-ivory-100'
                      }`}
                    >
                      {t('booking.standardCategory', 'Option 4* (Classic Luxury)')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateField('activityType', 'premium');
                        setActivityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-body-sm transition-colors hover:bg-gold-500/10 ${
                        formData.activityType === 'premium'
                          ? 'text-gold-400 bg-gold-500/15 font-semibold'
                          : 'text-ivory-100'
                      }`}
                    >
                      {t('booking.premiumCategory', 'Option 5* (VIP Signature)')}
                    </button>
                  </div>
                )}
              </div>

              {/* Passengers Counters */}
              <div>
                <span className={labelStyle}>
                  <FaUsers className="text-gold-400" size={11} />
                  {t('booking.passengers', 'Travelers Count')}
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { key: 'adults', label: t('booking.adults', 'Adults'), min: 1, sub: '12+ yrs' },
                    { key: 'children', label: t('booking.children', 'Children'), min: 0, sub: '2-11 yrs' },
                    { key: 'infants', label: t('booking.infants', 'Infants'), min: 0, sub: '<2 yrs' },
                  ].map(({ key, label, min, sub }) => (
                    <div
                      key={key}
                      className="bg-[rgba(255,252,247,0.02)] rounded-xl p-2.5 border border-gold-500/15 text-center flex flex-col justify-between"
                    >
                      <div>
                        <span className="block text-[11px] font-semibold text-ivory-200">
                          {label}
                        </span>
                        <span className="block text-[9px] text-ivory-400 mb-1.5">{sub}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateField(key, formData[key] - 1)}
                          disabled={formData[key] <= min}
                          aria-label={`Decrease ${label}`}
                          className={counterBtnStyle}
                        >
                          <FaMinus size={9} />
                        </button>
                        <span className="text-body-md text-ivory-50 w-5 text-center font-bold tabular-nums">
                          {formData[key]}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateField(key, formData[key] + 1)}
                          aria-label={`Increase ${label}`}
                          className={counterBtnStyle}
                        >
                          <FaPlus size={9} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Contact Details */}
              <div className="space-y-3 pt-1">
                <div>
                  <label htmlFor="modal-fullname" className={labelStyle}>
                    {t('booking.fullName', 'Lead Traveler Full Name')}
                  </label>
                  <input
                    id="modal-fullname"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="Full Passport Name"
                    className={inputStyle}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="modal-email" className={labelStyle}>
                      {t('booking.email', 'Email Address')}
                    </label>
                    <input
                      id="modal-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="client@luxury.com"
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-phone" className={labelStyle}>
                      {t('booking.phone', 'Phone Number')}
                    </label>
                    <input
                      id="modal-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+1 234 567 890"
                      className={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 px-6 rounded-xl font-bold uppercase tracking-[1.5px] transition-all duration-200 text-[13px] bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-900 hover:shadow-[0_4px_25px_rgba(245,166,35,0.4)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                {status === 'submitting' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin" />
                    {t('booking.sending', 'Locking Reservation...')}
                  </span>
                ) : (
                  <>
                    <FaPaperPlane size={12} />
                    {t('booking.bookNow', 'Confirm & Proceed to Payment')}
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Inquiry Form */
            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3.5">
              <div>
                <label htmlFor="modal-inq-name" className={labelStyle}>
                  {t('booking.fullName', 'Full Name')}
                </label>
                <input
                  id="modal-inq-name"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Full Name"
                  className={inputStyle}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-inq-email" className={labelStyle}>
                    {t('booking.email', 'Email Address')}
                  </label>
                  <input
                    id="modal-inq-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="client@luxury.com"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="modal-inq-phone" className={labelStyle}>
                    {t('booking.phone', 'Phone Number')}
                  </label>
                  <input
                    id="modal-inq-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+1 234 567 890"
                    className={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="modal-inq-msg" className={labelStyle}>
                  {t('booking.message', 'Message / Inquiries')}
                </label>
                <textarea
                  id="modal-inq-msg"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder={t(
                    'booking.inquiryPlaceholder',
                    'Dietary requirements, room preferences, airport transfers or other requests...'
                  )}
                  className={`${inputStyle} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 px-6 rounded-xl font-bold uppercase tracking-[1.5px] transition-all duration-200 text-[13px] bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-900 hover:shadow-[0_4px_25px_rgba(245,166,35,0.4)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                {status === 'submitting' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin" />
                    {t('booking.sending', 'Transmitting Inquiry...')}
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

      {/* Invoice Modal */}
      {showInvoice && bookingResult && (
        <InvoiceModal
          booking={bookingResult}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
}
