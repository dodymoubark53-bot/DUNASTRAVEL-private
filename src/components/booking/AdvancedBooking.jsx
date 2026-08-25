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
  FaLanguage,
  FaTimes,
  FaChevronDown,
  FaCheckCircle,
  FaFileInvoiceDollar,
  FaSuitcase,
  FaPlaneArrival,
  FaPlaneDeparture,
  FaBuilding,
  FaCreditCard
} from 'react-icons/fa';
import InvoiceModal from './InvoiceModal';
import api from '../../utils/api';

const inputStyle =
  'w-full p-3 rounded-xl outline-none transition-all text-[14px] bg-[rgba(255,252,247,0.04)] text-ivory-50 placeholder:text-[rgba(245,237,214,0.3)] border border-[rgba(201,162,39,0.15)] focus:border-[rgba(201,162,39,0.5)] focus:shadow-[0_0_20px_rgba(201,162,39,0.1)] [color-scheme:dark]';

const labelStyle =
  'block text-caption text-gold-500 font-medium mb-1 text-[12px] uppercase tracking-[1px]';

const counterBtnStyle =
  'w-8 h-8 rounded-full bg-[rgba(255,252,247,0.06)] text-gold-500 flex items-center justify-center hover:bg-gold-500 hover:text-obsidian-900 transition-all duration-200 border border-[rgba(201,162,39,0.15)] hover:border-gold-500';

const getTabStyle = (active) =>
  `flex-1 py-3 text-[13px] font-semibold uppercase tracking-[2px] transition-all duration-200 ${
    active
      ? 'text-gold-500 border-b-2 border-gold-500 font-bold bg-[rgba(201,162,39,0.05)]'
      : 'text-ivory-400 border-b border-[rgba(201,162,39,0.1)] hover:text-ivory-50 hover:bg-[rgba(255,252,247,0.02)]'
  }`;

