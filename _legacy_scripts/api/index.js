const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Lazy MongoDB connection (cached across warm invocations)
let dbConnected = false;
const { seedDatabase } = require('../server/utils/seeder');

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
    // Run seeder check
    await seedDatabase();
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

// Mount routes
const authRoutes = require('../server/routes/auth');
const bookingRoutes = require('../server/routes/booking');
const chatRoutes = require('../server/routes/chat');
const searchRoutes = require('../server/routes/search');

app.use('/api/auth', async (req, res, next) => {
  await connectDB();
  next();
}, authRoutes);

app.use('/api/bookings', async (req, res, next) => {
  await connectDB();
  next();
}, bookingRoutes);

app.use('/api/chat', async (req, res, next) => {
  await connectDB();
  next();
}, chatRoutes);

app.use('/api', async (req, res, next) => {
  await connectDB();
  next();
}, searchRoutes);

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
