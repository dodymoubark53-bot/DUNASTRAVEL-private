import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaEye, FaEyeSlash, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import {
  getPasswordValidationErrors,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../utils/passwordPolicy';

const LoginModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [view, setView] = useState('login'); // 'login' | 'register'
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showResendBtn, setShowResendBtn] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login, register, resendVerification } = useAuth();

  // Reset form when switching views
  const switchView = (newView) => {
    setView(newView);
    setError('');
    setSuccess('');
    setShowResendBtn(false);
    setPassword('');
    setConfirmPassword('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowResendBtn(false);
    setIsLoading(true);
    
    try {
      await login(email, password);
      onClose();
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

  const handleResendVerification = async () => {
    if (!email) return;
    setIsResending(true);
    setError('');
    setSuccess('');
    try {
      const response = await resendVerification(email);
      setSuccess(response?.message || t('auth.verificationResent', 'Verification email sent! Please check your inbox.'));
      setShowResendBtn(false);
    } catch (err) {
      setError(err.message || t('auth.resendFailed', 'Failed to resend verification email'));
    } finally {
      setIsResending(false);
    }
  };

  // Keep browser feedback aligned with the backend password policy.
  const passwordErrors = getPasswordValidationErrors(password);
  const hasLength = password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const hasThreeClasses = [hasUpper, hasLower, hasDigit, hasSymbol].filter(Boolean).length >= 3;
  const isPredictable = passwordErrors.includes('predictable');
  const hasRepeatedSequence = passwordErrors.includes('repeatedSequence');
  const strengthScore = [hasLength, hasUpper, hasLower, hasDigit, hasSymbol].filter(Boolean).length;
  const isPasswordValid = passwordErrors.length === 0;

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validations
    if (!name || !email || !phone || !password || !confirmPassword) {
      return setError(t('auth.allFieldsRequired', 'All fields are required'));
    }
    if (!isPasswordValid) {
      return setError(t('auth.passwordComplexityError', 'Use 12–128 characters, at least three character types, and avoid predictable words or long repeated sequences.'));
    }
    if (password !== confirmPassword) {
      return setError(t('auth.passwordsDoNotMatch', 'Passwords do not match'));
    }
    if (!termsAccepted) {
      return setError(t('auth.acceptTermsError', 'You must accept the Terms and Conditions'));
    }
    
    setIsLoading(true);
    try {
      const account = await register(name, email, phone, password);
      setSuccess(account?.isVerified === false
        ? t('auth.accountCreatedVerification', 'Account created. Please verify your email before logging in.')
        : t('auth.accountCreatedSuccess', 'Account created successfully! Please log in.'));
      // Keep the email for the next step; users with verification enabled can resend from login.
      setTimeout(() => switchView('login'), 2200);
    } catch (err_) {
      const message = err_?.message || t('common.errorOccurred', 'An error occurred');
      if (message.toLowerCase().includes('already exists') || message.toLowerCase().includes('duplicate')) {
        setError(t('auth.emailInUse', 'This email is already in use'));
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-obsidian-900/60 backdrop-blur-md p-4"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            overflowY: 'auto'
          }}
        >
          <style>{`
            .auth-input:-webkit-autofill,
            .auth-input:-webkit-autofill:hover,
            .auth-input:-webkit-autofill:focus {
              -webkit-text-fill-color: #fefcf7 !important;
              caret-color: #fefcf7;
              -webkit-box-shadow: 0 0 0 1000px #17151f inset !important;
              box-shadow: 0 0 0 1000px #17151f inset !important;
              transition: background-color 9999s ease-out 0s;
            }
          `}</style>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md glass-dark rounded-2xl shadow-gold no-scrollbar overflow-x-hidden"
            style={{ 
              backgroundColor: 'rgba(15, 13, 11, 0.98)', 
              backdropFilter: 'blur(24px)', 
              WebkitBackdropFilter: 'blur(24px)',
              position: 'relative',
              margin: 'auto',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={() => { onClose(); switchView('login'); }}
              className="absolute top-4 right-4 text-ivory-300 hover:text-gold-500 transition-colors z-10"
            >
              <FaTimes size={20} />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-tr from-gold-700 via-gold-500 to-gold-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_rgba(201,162,39,0.35)]">
                  <FaUserCircle size={32} className="text-obsidian-900" />
                </div>
                <h2 className="text-display-md text-ivory-50 font-semibold mb-2">
                  {view === 'login' ? t('auth.welcomeBack', 'Welcome Back') : t('auth.createAccount', 'Create Account')}
                </h2>
                <p className="text-caption text-ivory-300">
                  {view === 'login' 
                    ? t('auth.signInDesc', 'Sign in to access your bespoke itineraries.') 
                    : t('auth.registerDesc', 'Join us to curate your DUNAS TRAVEL experiences.')}
                </p>
              </div>

              {/* Status Messages */}
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/50 text-red-400 text-caption text-center space-y-2">
                  <p>{typeof error === 'object' && error !== null ? (error.message || String(error)) : error}</p>
                  {showResendBtn && (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isResending}
                      className="inline-block mt-1 px-3 py-1 rounded-lg bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 text-xs font-semibold transition-all border border-gold-500/30"
                    >
                      {isResending ? t('common.loading', 'Sending...') : t('auth.resendVerificationBtn', 'Resend Verification Email')}
                    </button>
                  )}
                </div>
              )}
              {success && (
                <div className="mb-5 p-3.5 rounded-xl bg-sage-500/15 border border-sage-500/50 text-sage-400 text-caption text-center">
                  {success}
                </div>
              )}

              {/* LOGIN FORM */}
              {view === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-caption text-ivory-300 uppercase tracking-wider font-medium">{t('auth.emailAddress', 'Email Address')}</label>
                    <input 
                      type="email" 
                      required
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input w-full bg-obsidian-900/50 border border-ivory-50/10 rounded-lg p-3 text-ivory-50 placeholder-ivory-300/50 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:outline-none transition-all"
                      placeholder={t('auth.emailPlaceholder', 'Enter your email')}
                    />
                  </div>

                  <div className="space-y-1 relative">
                    <label className="text-caption text-ivory-300 uppercase tracking-wider font-medium">{t('auth.password', 'Password')}</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required
                        name="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input w-full bg-obsidian-900/50 border border-ivory-50/10 rounded-lg p-3 text-ivory-50 placeholder-ivory-300/50 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:outline-none transition-all"
                        placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory-300 hover:text-gold-500 transition-colors"
                      >
                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => { onClose(); navigate('/forgot-password'); }}
                      className="text-caption text-gold-500 hover:text-gold-300 transition-colors"
                    >
                      {t('auth.forgotPassword', 'Forgot Password?')}
                    </button>
                  </div>

                  <div className="pt-4">
                    <Button 
                      variant="gold-glow" 
                      type="submit" 
                      className="w-full relative flex items-center justify-center py-4"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        t('auth.loginButton', 'Login')
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {/* REGISTER FORM */}
              {view === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-caption text-ivory-300 uppercase tracking-wider font-medium">{t('auth.fullName', 'Full Name')}</label>
                    <input 
                      type="text" 
                      required
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="auth-input w-full bg-obsidian-900/50 border border-ivory-50/10 rounded-lg p-3 text-ivory-50 placeholder-ivory-300/50 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:outline-none transition-all"
                      placeholder={t('auth.fullNamePlaceholder', 'Enter your full name')}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-caption text-ivory-300 uppercase tracking-wider font-medium">{t('auth.emailAddress', 'Email Address')}</label>
                    <input 
                      type="email" 
                      required
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input w-full bg-obsidian-900/50 border border-ivory-50/10 rounded-lg p-3 text-ivory-50 placeholder-ivory-300/50 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:outline-none transition-all"
                      placeholder={t('auth.emailPlaceholder', 'Enter your email')}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-caption text-ivory-300 uppercase tracking-wider font-medium">{t('auth.phoneNumber', 'Phone Number')}</label>
                    <input 
                      type="tel" 
                      required
                      name="phone"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="auth-input w-full bg-obsidian-900/50 border border-ivory-50/10 rounded-lg p-3 text-ivory-50 placeholder-ivory-300/50 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:outline-none transition-all"
                      placeholder={t('auth.phonePlaceholder', 'Enter your phone number')}
                    />
                  </div>

                  <div className="space-y-1 relative">
                    <label className="text-caption text-ivory-300 uppercase tracking-wider font-medium">{t('auth.password', 'Password')}</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required
                        name="new-password"
                        autoComplete="new-password"
                        minLength={PASSWORD_MIN_LENGTH}
                        maxLength={PASSWORD_MAX_LENGTH}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input w-full bg-obsidian-900/50 border border-ivory-50/10 rounded-lg p-3 text-ivory-50 placeholder-ivory-300/50 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:outline-none transition-all"
                        placeholder={t('auth.min12Chars', 'Min 12 characters')}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory-300 hover:text-gold-500 transition-colors"
                      >
                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>

                    {/* Password Complexity Checklist */}
                    {password.length > 0 && (
                      <div className="mt-2 p-2.5 rounded-lg bg-obsidian-950/80 border border-gold-500/20 text-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] text-ivory-400 font-medium">{t('auth.passwordStrength', 'Password Strength')}:</span>
                          <span className={`text-[10px] font-bold ${
                            isPasswordValid ? 'text-emerald-400' :
                            strengthScore >= 4 ? 'text-gold-400' :
                            strengthScore >= 2 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {isPasswordValid ? t('auth.strengthStrong', 'Strong') :
                             strengthScore >= 4 ? t('auth.strengthGood', 'Good') :
                             strengthScore >= 2 ? t('auth.strengthFair', 'Fair') : t('auth.strengthWeak', 'Weak')}
                          </span>
                        </div>
                        <div className="grid grid-cols-5 gap-1 mb-2 h-1">
                          {[1, 2, 3, 4, 5].map((step) => (
                            <div
                              key={step}
                              className={`h-full rounded-full transition-all duration-300 ${
                                step <= strengthScore
                                  ? isPasswordValid
                                    ? 'bg-emerald-400'
                                    : strengthScore >= 4
                                    ? 'bg-gold-400'
                                    : strengthScore >= 2
                                    ? 'bg-amber-400'
                                    : 'bg-rose-400'
                                  : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[10px]">
                          <div className={`flex items-center gap-1 ${hasLength ? 'text-emerald-400 font-semibold' : 'text-ivory-400/60'}`}>
                            <span>{hasLength ? '✓' : '•'}</span>
                            <span>{t('auth.ruleLength', '12–128 characters')}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${hasUpper ? 'text-emerald-400 font-semibold' : 'text-ivory-400/60'}`}>
                            <span>{hasUpper ? '✓' : '•'}</span>
                            <span>{t('auth.ruleUpper', 'Uppercase (A-Z)')}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${hasLower ? 'text-emerald-400 font-semibold' : 'text-ivory-400/60'}`}>
                            <span>{hasLower ? '✓' : '•'}</span>
                            <span>{t('auth.ruleLower', 'Lowercase (a-z)')}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${hasDigit ? 'text-emerald-400 font-semibold' : 'text-ivory-400/60'}`}>
                            <span>{hasDigit ? '✓' : '•'}</span>
                            <span>{t('auth.ruleDigit', 'Number (0-9)')}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${hasThreeClasses ? 'text-emerald-400 font-semibold' : 'text-ivory-400/60'}`}>
                            <span>{hasThreeClasses ? '✓' : '•'}</span>
                            <span>{t('auth.ruleClasses', 'Use 3 of 4 character types')}</span>
                          </div>
                          {(isPredictable || hasRepeatedSequence) && (
                            <div className="col-span-2 text-rose-400">
                              {isPredictable
                                ? t('auth.rulePredictable', 'Avoid common or predictable words')
                                : t('auth.ruleRepeated', 'Avoid repeating one character five times')}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 relative">
                    <label className="text-caption text-ivory-300 uppercase tracking-wider font-medium">{t('auth.confirmPassword', 'Confirm Password')}</label>
                    <div className="relative">
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        required
                        name="confirm-password"
                        autoComplete="new-password"
                        minLength={PASSWORD_MIN_LENGTH}
                        maxLength={PASSWORD_MAX_LENGTH}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="auth-input w-full bg-obsidian-900/50 border border-ivory-50/10 rounded-lg p-3 text-ivory-50 placeholder-ivory-300/50 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:outline-none transition-all"
                        placeholder={t('auth.confirmPasswordPlaceholder', 'Confirm your password')}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory-300 hover:text-gold-500 transition-colors"
                      >
                        {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mt-4">
                    <input 
                      type="checkbox" 
                      id="terms"
                      required
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 mt-1 rounded border-ivory-50/20 bg-transparent text-gold-500 focus:ring-gold-500 focus:ring-offset-obsidian-900 accent-gold-500" 
                    />
                    <label htmlFor="terms" className="text-caption text-ivory-300 leading-tight">
                      {t('auth.agreeText', 'I agree to the ')}
                      <button type="button" className="text-gold-500 hover:text-gold-300">{t('auth.termsAndConditions', 'Terms and Conditions')}</button>
                      {t('auth.and', ' and ')}
                      <button type="button" className="text-gold-500 hover:text-gold-300">{t('auth.privacyPolicy', 'Privacy Policy')}</button>.
                    </label>
                  </div>

                  <div className="pt-4">
                    <Button 
                      variant="gold-glow" 
                      type="submit" 
                      className="w-full relative flex items-center justify-center py-4"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        t('auth.createAccountBtn', 'Create Account')
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {/* View Toggle */}
              <div className="mt-8 text-center border-t border-ivory-50/10 pt-6">
                {view === 'login' ? (
                  <p className="text-caption text-ivory-300">
                    {t('auth.noAccount', "Don't have an account?")}
                    <button onClick={() => switchView('register')} className="text-gold-500 hover:text-gold-300 font-medium transition-colors ml-1">
                      {t('auth.createAccountBtn', 'Create Account')}
                    </button>
                  </p>
                ) : (
                  <p className="text-caption text-ivory-300">
                    {t('auth.haveAccount', 'Already have an account?')}
                    <button onClick={() => switchView('login')} className="text-gold-500 hover:text-gold-300 font-medium transition-colors ml-1">
                      {t('auth.signInBtn', 'Sign In')}
                    </button>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
