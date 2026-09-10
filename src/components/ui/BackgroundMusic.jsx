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
  const playerRef = useRef(null);
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

  const loadAndInitYT = (callback) => {
    if (isLocalAudio) {
      if (callback) callback();
      return;
    }

    const createPlayer = () => {
      if (playerRef.current) {
        if (callback) callback();
        return;
      }
      try {
        playerRef.current = new window.YT.Player('webflow-bg-music-player', {
          height: '1',
          width: '1',
          videoId: DEFAULT_YOUTUBE_ID,
          playerVars: {
            autoplay: 1,
            controls: 0,
            loop: 1,
            playlist: DEFAULT_YOUTUBE_ID,
            showinfo: 0,
            rel: 0,
            enablejsapi: 1,
          },
          events: {
            onReady: (event) => {
              if (callback) callback(event);
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                sessionStorage.setItem('musicPlaying', 'true');
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              }
            },
          },
        });
      } catch (e) {
        console.warn('Failed to init YT player:', e);
      }
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      if (!document.getElementById('yt-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          document.head.appendChild(tag);
        }
      }

      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previousCallback === 'function') previousCallback();
        createPlayer();
      };
    }
  };

  const playMusic = () => {
    sessionStorage.removeItem('userExplicitlyPaused');
    if (isLocalAudio && audioRef.current) {
      try {
        audioRef.current.volume = 0.5;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } catch {
        setIsPlaying(false);
      }
    } else if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try {
        playerRef.current.unMute();
        playerRef.current.playVideo();
        setIsPlaying(true);
      } catch (e) {
        console.warn('YT play error:', e);
      }
    } else {
      // Lazy load YouTube player on user action
      loadAndInitYT((event) => {
        try {
          if (event && event.target) {
            event.target.unMute();
            event.target.playVideo();
          } else if (playerRef.current) {
            playerRef.current.unMute();
            playerRef.current.playVideo();
          }
          setIsPlaying(true);
        } catch {
          // browser blocked
        }
      });
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
    } else if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      try {
        playerRef.current.pauseVideo();
      } catch (e) {
        console.warn('YT pause error:', e);
      }
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
      sessionStorage.removeItem('userManualPlayNonHome');
    } else {
      if (!isHomePage) {
        sessionStorage.setItem('userManualPlayNonHome', 'true');
      }
      playMusic();
    }
  };

  // Only resume playback across routes if the user previously actively started it
  useEffect(() => {
    const musicWasPlaying = sessionStorage.getItem('musicPlaying') === 'true';
    const explicitlyPaused = sessionStorage.getItem('userExplicitlyPaused') === 'true';

    if (isHomePage) {
      if (musicWasPlaying && !explicitlyPaused) {
        playMusic();
      }
    } else {
      const manualNonHomePlay = sessionStorage.getItem('userManualPlayNonHome') === 'true';
      if (!manualNonHomePlay && isPlayingRef.current) {
        pauseMusic();
      }
    }
  }, [isHomePage]);

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

      {/* YouTube Iframe Player Container for Official YT API */}
      {!isLocalAudio && (
        <div
          style={{
            position: 'fixed',
            bottom: '-100px',
            left: '-100px',
            visibility: 'hidden',
            opacity: 0,
            pointerEvents: 'none',
            width: 1,
            height: 1
          }}
        >
          <div id="webflow-bg-music-player" />
        </div>
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
