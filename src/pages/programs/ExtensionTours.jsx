import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaPlusCircle, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import AdvancedBooking from '../../components/booking/AdvancedBooking';

export const EXTENSION_PACKAGES = [
  {
    id: 'extension-hurghada',
    title: 'Hurghada Red Sea Extension',
    duration: '4 Days / 3 Nights',
    destinations: 'Hurghada Resort',
    img: 'https://res.cloudinary.com/degbrq3ck/image/upload/v1783030445/Gemini_Generated_Image_kenvzkkenvzkkenv_h9kz07.png',
    desc: 'Extend your Egypt holiday with 3 nights in an all-inclusive luxury resort on the Hurghada coast. Snorkeling, diving & beach relaxation.',
    price: 490
  },
  {
    id: 'extension-sharm',
    title: 'Sharm El Sheikh VIP Resort Extension',
    duration: '4 Days / 3 Nights',
    destinations: 'Sharm El Sheikh',
    img: 'https://images.unsplash.com/photo-1544971587-b842c27f8c14?q=80&w=1200',
    desc: 'Unwind at Ras Mohammed National Park coral reefs, luxury spa resort, and desert quad safari.',
    price: 550
  },
  {
    id: 'extension-siwa',
    title: 'Siwa Oasis & Western Desert Safari Extension',
    duration: '4 Days / 3 Nights',
    destinations: 'Siwa Oasis • Salt Lakes • Great Sand Sea',
    img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200',
    desc: 'Discover Cleopatra Springs, Shali Fortress, pristine turquoise salt pools, and sand dunes camping.',
    price: 680
  }
];

export default function ExtensionTours() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{`Egypt Extensions | Dunas Travel`}</title>
        <meta
          name="description"
          content="Extend your Egypt holiday with added beach resorts in Hurghada, Sharm El Sheikh, or desert adventures in Siwa Oasis."
        />
      </Helmet>

      {/* Hero Header */}
      <section className="relative w-full h-[450px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/degbrq3ck/image/upload/v1783030445/Gemini_Generated_Image_kenvzkkenvzkkenv_h9kz07.png"
            alt="Egypt Extensions"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-900/60 to-obsidian-900/30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center text-ivory-50 mt-16">
          <span className="inline-flex items-center gap-2 font-body text-gold-400 tracking-[0.25em] uppercase text-xs md:text-sm font-semibold mb-4 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30">
            <FaPlusCircle className="text-gold-500" /> Egypt Extensions
          </span>
          <h1 className="text-display-xl text-ivory-50 mb-6 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('dest.egypt.extensionTitle', 'Egypt Extensions')}
          </h1>
          <p className="text-body-lg text-ivory-300 max-w-2xl mx-auto font-light leading-relaxed">
            {t(
              'dest.egypt.extensionDesc',
              'Extend your Egypt journey with added destinations like Hurghada, Sharm El Sheikh, or Siwa Oasis.'
            )}
          </p>
        </div>
      </section>

      {/* Extension Packages Grid */}
      <section className="container mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {EXTENSION_PACKAGES.map((ext) => (
              <div key={ext.id} className="bg-white dark:bg-[#1a1a30] rounded-2xl overflow-hidden shadow-card border border-gold-500/10 p-6 flex flex-col md:flex-row gap-6">
                <img
                  src={ext.img}
                  alt={ext.title}
                  className="w-full md:w-64 h-48 object-cover rounded-xl shrink-0"
                />
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-xs font-bold text-gold-600 uppercase tracking-wider block mb-1">
                      {ext.duration}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-obsidian-900 dark:text-ivory-50 mb-2">
                      {ext.title}
                    </h3>
                    <p className="text-body-sm text-obsidian-600 dark:text-ivory-300 leading-relaxed mb-4">
                      {ext.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-gold-500/10 pt-4 mt-auto">
                    <span className="text-xl font-bold text-gold-600">${ext.price} / person</span>
                    <span className="text-xs font-semibold text-obsidian-500 bg-gold-500/10 px-3 py-1 rounded-full">
                      Add-on Available
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Booking Form */}
          <div className="lg:col-span-1 sticky top-24 self-start z-40">
            <div>
              <AdvancedBooking tourTitle="Egypt Extension Package" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
