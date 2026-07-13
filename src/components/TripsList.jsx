import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TripsList = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch(`${API}/tours`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setTrips(data);
      } catch (err) {
        setError(err.message || 'Unable to load trips. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Travel Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-10 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Travel Packages</h2>
        <div className="inline-flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          <span className="text-2xl">⚠️</span>
          <p className="text-lg">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <span className="text-sm uppercase tracking-widest text-amber-600 font-semibold">
          Explore
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          Travel Packages
        </h2>
        <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="h-48 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-5xl">✈️</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-amber-600 font-semibold bg-amber-50 px-3 py-1 rounded-full">
                  {trip.country}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ${trip.price}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {trip.title}
              </h3>
              <button className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {trips.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No packages available yet.</p>
      )}
    </section>
  );
};

export default TripsList;
