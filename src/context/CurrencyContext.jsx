import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';
const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    const storedCurrency = localStorage.getItem('currency');
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
      localStorage.setItem('currency', newCurrency);
    }
  };

  const formatPrice = (amount) => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) return '';

    if (currency === 'USD') {
      const formatted = numericAmount.toLocaleString('en-US', {
        minimumFractionDigits: numericAmount % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2
      });
      return `$${formatted}`;
    } else {
      const converted = numericAmount * eurRate;
      const formatted = converted.toLocaleString('en-US', {
        minimumFractionDigits: converted % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2
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
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
