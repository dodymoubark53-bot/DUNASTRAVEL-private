import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaPhone, FaWhatsapp } from 'react-icons/fa';
import { staggerContainer, fadeInUp } from '../animations/variants';
import Button from '../components/ui/Button';
import ContactForms from '../components/contact/ContactForms';
import { useToast } from '../context/ToastContext';
import FormFeedback from '../components/ui/FormFeedback';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('contact.title', 'Contact Us | Luxury Travel')}</title>
        <meta name="description" content={t('contact.seoDesc', 'Get in touch with our luxury travel concierges to start crafting your bespoke journey to Egypt, Jordan, and Turkey.')} />
      </Helmet>
      <section className="relative min-h-[55vh] md:min-h-[65vh] pt-36 pb-24 flex items-center justify-center overflow-hidden px-4">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://igtsservice.com/uploads/files/67995_1649936390.jpg"
            alt="Dunas Travel Concierge Contact"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/75 via-obsidian-900/50 to-obsidian-950/85"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12)_0%,transparent_70%)] pointer-events-none"></div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Content */}
        <motion.div
          className="relative z-10 text-center max-w-3xl mx-auto px-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-gold-500/40 text-gold-300 text-xs font-semibold uppercase tracking-widest mb-4 shadow-lg backdrop-blur-md">
            <span>✨</span>
            <span>{t('contact.subtitleBadge', 'Dunas Travel Concierge')}</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-5xl md:text-6xl font-bold font-serif text-ivory-50 tracking-wide drop-shadow-lg leading-tight"
          >
            {t('contact.heroTitle', t('nav.contact', 'اتصل بنا'))}
          </motion.h1>

          <motion.div variants={fadeInUp} className="w-20 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto my-4 rounded-full" />

          <motion.p
            variants={fadeInUp}
            className="text-ivory-200/90 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed font-light drop-shadow"
          >
            {t('contact.heroSubtitle', 'نحن هنا لمساعدتك في تخطيط وتصميم رحلتك الفاخرة المخصصة بحرفية عالية.')}
          </motion.p>
        </motion.div>
      </section>

      <ContactForms />

      <section className="container mx-auto px-6 py-24 relative z-20">
        <div className="bg-ivory-50 rounded-2xl shadow-card overflow-hidden flex flex-col lg:flex-row">

          {/* Contact Info & Map placeholder */}
          <div className="lg:w-1/2 bg-obsidian-900 text-ivory-50 p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-display-md text-3xl mb-8">{t('contact.getInTouch', 'Get in Touch')}</h2>
              <div className="flex flex-col gap-6 mb-8">
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-gold-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <div>
                    <h4 className="text-caption text-gold-500 uppercase tracking-widest mb-1">{t('contact.office', 'Address')}</h4>
                    <p className="text-body-md text-ivory-300">
                      5 Hussein Said St, Old Hadayk El Ahram First floor Flat 102 – 103<br />
                      Haram - Giza – Egypt
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-gold-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <div>
                    <h4 className="text-caption text-gold-500 uppercase tracking-widest mb-1">{t('contact.phoneLabel', 'Phone')}</h4>
                    <div className="flex flex-col gap-2 text-body-md text-ivory-300">
                      <a href="tel:+20233746643" className="hover:text-gold-500 transition-colors flex items-center gap-2">
                        <FaPhone className="text-gold-500 text-sm" /> 02 33746643
                      </a>
                      <a href="tel:+20233746654" className="hover:text-gold-500 transition-colors flex items-center gap-2">
                        <FaPhone className="text-gold-500 text-sm" /> 02 33746654
                      </a>
                      <a href="https://wa.me/20114940111" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors flex items-center gap-2">
                        <FaWhatsapp className="text-gold-500 text-sm" /> +20 114 940 111
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-gold-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <div>
                    <h4 className="text-caption text-gold-500 uppercase tracking-widest mb-1">{t('contact.emailLabel', 'Email')}</h4>
                    <div className="flex flex-col gap-1 text-body-md text-ivory-300">
                      <a href="mailto:info@dunas-travel.com" aria-label="Send us an email at info@dunas-travel.com" className="hover:text-gold-500 transition-colors">info@dunas-travel.com</a>
                      <a href="mailto:attia@dunas-travel.com" aria-label="Send us an email at attia@dunas-travel.com" className="hover:text-gold-500 transition-colors">attia@dunas-travel.com</a>
                      <a href="mailto:Spain@dunas-travel.com" aria-label="Send us an email at Spain@dunas-travel.com" className="hover:text-gold-500 transition-colors">Spain@dunas-travel.com</a>
                      <a href="mailto:booking@dunas-travel.com" aria-label="Send us an email at booking@dunas-travel.com" className="hover:text-gold-500 transition-colors">booking@dunas-travel.com</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Google Map clickable link */}
            <a
              href="https://maps.app.goo.gl/oA84mQGwUsHWo4kt8"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-[300px] lg:h-[450px] rounded-[16px] overflow-hidden border border-[rgba(201,162,39,0.2)] shadow-[0_0_32px_rgba(201,162,39,0.1)] relative group cursor-pointer"
              title={t('contact.openMaps', 'Open in Google Maps')}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.026723223011!2d31.2052!3d30.0076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAwJzI3LjQiTiAzMcKwMTInMTg3LjJF!5e0!3m2!1sen!2seg!4v1680000000000"
                width="100%"
                height="100%"
                style={{ border: 0, pointerEvents: 'none' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="absolute inset-0 bg-obsidian-950/20 group-hover:bg-transparent transition-all duration-300 flex items-center justify-center">
                <span className="bg-obsidian-900/85 backdrop-blur-md text-gold-400 font-bold px-5 py-2.5 rounded-full border border-gold-500/40 text-xs shadow-xl group-hover:scale-105 transition-all">
                  📍 {t('contact.openGoogleMaps', 'تواصل معنا - فتح الموقع على خرائط جوجل')}
                </span>
              </div>
            </a>
          </div>

          {/* Form */}
          <div className="lg:w-1/2 p-12">
            <h3 className="text-display-md text-obsidian-900 mb-6">{t('contact.sendMessage', 'Send us a message')}</h3>
            
            {feedback && (
              <div className="mb-6">
                <FormFeedback type={feedback.type} message={feedback.message} />
              </div>
            )}

            <form className="flex flex-col gap-6" onSubmit={async (e) => {
              e.preventDefault();
              setFeedback(null);
              setIsSubmitting(true);
              const form = e.target;
              const firstName = form.firstName.value;
              const lastName = form.lastName.value;
              const email = form.email.value;
              const phone = form.phone.value;
              const message = form.message.value;
              
              try {
                const { default: api } = await import('../utils/api');
                const payload = {
                  firstName,
                  lastName,
                  email,
                  phone: phone || undefined,
                  subject: 'Contact Form Submission',
                  message: message.length >= 10 ? message : `${message} (Inquiry)`,
                  locale: String(i18n.language || 'en').toLowerCase().split('-')[0],
                };
                await api.post('/contact', payload);
                const successMsg = t('contact.success', 'Your message has been sent successfully. Our concierge will contact you shortly.');
                setFeedback({ type: 'success', message: successMsg });
                toast?.success?.(successMsg, { title: t('contact.successTitle', 'Message Received') });
                form.reset();
              } catch (err) {
                console.error(err);
                const errorMsg = t('contact.error', 'There was an error sending your message. Please try again.');
                setFeedback({ type: 'error', message: errorMsg });
                toast?.error?.(errorMsg, { title: t('contact.errorTitle', 'Submission Error') });
              } finally {
                setIsSubmitting(false);
              }
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input name="firstName" type="text" placeholder={t('contact.firstName', 'First Name')} required className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors" />
                <input name="lastName" type="text" placeholder={t('contact.lastName', 'Last Name')} required className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors" />
              </div>
              <input name="email" type="email" placeholder={t('contact.emailPlaceholder', 'Email Address')} required className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors" />
              <input name="phone" type="tel" placeholder={t('contact.phonePlaceholder', 'Phone Number')} className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors" />
              <textarea name="message" placeholder={t('contact.messagePlaceholder', 'How can we help you craft your perfect journey?')} rows="5" required className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors resize-none"></textarea>
              <Button type="submit" variant="gold-glow" className="self-start px-8" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin"></span>
                    {t('common.sending', 'Sending...')}
                  </span>
                ) : (
                  t('contact.sendBtn', 'Send Message')
                )}
              </Button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Contact;
