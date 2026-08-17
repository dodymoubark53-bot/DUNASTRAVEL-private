import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useJaiderChat } from '../../context/JaiderChatContext';

const BackgroundMusic = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const { isOpen: isJaiderOpen } = useJaiderChat();
  const isHomepage = location.pathname === '/' || location.pathname === '/home';
  const prevPathnameRef = useRef(location.pathname);
  const isRtl = i18n.dir() === 'rtl';

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(() => sessionStorage.getItem('musicPlaying') === 'true');
  const [ripples, setRipples] = useState([]);
  
  const iframeRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);
  const hasInteractedRef = useRef(hasInteracted);

  // Keep refs in sync for event listeners
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    hasInteractedRef.current = hasInteracted;
  }, [hasInteracted]);

  const sendCommand = (func) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: func,
          args: ''
        }),
        '*'
      );
    }
  };

  const playMusic = () => {
    if (!hasInteractedRef.current) {
      setHasInteracted(true);
    } else {
      sendCommand('playVideo');
    }
    setIsPlaying(true);
    sessionStorage.setItem('musicPlaying', 'true');
  };

  const pauseMusic = () => {
    if (hasInteractedRef.current) {
      sendCommand('pauseVideo');
    }
    setIsPlaying(false);
    sessionStorage.setItem('musicPlaying', 'false');
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!hasInteractedRef.current) {
      setHasInteracted(true);
      setIsPlaying(true);
      sessionStorage.setItem('musicPlaying', 'true');
    } else {
      if (isPlayingRef.current) {
        pauseMusic();
      } else {
        playMusic();
      }
    }
  };

  const addRipple = (x, y) => {
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 800);
  };

  // Track page navigation to adjust autoplay behavior
  useEffect(() => {
    const prevPathname = prevPathnameRef.current;
    prevPathnameRef.current = location.pathname;

    const wasHomepage = prevPathname === '/' || prevPathname === '/home';

    if (isHomepage) {
      // Landed on the homepage - reset/enable autoplay
      // Since it's the homepage, we play the music automatically if user already interacted.
      const isInitialLoad = prevPathname === location.pathname;
      if (isInitialLoad) {
        const timer = setTimeout(() => {
          if (hasInteractedRef.current) {
            playMusic();
          }
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        if (hasInteractedRef.current) {
          playMusic();
        }
      }
    } else {
      // Landed on a non-home page
      // If we transitioned from Homepage to Non-Home page, we pause the music.
      if (wasHomepage) {
        pauseMusic();
      }
      // If we transitioned from Non-Home to Non-Home, the state persists.
    }
  }, [location.pathname, isHomepage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Monitor document clicks for page interaction and ripple animation
  useEffect(() => {
    const handleDocClick = (e) => {
      const toggleBtn = document.getElementById('webflow-music-toggle-btn');
      if (toggleBtn && (toggleBtn === e.target || toggleBtn.contains(e.target))) {
        return;
      }

      if (isHomepage && !hasInteractedRef.current) {
        playMusic();
      }

      addRipple(e.clientX, e.clientY);
    };

    document.addEventListener('click', handleDocClick);
    return () => {
      document.removeEventListener('click', handleDocClick);
    };
  }, [isHomepage]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isJaiderOpen) return null;

  const tooltipText = isPlaying
    ? (isRtl ? 'كتم الموسيقى الترحيبية' : 'Mute Background Music')
    : (isRtl ? 'تشغيل الموسيقى الفاخرة' : 'Play Background Music');

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes webflow-music-pulse {
          0% { box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4); border-color: rgba(201, 162, 39, 0.4); }
          100% { box-shadow: 0 4px 20px rgba(201, 162, 39, 0.25); border-color: rgba(201, 162, 39, 0.8); }
        }
        @keyframes webflow-ripple-animation {
          0% { width: 0px; height: 0px; opacity: 1; }
          100% { width: 160px; height: 160px; opacity: 0; }
        }
        @keyframes eq-bar {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
        .music-btn-pulse {
          animation: webflow-music-pulse 2s infinite alternate ease-in-out;
        }
        .eq-bar-1 { animation: eq-bar 0.8s ease-in-out infinite 0.1s; }
        .eq-bar-2 { animation: eq-bar 0.6s ease-in-out infinite 0.3s; }
        .eq-bar-3 { animation: eq-bar 0.9s ease-in-out infinite 0.2s; }
      ` }} />

      {/* Hidden YouTube Iframe */}
      {hasInteracted && (
        <iframe
          ref={iframeRef}
          id="webflow-bg-music-iframe"
          width="1"
          height="1"
          src={`https://www.youtube.com/embed/QqjdVDbxz6s?enablejsapi=1&version=3&loop=1&playlist=QqjdVDbxz6s&controls=0&showinfo=0&rel=0&autoplay=${isPlaying ? '1' : '0'}`}
          frameBorder="0"
          allow="autoplay"
          style={{
            position: 'fixed',
            bottom: '-100px',
            left: '-100px',
            visibility: 'hidden',
            opacity: 0,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Music Toggle Button */}
      <button
        id="webflow-music-toggle-btn"
        onClick={togglePlay}
        title={tooltipText}
        aria-label={tooltipText}
        className={`fixed bottom-[146px] sm:bottom-[156px] z-[9997] w-11 h-11 rounded-full bg-slate-950/90 backdrop-blur-md border border-gold-500/50 shadow-[0_4px_20px_rgba(0,0,0,0.45)] flex items-center justify-center text-gold-300 hover:text-gold-200 hover:border-gold-400 hover:scale-108 active:scale-95 transition-all duration-300 ${
          isRtl ? 'left-6.5' : 'right-6.5'
        } ${isPlaying ? '' : 'music-btn-pulse'}`}
      >
        {isPlaying ? (
          <div className="flex items-end justify-center gap-[2.5px] h-4 w-4">
            <span className="w-[2.5px] bg-gold-400 rounded-full eq-bar-1" />
            <span className="w-[2.5px] bg-gold-400 rounded-full eq-bar-2" />
            <span className="w-[2.5px] bg-gold-400 rounded-full eq-bar-3" />
          </div>
        ) : (
          <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8z" />
          </svg>
        )}
      </button>

      {/* Ripple Effects Container */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="webflow-music-ripple"
          style={{
            position: 'fixed',
            left: r.x,
            top: r.y,
            width: '8px',
            height: '8px',
            background: 'rgba(201, 162, 39, 0.15)',
            border: '1.5px solid rgba(201, 162, 39, 0.6)',
            borderRadius: '50%',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            animation: 'webflow-ripple-animation 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards'
          }}
        />
      ))}
    </>
  );
};

export default BackgroundMusic;
