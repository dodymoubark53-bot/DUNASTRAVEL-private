import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const HIERO = {
  a: '\u{13023}', b: '\u{130C0}', c: '\u{130A1}', d: '\u{130A7}', e: '\u{131CB}', f: '\u{13191}',
  g: '\u{1333C}', h: '\u{13254}', i: '\u{131CB}', j: '\u{130CB}', k: '\u{130A1}', l: '\u{130ED}',
  m: '\u{13153}', n: '\u{13216}', o: '\u{1309D}', p: '\u{132AA}', q: '\u{13358}', r: '\u{130CB}',
  s: '\u{132F4}', t: '\u{133CF}', u: '\u{13171}', v: '\u{13191}', w: '\u{13171}', x: '\u{130A1}\u{132F4}',
  y: '\u{1310C}', z: '\u{13083}',
};
const COMBOS = { sh: '\u{13300}', th: '\u{133CF}\u{13254}', ch: '\u{130A1}', ph: '\u{13191}', kh: '\u{1304D}', gh: '\u{1333C}' };
const TRANSLIT = {
  a: '\uA723', b: 'b', c: 'k', d: 'd', e: 'i', f: 'f', g: 'g', h: '\u1E25', i: 'i', j: 'r', k: 'k',
  l: 'r', m: 'm', n: 'n', o: '\uA725', p: 'p', q: 'q', r: 'r', s: 's', t: 't', u: 'w', v: 'f',
  w: 'w', x: 'ks', y: 'y', z: 'z',
};
const TRANSLIT_C = { sh: '\u0161', th: 't\u1E25', ch: 'k', ph: 'f', kh: '\u1E2B', gh: 'g' };
const LANG_NAMES = { en: 'English', es: 'Spanish', pt: 'Portuguese', it: 'Italian' };

const EYE = '\u{13080}';
const SNAKE = '\u{13199}';
const OWL = '\u{13153}';
const INSCRIBE = '\u{1300B}';

const LANGUAGES = [
  { code: 'en', label: '\u{1F1EC}\u{1F1E7} English', dir: 'ltr', placeholder: 'e.g. Dina, Ahmed, Sara' },
  { code: 'es', label: '\u{1F1EA}\u{1F1F8} Espa\u00F1ol', dir: 'ltr', placeholder: 'p.ej. Carlos, Mar\u00EDa' },
  { code: 'pt', label: '\u{1F1E7}\u{1F1F7} Portugu\u00EAs', dir: 'ltr', placeholder: 'ex. Jo\u00E3o, Beatriz' },
  { code: 'it', label: '\u{1F1EE}\u{1F1F9} Italiano', dir: 'ltr', placeholder: 'es. Marco, Sofia' },
];

const stars = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  size: Math.random() * 1.5 + 0.5,
  left: Math.random() * 100,
  top: Math.random() * 70,
  dur: (Math.random() * 3 + 1.5).toFixed(1),
  delay: (Math.random() * 4).toFixed(1),
}));

function localTranslate(name) {
  const lower = name.toLowerCase().replace(/[^a-z]/g, '');
  let g = '', t = '', i = 0;
  while (i < lower.length) {
    const two = lower.slice(i, i + 2);
    if (COMBOS[two]) { g += COMBOS[two]; t += (TRANSLIT_C[two] || '') + '-'; i += 2; }
    else { const ch = lower[i]; if (HIERO[ch]) { g += HIERO[ch]; t += (TRANSLIT[ch] || '') + '-'; } i++; }
  }
  return { glyphs: '\u{13379}' + g + '\u{1337A}', translit: t.replace(/-$/, '') };
}

const CURSE_TEXTS = {
  ar: '\u0633\u064A\u0636\u0631\u0628 \u0627\u0644\u0645\u0648\u062A \u0628\u062C\u0646\u0627\u062D\u064A\u0647 \u0643\u0644 \u0645\u0646 \u064A\u0639\u0643\u0631 \u0635\u0641\u0648 \u062F\u0648\u0646\u0627\u0633 \u062A\u0631\u0627\u0641\u0644',
  en: 'Death shall strike with its wings those who disturb the peace of Dunas Travel',
  es: 'La muerte golpear\u00E1 con sus alas a quien perturbe la paz de Dunas Travel',
  pt: 'A morte golpear\u00E1 com suas asas aqueles que perturbarem a paz da Dunas Travel',
  it: 'La morte colpir\u00E0 con le sue ali chiunque disturbi la pace di Dunas Travel',
};

