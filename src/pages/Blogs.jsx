import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, cardHover } from '../animations/variants';
import { useBlogs } from '../hooks/useBlogs';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import ErrorState from '../components/ui/ErrorState';
import { FaChevronRight, FaChevronLeft, FaClock, FaCalendarAlt, FaPlane } from 'react-icons/fa';

const Blogs = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const { blogs, loading, error } = useBlogs();

  const categoryColors = {
    'History': 'from-amber-600 to-yellow-500',
    'Travel Guide': 'from-emerald-600 to-teal-500',
    "Culture & Shopping": 'from-purple-600 to-pink-500',
    'Adventure': 'from-orange-600 to-red-500',
    'Nature & Camping': 'from-green-600 to-lime-500',
    'Food & Drink': 'from-rose-600 to-red-500',
    'Travel Tips': 'from-blue-600 to-cyan-500',
    'Wellness': 'from-violet-600 to-indigo-500',
  };

  const getCategoryGradient = (cat) => categoryColors[cat] || 'from-gold-500 to-amber-500';

  const perPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBlogs = blogs.filter(blog => !blog.draft && blog.status !== 'draft');
  const totalPages = Math.ceil(filteredBlogs.length / perPage) || 1;
  const startIndex = (currentPage - 1) * perPage;
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + perPage);

  if (loading) return <SkeletonLoader count={6} />;
  if (error) return <ErrorState message={error.message || 'Failed to load blogs'} />;

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="w-full bg-[#F8F9FF] dark:bg-[#0f0f1a] pb-24">
      <Helmet>
        <title>{t('blogs.seoTitle', 'Travel Journal & Blogs | Dunas Travel')}</title>
        <meta name="description" content={t('blogs.seoDesc', 'Read our latest travel tips, stories, and guides for exploring the Middle East in pure luxury.')} />
      </Helmet>

      {/* Main Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
            alt="Blogs Hero"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-obsidian-900/60 bg-gradient-to-t from-obsidian-900 to-transparent"></div>
        </div>

        <motion.div
          className="relative z-10 container mx-auto px-6 text-center mt-12"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span variants={fadeInUp} className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-4">
            {t('blogs.subtitle', 'Stories, guides, and inspiration from the world of luxury travel')}
          </motion.span>
          <motion.h1 variants={fadeInUp} className="text-display-xl text-ivory-50 mb-6">
            {t('blogs.title', 'Travel Journal')}
          </motion.h1>
        </motion.div>
      </section>

      {/* Blog Grid */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex justify-between items-center mb-8 border-b border-gray-200/50 dark:border-obsidian-800 pb-4">
          <p className="text-body-sm text-gray-500 dark:text-gray-400 font-medium">
            {t('blogs.showingCount', 'Showing {{count}} travel articles', { count: filteredBlogs.length })}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {currentBlogs.map(blog => (
            <motion.article key={blog.id} variants={fadeInUp}>
              <motion.div
                className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] group h-full flex flex-col border border-gray-100/50 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] hover:-translate-y-1"
                variants={cardHover}
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                <Link to={`/blogs/${blog.slug}`} className="relative block overflow-hidden" style={{ height: '240px' }}>
                  <div className={`absolute top-4 left-4 z-10 bg-gradient-to-r ${getCategoryGradient(blog.category)} text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg font-semibold`}>
                    {t(`blogs.cat.${blog.category}`, blog.category)}
                  </div>
                  {blog.relatedTour && (
                    <Link to={blog.relatedTour.path} onClick={(e) => e.stopPropagation()} className="absolute top-4 right-4 z-10 bg-gold-500/90 backdrop-blur-sm text-obsidian-900 text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg font-semibold flex items-center gap-1 hover:bg-gold-500 transition-colors">
                      <FaPlane size={8} />
                      {blog.relatedTour.label}
                    </Link>
                  )}

                  <img
                    src={blog.img || blog.coverImage || "/imgs/hero.png"}
                    alt={t(`blogs.${blog.title}`, blog.title)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>

                <div className="p-5 md:p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-caption text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt size={10} />
                      {blog.date || (blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Recent')}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock size={10} />
                      {blog.readTime || '5 min read'}
                    </span>
                  </div>

                  <Link to={`/blogs/${blog.slug}`}>
                    <h3 className="text-lg md:text-xl font-bold text-obsidian-900 mb-3 line-clamp-2 hover:text-gold-500 transition-colors cursor-pointer leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {t(`blogs.${blog.title}`, blog.title)}
                    </h3>
                  </Link>

                  <p className="text-body-sm text-[#4A4A6E] line-clamp-3 mb-4 leading-relaxed">
                    {t(`blogs.${blog.excerpt}`, blog.excerpt)}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <Link to={`/blogs/${blog.slug}`} className="inline-flex items-center gap-2 text-body-sm text-gold-500 hover:text-gold-700 font-semibold transition-all group/link">
                      <span>{t('blogs.readMore', 'Read More')}</span>
                      <FaChevronRight size={10} className={`transition-transform duration-300 group-hover/link:translate-x-1 ${isRtl ? 'rotate-180 group-hover/link:-translate-x-1' : ''}`} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-16 gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-3 rounded-full border transition-all duration-300 ${
              currentPage === 1
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gold-500/30 text-gold-500 hover:bg-gold-500 hover:text-white hover:border-gold-500'
            } ${isRtl ? 'rotate-180' : ''}`}
          >
            <FaChevronLeft size={14} />
          </button>

          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-10 h-10 rounded-full text-body-sm font-semibold transition-all duration-300 ${
                page === currentPage
                  ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30'
                  : 'border border-gray-200 text-obsidian-600 hover:border-gold-500 hover:text-gold-500'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-3 rounded-full border transition-all duration-300 ${
              currentPage === totalPages
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gold-500/30 text-gold-500 hover:bg-gold-500 hover:text-white hover:border-gold-500'
            } ${isRtl ? 'rotate-180' : ''}`}
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
