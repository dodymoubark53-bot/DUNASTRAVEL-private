import { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import api from '../utils/api';
const defaultCurrencyContext = {
  currency: 'USD',
  setCurrency: () => {},
  formatPrice: (amount) => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) return '';
    return `$${numericAmount.toLocaleString('en-US', {
      minimumFractionDigits: numericAmount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  },
};

const CurrencyContext = createContext(defaultCurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    const storedCurrency = typeof window !== 'undefined' ? localStorage.getItem('currency') : 'USD';
    return storedCurrency === 'USD' || storedCurrency === 'EUR' ? storedCurrency : 'USD';
  });
  const [eurRate, setEurRate] = useState(0.92);

  useEffect(() => {
    let isMounted = true;
    const fetchRate = async () => {
      try {
        const data = await api.get('/currency/rates');
        const eur = data?.rates?.EUR || data?.EUR;
        if (eur && isMounted) {
          setEurRate(eur);
        }
      } catch (err) {
        console.warn('Failed to fetch currency rates, using default fallback (0.92):', err?.message || err);
      }
    };
    fetchRate();
    return () => {
      isMounted = false;
    };
  }, []);

  const setCurrency = useCallback((newCurrency) => {
    if (newCurrency === 'USD' || newCurrency === 'EUR') {
      setCurrencyState(newCurrency);
      if (typeof window !== 'undefined') {
        localStorage.setItem('currency', newCurrency);
      }
    }
  }, []);

  const formatPrice = useCallback((amount) => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) return '';

    if (currency === 'USD') {
      const formatted = numericAmount.toLocaleString('en-US', {
        minimumFractionDigits: numericAmount % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      });
      return `$${formatted}`;
    } else {
      const converted = numericAmount * eurRate;
      const formatted = converted.toLocaleString('en-US', {
        minimumFractionDigits: converted % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      });
      return `€${formatted}`;
    }
  }, [currency, eurRate]);

  const value = useMemo(() => ({ currency, setCurrency, formatPrice }), [currency, setCurrency, formatPrice]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCurrency = () => useContext(CurrencyContext) || defaultCurrencyContext;
