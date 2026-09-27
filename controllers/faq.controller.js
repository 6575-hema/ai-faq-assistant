const FAQ = require('../models/faq.model');
const { getGeminiResponse } = require('../services/gemini.service');

// Admin Controller: Add a new FAQ
const createFAQ = async (req, res, next) => {
  try {
    const { question, answer, category } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required' });
    }
    const faq = await FAQ.create({ question, answer, category });
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
};

// Admin Controller: Get all FAQs
const getAllFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    next(error);
  }
};

// Employee Controller: Ask AI Chatbot a Question
const askChatbot = async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: 'Please provide a question.' });
    }

    const faqs = await FAQ.find();
    const aiAnswer = await getGeminiResponse(question, faqs);

    res.status(200).json({
      success: true,
      userQuestion: question,
      aiAnswer: aiAnswer,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFAQ,
  getAllFAQs,
  askChatbot,
};