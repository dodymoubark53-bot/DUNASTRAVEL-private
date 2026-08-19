import { createContext, useState, useContext, useEffect } from 'react';
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
    const fetchRate = async () => {
      try {
        const data = await api.get('/currency/rates');
        const eur = data?.rates?.EUR || data?.EUR;
        if (eur) {
          setEurRate(eur);
        }
      } catch (err) {
        console.error('Failed to fetch currency rates', err);
      }
    };
    fetchRate();
  }, []);

  const setCurrency = (newCurrency) => {
    if (newCurrency === 'USD' || newCurrency === 'EUR') {
      setCurrencyState(newCurrency);
      if (typeof window !== 'undefined') {
        localStorage.setItem('currency', newCurrency);
      }
    }
  };

  const formatPrice = (amount) => {
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
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCurrency = () => useContext(CurrencyContext) || defaultCurrencyContext;