const HieroglyphicName = () => {
  const { i18n } = useTranslation();
  const siteLang = i18n.language?.split('-')[0] || 'en';
  const curseText = CURSE_TEXTS[siteLang] || CURSE_TEXTS.en;
  const isRtlLang = siteLang === 'ar';
  const [currentLang, setCurrentLang] = useState('en');
  const [name, setName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const langInfo = useMemo(() => LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0], [currentLang]);

  const doTranslate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/tools/hieroglyphics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Translation failed');
      setResult(data);
    } catch {
      const fallback = localTranslate(trimmed);
      setResult({ glyphs: fallback.glyphs, translit: fallback.translit, note: 'Transliterated from phonetic mapping.' });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') doTranslate();
  };

  return (
    <section className="relative w-full min-h-[900px] lg:min-h-[950px] flex flex-col overflow-hidden" style={{ background: '#0F0A04' }}>
      {/* Curse Banner */}
      <div
        className="w-full z-20 py-[14px] md:py-[18px] text-center"
        style={{
          background: 'linear-gradient(90deg, #1A0A00, #3D1F00, #1A0A00)',
          borderBottom: '1px solid rgba(201, 168, 76, 0.3)',
          color: '#C9A84C',
          textShadow: '0 0 12px rgba(201, 168, 76, 0.4)',
          fontFamily: "'Playfair Display', Georgia, serif",
          direction: isRtlLang ? 'rtl' : 'ltr',
        }}
      >
        <span className="text-[16px] md:text-xl lg:text-2xl font-semibold italic tracking-wide leading-snug">
          {EYE} {curseText} {EYE}
        </span>
      </div>

      {/* Stars */}
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            width: s.size + 'px',
            height: s.size + 'px',
            left: s.left + '%',
            top: s.top + '%',
            background: '#F0D080',
            animation: `hieroTwinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Desert */}
      <div
        className="absolute bottom-0 left-0 right-0 z-0"
        style={{ height: '140px', background: 'linear-gradient(to top, #3D2008, #5C3A1E, transparent)' }}
      >
        <div className="absolute bottom-0" style={{ right: '5%', borderLeft: '90px solid transparent', borderRight: '90px solid transparent', borderBottom: '150px solid #4A2E10', opacity: 0.55 }} />
        <div className="absolute bottom-0" style={{ right: '20%', borderLeft: '55px solid transparent', borderRight: '55px solid transparent', borderBottom: '95px solid #4A2E10', opacity: 0.4 }} />
        <div className="absolute bottom-0" style={{ left: '8%', borderLeft: '45px solid transparent', borderRight: '45px solid transparent', borderBottom: '80px solid #4A2E10', opacity: 0.3 }} />
      </div>

      {/* Content: Horus anchored left + Card overlay */}
      <div className="relative z-10 flex-1 flex items-center w-full">
        {/* Horus - anchored to right with small gap */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          dir="ltr"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: '-500px',
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '10px',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <img
            src="/imgs/hero-hiero.webp"
            alt="Horus"
            width="620"
            height="800"
            className="drop-shadow-[0_0_150px_rgba(201,168,76,0.5)]"
            style={{
              height: '98%',
              width: 'auto',
              display: 'block',
              animation: 'hieroSpinOnce 1s ease-out forwards, hieroFloat 6s ease-in-out 1.2s infinite',
            }}
          />
        </motion.div>

        {/* Card overlay on the left */}
        <div className="container mx-auto px-6 w-full relative z-10" dir="ltr">
          <div className="flex justify-start lg:ml-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-[480px] lg:max-w-[520px]"
            >
              <div
                className="relative w-full max-w-[480px] lg:max-w-[520px]"
                style={{
                  backgroundImage: 'url(/imgs/form-phronic.jpeg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '2px solid rgba(201, 168, 76, 0.5)',
                  borderRadius: '4px',
                  padding: '40px 36px 36px',
                  boxShadow: '0 0 60px rgba(201, 168, 76, 0.2), 0 32px 80px rgba(0, 0, 0, 0.8)',
                }}
              >
                <div className="absolute" style={{ top: '10px', left: '10px', width: '18px', height: '18px', borderColor: 'rgba(201, 168, 76, 0.6)', borderStyle: 'solid', borderWidth: '2px 0 0 2px' }} />
                <div className="absolute" style={{ bottom: '10px', right: '10px', width: '18px', height: '18px', borderColor: 'rgba(201, 168, 76, 0.6)', borderStyle: 'solid', borderWidth: '0 2px 2px 0' }} />

                <div className="relative z-10">
                  <div className="text-center text-[38px] mb-[6px]" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.9)) drop-shadow(0 0 8px rgba(0,0,0,0.8))' }}>
                    {EYE}
                  </div>

                  <div className="text-[22px] font-bold tracking-[0.18em] text-center uppercase mb-[4px]" style={{ color: '#1A0A00', textShadow: '0 1px 0 rgba(255,200,80,0.4), 1px 1px 0 rgba(255,200,80,0.2)', WebkitTextStroke: '0.5px rgba(100,50,0,0.3)', fontFamily: 'Georgia, serif' }}>
                    Hieroglyphic
                  </div>
                  <div className="text-center text-[11px] font-bold tracking-[0.2em] uppercase mb-[24px]" style={{ color: '#2A1200', textShadow: '0 1px 2px rgba(255,220,100,0.3)' }}>
                    Name Translator &middot; Ancient Egypt
                  </div>

                  <div className="text-[10px] font-bold tracking-[0.2em] uppercase mb-[10px] text-center" style={{ color: '#1A0A00', textShadow: '0 1px 2px rgba(255,200,80,0.3)' }}>
                    Choose your language
                  </div>
                  <div className="flex gap-[6px] flex-wrap justify-center mb-[22px]">
                    {LANGUAGES.map(l => (
                      <button
                        key={l.code}
                        onClick={() => { setCurrentLang(l.code); setName(''); setResult(null); setError(null); }}
                        className="px-[10px] py-[7px] text-[11px] font-bold tracking-[0.08em] whitespace-nowrap transition-all"
                        style={{
                          background: currentLang === l.code ? 'rgba(201, 168, 76, 0.85)' : 'rgba(255, 240, 180, 0.6)',
                          border: currentLang === l.code ? '1.5px solid #7A4F00' : '1.5px solid rgba(100, 60, 0, 0.5)',
                          borderRadius: '3px',
                          color: currentLang === l.code ? '#0F0500' : '#2A1000',
                          fontFamily: 'Georgia, serif',
                          cursor: 'pointer',
                        }}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-[10px] mb-[20px]">
                    <div className="flex-1 h-[1.5px]" style={{ background: 'linear-gradient(to right, transparent, rgba(80,40,0,0.5), transparent)' }} />
                    <span style={{ color: '#C9A84C', fontSize: '12px', opacity: 0.6 }}>{SNAKE}</span>
                    <div className="flex-1 h-[1.5px]" style={{ background: 'linear-gradient(to right, transparent, rgba(80,40,0,0.5), transparent)' }} />
                  </div>

                  <div
                    className="text-[10px] font-bold tracking-[0.15em] uppercase mb-[10px]"
                    style={{ color: '#1A0A00', textShadow: '0 1px 2px rgba(255,200,80,0.3)', textAlign: 'left', direction: 'ltr' }}
                  >
                    Enter your name
                  </div>
                  <div className="relative mb-[18px]">
                    <span className="absolute top-1/2 -translate-y-1/2 text-[18px] pointer-events-none left-[14px]" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.6))' }}>
                      {OWL}
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={langInfo.placeholder}
                      maxLength={30}
                      className="outline-none"
                      style={{
                        width: '100%',
                        background: 'rgba(255, 245, 200, 0.7)',
                        border: '1.5px solid rgba(100, 60, 0, 0.4)',
                        borderRadius: '3px',
                        fontFamily: 'Georgia, serif',
                        fontSize: '16px',
                        color: '#1A0800',
                        fontWeight: 'bold',
                        letterSpacing: '0.1em',
                        padding: '13px 16px 13px 44px',
                        textAlign: 'left',
                        direction: 'ltr',
                      }}
                    />
                  </div>

                  <button
                    onClick={doTranslate}
                    disabled={loading}
                    className="w-full py-[13px] text-[12px] font-bold tracking-[0.22em] uppercase cursor-pointer disabled:opacity-50 border-none"
                    style={{
                      background: 'linear-gradient(135deg, #5A3A00, #C9A84C, #5A3A00)',
                      borderRadius: '3px',
                      color: '#1A0800',
                      fontFamily: 'Georgia, serif',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                    }}
                  >
                    {INSCRIBE} Inscribe My Name {INSCRIBE}
                  </button>

                  {(result || loading) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-[24px] p-[22px_18px] text-center rounded-[3px]"
                      style={{ background: 'rgba(255, 245, 190, 0.65)', border: '1.5px solid rgba(100, 60, 0, 0.35)' }}
                    >
                      {loading && (
                        <div className="text-[13px] font-bold tracking-[0.15em]" style={{ color: '#3D1F00', animation: 'hieroPulse 1s infinite' }}>
                          &#10267; Consulting the scribes&hellip;
                        </div>
                      )}
                      {result && !loading && (
                        <>
                          <div className="text-[9px] font-bold tracking-[0.3em] uppercase mb-[14px]" style={{ color: '#2A1200' }}>
                            Your name in the sacred script
                          </div>
                          <div className="text-[42px] leading-[1.4] tracking-[6px] mb-[12px]" style={{ color: '#3D1F00', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))', wordBreak: 'break-all' }}>
                            {result.glyphs}
                          </div>
                          <div className="text-[12px] font-bold tracking-[0.12em] italic mb-[6px]" style={{ color: '#4A2800' }}>
                            {result.translit}
                          </div>
                          <div className="text-[11px] tracking-[0.08em]" style={{ color: '#3A1F00' }}>
                            {result.note}
                          </div>
                          <div className="mt-[10px] text-[13px] font-bold tracking-[0.2em]" style={{ color: '#5C3A00' }}>
                            &#10022; {name.toUpperCase()} &#10022;
                          </div>
                        </>
                      )}
                      {error && (
                        <div className="text-[12px] font-bold tracking-[0.1em]" style={{ color: '#8B0000' }}>
                          {error}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hieroTwinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.6; }
        }
        @keyframes hieroPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes hieroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes hieroSpinOnce {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default HieroglyphicName;
