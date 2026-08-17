import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../animations/variants';

const IncludedNotIncluded = ({
  includedItems = [],
  excludedItems = [],
  excursionsItems = [],
  inclusionsTitle,
  exclusionsTitle,
  excursionsTitle,
  sectionTitle
}) => {
  const { t } = useTranslation();

  const translateKey = (item) => {
    if (!item) return '';
    // If the key is already dot-notated or has underscores, try translating directly
    if (item.includes('.') || item.includes('_')) {
      const translated = t(item);
      if (translated !== item) return translated;
    }
    // Check if it's stored in data translations namespace
    const translatedData = t(`data.${item}`);
    if (translatedData !== `data.${item}`) return translatedData;
    
    return t(item, item);
  };

  const hasExcursions = Array.isArray(excursionsItems) && excursionsItems.length > 0;
  const columnsCount = hasExcursions ? 3 : 2;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mt-16 bg-ivory-50 dark:bg-[#1a1a30] p-8 rounded-2xl shadow-sm border border-obsidian-900/5 dark:border-gray-700 text-left rtl:text-right"
    >
      <h2
        className="text-display-md text-obsidian-900 dark:text-ivory-50 mb-8 font-display font-semibold"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {sectionTitle || t('tourDetail.incExc', "What's Included & Excluded")}
      </h2>
      <div className={`grid grid-cols-1 md:grid-cols-${columnsCount} gap-8`}>
        {/* Included Column */}
        {Array.isArray(includedItems) && includedItems.length > 0 && (
          <div>
            <h3 className="text-body-lg font-semibold text-sage-700 dark:text-sage-300 mb-4 flex items-center gap-2 font-display">
              {inclusionsTitle || t('tourDetail.included', 'Included')}
            </h3>
            <ul className="space-y-3">
              {includedItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-obsidian-700 dark:text-ivory-200">
                  <FaCheckCircle className="text-sage-500 dark:text-sage-300 mt-1 flex-shrink-0" />
                  <span>{translateKey(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Excluded Column */}
        {Array.isArray(excludedItems) && excludedItems.length > 0 && (
          <div>
            <h3 className="text-body-lg font-semibold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2 font-display">
              {exclusionsTitle || t('tourDetail.excluded', 'Not Included')}
            </h3>
            <ul className="space-y-3">
              {excludedItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-obsidian-700 dark:text-ivory-200">
                  <FaTimesCircle className="text-red-500 dark:text-red-400 mt-1 flex-shrink-0" />
                  <span>{translateKey(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Optional Excursions Column */}
        {hasExcursions && (
          <div>
            <h3 className="text-body-lg font-semibold text-gold-700 dark:text-gold-400 mb-4 flex items-center gap-2 font-display">
              {excursionsTitle || t('tour.optionalExcursions', 'Optional Excursions')}
            </h3>
            <ul className="space-y-3">
              {excursionsItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-obsidian-700 dark:text-ivory-200">
                  <FaCheckCircle className="text-gold-500 mt-1 flex-shrink-0" />
                  <span>{translateKey(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default IncludedNotIncluded;
