import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaEnvelope, FaKey } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

const VerifyEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  const emailFromUrl = searchParams.get('email') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [isVerifying, setIsVerifying] = useState(Boolean(tokenFromUrl));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendEmail, setResendEmail] = useState(emailFromUrl);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');
  const [resendError, setResendError] = useState('');

  const { verifyEmail, resendVerification } = useAuth();

  useEffect(() => {
    if (!tokenFromUrl) return;

    let isMounted = true;
    const performVerification = async () => {
      setIsVerifying(true);
      setError('');
      try {
        await verifyEmail(tokenFromUrl);
        if (isMounted) {
          setSuccess(t('auth.verifyEmailSuccess', 'Your email has been verified successfully! You can now log in.'));
          setTimeout(() => {
            if (isMounted) navigate('/login');
          }, 3500);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || t('auth.verifyEmailError', 'Verification link is invalid or has expired.'));
        }
      } finally {
        if (isMounted) setIsVerifying(false);
      }
    };

    performVerification();

    return () => {
      isMounted = false;
    };
  }, [tokenFromUrl, verifyEmail, navigate, t]);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      return setError(t('auth.tokenRequired', 'Verification token is required.'));
    }

    setIsVerifying(true);
    setError('');
    setSuccess('');

    try {
      await verifyEmail(token.trim());
      setSuccess(t('auth.verifyEmailSuccess', 'Your email has been verified successfully! You can now log in.'));
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || t('auth.verifyEmailError', 'Verification link is invalid or has expired.'));
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
      setResendSuccess(response?.message || t('auth.verificationResent', 'Verification email sent! Please check your inbox.'));
    } catch (err) {
      setResendError(err.message || t('auth.resendFailed', 'Failed to resend verification email.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 bg-obsidian-900 flex items-center justify-center px-4 font-body">
      <Helmet>
        <title>{t('auth.verifyEmailTitle', 'Verify Email | Dunas Travel')}</title>
      </Helmet>

      <div className="w-full max-w-md bg-[#121118] border border-[rgba(201,162,39,0.2)] rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
        {/* State 1: Verifying in progress */}
        {isVerifying && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 border-3 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" />
            <h2 className="text-display-sm text-ivory-50 font-display font-semibold">
              {t('auth.verifyingEmail', 'Verifying Email...')}
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
              {t('auth.emailVerified', 'Email Verified!')}
            </h2>
            <p className="text-body-sm text-ivory-300">
              {success}
            </p>
            <p className="text-xs text-gold-400">
              {t('auth.redirectingToLogin', 'Redirecting to login shortly...')}
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

        {/* State 3: Verification Failed / Expired */}
        {!isVerifying && !success && (
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-gold-500/20 border border-gold-500/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(201,162,39,0.15)]">
                {error ? (
                  <FaExclamationTriangle size={28} className="text-red-400" />
                ) : (
                  <FaKey size={26} className="text-gold-500" />
                )}
              </div>
              <h1 className="text-display-sm text-ivory-50 font-display font-semibold mb-2">
                {error ? t('auth.verificationFailed', 'Verification Failed') : t('auth.verifyEmailHeading', 'Verify Your Email')}
              </h1>
              <p className="text-body-sm text-ivory-400">
                {error || t('auth.verifyEmailManualDesc', 'Enter the verification token from your email confirmation.')}
              </p>
            </div>

            {/* Manual Token Entry Form (if not verified automatically) */}
            {!tokenFromUrl && (
              <form onSubmit={handleManualSubmit} className="space-y-4 mb-6">
                <div>
                  <label className="block text-caption text-gold-500 font-medium mb-1.5 uppercase tracking-[1px] text-[11px]">
                    {t('auth.verificationToken', 'Verification Token')}
                  </label>
                  <input
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder={t('auth.enterTokenPlaceholder', 'Enter verification token')}
                    className="w-full p-3 rounded-xl bg-[rgba(255,252,247,0.04)] text-ivory-50 placeholder:text-[rgba(245,237,214,0.3)] border border-[rgba(201,162,39,0.15)] focus:border-gold-500 outline-none transition-all text-[14px]"
                  />
                </div>
                <Button
                  variant="gold-glow"
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 font-bold uppercase tracking-[1.5px] text-[13px]"
                >
                  {t('auth.submitVerification', 'Verify Email')}
                </Button>
              </form>
            )}

            {/* Resend Section */}
            <div className="border-t border-[rgba(201,162,39,0.15)] pt-6 mt-6">
              <h3 className="text-xs font-semibold text-ivory-200 uppercase tracking-wider mb-2 text-center">
                {t('auth.needNewVerification', 'Need a new verification link?')}
              </h3>
              <p className="text-xs text-ivory-400 text-center mb-4">
                {t('auth.resendVerificationPrompt', 'Enter your account email to receive a fresh activation link.')}
              </p>

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

              <form onSubmit={handleResend} className="space-y-3">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-400">
                    <FaEnvelope size={14} />
                  </span>
                  <input
                    type="email"
                    required
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder', 'Enter your email')}
                    className="w-full p-2.5 pl-10 rounded-xl bg-[rgba(255,252,247,0.04)] text-ivory-50 placeholder:text-[rgba(245,237,214,0.3)] border border-[rgba(201,162,39,0.15)] focus:border-gold-500 outline-none transition-all text-[13px]"
                  />
                </div>
                <Button
                  variant="gold-glow"
                  type="submit"
                  disabled={isResending}
                  className="w-full py-2.5 font-bold uppercase tracking-wider text-[12px]"
                >
                  {isResending ? t('common.loading', 'Sending...') : t('auth.resendVerificationBtn', 'Resend Verification Email')}
                </Button>
              </form>
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
