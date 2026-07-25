import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaPhone, FaWhatsapp } from 'react-icons/fa';
import { staggerContainer, fadeInUp } from '../animations/variants';
import Button from '../components/ui/Button';
import ContactForms from '../components/contact/ContactForms';

const Contact = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('contact.title', 'Contact Us | Luxury Travel')}</title>
        <meta name="description" content={t('contact.seoDesc', 'Get in touch with our luxury travel concierges to start crafting your bespoke journey to Egypt, Jordan, and Turkey.')} />
      </Helmet>
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-obsidian-900"></div>
        <motion.div className="relative z-10 text-center" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.h1 variants={fadeInUp} className="text-display-xl text-ivory-50">{t('nav.contact')}</motion.h1>
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
                      <a href="tel:+201149401111" className="hover:text-gold-500 transition-colors flex items-center gap-2">
                        <FaWhatsapp className="text-gold-500 text-sm" /> +20 114 940 1111
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

            {/* Real Google Map */}
            <div className="w-full h-[300px] lg:h-[450px] rounded-[16px] overflow-hidden border border-[rgba(201,162,39,0.2)] shadow-[0_0_32px_rgba(201,162,39,0.1)]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453!2d31.2180!3d30.0090!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDA1JzMyLjQiTiAzMcKwMTMnMDQuOCJF!5e0!3m2!1sen!2seg!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Form */}
          <div className="lg:w-1/2 p-12">
            <h3 className="text-display-md text-obsidian-900 mb-6">{t('contact.sendMessage', 'Send us a message')}</h3>
            <form className="flex flex-col gap-6" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const firstName = form.firstName.value;
              const lastName = form.lastName.value;
              const email = form.email.value;
              const phone = form.phone.value;
              const message = form.message.value;
              
              try {
                const { default: api } = await import('../utils/api');
                const payload = {
                  name: `${firstName} ${lastName}`.trim(),
                  firstName,
                  lastName,
                  email,
                  phone: phone || undefined,
                  subject: 'Contact Form Submission',
                  message,
                  type: 'inquiry',
                };
                await api.post('/contact', payload).catch(() => api.post('/contact-submissions', payload));
                alert(t('contact.success', 'Your message has been sent successfully.'));
                form.reset();
              } catch (err) {
                console.error(err);
                alert(t('contact.error', 'There was an error sending your message.'));
              }
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input name="firstName" type="text" placeholder={t('contact.firstName', 'First Name')} required className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors" />
                <input name="lastName" type="text" placeholder={t('contact.lastName', 'Last Name')} required className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors" />
              </div>
              <input name="email" type="email" placeholder={t('contact.emailPlaceholder', 'Email Address')} required className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors" />
              <input name="phone" type="tel" placeholder={t('contact.phonePlaceholder', 'Phone Number')} className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors" />
              <textarea name="message" placeholder={t('contact.messagePlaceholder', 'How can we help you craft your perfect journey?')} rows="5" required className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors resize-none"></textarea>
              <Button type="submit" variant="gold-glow" className="self-start px-8">{t('contact.sendBtn', 'Send Message')}</Button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Contact;
