import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { supportedLocale } from '../utils/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlane, FaWhatsapp, FaPhone, FaFacebookF, FaInstagram } from 'react-icons/fa';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useDestinations } from '../hooks/useDestinations';
import { useToast } from '../context/ToastContext';

const TailorTour = () => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const { user } = useAuth();
  const { destinations: publishedDestinations } = useDestinations();
  const isRtl = i18n.dir() === 'rtl';

  const [step, setStep] = useState(1);
  const DRAFT_STORAGE_KEY = 'dunas_tailor_tour_draft_v1';

  // Read initial draft from localStorage safely
  const getStoredDraft = () => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(DRAFT_STORAGE_KEY) : null;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const initialDraft = getStoredDraft();

  const [animationState, setAnimationState] = useState('parked-1'); // parked-1, parked-2, flying-forward, flying-backward
  const [selectedDestinations, setSelectedDestinations] = useState(
    () => (Array.isArray(initialDraft?.selectedDestinations) ? initialDraft.selectedDestinations : [])
  );
  const [destError, setDestError] = useState(false);

  // Traveler contact & info state
  const [fullName, setFullName] = useState(() => initialDraft?.fullName || user?.name || '');
  const [email, setEmail] = useState(() => initialDraft?.email || user?.email || '');
  const [nationality, setNationality] = useState(
    () => initialDraft?.nationality || user?.country || user?.nationality || ''
  );
  const [phone, setPhone] = useState(() => initialDraft?.phone || user?.phone || '');
  const [travelDate, setTravelDate] = useState(() => initialDraft?.travelDate || '');
  const [dateError, setDateError] = useState(false);
  const [budget, setBudget] = useState(() => initialDraft?.budget || '');
  const [fieldErrors, setFieldErrors] = useState({});

  const clearFieldError = (field) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Partner / Secret Referral Code State
  const [partnerCode, setPartnerCode] = useState(() => initialDraft?.partnerCode || '');
  const [partnerVerificationState, setPartnerVerificationState] = useState('idle'); // 'idle' | 'verifying' | 'verified' | 'unverified'
  const [verifiedPartnerCompany, setVerifiedPartnerCompany] = useState(null);
  const [partnerVerificationError, setPartnerVerificationError] = useState('');
  const partnerDebounceRef = useRef(null);
  const [isDraftRestored, setIsDraftRestored] = useState(
    () => Boolean(initialDraft && (initialDraft.fullName || initialDraft.email || initialDraft.phone || initialDraft.selectedDestinations?.length > 0 || initialDraft.partnerCode))
  );

  useEffect(() => {
    if (!user) return undefined;
    let isMounted = true;
    queueMicrotask(() => {
      if (!isMounted) return;
      if (!fullName && user.name) setFullName(user.name);
      if (!email && user.email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
      if (!nationality && (user.country || user.nationality)) setNationality(user.country || user.nationality);
    });
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Today's date logic using local time
  const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const todayStr = getTodayString();

  // Dynamic names & counts managed together to avoid setState in useEffect
  const [passengerNames, setPassengerNames] = useState(
    () => (Array.isArray(initialDraft?.passengerNames) && initialDraft.passengerNames.length > 0 ? initialDraft.passengerNames : [''])
  );
  const [specialRequests, setSpecialRequests] = useState(() => initialDraft?.specialRequests || '');

  const resizeNames = (names, totalCount) => {
    const next = [...names];
    if (next.length < totalCount) {
      while (next.length < totalCount) {
        next.push('');
      }
    } else if (next.length > totalCount) {
      next.splice(totalCount);
    }
    return next;
  };

  const [adults, _setAdults] = useState(() => initialDraft?.adults || 1);
  const [children, _setChildren] = useState(() => initialDraft?.children || 0);
  const [infants, _setInfants] = useState(() => initialDraft?.infants || 0);

  const setAdults = (val) => {
    _setAdults(val);
    setPassengerNames((prev) => resizeNames(prev, val + children + infants));
  };
  const setChildren = (val) => {
    _setChildren(val);
    setPassengerNames((prev) => resizeNames(prev, adults + val + infants));
  };
  const setInfants = (val) => {
    _setInfants(val);
    setPassengerNames((prev) => resizeNames(prev, adults + children + val));
  };

  const handlePassengerNameChange = (index, value) => {
    setPassengerNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  // Auto-verify restored partner code on initial mount
  useEffect(() => {
    if (initialDraft?.partnerCode && initialDraft.partnerCode.length === 8) {
      setPartnerVerificationState('verifying');
      import('../utils/api').then(({ default: api }) => {
        api.get(`/agencies/verify-partner/${initialDraft.partnerCode}`)
          .then((res) => {
            if (res.data?.valid && res.data?.company) {
              setPartnerVerificationState('verified');
              setVerifiedPartnerCompany(res.data.company);
            } else {
              setPartnerVerificationState('unverified');
              setPartnerVerificationError(res.data?.message || '');
            }
          })
          .catch((err) => {
            setPartnerVerificationState('unverified');
            setPartnerVerificationError(err?.response?.data?.message || '');
          });
      });
    }
  }, []);

  // Auto-save draft to localStorage whenever fields change
  useEffect(() => {
    const hasContent =
      selectedDestinations.length > 0 ||
      Boolean(fullName.trim()) ||
      Boolean(email.trim()) ||
      Boolean(phone.trim()) ||
      Boolean(nationality.trim()) ||
      Boolean(travelDate) ||
      Boolean(budget) ||
      Boolean(specialRequests.trim()) ||
      Boolean(partnerCode);

    if (hasContent) {
      const draft = {
        selectedDestinations,
        fullName,
        email,
        nationality,
        phone,
        travelDate,
        budget,
        adults,
        children,
        infants,
        passengerNames,
        specialRequests,
        partnerCode,
        updatedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      } catch {
        // Ignore quota limits
      }
    }
  }, [
    selectedDestinations,
    fullName,
    email,
    nationality,
    phone,
    travelDate,
    budget,
    adults,
    children,
    infants,
    passengerNames,
    specialRequests,
    partnerCode,
  ]);

  // Clear draft action
  const handleClearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsDraftRestored(false);
    setSelectedDestinations([]);
    setFullName(user?.name || '');
    setEmail(user?.email || '');
    setNationality(user?.country || user?.nationality || '');
    setPhone(user?.phone || '');
    setTravelDate('');
    setDateError(false);
    setBudget('');
    setPartnerCode('');
    setPartnerVerificationState('idle');
    setVerifiedPartnerCompany(null);
    setPartnerVerificationError('');
    _setAdults(1);
    _setChildren(0);
    _setInfants(0);
    setPassengerNames(['']);
    setSpecialRequests('');
    setStep(1);
  };

  // Scroll to top utility for Safari/iOS and generic cross-browser support
  const scrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const handleDestinationToggle = (dest) => {
    setSelectedDestinations((prev) => {
      const updated = prev.includes(dest)
        ? prev.filter((d) => d !== dest)
        : [...prev, dest];
      if (updated.length > 0) {
        setDestError(false);
      }
      return updated;
    });
  };

  const handleNextStep = () => {
    if (selectedDestinations.length === 0) {
      setDestError(true);
    } else {
      setDestError(false);
      setAnimationState('flying-forward');
      setStep(2);
    }
  };

  const handleBackStep = () => {
    setAnimationState('flying-backward');
    setStep(1);
    scrollToTop();
  };

  const handleDateChange = (e) => {
    const val = e.target.value;
    setTravelDate(val);
    clearFieldError('travelDate');
    if (val && val < todayStr) {
      setDateError(true);
    } else {
      setDateError(false);
    }
  };

  const parseBudgetAmount = (val) => {
    if (!val) return undefined;
    const clean = String(val).trim();
    if (clean === '1000-2000') return 1500;
    if (clean === '2000-3000') return 2500;
    if (clean === '3000+') return 3000;
    if (clean.includes('-')) {
      const parts = clean
        .split('-')
        .map((p) => parseFloat(p.replace(/[^0-9.]/g, '')))
        .filter((n) => Number.isFinite(n));
      if (parts.length >= 2) return Math.round((parts[0] + parts[1]) / 2);
      if (parts.length === 1) return parts[0];
    }
    const num = parseFloat(clean.replace(/[^0-9.]/g, ''));
    return Number.isFinite(num) && num > 0 && num <= 10_000_000 ? num : undefined;
  };

  const validateStep2 = () => {
    const errs = {};

    // 1. Full Name
    if (!fullName || !fullName.trim()) {
      errs.fullName = t('tailor.errorFullNameRequired', 'الاسم الكامل مطلوب (كما هو موضح في جواز السفر)');
    } else if (fullName.trim().length < 2) {
      errs.fullName = t('tailor.errorFullNameShort', 'يجب أن يتكون الاسم من حرفين على الأقل');
    }

    // 2. Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim()) {
      errs.email = t('tailor.errorEmailRequired', 'البريد الإلكتروني مطلوب لتأكيد الحجز والتواصل');
    } else if (!emailRegex.test(email.trim())) {
      errs.email = t('tailor.errorEmailInvalid', 'يرجى إدخال بريد إلكتروني صحيح (مثال: name@example.com)');
    }

    // 3. Nationality
    if (!nationality || !nationality.trim()) {
      errs.nationality = t('tailor.errorNationalityRequired', 'يرجى اختيار الجنسية');
    }

    // 4. Phone
    const phoneClean = phone ? phone.trim() : '';
    const phoneRegex = /^[0-9+\-\s()]{7,25}$/;
    if (!phoneClean) {
      errs.phone = t('tailor.errorPhoneRequired', 'رقم الهاتف مطلوب لتنسيق الرحلة (واتساب أو اتصال)');
    } else if (!phoneRegex.test(phoneClean)) {
      errs.phone = t('tailor.errorPhoneInvalid', 'رقم الهاتف غير صالح (يجب أن يحتوي على أرقام ورمز الدولة)');
    }

    // 5. Travel Date
    if (!travelDate) {
      errs.travelDate = t('tailor.errorDateRequired', 'يرجى تحديد تاريخ السفر المتوقع');
    } else if (travelDate < todayStr) {
      errs.travelDate = t('tailor.errorPastDate', 'تاريخ السفر يجب أن يكون في المستقبل');
    }

    // 6. Budget
    if (!budget) {
      errs.budget = t('tailor.errorBudgetRequired', 'يرجى اختيار الميزانية التقريبية للشخص الواحد');
    }

    // 7. Adults
    if (!adults || adults < 1) {
      errs.adults = t('tailor.errorAdultsMin', 'يجب أن يكون هناك بالغ واحد على الأقل (+12 سنة)');
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePartnerCodeChange = (e) => {
    const rawVal = e.target.value;
    const digitsOnly = String(rawVal).replace(/\D/g, '').slice(0, 8);
    setPartnerCode(digitsOnly);

    if (partnerDebounceRef.current) {
      clearTimeout(partnerDebounceRef.current);
    }

    if (digitsOnly.length === 8) {
      setPartnerVerificationState('verifying');
      setPartnerVerificationError('');

      partnerDebounceRef.current = setTimeout(async () => {
        try {
          const { default: api } = await import('../utils/api');
          const res = await api.get(`/agencies/verify-partner/${digitsOnly}`);
          if (res.data?.valid && res.data?.company) {
            setPartnerVerificationState('verified');
            setVerifiedPartnerCompany(res.data.company);
            setPartnerVerificationError('');
          } else {
            setPartnerVerificationState('unverified');
            setVerifiedPartnerCompany(null);
            setPartnerVerificationError(
              res.data?.message || t('tailor.partnerCodeNotFound', 'رمز الشريك غير مسجل في شبكة الشركاء المعتمدين')
            );
          }
        } catch (err) {
          setPartnerVerificationState('unverified');
          setVerifiedPartnerCompany(null);
          setPartnerVerificationError(
            err?.response?.data?.message || err?.message || t('tailor.partnerCodeCheckFailed', 'تعذر التحقق من رمز الشريك')
          );
        }
      }, 300);
    } else {
      setPartnerVerificationState('idle');
      setVerifiedPartnerCompany(null);
      setPartnerVerificationError('');
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Comprehensive Step 2 validation
    if (!validateStep2()) {
      toast?.error?.(
        isRtl
          ? 'يرجى مراجعة الحقول المطلوبة باللون الأحمر واستكمال البيانات المطلوبة.'
          : 'Please review the highlighted required fields and complete your details.',
        {
          title: isRtl ? 'حقول إلزامية ناقصة' : 'Incomplete Form',
          duration: 6000,
        }
      );

      // Smooth scroll to the first erroneous input
      setTimeout(() => {
        const firstErrorInput = document.querySelector('.border-red-500, input:invalid, select:invalid');
        if (firstErrorInput) {
          firstErrorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErrorInput.focus();
        }
      }, 100);
      return;
    }

    try {
      setIsSubmitting(true);

      // Assemble structured customer notes with nationality and passenger names
      const notesParts = [];
      if (nationality && nationality.trim()) {
        notesParts.push(`الجنسية: ${nationality.trim()}`);
      }
      const validPassengerNames = passengerNames.map((n) => n?.trim()).filter(Boolean);
      if (validPassengerNames.length > 0) {
        notesParts.push(`أسماء المسافرين: ${validPassengerNames.join(', ')}`);
      }
      if (specialRequests && specialRequests.trim()) {
        notesParts.push(`طلبات خاصة: ${specialRequests.trim()}`);
      }
      const combinedNotes = notesParts.join(' | ') || undefined;

      const parsedBudget = parseBudgetAmount(budget);

      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        preferredLanguage: (() => {
          const language = String(i18n.language || 'en').toLowerCase().split('-')[0];
          return ['en', 'es', 'fr', 'de', 'it', 'ar', 'pt'].includes(language)
            ? language
            : supportedLocale(language);
        })(),
        destinations: selectedDestinations.length > 0 ? selectedDestinations : ['Custom Experience'],
        startDate: travelDate || undefined,
        adults: Number(adults) || 1,
        children: Number(children || 0) + Number(infants || 0),
        notes: combinedNotes,
        ...(parsedBudget ? { budgetAmount: parsedBudget, budgetCurrency: 'USD' } : {}),
        ...(partnerCode && partnerCode.length === 8 ? { partnerCode } : {}),
      };

      const { default: api } = await import('../utils/api');
      await api.post('/inquiries', payload);

      const successMessage = t('tailor.successAlert', 'تم إرسال طلب رحلتك المخصصة بنجاح! سيتواصل معك أحد خبراء السفر الفاخر قريباً.');
      toast?.success?.(successMessage, {
        title: t('tailor.successTitle', 'تم تأكيد استلام الطلب'),
        duration: 7000,
      });

      // Reset form & clear draft
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // ignore
      }
      setIsDraftRestored(false);
      setSelectedDestinations([]);
      setFullName('');
      setEmail('');
      setNationality('');
      setPhone('');
      setTravelDate('');
      setDateError(false);
      setFieldErrors({});
      setBudget('');
      setPartnerCode('');
      setPartnerVerificationState('idle');
      setVerifiedPartnerCompany(null);
      setPartnerVerificationError('');
      _setAdults(1);
      _setChildren(0);
      _setInfants(0);
      setPassengerNames(['']);
      setSpecialRequests('');
      setStep(1);
      scrollToTop();
    } catch (err) {
      console.error('Inquiry submission failed:', err);
      const serverResponse = err?.response?.data;
      let errorDetail = '';

      if (serverResponse?.message) {
        if (Array.isArray(serverResponse.message)) {
          errorDetail = serverResponse.message.join(', ');
        } else if (typeof serverResponse.message === 'string') {
          errorDetail = serverResponse.message;
        }
      } else if (err?.message) {
        errorDetail = err.message;
      }

      const baseErrorMessage = isRtl
        ? 'تعذر إرسال طلب الرحلة المخصصة، يرجى التحقق من الحقول الإلزامية.'
        : 'Failed to submit bespoke inquiry. Please verify the required fields.';

      toast?.error?.(errorDetail ? `${baseErrorMessage}\n(${errorDetail})` : baseErrorMessage, {
        title: isRtl ? 'خطأ في إرسال الطلب' : 'Submission Error',
        duration: 8000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Select plane-icon class dynamically depending on step & language direction
  const getPlaneClass = () => {
    if (isRtl) {
      if (animationState === 'parked-1') return 'plane-parked-1-rtl';
      if (animationState === 'parked-2') return 'plane-parked-2-rtl';
      if (animationState === 'flying-forward') return 'plane-fly-forward-rtl';
      if (animationState === 'flying-backward') return 'plane-fly-backward-rtl';
    } else {
      if (animationState === 'parked-1') return 'plane-parked-1-ltr';
      if (animationState === 'parked-2') return 'plane-parked-2-ltr';
      if (animationState === 'flying-forward') return 'plane-fly-forward-ltr';
      if (animationState === 'flying-backward') return 'plane-fly-backward-ltr';
    }
    return '';
  };

  const isFlying = animationState === 'flying-forward' || animationState === 'flying-backward';

const DEFAULT_DESTINATIONS = [
  {
    id: 'egypt',
    nameAr: 'مصر (القاهرة، الأهرامات والنيل)',
    nameEn: 'Egypt (Cairo, Pyramids & Nile)',
    nameEs: 'Egipto (El Cairo y Nilo)',
    namePt: 'Egito (Cairo e Nilo)',
    nameIt: 'Egitto (Cairo e Nilo)',
    img: 'https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_800,c_fill/v1783026771/8_mpyvu4.jpg',
    flag: '🇪🇬',
  },
  {
    id: 'turkey',
    nameAr: 'تركيا (إسطنبول وكابادوكيا)',
    nameEn: 'Turkey (Istanbul & Cappadocia)',
    nameEs: 'Turquía (Estambul y Capadocia)',
    namePt: 'Turquia (Istambul e Capadócia)',
    nameIt: 'Turchia (Istanbul e Cappadocia)',
    img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
    flag: '🇹🇷',
  },
  {
    id: 'jordan',
    nameAr: 'الأردن (البتراء والبحر الميت)',
    nameEn: 'Jordan (Petra & Dead Sea)',
    nameEs: 'Jordania (Petra y Mar Muerto)',
    namePt: 'Jordânia (Petra e Mar Morto)',
    nameIt: 'Giordania (Petra e Mar Morto)',
    img: 'https://images.unsplash.com/photo-1579606032822-e42718e24483?auto=format&fit=crop&w=800&q=80',
    flag: '🇯🇴',
  },
  {
    id: 'dubai',
    nameAr: 'دبي والإمارات الفاخرة',
    nameEn: 'Dubai & UAE Luxury',
    nameEs: 'Dubái y Emiratos de Lujo',
    namePt: 'Dubai e Emirados Árabes',
    nameIt: 'Dubai ed Emirati Arabi',
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    flag: '🇦🇪',
  },
  {
    id: 'morocco',
    nameAr: 'المغرب (مراكش والمدن العتيقة)',
    nameEn: 'Morocco (Marrakech & Imperial Cities)',
    nameEs: 'Marruecos (Marrakech)',
    namePt: 'Marrocos (Marrakech)',
    nameIt: 'Marocco (Marrakech)',
    img: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80',
    flag: '🇲🇦',
  },
  {
    id: 'greece',
    nameAr: 'اليونان (أثينا وسانتوريني)',
    nameEn: 'Greece (Athens & Santorini)',
    nameEs: 'Grecia (Atenas y Santorini)',
    namePt: 'Grécia (Atenas e Santorini)',
    nameIt: 'Grecia (Atene e Santorini)',
    img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    flag: '🇬🇷',
  },
  {
    id: 'tunisia',
    nameAr: 'تونس (الصحراء والواحات)',
    nameEn: 'Tunisia (Heritage & Oasis)',
    nameEs: 'Túnez (Patrimonio y Desierto)',
    namePt: 'Tunísia (História e Deserto)',
    nameIt: 'Tunisia (Oasi e Sahara)',
    img: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
    flag: '🇹🇳',
  },
  {
    id: 'multi-country',
    nameAr: 'برامج سياحية مشتركة (متعددة الوجهات)',
    nameEn: 'Multi-Country Combined Grand Tours',
    nameEs: 'Grandes Tours Multipaís Combinados',
    namePt: 'Grandes Roteiros Multi-Países',
    nameIt: 'Grandi Tour Combinati Multi-Paese',
    img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    flag: '🌍',
  },
];

  const langKey = (i18n.language || 'en').toLowerCase().split('-')[0];
  const destinations = (publishedDestinations && publishedDestinations.length > 0)
    ? publishedDestinations.map((destination) => ({
        id: destination.slug || destination.id,
        name: destination.title || destination.name,
        img: destination.heroImageUrl || destination.image || 'https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_800,c_fill/v1783026771/8_mpyvu4.jpg',
      }))
    : DEFAULT_DESTINATIONS.map((d) => ({
        id: d.id,
        name: d[`name${langKey === 'ar' ? 'Ar' : langKey === 'es' ? 'Es' : langKey === 'pt' ? 'Pt' : langKey === 'it' ? 'It' : 'En'}`] || d.nameEn,
        img: d.img,
        flag: d.flag,
      }));

  const totalPassengers = adults + children + infants;

  return (
    <div className="w-full bg-obsidian-50 pb-24 font-body">
      <Helmet>
        <title>{t('tailor.title', 'Tailor Your Bespoke Tour | Dunas Travel')}</title>
        <meta
          name="description"
          content={t(
            'tailor.seoDesc',
            'Customize your luxury dream holiday with Dunas Travel. Choose your destinations, details, and let our experts design your perfect itinerary.'
          )}
        />
      </Helmet>

      {/* Styled Embed block for component custom CSS and Keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        .stepper-container {
          position: relative;
          max-width: 800px;
          margin: 0 auto 50px auto;
        }
        .progress-line {
          position: absolute;
          top: 24px;
          left: 10%;
          right: 10%;
          height: 2px;
          border-top: 3px dashed #b1c1ce;
          z-index: 0;
        }
        .plane-icon,
        .dark .tailor-fixed .plane-icon,
        .dark .tailor-fixed .plane-icon svg,
        .dark .tailor-fixed .plane-icon svg path,
        .dark .tailor-fixed .plane-icon * {
          position: absolute;
          top: 8px;
          font-size: 28px;
          color: var(--color-gold, #f5a623) !important;
          fill: var(--color-gold, #f5a623) !important;
          z-index: 10;
        }

        /* Default parked states */
        .plane-parked-1-ltr {
          left: 14%;
          transform: translateY(0) rotate(0deg) scaleX(1);
        }
        .plane-parked-2-ltr {
          left: 80%;
          transform: translateY(0) rotate(0deg) scaleX(1);
        }
        .plane-parked-1-rtl {
          right: 14%;
          transform: translateY(0) rotate(0deg) scaleX(-1);
        }
        .plane-parked-2-rtl {
          right: 80%;
          transform: translateY(0) rotate(0deg) scaleX(-1);
        }

        /* Forward animations (Step 1 -> Step 2) */
        .plane-fly-forward-ltr {
          animation: flyForwardLTR 2s ease-in-out forwards;
        }
        .plane-fly-forward-rtl {
          animation: flyForwardRTL 2s ease-in-out forwards;
        }

        /* Backward animations (Step 2 -> Step 1) */
        .plane-fly-backward-ltr {
          animation: flyBackwardLTR 2s ease-in-out forwards;
        }
        .plane-fly-backward-rtl {
          animation: flyBackwardRTL 2s ease-in-out forwards;
        }

        /* Keyframes for flight trajectories */
        @keyframes flyForwardLTR {
          0% {
            left: 14%;
            transform: translateY(0) rotate(0deg) scaleX(1);
          }
          30% {
            transform: translateY(-35px) rotate(-15deg) scaleX(1);
          }
          50% {
            left: 47%;
            transform: translateY(-50px) rotate(0deg) scaleX(1);
          }
          70% {
            transform: translateY(-35px) rotate(15deg) scaleX(1);
          }
          100% {
            left: 80%;
            transform: translateY(0) rotate(0deg) scaleX(1);
          }
        }

        @keyframes flyBackwardLTR {
          0% {
            left: 80%;
            transform: translateY(0) rotate(0deg) scaleX(-1);
          }
          30% {
            transform: translateY(-35px) rotate(15deg) scaleX(-1);
          }
          50% {
            left: 47%;
            transform: translateY(-50px) rotate(0deg) scaleX(-1);
          }
          70% {
            transform: translateY(-35px) rotate(-15deg) scaleX(-1);
          }
          100% {
            left: 14%;
            transform: translateY(0) rotate(0deg) scaleX(-1);
          }
        }

        @keyframes flyForwardRTL {
          0% {
            right: 14%;
            transform: translateY(0) rotate(0deg) scaleX(-1);
          }
          30% {
            transform: translateY(-35px) rotate(15deg) scaleX(-1);
          }
          50% {
            right: 47%;
            transform: translateY(-50px) rotate(0deg) scaleX(-1);
          }
          70% {
            transform: translateY(-35px) rotate(-15deg) scaleX(-1);
          }
          100% {
            right: 80%;
            transform: translateY(0) rotate(0deg) scaleX(-1);
          }
        }

        @keyframes flyBackwardRTL {
          0% {
            right: 80%;
            transform: translateY(0) rotate(0deg) scaleX(1);
          }
          30% {
            transform: translateY(-35px) rotate(-15deg) scaleX(1);
          }
          50% {
            right: 47%;
            transform: translateY(-50px) rotate(0deg) scaleX(1);
          }
          70% {
            transform: translateY(-35px) rotate(15deg) scaleX(1);
          }
          100% {
            right: 14%;
            transform: translateY(0) rotate(0deg) scaleX(1);
          }
        }

        /* Active smoke trail */
        .exhaust-trail {
          position: absolute;
          left: -15px; /* Behind the tail */
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          gap: 6px;
        }
        .exhaust-trail .dot {
          width: 6px;
          height: 6px;
          background-color: rgba(245, 166, 35, 0.8);
          border-radius: 50%;
          opacity: 0;
          animation: trailSmoke 1s infinite;
        }
        .exhaust-trail .dot-1 { animation-delay: 0s; }
        .exhaust-trail .dot-2 { animation-delay: 0.2s; }
        .exhaust-trail .dot-3 { animation-delay: 0.4s; }

        @keyframes trailSmoke {
          0% {
            transform: scale(0.5) translateX(0);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.8) translateX(-20px);
            opacity: 0;
          }
        }

        /* 3D perspective submit wrapper */
        .submit-wrapper {
          perspective: 600px;
          display: flex;
          justify-content: center;
          padding: 20px 0;
          width: 100%;
        }

        /* Responsive 3D floating submit button */
        .btn-3d-glow {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid var(--color-gold, #f5a623);
          border-radius: 16px;
          background-color: var(--color-primary, #1e3a8a);
          color: white;
          font-family: var(--font-body, 'Montserrat', sans-serif);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          position: relative;
          z-index: 1;
          transform-style: preserve-3d;
          transform: rotateX(12deg);
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s ease;
          animation: float3D 1.8s ease-in-out infinite alternate;

          /* Mobile (< 768px) default layout */
          width: 100%;
          font-size: 16px;
          padding: 14px 24px;
        }

        /* Tablet (768px - 1024px) layout */
        @media (min-width: 768px) and (max-width: 1024px) {
          .btn-3d-glow {
            width: auto;
            font-size: 18px;
            padding: 16px 40px;
          }
        }

        /* Desktop (> 1024px) layout */
        @media (min-width: 1025px) {
          .btn-3d-glow {
            width: auto;
            font-size: 22px;
            padding: 18px 56px;
          }
        }

        @keyframes float3D {
          0% {
            transform: translateY(0) rotateX(12deg);
            box-shadow:
              0 6px 0 #c07d0a,
              0 12px 0 #7a4f04,
              0 15px 25px rgba(26, 26, 70, 0.4),
              0 0 20px rgba(245, 166, 35, 0.4);
          }
          100% {
            transform: translateY(-8px) rotateX(12deg);
            box-shadow:
              0 14px 0 #c07d0a,
              0 20px 0 #7a4f04,
              0 25px 35px rgba(26, 26, 70, 0.35),
              0 0 35px rgba(245, 166, 35, 0.65);
          }
        }

        .btn-3d-glow:hover {
          animation: none; /* pause the floating animation */
          transform: translateY(4px) rotateX(12deg) scale(0.98);
          box-shadow:
            0 2px 0 #c07d0a,
            0 4px 0 #7a4f04,
            0 6px 12px rgba(26, 26, 70, 0.5),
            0 0 15px rgba(245, 166, 35, 0.5);
        }

        .btn-3d-glow:active {
          animation: none;
          transform: translateY(8px) rotateX(12deg) scale(0.95);
          box-shadow:
            0 0px 0 #c07d0a,
            0 0px 0 #7a4f04,
            0 2px 4px rgba(26, 26, 70, 0.6),
            0 0 5px rgba(245, 166, 35, 0.3);
          transition: transform 0.05s ease, box-shadow 0.05s ease;
        }

        /* 3D social footer styling */
        .social-footer-3d {
          margin-top: 60px;
          text-align: center;
          padding-top: 40px;
          border-top: 1px solid rgba(26, 26, 46, 0.1);
        }
        .social-footer-3d ul {
          position: relative;
          display: flex;
          justify-content: center;
          gap: 30px;
          list-style: none;
          padding-bottom: 30px;
          transform: rotate(-8deg) skew(8deg);
          margin-top: 20px;
        }
        .social-footer-3d ul li {
          position: relative;
          width: 60px;
          height: 60px;
        }
        .social-footer-3d ul li a {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff !important;
          font-size: 1.8rem;
          text-decoration: none;
          transition: 0.5s ease;
          border-radius: 12px;
          box-shadow: -10px 10px 10px rgba(0, 0, 0, 0.08);
          z-index: 1;
        }
        .social-footer-3d ul li a::before {
          content: "";
          position: absolute;
          top: 0;
          left: -12px;
          width: 12px;
          height: 100%;
          transition: 0.5s ease;
          transform: rotate(0deg) skewY(-45deg);
          transform-origin: right;
          border-radius: 12px 0 0 12px;
        }
        .social-footer-3d ul li a::after {
          content: "";
          position: absolute;
          bottom: -12px;
          left: 0;
          width: 100%;
          height: 12px;
          transition: 0.5s ease;
          transform: rotate(0deg) skewX(-45deg);
          transform-origin: top;
          border-radius: 0 0 12px 12px;
        }

        .social-footer-3d ul li.ts-whatsapp a { background: #22d765; }
        .social-footer-3d ul li.ts-whatsapp a::before { background: #1db856; }
        .social-footer-3d ul li.ts-whatsapp a::after { background: #55e18c; }

        .social-footer-3d ul li.ts-phone a { background: #55c760; }
        .social-footer-3d ul li.ts-phone a::before { background: #46a650; }
        .social-footer-3d ul li.ts-phone a::after { background: #71cf7c; }

        .social-footer-3d ul li.ts-facebook a { background: #3b5999; }
        .social-footer-3d ul li.ts-facebook a::before { background: #2e477d; }
        .social-footer-3d ul li.ts-facebook a::after { background: #4e6bb3; }

        .social-footer-3d ul li.ts-instagram a { background: linear-gradient(135deg, #e4405f, #b339ac, #f96d00); }
        .social-footer-3d ul li.ts-instagram a::before { background: linear-gradient(135deg, #ac2f46, #8e2b8b, #c15600); }
        .social-footer-3d ul li.ts-instagram a::after { background: linear-gradient(135deg, #e4405f, #b339ac, #f96d00); opacity: 0.8; }

        .social-footer-3d ul li:hover a {
          transform: translate(12px, -12px);
          bo      ` }} />

      {/* Banner Section */}
      <section className="relative h-[40vh] pt-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-obsidian-900"></div>
        <div className="absolute inset-0 bg-hero-overlay"></div>
        <div className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display-lg text-ivory-50 px-4"
          >
            {t('tailor.heading', 'Tailor Your Custom Journey')}
          </motion.h1>
        </div>
      </section>

      {/* Content Form Section */}
      <section className="container mx-auto px-6 py-12 -mt-16 relative z-20 max-w-5xl">
        <div className="tailor-fixed bg-[#faf9f6] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 md:p-12 border border-obsidian-900/5">
          {/* Stepper Header */}
          <div className="stepper-container">
            <div className="progress-line"></div>
            <div className={`plane-icon ${getPlaneClass()}`}>
              <FaPlane className="rtl-flip" />
              {isFlying && (
                <div className="exhaust-trail">
                  <span className="dot dot-1"></span>
                  <span className="dot dot-2"></span>
                  <span className="dot dot-3"></span>
                </div>
              )}
            </div>
            <div className="flex justify-between relative z-10">
              <div className="text-center w-32">
                <div
                  className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center font-bold text-lg border-2 transition-all duration-500 ${
                    step >= 1
                      ? 'bg-gold-500 text-obsidian-900 border-gold-500 shadow-gold'
                      : 'bg-white text-obsidian-300 border-gray-200'
                  }`}
                >
                  1
                </div>
                <div
                  className={`mt-2 text-sm font-semibold transition-colors duration-500 ${
                    step >= 1 ? 'text-gold-500' : 'text-obsidian-300'
                  }`}
                >
                  {t('tailor.step1Label', 'Destinations')}
                </div>
              </div>

              <div className="text-center w-32">
                <div
                  className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center font-bold text-lg border-2 transition-all duration-500 ${
                    step >= 2
                      ? 'bg-gold-500 text-obsidian-900 border-gold-500 shadow-gold'
                      : 'bg-white text-obsidian-300 border-gray-200'
                  }`}
                >
                  2
                </div>
                <div
                  className={`mt-2 text-sm font-semibold transition-colors duration-500 ${
                    step >= 2 ? 'text-gold-500' : 'text-obsidian-300'
                  }`}
                >
                  {t('tailor.step2Label', 'Trip Details')}
                </div>
              </div>
            </div>
          </div>

          {/* Form Element */}
          <form onSubmit={handleSubmit} className="mt-8">
            {isDraftRestored && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-gradient-to-r from-gold-500/15 via-gold-500/5 to-gold-500/15 border border-gold-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-xs"
              >
                <div className="flex items-center gap-2.5 text-obsidian-800">
                  <span className="text-gold-600 text-base">💾</span>
                  <span className="font-medium">
                    {t('tailor.draftRestored', 'تم استعادة بيانات طلبك السابقة تلقائياً من جهازك.')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClearDraft}
                  className="px-2.5 py-1 text-xs font-bold text-obsidian-600 hover:text-red-600 bg-white/80 border border-obsidian-900/10 rounded-lg hover:border-red-400/40 transition-all cursor-pointer"
                >
                  {t('tailor.clearDraft', 'مسح والبدء من جديد')}
                </button>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRtl ? -50 : 50 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-display-sm text-center text-obsidian-900 mb-8 font-medium">
                    {t('tailor.step1Title', 'Where would you like to travel? (You can choose more than one)')}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                    {destinations.map((dest) => {
                      const isSelected = selectedDestinations.includes(dest.id);
                      return (
                        <button
                          type="button"
                          key={dest.id}
                          onClick={() => handleDestinationToggle(dest.id)}
                          aria-pressed={isSelected}
                          aria-label={`${isSelected ? t('tailor.unselect', 'Unselect') : t('home.select', 'Select')} ${dest.name}`}
                          className={`relative h-[220px] rounded-2xl overflow-hidden cursor-pointer group border-2 bg-slate-900 p-0 text-left transition-all duration-300 transform hover:-translate-y-1 ${
                            isSelected
                              ? 'border-amber-500 shadow-xl ring-2 ring-amber-500/50 scale-[1.02]'
                              : 'border-obsidian-900/10 hover:border-amber-500/70 hover:shadow-lg'
                          }`}
                        >
                          <img
                            src={dest.img}
                            alt={dest.name}
                            draggable="false"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.88] group-hover:brightness-100"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-4">
                            {dest.flag && (
                              <span className="text-xl mb-1 drop-shadow">{dest.flag}</span>
                            )}
                            <span className="text-white font-extrabold text-base leading-snug drop-shadow-md">
                              {dest.name}
                            </span>
                          </div>
                          {isSelected && (
                            <span
                              className="pointer-events-none absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-black shadow-lg text-sm"
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <p className="min-h-6 text-center text-body-sm font-medium text-obsidian-700" aria-live="polite">
                    {selectedDestinations.length > 0
                      ? t('tailor.destinationsSelected', '{{count}} destination(s) selected', {
                        count: selectedDestinations.length,
                      })
                      : t('tailor.selectDestinationHint', 'Select one or more destinations, then continue.')}
                  </p>

                  {destError && (
                    <p className="text-[#e74c3c] text-center mb-6 font-medium text-body-md">
                      {t('tailor.errorDestination', '⚠️ Please select at least one destination to continue.')}
                    </p>
                  )}

                  <div className="flex justify-end pt-6 border-t border-obsidian-900/10">
                    <Button
                      type="button"
                      variant="gold-glow"
                      onClick={handleNextStep}
                      className="px-8 py-3"
                    >
                      {t('tailor.next', 'Next Step')}
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRtl ? 50 : -50 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-display-sm text-obsidian-900 mb-8 font-medium">
                    {t('tailor.step2Title', 'Enter Contact & Traveler Info')}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="tailor-fullname" className="block mb-2 font-semibold text-body-sm text-obsidian-700">
                        {t('tailor.fullName', 'Full Name *')}
                      </label>
                      <input
                        id="tailor-fullname"
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          clearFieldError('fullName');
                        }}
                        placeholder={t('tailor.fullNamePlaceholder', 'Name as shown in passport')}
                        aria-invalid={Boolean(fieldErrors.fullName)}
                        className={`w-full p-4 bg-white border rounded-xl outline-none transition-all text-obsidian-900 ${
                          fieldErrors.fullName
                            ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/10'
                            : 'border-obsidian-900/10 focus:border-gold-500 focus:shadow-[0_0_12px_rgba(245,166,35,0.15)]'
                        }`}
                      />
                      {fieldErrors.fullName && (
                        <p className="mt-1.5 text-xs text-red-600 font-bold flex items-center gap-1">
                          <span>⚠️</span> {fieldErrors.fullName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="tailor-email" className="block mb-2 font-semibold text-body-sm text-obsidian-700">
                        {t('tailor.email', 'Email Address *')}
                      </label>
                      <input
                        id="tailor-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          clearFieldError('email');
                        }}
                        placeholder={t('tailor.emailPlaceholder', 'name@example.com')}
                        aria-invalid={Boolean(fieldErrors.email)}
                        className={`w-full p-4 bg-white border rounded-xl outline-none transition-all text-obsidian-900 ${
                          fieldErrors.email
                            ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/10'
                            : 'border-obsidian-900/10 focus:border-gold-500 focus:shadow-[0_0_12px_rgba(245,166,35,0.15)]'
                        }`}
                      />
                      {fieldErrors.email && (
                        <p className="mt-1.5 text-xs text-red-600 font-bold flex items-center gap-1">
                          <span>⚠️</span> {fieldErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="tailor-nationality" className="block mb-2 font-semibold text-body-sm text-obsidian-700">
                        {t('tailor.nationality', 'Nationality *')}
                      </label>
                      <select
                        id="tailor-nationality"
                        value={nationality}
                        onChange={(e) => {
                          setNationality(e.target.value);
                          clearFieldError('nationality');
                        }}
                        aria-invalid={Boolean(fieldErrors.nationality)}
                        className={`w-full p-4 bg-white border rounded-xl outline-none transition-all text-obsidian-900 cursor-pointer ${
                          fieldErrors.nationality
                            ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/10'
                            : 'border-obsidian-900/10 focus:border-gold-500 focus:shadow-[0_0_12px_rgba(245,166,35,0.15)]'
                        }`}
                      >
                        <option value="">{t('tailor.selectNationality', 'Select nationality...')}</option>
                        <option value="مصرية">{t('tailor.nationalityEgypt', 'مصرية (Egyptian)')}</option>
                        <option value="سعودية">{t('tailor.nationalitySaudi', 'سعودية (Saudi)')}</option>
                        <option value="إماراتية">{t('tailor.nationalityEmirati', 'إماراتية (Emirati)')}</option>
                        <option value="كويتية">{t('tailor.nationalityKuwaiti', 'كويتية (Kuwaiti)')}</option>
                        <option value="قطرية">{t('tailor.nationalityQatari', 'قطرية (Qatari)')}</option>
                        <option value="بحرينية">{t('tailor.nationalityBahraini', 'بحرينية (Bahraini)')}</option>
                        <option value="عمانية">{t('tailor.nationalityOmani', 'عمانية (Omani)')}</option>
                        <option value="أردنية">{t('tailor.nationalityJordanian', 'أردنية (Jordanian)')}</option>
                        <option value="لبنانية">{t('tailor.nationalityLebanese', 'لبنانية (Lebanese)')}</option>
                        <option value="أمريكية">{t('tailor.nationalityAmerican', 'أمريكية (American)')}</option>
                        <option value="بريطانية">{t('tailor.nationalityBritish', 'بريطانية (British)')}</option>
                        <option value="برازيلية">{t('tailor.nationalityBrazilian', 'برازيلية (Brazilian)')}</option>
                        <option value="إسبانية">{t('tailor.nationalitySpanish', 'إسبانية (Spanish)')}</option>
                        <option value="إيطالية">{t('tailor.nationalityItalian', 'إيطالية (Italian)')}</option>
                        <option value="برتغالية">{t('tailor.nationalityPortuguese', 'برتغالية (Portuguese)')}</option>
                        <option value="فرنسية">{t('tailor.nationalityFrench', 'فرنسية (French)')}</option>
                        <option value="ألمانية">{t('tailor.nationalityGerman', 'ألمانية (German)')}</option>
                        <option value="كندية">{t('tailor.nationalityCanadian', 'كندية (Canadian)')}</option>
                        <option value="أسترالية">{t('tailor.nationalityAustralian', 'أسترالية (Australian)')}</option>
                        <option value="أخرى">{t('tailor.nationalityOther', 'أخرى (Other)')}</option>
                      </select>
                      {fieldErrors.nationality && (
                        <p className="mt-1.5 text-xs text-red-600 font-bold flex items-center gap-1">
                          <span>⚠️</span> {fieldErrors.nationality}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="tailor-phone" className="block mb-2 font-semibold text-body-sm text-obsidian-700">
                        {t('tailor.phone', 'Phone Number (WhatsApp preferred) *')}
                      </label>
                      <input
                        id="tailor-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          clearFieldError('phone');
                        }}
                        placeholder={t('tailor.phonePlaceholder', 'Example: 00201xxxxxxxxx')}
                        aria-invalid={Boolean(fieldErrors.phone)}
                        className={`w-full p-4 bg-white border rounded-xl outline-none transition-all text-obsidian-900 ${
                          fieldErrors.phone
                            ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/10'
                            : 'border-obsidian-900/10 focus:border-gold-500 focus:shadow-[0_0_12px_rgba(245,166,35,0.15)]'
                        }`}
                      />
                      {fieldErrors.phone && (
                        <p className="mt-1.5 text-xs text-red-600 font-bold flex items-center gap-1">
                          <span>⚠️</span> {fieldErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="tailor-date" className="block mb-2 font-semibold text-body-sm text-obsidian-700">
                        {t('tailor.travelDate', 'Expected Travel Date *')}
                      </label>
                      <input
                        id="tailor-date"
                        type="date"
                        value={travelDate}
                        min={todayStr}
                        onChange={handleDateChange}
                        aria-invalid={Boolean(fieldErrors.travelDate || dateError)}
                        className={`w-full p-4 bg-white border rounded-xl outline-none transition-all text-obsidian-900 cursor-pointer ${
                          fieldErrors.travelDate || dateError
                            ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/10'
                            : 'border-obsidian-900/10 focus:border-gold-500 focus:shadow-[0_0_12px_rgba(245,166,35,0.15)]'
                        }`}
                      />
                      {(fieldErrors.travelDate || dateError) && (
                        <p className="mt-1.5 text-xs text-red-600 font-bold flex items-center gap-1">
                          <span>⚠️</span> {fieldErrors.travelDate || t('tailor.errorPastDate', 'تاريخ السفر يجب أن يكون في المستقبل')}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="tailor-budget" className="block mb-2 font-semibold text-body-sm text-obsidian-700">
                        {t('tailor.budget', 'Approximate Budget Per Person *')}
                      </label>
                      <select
                        id="tailor-budget"
                        value={budget}
                        onChange={(e) => {
                          setBudget(e.target.value);
                          clearFieldError('budget');
                        }}
                        aria-invalid={Boolean(fieldErrors.budget)}
                        className={`w-full p-4 bg-white border rounded-xl outline-none transition-all text-obsidian-900 cursor-pointer ${
                          fieldErrors.budget
                            ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/10'
                            : 'border-obsidian-900/10 focus:border-gold-500 focus:shadow-[0_0_12px_rgba(245,166,35,0.15)]'
                        }`}
                      >
                        <option value="">{t('tailor.selectBudget', 'Select expected budget...')}</option>
                        <option value="1000-2000">{t('tailor.budgetOption1', '$1000 to $2000')}</option>
                        <option value="2000-3000">{t('tailor.budgetOption2', '$2000 to $3000')}</option>
                        <option value="3000+">{t('tailor.budgetOption3', '$3000 or more')}</option>
                      </select>
                      {fieldErrors.budget && (
                        <p className="mt-1.5 text-xs text-red-600 font-bold flex items-center gap-1">
                          <span>⚠️</span> {fieldErrors.budget}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Travelers Counts */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label htmlFor="tailor-adults" className="block mb-2 font-semibold text-body-sm text-obsidian-700">
                        {t('tailor.adults', 'Adults (+12 years)')}
                      </label>
                      <input
                        id="tailor-adults"
                        type="number"
                        min="1"
                        value={adults}
                        onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full p-4 bg-white border border-obsidian-900/10 rounded-xl focus:border-gold-500 focus:shadow-[0_0_12px_rgba(245,166,35,0.15)] outline-none transition-all text-obsidian-900"
                      />
                    </div>
                    <div>
                      <label htmlFor="tailor-children" className="block mb-2 font-semibold text-body-sm text-obsidian-700">
                        {t('tailor.children', 'Children (2 - 11 years)')}
                      </label>
                      <input
                        id="tailor-children"
                        type="number"
                        min="0"
                        value={children}
                        onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full p-4 bg-white border border-obsidian-900/10 rounded-xl focus:border-gold-500 focus:shadow-[0_0_12px_rgba(245,166,35,0.15)] outline-none transition-all text-obsidian-900"
                      />
                    </div>
                    <div>
                      <label htmlFor="tailor-infants" className="block mb-2 font-semibold text-body-sm text-obsidian-700">
                        {t('tailor.infants', 'Infants (under 2 years)')}
                      </label>
                      <input
                        id="tailor-infants"
                        type="number"
                        min="0"
                        value={infants}
                        onChange={(e) => setInfants(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full p-4 bg-white border border-obsidian-900/10 rounded-xl focus:border-gold-500 focus:shadow-[0_0_12px_rgba(245,166,35,0.15)] outline-none transition-all text-obsidian-900"
                      />
                    </div>
                  </div>

                  {/* Reactive Dynamic Names */}
                  {totalPassengers > 0 && (
                    <div className="mb-6">
                      <span className="block mb-3 font-semibold text-body-md text-obsidian-700">
                        {t('tailor.passengerSection', 'Names of travelers and companions:')}
                      </span>
                      <div className="p-6 bg-obsidian-50/50 rounded-xl border border-dashed border-obsidian-900/20">
                        {/* Render Adults */}
                        {Array.from({ length: adults }).map((_, i) => {
                          const index = i;
                          return (
                            <div key={`adult-${i}`} className="mb-3">
                              <label htmlFor={`tailor-passenger-adult-${i}`} className="sr-only">
                                {t('tailor.passengerAdultPlaceholder', 'Adult {{index}} Name *').replace('{{index}}', i + 1)}
                              </label>
                              <input
                                id={`tailor-passenger-adult-${i}`}
                                type="text"
                                required
                                value={passengerNames[index] || ''}
                                onChange={(e) => handlePassengerNameChange(index, e.target.value)}
                                placeholder={t('tailor.passengerAdultPlaceholder', 'Adult {{index}} Name *').replace('{{index}}', i + 1)}
                                className="w-full p-4 bg-white border border-obsidian-900/10 rounded-xl focus:border-gold-500 outline-none transition-all text-obsidian-900"
                              />
                            </div>
                          );
                        })}

                        {/* Render Children */}
                        {Array.from({ length: children }).map((_, i) => {
                          const index = adults + i;
                          return (
                            <div key={`child-${i}`} className="mb-3">
                              <label htmlFor={`tailor-passenger-child-${i}`} className="sr-only">
                                {t('tailor.passengerChildPlaceholder', 'Child {{index}} Name *').replace('{{index}}', i + 1)}
                              </label>
                              <input
                                id={`tailor-passenger-child-${i}`}
                                type="text"
                                required
                                value={passengerNames[index] || ''}
                                onChange={(e) => handlePassengerNameChange(index, e.target.value)}
                                placeholder={t('tailor.passengerChildPlaceholder', 'Child {{index}} Name *').replace('{{index}}', i + 1)}
                                className="w-full p-4 bg-white border border-obsidian-900/10 rounded-xl focus:border-gold-500 outline-none transition-all text-obsidian-900"
                              />
                            </div>
                          );
                        })}

                        {/* Render Infants */}
                        {Array.from({ length: infants }).map((_, i) => {
                          const index = adults + children + i;
                          return (
                            <div key={`infant-${i}`} className="mb-3">
                              <label htmlFor={`tailor-passenger-infant-${i}`} className="sr-only">
                                {t('tailor.passengerInfantPlaceholder', 'Infant {{index}} Name *').replace('{{index}}', i + 1)}
                              </label>
                              <input
                                id={`tailor-passenger-infant-${i}`}
                                type="text"
                                required
                                value={passengerNames[index] || ''}
                                onChange={(e) => handlePassengerNameChange(index, e.target.value)}
                                placeholder={t('tailor.passengerInfantPlaceholder', 'Infant {{index}} Name *').replace('{{index}}', i + 1)}
                                className="w-full p-4 bg-white border border-obsidian-900/10 rounded-xl focus:border-gold-500 outline-none transition-all text-obsidian-900"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Partner / Secret Contract Code Section */}
                  <div className="mb-6 p-5 bg-gradient-to-r from-obsidian-900/5 via-gold-500/5 to-obsidian-900/5 border border-gold-500/20 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="tailor-partner-code" className="font-semibold text-body-sm text-obsidian-800 flex items-center gap-2">
                        <span className="text-gold-500 text-base">🏷️</span>
                        {t('tailor.partnerCodeLabel', 'Contracted Partner / Secret Referral Code (8 Digits - Optional)')}
                      </label>
                      {partnerVerificationState === 'verifying' && (
                        <span className="text-xs text-gold-600 dark:text-gold-400 flex items-center gap-1.5 animate-pulse font-mono font-medium">
                          <span className="w-2 h-2 rounded-full bg-gold-500 animate-ping inline-block" />
                          {t('tailor.verifyingPartner', 'Verifying partner code...')}
                        </span>
                      )}
                      {partnerVerificationState === 'verified' && (
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          ✓ {t('tailor.verifiedPartnerBadge', 'Contracted Partner')}
                        </span>
                      )}
                      {partnerVerificationState === 'unverified' && (
                        <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                          ✕ {t('tailor.unverifiedPartnerBadge', 'كود غير مسجل')}
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <input
                        id="tailor-partner-code"
                        type="text"
                        value={partnerCode}
                        onChange={handlePartnerCodeChange}
                        maxLength={8}
                        inputMode="numeric"
                        placeholder="••••••••"
                        className={`w-full p-4 bg-white border rounded-xl tracking-widest font-mono text-base outline-none transition-all ${
                          partnerVerificationState === 'verified'
                            ? '!border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.18)] bg-emerald-50/20'
                            : partnerVerificationState === 'unverified'
                              ? '!border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)] bg-amber-50/20'
                              : 'border-obsidian-900/10 focus:border-gold-500 focus:shadow-[0_0_12px_rgba(245,166,35,0.15)]'
                        }`}
                      />
                      {partnerVerificationState === 'verifying' && (
                        <div className="absolute end-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      {partnerVerificationState === 'verified' && (
                        <div className="absolute end-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600 font-bold text-lg">
                          ✓
                        </div>
                      )}
                      {partnerVerificationState === 'unverified' && (
                        <div className="absolute end-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-600 font-bold text-base">
                          ✕
                        </div>
                      )}
                    </div>

                    {/* Verified Partner Card */}
                    {partnerVerificationState === 'verified' && verifiedPartnerCompany && (
                      <div className="mt-3 p-3.5 bg-gradient-to-r from-emerald-500/10 via-white to-gold-500/10 border border-emerald-500/30 rounded-xl shadow-xs">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <span className="text-emerald-600 font-bold text-base leading-none mt-0.5">✓</span>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-obsidian-900 text-sm">
                                  {verifiedPartnerCompany.name}
                                </span>
                                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-gold-500/20 text-gold-700 border border-gold-500/40 rounded">
                                  {verifiedPartnerCompany.tier || 'PLATINUM'} TIER
                                </span>
                              </div>
                              <p className="text-xs text-obsidian-600 mt-1">
                                {t('tailor.verifiedPartnerDesc', 'Request will be linked to contracted agency VIP desk')} • <span className="font-mono text-gold-600 font-bold">{verifiedPartnerCompany.referenceCode}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Unverified Partner Note */}
                    {partnerVerificationState === 'unverified' && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-400/40 rounded-xl text-xs text-amber-900">
                        <div className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold text-base leading-none">ℹ️</span>
                          <div>
                            <span className="font-semibold block mb-0.5">
                              {t('tailor.unverifiedPartnerTitle', 'Unregistered Partner Code')}
                            </span>
                            <p className="text-obsidian-600 text-[11.5px] leading-relaxed">
                              {partnerVerificationError || t('tailor.unverifiedPartnerDesc', 'This code was not found in active partner contracts. You can still submit your inquiry normally, and our travel designers will assist you.')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Special Requests */}
                  <div className="mb-8">
                    <label htmlFor="tailor-requests" className="block mb-2 font-semibold text-body-sm text-obsidian-700">
                      {t('tailor.specialRequests', 'Special details or requests')}
                    </label>
                    <textarea
                      id="tailor-requests"
                      rows="3"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder={t('tailor.specialRequestsPlaceholder', 'Any additional details...')}
                      className="w-full p-4 bg-white border border-obsidian-900/10 rounded-xl focus:border-gold-500 focus:shadow-[0_0_12px_rgba(245,166,35,0.15)] outline-none transition-all text-obsidian-900 resize-none"
                    />
                  </div>

                  {/* Buttons Navigation */}
                  <div className="flex justify-between items-center pt-6 border-t border-obsidian-900/10 relative">
                    <button
                      type="button"
                      onClick={handleBackStep}
                      className="px-6 py-3 border border-obsidian-900/20 text-obsidian-700 font-medium rounded-full hover:bg-obsidian-900/5 transition-all"
                    >
                      {t('tailor.back', 'Back')}
                    </button>
                    <div className="submit-wrapper">
                      <button type="submit" className="btn-3d-glow" disabled={isSubmitting}>
                        {isSubmitting ? t('tailor.submitting', 'Sending...') : t('tailor.submit', 'Send Inquiry Now!')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Social Footer */}
          <div className="mt-12 p-6 rounded-2xl bg-white border border-obsidian-900/10 shadow-sm text-center">
            <p className="text-sm font-bold text-obsidian-800 mb-4">
              {t('tailor.socialFooterDesc', 'Need immediate assistance? Contact us via one of the following channels:')}
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href="https://wa.me/201004146843"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 text-xs font-bold transition-all shadow-xs hover:scale-105"
              >
                <FaWhatsapp size={16} />
                <span>WhatsApp</span>
              </a>
              <a
                href="tel:+20233746643"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-500/30 text-xs font-bold transition-all shadow-xs hover:scale-105"
              >
                <FaPhone size={14} />
                <span>+20 2 33746643</span>
              </a>
              <a
                href="https://www.facebook.com/share/1BnRWtoUdo/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border border-blue-500/30 text-xs font-bold transition-all shadow-xs hover:scale-105"
              >
                <FaFacebookF size={14} />
                <span>Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/dunas_travel?igsh=bWkyb2FhY2hoNnNo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 border border-pink-500/30 text-xs font-bold transition-all shadow-xs hover:scale-105"
              >
                <FaInstagram size={14} />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TailorTour;
