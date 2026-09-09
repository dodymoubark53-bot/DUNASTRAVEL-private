import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaGlobe, FaChevronDown, FaUserCircle, FaSignOutAlt, FaBookmark, FaMoon, FaSun, FaPlane, FaEnvelope, FaPhone, FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import LoginModal from '../auth/LoginModal';
import Logo from '../ui/Logo';
import CurrencySelector from '../ui/CurrencySelector';
import CustomerNotificationBell from '../ui/CustomerNotificationBell';
import { useActiveLocales } from '../../hooks/useActiveLocales';
import { syncDocumentDirection } from '../../i18n';

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  const [mobileActiveSubDropdown, setMobileActiveSubDropdown] = useState(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { activeLanguages } = useActiveLocales();
  const isRtl = i18n.dir() === 'rtl';

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/', { replace: true });
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
    syncDocumentDirection(lng);
    setLangDropdownOpen(false);
  };

  useEffect(() => {
    mobileMenuRef.current = mobileMenuOpen;
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const isScrolled = currentScrollY > 50;
        setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));

        if (mobileMenuRef.current) {
          setHeaderVisible((prev) => (!prev ? true : prev));
        } else if (currentScrollY > 100 && currentScrollY > lastScrollYRef.current) {
          setHeaderVisible((prev) => (prev ? false : prev));
        } else {
          setHeaderVisible((prev) => (!prev ? true : prev));
        }
        lastScrollYRef.current = currentScrollY;
        tickingRef.current = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
        setMobileActiveDropdown(null);
        setMobileActiveSubDropdown(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMobileDropdownToggle = (name) => {
    setMobileActiveDropdown(mobileActiveDropdown === name ? null : name);
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.blogs'), path: '/blogs' },
    {
      name: t('nav.services'),
      dropdown: [
        {
          name: t('nav.hotelsTab', { defaultValue: 'Hotels' }),
          path: '/services/hotels',
          subItems: [
            { name: 'Sol Pyramid Hotel', path: '/services/hotels/sol-pyramid-hotel' }
          ]
        },
        { name: t('nav.transportation', { defaultValue: 'Transportation' }), path: '/transportation' },
      ]
    },
    {
      name: t('nav.destinations'),
      dropdown: [
        { name: t('nav.egypt'), path: '/destinations/egypt' },
        { name: t('nav.turkey'), path: '/destinations/turkey' },
        { name: t('nav.dubai'), path: '/destinations/dubai' },
        { name: t('nav.jordan'), path: '/destinations/jordan' },
        { name: t('nav.morocco'), path: '/destinations/morocco' },
        { name: t('nav.tunisia'), path: '/destinations/tunisia' },
        { name: t('nav.greece'), path: '/destinations/greece' },
        { name: t('nav.holyland', { defaultValue: 'Holy Land' }), path: '/destinations/holyland' },
      ]
    },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15, ease: 'easeIn' } }
  };

  const mobileDropdownVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0, overflow: 'hidden' },
    visible: { opacity: 1, height: 'auto', marginTop: 12, transition: { duration: 0.3, ease: 'easeInOut' } },
    exit: { opacity: 0, height: 0, marginTop: 0, transition: { duration: 0.2, ease: 'easeInOut' } }
  };

  return (
    <>
      {/* Top Bar */}
      <div className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`} style={{ background: 'linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%)' }}>
        {/* Subtle shine overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, #fff 50%, transparent 100%)' }} />
        {/* Gold accent border */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.5), transparent)' }} />
        <div className="w-full px-4 sm:px-6 relative">
          <div className="flex items-center justify-between h-10 sm:h-11 text-white text-[11px] sm:text-xs font-semibold">
            {/* Left: Contact Info */}
            <div className="flex items-center gap-2 sm:gap-5 overflow-hidden">
              <a href="mailto:info@dunas-travel.com" aria-label="Email us at info@dunas-travel.com" className="group flex items-center gap-1.5 hover:text-[#F5A623] transition-all duration-300 whitespace-nowrap">
                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-[#F5A623]/25 group-hover:scale-110 transition-all duration-300">
                  <FaEnvelope size={10} className="text-[#F5A623]" />
                </span>
                <span className="hidden sm:inline font-semibold tracking-wide">info@dunas-travel.com</span>
              </a>
              <span className="w-px h-4 bg-gradient-to-b from-transparent via-white/30 to-transparent hidden sm:block" />
              <a href="tel:+20233746643" aria-label="Call us at +20 2 3374 6643" className="group flex items-center gap-1.5 hover:text-[#F5A623] transition-all duration-300 whitespace-nowrap">
                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-[#F5A623]/25 group-hover:scale-110 transition-all duration-300">
                  <FaPhone size={9} className="text-[#F5A623]" />
                </span>
                <span className="hidden sm:inline font-semibold tracking-wide">02 33746643</span>
              </a>
              <span className="w-px h-4 bg-gradient-to-b from-transparent via-white/30 to-transparent hidden sm:block" />
              <a href="tel:+20233746654" aria-label="Call us at +20 2 3374 6654" className="group items-center gap-1.5 hover:text-[#F5A623] transition-all duration-300 whitespace-nowrap flex">
                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-[#F5A623]/25 group-hover:scale-110 transition-all duration-300">
                  <FaPhone size={9} className="text-[#F5A623]" />
                </span>
                <span className="hidden sm:inline font-semibold tracking-wide">02 33746654</span>
              </a>
              <span className="w-px h-4 bg-gradient-to-b from-transparent via-white/30 to-transparent hidden sm:block" />
              <a href="https://wa.me/201149401111" aria-label="Chat with us on WhatsApp" target="_blank" rel="noopener noreferrer" className="group items-center gap-1.5 hover:text-[#F5A623] transition-all duration-300 whitespace-nowrap flex">
                <span className="w-6 h-6 rounded-full bg-[#25D366]/20 flex items-center justify-center group-hover:bg-[#25D366]/35 group-hover:scale-110 transition-all duration-300">
                  <FaWhatsapp size={10} className="text-[#25D366]" />
                </span>
                <span className="hidden sm:inline font-semibold tracking-wide">+20 114 940 1111</span>
              </a>
            </div>

            {/* Right: Actions (moved from main header) */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={toggleTheme}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 hover:border-[#F5A623]/40 transition-all duration-300 hover:scale-110"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FaSun size={10} className="text-[#F5A623]" /> : <FaMoon size={10} className="text-[#F5A623]" />}
              </button>

              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    aria-label="User profile options"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 hover:border-[#F5A623]/40 transition-all duration-300 hover:scale-110"
                  >
                    <span className="font-bold text-[10px] text-[#F5A623]">{user.avatar || user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    aria-label="Sign in"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 hover:border-[#F5A623]/40 transition-all duration-300 hover:scale-110"
                  >
                    <FaUserCircle size={11} className="text-[#F5A623]" />
                  </Link>
                )}
              </div>

              {/* Customer Notifications */}
              {user && <CustomerNotificationBell />}

              {/* Currency */}
              <div className="flex">
                <CurrencySelector />
              </div>

              {/* Lang */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  aria-label="Select language"
                  className="h-7 sm:h-8 rounded-full flex items-center justify-center gap-1 px-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 hover:border-[#F5A623]/40 transition-all duration-300 hover:scale-105"
                >
                  <FaGlobe size={9} className="text-[#F5A623]" />
                  <span className="text-[9px] font-bold uppercase text-white tracking-wider">
                    {i18n.language === 'ar' ? 'ع' :
                      i18n.language === 'es' ? 'es' :
                        i18n.language === 'pt' ? 'pt' :
                          i18n.language === 'it' ? 'it' : 'en'}
                  </span>
                </button>
                <AnimatePresence>
                  {langDropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      style={{ backgroundColor: 'white' }}
                      className={`absolute top-full ${isRtl ? 'left-0' : 'right-0'} mt-1 w-36 backdrop-blur-xl border border-gray-200 rounded-xl overflow-hidden shadow-2xl z-[10000]`}
                    >
                      {activeLanguages.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`w-full ${isRtl ? 'text-right' : 'text-left'} px-3 py-2.5 flex items-center justify-between text-[13px] border-b border-gray-200 last:border-0 transition-colors ${i18n.language === lang.code ? 'text-amber-600 font-semibold bg-amber-50' : 'text-black hover:text-amber-600 hover:bg-amber-50'}`}
                        >
                          <span className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <span className="text-base">{lang.flag}</span>
                            <span>{lang.label}</span>
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`fixed top-[40px] sm:top-[44px] left-0 right-0 z-[9998] transition-all duration-300 h-16 lg:h-20 flex items-center ${headerVisible ? 'translate-y-0' : '-translate-y-full'} bg-white/95 dark:bg-obsidian-900/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]`}
      >
        <div className="container mx-auto px-6 h-full flex justify-between items-center relative z-10">
          {/* Logo */}
          <Link to="/" className="flex items-center z-50 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
            <Logo theme="dark" height={60} />
          </Link>

          {/* Desktop Nav (Hover) */}
          <nav className="hidden lg:flex items-center gap-8 flex-shrink-0">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative group"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
              >
                {link.dropdown ? (
                  <button className="flex items-center gap-1 text-obsidian-900 dark:text-ivory-50 hover:text-[#C9A227] transition-colors text-body-md font-bold py-2 whitespace-nowrap flex-shrink-0">
                    {link.name} <FaChevronDown className={`text-xs transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link to={link.path} className="text-obsidian-900 dark:text-ivory-50 hover:text-[#C9A227] transition-colors text-body-md font-bold py-2 whitespace-nowrap flex-shrink-0">
                    {link.name}
                  </Link>
                )}

                {/* Dropdown Panel Desktop */}
                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.name && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={`absolute top-full left-0 mt-2 ${link.name === t('nav.services') ? 'w-72 p-5' : 'w-56'} bg-white dark:bg-obsidian-800 border border-obsidian-200 dark:border-obsidian-700 rounded-lg overflow-hidden shadow-xl`}
                    >
                      {link.name === t('nav.services') ? (
                        <>
                          <h4 className="text-caption text-gold-600 dark:text-gold-400 uppercase tracking-widest mb-4 px-1 font-semibold">
                            {link.name}
                          </h4>
                          <div className="flex flex-col gap-1">
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.name}
                                to={item.path}
                                className="px-4 py-2.5 text-obsidian-900 dark:text-ivory-200 hover:text-[#F5A623] hover:bg-amber-50 dark:hover:bg-obsidian-700 transition-colors text-body-md rounded-lg"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        link.dropdown.map((item) => (
                          <div key={item.name} className="relative group/sub">
                            {item.subItems ? (
                              <>
                                <Link
                                  to={item.path}
                                  className="px-4 py-3 text-obsidian-900 dark:text-ivory-200 hover:text-[#F5A623] hover:bg-amber-50 dark:hover:bg-obsidian-700 transition-colors text-body-md border-b border-obsidian-100 dark:border-obsidian-700 last:border-0 flex justify-between items-center w-full"
                                >
                                  <span>{item.name}</span>
                                  <FaChevronDown className="-rotate-90 text-[10px] opacity-40 group-hover/sub:text-[#F5A623] group-hover/sub:rotate-0 transition-transform duration-200" />
                                </Link>
                                <div className={`absolute ${isRtl ? 'right-full mr-0.5' : 'left-full ml-0.5'} top-0 hidden group-hover/sub:block w-56 bg-white dark:bg-obsidian-800 border border-obsidian-200 dark:border-obsidian-700 rounded-lg overflow-hidden shadow-2xl z-[9999]`}>
                                  {item.subItems.map((sub) => (
                                    <Link
                                      key={sub.name}
                                      to={sub.path}
                                      className="block px-4 py-3 text-obsidian-900 dark:text-ivory-200 hover:text-[#F5A623] hover:bg-amber-50 dark:hover:bg-obsidian-700 transition-colors text-body-md border-b border-obsidian-100 dark:border-obsidian-700 last:border-0"
                                    >
                                      {sub.name}
                                    </Link>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <Link
                                to={item.path}
                                className="group/link block px-4 py-3 text-obsidian-900 dark:text-ivory-200 hover:text-[#F5A623] hover:bg-amber-50 dark:hover:bg-obsidian-700 transition-colors text-body-md border-b border-obsidian-100 dark:border-obsidian-700 last:border-0"
                              >
                                <span className="flex items-center gap-2">
                                  <FaPlane className="text-[10px] opacity-0 -ml-1 group-hover/link:opacity-100 group-hover/link:ml-0 transition-all duration-200 text-[#F5A623]" />
                                  {item.name}
                                </span>
                              </Link>
                            )}
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Currency Selector + Tailor a Tour (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 z-50">
            <Link
              to="/tailor-a-tour"
              className="group relative px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-500 shadow-lg hover:shadow-xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #FF6B35, rgb(6, 29, 93))',
                color: '#fff'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #e85d2a, rgb(8, 39, 125))'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #FF6B35, rgb(6, 29, 93))'}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="inline-block group-hover:animate-bounce">✈</span>
                Tailor a Tour
              </span>
              <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
          </div>

          {/* Mobile: Tailor + Hamburger */}
          <div className="lg:hidden flex items-center gap-1.5 z-50">
            <Link
              to="/tailor-a-tour"
              className="h-7 min-w-[70px] inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg whitespace-nowrap text-center"
              style={{
                background: 'linear-gradient(135deg, #FF6B35, rgb(6, 29, 93))',
                color: '#fff'
              }}
            >
              ✈ Tailor
            </Link>
            <button
              className={`relative group w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 shadow-sm z-50 select-none cursor-pointer outline-none overflow-hidden shrink-0 ${
                mobileMenuOpen
                  ? "bg-linear-to-br from-amber-500/25 via-amber-500/15 to-amber-500/30 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.65)] text-amber-500 dark:text-amber-400"
                  : "bg-white/90 dark:bg-obsidian-800/90 border-amber-500/50 text-amber-500 dark:text-amber-400 hover:border-amber-500 hover:text-amber-500 hover:shadow-[0_0_22px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {/* Ambient glow background */}
              <span className="absolute inset-0 rounded-full bg-linear-to-tr from-amber-500/20 to-amber-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm pointer-events-none" />
              {/* Ripple ping effect on press */}
              <span className="absolute inset-0 rounded-full bg-amber-500/40 opacity-0 group-active:opacity-100 group-active:animate-ping transition-all duration-150 pointer-events-none" />

              {/* 3 Horizontal Lines inside Circle */}
              <svg
                className="w-5 h-5 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line
                  x1="4" y1="6" x2="20" y2="6"
                  className={`transition-all duration-300 origin-center ${mobileMenuOpen ? "translate-y-1.5 rotate-45 stroke-amber-500" : ""}`}
                />
                <line
                  x1="4" y1="12" x2="20" y2="12"
                  className={`transition-all duration-300 ${mobileMenuOpen ? "opacity-0 scale-x-0" : ""}`}
                />
                <line
                  x1="4" y1="18" x2="20" y2="18"
                  className={`transition-all duration-300 origin-center ${mobileMenuOpen ? "-translate-y-1.5 -rotate-45 stroke-amber-500" : ""}`}
                />
              </svg>
            </button>
          </div>

        {/* Mobile Full Screen Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: isRtl ? '-100%' : '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRtl ? '-100%' : '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
              className="fixed inset-0 bg-white dark:bg-obsidian-900 z-40 flex flex-col px-8 pt-24 pb-8 overflow-y-auto lg:hidden h-screen w-screen"
            >
              <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
                {navLinks.map((link) => (
                    <div key={link.name} className="w-full border-b border-obsidian-100 dark:border-obsidian-700 pb-4 last:border-0">
                    {link.dropdown ? (
                      <>
                        <button
                          onClick={() => handleMobileDropdownToggle(link.name)}
                          className="w-full flex justify-between items-center text-left text-2xl text-obsidian-900 dark:text-ivory-50 hover:text-[#F5A623] font-semibold py-2 transition-colors"
                        >
                          <span className={mobileActiveDropdown === link.name ? 'text-[#F5A623]' : ''}>
                            {link.name}
                          </span>
                          <FaChevronDown
                            className={`text-base transition-transform duration-300 ${mobileActiveDropdown === link.name ? 'rotate-180 text-[#F5A623]' : 'text-obsidian-300'
                              }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {mobileActiveDropdown === link.name && (
                            <motion.div
                              variants={mobileDropdownVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="flex flex-col gap-1 pl-4 bg-obsidian-50/50 dark:bg-obsidian-800/50 rounded-2xl overflow-hidden mt-2 border border-obsidian-100 dark:border-obsidian-700"
                            >
                              {link.dropdown.map(item => (
                                <div key={item.name} className="w-full">
                                  {item.subItems ? (
                                    <>
                                      <div className="flex justify-between items-center text-lg text-obsidian-700 dark:text-ivory-300 py-3.5 px-4 border-b border-obsidian-100 dark:border-obsidian-700 last:border-0">
                                        <Link
                                          to={item.path}
                                          onClick={() => setMobileMenuOpen(false)}
                                          className="hover:text-[#F5A623] transition-colors flex-grow"
                                        >
                                          {item.name}
                                        </Link>
                                        <button
                                          onClick={() => setMobileActiveSubDropdown(mobileActiveSubDropdown === item.name ? null : item.name)}
                                          aria-label={`Toggle sub-menu for ${item.name}`}
                                          className="p-2 -mr-2 text-obsidian-400 dark:text-ivory-500 hover:text-[#F5A623] transition-colors"
                                        >
                                          <FaChevronDown
                                            className={`text-xs transition-transform duration-200 ${mobileActiveSubDropdown === item.name ? 'rotate-180 text-[#F5A623]' : ''}`}
                                          />
                                        </button>
                                      </div>
                                      <AnimatePresence initial={false}>
                                        {mobileActiveSubDropdown === item.name && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="pl-4 bg-obsidian-50/30 dark:bg-obsidian-800/30 border-l border-obsidian-200 dark:border-obsidian-700"
                                          >
                                            {item.subItems.map(sub => (
                                              <Link
                                                key={sub.name}
                                                to={sub.path}
                                                onClick={() => {
                                                  setMobileMenuOpen(false);
                                                  setMobileActiveSubDropdown(null);
                                                }}
                                                className="text-body-md text-obsidian-600 dark:text-ivory-400 hover:text-[#F5A623] py-3 px-4 block transition-colors border-b border-obsidian-100 dark:border-obsidian-700 last:border-0"
                                              >
                                                {sub.name}
                                              </Link>
                                            ))}
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </>
                                  ) : (
                                    <Link
                                      key={item.name}
                                      to={item.path}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="text-lg text-obsidian-700 dark:text-ivory-300 hover:text-[#F5A623] hover:bg-obsidian-50 dark:hover:bg-obsidian-800 py-3.5 px-4 block transition-all border-b border-obsidian-100 dark:border-obsidian-700 last:border-0 font-medium"
                                    >
                                      {item.name}
                                    </Link>
                                  )}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-2xl text-obsidian-900 dark:text-ivory-50 block hover:text-[#F5A623] transition-colors font-semibold py-2"
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Mobile Tailor a Tour */}
                <Link
                  to="/tailor-a-tour"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-4 px-5 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #FF6B35, rgb(6, 29, 93))', color: '#fff' }}
                >
                  ✈ {t('nav.tailorMade', 'Tailor Your Tour')}
                </Link>

                {/* Mobile Language & Theme Controls */}
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-obsidian-100 dark:border-obsidian-700">
                  <div className="flex items-center justify-between">
                    <span className="text-obsidian-400 dark:text-ivory-500 text-xs font-semibold tracking-wider uppercase">{t('nav.theme', 'Theme')}</span>
                    <button
                      onClick={toggleTheme}
                      className="w-10 h-10 rounded-full border border-obsidian-200 dark:border-obsidian-600 flex items-center justify-center bg-white dark:bg-obsidian-800 hover:bg-obsidian-50 dark:hover:bg-obsidian-700 transition-all"
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? <FaSun className="text-amber-500" size={16} /> : <FaMoon className="text-indigo-600" size={16} />}
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-obsidian-400 dark:text-ivory-500 text-xs font-semibold tracking-wider uppercase">{t('nav.language', 'Language')}</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {activeLanguages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            changeLanguage(lang.code);
                            setMobileMenuOpen(false);
                          }}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                            i18n.language === lang.code
                              ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                              : 'bg-white dark:bg-obsidian-800 text-obsidian-700 dark:text-ivory-200 border-obsidian-200 dark:border-obsidian-600 hover:border-amber-500'
                          }`}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                  {user ? (
                  <div className="flex flex-col gap-3 mt-4">
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 px-4 bg-obsidian-50 dark:bg-obsidian-800 text-obsidian-900 dark:text-ivory-50 rounded-xl text-lg font-medium flex items-center gap-3 border border-obsidian-100 dark:border-obsidian-700">
                      <FaUserCircle className="text-[#F5A623]" /> {t('nav.myProfile', 'My Profile')}
                    </Link>
                    <Link to="/bookings" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 px-4 bg-obsidian-50 dark:bg-obsidian-800 text-obsidian-900 dark:text-ivory-50 rounded-xl text-lg font-medium flex items-center gap-3 border border-obsidian-200 dark:border-obsidian-700">
                      <FaBookmark className="text-[#F5A623]" /> {t('nav.myBookings', 'My Bookings')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full py-3.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 border border-red-200 dark:border-red-800 transition-colors active:bg-red-100 dark:active:bg-red-900/50"
                    >
                      <FaSignOutAlt /> {t('nav.logout', 'Logout')}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 mt-4">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-gold-500/20 to-gold-600/20 text-gold-500 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 border border-gold-500/30 hover:bg-gold-500/30 transition-all text-center"
                    >
                      <FaUserCircle size={18} /> {t('auth.signIn', 'Sign In / Register')}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Profile Dropdown (shared between desktop & mobile) */}
        <AnimatePresence>
          {profileDropdownOpen && user && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`absolute top-full ${isRtl ? 'left-1' : 'right-1'} mt-5 w-48 bg-white dark:bg-obsidian-800 border border-obsidian-200 dark:border-obsidian-700 rounded-xl overflow-hidden shadow-xl z-[10000]`}
            >
              <div className="px-4 py-3 border-b border-obsidian-100 dark:border-obsidian-700">
                <p className="text-caption text-obsidian-900 dark:text-ivory-50 font-semibold">{user.name}</p>
                <p className="text-[10px] text-obsidian-400 dark:text-ivory-500 truncate">{user.email}</p>
              </div>
              <Link to="/dashboard" onClick={() => setProfileDropdownOpen(false)} className="w-full text-left px-4 py-3 text-obsidian-700 dark:text-ivory-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-obsidian-700 transition-colors text-body-md border-b border-obsidian-100 dark:border-obsidian-700 flex items-center gap-2">
                <FaUserCircle className="text-amber-500" size={15} /> {t('user.tabOverview', 'My Dashboard')}
              </Link>
              <Link to="/profile" onClick={() => setProfileDropdownOpen(false)} className="w-full text-left px-4 py-3 text-obsidian-700 dark:text-ivory-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-obsidian-700 transition-colors text-body-md border-b border-obsidian-100 dark:border-obsidian-700 flex items-center gap-2">
                <FaUserCircle className="text-amber-500" size={15} /> {t('nav.myProfile', 'My Profile')}
              </Link>
              <Link to="/bookings" onClick={() => setProfileDropdownOpen(false)} className="w-full text-left px-4 py-3 text-obsidian-700 dark:text-ivory-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-obsidian-700 transition-colors text-body-md border-b border-obsidian-100 dark:border-obsidian-700 flex items-center gap-2">
                <FaBookmark className="text-amber-500" size={15} /> {t('nav.myBookings', 'My Bookings')}
              </Link>
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-500 hover:text-white hover:bg-red-500 transition-colors text-body-md flex items-center gap-2">
                <FaSignOutAlt size={15} /> {t('nav.logout', 'Logout')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
    </>
  );
};

export default Navbar;
