import { useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import { useBlog } from '../../hooks/useBlog';
import { useBlogs } from '../../hooks/useBlogs';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import ErrorState from '../../components/ui/ErrorState';
import NotFound from '../NotFound';
import { FaChevronRight, FaCalendarAlt, FaClock, FaTag, FaShareAlt, FaPlane, FaArrowRight } from 'react-icons/fa';

const BlogDetails = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const { slug } = useParams();
  const navigate = useNavigate();
  const { blog, loading, error } = useBlog(slug);
  const { blogs: allBlogs } = useBlogs();

  const rawTourLinks = [
    { name: 'Cairo Express com Alexandria', path: '/tours/cairo-express-alexandria-5d' },
    { name: 'Cairo Express', path: '/tours/cairo-express-4d' },
    { name: 'Egito Clássico II', path: '/tours/egito-classico-ii-9d' },
    { name: 'Egito Clássico', path: '/tours/egito-classico-8d' },
    { name: 'Egito Histórico', path: '/tours/egito-historico-10d' },
    { name: 'O GRANDE RAMSES', path: '/tours/grande-ramses-10d' },
    { name: 'Grande Ramses', path: '/tours/grande-ramses-10d' },
    { name: 'Tesouros do Egito com Alexandria', path: '/tours/tesouros-egipto-9d' },
    { name: 'Lo Mejor de Grecia', path: '/tours/lo-mejor-de-grecia-9d' },
    { name: 'Turquía Legendaria', path: '/programs/turkey/reg-01-legendary-turkey' },
    { name: 'Legendary Turkey', path: '/programs/turkey/reg-01-legendary-turkey' },
    { name: 'Tunisia 8 Days Desert & Sea', path: '/destinations/tunisia' },
    { name: 'Estrellas del Medio Oriente', path: '/programs/multi-country/estrellas-medio-oriente-19d' },
    { name: 'Cairo and Athens 11 Days', path: '/programs/multi-country/cairo-and-athens-11-days' },
    { name: 'Essences of Egypt and Turkey', path: '/programs/multi-country/essences-of-egypt-and-turkey-15-days' },
    { name: 'Marvels of Dubai and Turkey', path: '/programs/multi-country/marvels-of-dubai-and-turkey-14-days' },
    { name: 'Petra by Night', path: '/programs/jordan/reg-15-classic-jordan' },
    { name: 'Petra', path: '/programs/jordan/reg-15-classic-jordan' },
    { name: 'Wadi Rum Desert', path: '/programs/jordan/reg-16-jordan-with-desert' },
    { name: 'Dead Sea Experience', path: '/programs/jordan/reg-17-jordan-with-desert-and-dead-sea' },
    { name: 'Hot Air Balloon', path: '/programs/turkey/reg-06-heart-of-turkey' },
    { name: 'hot air balloon', path: '/programs/turkey/reg-06-heart-of-turkey' },
    { name: 'Nile Cruise', path: '/tours/egito-classico-8d' },
    { name: 'Nile River', path: '/tours/egito-classico-8d' },
    { name: 'Cruzeiro no Nilo', path: '/tours/egito-classico-8d' },
    { name: 'felucca', path: '/tours/egito-classico-8d' },
    { name: 'DUNAS TRAVELers', path: '/' },
    { name: 'DUNAS TRAVELer', path: '/' },
    { name: 'DUNAS TRAVEL', path: '/' },
  ];

  // Sort from longest to shortest to prevent partial string matching issues (e.g. Cairo Express matching inside Cairo Express com Alexandria)
  const tourLinks = [...rawTourLinks].sort((a, b) => b.name.length - a.name.length);

  const renderContent = (text) => {
    let result = text;
    tourLinks.forEach(({ name, path }) => {
      const regex = new RegExp(`(\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b)`, 'gi');
      result = result.replace(regex, `<a href="${path}" class="text-gold-500 hover:text-gold-700 font-semibold underline decoration-gold-500/30 hover:decoration-gold-500 transition-all">$1</a>`);
    });
    return result;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleContentClick = useCallback((e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault();
      navigate(href);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian-50 py-24 px-6 max-w-5xl mx-auto">
        <SkeletonLoader count={3} type="card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-obsidian-50 py-24 px-6 max-w-5xl mx-auto flex items-center justify-center">
        <ErrorState message="Failed to load article details." onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!blog) {
    return <NotFound />;
  }

  const blogList = (allBlogs && allBlogs.length > 0) ? allBlogs : [blog];
  const currentIndex = blogList.findIndex(b => b.slug === slug);
  const relatedArticles = [];
  for (let i = 1; i <= Math.min(3, blogList.length - 1); i++) {
    const idx = (currentIndex + i) % blogList.length;
    if (blogList[idx] && blogList[idx].slug !== slug) {
      relatedArticles.push(blogList[idx]);
    }
  }

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t(`blogs.${blog.title}`, blog.title)} | {t('blogs.seoJournal', 'Luxury Travel Journal')}</title>
        <meta name="description" content={t(`blogs.${blog.excerpt}`, blog.excerpt)} />
      </Helmet>

      {/* 1. Breadcrumb & Title — Tours Style */}
      <section className="pt-32 pb-10 bg-obsidian-900 text-center px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-2 text-caption text-gold-500 mb-4 uppercase tracking-wider">
            <Link to="/" className="hover:text-ivory-50 transition-colors">{t('nav.home', 'Home')}</Link>
            <FaChevronRight className={`text-[10px] ${isRtl ? 'rotate-180' : ''}`} />
            <Link to="/blogs" className="hover:text-ivory-50 transition-colors">{t('blogs.title', 'Journal')}</Link>
            <FaChevronRight className={`text-[10px] ${isRtl ? 'rotate-180' : ''}`} />
            <span className="text-ivory-300 truncate max-w-[200px]">{t(`blogs.${blog.title}`, blog.title)}</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display-xl text-ivory-50 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t(`blogs.${blog.title}`, blog.title)}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mt-6 text-caption text-gold-400"
          >
            <span className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
              <FaCalendarAlt size={10} className="text-gold-500" />
              {blog.date || (blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Recent')}
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
              <FaClock size={10} className="text-gold-500" />
              {blog.readTime || t('blogs.5 min read', '5 min read')}
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
              <FaTag size={10} className="text-gold-500" />
              {t(`blogs.cat.${blog.category}`, blog.category)}
            </span>
            {blog.relatedTour && (
              <Link to={blog.relatedTour.path} className="flex items-center gap-1.5 bg-gold-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-gold-500/30 hover:bg-gold-500/30 transition-colors">
                <FaPlane size={10} className="text-gold-400" />
                <span className="text-gold-400 font-medium">{blog.relatedTour.label}</span>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* 2. Hero Image — Tours Style */}
      <section className="relative w-full h-[50vh] lg:h-[70vh] overflow-hidden">
        <img
          src={blog.img || blog.coverImage || "/imgs/hero.png"}
          alt={t(`blogs.${blog.title}`, blog.title)}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </section>

      {/* Article Body */}
      <section className="container mx-auto px-6 mt-12 md:mt-16 mb-24 max-w-3xl" onClick={handleContentClick}>
        <motion.div
          className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-obsidian-900 prose-p:text-obsidian-600 prose-p:font-body prose-a:text-gold-500 hover:prose-a:text-gold-700 prose-strong:text-obsidian-900 prose-strong:font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {typeof blog.content === 'string' ? (
            <div
              className="leading-relaxed text-body-lg text-obsidian-700 space-y-6"
              dangerouslySetInnerHTML={{ __html: renderContent(blog.content) }}
            />
          ) : Array.isArray(blog.content) ? (
            blog.content.map((paragraph, idx) => {
              const translated = t(`blogs.${paragraph}`, paragraph);
              if (translated.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xl font-bold font-display text-obsidian-900 mt-10 mb-4">
                    {translated.replace('### ', '')}
                  </h3>
                );
              }
              if (translated.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-2xl md:text-3xl font-bold font-display text-obsidian-900 mt-12 mb-6 border-b border-gold-500/20 pb-3">
                    {translated.replace('## ', '')}
                  </h2>
                );
              }
              return (
                <p key={idx} className="mb-6 leading-relaxed text-body-lg text-obsidian-700" dangerouslySetInnerHTML={{ __html: renderContent(translated) }} />
              );
            })
          ) : null}
        </motion.div>

        {/* Related Trip CTA */}
        {blog.relatedTour && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 p-6 bg-gradient-to-r from-gold-500/10 via-gold-500/5 to-gold-500/10 rounded-2xl border border-gold-500/20"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <FaPlane className="text-gold-500 text-lg" />
                </div>
                <div>
                  <p className="text-caption text-obsidian-500 uppercase tracking-wider">{t('blogs.relatedTrip', 'Related Trip')}</p>
                  <p className="text-body-lg font-semibold text-obsidian-900">{blog.relatedTour.label}</p>
                </div>
              </div>
              <Link
                to={blog.relatedTour.path}
                className="inline-flex items-center gap-2 bg-gold-500 text-obsidian-900 px-6 py-3 rounded-full font-semibold text-body-sm hover:bg-gold-600 transition-colors shadow-lg shadow-gold-500/20"
              >
                {t('blogs.viewTrip', 'View Trip')}
                <FaArrowRight className={`text-xs ${isRtl ? 'rtl-flip' : ''}`} />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Share / Tags */}
        <div className="mt-12 pt-8 border-t border-obsidian-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-2 bg-ivory-50 rounded-full text-caption text-obsidian-500 shadow-sm border border-obsidian-900/5 hover:border-gold-300 transition-colors cursor-pointer flex items-center gap-1.5">
              <FaTag size={10} className="text-gold-500" />
              #{t(`blogs.cat.${blog.category}`, blog.category).replace(/\s+/g, '')}
            </span>
            <span className="px-4 py-2 bg-ivory-50 rounded-full text-caption text-obsidian-500 shadow-sm border border-obsidian-900/5 hover:border-gold-300 transition-colors cursor-pointer flex items-center gap-1.5">
              <FaTag size={10} className="text-gold-500" />
              #LuxuryTravel
            </span>
          </div>
          <button className="flex items-center gap-2 text-gold-500 hover:text-gold-700 font-medium text-body-sm transition-colors px-4 py-2 bg-ivory-50 rounded-full border border-obsidian-900/5 shadow-sm hover:border-gold-300">
            <FaShareAlt size={12} />
            {t('blogs.share', 'Share Article')}
          </button>
        </div>
      </section>

      {/* Related Articles */}
      <section className="bg-ivory-50 py-16 md:py-24 border-t border-obsidian-900/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-display-lg text-obsidian-900" style={{ fontFamily: "'Playfair Display', serif" }}>{t('blogs.related', 'Related Articles')}</h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-6"></div>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {relatedArticles.map((relBlog) => (
              <motion.article key={relBlog.id} variants={fadeInUp}>
                <div className="bg-white rounded-2xl overflow-hidden group h-full flex flex-col border border-gray-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] hover:-translate-y-1">
                  <Link to={`/blogs/${relBlog.slug}`} className="relative h-52 md:h-56 overflow-hidden block">
                    <div className="absolute top-4 left-4 z-10 bg-gold-500 text-obsidian-900 text-caption uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md font-semibold text-[10px]">
                      {t(`blogs.cat.${relBlog.category}`, relBlog.category)}
                    </div>
                    <img
                      src={relBlog.img || relBlog.coverImage || "/imgs/hero.png"}
                      alt={t(`blogs.${relBlog.title}`, relBlog.title)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                  <div className="p-5 md:p-6 flex flex-col flex-grow">
                    <Link to={`/blogs/${relBlog.slug}`}>
                      <h3 className="text-lg font-bold text-obsidian-900 mb-3 line-clamp-2 hover:text-gold-500 transition-colors cursor-pointer leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {t(`blogs.${relBlog.title}`, relBlog.title)}
                      </h3>
                    </Link>
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link to={`/blogs/${relBlog.slug}`} className="inline-flex items-center gap-2 text-body-sm text-gold-500 hover:text-gold-700 font-semibold uppercase tracking-wider transition-all">
                        <span className={isRtl ? 'rtl-flip' : ''}>{t('blogs.readMore', 'Read More →')}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetails;
