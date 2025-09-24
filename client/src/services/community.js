
import api from './api';

const API_PATH = '/api/community';

// Delete a community post by id
export const deletePost = async (postId, token) => {
  if (!token) {
    console.error('No token provided for delete post');
    throw new Error('Authentication token is required');
  }

  console.log('Deleting post with token:', token ? 'Token present' : 'No token');
  
  try {
    const res = await api.delete(`${API_PATH}/posts/${postId}`);
    console.log('Delete post response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Delete post error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      token: token ? 'Token present' : 'No token'
    });
    throw error;
  }
};

export const getPosts = async (token) => {
  const res = await api.get(`${API_PATH}/posts`);
  return res.data;
};

export const createPost = async (post, token, isFormData = false) => {
  const config = isFormData ? {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  } : {};
  
  const res = await api.post(`${API_PATH}/posts`, post, config);
  return res.data;
};

export const toggleUpvote = async (postId, token) => {
  const res = await api.post(`${API_PATH}/posts/${postId}/upvote`, {});
  return res.data;
};

export const addComment = async (postId, text, token) => {
  const res = await api.post(`${API_PATH}/posts/${postId}/comments`, { text });
  return res.data;
};

export const getNotifications = async (token) => {
  const res = await api.get(`${API_PATH}/notifications`);
  return res.data;
};

export const markNotificationRead = async (notifId, token) => {
  const res = await api.put(`${API_PATH}/notifications/${notifId}/read`, {});
  return res.data;
};
