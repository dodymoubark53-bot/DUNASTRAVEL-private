import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheckCircle, FaCalendarAlt, FaPlus, FaMinus, 
  FaPaperPlane, FaLanguage, FaTimes, 
  FaChevronDown, FaFileInvoiceDollar
} from 'react-icons/fa';
import Button from '../ui/Button';
import { fadeInUp } from '../../animations/variants';
import InvoiceModal from './InvoiceModal';
import api from '../../utils/api';

const AdvancedBooking = ({ onClose, tourTitle, basePricePerPerson, initialTab = 'booking', predefinedTourId = null }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [status, setStatus] = useState('idle');
  const [bookingResult, setBookingResult] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [error, setError] = useState('');
  const [tourId, setTourId] = useState(predefinedTourId);
  const isEgyptJordanTour = tourTitle === "Combined EGYPT with Jordan - 14 DAYS / 13 Nights" || tourTitle?.includes("Combined EGYPT with Jordan");

  useEffect(() => {
    if (!tourId) {
      api.get('/tours')
        .then((data) => {
          const items = data?.items || (Array.isArray(data) ? data : []);
          const match = items.find(
            (t) => (t.titleJsonb?.en || t.title)?.toLowerCase() === tourTitle?.toLowerCase()
          );
          if (match) setTourId(match.id);
        })
        .catch((err) => console.error('Failed to fetch tours for tourId match', err));
    }
  }, [tourId, tourTitle]);

  const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const todayStr = getTodayString();

  const [departureDate, setDepartureDate] = useState('');
  const [language, setLanguage] = useState('es');
  
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const [adultNames, setAdultNames] = useState(['', '']);
  const [childrenNames, setChildrenNames] = useState([]);
  const [infantNames, setInfantNames] = useState([]);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // Billing fields
  const [invoiceType, setInvoiceType] = useState('personal');
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const handleAdultsChange = (val) => {
    const newVal = Math.max(1, adults + val);
    setAdults(newVal);
    setAdultNames(prev => {
      if (val > 0) {
        return [...prev, ...Array(val).fill('')];
      } else {
        return prev.slice(0, newVal);
      }
    });
  };

  const handleChildrenChange = (val) => {
    const newVal = Math.max(0, children + val);
    setChildren(newVal);
    setChildrenNames(prev => {
      if (val > 0) {
        return [...prev, ...Array(val).fill('')];
      } else {
        return prev.slice(0, newVal);
      }
    });
  };

  const handleInfantsChange = (val) => {
    const newVal = Math.max(0, infants + val);
    setInfants(newVal);
    setInfantNames(prev => {
      if (val > 0) {
        return [...prev, ...Array(val).fill('')];
      } else {
        return prev.slice(0, newVal);
      }
    });
  };

  const [calculatedTotal, setCalculatedTotal] = useState(basePricePerPerson ? basePricePerPerson * 2 : 300);

  useEffect(() => {
    if (!tourId) {
      // Fallback client calculation if tourId not yet matched
      const basePrice = basePricePerPerson || 150;
      setCalculatedTotal(basePrice * (adults + children * 0.75 + infants * 0));
      return;
    }
    const fetchPrice = async () => {
      try {
        // api.post handles CSRF automatically
        const data = await api.post('/bookings/calculate', { tourId, adults, children });
        if (data?.totalAmountUsd) {
          setCalculatedTotal(parseFloat(data.totalAmountUsd));
        }
      } catch (err) {
        console.error('Failed to calculate price', err);
      }
    };
    fetchPrice();
  }, [adults, children, infants, tourId, basePricePerPerson]);

  const getPassengerNames = () => {
    const names = {};
    adultNames.forEach((name, i) => { if (name) names[`adult_${i}`] = name; });
    childrenNames.forEach((name, i) => { if (name) names[`child_${i}`] = name; });
    infantNames.forEach((name, i) => { if (name) names[`infant_${i}`] = name; });
    return names;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (departureDate && departureDate < todayStr) return;
    setError('');
    setStatus('submitting');
    try {
      const payload = {
        type: activeTab === 'booking' ? 'booking' : 'inquiry',
        tourTitle,
        tourId: tourId || 'placeholder-id-will-fail-backend-validation',
        departureDate,
        language,
        adults,
        children,
        infants,
        passengerNames: getPassengerNames(),
        fullName,
        email,
        phone,
        inquiryMessage: activeTab === 'inquiry' ? message : '',
        invoiceType,
        companyName,
        taxId,
        address,
        city,
        country
      };

      // api.post fetches CSRF token and sends it automatically
      const data = await api.post('/bookings', payload);

      if (payload.type === 'booking' && data?.id) {
        try {
          const payData = await api.post('/payments/initiate', { bookingId: data.id });
          const sessionUrl = payData?.session?.url || payData?.url;
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
      setError(err.message);
      setStatus('idle');
    }
  };

  return (
    <div 
      className="relative mx-auto w-full box-border rounded-[24px] bg-[#061D5D] border border-[#C9A227]/30 shadow-[0_0_35px_rgba(201,162,39,0.35)] px-5 py-8 md:p-8 max-w-full md:max-w-[520px] lg:max-w-[580px] max-h-[90vh] overflow-y-auto no-scrollbar text-right text-white font-sans" 
      dir="rtl" 
      onClick={(e) => e.stopPropagation()}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
        type="button"
        aria-label="Close"
      >
        <FaTimes size={20} />
      </button>

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <FaCheckCircle className="text-gold-500 text-6xl mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-[#E8C97A] mb-3">
              {activeTab === 'booking' ? t('booking.reservationConfirmed', 'Booking Confirmed') : t('booking.inquirySent', 'Inquiry Sent')}
            </h3>
            
            {isEgyptJordanTour ? (
              <div className="flex flex-col gap-6 w-full items-center text-left">
                <div className="text-body-md text-ivory-300 text-left whitespace-pre-line bg-gold-500/10 p-5 rounded-xl border border-gold-500/20 shadow-md w-full">
                  Good morning,{"\n"}
                  Thank you very much for your interest in the trip to Egypt. In order to send you detailed information we need:{"\n"}
                  - Name to address you{"\n"}
                  - Trip departure date and how many people want to travel{"\n"}
                  - Contact email to send the quote.{"\n"}
                  We are waiting for the requested information. All the best. Dunas Travel
                </div>
                <button 
                  onClick={onClose} 
                  className="px-6 py-2 bg-gold-500 text-obsidian-900 font-semibold rounded-full hover:scale-105 transition-transform text-sm cursor-pointer"
                >
                  {t('common.close', 'Close')}
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-300 max-w-sm">
                  {activeTab === 'booking'
                    ? t('booking.reservationSuccessDesc', 'Your reservation request for {{tourTitle}} has been received. Our team will contact you to finalize the payment and details.', { tourTitle: t(`data.${tourTitle}`, tourTitle) })
                    : t('booking.inquirySuccessDesc', 'Thank you for your interest in the {{tourTitle}}. Our DUNAS TRAVEL concierges will contact you shortly.', { tourTitle: t(`data.${tourTitle}`, tourTitle) })
                  }
                </p>
                {bookingResult?.invoiceNumber && (
                  <button
                    onClick={() => setShowInvoice(true)}
                    className="mt-4 px-5 py-2.5 bg-gold-500 text-obsidian-900 font-bold rounded-full hover:scale-105 transition-all text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <FaFileInvoiceDollar /> {t('booking.viewInvoice', 'View Invoice')}
                  </button>
                )}
              </>
            )}
          </motion.div>
        ) : (
          <motion.form
            key="form"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 w-full"
          >
            <div className="text-center pb-4 border-b border-[#C9A227]/10">
              <h3 className="text-xl font-bold text-white mb-1">{t(`data.${tourTitle}`, tourTitle)}</h3>
              <p className="text-xs text-[#C9A227] tracking-wider uppercase">حجز وتأكيد الرحلة / Book Tour</p>
            </div>

            {error && (
              <div className="bg-red-500/15 border border-red-500/40 rounded-xl px-4 py-3 text-center">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="flex border-b border-[#C9A227]/20 pb-1 justify-center gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('booking')}
                className={`text-base font-bold pb-2 px-4 transition-all duration-300 relative cursor-pointer outline-none ${activeTab === 'booking' ? 'text-[#C9A227]' : 'text-gray-400 hover:text-white'}`}
              >
                حجز مباشر
                {activeTab === 'booking' && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A227]"
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('inquiry')}
                className={`text-base font-bold pb-2 px-4 transition-all duration-300 relative cursor-pointer outline-none ${activeTab === 'inquiry' ? 'text-[#C9A227]' : 'text-gray-400 hover:text-white'}`}
              >
                طلب استفسار
                {activeTab === 'inquiry' && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A227]"
                  />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-[#C9A227]">موعد الرحيل / Departure Date</label>
                <div className="relative">
                  <input
                    type="date"
                    min={todayStr}
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full p-3.5 pr-10 rounded-lg bg-[#0d226b] text-white border border-[#c9a227]/25 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all [color-scheme:dark] text-right text-[15px]"
                    required
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C9A227]/70 pointer-events-none">
                    <FaCalendarAlt size={15} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-[#C9A227]">لغة الرحلة / Tour Language</label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3.5 pr-10 rounded-lg bg-[#0d226b] text-white border border-[#c9a227]/25 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all appearance-none text-right cursor-pointer text-[15px] [&>option]:text-[#061D5D] [&>option]:bg-white"
                    required
                  >
                    <option value="es">🇪🇸 Español (Spanish)</option>
                    <option value="pt">🇵🇹 Português (Portuguese)</option>
                    <option value="it">🇮🇹 Italiano (Italian)</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C9A227]/70 pointer-events-none">
                    <FaLanguage size={18} />
                  </div>
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C9A227]/70 pointer-events-none">
                    <FaChevronDown size={11} />
                  </div>
                </div>
              </div>

            </div>

            <div className="border border-[#c9a227]/25 rounded-xl p-4 bg-[#0a1969]/40">
              <h4 className="text-sm font-semibold text-[#C9A227] border-b border-[#c9a227]/10 pb-2 mb-4">عدد المسافرين والنزلاء</h4>
              
              <div className="flex flex-col gap-4">
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col text-right">
                    <span className="font-semibold text-white text-sm">البالغين</span>
                    <span className="text-xs text-gray-400">سن 18+</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleAdultsChange(-1)}
                      className="w-8 h-8 rounded-full border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-white transition-colors cursor-pointer"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="font-bold text-base w-6 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => handleAdultsChange(1)}
                      className="w-8 h-8 rounded-full border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-white transition-colors cursor-pointer"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                </div>
                
                {adultNames.map((name, idx) => (
                  <div key={`adult-field-${idx}`} className="mr-4 transition-all">
                    <input
                      type="text"
                      placeholder={`الاسم الكامل (بالغ ${idx + 1}) *`}
                      value={name}
                      onChange={(e) => {
                        const updated = [...adultNames];
                        updated[idx] = e.target.value;
                        setAdultNames(updated);
                      }}
                      className="w-full p-2.5 rounded-lg bg-[#0d226b] text-white border border-[#c9a227]/15 focus:border-[#C9A227] outline-none text-xs text-right"
                      required
                    />
                  </div>
                ))}

                <div className="flex items-center justify-between border-t border-[#c9a227]/10 pt-4">
                  <div className="flex flex-col text-right">
                    <span className="font-semibold text-white text-sm">الأطفال</span>
                    <span className="text-xs text-gray-400">سن 6–17</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleChildrenChange(-1)}
                      className="w-8 h-8 rounded-full border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-white transition-colors cursor-pointer"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="font-bold text-base w-6 text-center">{children}</span>
                    <button
                      type="button"
                      onClick={() => handleChildrenChange(1)}
                      className="w-8 h-8 rounded-full border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-white transition-colors cursor-pointer"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                </div>

                {childrenNames.map((name, idx) => (
                  <div key={`child-field-${idx}`} className="mr-4 transition-all">
                    <input
                      type="text"
                      placeholder={`الاسم الكامل (طفل ${idx + 1}) *`}
                      value={name}
                      onChange={(e) => {
                        const updated = [...childrenNames];
                        updated[idx] = e.target.value;
                        setChildrenNames(updated);
                      }}
                      className="w-full p-2.5 rounded-lg bg-[#0d226b] text-white border border-[#c9a227]/15 focus:border-[#C9A227] outline-none text-xs text-right"
                      required
                    />
                  </div>
                ))}

                <div className="flex items-center justify-between border-t border-[#c9a227]/10 pt-4">
                  <div className="flex flex-col text-right">
                    <span className="font-semibold text-white text-sm">الرضع</span>
                    <span className="text-xs text-gray-400">سن 0–5</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleInfantsChange(-1)}
                      className="w-8 h-8 rounded-full border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-white transition-colors cursor-pointer"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="font-bold text-base w-6 text-center">{infants}</span>
                    <button
                      type="button"
                      onClick={() => handleInfantsChange(1)}
                      className="w-8 h-8 rounded-full border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-white transition-colors cursor-pointer"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                </div>

                {infantNames.map((name, idx) => (
                  <div key={`infant-field-${idx}`} className="mr-4 transition-all">
                    <input
                      type="text"
                      placeholder={`الاسم الكامل (رضيع ${idx + 1}) *`}
                      value={name}
                      onChange={(e) => {
                        const updated = [...infantNames];
                        updated[idx] = e.target.value;
                        setInfantNames(updated);
                      }}
                      className="w-full p-2.5 rounded-lg bg-[#0d226b] text-white border border-[#c9a227]/15 focus:border-[#C9A227] outline-none text-xs text-right"
                      required
                    />
                  </div>
                ))}

              </div>
            </div>

            {/* Contact details */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold text-[#C9A227] border-b border-[#c9a227]/10 pb-2">معلومات الاتصال</h4>

              <div className="flex flex-col gap-1 w-full">
                <input
                  type="text"
                  placeholder="الاسم الكامل للمستلم الرئيسي *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#0d226b] text-white border border-[#c9a227]/25 focus:border-[#C9A227] outline-none text-sm text-right"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 w-full">
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[#0d226b] text-white border border-[#c9a227]/25 focus:border-[#C9A227] outline-none text-sm text-right"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <input
                    type="tel"
                    placeholder="رقم الهاتف مع رمز الدولة *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[#0d226b] text-white border border-[#c9a227]/25 focus:border-[#C9A227] outline-none text-sm text-right"
                    required
                  />
                </div>
              </div>

              {/* Billing Section */}
              {activeTab === 'booking' && (
                <div className="border border-[#c9a227]/25 rounded-xl p-4 bg-[#0a1969]/40 mt-2">
                  <h4 className="text-sm font-semibold text-[#C9A227] border-b border-[#c9a227]/10 pb-2 mb-4">بيانات الفاتورة</h4>
                  <div className="space-y-3">
                    <select
                      value={invoiceType}
                      onChange={(e) => setInvoiceType(e.target.value)}
                      className="w-full p-3 rounded-lg bg-[#0d226b] text-white border border-[#c9a227]/25 focus:border-[#C9A227] outline-none text-sm text-right appearance-none cursor-pointer"
                    >
                      <option value="personal">شخصي</option>
                      <option value="company">شركة</option>
                    </select>
                    {invoiceType === 'company' && (
                      <>
                        <input
                          type="text"
                          placeholder="اسم الشركة *"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full p-3 rounded-lg bg-[#0d226b] text-white border border-[#c9a227]/25 focus:border-[#C9A227] outline-none text-sm text-right"
                        />
                        <input
                          type="text"
                          placeholder="الرقم الضريبي *"
                          value={taxId}
                          onChange={(e) => setTaxId(e.target.value)}
                          className="w-full p-3 rounded-lg bg-[#0d226b] text-white border border-[#c9a227]/25 focus:border-[#C9A227] outline-none text-sm text-right"
                        />
                      </>
                    )}
                    <input
                      type="text"
                      placeholder="العنوان"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-3 rounded-lg bg-[#0d226b] text-white border border-[#c9a227]/25 focus:border-[#C9A227] outline-none text-sm text-right"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="المدينة"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-3 rounded-lg bg-[#0d226b] text-white border border-[#c9a227]/25 focus:border-[#C9A227] outline-none text-sm text-right"
                      />
                      <input
                        type="text"
                        placeholder="الدولة"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full p-3 rounded-lg bg-[#0d226b] text-white border border-[#c9a227]/25 focus:border-[#C9A227] outline-none text-sm text-right"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'inquiry' && (
                <div className="flex flex-col gap-1 w-full mt-1">
                  <textarea
                    placeholder="متطلبات خاصة أو استفسارات..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full p-3 rounded-lg bg-[#0d226b] text-white border border-[#c9a227]/25 focus:border-[#C9A227] outline-none text-sm text-right resize-none"
                  />
                </div>
              )}
            </div>

            {activeTab === 'booking' && (
              <div className="mt-2 p-4 rounded-xl bg-[#0a1969] border border-[#c9a227]/25 flex items-center justify-between text-right shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                <span className="text-xl md:text-2xl font-bold text-[#E8C97A]">
                  ${calculatedTotal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
                <span className="text-sm font-semibold text-white/80">المجموع الكلي المقدر</span>
              </div>
            )}

            <div className="flex justify-center mt-2 w-full">
              <Button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-4 text-base font-bold rounded-full text-[#061D5D] hover:scale-[1.02] active:scale-[0.98] transition-all bg-gradient-to-r from-[#C9A227] to-[#E8C97A] flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_0_20px_rgba(201,162,39,0.4)]"
              >
                <span>
                  {status === 'submitting' 
                    ? t('common.processing', 'Processing...') 
                    : (activeTab === 'booking' ? 'احجز الآن بالضمان' : 'إرسال الطلب')}
                </span>
                <FaPaperPlane size={14} className="transform -rotate-45" />
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {showInvoice && bookingResult && (
        <InvoiceModal booking={bookingResult} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
};

export default AdvancedBooking;
