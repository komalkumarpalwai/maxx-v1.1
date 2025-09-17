const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    console.log('Auth middleware - Request headers:', {
      auth: authHeader ? 'Present' : 'Missing',
      path: req.path,
      method: req.method
    });
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth middleware - Invalid auth header format');
      return res.status(401).json({ 
        message: 'Access denied. No token provided.',
        hint: 'Please log in to access this resource.'
      });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. Invalid token format.',
        hint: 'Please log in to access this resource.'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Check if token is about to expire (within 5 minutes)
      const tokenExp = decoded.exp * 1000; // Convert to milliseconds
      const fiveMinutes = 5 * 60 * 1000;
      if (tokenExp - Date.now() < fiveMinutes) {
        // Add warning header to notify client
        res.set('X-Token-Expiring-Soon', 'true');
      }
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError.name, jwtError.message);
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token expired',
          hint: 'Your session has expired. Please log in again.'
        });
      }
      
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Invalid token',
          hint: 'Please log in again with valid credentials.'
        });
      }
      
      return res.status(401).json({ 
        message: 'Authentication failed',
        hint: 'Please try logging in again.'
      });
    }

  // Removed all hardcoded admin and superadmin logic
    // Accept database superadmin user
    if (decoded.role === 'superadmin') {
      const user = await User.findById(decoded.userId).select('-password');
      if (user && user.role === 'superadmin' && user.isActive) {
        req.user = user;
        return next();
      }
    }

    // Find user and check if active
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found',
        hint: 'Your account may have been deleted. Please contact administrator.'
      });
    }
    if (!user.isActive) {
      return res.status(403).json({ 
        message: 'Account deactivated',
        hint: 'Your account has been deactivated. Please contact administrator.'
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      message: 'Authentication error',
      hint: 'Please try logging in again.'
    });
  }
};


const isAdmin = (req, res, next) => {
  console.log('isAdmin middleware:', {
    user: req.user,
    role: req.user?.role,
    token: req.header('Authorization'),
    userId: req.user?._id,
    isActive: req.user?.isActive
  });
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin' || req.user.role === 'faculty')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin or Superadmin role required.' });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Superadmin role required.' });
  }
};

const isFaculty = (req, res, next) => {
  if (req.user && (req.user.role === 'faculty' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Faculty role required.' });
  }
};

module.exports = { auth, isAdmin, isSuperAdmin, isFaculty };
