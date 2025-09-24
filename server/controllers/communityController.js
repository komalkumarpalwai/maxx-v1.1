
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const User = require('../models/User');


// Get all posts (feed)
async function getPosts(req, res) {
  const posts = await Post.find()
    .populate('user', 'name role')
    .populate('comments.user', 'name role')
    .sort({ createdAt: -1 });
  res.json(posts);
}

// Create a new post
async function createPost(req, res) {
  let content = req.body.caption || req.body.content;
  let image = req.body.image;
  // If file uploaded, store just the filename
  if (req.file) {
    image = req.file.filename;
  }
  console.log('[DEBUG] Creating post with content:', content, 'and image:', image);
  if (!content && !image) {
    return res.status(400).json({ message: 'Caption or image is required.' });
  }
  const post = new Post({ 
    user: req.user._id, 
    content, 
    image,
    caption: content
  });
  await post.save();
  // Notify all users except poster
  const users = await User.find({ _id: { $ne: req.user._id } });
  await Notification.insertMany(users.map(u => ({ user: u._id, type: 'new_post', post: post._id })));
  res.status(201).json(post);
}

// Upvote or remove upvote
async function toggleUpvote(req, res) {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  const userId = req.user._id.toString();
  const idx = post.upvotes.findIndex(u => u.toString() === userId);
  if (idx === -1) {
    post.upvotes.push(userId);
  } else {
    post.upvotes.splice(idx, 1);
  }
  await post.save();
  res.json({ upvotes: post.upvotes.length });
}

// Add a comment
async function addComment(req, res) {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  post.comments.push({ user: req.user._id, text: req.body.text });
  await post.save();
  // Notify post owner
  if (post.user.toString() !== req.user._id.toString()) {
    await Notification.create({ user: post.user, type: 'comment', post: post._id });
  }
  res.status(201).json(post.comments[post.comments.length - 1]);
}

// Get notifications for user
async function getNotifications(req, res) {
  const notifications = await Notification.find({ user: req.user._id }).populate('post').sort({ createdAt: -1 });
  res.json(notifications);
}

// Mark notification as read
async function markNotificationRead(req, res) {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ success: true });
}

// Admin/superadmin: delete any post
async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check authorization
    if (
      req.user.role === 'admin' ||
      req.user.role === 'superadmin' ||
      post.user.toString() === req.user._id.toString()
    ) {
      await Post.findByIdAndDelete(req.params.id);
      // Also delete any associated notifications
      await Notification.deleteMany({ post: req.params.id });
      
      res.json({ success: true, message: 'Post deleted successfully' });
    } else {
      res.status(403).json({ message: 'Not authorized to delete this post' });
    }
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
}

// Admin/superadmin: update any post
async function updatePost(req, res) {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (
    req.user.role === 'admin' ||
    req.user.role === 'superadmin' ||
    post.user.toString() === req.user._id.toString()
  ) {
    post.content = req.body.content || post.content;
    post.image = req.body.image || post.image;
    post.updatedAt = Date.now();
    await post.save();
    res.json(post);
  } else {
    res.status(403).json({ message: 'Not authorized' });
  }
}

module.exports = {
  getPosts,
  createPost,
  toggleUpvote,
  addComment,
  getNotifications,
  markNotificationRead,
  deletePost,
  updatePost
};
