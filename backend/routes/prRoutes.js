const express = require('express');
const router = express.Router();
const { getRepositories, createPullRequest } = require('../controllers/prController');
const authMiddleware = require('../middleware/auth');
console.log('🔧 Loading PR routes...');
router.get('/repositories', authMiddleware, getRepositories);
router.post('/create-pr', authMiddleware, createPullRequest);

module.exports = router;