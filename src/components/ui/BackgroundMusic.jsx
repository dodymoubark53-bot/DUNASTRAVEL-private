import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useJaiderChat } from '../../context/JaiderChatContext';

// Background audio must be a licensed, same-origin file in public/ (for example
// /audio/dunas-theme.mp3). External embeds are deliberately not supported here:
// YouTube players initiate their own advertising, telemetry, and caption requests.
const backgroundMusicUrl = import.meta.env.VITE_BACKGROUND_MUSIC_URL;
const hasLocalBackgroundMusic = typeof backgroundMusicUrl === 'string'
  && backgroundMusicUrl.startsWith('/');

const BackgroundMusic = () => {
  const { t } = useTranslation();
  const { isOpen: isJaiderOpen } = useJaiderChat();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  // Do not render a player or make a network request unless a local, approved
  // audio asset has explicitly been configured for this deployment.
  if (!hasLocalBackgroundMusic || isJaiderOpen) return null;

  const tooltipText = isPlaying
    ? t('music.mute', 'Mute Background Music')
    : t('music.play', 'Play Background Music');

  return (
    <>
      <audio
        ref={audioRef}
        src={backgroundMusicUrl}
        loop
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button
        type="button"
        id="webflow-music-toggle-btn"
        onClick={togglePlay}
        title={tooltipText}
        aria-label={tooltipText}
        className="fixed left-5 bottom-[80px] z-[9997] flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/50 bg-slate-950/90 text-gold-300 shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-gold-400 hover:text-gold-200 active:scale-95 sm:left-6 sm:bottom-[88px]"
      >
        {isPlaying ? (
          <span className="text-lg" aria-hidden="true">❚❚</span>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8z" />
          </svg>
        )}
      </button>
    </>
  );
};

export default BackgroundMusic;
