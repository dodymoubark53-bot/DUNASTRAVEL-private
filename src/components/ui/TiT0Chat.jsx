import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const MSG_MAP = {
  ar: [
    'أهلاً بك! أنا جايدر (GuideR)، مستشارك السياحي في دوناس ترافيل ❤️',
    'يسعدني إجابة استفساراتك والتخطيط لرحلتك المثالية!'
  ],
  en: [
    "Hi there! I'm GuideR, your AI Travel Concierge for Dunas Travel ❤️",
    "Let me help you plan your dream luxury journey today!"
  ],
  es: [
    "¡Hola! Soy GuideR, tu conserje de viajes para Dunas Travel ❤️",
    "¡Permíteme ayudarte a planificar tu viaje de lujo ideal!"
  ],
  pt: [
    "Olá! Sou o GuideR, seu concierge de viagens da Dunas Travel ❤️",
    "Deixe-me ajudar a planejar a sua viagem de luxo dos sonhos!"
  ],
  it: [
    "Ciao! Sono GuideR, il tuo concierge di viaggio per Dunas Travel ❤️",
    "Lasciati aiutare a pianificare il tuo viaggio ideale!"
  ]
};

const CHAR_SPEED = 45;
const HOLD_TIME = 4500;
const ERASE_SPEED = 20;
const IDLE_GAP = 4000;

const TiT0Chat = () => {
  const { i18n } = useTranslation();
  const [phase, setPhase] = useState('idle');
  const [buf, setBuf] = useState('');
  const [showDots, setShowDots] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  
  const msgIdxRef = useRef(0);
  const idx = useRef(0);

  const lang = (i18n.language || 'en').split('-')[0].toLowerCase();
  const messagesList = MSG_MAP[lang] || MSG_MAP.en;

  useEffect(() => {
    let active = true;
    
    const run = async () => {
      await new Promise(r => setTimeout(r, 1000));

      while (active) {
        // Pause typing loop if user is on another browser tab
        while (typeof document !== 'undefined' && document.hidden) {
          await new Promise(r => setTimeout(r, 1000));
          if (!active) break;
        }
        if (!active) break;

        const currentIdx = msgIdxRef.current;
        const target = messagesList[currentIdx % messagesList.length];

        // 1. Show thinking dots
        setShowDots(true);
        await new Promise(r => setTimeout(r, 1000));
        if (!active) break;

        // 2. Transition to bubble
        setShowBubble(true);
        setShowDots(false);
        await new Promise(r => setTimeout(r, 250));
        if (!active) break;

        // 3. Typing phase
        setPhase('typing');
        idx.current = 0;
        while (idx.current < target.length) {
          if (!active) break;
          setBuf(target.slice(0, idx.current + 1));
          idx.current++;
          await new Promise(r => setTimeout(r, CHAR_SPEED + Math.random() * 10));
        }
        if (!active) break;

        // 4. Holding phase
        setPhase('holding');
        await new Promise(r => setTimeout(r, HOLD_TIME));
        if (!active) break;

        // 5. Erasing phase
        setPhase('erasing');
        while (idx.current > 0) {
          if (!active) break;
          idx.current--;
          setBuf(target.slice(0, idx.current));
          await new Promise(r => setTimeout(r, ERASE_SPEED));
        }
        if (!active) break;

        // 6. Reset to idle
        setBuf('');
        setPhase('idle');
        setShowBubble(false);

        msgIdxRef.current = (currentIdx + 1) % messagesList.length;

        // 7. Idle gap
        await new Promise(r => setTimeout(r, IDLE_GAP));
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [lang, messagesList]);

  const isTyping = phase === 'typing';

  return (
    <div className="relative flex flex-col items-center justify-end w-max max-w-[calc(100vw-48px)] xs:max-w-[240px] sm:max-w-[280px] select-none pointer-events-none">
      {/* Bouncing dots container */}
      <div
        className={`absolute bottom-2 transition-all duration-300 ${
          showDots ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'
        }`}
      >
        <div className="flex gap-1.5 bg-slate-900/90 backdrop-blur-sm px-3.5 py-2.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.25)] border border-gold-500/30">
          <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce [animation-delay:0.15s]" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce [animation-delay:0.3s]" />
        </div>
      </div>

      {/* Message Bubble */}
      <div
        className={`transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          showBubble ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.6] translate-y-3 pointer-events-none'
        }`}
      >
        <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.45)] px-4 py-3 border border-gold-500/30 text-center">
          <p className="text-xs sm:text-[13px] leading-relaxed text-slate-100 font-bold whitespace-normal break-words">
            {buf}
            {isTyping && (
              <span className="inline-block w-[1.5px] h-[1em] bg-gold-400 ml-0.5 align-middle animate-[blink_0.75s_step-end_infinite]" />
            )}
          </p>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-950 filter drop-shadow-[0_1px_0_rgba(201,162,39,0.2)]" />
        </div>
      </div>
    </div>
  );
};

export default TiT0Chat;
