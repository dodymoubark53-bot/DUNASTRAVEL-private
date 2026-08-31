import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useJaiderChat } from '../../context/JaiderChatContext';

const DEFAULT_YOUTUBE_ID = 'QqjdVDbxz6s';
const backgroundMusicUrl = import.meta.env.VITE_BACKGROUND_MUSIC_URL;
const isLocalAudio = typeof backgroundMusicUrl === 'string' && (backgroundMusicUrl.startsWith('/') || backgroundMusicUrl.startsWith('http'));

const BackgroundMusic = () => {
  const { t } = useTranslation();
  const { isOpen: isJaiderOpen } = useJaiderChat();
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

  const sendIframeCommand = (func) => {
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

  const playMusic = async () => {
    if (isLocalAudio && audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      sendIframeCommand('playVideo');
      setIsPlaying(true);
    }
    sessionStorage.setItem('musicPlaying', 'true');
  };

  const pauseMusic = () => {
    if (isLocalAudio && audioRef.current) {
      audioRef.current.pause();
    } else {
      sendIframeCommand('pauseVideo');
    }
    setIsPlaying(false);
    sessionStorage.setItem('musicPlaying', 'false');
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
    if (storedPlaying) {
      setHasInteracted(true);
      const timer = setTimeout(() => {
        playMusic();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (isJaiderOpen) return null;

  const tooltipText = isPlaying
    ? t('music.mute', 'Mute Background Music')
    : t('music.play', 'Play Background Music');

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes webflow-music-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes webflow-music-pulse {
          0% {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
            border-color: rgba(245, 166, 35, 0.4);
          }
          100% {
            box-shadow: 0 4px 20px rgba(245, 166, 35, 0.6);
            border-color: rgba(245, 166, 35, 0.9);
          }
        }

        .music-btn-pulse {
          animation: webflow-music-pulse 2s infinite alternate ease-in-out;
        }

        .music-svg-spin {
          animation: webflow-music-spin 3s linear infinite;
        }
      ` }} />

      {/* Local HTML5 Audio if configured */}
      {isLocalAudio && (
        <audio
          ref={audioRef}
          src={backgroundMusicUrl}
          loop
          preload="none"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Hidden YouTube Iframe Audio Player */}
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

      {/* Music Floating Button */}
      <button
        type="button"
        id="webflow-music-toggle-btn"
        onClick={togglePlay}
        title={tooltipText}
        aria-label={tooltipText}
        className={`fixed left-5 bottom-[80px] sm:left-6 sm:bottom-[88px] z-[9997] flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/60 bg-slate-950/90 text-gold-400 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-gold-400 hover:text-gold-200 active:scale-95 ${
          isPlaying ? 'border-gold-400 text-gold-300' : 'music-btn-pulse'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-6 w-6 fill-current ${isPlaying ? 'music-svg-spin' : ''}`}
          aria-hidden="true"
        >
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8z" />
        </svg>
      </button>
    </>
  );
};

export default BackgroundMusic;
