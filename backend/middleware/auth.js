const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    
    if (!token) return res.status(401).json({ success: false, error: 'Token missing' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('🔐 Decoded JWT token:', decoded); // ✅ ADD THIS
    console.log('🔐 githubId in token:', decoded.githubId); // ✅ ADD THIS
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT auth error:', error.message);
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};