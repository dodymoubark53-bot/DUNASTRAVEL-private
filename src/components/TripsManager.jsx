import { useState, useEffect } from 'react';
import api from '../utils/api';

const TripsManager = () => {
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState({ title: '', price: '', country: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/tours')
      .then((data) => {
        const items = data?.items || (Array.isArray(data) ? data : []);
        setTrips(items.map((t) => ({
          id: t.id,
          title: t.title,
          price: t.basePriceUsd,
          country: t.category,
        })));
      })
      .catch(() => setError('Failed to load trips'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await api.post('/tours', { ...form, price: Number(form.price) });
      setTrips((prev) => [...prev, data]);
      setForm({ title: '', price: '', country: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '2rem auto', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Travel Packages</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {trips.map((t) => (
          <li key={t.id}>{t.title} — ${t.price} ({t.country})</li>
        ))}
      </ul>

      <hr />
      <h3>Add a Trip</h3>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required />
        <button type="submit">Add Trip</button>
      </form>
    </div>
  );
};

export default TripsManager;
