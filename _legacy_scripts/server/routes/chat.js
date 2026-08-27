const express = require('express');
const router = express.Router();
const { processMessage } = require('../services/chatbotService');

// POST /api/chat
router.post('/', async (req, res, next) => {
  try {
    const { message, sessionId, language } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : 'https://www.dunas-travel2026.com');
    
    const result = await processMessage(sessionId, message, language, origin);
    
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
