const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const communityController = require('../controllers/communityController');
console.log('communityController:', communityController);

// Feed

router.get('/posts', communityController.getPosts);
router.post('/posts', auth, upload.single('image'), communityController.createPost);
router.post('/posts/:id/upvote', auth, communityController.toggleUpvote);
router.post('/posts/:id/comments', auth, communityController.addComment);
router.delete('/posts/:id', auth, communityController.deletePost);
router.put('/posts/:id', auth, communityController.updatePost);

// Notifications
router.get('/notifications', auth, communityController.getNotifications);
router.put('/notifications/:id/read', auth, communityController.markNotificationRead);

module.exports = router;
