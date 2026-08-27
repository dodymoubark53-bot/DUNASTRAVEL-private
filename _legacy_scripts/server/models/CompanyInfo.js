const mongoose = require('mongoose');

const CompanyInfoSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g., 'booking_process', 'cancellation_policy', 'payment_methods', 'visa_services', 'contact_info'
  language: { type: String, required: true }, // 'en', 'es', 'pt', 'it', 'ar'
  title: { type: String, required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true } // Array of strings or structured object or clean text
}, { timestamps: true });

CompanyInfoSchema.index({ key: 1, language: 1 }, { unique: true });

module.exports = mongoose.model('CompanyInfo', CompanyInfoSchema);
