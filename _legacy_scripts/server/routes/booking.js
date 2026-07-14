const express = require('express');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking or inquiry
// @access  Public
router.post('/', async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    console.error('Booking creation error:', err.message);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID (with invoice details)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    console.error('Booking fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch booking' });
  }
});

// @route   GET /api/bookings/invoice/:invoiceNumber
// @desc    Get booking by invoice number
// @access  Public
router.get('/invoice/:invoiceNumber', async (req, res) => {
  try {
    const booking = await Booking.findOne({ invoiceNumber: req.params.invoiceNumber });
    if (!booking) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(booking);
  } catch (err) {
    console.error('Invoice fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch invoice' });
  }
});

// @route   GET /api/bookings/email/:email
// @desc    Get all bookings for an email
// @access  Public
router.get('/email/:email', async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('Bookings fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings (admin)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Bookings fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status (admin)
// @access  Private
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    console.error('Status update error:', err.message);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

module.exports = router;
