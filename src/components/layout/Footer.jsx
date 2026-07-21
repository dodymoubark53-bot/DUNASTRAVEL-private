import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaRobot } from 'react-icons/fa';
import Logo from '../ui/Logo';
import TiT0Chat from '../ui/TiT0Chat';
import { useJaiderChat } from '../../context/JaiderChatContext';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { isOpen, setIsOpen } = useJaiderChat();

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 480);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const scrollToJaider = () => {
    const el = document.getElementById('jaider-footer-trigger');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setIsOpen(true);
  };

  return (
    <footer
      className="relative w-full text-white flex flex-col"
      style={{ background: 'linear-gradient(180deg, rgb(10,25,105) 0%, rgb(6,29,93) 50%, rgb(10,21,53) 100%)' }}
    >

      {/* Brand & Socials + TiT0 */}
      <style>{`
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes blink{50%{opacity:0}}
@keyframes dotSlideIn{from{opacity:0;transform:translateX(30px) scale(0.15)}to{opacity:1;transform:translateX(0) scale(1)}}
@keyframes arrowBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
#backToTop{
  position:fixed;left:28px;bottom:28px;
  width:54px;height:54px;border-radius:50%;
  border:1px solid var(--gold,#C9A227);
  background:var(--navy-deep,#081830);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;z-index:200;
  opacity:0;visibility:hidden;
  transform:translateY(16px);
  transition:opacity .35s ease,transform .35s ease,visibility .35s ease,border-color .3s ease,background .3s ease;
  box-shadow:0 14px 34px rgba(8,24,48,0.28);
}
#backToTop.show{opacity:1!important;visibility:visible!important;transform:translateY(0)!important}
#backToTop:hover{background:var(--gold,#C9A227);border-color:var(--gold,#C9A227)}
#backToTop svg{width:20px;height:20px;stroke:var(--gold-light,#E8CB72);transition:stroke .3s ease;animation:arrowBounce 1.6s ease-in-out infinite}
#backToTop:hover svg{stroke:var(--navy-deep,#081830)}

#askJaiderFloat{
  position:fixed;left:28px;bottom:96px;
  height:54px;border-radius:27px;
  border:1px solid var(--gold,#C9A227);
  background:var(--navy-deep,#081830);
  display:flex;align-items:center;justify-content:center;
  padding:0 20px;
  cursor:pointer;z-index:200;
  opacity:0;visibility:hidden;
  transform:translateY(16px);
  transition:opacity .35s ease,transform .35s ease,visibility .35s ease,border-color .3s ease,background .3s ease,color .3s ease;
  box-shadow:0 14px 34px rgba(8,24,48,0.28);
  color:var(--gold-light,#E8CB72);
  font-family:'Space Grotesk', sans-serif;
  font-weight:600;
  font-size:13px;
  gap:8px;
}
#askJaiderFloat.show{opacity:1!important;visibility:visible!important;transform:translateY(0)!important}
#askJaiderFloat:hover{background:var(--gold,#C9A227);border-color:var(--gold,#C9A227);color:var(--navy-deep,#081830)}
#askJaiderFloat svg{animation:float 3s ease-in-out infinite}

@media(max-width:640px){
  #backToTop{left:18px;bottom:18px;width:48px;height:48px}
  #askJaiderFloat{left:18px;bottom:76px;height:48px;border-radius:24px;padding:0 14px;font-size:11px;gap:6px}
}
`}</style>
      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 pt-8 sm:pt-10 lg:pt-12 flex flex-col sm:flex-row justify-between items-start gap-6">
        <div className="max-w-lg">
          <Link to="/" className="flex items-center mb-3">
            <Logo theme="light" height={85} />
          </Link>
          <p className="text-white text-base sm:text-lg font-bold leading-snug">
            {t('footer.desc', 'Since 2010, we craft unforgettable luxury travel experiences across Egypt, Jordan, Turkey, Tunisia, Greece, the Holy Land, Morocco, and Dubai.')}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a href="https://www.facebook.com/share/1EsALYq8cg/" aria-label="Visit our Facebook page" className="footer-social w-10 h-10 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white hover:bg-[#F5A623] hover:text-[#1A1A2E] transition-all duration-300 hover:scale-110">
              <FaFacebook size={16} />
            </a>
            <a href="https://www.instagram.com/dunas_travel?igsh=bWkyb2FhY2hoNnN" aria-label="Visit our Instagram page" className="footer-social w-10 h-10 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white hover:bg-[#F5A623] hover:text-[#1A1A2E] transition-all duration-300 hover:scale-110">
              <FaInstagram size={16} />
            </a>
            <a href="tel:+3374664302" aria-label="Call us" className="footer-social w-10 h-10 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white hover:bg-[#F5A623] hover:text-[#1A1A2E] transition-all duration-300 hover:scale-110">
              <FaPhone size={16} />
            </a>
          </div>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mt-12 sm:mt-0 shrink-0">
          <div
            id="jaider-footer-trigger"
            onClick={() => setIsOpen(prev => !prev)}
            className="relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 group"
            title="Chat with Jaider"
          >
            <img
              src="/imgs/tito-mascot.webp"
              alt="Jaider Mascot"
              width="150"
              height="150"
              className="w-[120px] sm:w-[150px] animate-[float_3s_ease-in-out_infinite] drop-shadow-[0_10px_25px_rgba(0,0,0,0.45)] group-hover:drop-shadow-[0_12px_30px_rgba(245,166,35,0.4)]"
            />
            {!isOpen && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 z-10 pointer-events-none">
                <TiT0Chat />
              </div>
            )}
          </div>
          <div
            onClick={() => setIsOpen(prev => !prev)}
            className={`flex flex-col items-center sm:items-start text-center ${isRtl ? 'sm:text-right' : 'sm:text-left'} gap-1 pt-2 sm:pt-8 cursor-pointer group`}
          >
            <p className="text-white text-base sm:text-lg font-bold max-w-[280px] leading-tight group-hover:text-gold-400 transition-colors">
              {t('footer.titoTagline', 'Descubre la magia de Egipto y sus monumentos históricos de la mano de los Expertos')}
            </p>
          </div>
        </div>
      </div>

      {/* Columns: Quick Links */}
      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 pt-8 pb-6">
        <div className="max-w-md mx-auto">

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4 text-lg font-bold text-center">{t('footer.quickLinks', 'Quick Links')}</h3>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-base font-bold">
              <li><Link to="/about" className="text-white hover:text-[#F5A623] transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/blogs" className="text-white hover:text-[#F5A623] transition-colors">{t('nav.blogs')}</Link></li>
              <li><Link to="/contact" className="text-white hover:text-[#F5A623] transition-colors">{t('nav.contact')}</Link></li>
              <li><Link to="/faq" className="text-white hover:text-[#F5A623] transition-colors">{t('footer.faq', 'FAQs')}</Link></li>
              <li><Link to="/" className="text-white hover:text-[#F5A623] transition-colors">{t('nav.home', 'Home')}</Link></li>
            </ul>
          </div>

        </div>

        {/* Credits */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-body-md text-white font-semibold tracking-wide">
            &copy; {new Date().getFullYear()} Dunas Travel. {t('footer.rights', 'All rights reserved.')}
          </p>
        </div>
      </div>

      {/* Ask Jaider Floating Button */}
      <button id="askJaiderFloat" onClick={scrollToJaider} aria-label="Ask Jaider" className={showBackToTop ? 'show' : ''}>
        <FaRobot size={20} />
        <span>{t('footer.askJaider', i18n.language && i18n.language.startsWith('ar') ? 'اسأل جايدر' : i18n.language && i18n.language.startsWith('es') ? 'Pregunta a Jaider' : i18n.language && i18n.language.startsWith('pt') ? 'Pergunte ao Jaider' : i18n.language && i18n.language.startsWith('it') ? 'Chiedi a Jaider' : 'Ask Jaider')}</span>
      </button>

      {/* Back to Top */}
      <button id="backToTop" onClick={scrollToTop} aria-label="Back to top" className={showBackToTop ? 'show' : ''}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5"></path>
          <path d="M5 12l7-7 7 7"></path>
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
