import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaMinus, FaCheckCircle, FaPaperPlane, FaGlobeAmericas, FaUser, FaFileInvoiceDollar, FaCalendarAlt, FaClock, FaStar } from 'react-icons/fa';
import InvoiceModal from './InvoiceModal';
import api from '../../utils/api';
import { trackEvent } from '../../utils/analytics';
import { useAuth } from '../../context/AuthContext';

const inputClass = "w-full p-3 rounded-xl outline-none transition-all text-[14px] bg-[rgba(255,252,247,0.04)] text-ivory-50 placeholder:text-[rgba(245,237,214,0.3)] border border-[rgba(201,162,39,0.15)] focus:border-[rgba(201,162,39,0.5)] focus:shadow-[0_0_20px_rgba(201,162,39,0.1)] [color-scheme:dark]";
const labelClass = "block text-caption text-gold-500 font-medium mb-1 text-[12px] uppercase tracking-[1px]";
const counterBtnClass = "w-8 h-8 rounded-full bg-[rgba(255,252,247,0.06)] text-gold-500 flex items-center justify-center hover:bg-gold-500 hover:text-obsidian-900 transition-all duration-200 border border-[rgba(201,162,39,0.15)] hover:border-gold-500";
const tabClass = (active) => `flex-1 py-3 text-[13px] font-semibold uppercase tracking-[2px] transition-all duration-200 ${active ? 'text-gold-500 border-b-2 border-gold-500 bg-[rgba(201,162,39,0.06)]' : 'text-ivory-400 hover:text-ivory-300 border-b-2 border-transparent'}`;

const languages = [
  { value: 'es', flag: '🇪🇸', labelKey: 'languages.spanish', fallback: 'Spanish' },
  { value: 'pt', flag: '🇧🇷', labelKey: 'languages.portuguese', fallback: 'Portuguese' },
  { value: 'it', flag: '🇮🇹', labelKey: 'languages.italian', fallback: 'Italian' },
  { value: 'en', flag: '🇬🇧', labelKey: 'languages.english', fallback: 'English' },
  { value: 'ar', flag: '🇪🇬', labelKey: 'languages.arabic', fallback: 'Arabic' },
];

