import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useJaiderChat } from '../../context/JaiderChatContext';

const DEFAULT_YOUTUBE_ID = 'QqjdVDbxz6s';
const backgroundMusicUrl = import.meta.env.VITE_BACKGROUND_MUSIC_URL;
const isLocalAudio = typeof backgroundMusicUrl === 'string' && (backgroundMusicUrl.startsWith('/') || backgroundMusicUrl.startsWith('http'));

const BackgroundMusic = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isOpen: isJaiderOpen } = useJaiderChat();
  const isHomePage = location.pathname === '/';

  const audioRef = useRef(null);
  const iframeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const isPlayingRef = useRef(isPlaying);
  const hasInteractedRef = useRef(hasInteracted);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    hasInteractedRef.current = hasInteracted;
  }, [hasInteracted]);

  const sendIframeCommand = (func, args = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: func,
          args: args
        }),
        '*'
      );
    }
  };

  const playMusic = async () => {
    sessionStorage.removeItem('userExplicitlyPaused');
    if (isLocalAudio && audioRef.current) {
      try {
        audioRef.current.volume = 0.5;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Audio play error:', err);
        setIsPlaying(false);
      }
    } else {
      sendIframeCommand('unMute');
      sendIframeCommand('playVideo');
      setIsPlaying(true);

      // Retry command shortly after to ensure YouTube iframe JS API processes it
      setTimeout(() => {
        sendIframeCommand('unMute');
        sendIframeCommand('playVideo');
      }, 400);
    }
    sessionStorage.setItem('musicPlaying', 'true');
  };

  const pauseMusic = () => {
    if (isLocalAudio && audioRef.current) {
      try {
        audioRef.current.pause();
      } catch {
        // ignore
      }
    } else {
      sendIframeCommand('pauseVideo');
    }
    setIsPlaying(false);
    sessionStorage.setItem('musicPlaying', 'false');
    sessionStorage.setItem('userExplicitlyPaused', 'true');
  };

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    if (!hasInteractedRef.current) {
      setHasInteracted(true);
    }
    if (isPlayingRef.current) {
      pauseMusic();
    } else {
      playMusic();
    }
  };

  // Restore playing state if set in sessionStorage
  useEffect(() => {
    const storedPlaying = sessionStorage.getItem('musicPlaying') === 'true';
    const explicitlyPaused = sessionStorage.getItem('userExplicitlyPaused') === 'true';

    if (storedPlaying && !explicitlyPaused) {
      setHasInteracted(true);
      const timer = setTimeout(() => {
        playMusic();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  // Autoplay on Home Page upon scrolling or user interaction
  useEffect(() => {
    if (isHomePage) {
      const explicitlyPaused = sessionStorage.getItem('userExplicitlyPaused') === 'true';
      if (explicitlyPaused) return;

      const triggerPlayOnScroll = () => {
        const currentlyPaused = sessionStorage.getItem('userExplicitlyPaused') === 'true';
        if (!isPlayingRef.current && !currentlyPaused) {
          playMusic();
        }
        cleanupListeners();
      };

      const cleanupListeners = () => {
        window.removeEventListener('scroll', triggerPlayOnScroll);
        window.removeEventListener('wheel', triggerPlayOnScroll);
        window.removeEventListener('touchmove', triggerPlayOnScroll);
        window.removeEventListener('pointerdown', triggerPlayOnScroll);
        window.removeEventListener('keydown', triggerPlayOnScroll);
      };

      // Add scroll and interaction listeners
      window.addEventListener('scroll', triggerPlayOnScroll, { passive: true });
      window.addEventListener('wheel', triggerPlayOnScroll, { passive: true });
      window.addEventListener('touchmove', triggerPlayOnScroll, { passive: true });
      window.addEventListener('pointerdown', triggerPlayOnScroll, { passive: true });
      window.addEventListener('keydown', triggerPlayOnScroll, { passive: true });

      // Check if page is already scrolled
      if (window.scrollY > 0) {
        triggerPlayOnScroll();
      }

      return () => {
        cleanupListeners();
      };
    }
  }, [isHomePage]);

  // Listen to message events from YouTube iframe to stay in sync if player state changes
  useEffect(() => {
    const handleWindowMessage = (event) => {
      if (!event.data) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data.event === 'onStateChange' || (data.info && typeof data.info.playerState !== 'undefined')) {
          const state = data.info?.playerState ?? data.info;
          if (state === 1) { // Playing
            setIsPlaying(true);
            sessionStorage.setItem('musicPlaying', 'true');
          }
        }
      } catch {
        // Ignore non-JSON postMessages
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, []);

  if (isJaiderOpen) return null;

  const tooltipText = isPlaying
    ? t('music.mute', 'Mute Background Music')
    : t('music.play', 'Play Background Music');

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes music-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes music-glow-pulse {
          0% {
            box-shadow: 0 0 15px rgba(245, 166, 35, 0.6), 0 0 30px rgba(245, 166, 35, 0.3);
            border-color: rgba(245, 166, 35, 0.8);
          }
          50% {
            box-shadow: 0 0 25px rgba(255, 215, 0, 0.95), 0 0 45px rgba(245, 166, 35, 0.6);
            border-color: rgba(255, 215, 0, 1);
          }
          100% {
            box-shadow: 0 0 15px rgba(245, 166, 35, 0.6), 0 0 30px rgba(245, 166, 35, 0.3);
            border-color: rgba(245, 166, 35, 0.8);
          }
        }

        .music-svg-spin {
          animation: music-spin 3s linear infinite;
        }

        .music-glowing-glow {
          animation: music-glow-pulse 1.8s infinite alternate ease-in-out;
        }
      ` }} />

      {/* HTML5 Audio if configured explicitly via env */}
      {isLocalAudio && (
        <audio
          ref={audioRef}
          src={backgroundMusicUrl}
          loop
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Original YouTube Background Music Track (QqjdVDbxz6s) */}
      {!isLocalAudio && (
        <iframe
          ref={iframeRef}
          id="webflow-bg-music-iframe"
          width="1"
          height="1"
          src={`https://www.youtube.com/embed/${DEFAULT_YOUTUBE_ID}?enablejsapi=1&version=3&loop=1&playlist=${DEFAULT_YOUTUBE_ID}&controls=0&showinfo=0&rel=0&autoplay=0`}
          frameBorder="0"
          allow="autoplay"
          title="Background Music"
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

      {/* Music Floating Button - Bottom Left */}
      <button
        type="button"
        id="webflow-music-toggle-btn"
        onClick={togglePlay}
        title={tooltipText}
        aria-label={tooltipText}
        className={`fixed left-5 bottom-[80px] sm:left-6 sm:bottom-[88px] z-[9997] flex h-12 w-12 items-center justify-center rounded-full border bg-slate-950/90 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 ${
          isPlaying
            ? 'border-gold-400 text-gold-300 music-glowing-glow shadow-lg shadow-gold-500/20'
            : 'border-gold-500/30 text-gold-500/40 bg-slate-950/80 opacity-75 hover:opacity-100 hover:border-gold-500/60 hover:text-gold-400 shadow-md'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-6 w-6 fill-current transition-transform ${isPlaying ? 'music-svg-spin text-gold-300' : 'text-gold-500/50'}`}
          aria-hidden="true"
        >
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8z" />
        </svg>
      </button>
    </>
  );
};

export default BackgroundMusic;
