import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { FaEye, FaEyeSlash, FaUserCircle, FaEnvelope, FaLock, FaUser, FaPhone } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import {
  getPasswordValidationErrors,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../utils/passwordPolicy';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register } = useAuth();

  // This must match the policy enforced by the API.
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
      const verificationRequired = account?.isVerified === false;
      setSuccess(verificationRequired
        ? t('auth.accountCreatedVerification', 'Account created. Please verify your email before logging in.')
        : t('auth.accountCreatedSuccess', 'Account created successfully! Redirecting to login...'));
      setTimeout(() => navigate(verificationRequired ? `/verify-email?email=${encodeURIComponent(email)}` : '/login'), 1800);
    } catch (err) {
      if (err.message?.toLowerCase().includes('already exists') || err.message?.toLowerCase().includes('duplicate')) {
        setError(t('auth.emailInUse', 'This email is already in use'));
      } else {
        setError(err.message || t('common.errorOccurred', 'An error occurred'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 bg-obsidian-900 flex items-center justify-center px-4 font-body">
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
      <Helmet>
        <title>{t('auth.registerTitle', 'Create Account | Dunas Travel')}</title>
      </Helmet>

      <div className="w-full max-w-md bg-[#121118] border border-[rgba(201,162,39,0.2)] rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(201,162,39,0.3)]">
            <FaUserCircle size={32} className="text-obsidian-900" />
          </div>
          <h1 className="text-display-sm text-ivory-50 font-display font-semibold mb-2">
            {t('auth.createAccount', 'Create Account')}
          </h1>
          <p className="text-body-sm text-ivory-400">
            {t('auth.registerDesc', 'Join us to curate your DUNAS TRAVEL experiences.')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-body-sm text-center">
            {typeof error === 'object' && error !== null ? (error.message || String(error)) : error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-sage-500/15 border border-sage-500/40 text-sage-400 text-body-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-caption text-gold-500 font-medium mb-1.5 uppercase tracking-[1px] text-[11px]">
              {t('auth.fullName', 'Full Name')}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-400">
                <FaUser size={13} />
              </span>
              <input
                type="text"
                required
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('auth.fullNamePlaceholder', 'Enter your full name')}
                className="auth-input w-full p-3 pl-10 rounded-xl bg-[rgba(255,252,247,0.04)] text-ivory-50 placeholder:text-[rgba(245,237,214,0.3)] border border-[rgba(201,162,39,0.15)] focus:border-gold-500 outline-none transition-all text-[14px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-caption text-gold-500 font-medium mb-1.5 uppercase tracking-[1px] text-[11px]">
              {t('auth.emailAddress', 'Email Address')}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-400">
                <FaEnvelope size={13} />
              </span>
              <input
                type="email"
                required
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder', 'Enter your email')}
                className="auth-input w-full p-3 pl-10 rounded-xl bg-[rgba(255,252,247,0.04)] text-ivory-50 placeholder:text-[rgba(245,237,214,0.3)] border border-[rgba(201,162,39,0.15)] focus:border-gold-500 outline-none transition-all text-[14px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-caption text-gold-500 font-medium mb-1.5 uppercase tracking-[1px] text-[11px]">
              {t('auth.phoneNumber', 'Phone Number')}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-400">
                <FaPhone size={13} />
              </span>
              <input
                type="tel"
                required
                name="phone"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('auth.phonePlaceholder', 'Enter your phone number')}
                className="auth-input w-full p-3 pl-10 rounded-xl bg-[rgba(255,252,247,0.04)] text-ivory-50 placeholder:text-[rgba(245,237,214,0.3)] border border-[rgba(201,162,39,0.15)] focus:border-gold-500 outline-none transition-all text-[14px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-caption text-gold-500 font-medium mb-1.5 uppercase tracking-[1px] text-[11px]">
              {t('auth.password', 'Password')}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-400">
                <FaLock size={13} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                name="new-password"
                autoComplete="new-password"
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.min12Chars', 'Min 12 characters')}
                className="auth-input w-full p-3 pl-10 pr-10 rounded-xl bg-[rgba(255,252,247,0.04)] text-ivory-50 placeholder:text-[rgba(245,237,214,0.3)] border border-[rgba(201,162,39,0.15)] focus:border-gold-500 outline-none transition-all text-[14px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ivory-400 hover:text-gold-500 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>

            {/* Password Complexity / Strength Indicator */}
            {password.length > 0 && (
              <div className="mt-2.5 p-3 rounded-xl bg-obsidian-800/60 border border-gold-500/20 text-xs">
                {/* Strength Progress Bar */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-ivory-400">
                    {t('auth.passwordStrength', 'Password Strength')}:
                  </span>
                  <span className={`text-[11px] font-bold ${
                    isPasswordValid ? 'text-emerald-400' :
                    strengthScore >= 4 ? 'text-gold-400' :
                    strengthScore >= 2 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {isPasswordValid ? t('auth.strengthStrong', 'Strong') :
                     strengthScore >= 4 ? t('auth.strengthGood', 'Good') :
                     strengthScore >= 2 ? t('auth.strengthFair', 'Fair') : t('auth.strengthWeak', 'Weak')}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 mb-2.5 h-1.5">
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

                {/* Requirements Checklist */}
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className={`flex items-center gap-1.5 transition-colors ${hasLength ? 'text-emerald-400 font-semibold' : 'text-ivory-400/70'}`}>
                    <span>{hasLength ? '✓' : '•'}</span>
                    <span>{t('auth.ruleLength', '12–128 characters')}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 transition-colors ${hasUpper ? 'text-emerald-400 font-semibold' : 'text-ivory-400/70'}`}>
                    <span>{hasUpper ? '✓' : '•'}</span>
                    <span>{t('auth.ruleUpper', 'Uppercase (A-Z)')}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 transition-colors ${hasLower ? 'text-emerald-400 font-semibold' : 'text-ivory-400/70'}`}>
                    <span>{hasLower ? '✓' : '•'}</span>
                    <span>{t('auth.ruleLower', 'Lowercase (a-z)')}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 transition-colors ${hasDigit ? 'text-emerald-400 font-semibold' : 'text-ivory-400/70'}`}>
                    <span>{hasDigit ? '✓' : '•'}</span>
                    <span>{t('auth.ruleDigit', 'Number (0-9)')}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 transition-colors ${hasThreeClasses ? 'text-emerald-400 font-semibold' : 'text-ivory-400/70'}`}>
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

          <div>
            <label className="block text-caption text-gold-500 font-medium mb-1.5 uppercase tracking-[1px] text-[11px]">
              {t('auth.confirmPassword', 'Confirm Password')}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-400">
                <FaLock size={13} />
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                name="confirm-password"
                autoComplete="new-password"
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('auth.confirmPasswordPlaceholder', 'Confirm password')}
                className="auth-input w-full p-3 pl-10 pr-10 rounded-xl bg-[rgba(255,252,247,0.04)] text-ivory-50 placeholder:text-[rgba(245,237,214,0.3)] border border-[rgba(201,162,39,0.15)] focus:border-gold-500 outline-none transition-all text-[14px]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ivory-400 hover:text-gold-500 transition-colors"
              >
                {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-2">
            <input
              type="checkbox"
              id="terms"
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-gold-500/30 bg-transparent text-gold-500 focus:ring-gold-500 accent-gold-500"
            />
            <label htmlFor="terms" className="text-body-sm text-ivory-400 leading-snug">
              {t('auth.agreeText', 'I agree to the ')}
              <span className="text-gold-500 cursor-pointer hover:underline">{t('auth.termsAndConditions', 'Terms and Conditions')}</span>
            </label>
          </div>

          <Button
            variant="gold-glow"
            type="submit"
            className="w-full py-3.5 font-bold uppercase tracking-[1.5px] text-[13px] mt-4 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              t('auth.createAccountBtn', 'Create Account')
            )}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-[rgba(201,162,39,0.1)] pt-6">
          <p className="text-body-sm text-ivory-400">
            {t('auth.haveAccount', 'Already have an account?')}{' '}
            <Link to="/login" className="text-gold-500 font-semibold hover:underline">
              {t('auth.signInBtn', 'Sign In')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
