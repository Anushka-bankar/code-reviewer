require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnect = require('../config/db');
const reviewRoutes = require('../routes/reviewRoutes');
const githubRoutes = require('../routes/githubRoutes');
const prRoutes = require('../routes/prRoutes');
const errorHandler = require('../middleware/errorHandler');

const app = express();

// 🔒 Safe DB connection for serverless
let isConnected = false;
async function connectDBOnce() {
  if (isConnected) return;
  await dbConnect();
  isConnected = true;
}
connectDBOnce();

// CORS config
const corsOptions = {
  origin: [
    'https://aireviewmate-gdg-nitk.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', message: 'Server is running on Vercel' })
);

// Routes
app.use('/api/review', reviewRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/pr', prRoutes);

// 404 handler
app.use((req, res) =>
  res.status(404).json({ error: 'Route not found' })
);

// Global error handler
app.use(errorHandler);

module.exports = app;
