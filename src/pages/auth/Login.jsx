import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { FaEye, FaEyeSlash, FaUserCircle, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, user } = useAuth();

  if (user) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      setError(t('auth.invalidCredentials', 'Invalid email or password'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 bg-obsidian-900 flex items-center justify-center px-4 font-body">
      <Helmet>
        <title>{t('auth.loginTitle', 'Sign In | Dunas Travel')}</title>
      </Helmet>

      <div className="w-full max-w-md bg-[#121118] border border-[rgba(201,162,39,0.2)] rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(201,162,39,0.3)]">
            <FaUserCircle size={32} className="text-obsidian-900" />
          </div>
          <h1 className="text-display-sm text-ivory-50 font-display font-semibold mb-2">
            {t('auth.welcomeBack', 'Welcome Back')}
          </h1>
          <p className="text-body-sm text-ivory-400">
            {t('auth.signInDesc', 'Sign in to access your bespoke itineraries.')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-body-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-caption text-gold-500 font-medium mb-1.5 uppercase tracking-[1px] text-[11px]">
              {t('auth.emailAddress', 'Email Address')}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-400">
                <FaEnvelope size={14} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder', 'Enter your email')}
                className="w-full p-3 pl-10 rounded-xl bg-[rgba(255,252,247,0.04)] text-ivory-50 placeholder:text-[rgba(245,237,214,0.3)] border border-[rgba(201,162,39,0.15)] focus:border-gold-500 outline-none transition-all text-[14px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-caption text-gold-500 font-medium mb-1.5 uppercase tracking-[1px] text-[11px]">
              {t('auth.password', 'Password')}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-400">
                <FaLock size={14} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
                className="w-full p-3 pl-10 pr-10 rounded-xl bg-[rgba(255,252,247,0.04)] text-ivory-50 placeholder:text-[rgba(245,237,214,0.3)] border border-[rgba(201,162,39,0.15)] focus:border-gold-500 outline-none transition-all text-[14px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ivory-400 hover:text-gold-500 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gold-500/30 bg-transparent text-gold-500 focus:ring-gold-500 accent-gold-500" />
              <span className="text-body-sm text-ivory-400">{t('auth.rememberMe', 'Remember me')}</span>
            </label>
            <Link to="/forgot-password" className="text-caption text-gold-500 hover:text-gold-400 transition-colors font-medium">
              {t('auth.forgotPassword', 'Forgot Password?')}
            </Link>
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
              t('auth.loginButton', 'Sign In')
            )}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-[rgba(201,162,39,0.1)] pt-6">
          <p className="text-body-sm text-ivory-400">
            {t('auth.noAccount', "Don't have an account?")}{' '}
            <Link to="/register" className="text-gold-500 font-semibold hover:underline">
              {t('auth.createAccountBtn', 'Create Account')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
