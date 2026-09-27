const express = require('express');
const router = express.Router();
const {createFAQ, getAllFAQs,askChatbot }= require('../controllers/faq.controller');

// Admin Routes
router.post('/faqs', createFAQ);
router.get('/faqs', getAllFAQs);

// Employee Route
router.post('/chat', askChatbot);

module.exports = router;