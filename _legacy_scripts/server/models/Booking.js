const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['booking', 'inquiry', 'transport'],
    default: 'booking'
  },
  tourTitle: { type: String, default: '' },
  transportChoice: { type: String, default: '' },

  // Dates & Times
  arrivalDate: { type: String, default: '' },
  departureDate: { type: String, default: '' },
  arrivalTime: { type: String, default: '' },
  departureTime: { type: String, default: '' },

  // Language
  language: { type: String, default: '' },

  // Passengers
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 },
  infants: { type: Number, default: 0 },
  passengerNames: { type: Map, of: String, default: {} },

  // Contact
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },

  // Billing / Invoice
  invoiceType: { type: String, enum: ['personal', 'company'], default: 'personal' },
  companyName: { type: String, default: '' },
  taxId: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  country: { type: String, default: '' },

  // Notes
  notes: { type: String, default: '' },

  // Pricing
  basePricePerPerson: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },

  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  invoiceNumber: { type: String, unique: true, sparse: true },

  // Inquiry specific
  inquiryMessage: { type: String, default: '' },

  // Transport specific
  vehicleId: { type: String, default: '' },
  tripDate: { type: String, default: '' },
  pickupTime: { type: String, default: '' },
  pickupLocation: { type: String, default: '' },
  dropoffLocation: { type: String, default: '' },
  specialRequest: { type: String, default: '' }
}, { timestamps: true });

// Generate invoice number before saving
BookingSchema.pre('save', function (next) {
  if (this.type === 'booking' && !this.invoiceNumber) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    this.invoiceNumber = `INV-${year}${month}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
