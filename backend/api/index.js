require('dotenv').config();
const express = require('express');
const cors = require('cors');

const reviewRoutes = require('../routes/reviewRoutes');
const githubRoutes = require('../routes/githubRoutes');
const prRoutes = require('../routes/prRoutes');
const errorHandler = require('../middleware/errorHandler');

const app = express();

app.use(cors({
  origin: [
    'https://aireviewmate-gdg-nitk.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

// Root (optional but useful)
app.get('/', (req, res) => {
  res.send('Code Reviewer Backend is running 🚀');
});

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running on Vercel' });
});

// Routes
app.use('/api/review', reviewRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/pr', prRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Errors
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
