import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

const VerifyEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const codeFromUrl = searchParams.get('code') || searchParams.get('token') || '';
  const emailFromUrl = searchParams.get('email') || '';

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  
  const [isVerifying, setIsVerifying] = useState(Boolean(codeFromUrl));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendEmail, setResendEmail] = useState(emailFromUrl);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');
  const [resendError, setResendError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { verifyEmail, resendVerification, getMe } = useAuth();

  // If code is provided in URL, automatically attempt verification
  useEffect(() => {
    if (!codeFromUrl) return;

    let isMounted = true;
    const performVerification = async () => {
      setIsVerifying(true);
      setError('');
      try {
        await verifyEmail({ code: codeFromUrl, email: emailFromUrl });
        if (typeof getMe === 'function') {
          try {
            await getMe();
          } catch {}
        }
        if (isMounted) {
          const rawPending = typeof window !== 'undefined' ? sessionStorage.getItem('dunas_pending_booking_intent') : null;
          let targetUrl = '/dashboard';
          let isResumingBooking = false;
          if (rawPending) {
            try {
              const parsed = JSON.parse(rawPending);
              const tourKey = parsed?.tourSlug || parsed?.tourId;
              if (tourKey) {
                targetUrl = `/tours/${tourKey}`;
                isResumingBooking = true;
              }
            } catch {}
          }

          setSuccess(
            isResumingBooking
              ? t('auth.verifyEmailSuccessBooking', 'Account activated! Resuming your tour reservation...')
              : t('auth.verifyEmailSuccess', 'Your account has been verified successfully! You can now proceed.')
          );
          setTimeout(() => {
            if (isMounted) navigate(targetUrl, { replace: true });
          }, 2000);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || t('auth.verifyEmailError', 'Verification code is invalid or has expired.'));
        }
      } finally {
        if (isMounted) setIsVerifying(false);
      }
    };

    performVerification();

    return () => {
      isMounted = false;
    };
  }, [codeFromUrl, emailFromUrl, verifyEmail, getMe, navigate, t]);

  // Handle resend countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleDigitChange = (index, value) => {
    // Only accept numeric digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);
    setError('');

    // Focus next box if digit was entered
    if (digit && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const digits = pastedData.split('');
      const updated = ['', '', '', '', '', ''];
      digits.forEach((d, i) => {
        if (i < 6) updated[i] = d;
      });
      setOtpDigits(updated);
      const nextFocusIndex = Math.min(digits.length, 5);
      inputRefs[nextFocusIndex].current?.focus();
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      return setError(t('auth.otpRequired', 'Please enter all 6 digits of the verification code.'));
    }

    setIsVerifying(true);
    setError('');
    setSuccess('');

    try {
      const result = await verifyEmail({ code: fullCode, email: resendEmail.trim() });
      if (typeof getMe === 'function') {
        try {
          await getMe();
        } catch {}
      }

      const rawPending = typeof window !== 'undefined' ? sessionStorage.getItem('dunas_pending_booking_intent') : null;
      let targetUrl = '/dashboard';
      let isResumingBooking = false;
      if (rawPending) {
        try {
          const parsed = JSON.parse(rawPending);
          const tourKey = parsed?.tourSlug || parsed?.tourId;
          if (tourKey) {
            targetUrl = `/tours/${tourKey}`;
            isResumingBooking = true;
          }
        } catch {}
      }

      setSuccess(
        isResumingBooking
          ? t('auth.verifyEmailSuccessBooking', 'Account activated! Resuming your tour reservation...')
          : (result?.message || t('auth.verifyEmailSuccess', 'Your account has been verified successfully!'))
      );
      setTimeout(() => {
        navigate(targetUrl, { replace: true });
      }, 2000);
    } catch (err) {
      setError(err.message || t('auth.verifyEmailError', 'Invalid or expired 6-digit verification code.'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setIsResending(true);
    setResendError('');
    setResendSuccess('');

    try {
      const response = await resendVerification(resendEmail.trim());
      setResendSuccess(response?.message || t('auth.verificationResent', 'Verification code sent! Please check your inbox.'));
      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      setResendError(err.message || t('auth.resendFailed', 'Failed to resend verification code.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 bg-obsidian-900 flex items-center justify-center px-4 font-body">
      <Helmet>
        <title>{t('auth.verifyEmailTitle', 'Verify Account Code | Dunas Travel')}</title>
      </Helmet>

      <div className="w-full max-w-md bg-[#121118] border border-[rgba(201,162,39,0.25)] rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.85)] relative">
        {/* State 1: Verifying in progress */}
        {isVerifying && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 border-3 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" />
            <h2 className="text-display-sm text-ivory-50 font-display font-semibold">
              {t('auth.verifyingEmail', 'Verifying Code...')}
            </h2>
            <p className="text-body-sm text-ivory-400">
              {t('auth.verifyingEmailDesc', 'Please wait while we activate your bespoke journey account.')}
            </p>
          </div>
        )}

        {/* State 2: Verification Succeeded */}
        {!isVerifying && success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4 space-y-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(201,162,39,0.3)]">
              <FaCheckCircle size={32} className="text-obsidian-900" />
            </div>
            <h2 className="text-display-sm text-ivory-50 font-display font-semibold">
              {t('auth.emailVerified', 'Account Activated!')}
            </h2>
            <p className="text-body-sm text-ivory-300">
              {success}
            </p>
            <p className="text-xs text-gold-400">
              {t('auth.redirectingToLogin', 'Redirecting to sign in shortly...')}
            </p>
            <div className="pt-4">
              <Button
                variant="gold-glow"
                onClick={() => navigate('/login')}
                className="w-full py-3 font-bold uppercase tracking-wider text-[13px]"
              >
                {t('auth.proceedToLogin', 'Proceed to Sign In')}
              </Button>
            </div>
          </motion.div>
        )}

        {/* State 3: OTP Entry Form */}
        {!isVerifying && !success && (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-500/20 to-gold-700/20 border border-gold-500/40 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(201,162,39,0.2)]">
                {error ? (
                  <FaExclamationTriangle size={26} className="text-red-400" />
                ) : (
                  <FaShieldAlt size={26} className="text-gold-500" />
                )}
              </div>
              <h1 className="text-display-sm text-ivory-50 font-display font-semibold mb-2">
                {t('auth.enterOtpHeading', 'Enter Verification Code')}
              </h1>
              <p className="text-body-sm text-ivory-300">
                {t('auth.otpSentDesc', 'We sent a 6-digit confirmation code to your email address')}
              </p>
              {emailFromUrl && (
                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-medium">
                  {emailFromUrl}
                </div>
              )}
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs text-center">
                {typeof error === 'object' && error !== null ? error.message : error}
              </div>
            )}

            {/* 6-Digit OTP Code Inputs */}
            <form onSubmit={handleCodeSubmit} className="space-y-6 mb-6">
              <div className="flex justify-center items-center gap-2 sm:gap-3" onPaste={handlePaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl bg-[rgba(255,252,247,0.05)] text-gold-400 border border-[rgba(201,162,39,0.25)] focus:border-gold-500 focus:bg-gold-500/10 focus:shadow-[0_0_15px_rgba(201,162,39,0.3)] outline-none transition-all"
                  />
                ))}
              </div>

              <Button
                variant="gold-glow"
                type="submit"
                className="w-full py-3.5 font-bold uppercase tracking-[1.5px] text-[13px]"
              >
                {t('auth.submitVerificationCode', 'Confirm Code & Activate')}
              </Button>
            </form>

            {/* Resend Section */}
            <div className="border-t border-[rgba(201,162,39,0.15)] pt-6 mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-ivory-300">
                  {t('auth.didntReceiveCode', "Didn't receive the code?")}
                </span>
                {!canResend && countdown > 0 ? (
                  <span className="text-xs text-gold-400 font-mono">
                    {t('auth.resendIn', 'Resend in')} {countdown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-xs text-gold-400 hover:text-gold-300 font-semibold underline underline-offset-2 transition-all cursor-pointer"
                  >
                    {isResending ? t('common.sending', 'Sending...') : t('auth.resendCodeNow', 'Resend Code')}
                  </button>
                )}
              </div>

              {resendSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-sage-500/15 border border-sage-500/40 text-sage-400 text-xs text-center">
                  {resendSuccess}
                </div>
              )}
              {resendError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs text-center">
                  {resendError}
                </div>
              )}

              {/* Email update form if email was missing */}
              {!emailFromUrl && (
                <form onSubmit={handleResend} className="space-y-3 mt-3">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-400">
                      <FaEnvelope size={14} />
                    </span>
                    <input
                      type="email"
                      required
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder={t('auth.emailPlaceholder', 'Enter your account email')}
                      className="w-full p-2.5 pl-10 rounded-xl bg-[rgba(255,252,247,0.04)] text-ivory-50 placeholder:text-[rgba(245,237,214,0.3)] border border-[rgba(201,162,39,0.15)] focus:border-gold-500 outline-none transition-all text-[13px]"
                    />
                  </div>
                  <Button
                    variant="gold-glow"
                    type="submit"
                    disabled={isResending}
                    className="w-full py-2.5 font-bold uppercase tracking-wider text-[12px]"
                  >
                    {isResending ? t('common.loading', 'Sending...') : t('auth.resendVerificationBtn', 'Send New Code')}
                  </Button>
                </form>
              )}
            </div>

            <div className="mt-6 text-center border-t border-[rgba(201,162,39,0.1)] pt-4">
              <Link to="/login" className="text-gold-500 font-semibold hover:underline text-xs">
                ← {t('auth.backToSignIn', 'Back to Sign In')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