const BookingForm = ({ tourId, tourTitle, transportChoice, requireTransportChoice }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    trackEvent('booking_started', { tourSlug: tourTitle || tourId });
  }, []);
  const [tab, setTab] = useState('booking');
  const [status, setStatus] = useState('idle');
  const [langOpen, setLangOpen] = useState(null);
  const [activityOpen, setActivityOpen] = useState(false);
  const [transportAlert, setTransportAlert] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [error, setError] = useState('');
  const [pricePreview, setPricePreview] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
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
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [b, setB] = useState({
    arrivalDate: '', departureDate: '', arrivalTime: '', departureTime: '', language: user?.preferredLanguage || i18n.language || 'en', activityType: '',
    adults: 1, children: 0, infants: 0,
    fullName: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    invoiceType: 'PERSONAL', companyName: '', taxId: '', address: '', city: '', country: '',
    notes: ''
  });
  const [passengerNames, setPassengerNames] = useState({});

  const [inq, setInq] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', language: user?.preferredLanguage || i18n.language || 'en', message: '' });

  useEffect(() => {
    if (user) {
      setB(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        language: prev.language || user.preferredLanguage || i18n.language || 'en',
      }));
      setInq(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        language: prev.language || user.preferredLanguage || i18n.language || 'en',
      }));
    }
  }, [user, i18n.language]);

  const updateB = (k, v) => {
    const num = ['adults', 'children', 'infants'];
    setB(p => ({ ...p, [k]: num.includes(k) ? Math.max(0, parseInt(v) || 0) : v }));
  };

  const passengerFields = [
    ...Array.from({ length: b.adults }, (_, i) => ({ type: 'Adult', num: i + 1, key: `adult_${i}` })),
    ...Array.from({ length: b.children }, (_, i) => ({ type: 'Child', num: i + 1, key: `child_${i}` })),
    ...Array.from({ length: b.infants }, (_, i) => ({ type: 'Infant', num: i + 1, key: `infant_${i}` })),
  ];

  useEffect(() => {
    if (!tourId || tab !== 'booking') return;
    const fetchPrice = async () => {
      try {
        // Pricing calculation must NEVER rely on client-side math; always call POST /api/bookings/calculate
        const data = await api.post('/bookings/calculate', {
          tourId,
          date: b.arrivalDate,
          adults: b.adults,
          children: b.children,
          infants: b.infants,
          promoCode,
          language: b.language,
        });
        setPricePreview(data);
        if (promoCode && data?.promoMessage) {
          setPromoMessage(data.promoMessage);
        } else {
          setPromoMessage('');
        }
      } catch {
        // Never retain an estimate after its authoritative server preview
        // could not be calculated for the current form state.
        setPricePreview(null);
      }
    };
    const debounce = setTimeout(fetchPrice, 400);
    return () => clearTimeout(debounce);
  }, [tourId, b.arrivalDate, b.departureDate, b.adults, b.children, promoCode, tab]);

  const handleValidatePromoCode = async () => {
    if (!promoCode) return;
    try {
      const res = await api.post('/promotions/validate', { code: promoCode, promoCode, tourId });
      if (res) {
        setPromoMessage(res.message || t('booking.promoValid', 'Promotion code valid!'));
      }
    } catch (err) {
      setPromoMessage(err.message || t('booking.promoInvalid', 'Invalid promo code'));
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (requireTransportChoice && !transportChoice) {
      setTransportAlert(true);
      const el = document.getElementById('transport-selector');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setTransportAlert(false);
    setStatus('submitting');
    try {
      const payload = {
        type: 'booking',
        tourId,
        tourTitle,
        transportChoice: transportChoice || '',
        arrivalDate: b.arrivalDate,
        departureDate: b.departureDate,
        arrivalTime: b.arrivalTime,
        departureTime: b.departureTime,
        language: ['en', 'ar', 'es', 'pt', 'it'].includes(b.language?.toLowerCase()) ? b.language.toLowerCase() : 'en',
        activityType: b.activityType,
        adults: b.adults,
        children: b.children,
        singleRooms: b.singleRooms || 0,
        infants: b.infants,
        passengers: passengerNames,
        passengerNames: Object.fromEntries(Object.entries(passengerNames)),
        specialRequests: b.notes,
        notes: b.notes,
        contactEmail: b.email,
        contactPhone: b.phone,
        fullName: b.fullName,
        email: b.email,
        phone: b.phone,
        invoiceType: b.invoiceType,
        companyName: b.companyName,
        taxId: b.taxId,
        address: b.address,
        city: b.city,
        country: b.country,
        promoCode,
        analyticsSessionId: typeof window !== 'undefined' ? localStorage.getItem('dunas_analytics_sid') : undefined,
        originInterfaceSlug: typeof window !== 'undefined' ? sessionStorage.getItem('dunas_origin_interface') : undefined,
      };

      // api.post fetches CSRF token and sends it automatically
      const data = await api.post('/bookings', payload);

      // Rule 2: Store returned 'guestToken' from POST /api/bookings into localStorage ('dunas_guest_token')
      const tokenToSave = data?.guestToken || data?.data?.guestToken;
      if (tokenToSave && typeof window !== 'undefined') {
        localStorage.setItem('dunas_guest_token', tokenToSave);
      }

      if (data?.id || data?.referenceCode) {
        try {
          const targetId = data.id || data.referenceCode;
          const payData = await api.post('/payments/initiate', { bookingId: targetId }).catch(() =>
            api.post('/payments/checkout-session', { bookingId: targetId })
          );
          const sessionUrl = payData?.session?.url || payData?.url || payData?.checkoutUrl;
          if (sessionUrl) {
            window.location.href = sessionUrl;
            return;
          }
        } catch (payErr) {
          console.error('Payment initiation failed', payErr);
        }
      }

      setBookingResult(data);
      setStatus('success');
    } catch (err) {
      // Rule 3: Handle 409 (Double booking) and 422 (Validation) errors gracefully with localized user alerts.
      if (err.status === 409) {
        setError(t('booking.errorConflict', 'A booking conflict exists for the selected dates. Please adjust your itinerary.'));
      } else if (err.status === 422) {
        setError(t('booking.errorValidation', 'Please verify passenger and date information before proceeding.'));
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
      const payload = {
        destination: tourTitle || tourId,
        duration: 'custom',
        tourTitle,
        contactName: inq.name,
        fullName: inq.name,
        email: inq.email,
        phone: inq.phone,
        paxs: 1,
        notes: inq.message,
        message: inq.message,
        preferredLanguage: inq.language || 'en',
      };
      const data = await api.post('/inquiries', payload);
      setBookingResult({ ...data, type: 'inquiry' });
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Error processing request');
      setStatus('idle');
    }
  };

  return (
    <div ref={langRef} className="bg-obsidian-900 text-ivory-50 rounded-2xl shadow-card border border-[rgba(201,162,39,0.15)] hover:shadow-[0_0_40px_rgba(201,162,39,0.15)] hover:border-[rgba(201,162,39,0.35)] hover:scale-[1.01] transition-all duration-300">
      {status === 'success' && bookingResult ? (
          <div className="flex flex-col items-center text-center py-12 px-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(201,162,39,0.3)]">
              <FaCheckCircle className="text-obsidian-900 text-xl" />
            </div>
            <h3 className="text-display-md text-ivory-50 mb-2 font-display">{t('booking.inquirySent', 'Inquiry Sent')}</h3>
            <p className="text-body-sm text-ivory-400">{t('booking.successDesc', 'Our team will contact you within 24 hours.')}</p>
            {bookingResult.type === 'booking' && bookingResult.invoiceNumber && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowInvoice(true);
                }}
                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-700 text-obsidian-900 font-bold rounded-xl hover:scale-105 transition-all text-[13px] uppercase tracking-[1px] flex items-center gap-2 cursor-pointer"
              >
                <FaFileInvoiceDollar /> {t('booking.viewInvoice', 'View Invoice')}
              </button>
            )}
            {transportChoice && (
              <div className="mt-4 bg-[rgba(201,162,39,0.1)] border border-gold-500/30 rounded-xl px-5 py-3">
                <p className="text-caption text-gold-500 text-[11px] uppercase tracking-[1px] mb-1">{t('booking.transport', 'Transport')}</p>
                <p className="text-body-md text-ivory-50">{transportChoice === 'train' ? `🚄 ${t('tour.highSpeedTrain', 'High-Speed Train')}` : `🚌 ${t('tour.bus', 'Bus')} ${t('tour.viaGrandBazaar', 'via Grand Bazaar')}`}</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="px-5 pt-5 pb-3 border-b border-[rgba(201,162,39,0.1)]">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center">
                  <FaPaperPlane className="text-obsidian-900 text-[10px]" />
                </div>
                <h3 className="text-body-lg text-ivory-50 font-display font-semibold truncate">{t('booking.formTitle', 'Book Your Trip')}</h3>
              </div>
              <p className="text-caption text-ivory-400 truncate pl-9">{tourTitle}</p>
            </div>

            <div className="flex px-5 pt-3 pb-0 gap-0">
              <button type="button" onClick={() => setTab('booking')} className={tabClass(tab === 'booking')}>{t('booking.tabBooking', 'Book Trip')}</button>
              <button type="button" onClick={() => setTab('inquiry')} className={tabClass(tab === 'inquiry')}>{t('booking.tabInquiry', 'Inquiry')}</button>
            </div>

            {error && (
              <div className="mx-5 mt-3 bg-red-500/15 border border-red-500/40 rounded-xl px-4 py-3 text-center">
                <p className="text-body-sm text-red-400">{error}</p>
              </div>
            )}

            {tab === 'booking' ? (
              <form onSubmit={handleBookingSubmit} className="px-5 py-4 space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="arrival-date-input" className={labelClass}><FaCalendarAlt className="inline mr-1.5 text-gold-400" size={11} />{t('booking.arrivalDate', 'Arrival Date')}</label>
                    <input id="arrival-date-input" type="date" value={b.arrivalDate} min={todayStr} onChange={e => updateB('arrivalDate', e.target.value)} required className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="departure-date-input" className={labelClass}><FaCalendarAlt className="inline mr-1.5 text-gold-400" size={11} />{t('booking.departureDate', 'Departure Date')}</label>
                    <input id="departure-date-input" type="date" value={b.departureDate} min={b.arrivalDate || todayStr} onChange={e => updateB('departureDate', e.target.value)} required className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="arrival-time-input" className={labelClass}><FaClock className="inline mr-1.5 text-gold-400" size={11} />{t('booking.arrivalTime', 'Arrival Time')}</label>
                    <input id="arrival-time-input" type="time" value={b.arrivalTime} onChange={e => updateB('arrivalTime', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="departure-time-input" className={labelClass}><FaClock className="inline mr-1.5 text-gold-400" size={11} />{t('booking.departureTime', 'Departure Time')}</label>
                    <input id="departure-time-input" type="time" value={b.departureTime} onChange={e => updateB('departureTime', e.target.value)} className={inputClass} />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="language-btn" className={labelClass}><FaGlobeAmericas className="inline mr-1.5 text-gold-400" size={11} />{t('booking.preferredLanguage', 'Language')}</label>
                  <button id="language-btn" type="button" onClick={() => setLangOpen(langOpen === 'booking' ? null : 'booking')} className={`${inputClass} text-left flex items-center gap-2`}>
                    {b.language ? (
                      <>
                        <span className="text-lg">{languages.find(l => l.value === b.language)?.flag}</span>
                        <span>{t(languages.find(l => l.value === b.language)?.labelKey, languages.find(l => l.value === b.language)?.fallback)}</span>
                      </>
                    ) : (
                      <span className="text-ivory-400">{t('booking.selectLanguage', 'Select...')}</span>
                    )}
                  </button>
                  {langOpen === 'booking' && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-[rgba(201,162,39,0.15)] rounded-xl overflow-hidden shadow-xl">
                      {languages.map(lang => (
                        <button key={lang.value} type="button" onClick={() => { updateB('language', lang.value); setLangOpen(null); }} className={`w-full text-left px-4 py-3 flex items-center gap-2 text-body-md transition-colors hover:bg-[rgba(255,252,247,0.06)] ${b.language === lang.value ? 'text-gold-500 bg-[rgba(201,162,39,0.06)]' : 'text-ivory-50'}`}>
                          <span className="text-lg">{lang.flag}</span>
                          <span>{t(lang.labelKey, lang.fallback)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative" ref={activityRef}>
                  <label htmlFor="activity-btn" className={labelClass}><FaStar className="inline mr-1.5 text-gold-400" size={11} />{t('booking.activityType', 'Type of Activity')}</label>
                  <button id="activity-btn" type="button" onClick={() => setActivityOpen(!activityOpen)} className={`${inputClass} text-left flex items-center gap-2`}>
                    {b.activityType ? (
                      <span>{b.activityType === 'standard' ? t('booking.standardCategory', 'Standard Category') : t('booking.premiumCategory', 'Premium Category')}</span>
                    ) : (
                      <span className="text-ivory-400">{t('booking.selectActivity', 'Select...')}</span>
                    )}
                  </button>
                  {activityOpen && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-[rgba(201,162,39,0.15)] rounded-xl overflow-hidden shadow-xl">
                      <button type="button" onClick={() => { updateB('activityType', 'standard'); setActivityOpen(false); }} className={`w-full text-left px-4 py-3 flex items-center gap-2 text-body-md transition-colors hover:bg-[rgba(255,252,247,0.06)] ${b.activityType === 'standard' ? 'text-gold-500 bg-[rgba(201,162,39,0.06)]' : 'text-ivory-50'}`}>
                        {t('booking.standardCategory', 'Standard Category')}
                      </button>
                      <button type="button" onClick={() => { updateB('activityType', 'premium'); setActivityOpen(false); }} className={`w-full text-left px-4 py-3 flex items-center gap-2 text-body-md transition-colors hover:bg-[rgba(255,252,247,0.06)] ${b.activityType === 'premium' ? 'text-gold-500 bg-[rgba(201,162,39,0.06)]' : 'text-ivory-50'}`}>
                        {t('booking.premiumCategory', 'Premium Category')}
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <span className={labelClass}><FaUser className="inline mr-1.5 text-gold-400" size={11} />{t('booking.passengers', 'Passengers')}</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { k: 'adults', lbl: t('booking.adults', 'Adults'), min: 1 },
                      { k: 'children', lbl: t('booking.children', 'Children'), min: 0 },
                      { k: 'infants', lbl: t('booking.infants', 'Infants'), min: 0 },
                    ].map(({ k, lbl, min }) => (
                      <div key={k} className="bg-[rgba(255,252,247,0.03)] rounded-xl p-2.5 border border-[rgba(201,162,39,0.08)] text-center">
                        <span className="block text-caption text-ivory-400 mb-1.5 text-[11px]">{lbl}</span>
                        <div className="flex items-center justify-center gap-1.5">
                          <button type="button" onClick={() => updateB(k, b[k] - 1)} disabled={b[k] <= min} aria-label={`Decrease ${lbl}`} className={`${counterBtnClass} w-7 h-7 disabled:opacity-30 disabled:cursor-not-allowed`}><FaMinus size={10} /></button>
                          <span className="text-body-lg text-ivory-50 w-6 text-center font-semibold tabular-nums">{b[k]}</span>
                          <button type="button" onClick={() => updateB(k, b[k] + 1)} aria-label={`Increase ${lbl}`} className={`${counterBtnClass} w-7 h-7`}><FaPlus size={10} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {transportChoice && (
                  <div className="bg-[rgba(201,162,39,0.08)] border border-gold-500/20 rounded-xl px-4 py-3">
                    <label className={labelClass}>{t('booking.transport', 'Transport')}</label>
                    <p className="text-body-sm text-gold-300 flex items-center gap-2">
                      <span>{transportChoice === 'train' ? `🚄 ${t('tour.highSpeedTrain', 'High-Speed Train')}` : `🚌 ${t('tour.bus', 'Bus')} ${t('tour.viaGrandBazaar', 'via Grand Bazaar')}`}</span>
                      <span className="text-[10px] text-ivory-400">({t('booking.selected', 'selected')})</span>
                    </p>
                  </div>
                )}

                {passengerFields.length > 0 && (
                  <div className="bg-[rgba(255,252,247,0.02)] rounded-xl p-3 border border-[rgba(201,162,39,0.08)]">
                    <p className="text-caption text-gold-500 font-semibold mb-2 text-[11px] uppercase tracking-[1px]">{t('booking.passengerNames', 'Passenger Names')}</p>
                    <div className="space-y-2">
                      {passengerFields.map(p => (
                        <div key={p.key}>
                          <label htmlFor={`passenger-name-${p.key}`} className="block text-caption text-ivory-400 text-[11px] mb-0.5">{p.type === 'Adult' ? '👤' : p.type === 'Child' ? '🧒' : '👶'} {t(`booking.${p.type.toLowerCase()}`, p.type)} {p.num}</label>
                          <input id={`passenger-name-${p.key}`} type="text" placeholder={`${t('booking.fullNameOf', 'Name')}`} onChange={e => setPassengerNames(prev => ({ ...prev, [p.key]: e.target.value }))} className={`${inputClass} p-2.5 text-[13px]`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <p className={labelClass}><FaUser className="inline mr-1.5 text-gold-400" size={11} />{t('booking.contactInfo', 'Contact')}</p>
                  <label htmlFor="contact-fullname" className="sr-only">{t('booking.fullName', 'Full Name')}</label>
                  <input id="contact-fullname" type="text" placeholder={t('booking.fullName', 'Full Name')} value={b.fullName} onChange={e => updateB('fullName', e.target.value)} required className={inputClass} />
                  <div className="grid grid-cols-2 gap-3">
                    <label htmlFor="contact-email" className="sr-only">{t('booking.email', 'Email')}</label>
                    <input id="contact-email" type="email" placeholder={t('booking.email', 'Email')} value={b.email} onChange={e => updateB('email', e.target.value)} required className={inputClass} />
                    <label htmlFor="contact-phone" className="sr-only">{t('booking.phone', 'Phone')}</label>
                    <input id="contact-phone" type="tel" placeholder={t('booking.phone', 'Phone')} value={b.phone} onChange={e => updateB('phone', e.target.value)} required className={inputClass} />
                  </div>
                </div>

                <div>
                  <button type="button" onClick={() => updateB('_showBilling', !b._showBilling)} className={`${labelClass} w-full text-left flex items-center justify-between ${b._showBilling ? 'text-gold-500' : ''}`}>
                    <span><FaFileInvoiceDollar className="inline mr-1.5 text-gold-400" size={11} />{t('booking.billingInfo', 'Billing')}</span>
                    <span className="text-[10px]">{b._showBilling ? '▲' : '▼'}</span>
                  </button>
                  {b._showBilling && (
                    <div className="mt-3 space-y-3 bg-[rgba(255,252,247,0.02)] rounded-xl p-3 border border-[rgba(201,162,39,0.08)]">
                      <label htmlFor="invoice-type-select" className="sr-only">{t('booking.invoiceType', 'Invoice Type')}</label>
                      <select id="invoice-type-select" value={b.invoiceType} onChange={e => updateB('invoiceType', e.target.value)} className={`${inputClass} appearance-none`}>
                      <option value="PERSONAL">{t('booking.personal', 'Personal')}</option>
                      <option value="COMPANY">{t('booking.company', 'Company')}</option>
                      </select>
                      {b.invoiceType === 'COMPANY' && (
                        <>
                          <label htmlFor="company-name-input" className="sr-only">{t('booking.companyName', 'Company Name')}</label>
                          <input id="company-name-input" type="text" placeholder={t('booking.companyName', 'Company Name')} value={b.companyName} onChange={e => updateB('companyName', e.target.value)} className={inputClass} />
                          <label htmlFor="tax-id-input" className="sr-only">{t('booking.taxId', 'Tax ID')}</label>
                          <input id="tax-id-input" type="text" placeholder={t('booking.taxId', 'Tax ID')} value={b.taxId} onChange={e => updateB('taxId', e.target.value)} className={inputClass} />
                        </>
                      )}
                      <label htmlFor="address-input" className="sr-only">{t('booking.address', 'Address')}</label>
                      <input id="address-input" type="text" placeholder={t('booking.address', 'Address')} value={b.address} onChange={e => updateB('address', e.target.value)} className={inputClass} />
                      <div className="grid grid-cols-2 gap-3">
                        <label htmlFor="city-input" className="sr-only">{t('booking.city', 'City')}</label>
                        <input id="city-input" type="text" placeholder={t('booking.city', 'City')} value={b.city} onChange={e => updateB('city', e.target.value)} className={inputClass} />
                        <label htmlFor="country-input" className="sr-only">{t('booking.country', 'Country')}</label>
                        <input id="country-input" type="text" placeholder={t('booking.country', 'Country')} value={b.country} onChange={e => updateB('country', e.target.value)} className={inputClass} />
                      </div>
                    </div>
                  )}
                </div>

                <label htmlFor="notes-textarea" className="sr-only">{t('booking.notesPlaceholder', 'Special requests...')}</label>
                <textarea id="notes-textarea" placeholder={t('booking.notesPlaceholder', 'Special requests...')} value={b.notes} onChange={e => updateB('notes', e.target.value)} rows="2" className={`${inputClass} resize-none`} />

                {transportAlert && (
                  <div className="bg-red-500/15 border border-red-500/40 rounded-xl px-4 py-3 text-center animate-pulse">
                    <p className="text-body-sm text-red-400 font-semibold">
                      {t('booking.transportRequired', 'Please select a transport option (High-Speed Train or Bus) before booking.')}
                    </p>
                  </div>
                )}

                <div className="bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.15)] rounded-xl p-3">
                  <label className={labelClass}>{t('booking.promoCode', 'Promo Code')}</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Promo code..." value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} className={inputClass} />
                  </div>
                  {promoMessage && (
                    <p className={`text-[11px] mt-1 font-semibold ${pricePreview?.promoValid ? 'text-sage-400' : 'text-red-400'}`}>
                      {promoMessage}
                    </p>
                  )}
                </div>

                {pricePreview && (
                  <div className="bg-[rgba(255,252,247,0.02)] border border-[rgba(201,162,39,0.15)] rounded-xl p-4">
                    <p className="text-caption text-ivory-400 text-xs mb-1 uppercase tracking-widest">{t('booking.totalPrice', 'Total Estimated Price')}</p>
                    <p className="text-display-sm text-gold-500 font-display">${pricePreview.totalAmountUsd}</p>
                    {pricePreview.promoValid && (
                      <p className="text-[11px] text-sage-400 mt-1 line-through opacity-70">
                        ${parseFloat(pricePreview.totalAmountUsd) + parseFloat(pricePreview.discountAmountUsd)}
                      </p>
                    )}
                  </div>
                )}

                <button type="submit" disabled={status === 'submitting'} className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-700 text-obsidian-900 font-bold rounded-xl shadow-[0_0_25px_rgba(201,162,39,0.2)] hover:shadow-[0_0_35px_rgba(201,162,39,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-[13px] uppercase tracking-[1.5px] flex items-center justify-center gap-2">
                  {status === 'submitting' ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin" />{t('common.sending', 'Sending...')}</span> : <><FaPaperPlane size={12} />{t('booking.sendInquiry', 'Book Now')}</>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleInquirySubmit} className="px-5 py-4 space-y-3.5">
                <p className="text-body-sm text-ivory-400">{t('booking.inquiryFormDesc', 'Have a question? Send us a message and we\'ll get back to you.')}</p>
                <div>
                  <label htmlFor="inquiry-name" className={labelClass}>{t('booking.fullName', 'Full Name')}</label>
                  <input id="inquiry-name" type="text" value={inq.name} onChange={e => setInq(p => ({ ...p, name: e.target.value }))} required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="inquiry-email" className={labelClass}>{t('booking.email', 'Email')}</label>
                  <input id="inquiry-email" type="email" value={inq.email} onChange={e => setInq(p => ({ ...p, email: e.target.value }))} required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="inquiry-phone" className={labelClass}>{t('booking.phone', 'Phone')}</label>
                  <input id="inquiry-phone" type="tel" value={inq.phone} onChange={e => setInq(p => ({ ...p, phone: e.target.value }))} required className={inputClass} />
                </div>
                <div className="relative">
                  <label htmlFor="inquiry-lang" className={labelClass}><FaGlobeAmericas className="inline mr-1.5 text-gold-400" size={11} />{t('booking.preferredLanguage', 'Language')}</label>
                  <button id="inquiry-lang" type="button" onClick={() => setLangOpen(langOpen === 'inquiry' ? null : 'inquiry')} className={`${inputClass} text-left flex items-center gap-2`}>
                    {inq.language ? (
                      <>
                        <span className="text-lg">{languages.find(l => l.value === inq.language)?.flag}</span>
                        <span>{t(languages.find(l => l.value === inq.language)?.labelKey, languages.find(l => l.value === inq.language)?.fallback)}</span>
                      </>
                    ) : (
                      <span className="text-ivory-400">{t('booking.selectLanguage', 'Select...')}</span>
                    )}
                  </button>
                  {langOpen === 'inquiry' && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-[rgba(201,162,39,0.15)] rounded-xl overflow-hidden shadow-xl">
                      {languages.map(lang => (
                        <button key={lang.value} type="button" onClick={() => { setInq(p => ({ ...p, language: lang.value })); setLangOpen(null); }} className={`w-full text-left px-4 py-3 flex items-center gap-2 text-body-md transition-colors hover:bg-[rgba(255,252,247,0.06)] ${inq.language === lang.value ? 'text-gold-500 bg-[rgba(201,162,39,0.06)]' : 'text-ivory-50'}`}>
                          <span className="text-lg">{lang.flag}</span>
                          <span>{t(lang.labelKey, lang.fallback)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="inquiry-msg" className={labelClass}>{t('booking.specialRequests', 'Message')}</label>
                  <textarea id="inquiry-msg" placeholder={t('booking.inquiryPlaceholder', 'Your message...')} value={inq.message} onChange={e => setInq(p => ({ ...p, message: e.target.value }))} rows="4" className={`${inputClass} resize-none`} />
                </div>
                <button type="submit" disabled={status === 'submitting'} className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-700 text-obsidian-900 font-bold rounded-xl shadow-[0_0_25px_rgba(201,162,39,0.2)] hover:shadow-[0_0_35px_rgba(201,162,39,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-[13px] uppercase tracking-[1.5px] flex items-center justify-center gap-2">
                  {status === 'submitting' ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin" />{t('common.sending', 'Sending...')}</span> : <><FaPaperPlane size={12} />{t('booking.sendInquiry', 'Book Now')}</>}
                </button>
              </form>
            )}
          </div>
        )}

      {showInvoice && bookingResult && (
        <InvoiceModal booking={bookingResult} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
};

export default BookingForm;
