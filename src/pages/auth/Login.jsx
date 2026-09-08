import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaFingerprint,
  FaStar,
  FaCompass,
  FaBolt,
  FaCheckCircle,
  FaArrowRight,
  FaGlobe,
  FaGoogle,
  FaApple,
  FaKey,
  FaCrown,
  FaRocket,
  FaUserTie
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { getSafeRedirectUrl } from '../../utils/safe-redirect';

// ── Interactive Starlight & Particle Canvas Component ───────────────────
const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create particles
    const particleCount = Math.min(Math.floor(width / 18), 70);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2.2 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.4 ? '#C9A227' : Math.random() > 0.5 ? '#E8C97A' : '#FFFFFF',
    }));

    // Mouse position for particle interaction
    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle gold radial gradient around cursor
      const cursorGradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 400);
      cursorGradient.addColorStop(0, 'rgba(201, 162, 39, 0.08)');
      cursorGradient.addColorStop(0.5, 'rgba(201, 162, 39, 0.02)');
      cursorGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = cursorGradient;
      ctx.fillRect(0, 0, width, height);

      // Connect particles with thin laser lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const lineAlpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = `rgba(201, 162, 39, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Update & Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.alpha += p.pulse;
        if (p.alpha > 0.8 || p.alpha < 0.2) p.pulse = -p.pulse;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#C9A227';
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// ── Destination Carousel Slides ───────────────────
const DESTINATIONS = [
  {
    title: 'Sahara Starlight Sanctuary',
    location: 'Siwa Oasis • Egypt',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    tag: 'Ultra-Luxury Eco Lodge',
    rating: '5.0 ★ VIP Choice',
  },
  {
    title: 'Pharaoh’s Golden Horizon',
    location: 'Luxor & Aswan • Royal Nile Cruise',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
    tag: 'Private Yacht Charter',
    rating: '4.9 ★ Bespoke Voyage',
  },
  {
    title: 'Red Sea Crystal Pavilion',
    location: 'El Gouna • Private Reef Suite',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    tag: 'Overwater Haven',
    rating: '5.0 ★ Exclusive Access',
  },
];