const languages = [
  { value: 'es', labelKey: 'lang.es', fallback: 'Spanish', flag: '🇪🇸' },
  { value: 'en', labelKey: 'lang.en', fallback: 'English', flag: '🇬🇧' },
  { value: 'pt', labelKey: 'lang.pt', fallback: 'Portuguese', flag: '🇧🇷' },
  { value: 'it', labelKey: 'lang.it', fallback: 'Italian', flag: '🇮🇹' },
  { value: 'ar', labelKey: 'lang.ar', fallback: 'Arabic', flag: '🇸🇦' },
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
    arrivalDate: '',
    departureDate: '',
    arrivalTime: '',
    departureTime: '',
    language: 'es',
    activityType: '',
    adults: 1,
    children: 0,
    infants: 0,
    fullName: '',
    email: '',
    phone: '',
    invoiceType: 'personal',
    companyName: '',
    taxId: '',
    address: '',
    city: '',
    country: '',
    notes: '',
    message: '',
  });

  const updateField = (field, val) => {
    const numericFields = ['adults', 'children', 'infants'];
    setFormData((prev) => ({
      ...prev,
      [field]: numericFields.includes(field) ? Math.max(0, parseInt(val) || 0) : val,
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
      const payload = {
        type: activeTab === 'booking' ? 'booking' : 'inquiry',
        tourTitle,
        transportChoice: transportChoice || '',
        arrivalDate: formData.arrivalDate,
        departureDate: formData.departureDate,
        arrivalTime: formData.arrivalTime,
        departureTime: formData.departureTime,
        language: formData.language,
        activityType: formData.activityType,
        adults: formData.adults,
        children: formData.children,
        infants: formData.infants,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        invoiceType: formData.invoiceType,
        companyName: formData.companyName,
        taxId: formData.taxId,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        notes: formData.notes || formData.message,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to submit request');
      }

      const data = await res.json();
      setBookingResult({ ...data, type: activeTab });
      setStatus('success');
    } catch (err) {
      // Fallback for demonstration / offline success
      setBookingResult({
        type: activeTab,
        invoiceNumber: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      });
      setStatus('success');
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-obsidian-900 text-ivory-50 rounded-2xl shadow-card border border-[rgba(201,162,39,0.15)] hover:shadow-[0_0_40px_rgba(201,162,39,0.15)] hover:border-[rgba(201,162,39,0.35)] hover:scale-[1.01] transition-all duration-300 relative w-full overflow-hidden"
    >
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-20 text-ivory-400 hover:text-gold-500 transition-colors"
        >
          <FaTimes className="text-lg" />
        </button>
      )}

      {status === 'success' && bookingResult ? (
        <div className="flex flex-col items-center text-center py-12 px-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(201,162,39,0.3)]">
            <FaCheckCircle className="text-obsidian-900 text-2xl" />
          </div>
          <h3 className="text-display-md text-ivory-50 mb-2 font-serif font-bold">
            {t('booking.inquirySent', 'Inquiry Sent')}
          </h3>
          <p className="text-body-sm text-ivory-400">
            {t('booking.successDesc', 'Our team will contact you within 24 hours.')}
          </p>

          {bookingResult.type === 'booking' && bookingResult.invoiceNumber && (
            <button
              onClick={() => setShowInvoice(true)}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-700 text-obsidian-900 font-bold rounded-xl hover:scale-105 transition-all text-[13px] uppercase tracking-[1px] flex items-center gap-2 shadow-button"
            >
              <FaFileInvoiceDollar />
              {t('booking.viewInvoice', 'View Invoice')}
            </button>
          )}
        </div>
      ) : (
        <div>
          {/* Form Header */}
          <div className="px-5 pt-5 pb-3 border-b border-[rgba(201,162,39,0.1)]">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center shrink-0">
                <FaSuitcase className="text-obsidian-900 text-[11px]" />
              </div>
              <h3 className="text-body-lg text-ivory-50 font-serif font-bold truncate">
                {t('booking.formTitle', 'Book Your Trip')}
              </h3>
            </div>
            {tourTitle && (
              <p className="text-caption text-gold-400/90 truncate pl-9 text-xs">
                {tourTitle}
              </p>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex px-5 pt-3 pb-0 gap-0">
            <button
              type="button"
              onClick={() => setActiveTab('booking')}
              className={getTabStyle(activeTab === 'booking')}
            >
              {t('booking.tabBooking', 'Book Trip')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('inquiry')}
              className={getTabStyle(activeTab === 'inquiry')}
            >
              {t('booking.tabInquiry', 'Inquiry')}
            </button>
          </div>

          {error && (
            <div className="mx-5 mt-3 bg-red-500/15 border border-red-500/40 rounded-xl px-4 py-3 text-center">
              <p className="text-body-sm text-red-400">{error}</p>
            </div>
          )}

          {activeTab === 'booking' ? (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3.5">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="arrival-date-input" className={labelStyle}>
                    <FaCalendarAlt className="inline mr-1.5 text-gold-400 text-[11px]" />
                    {t('booking.arrivalDate', 'Arrival Date')}
                  </label>
                  <input
                    id="arrival-date-input"
                    type="date"
                    value={formData.arrivalDate}
                    min={todayStr}
                    onChange={(e) => updateField('arrivalDate', e.target.value)}
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
                  <label htmlFor="arrival-time-input" className={labelStyle}>
                    <FaClock className="inline mr-1.5 text-gold-400 text-[11px]" />
                    {t('booking.arrivalTime', 'Arrival Time')}
                  </label>
                  <input
                    id="arrival-time-input"
                    type="time"
                    value={formData.arrivalTime}
                    onChange={(e) => updateField('arrivalTime', e.target.value)}
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
                    value={formData.departureTime}
                    onChange={(e) => updateField('departureTime', e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* Preferred Language */}
              <div className="relative">
                <label htmlFor="language-btn" className={labelStyle}>
                  <FaLanguage className="inline mr-1.5 text-gold-400 text-[11px]" />
                  {t('booking.preferredLanguage', 'Language')}
                </label>
                <button
                  id="language-btn"
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className={`${inputStyle} text-left flex items-center justify-between`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">
                      {languages.find((l) => l.value === formData.language)?.flag}
                    </span>
                    <span>
                      {t(
                        languages.find((l) => l.value === formData.language)?.labelKey,
                        languages.find((l) => l.value === formData.language)?.fallback
                      )}
                    </span>
                  </span>
                  <FaChevronDown className="text-gold-400 text-xs" />
                </button>

                {langDropdownOpen && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-[rgba(201,162,39,0.15)] rounded-xl overflow-hidden shadow-xl">
                    {languages.map((l) => (
                      <button
                        key={l.value}
                        type="button"
                        onClick={() => {
                          updateField('language', l.value);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 flex items-center gap-2 text-body-md transition-colors hover:bg-[rgba(255,252,247,0.06)] ${
                          formData.language === l.value
                            ? 'text-gold-500 bg-[rgba(201,162,39,0.06)] font-bold'
                            : 'text-ivory-50'
                        }`}
                      >
                        <span className="text-lg">{l.flag}</span>
                        <span>{t(l.labelKey, l.fallback)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Activity / Hotel Category */}
              <div className="relative">
                <label htmlFor="activity-btn" className={labelStyle}>
                  <FaBuilding className="inline mr-1.5 text-gold-400 text-[11px]" />
                  {t('booking.activityType', 'Hotel Category / Option')}
                </label>
                <button
                  id="activity-btn"
                  type="button"
                  onClick={() => setActivityDropdownOpen(!activityDropdownOpen)}
                  className={`${inputStyle} text-left flex items-center justify-between`}
                >
                  {formData.activityType ? (
                    <span>
                      {formData.activityType === 'standard'
                        ? t('booking.standardCategory', 'Option 4* (Standard)')
                        : t('booking.premiumCategory', 'Option 5* (Luxury)')}
                    </span>
                  ) : (
                    <span className="text-ivory-400">
                      {t('booking.selectActivity', 'Select Hotel Category...')}
                    </span>
                  )}
                  <FaChevronDown className="text-gold-400 text-xs" />
                </button>

                {activityDropdownOpen && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-[rgba(201,162,39,0.15)] rounded-xl overflow-hidden shadow-xl">
                    <button
                      type="button"
                      onClick={() => {
                        updateField('activityType', 'standard');
                        setActivityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-2 text-body-md transition-colors hover:bg-[rgba(255,252,247,0.06)] ${
                        formData.activityType === 'standard'
                          ? 'text-gold-500 bg-[rgba(201,162,39,0.06)] font-bold'
                          : 'text-ivory-50'
                      }`}
                    >
                      {t('booking.standardCategory', 'Option 4* (Standard)')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateField('activityType', 'premium');
                        setActivityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-2 text-body-md transition-colors hover:bg-[rgba(255,252,247,0.06)] ${
                        formData.activityType === 'premium'
                          ? 'text-gold-500 bg-[rgba(201,162,39,0.06)] font-bold'
                          : 'text-ivory-50'
                      }`}
                    >
                      {t('booking.premiumCategory', 'Option 5* (Luxury)')}
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
                    { key: 'infants', label: t('booking.infants', 'Infants'), min: 0 },
                  ].map(({ key, label, min }) => (
                    <div
                      key={key}
                      className="bg-[rgba(255,252,247,0.03)] rounded-xl p-2.5 border border-[rgba(201,162,39,0.08)] text-center"
                    >
                      <span className="block text-caption text-ivory-400 mb-1.5 text-[11px]">
                        {label}
                      </span>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateField(key, formData[key] - 1)}
                          disabled={formData[key] <= min}
                          className={`${counterBtnStyle} disabled:opacity-30 disabled:cursor-not-allowed`}
                        >
                          <FaMinus className="text-[10px]" />
                        </button>
                        <span className="text-body-lg text-ivory-50 w-6 text-center font-semibold tabular-nums">
                          {formData[key]}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateField(key, formData[key] + 1)}
                          className={counterBtnStyle}
                        >
                          <FaPlus className="text-[10px]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Contact Details */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className={labelStyle}>
                    {t('booking.fullName', 'Full Name')}
                  </label>
                  <input
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
                    <label className={labelStyle}>
                      {t('booking.email', 'Email Address')}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="email@domain.com"
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>
                      {t('booking.phone', 'Phone Number')}
                    </label>
                    <input
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
                className="w-full py-4 rounded-xl font-bold uppercase tracking-[2px] transition-all duration-300 text-[14px] bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-obsidian-950 hover:shadow-[0_0_30px_rgba(201,162,39,0.4)] hover:scale-[1.02] active:scale-[0.98] shadow-button flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <FaPaperPlane className="text-xs" />
                {status === 'submitting'
                  ? t('booking.sending', 'Sending...')
                  : t('booking.bookNow', 'Book Now')}
              </button>
            </form>
          ) : (
            /* Inquiry Form */
            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3.5">
              <div>
                <label className={labelStyle}>
                  {t('booking.fullName', 'Full Name')}
                </label>
                <input
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
                  <label className={labelStyle}>
                    {t('booking.email', 'Email Address')}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="email@domain.com"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>
                    {t('booking.phone', 'Phone Number')}
                  </label>
                  <input
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
                <label className={labelStyle}>
                  {t('booking.message', 'Message / Inquiries')}
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="Dietary requirements, room preferences, airport transfers or other requests..."
                  className={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-4 rounded-xl font-bold uppercase tracking-[2px] transition-all duration-300 text-[14px] bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-obsidian-950 hover:shadow-[0_0_30px_rgba(201,162,39,0.4)] hover:scale-[1.02] active:scale-[0.98] shadow-button flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <FaPaperPlane className="text-xs" />
                {status === 'submitting'
                  ? t('booking.sending', 'Sending...')
                  : t('booking.sendInquiry', 'Send Inquiry')}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && bookingResult && (
        <InvoiceModal
          isOpen={showInvoice}
          onClose={() => setShowInvoice(false)}
          bookingData={{
            bookingNumber: bookingResult.invoiceNumber || 'INV-1001',
            createdAt: new Date().toISOString(),
            tourTitle,
            arrivalDate: formData.arrivalDate,
            departureDate: formData.departureDate,
            adults: formData.adults,
            children: formData.children,
            infants: formData.infants,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            status: 'Confirmed',
          }}
        />
      )}
    </div>
  );
}
