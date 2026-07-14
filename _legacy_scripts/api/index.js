const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Lazy MongoDB connection (cached across warm invocations)
let dbConnected = false;
async function connectDB() {
  if (dbConnected) return;
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI not set — running without database');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    dbConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

// Mount routes
const authRoutes = require('../server/routes/auth');
const bookingRoutes = require('../server/routes/booking');

app.use('/api/auth', async (req, res, next) => {
  await connectDB();
  next();
}, authRoutes);

app.use('/api/bookings', async (req, res, next) => {
  await connectDB();
  next();
}, bookingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