const Login = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectQuery = searchParams.get('redirect');
  const from = getSafeRedirectUrl(redirectQuery || location.state?.from?.pathname, '/dashboard');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Resend Verification State
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');
  const [showResendBtn, setShowResendBtn] = useState(false);

  // Auth Mode: 'credentials' | 'biometric'
  const [authMode, setAuthMode] = useState('credentials');
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);

  // Active Destination Slide index
  const [currentSlide, setCurrentSlide] = useState(0);

  const { login, resendVerification, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, from, navigate]);

  // Destination slide interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % DESTINATIONS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setResendSuccess('');
    setShowResendBtn(false);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('verify') || msg.toLowerCase().includes('verification')) {
        setError(t('auth.unverifiedEmailError', 'Please verify your email before logging in.'));
        setShowResendBtn(true);
      } else if (msg.toLowerCase().includes('credential') || msg.toLowerCase().includes('password') || err.status === 401) {
        setError(t('auth.invalidCredentials', 'Invalid email or password'));
      } else {
        setError(msg || t('common.errorOccurred', 'An error occurred'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    setError('');
    setResendSuccess('');
    try {
      await resendVerification(email);
      setResendSuccess(t('auth.verificationResent', 'Verification email sent! Please check your inbox.'));
    } catch (err) {
      setError(err.message || t('auth.resendFailed', 'Failed to resend verification email'));
    } finally {
      setIsResending(false);
    }
  };

  // Quick Demo Auto-Fill helper
  const handleQuickFillDemo = () => {
    setEmail('demo@dunastravel.com');
    setPassword('Demo@123456');
    setError('');
  };

  // Simulate Futuristic Biometric Passkey Login
  const handleBiometricAuth = () => {
    setBiometricScanning(true);
    setError('');
    setTimeout(() => {
      setBiometricScanning(false);
      setBiometricSuccess(true);
      setTimeout(async () => {
        // Auto fill demo & login
        setEmail('demo@dunastravel.com');
        setPassword('Demo@123456');
        try {
          await login('demo@dunastravel.com', 'Demo@123456');
          navigate(from, { replace: true });
        } catch {
          setError(t('auth.invalidCredentials', 'Invalid email or password'));
          setAuthMode('credentials');
        }
      }, 1000);
    }, 2200);
  };

  return (
    <div className="relative min-h-[100dvh] bg-[#07060A] text-white flex items-center justify-center pt-28 sm:pt-32 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8 font-body overflow-hidden selection:bg-gold-500 selection:text-black">
      <Helmet>
        <title>{t('auth.loginTitle', 'Sign In | Dunas Travel')}</title>
      </Helmet>

      {/* Futuristic Background Animation */}
      <ParticleCanvas />

      {/* Dynamic Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/6 w-72 sm:w-96 h-72 sm:h-96 bg-gold-500/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/6 w-80 sm:w-[30rem] h-80 sm:h-[30rem] bg-indigo-600/10 rounded-full blur-[120px] sm:blur-[160px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />

      {/* Cyber Grid Floor Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0a0812]/50 to-[#050408] pointer-events-none" />

      {/* Main Container Layout */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        
        {/* ── LEFT PANEL: Futuristic Destination & Brand VIP Portal (Desktop) ── */}
        <motion.div
          initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="hidden lg:flex lg:col-span-5 flex-col justify-between h-[640px] rounded-3xl p-8 relative overflow-hidden border border-gold-500/20 shadow-[0_0_80px_rgba(201,162,39,0.12)] backdrop-blur-xl group"
        >
          {/* Background Image Carousel with Smooth Fade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.35, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${DESTINATIONS[currentSlide].image})` }}
            />
          </AnimatePresence>

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09080E] via-[#09080E]/70 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,162,39,0.2),transparent_70%)]" />

          {/* Top Brand Header Badge */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-[2px] backdrop-blur-md shadow-[0_0_20px_rgba(201,162,39,0.2)]">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
              <FaCrown className="text-gold-400 animate-pulse" />
              {t('auth.vipPortal', 'DUNAS VIP WORLD PORTAL')}
            </div>

            <h2 className="text-3xl font-display font-bold text-white tracking-wide leading-tight">
              {t('auth.journeyTitle', 'Unlock The Realm of Bespoke Luxury')}
            </h2>
            <p className="text-ivory-300 text-sm leading-relaxed font-light">
              {t('auth.journeySubtitle', 'Enter your private sanctuary to manage tailored itineraries, exclusive desert sanctuaries, and royal yacht charters.')}
            </p>
          </div>

          {/* Middle Dynamic Destination Feature Spotlight */}
          <div className="relative z-10 my-auto">
            <div className="p-5 rounded-2xl bg-black/40 border border-gold-500/20 backdrop-blur-md space-y-3 relative overflow-hidden group-hover:border-gold-500/40 transition-colors">
              <div className="flex items-center justify-between text-xs text-gold-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <FaCompass className="text-gold-400 animate-bounce" /> {DESTINATIONS[currentSlide].tag}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30">
                  {DESTINATIONS[currentSlide].rating}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-white font-display">
                {DESTINATIONS[currentSlide].title}
              </h4>
              <p className="text-xs text-ivory-400 flex items-center gap-1">
                <FaGlobe className="text-gold-500/70" /> {DESTINATIONS[currentSlide].location}
              </p>

              {/* Progress Bar for Slides */}
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-3">
                <motion.div
                  key={currentSlide}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 6, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-gold-500 to-gold-300"
                />
              </div>
            </div>
          </div>

          {/* Bottom Security & Encryption Guarantee Pill */}
          <div className="relative z-10 pt-4 border-t border-gold-500/20 flex items-center justify-between text-xs text-ivory-400">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <FaShieldAlt size={13} />
              </div>
              <div>
                <div className="text-white font-medium text-[11px]">{t('auth.quantumSecurity', 'Quantum 256-Bit Encrypted')}</div>
                <div className="text-[10px] text-ivory-400">{t('auth.isoVerified', 'ISO 27001 Certified Portal')}</div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-gold-400 font-semibold text-[11px]">
              <FaCheckCircle /> {t('auth.liveStatus', 'System Online')}
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT PANEL: Ultra-Futuristic Responsive Login Card (Form) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="lg:col-span-7 flex justify-center w-full"
        >
          <div className="w-full max-w-xl bg-gradient-to-b from-[#151221]/95 via-[#0F0C1B]/95 to-[#090712]/95 border border-[rgba(201,162,39,0.3)] rounded-3xl p-5 sm:p-8 lg:p-10 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(201,162,39,0.15)] relative overflow-hidden backdrop-blur-2xl group">
            {/* Shimmering Animated Glowing Edge Beam */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none p-[1px] bg-gradient-to-r from-transparent via-gold-500/40 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />

            {/* Mobile Top Brand Badge */}
            <div className="lg:hidden text-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[10px] font-semibold uppercase tracking-[1.5px] backdrop-blur-md shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
                <FaCrown size={10} className="text-gold-400" />
                <span>{t('auth.vipPortal', 'DUNAS VIP WORLD PORTAL')}</span>
              </div>
            </div>

            {/* Glowing Golden Crest Badge */}
            <div className="text-center mb-6 sm:mb-8 relative z-10">
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-amber-700 p-[2px] mx-auto mb-3 sm:mb-4 shadow-[0_0_35px_rgba(201,162,39,0.4)] relative cursor-pointer"
              >
                <div className="w-full h-full bg-[#0d0a17] rounded-[14px] flex items-center justify-center text-gold-400 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/20 to-transparent opacity-50 animate-pulse" />
                  <FaUserTie size={30} className="sm:text-[36px] text-gold-400 filter drop-shadow-[0_0_10px_rgba(201,162,39,0.6)]" />
                </div>
                {/* Floating Orbit Ring */}
                <div className="absolute -inset-2 rounded-2xl border border-gold-500/30 animate-spin" style={{ animationDuration: '12s' }} />
              </motion.div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-ivory-100 to-gold-300 tracking-wide mb-1.5">
                {t('auth.welcomeBack', 'Welcome Back')}
              </h1>
              <p className="text-xs sm:text-sm text-ivory-300 font-light px-2">
                {t('auth.signInDesc', 'Sign in to access your bespoke itineraries and luxury privileges.')}
              </p>

              {/* Mode Switcher Tabs: Standard Credentials vs Cyber Biometric Passkey */}
              <div className="mt-5 sm:mt-6 flex w-full sm:w-auto sm:inline-flex p-1 rounded-xl bg-black/50 border border-gold-500/20 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setAuthMode('credentials')}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'credentials'
                      ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-900 shadow-[0_0_15px_rgba(201,162,39,0.5)]'
                      : 'text-ivory-400 hover:text-white'
                  }`}
                >
                  <FaLock size={11} />
                  <span>{t('auth.standardLogin', 'Password Key')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('biometric')}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'biometric'
                      ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-900 shadow-[0_0_15px_rgba(201,162,39,0.5)]'
                      : 'text-ivory-400 hover:text-white'
                  }`}
                >
                  <FaFingerprint size={12} />
                  <span>{t('auth.biometricLogin', 'Cyber Passkey')}</span>
                </button>
              </div>
            </div>

            {/* Error Notification Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-5 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs text-center space-y-2 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.2)] relative z-10"
                >
                  <p className="font-medium">
                    {typeof error === 'object' && error !== null ? (error.message || String(error)) : error}
                  </p>
                  {showResendBtn && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-3 pt-2 border-t border-red-500/20">
                      <Link
                        to={`/verify-email?email=${encodeURIComponent(email)}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-900 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
                      >
                        {t('auth.enterOtpBtn', 'Enter Verification Code')}
                      </Link>
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        className="w-full sm:w-auto inline-block px-3 py-2 rounded-xl bg-gold-500/10 text-gold-400 hover:bg-gold-500/20 text-xs font-semibold transition-all border border-gold-500/30"
                      >
                        {isResending ? t('common.loading', 'Sending...') : t('auth.resendVerificationBtn', 'Resend Code')}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Resend Notification */}
            <AnimatePresence>
              {resendSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-5 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs text-center font-medium backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  {resendSuccess}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── MODE 1: Standard Password Credentials Form ── */}
            {authMode === 'credentials' && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-5 relative z-10"
              >
                {/* Email Input Field */}
                <div>
                  <label className="text-xs font-semibold text-gold-400 uppercase tracking-[1.5px] mb-2 flex items-center justify-between">
                    <span>{t('auth.emailAddress', 'Email Address')}</span>
                    <span className="text-[10px] text-ivory-500 font-normal uppercase">{t('auth.required', 'Required')}</span>
                  </label>
                  <div className="relative group/input">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory-400 group-focus-within/input:text-gold-400 transition-colors">
                      <FaEnvelope size={15} />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth.emailPlaceholder', 'Enter your VIP email')}
                      className="w-full py-3.5 pl-11 pr-4 rounded-2xl bg-black/40 text-white placeholder:text-ivory-500/50 border border-gold-500/20 focus:border-gold-400 focus:bg-black/60 focus:shadow-[0_0_25px_rgba(201,162,39,0.25)] outline-none transition-all duration-300 text-sm font-light"
                    />
                  </div>
                </div>

                {/* Password Input Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-gold-400 uppercase tracking-[1.5px]">
                      {t('auth.password', 'Password')}
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-gold-400/80 hover:text-gold-300 transition-colors font-medium hover:underline"
                    >
                      {t('auth.forgotPassword', 'Forgot Password?')}
                    </Link>
                  </div>
                  <div className="relative group/input">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory-400 group-focus-within/input:text-gold-400 transition-colors">
                      <FaLock size={15} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('auth.passwordPlaceholder', 'Enter your secure password')}
                      className="w-full py-3.5 pl-11 pr-11 rounded-2xl bg-black/40 text-white placeholder:text-ivory-500/50 border border-gold-500/20 focus:border-gold-400 focus:bg-black/60 focus:shadow-[0_0_25px_rgba(201,162,39,0.25)] outline-none transition-all duration-300 text-sm font-light"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ivory-400 hover:text-gold-400 transition-colors p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Options Row: Remember Me & Quick Demo Credentials Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-ivory-300 hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gold-500/30 bg-black/50 text-gold-500 focus:ring-gold-500 accent-gold-500 cursor-pointer"
                    />
                    <span>{t('auth.rememberMe', 'Remember me')}</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleQuickFillDemo}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-300 font-medium transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                  >
                    <FaBolt className="text-gold-400 animate-pulse" size={11} />
                    <span>{t('auth.fillDemo', 'Quick Demo Fill')}</span>
                  </button>
                </div>

                {/* Futuristic Main Submit Button */}
                <Button
                  variant="gold-glow"
                  type="submit"
                  className="w-full py-4 rounded-2xl font-bold uppercase tracking-[2px] text-xs mt-4 flex justify-center items-center gap-2 relative overflow-hidden group/btn shadow-[0_0_30px_rgba(201,162,39,0.4)]"
                  disabled={isLoading}
                >
                  {/* Liquid Glowing Sweeping Effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin" />
                      <span>{t('auth.authenticating', 'Authenticating...')}</span>
                    </div>
                  ) : (
                    <>
                      <span>{t('auth.loginButton', 'Sign In To VIP Access')}</span>
                      <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.form>
            )}

            {/* ── MODE 2: Cyber Passkey / Biometric Scan Mode ── */}
            {authMode === 'biometric' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 sm:py-6 text-center space-y-5 sm:space-y-6 relative z-10"
              >
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto flex items-center justify-center">
                  {/* Cyber Scanner Laser Lines */}
                  <div
                    className={`absolute inset-0 rounded-full border-2 border-dashed ${
                      biometricSuccess
                        ? 'border-emerald-400 animate-none'
                        : biometricScanning
                        ? 'border-gold-400 animate-spin'
                        : 'border-gold-500/30'
                    }`}
                    style={{ animationDuration: '4s' }}
                  />

                  {biometricScanning && (
                    <motion.div
                      initial={{ y: -40 }}
                      animate={{ y: 40 }}
                      transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
                      className="absolute inset-x-4 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent shadow-[0_0_15px_#C9A227]"
                    />
                  )}

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBiometricAuth}
                    disabled={biometricScanning || biometricSuccess}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative ${
                      biometricSuccess
                        ? 'bg-emerald-500 text-black shadow-[0_0_40px_rgba(16,185,129,0.6)]'
                        : biometricScanning
                        ? 'bg-gold-500/20 text-gold-300 shadow-[0_0_40px_rgba(201,162,39,0.6)]'
                        : 'bg-gradient-to-br from-gold-500/20 to-black text-gold-400 border border-gold-500/40 hover:border-gold-400'
                    }`}
                  >
                    {biometricSuccess ? (
                      <FaCheckCircle size={36} className="animate-bounce" />
                    ) : (
                      <FaFingerprint size={42} className={biometricScanning ? 'animate-pulse' : ''} />
                    )}
                  </motion.button>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    {biometricSuccess
                      ? t('auth.passkeySuccess', 'Identity Verified!')
                      : biometricScanning
                      ? t('auth.scanningPasskey', 'Scanning Quantum Passkey...')
                      : t('auth.touchToScan', 'Touch Scanner for Instant Biometric Access')}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-ivory-400 mt-1">
                    {t('auth.passkeyDesc', 'Hardware Security Key (FIDO2 / TouchID / FaceID) Enabled')}
                  </p>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleBiometricAuth}
                    disabled={biometricScanning || biometricSuccess}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-300 text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    {biometricScanning ? t('common.loading', 'Processing...') : t('auth.simulateScan', 'Simulate Passkey Scan')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Quick Social & OAuth Buttons Divider */}
            <div className="mt-6 sm:mt-8 relative z-10">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-gold-500/15 w-full" />
                <span className="bg-[#0F0C1B] px-3 sm:px-4 text-[10px] sm:text-[11px] text-ivory-400 uppercase tracking-widest font-medium whitespace-nowrap">
                  {t('auth.orContinueWith', 'Or Sign In With')}
                </span>
                <div className="border-t border-gold-500/15 w-full" />
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleQuickFillDemo}
                  className="flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl bg-black/40 border border-white/10 hover:border-gold-500/40 text-ivory-200 hover:text-white text-xs font-medium transition-all hover:bg-black/60 backdrop-blur-md"
                >
                  <FaGoogle size={14} className="text-red-400" />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={handleQuickFillDemo}
                  className="flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl bg-black/40 border border-white/10 hover:border-gold-500/40 text-ivory-200 hover:text-white text-xs font-medium transition-all hover:bg-black/60 backdrop-blur-md"
                >
                  <FaApple size={16} className="text-white" />
                  <span>Apple ID</span>
                </button>
              </div>
            </div>

            {/* Footer Registration Link */}
            <div className="mt-6 sm:mt-8 text-center border-t border-gold-500/15 pt-5 sm:pt-6 relative z-10">
              <p className="text-xs text-ivory-300">
                {t('auth.noAccount', "Don't have an account?")}{' '}
                <Link
                  to="/register"
                  className="text-gold-400 font-bold hover:text-gold-300 transition-colors hover:underline inline-flex items-center gap-1"
                >
                  <span>{t('auth.createAccountBtn', 'Create Account')}</span>
                  <FaRocket size={10} />
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

