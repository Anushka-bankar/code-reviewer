const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');
const auth = require('../middleware/auth');

router.get('/login', githubController.githubLogin);
router.get('/callback', githubController.githubCallback);

router.get('/', githubController.getUserInfo);



module.exports = router;