const mongoose = require('mongoose');

const ChatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  history: [{
    sender: { type: String, enum: ['user', 'jaider'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  context: {
    lastTourId: { type: String, default: '' },
    lastTourSlug: { type: String, default: '' },
    lastDestination: { type: String, default: '' },
    filters: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  // Automatic TTL index: delete documents after 1 hour (3600 seconds) of inactivity
  updatedAt: { type: Date, default: Date.now, index: { expires: 3600 } }
}, { timestamps: true });

// Pre-save middleware to update the updatedAt timestamp
ChatSessionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
