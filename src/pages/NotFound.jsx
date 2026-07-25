import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCompass, FaHome } from 'react-icons/fa';

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-obsidian-900 text-ivory-50 flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 text-4xl shadow-[0_0_30px_rgba(201,162,39,0.2)]">
          <FaCompass className="animate-spin-slow" />
        </div>
        <h1 className="text-6xl font-bold text-gold-400 font-display">404</h1>
        <h2 className="text-2xl font-semibold text-ivory-100">
          {t('notFound.title', 'Destination Not Found')}
        </h2>
        <p className="text-ivory-300 text-sm leading-relaxed">
          {t('notFound.desc', 'The page or travel itinerary you are looking for does not exist or has been moved.')}
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gold-500 text-obsidian-900 font-semibold hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20"
          >
            <FaHome />
            {t('notFound.goHome', 'Return to Home')}
          </Link>
          <Link
            to="/destinations"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-obsidian-800 text-gold-400 border border-gold-500/30 font-semibold hover:bg-obsidian-700 transition-colors"
          >
            {t('notFound.exploreDestinations', 'Explore Destinations')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
