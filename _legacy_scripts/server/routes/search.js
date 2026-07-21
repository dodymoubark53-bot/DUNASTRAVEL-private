const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const Faq = require('../models/Faq');
const { searchTours, searchFaqs } = require('../services/searchService');

// Helper to determine language
function getLang(req) {
  return req.query.lang || 'en';
}

// 1. GET /api/search
// Performs fuzzy search on both Tours and FAQs
router.get('/search', async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const lang = getLang(req);
    
    const matchedTours = await searchTours(query, lang);
    const matchedFaqs = await searchFaqs(query, lang);
    
    return res.json({
      tours: matchedTours,
      faqs: matchedFaqs
    });
  } catch (error) {
    next(error);
  }
});

// 2. GET /api/tours
// Retrieves tours with filtering options
router.get('/tours', async (req, res, next) => {
  try {
    const lang = getLang(req);
    const { destination, maxPrice, category } = req.query;
    
    const mongoQuery = { language: lang };
    
    if (destination) {
      mongoQuery.destination = destination.toLowerCase();
    }
    if (maxPrice) {
      mongoQuery.price = { $lte: Number(maxPrice) };
    }
    if (category) {
      const cleanCat = category.toLowerCase();
      if (['luxury', 'honeymoon', 'familyfriendly', 'adventure', 'cultural'].includes(cleanCat)) {
        const schemaKey = cleanCat === 'familyfriendly' ? 'familyFriendly' : cleanCat;
        mongoQuery[schemaKey] = true;
      } else {
        mongoQuery.category = cleanCat;
      }
    }
    
    const tours = await Tour.find(mongoQuery).sort({ price: 1 });
    return res.json(tours);
  } catch (error) {
    next(error);
  }
});

// 3. GET /api/destinations
// Retrieves a list of unique destinations and tour counts
router.get('/destinations', async (req, res, next) => {
  try {
    const lang = getLang(req);
    
    // Group tours by destination and count them
    const destinations = await Tour.aggregate([
      { $match: { language: lang } },
      { $group: { _id: '$destination', count: { $sum: 1 } } }
    ]);
    
    // Format response
    const formatted = destinations
      .filter(d => d._id && d._id !== '')
      .map(d => ({
        id: d._id,
        name: d._id.charAt(0).toUpperCase() + d._id.slice(1),
        tourCount: d.count
      }));
      
    return res.json(formatted);
  } catch (error) {
    next(error);
  }
});

// 4. GET /api/packages
// Retrieves programs / packages (typically tours of type 'Program' or category 'classic')
router.get('/packages', async (req, res, next) => {
  try {
    const lang = getLang(req);
    const packages = await Tour.find({
      language: lang,
      $or: [
        { type: 'Program' },
        { category: 'classic' }
      ]
    }).sort({ price: 1 });
    
    return res.json(packages);
  } catch (error) {
    next(error);
  }
});

// 5. GET /api/faqs
// Retrieves FAQs with category filter
router.get('/faqs', async (req, res, next) => {
  try {
    const lang = getLang(req);
    const { category } = req.query;
    
    const query = { language: lang };
    if (category) {
      query.category = category;
    }
    
    const faqs = await Faq.find(query);
    return res.json(faqs);
  } catch (error) {
    next(error);
  }
});

// 6. GET /api/recommendations
// Smart recommendations based on budget, duration, and category
router.get('/recommendations', async (req, res, next) => {
  try {
    const lang = getLang(req);
    const { budget, duration, category } = req.query;
    
    const query = { language: lang };
    
    if (budget) {
      query.price = { $lte: Number(budget) };
    }
    
    if (category) {
      const cleanCat = category.toLowerCase();
      if (['luxury', 'honeymoon', 'familyfriendly', 'adventure', 'cultural'].includes(cleanCat)) {
        const schemaKey = cleanCat === 'familyfriendly' ? 'familyFriendly' : cleanCat;
        query[schemaKey] = true;
      }
    }
    
    let tours = await Tour.find(query);
    
    // Sort by proximity of duration days or rating
    if (duration) {
      tours.sort((a, b) => {
        // Parse a simple numeric representation of duration days from Tour duration
        const getDays = (d) => {
          const match = d.match(/(\d+)\s*(?:day|days|dias|dia|giorni|giorno|يوم|أيام|ايام)/i);
          return match ? parseInt(match[1], 10) : 1;
        };
        const diffA = Math.abs(getDays(a.duration) - Number(duration));
        const diffB = Math.abs(getDays(b.duration) - Number(duration));
        return diffA - diffB;
      });
    } else {
      tours.sort((a, b) => b.rating - a.rating);
    }
    
    return res.json(tours.slice(0, 5));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
