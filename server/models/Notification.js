const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['new_post', 'comment', 'upvote'], required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);