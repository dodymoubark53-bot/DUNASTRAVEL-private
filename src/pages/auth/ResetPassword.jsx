import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { FaKey, FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { resetPassword } = useAuth();

  // Password Complexity Metrics
  const hasLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasDigit = /\d/.test(newPassword);
  const strengthScore = [hasLength, hasUpper, hasLower, hasDigit].filter(Boolean).length;
  const isPasswordValid = hasLength && hasUpper && hasLower && hasDigit;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token.trim()) {
      return setError(t('auth.tokenRequired', 'Reset token is required.'));
    }
    if (!isPasswordValid) {
      return setError(t('auth.passwordComplexityError', 'Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number'));
    }
    if (newPassword !== confirmPassword) {
      return setError(t('auth.passwordsDoNotMatch', 'Passwords do not match.'));
    }

    setIsLoading(true);

    try {
      await resetPassword(token.trim(), newPassword);
      setSuccess(t('auth.resetPasswordSuccess', 'Password has been reset successfully! You can now log in.'));
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.message || t('common.errorOccurred', 'Failed to reset password.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 bg-obsidian-900 flex items-center justify-center px-4 font-body">
      <Helmet>
        <title>{t('auth.resetPasswordTitle', 'Reset Password | Dunas Travel')}</title>
      </Helmet>

      <div className="w-full max-w-md bg-[#121118] border border-[rgba(201,162,39,0.2)] rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(201,162,39,0.3)]">
            <FaKey size={26} className="text-obsidian-900" />
          </div>
          <h1 className="text-display-sm text-ivory-50 font-display font-semibold mb-2">
            {t('auth.resetPassword', 'Set New Password')}
          </h1>
          <p className="text-body-sm text-ivory-400">
            {t('auth.resetPasswordDesc', 'Enter your new password below to update your account access.')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-body-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-sage-500/15 border border-sage-500/40 text-sage-400 text-body-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!tokenFromUrl && (
            <div>
              <label className="block text-caption text-gold-500 font-medium mb-1.5 uppercase tracking-[1px] text-[11px]">
                {t('auth.resetToken', 'Reset Token')}
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder={t('auth.enterTokenPlaceholder', 'Enter reset token')}
                className="w-full p-3 rounded-xl bg-[rgba(255,252,247,0.04)] text-ivory-50 placeholder:text-[rgba(245,237,214,0.3)] border border-[rgba(201,162,39,0.15)] focus:border-gold-500 outline-none transition-all text-[14px]"
              />
            </div>
          )}

          <div>
            <label className="block text-caption text-gold-500 font-medium mb-1.5 uppercase tracking-[1px] text-[11px]">
              {t('auth.newPassword', 'New Password')}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-400">
                <FaLock size={14} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('auth.newPasswordPlaceholder', 'Enter new password')}
                className="w-full p-3 pl-10 pr-10 rounded-xl bg-[rgba(255,252,247,0.04)] text-ivory-50 placeholder:text-[rgba(245,237,214,0.3)] border border-[rgba(201,162,39,0.15)] focus:border-gold-500 outline-none transition-all text-[14px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ivory-400 hover:text-gold-500 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>

            {/* Strength Meter Bar */}
            {newPassword && (
              <div className="mt-2 space-y-1.5">
                <div className="flex gap-1 h-1.5 w-full bg-obsidian-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strengthScore >= 1 ? (strengthScore === 1 ? 'bg-red-500 w-1/4' : strengthScore === 2 ? 'bg-amber-500 w-1/2' : strengthScore === 3 ? 'bg-yellow-500 w-3/4' : 'bg-emerald-500 w-full') : 'w-0'}`} />
                </div>
                
                {/* Requirements Checklist */}
                <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                  <div className={`flex items-center gap-1.5 ${hasLength ? 'text-emerald-400' : 'text-ivory-400'}`}>
                    {hasLength ? <FaCheck size={9} /> : <FaTimes size={9} />}
                    <span>{t('auth.reqLength', '8+ characters')}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-400' : 'text-ivory-400'}`}>
                    {hasUpper ? <FaCheck size={9} /> : <FaTimes size={9} />}
                    <span>{t('auth.reqUppercase', 'Uppercase letter')}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-400' : 'text-ivory-400'}`}>
                    {hasLower ? <FaCheck size={9} /> : <FaTimes size={9} />}
                    <span>{t('auth.reqLowercase', 'Lowercase letter')}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasDigit ? 'text-emerald-400' : 'text-ivory-400'}`}>
                    {hasDigit ? <FaCheck size={9} /> : <FaTimes size={9} />}
                    <span>{t('auth.reqNumber', 'Number (0-9)')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-caption text-gold-500 font-medium mb-1.5 uppercase tracking-[1px] text-[11px]">
              {t('auth.confirmPassword', 'Confirm New Password')}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-400">
                <FaLock size={14} />
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('auth.confirmPasswordPlaceholder', 'Confirm new password')}
                className="w-full p-3 pl-10 pr-10 rounded-xl bg-[rgba(255,252,247,0.04)] text-ivory-50 placeholder:text-[rgba(245,237,214,0.3)] border border-[rgba(201,162,39,0.15)] focus:border-gold-500 outline-none transition-all text-[14px]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ivory-400 hover:text-gold-500 transition-colors"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-[11px] text-red-400 mt-1">{t('auth.passwordsDoNotMatch', 'Passwords do not match.')}</p>
            )}
          </div>

          <Button
            variant="gold-glow"
            type="submit"
            className="w-full py-3.5 font-bold uppercase tracking-[1.5px] text-[13px] mt-4 flex justify-center items-center"
            disabled={isLoading || !isPasswordValid || newPassword !== confirmPassword}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              t('auth.updatePasswordBtn', 'Update Password')
            )}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-[rgba(201,162,39,0.1)] pt-6">
          <Link to="/login" className="text-gold-500 font-semibold hover:underline text-body-sm">
            ← {t('auth.backToSignIn', 'Back to Sign In')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
