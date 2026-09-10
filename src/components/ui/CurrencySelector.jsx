import { useCurrency } from '../../context/CurrencyContext';

const CurrencySelector = ({ light }) => {
  const { currency, setCurrency, isFallbackRate } = useCurrency();

  return (
    <div className={`inline-flex items-center rounded-full p-0.5 ${light ? 'bg-obsidian-50 border border-obsidian-200' : 'bg-white/5 border border-white/10 backdrop-blur-sm'}`}>
      <button
        type="button"
        onClick={() => setCurrency('USD')}
        title="US Dollar (Base Currency)"
        aria-label="Switch display currency to US Dollar"
        className={`currency-btn px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
          currency === 'USD'
            ? 'bg-gold-500 text-obsidian-900 shadow-sm'
            : light
              ? 'text-obsidian-400 hover:text-obsidian-900 hover:bg-obsidian-100'
              : 'text-white/70 hover:text-white hover:bg-white/5'
        }`}
      >
        $ USD
      </button>
      <button
        type="button"
        onClick={() => setCurrency('EUR')}
        title={isFallbackRate ? 'Euro (≈ Estimated Daily Rate)' : 'Euro (Live Exchange Rate)'}
        aria-label="Switch display currency to Euro"
        className={`currency-btn px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 relative ${
          currency === 'EUR'
            ? 'bg-gold-500 text-obsidian-900 shadow-sm'
            : light
              ? 'text-obsidian-400 hover:text-obsidian-900 hover:bg-obsidian-100'
              : 'text-white/70 hover:text-white hover:bg-white/5'
        }`}
      >
        <span>€ EUR</span>
        {isFallbackRate && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block ml-1 align-middle animate-pulse"
            title="Estimated Rate"
          />
        )}
      </button>
    </div>
  );
};

export default CurrencySelector;
