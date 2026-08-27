const mongoose = require('mongoose');

const FaqSchema = new mongoose.Schema({
  faqId: { type: String, required: true }, // unique ID e.g. 'general-q1'
  language: { type: String, required: true }, // 'en', 'es', 'pt', 'it', 'ar'
  category: { type: String, default: 'general' }, // 'general', 'booking', 'cancellation', etc.
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { timestamps: true });

FaqSchema.index({ faqId: 1, language: 1 }, { unique: true });
FaqSchema.index({ language: 1 });

module.exports = mongoose.model('Faq', FaqSchema);
