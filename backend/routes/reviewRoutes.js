const express = require('express');
const router = express.Router();
const { reviewCode, getReviewHistory, getReviewById, deleteReview } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');

// Optional auth middleware - doesn't block if no token
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log('✅ Optional auth succeeded:', decoded.githubId); // ✅ ADD THIS
    } else {
      console.log('ℹ️  No auth header, proceeding as anonymous'); // ✅ ADD THIS
    }
  } catch (error) {
    console.error('⚠️  Optional auth failed:', error.message); // ✅ CHANGE THIS
    // Token is invalid, proceed as anonymous
    req.user = null;
  }
  next();
};
// Use optional auth on all routes
router.post('/', optionalAuth, reviewCode);
router.get('/history', optionalAuth, getReviewHistory);
router.get('/:id', optionalAuth, getReviewById);
router.delete('/:id', optionalAuth, deleteReview);

module.exports = router;