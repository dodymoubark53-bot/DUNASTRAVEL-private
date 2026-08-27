const fs = require('fs');

// 1. Update useServices.js
const useServicesPath = 'd:/@@project/LUXURY-PROJECT/frontend/src/hooks/useServices.js';
let useServicesContent = fs.readFileSync(useServicesPath, 'utf8');

const updatedTransformTransport = `function transformTransportToService(service) {
  if (!service?.id || !service?.name || !service?.serviceType) {
    throw new Error('Invalid transportation service');
  }
  const pricePerTrip = requireFiniteNumber(
    service.basePriceUsd,
    'basePriceUsd',
    service.id,
    { positive: true },
  );
  return {
    ...service,
    category: 'transportation',
    slug: service.id,
    title: service.name,
    location: String(service.serviceType).replaceAll('_', ' '),
    images: service.heroImage ? [service.heroImage] : ['/imgs/services/transportation-cover.webp'],
    image: service.heroImage || '/imgs/services/transportation-cover.webp',
    price: pricePerTrip,
    pricePerTrip,
    pricePerDay: pricePerTrip,
    rating: 5.0,
    overview: [service.description || 'Premium private transportation and chauffeur service offering ultimate comfort, safety, and punctuality.'],
    highlights: ['Professional English-speaking Driver', 'Luxury Air-Conditioned Vehicle', 'Flight Tracking & Meet and Greet', 'Complimentary Bottled Water & Wi-Fi'],
    included: ['Private Chauffeur & Luxury Vehicle', 'Fuel, Tolls & Parking Fees', 'Airport Meet & Greet with Name Sign', 'Flight Delay Monitoring & Waiting Time'],
    excluded: ['Driver Gratuities (Optional)', 'Entry Tickets to Attractions', 'Extra Unscheduled Stops'],
    features: [],
    shortDesc: service.description || 'Premium private executive vehicle transfer service.',
    isActive: service.isActive === true,
  };
}`;

const updatedTransformHotel = `function transformHotelToService(hotel) {
  if (!hotel?.id || !hotel?.slug || !hotel?.name || !hotel?.destinationSlug || !hotel?.city) {
    throw new Error('Invalid hotel catalog item');
  }
  const stars = requireFiniteNumber(hotel.stars, 'stars', hotel.id, { positive: true });
  const pricePerNight = hotel.pricePerNight === null || hotel.pricePerNight === undefined
    ? null
    : requireFiniteNumber(hotel.pricePerNight, 'pricePerNight', hotel.id);
  const rating = hotel.rating === null || hotel.rating === undefined
    ? null
    : requireFiniteNumber(hotel.rating, 'rating', hotel.id);
  const amenities = Array.isArray(hotel.amenities)
    ? hotel.amenities
    : hotel.amenities && typeof hotel.amenities === 'object'
      ? Object.entries(hotel.amenities)
          .filter(([, enabled]) => enabled === true)
          .map(([name]) => name.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()))
      : [];
  return {
    ...hotel,
    category: 'hotels',
    title: hotel.name,
    location: \`\${hotel.city} - \${hotel.destinationSlug}\`,
    images: hotel.heroImageUrl ? [hotel.heroImageUrl] : [],
    image: hotel.heroImageUrl || null,
    rating: rating || stars || 5,
    stars,
    price: pricePerNight,
    pricePerNight,
    overview: [hotel.description || 'Luxury 5-star hotel offering world-class hospitality, fine dining, and prime location.'],
    highlights: amenities.length > 0 ? amenities : ['5-Star Luxury Experience', 'Prime Location', '24/7 Concierge Service'],
    included: ['Daily Gourmet Breakfast', 'High-Speed Wi-Fi', 'Access to Swimming Pool & Fitness Center', 'Concierge & Luggage Assistance'],
    excluded: ['Personal Expenses', 'Room Service & Minibar', 'Late Check-out Fees'],
    shortDesc: hotel.description || '',
    amenities,
    isActive: true,
  };
}`;

useServicesContent = useServicesContent.replace(/function transformHotelToService\(hotel\) \{[\s\S]*?\n\}/, updatedTransformHotel);
useServicesContent = useServicesContent.replace(/function transformTransportToService\(service\) \{[\s\S]*?\n\}/, updatedTransformTransport);

fs.writeFileSync(useServicesPath, useServicesContent);
console.log('Updated useServices.js successfully');
