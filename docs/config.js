// Where the Express backend lives.
// After deploying to Render, replace the URL below with your own Render URL.
const RENDER_URL = 'https://ai-faq-assistant-9gvp.onrender.com';

const isLocal = ['localhost', '127.0.0.1', ''].includes(location.hostname);
// Served by Express itself (localhost:5000) -> same origin; opened any other local way -> point at localhost:5000.
const API_BASE = isLocal ? (location.port === '5000' ? '' : 'http://localhost:5000') : RENDER_URL;

const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Minimal formatting for AI answers: escape HTML, then support **bold**.
const formatAnswer = (text) => escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

// Mark the current page's nav link as active.
document.addEventListener('DOMContentLoaded', () => {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) toggle.addEventListener('click', () => document.querySelector('.nav-links').classList.toggle('open'));
});
