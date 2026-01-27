require('dotenv').config();
const express = require('express');
const cors = require('cors');

const reviewRoutes = require('../routes/reviewRoutes');
const githubRoutes = require('../routes/githubRoutes');
const prRoutes = require('../routes/prRoutes');
const errorHandler = require('../middleware/errorHandler');

const app = express();

/* ---------- Middleware ---------- */
app.use(cors({
  origin: [
    'https://aireviewmate-gdg-nitk.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

/* ---------- Base Routes ---------- */
app.get('/', (req, res) => {
  res.send('Code Reviewer Backend is running 🚀');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running on Render' });
});

/* ---------- API Routes ---------- */
console.log('🔧 Loading API routes...');
app.use('/api/review', reviewRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/pr', prRoutes);
console.log('✅ API routes loaded');

/* ---------- 404 ---------- */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/* ---------- Error Handler ---------- */
app.use(errorHandler);

/* ---------- Server ---------- */
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* ---------- Safety Logs ---------- */
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

module.exports = app;
