const express = require('express');
const router = express.Router();
const path = require('path');
const { auth, isAdmin, isSuperAdmin, isFaculty } = require('../middlewares/auth');
const {
  getUserProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  createUser,
  adminUpdateUser,
  updateUserStatus,
  resetUserPassword,
  updatePreferences,
  deleteMe
} = require('../controllers/profileController');
// Self delete/deactivate
router.delete('/me', auth, deleteMe);
// Update user preferences (theme, font size)
router.put('/preferences', auth, updatePreferences);


// Admin/Faculty routes (define /users before /:id to avoid conflict)
router.get('/users', auth, isFaculty, getAllUsers);
// Only superadmin can create admin users
router.post('/users', auth, isSuperAdmin, createUser);

// Only superadmin can update/delete/reset admin users, others as before
router.put('/:id', auth, (req, res, next) => {
  if (req.body.role === 'admin' || req.body.role === 'superadmin') {
    return isSuperAdmin(req, res, next);
  }
  return isAdmin(req, res, next);
}, adminUpdateUser);
router.put('/:id/status', auth, (req, res, next) => {
  if (req.body.role === 'admin' || req.body.role === 'superadmin') {
    return isSuperAdmin(req, res, next);
  }
  return isAdmin(req, res, next);
}, updateUserStatus);
router.put('/:id/reset-password', auth, (req, res, next) => {
  if (req.body.role === 'admin' || req.body.role === 'superadmin') {
    return isSuperAdmin(req, res, next);
  }
  return isAdmin(req, res, next);
}, resetUserPassword);

// Profile routes (protected)
router.get('/:id', auth, getUserProfile);
router.put('/', auth, updateProfile);
// Mark partner invite as shown for current user
router.put('/partner-invite', auth, (req, res) => {
  // delegate to controller
  return require('../controllers/profileController').markPartnerInviteShown(req, res);
});
// profile image uploads removed — no upload route
router.delete('/:id', auth, (req, res, next) => {
  if (req.body.role === 'admin' || req.body.role === 'superadmin') {
    return isSuperAdmin(req, res, next);
  }
  return isAdmin(req, res, next);
}, deleteUser);

module.exports = router;








