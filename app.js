const path = require('path');
const express = require('express');
const cors = require('cors');
const faqRoutes = require('./routes/faq.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', faqRoutes);

// Web UI (public/index.html is served at /)
app.use(express.static(path.join(__dirname, 'public')));

// Health check route
app.get('/api/health', (req, res) => {
  res.send('AI FAQ Assistant Backend Service is Running.');
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;