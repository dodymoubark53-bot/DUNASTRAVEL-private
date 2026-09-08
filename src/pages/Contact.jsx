import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPhone, 
  FaWhatsapp, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaShieldAlt, 
  FaUserTie, 
  FaCopy, 
  FaCheck, 
  FaGlobe, 
  FaStar, 
  FaPaperPlane,
  FaChevronDown,
  FaQuestionCircle
} from 'react-icons/fa';
import { staggerContainer, fadeInUp } from '../animations/variants';
import Button from '../components/ui/Button';
import ContactForms from '../components/contact/ContactForms';
import { useToast } from '../context/ToastContext';
import FormFeedback from '../components/ui/FormFeedback';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('bespoke');
  const [activeFaq, setActiveFaq] = useState(null);

  // High-Precision Live Clocks (Egypt 🇪🇬, Spain 🇪🇸, Portugal 🇵🇹)
  const [clocks, setClocks] = useState({
    cairo: { time: '', date: '', status: 'open' },
    spain: { time: '', date: '', status: 'open' },
    portugal: { time: '', date: '', status: 'open' }
  });

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const formatTZ = (timeZone) => {
        const time = now.toLocaleTimeString('en-US', {
          timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        const date = now.toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
          timeZone,
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
        return { time, date };
      };

      setClocks({
        cairo: formatTZ('Africa/Cairo'),
        spain: formatTZ('Europe/Madrid'),
        portugal: formatTZ('Europe/Lisbon')
      });
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [i18n.language]);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(key);
    toast?.success?.(`${text} ${t('contact.copied', 'Copied to clipboard!')}`);
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  const subjects = [
    { id: 'bespoke', label: t('contact.subjBespoke', 'برنامج رحلة مخصص') },
    { id: 'nile', label: t('contact.subjNile', 'مصر والكروز النيلي') },
    { id: 'multi', label: t('contact.subjMulti', 'برنامج متعدد الدول') },
    { id: 'b2b', label: t('contact.subjB2b', 'شراكة وكالات السفر (B2B)') }
  ];

  const faqs = [
    {
      id: 1,
      q: t('contact.faq1Q', 'كم يستغرق رد مستشار السفر على استفساري؟'),
      a: t('contact.faq1A', 'نضمن الرد الفوري عبر محادثة الواتساب المباشرة على مدار 24 ساعة، أو خلال أقل من 15 دقيقة عبر البريد الإلكتروني والنماذج الرسمية.')
    },
    {
      id: 2,
      q: t('contact.faq2Q', 'هل يمكن تصميم وتنسيق رحلات تجمع بين أكثر من دولة؟'),
      a: t('contact.faq2A', 'بالتأكيد، تمتاز Dunas Travel بالخبرة العالية في تنظيم البرامج المشتركة مثل (مصر والأردن)، (مصر والإمارات)، و(التركيا واليونان) شاملة الطيران والإقامة والتنقلات الخاصة.')
    },
    {
      id: 3,
      q: t('contact.faq3Q', 'هل توجد خدمات مخصصة لشركات ووكالات السفر العالمية (B2B)؟'),
      a: t('contact.faq3A', 'نعم، نوفر بوابات مخصصة لشركات السفر المعتمدة برقم ترخيص وزاري 1882، مع عروض أسعار تنافسية ونظام كونسيرج خاص بالوكلاء.')
    }
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-ivory-50 min-h-screen selection:bg-gold-500 selection:text-obsidian-950 transition-colors duration-300">
      <Helmet>
        <title>{t('contact.title', 'Contact Us | Dunas Travel Luxury Concierge')}</title>
        <meta name="description" content={t('contact.seoDesc', 'Get in touch with our luxury travel concierges to start crafting your bespoke journey to Egypt, Jordan, and Turkey.')} />
      </Helmet>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH DYNAMIC PARALLAX & HIGH-VISIBILITY WORLD CLOCKS */}
      {/* ========================================================================= */}
      <section className="relative min-h-[70vh] md:min-h-[78vh] pt-36 pb-24 flex items-center justify-center overflow-hidden px-4">
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://igtsservice.com/uploads/files/67995_1649936390.jpg"
            alt="Dunas Travel Concierge Contact"
            className="w-full h-full object-cover object-center scale-105 filter brightness-90 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/60 to-slate-950"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.18)_0%,transparent_70%)] pointer-events-none"></div>
        </div>

        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gold-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Status Badge */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-gold-500/40 text-gold-300 text-xs font-medium uppercase tracking-widest mb-6 shadow-2xl backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>{t('contact.statusBadge', 'VIP Travel Concierges Available Now')}</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-6xl md:text-7xl font-bold font-serif text-ivory-50 tracking-wide drop-shadow-2xl leading-tight"
          >
            {t('contact.heroTitle', 'تواصل مع خبراء السفر الفاخر')}
          </motion.h1>

          <motion.div variants={fadeInUp} className="w-24 h-1.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto my-6 rounded-full shadow-[0_0_12px_rgba(212,175,55,0.8)]" />

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-white text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal drop-shadow"
          >
            {t('contact.heroSubtitle', 'نحن هنا لتصميم أدق تفاصيل رحلتك المخصصة لمصر والشرق الأوسط، بخدمة كونسيرج على أعلى مستوى على مدار الساعة.')}
          </motion.p>

          {/* Ultra High-Visibility Live World Clocks (Egypt 🇪🇬, Spain 🇪🇸, Portugal 🇵🇹) */}
          <motion.div 
            variants={fadeInUp}
            className="mt-12 max-w-4xl mx-auto"
          >
            {/* Clocks Header Tag */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/90 border border-gold-500/50 text-gold-300 text-xs sm:text-sm font-bold tracking-wider uppercase mb-5 shadow-xl backdrop-blur-xl">
              <FaClock className="text-gold-400 text-base" />
              <span>{t('contact.worldClocksHeader', 'التوقيت المحلي الحي لمكاتبنا الدولية')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {/* Egypt Clock Card */}
              <div className="relative bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-2 border-gold-500/60 rounded-3xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl hover:border-gold-400 hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-between group overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-400 to-black"></div>
                <div className="flex items-center justify-between w-full mb-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl filter drop-shadow">🇪🇬</span>
                    <div className="text-right">
                      <h4 className="font-extrabold text-base text-gold-300 tracking-wide">{t('contact.clockEgypt', 'مصر')}</h4>
                      <p className="text-xs text-ivory-200/90 font-medium">{t('contact.cairoCity', 'القاهرة — المقر الرئيسي')}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40">UTC+3</span>
                </div>

                <div className="my-3 text-center w-full">
                  <div className="font-mono text-3xl sm:text-4xl font-black text-ivory-50 tracking-wider drop-shadow-[0_0_18px_rgba(212,175,55,0.6)]">
                    {clocks.cairo.time || '12:00:00 PM'}
                  </div>
                  <div className="text-xs text-gold-300/90 font-medium mt-1.5">
                    {clocks.cairo.date}
                  </div>
                </div>

                <div className="w-full mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span>{t('contact.officeOpen24', 'مقر القاهرة — خدمة 24h')}</span>
                </div>
              </div>

              {/* Spain Clock Card */}
              <div className="relative bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-2 border-gold-500/60 rounded-3xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl hover:border-gold-400 hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-between group overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-red-600 via-yellow-400 to-red-600"></div>
                <div className="flex items-center justify-between w-full mb-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl filter drop-shadow">🇪🇸</span>
                    <div className="text-right">
                      <h4 className="font-extrabold text-base text-gold-300 tracking-wide">{t('contact.clockSpain', 'إسبانيا')}</h4>
                      <p className="text-xs text-ivory-200/90 font-medium">{t('contact.madridCity', 'مدريد — فرع أوروبا')}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40">UTC+2</span>
                </div>

                <div className="my-3 text-center w-full">
                  <div className="font-mono text-3xl sm:text-4xl font-black text-ivory-50 tracking-wider drop-shadow-[0_0_18px_rgba(212,175,55,0.6)]">
                    {clocks.spain.time || '11:00:00 AM'}
                  </div>
                  <div className="text-xs text-gold-300/90 font-medium mt-1.5">
                    {clocks.spain.date}
                  </div>
                </div>

                <div className="w-full mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs font-bold text-amber-400">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                  <span>{t('contact.spainDeskActive', 'فرع مدريد — متاح الآن')}</span>
                </div>
              </div>

              {/* Portugal Clock Card */}
              <div className="relative bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-2 border-gold-500/60 rounded-3xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl hover:border-gold-400 hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-between group overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-green-600 via-red-600 to-amber-400"></div>
                <div className="flex items-center justify-between w-full mb-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl filter drop-shadow">🇵🇹</span>
                    <div className="text-right">
                      <h4 className="font-extrabold text-base text-gold-300 tracking-wide">{t('contact.clockPortugal', 'البرتغال')}</h4>
                      <p className="text-xs text-ivory-200/90 font-medium">{t('contact.lisbonCity', 'لشبونة — مكتب الاتصال')}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40">UTC+1</span>
                </div>

                <div className="my-3 text-center w-full">
                  <div className="font-mono text-3xl sm:text-4xl font-black text-ivory-50 tracking-wider drop-shadow-[0_0_18px_rgba(212,175,55,0.6)]">
                    {clocks.portugal.time || '10:00:00 AM'}
                  </div>
                  <div className="text-xs text-gold-300/90 font-medium mt-1.5">
                    {clocks.portugal.date}
                  </div>
                </div>

                <div className="w-full mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span>{t('contact.portugalDeskActive', 'مكتب لشبونة — متاح الآن')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DIRECT CONTACT CHANNELS CARDS (QUICK CONNECT) */}
      {/* ========================================================================= */}
      <section className="container mx-auto px-4 sm:px-6 -mt-10 relative z-30 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* WhatsApp Direct */}
          <motion.a
            href="https://wa.me/201149401111"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative bg-white dark:bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500 p-6 rounded-2xl shadow-lg dark:shadow-2xl backdrop-blur-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-2xl mb-4 group-hover:scale-110 transition-transform">
                <FaWhatsapp />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{t('contact.whatsappTitle', 'واتساب الكونسيرج')}</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-ivory-50 mt-1 mb-2">+20 114 940 1111</h3>
              <p className="text-xs text-slate-900 dark:text-ivory-300/80 font-medium">{t('contact.whatsappDesc', 'متاح على مدار 24 ساعة للمحادثات المباشرة والاستفسارات السريعة.')}</p>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>{t('contact.chatNow', 'محادثة فورية الان')}</span>
              <span className="text-base">→</span>
            </div>
          </motion.a>

          {/* Direct Phone Call */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative bg-white dark:bg-slate-900/90 border border-gold-500/30 hover:border-gold-500 p-6 rounded-2xl shadow-lg dark:shadow-2xl backdrop-blur-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-gold-500/10 rounded-full blur-xl group-hover:bg-gold-500/20 transition-all"></div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 dark:bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-600 dark:text-gold-400 text-xl mb-4 group-hover:scale-110 transition-transform">
                <FaPhone />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-600 dark:text-gold-400">{t('contact.phoneTitle', 'الاتصال المباشر')}</span>
              <div className="mt-1 flex flex-col gap-1">
                <a href="tel:+20233746643" className="text-lg font-bold text-slate-900 dark:text-ivory-50 hover:text-gold-600 dark:hover:text-gold-300 transition-colors font-mono">02 33746643</a>
                <a href="tel:+20233746654" className="text-lg font-bold text-slate-900 dark:text-ivory-50 hover:text-gold-600 dark:hover:text-gold-300 transition-colors font-mono">02 33746654</a>
              </div>
              <p className="text-xs text-slate-900 dark:text-ivory-300/80 font-medium mt-2">{t('contact.phoneDesc', 'خطوط هاتفية مباشرة لمكتب القاهرة وممثلي خدمة العملاء.')}</p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <a href="tel:+20233746643" className="text-xs font-bold text-gold-600 dark:text-gold-400 hover:underline">{t('contact.callNow', 'اتصل الآن')}</a>
            </div>
          </motion.div>

          {/* Official Email */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative bg-white dark:bg-slate-900/90 border border-blue-500/30 hover:border-blue-500 p-6 rounded-2xl shadow-lg dark:shadow-2xl backdrop-blur-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all"></div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl mb-4 group-hover:scale-110 transition-transform">
                <FaEnvelope />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">{t('contact.emailTitle', 'البريد الإلكتروني الرسمى')}</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-ivory-50 mt-1 truncate">info@dunas-travel.com</h3>
              <p className="text-xs text-slate-900 dark:text-ivory-300/80 font-medium mt-2">{t('contact.emailDesc', 'استجابة سريعة للطلبات والحجوزات الرسمية خلال أقل من ساعة.')}</p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button 
                onClick={() => copyToClipboard('info@dunas-travel.com', 'info')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {copiedEmail === 'info' ? <FaCheck className="text-emerald-500" /> : <FaCopy />}
                <span>{copiedEmail === 'info' ? t('contact.copied', 'تم النسخ') : t('contact.copyEmail', 'نسخ الإيميل')}</span>
              </button>
            </div>
          </motion.div>

          {/* Headquarters Location */}
          <motion.a
            href="https://maps.app.goo.gl/oA84mQGwUsHWo4kt8"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative bg-white dark:bg-slate-900/90 border border-purple-500/30 hover:border-purple-500 p-6 rounded-2xl shadow-lg dark:shadow-2xl backdrop-blur-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all"></div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xl mb-4 group-hover:scale-110 transition-transform">
                <FaMapMarkerAlt />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">{t('contact.addressTitle', 'المقر الرئيسي')}</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-ivory-50 mt-1 leading-snug">{t('contact.addressFull', '5 شارع حسين سعيد، حدائق الأهرام القديمة - الجيزة، مصر')}</h3>
              <p className="text-xs text-slate-900 dark:text-ivory-300/80 font-medium mt-2">{t('contact.addressDesc', 'نستقبل العملاء والشركاء في مقر الشركة الرسمي بالجيزة.')}</p>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>📍 {t('contact.viewMaps', 'فتح خريطة جوجل')}</span>
            </div>
          </motion.a>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BESPOKE ITINERARY BUILDER & FORM TABS */}
      {/* ========================================================================= */}
      <section className="relative z-20">
        <ContactForms />
      </section>

      {/* ========================================================================= */}
      {/* 4. MAIN FORM & INTERACTIVE MAP SECTION */}
      {/* ========================================================================= */}
      <section className="container mx-auto px-4 sm:px-6 py-20 relative z-20">
        
        {/* Section Heading */}
        <div className="text-center mb-14">
          <span className="text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-[4px] block mb-2">
            ✨ {t('contact.sectionBadge', 'DIRECT CONCIERGE DESK')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-ivory-50">
            {t('contact.getInTouch', 'تواصل معنا مباشرة')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4 rounded-full" />
        </div>

        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-3xl border-2 border-gold-500/50 shadow-2xl shadow-black/70 overflow-hidden flex flex-col lg:flex-row backdrop-blur-2xl">

          {/* Left Side: Headquarters Details & Embedded Interactive Google Map */}
          <div className="lg:w-1/2 p-8 sm:p-12 bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-950 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gold-500/25">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-300 text-xs font-bold mb-6">
                <FaGlobe />
                <span>{t('contact.hqLabel', 'Headquarters & Global Concierge')}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-50 mb-6">
                {t('contact.officeHeader', 'مقر الشركة والمعلومات الرسمية')}
              </h3>

              <div className="space-y-6 mb-8 text-sm text-ivory-200/90">
                
                {/* Address Row */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/80 border border-gold-500/25 hover:border-gold-400 transition-all shadow-md">
                  <div className="p-3 rounded-xl bg-gold-500/15 text-gold-300 text-lg flex-shrink-0">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-gold-300 font-bold mb-1">{t('contact.office', 'العنوان الرسمي')}</h4>
                    <p className="leading-relaxed text-slate-900 dark:text-ivory-100 font-semibold">
                      {t('contact.addressDetails', '5 Hussein Said St, Old Hadayk El Ahram First floor Flat 102 – 103, Haram - Giza – Egypt')}
                    </p>
                  </div>
                </div>

                {/* Phones Row */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/80 border border-gold-500/25 hover:border-gold-400 transition-all shadow-md">
                  <div className="p-3 rounded-xl bg-gold-500/15 text-gold-300 text-lg flex-shrink-0">
                    <FaPhone />
                  </div>
                  <div className="w-full">
                    <h4 className="text-xs uppercase tracking-wider text-gold-300 font-bold mb-1">{t('contact.phoneLabel', 'الهواتف المباشرة')}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      <a href="tel:+20233746643" className="flex items-center gap-2 hover:text-gold-300 font-mono text-sm bg-slate-950/80 text-ivory-50 px-3 py-1.5 rounded-lg border border-gold-500/20">
                        <FaPhone className="text-gold-400 text-xs" /> 02 33746643
                      </a>
                      <a href="tel:+20233746654" className="flex items-center gap-2 hover:text-gold-300 font-mono text-sm bg-slate-950/80 text-ivory-50 px-3 py-1.5 rounded-lg border border-gold-500/20">
                        <FaPhone className="text-gold-400 text-xs" /> 02 33746654
                      </a>
                    </div>
                    <a href="https://wa.me/201149401111" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center justify-center gap-2 hover:text-emerald-300 font-mono text-sm bg-emerald-950/50 text-emerald-300 px-3 py-2 rounded-lg border border-emerald-500/30 w-full transition-all">
                      <FaWhatsapp className="text-emerald-400 text-sm" /> WhatsApp VIP: +20 114 940 1111
                    </a>
                  </div>
                </div>

                {/* Emails Row */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/80 border border-gold-500/25 hover:border-gold-400 transition-all shadow-md">
                  <div className="p-3 rounded-xl bg-gold-500/15 text-gold-300 text-lg flex-shrink-0">
                    <FaEnvelope />
                  </div>
                  <div className="w-full">
                    <h4 className="text-xs uppercase tracking-wider text-gold-300 font-bold mb-1">{t('contact.emailLabel', 'عناوين البريد الإلكتروني')}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {['info@dunas-travel.com', 'booking@dunas-travel.com', 'Spain@dunas-travel.com', 'attia@dunas-travel.com'].map((email) => (
                        <button
                          key={email}
                          onClick={() => copyToClipboard(email, email)}
                          className="flex items-center justify-between text-xs hover:text-gold-300 bg-slate-950/80 text-ivory-50 px-3 py-2 rounded-lg border border-gold-500/20 font-mono truncate transition-all group"
                          title="Click to copy email"
                        >
                          <span className="truncate">{email}</span>
                          {copiedEmail === email ? <FaCheck className="text-emerald-500 flex-shrink-0 ml-1" /> : <FaCopy className="text-gold-400 opacity-60 group-hover:opacity-100 flex-shrink-0 ml-1" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Embedded Google Map */}
            <a
              href="https://maps.app.goo.gl/oA84mQGwUsHWo4kt8"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-[240px] rounded-2xl overflow-hidden border border-gold-500/40 shadow-xl relative group cursor-pointer mt-4"
              title={t('contact.openMaps', 'Open location in Google Maps')}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.026723223011!2d31.2052!3d30.0076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAwJzI3LjQiTiAzMcKwMTInMTg3LjJF!5e0!3m2!1sen!2seg!4v1680000000000"
                width="100%"
                height="100%"
                style={{ border: 0, pointerEvents: 'none' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-all duration-300 flex items-center justify-center">
                <span className="bg-slate-900/95 backdrop-blur-md text-gold-300 font-bold px-5 py-2.5 rounded-full border border-gold-500/60 text-xs shadow-2xl group-hover:scale-105 transition-all flex items-center gap-2">
                  <span>📍</span>
                  <span>{t('contact.openGoogleMaps', 'فتح الموقع على خرائط جوجل مباشرة')}</span>
                </span>
              </div>
            </a>
          </div>

          {/* Right Side: Message Form (Header Colors Palette) */}
          <div className="lg:w-1/2 p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br from-[#090D1F] via-[#05081A] to-[#0F162E]">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-300 text-xs font-bold mb-6">
                <FaPaperPlane />
                <span>{t('contact.quickInquiry', 'Instant Concierge Inquiry')}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-50 mb-2">
                {t('contact.sendMessage', 'أرسل رسالتك مباشرة')}
              </h3>
              <p className="text-sm text-ivory-200/90 mb-6 font-normal leading-relaxed">
                {t('contact.formDesc', 'يسعدنا الإجابة على جميع تساؤلاتك وتصميم برنامج رحلتك بما يتناسب مع رغباتك.')}
              </p>

              {/* Subject Choice Chips */}
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-wider text-gold-300 font-bold mb-2">{t('contact.selectSubjectLabel', 'نوع الاستفسار والرحلة')}</label>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subj) => (
                    <button
                      key={subj.id}
                      type="button"
                      onClick={() => setSelectedSubject(subj.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedSubject === subj.id
                          ? 'bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-obsidian-950 shadow-md shadow-gold-500/30 font-black'
                          : 'bg-slate-100 dark:bg-slate-900/90 border border-gold-500/30 text-slate-900 dark:text-gold-200 hover:border-gold-400 hover:text-gold-600 dark:hover:text-gold-300'
                      }`}
                    >
                      {subj.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {feedback && (
                <div className="mb-6">
                  <FormFeedback type={feedback.type} message={feedback.message} />
                </div>
              )}

              <form className="flex flex-col gap-5" onSubmit={async (e) => {
                e.preventDefault();
                setFeedback(null);
                setIsSubmitting(true);
                const form = e.target;
                const firstName = form.firstName.value;
                const lastName = form.lastName.value;
                const email = form.email.value;
                const phone = form.phone.value;
                const message = form.message.value;
                const subjectText = subjects.find(s => s.id === selectedSubject)?.label || 'General Inquiry';
                
                try {
                  const { default: api } = await import('../utils/api');
                  const payload = {
                    firstName,
                    lastName,
                    email,
                    phone: phone || undefined,
                    subject: `[${subjectText}] Contact Form Submission`,
                    message: message.length >= 10 ? message : `${message} (Inquiry)`,
                    locale: String(i18n.language || 'en').toLowerCase().split('-')[0],
                  };
                  await api.post('/contact', payload);
                  const successMsg = t('contact.success', 'تم إرسال رسالتك بنجاح. سيتواصل معك مستشار السفر الخاص بنا في أقرب وقت.');
                  setFeedback({ type: 'success', message: successMsg });
                  toast?.success?.(successMsg, { title: t('contact.successTitle', 'تم استلام الرسالة') });
                  form.reset();
                } catch (err) {
                  console.error(err);
                  const errorMsg = t('contact.error', 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى أو التواصل عبر واتساب.');
                  setFeedback({ type: 'error', message: errorMsg });
                  toast?.error?.(errorMsg, { title: t('contact.errorTitle', 'فشل الإرسال') });
                } finally {
                  setIsSubmitting(false);
                }
              }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-300 font-bold mb-1.5">{t('contact.firstNameLabel', 'الاسم الأول *')}</label>
                    <input 
                      name="firstName" 
                      type="text" 
                      placeholder={t('contact.firstName', 'أدخل الاسم الأول')} 
                      required 
                      className="w-full p-4 bg-slate-950/90 border border-gold-500/35 rounded-xl text-ivory-50 placeholder-ivory-300/40 focus:border-gold-400 focus:ring-2 focus:ring-gold-500/30 outline-none transition-all text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-300 font-bold mb-1.5">{t('contact.lastNameLabel', 'اسم العائلة *')}</label>
                    <input 
                      name="lastName" 
                      type="text" 
                      placeholder={t('contact.lastName', 'أدخل اسم العائلة')} 
                      required 
                      className="w-full p-4 bg-slate-950/90 border border-gold-500/35 rounded-xl text-ivory-50 placeholder-ivory-300/40 focus:border-gold-400 focus:ring-2 focus:ring-gold-500/30 outline-none transition-all text-sm" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-300 font-bold mb-1.5">{t('contact.emailFieldLabel', 'البريد الإلكتروني *')}</label>
                    <input 
                      name="email" 
                      type="email" 
                      placeholder={t('contact.emailPlaceholder', 'name@example.com')} 
                      required 
                      className="w-full p-4 bg-slate-950/90 border border-gold-500/35 rounded-xl text-ivory-50 placeholder-ivory-300/40 focus:border-gold-400 focus:ring-2 focus:ring-gold-500/30 outline-none transition-all text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-300 font-bold mb-1.5">{t('contact.phoneFieldLabel', 'رقم الهاتف / الواتساب')}</label>
                    <input 
                      name="phone" 
                      type="tel" 
                      placeholder={t('contact.phonePlaceholder', '+20 1xx xxx xxxx')} 
                      className="w-full p-4 bg-slate-950/90 border border-gold-500/35 rounded-xl text-ivory-50 placeholder-ivory-300/40 focus:border-gold-400 focus:ring-2 focus:ring-gold-500/30 outline-none transition-all text-sm font-mono" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gold-300 font-bold mb-1.5">{t('contact.messageLabel', 'تفاصيل الاستفسار والرحلة *')}</label>
                  <textarea 
                    name="message" 
                    placeholder={t('contact.messagePlaceholder', 'كيف يمكننا مساعدتك في تخطيط رحلتك الفاخرة المخصصة؟')} 
                    rows="5" 
                    required 
                    className="w-full p-4 bg-slate-950/90 border border-gold-500/35 rounded-xl text-ivory-50 placeholder-ivory-300/40 focus:border-gold-400 focus:ring-2 focus:ring-gold-500/30 outline-none transition-all text-sm resize-none"
                  ></textarea>
                </div>

                <Button 
                  type="submit" 
                  variant="gold-glow" 
                  className="w-full py-4 rounded-xl font-black tracking-widest uppercase flex items-center justify-center gap-3 text-sm bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-obsidian-950 shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transform hover:-translate-y-0.5 transition-all" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-obsidian-950 border-t-transparent rounded-full animate-spin"></span>
                      <span>{t('common.sending', 'جاري إرسال الرسالة...')}</span>
                    </span>
                  ) : (
                    <>
                      <FaPaperPlane className="text-base" />
                      <span>{t('contact.sendBtn', 'إرسال الرسالة إلى الكونسيرج')}</span>
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Privacy Promise Notice */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gold-500/10 flex items-center gap-3 text-xs text-slate-900 dark:text-ivory-50 font-medium">
              <FaShieldAlt className="text-gold-600 dark:text-gold-400 text-lg flex-shrink-0" />
              <p>{t('contact.privacyPromise', 'نعدك بالحفاظ الكامل على خصوصية بياناتك وعدم مشاركتها مع أي طرف ثالث إطلاقاً.')}</p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE FAQ ACCORDION SECTION */}
      {/* ========================================================================= */}
      <section className="container mx-auto px-4 sm:px-6 mb-20 relative z-20">
        <div className="text-center mb-12">
          <span className="text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-[4px] block mb-2">
            ❓ {t('contact.faqBadge', 'QUICK ANSWERS')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-ivory-50">
            {t('contact.faqTitle', 'الأسئلة الأكثر شيوعاً')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4 rounded-full" />
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id}
              className="bg-white dark:bg-slate-900/80 rounded-2xl border border-gray-200 dark:border-gold-500/15 overflow-hidden shadow-sm dark:shadow-md transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                className="w-full p-6 text-start flex items-center justify-between gap-4 font-serif font-bold text-lg text-slate-900 dark:text-gold-300 hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaQuestionCircle className="text-gold-500 flex-shrink-0 text-xl" />
                  <span>{faq.q}</span>
                </div>
                <FaChevronDown className={`text-gold-500 flex-shrink-0 transition-transform duration-300 ${activeFaq === faq.id ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeFaq === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 text-sm leading-relaxed text-slate-900 dark:text-ivory-50 border-t border-gray-100 dark:border-slate-800 font-medium">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. THE DUNAS LUXURY GUARANTEE BADGES */}
      {/* ========================================================================= */}
      <section className="container mx-auto px-4 sm:px-6 pb-24 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-gold-500/15 shadow-sm dark:shadow-md text-center">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xl mx-auto flex items-center justify-center mb-3">
              <FaShieldAlt />
            </div>
            <h4 className="font-serif font-bold text-lg text-slate-900 dark:text-gold-300 mb-1">{t('contact.badge1Title', 'شركة مرخصة رسمياً')}</h4>
            <p className="text-xs text-slate-900 dark:text-ivory-50 font-medium">{t('contact.badge1Desc', 'شركة سياحية مرخصة برقم ترخيص 1882 من وزارة السياحة المصرية.')}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-gold-500/15 shadow-sm dark:shadow-md text-center">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xl mx-auto flex items-center justify-center mb-3">
              <FaUserTie />
            </div>
            <h4 className="font-serif font-bold text-lg text-slate-900 dark:text-gold-300 mb-1">{t('contact.badge2Title', 'كونسيرج فاخر خاص')}</h4>
            <p className="text-xs text-slate-900 dark:text-ivory-50 font-medium">{t('contact.badge2Desc', 'مستشار سفر مخصص يرافق خطوات رحلتك وتخطيطها لحظة بلحظة.')}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-gold-500/15 shadow-sm dark:shadow-md text-center">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xl mx-auto flex items-center justify-center mb-3">
              <FaStar />
            </div>
            <h4 className="font-serif font-bold text-lg text-slate-900 dark:text-gold-300 mb-1">{t('contact.badge3Title', 'برامج 100% مخصصة')}</h4>
            <p className="text-xs text-slate-900 dark:text-ivory-50 font-medium">{t('contact.badge3Desc', 'تجارب فاخرة وحصرية تم تصميمها وتخصيصها بالكامل حسب رغبتك.')}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-gold-500/15 shadow-sm dark:shadow-md text-center">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xl mx-auto flex items-center justify-center mb-3">
              <FaClock />
            </div>
            <h4 className="font-serif font-bold text-lg text-slate-900 dark:text-gold-300 mb-1">{t('contact.badge4Title', 'استجابة فائقة السرعة')}</h4>
            <p className="text-xs text-slate-900 dark:text-ivory-50 font-medium">{t('contact.badge4Desc', 'نضمن الرد على كافة الطلبات والاستفسارات خلال دقائق معدودة.')}</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
