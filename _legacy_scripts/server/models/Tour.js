const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Identifier from file, e.g. 'eg-br-001'
  slug: { type: String, required: true },
  language: { type: String, required: true }, // 'en', 'es', 'pt', 'it', 'ar'
  market: { type: String, default: 'Global' },
  type: { type: String, default: '' },
  duration: { type: String, default: '' },
  destination: { type: String, default: '' }, // 'egypt', 'greece', 'turkey', 'tunisia', 'jordan'
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  overview: { type: String, default: '' },
  departures: { type: String, default: '' },
  price: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  images: [{ type: String }],
  highlights: [{ type: String }],
  included: [{ type: String }],
  excluded: [{ type: String }],
  itinerary: [{
    day: { type: String },
    title: { type: String },
    description: { type: String },
    meals: { type: String }
  }],
  accommodation: [{
    destination: { type: String },
    nights: { type: Number },
    regime: { type: String }
  }],
  hotels: { type: mongoose.Schema.Types.Mixed }, // Array or Map of hotels
  hotelCategory: { type: String, default: '' },
  
  // Categorization tags for recommendations and filters
  category: { type: String, default: '' }, // 'classic', 'honeymooners', 'religious', 'hotels', 'extension', etc.
  familyFriendly: { type: Boolean, default: false },
  honeymoon: { type: Boolean, default: false },
  adventure: { type: Boolean, default: false },
  luxury: { type: Boolean, default: false },
  cultural: { type: Boolean, default: false }
}, { timestamps: true });

// Index for query optimization
TourSchema.index({ slug: 1, language: 1 }, { unique: true });
TourSchema.index({ id: 1, language: 1 }, { unique: true });
TourSchema.index({ destination: 1, language: 1 });

module.exports = mongoose.model('Tour', TourSchema);
