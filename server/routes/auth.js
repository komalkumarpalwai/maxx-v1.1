const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, adminLogin } = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);

// Protected routes
router.get('/me', auth, getCurrentUser);

// Token refresh route
router.post('/refresh-token', auth, async (req, res) => {
  try {
    const user = req.user;
    // Generate a new token
    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ 
      message: 'Failed to refresh token',
      hint: 'Please try logging in again.'
    });
  }
});

module.exports = router;








