import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { staggerContainer, fadeInUp, accordionContent } from '../animations/variants';
import { useCmsBlock } from '../hooks/useCmsBlock';

const FAQ = () => {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState(null);
  const { data: cmsData } = useCmsBlock('faq_page');

  const categories = [
    { id: 'general', title: t('faq.cat.general', 'General Reservations'), count: 10 },
    { id: 'prices', title: t('faq.cat.prices', 'Prices and Promotions'), count: 7 },
    { id: 'changes', title: t('faq.cat.changes', 'Changes, Cancellations, and Refunds'), count: 6 },
    { id: 'visas', title: t('faq.cat.visas', 'Visas and Entry Requirements'), count: 5 },
    { id: 'flights', title: t('faq.cat.flights', 'Flights and Airports'), count: 4 },
    { id: 'hotels', title: t('faq.cat.hotels', 'Hotels and Rooms'), count: 4 },
    { id: 'itinerary', title: t('faq.cat.itinerary', 'Itinerary and Activities'), count: 7 },
    { id: 'tours', title: t('faq.cat.tours', 'Tours, Guides, and Safety'), count: 4 },
    { id: 'transportation', title: t('faq.cat.transportation', 'Transportation'), count: 2 },
    { id: 'travelers', title: t('faq.cat.travelers', 'Travelers and Special Requests'), count: 4 },
    { id: 'packing', title: t('faq.cat.packing', 'What to Pack and Trip Preparation'), count: 3 },
    { id: 'egypt', title: t('faq.cat.egypt', 'Egypt'), count: 2 },
    { id: 'turkey', title: t('faq.cat.turkey', 'Turkey'), count: 2 },
    { id: 'jordan', title: t('faq.cat.jordan', 'Jordan'), count: 2 },
    { id: 'dubai', title: t('faq.cat.dubai', 'Dubai / UAE'), count: 2 },
  ];

  const getItems = (catId, count) => {
    const items = [];
    for (let i = 1; i <= count; i++) {
      const q = t(`faq.${catId}.q${i}`, '');
      const a = t(`faq.${catId}.a${i}`, '');
      if (q && a) {
        items.push({ id: `${catId}-${i}`, question: q, answer: a, catId });
      }
    }
    return items;
  };

  return (
    <div className="w-full min-h-screen bg-ivory-50 pb-24 font-body">
      {/* Header Banner */}
      <section className="relative min-h-[30vh] pt-32 pb-12 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-obsidian-900"></div>
        <div className="absolute inset-0 bg-hero-overlay"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <span className="text-gold-500 uppercase tracking-widest text-caption block mb-2">
            {cmsData?.helpCenter || t('faq.helpCenter', 'HELP CENTER')}
          </span>
          <h1 className="text-display-xl text-white font-display">
            {cmsData?.heading || t('faq.heading', 'Frequently Asked Questions')}
          </h1>
        </motion.div>
      </section>

      {/* FAQ Content */}
      <section className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Category Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setTimeout(() => {
                    const el = document.getElementById(`cat-${cat.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className="px-5 py-2.5 rounded-full border transition-all duration-300 font-medium tracking-wide text-sm bg-[#1A1A2E] text-gold-500 border-obsidian-700 hover:bg-gold-500 hover:text-[#1A1A2E] hover:border-gold-500 shadow-sm"
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-16"
        >
          {categories.map((cat) => {
            const items = getItems(cat.id, cat.count);
            if (items.length === 0) return null;

            return (
              <motion.div key={cat.id} variants={fadeInUp}>
                <h2 id={`cat-${cat.id}`} className="text-display-md text-obsidian-900 font-display mb-8 pb-3 border-b-2 border-gold-500">
                  {cat.title}
                </h2>
                <div className="flex flex-col gap-4">
                  {items.map((item) => {
                    const isOpen = openId === item.id;
                    return (
                      <div
                        key={item.id}
                        id={`faq-${item.id}`}
                        className="bg-[#1A1A2E] rounded-xl overflow-hidden border border-obsidian-800 transition-all duration-300"
                      >
                        <button
                          onClick={() => setOpenId(isOpen ? null : item.id)}
                          className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                        >
                          <span className="text-gold-500 font-semibold text-body-md pr-4">
                            {item.question}
                          </span>
                          <span className={`w-7 h-7 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0 text-gold-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                            <FaChevronDown className="w-3 h-3" />
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key="content"
                              variants={accordionContent}
                              initial="collapsed"
                              animate="expanded"
                              exit="collapsed"
                            >
                              <div className="px-5 pb-5 pt-2 border-t border-obsidian-800 text-white text-body-md leading-relaxed">
                                {item.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
};

export default FAQ;
