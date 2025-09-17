
import axios from 'axios';

// Delete a community post by id
export const deletePost = async (postId, token) => {
  if (!token) {
    console.error('No token provided for delete post');
    throw new Error('Authentication token is required');
  }

  console.log('Deleting post with token:', token ? 'Token present' : 'No token');
  
  try {
    const res = await axios.delete(`${API}/posts/${postId}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    });
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

const API = 'http://localhost:5000/api/community';

export const getPosts = async (token) => {
  const res = await axios.get(`${API}/posts`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createPost = async (post, token, isFormData = false) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  if (isFormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  const res = await axios.post(`${API}/posts`, post, config);
  return res.data;
};

export const toggleUpvote = async (postId, token) => {
  const res = await axios.post(`${API}/posts/${postId}/upvote`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const addComment = async (postId, text, token) => {
  const res = await axios.post(`${API}/posts/${postId}/comments`, { text }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getNotifications = async (token) => {
  const res = await axios.get(`${API}/notifications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const markNotificationRead = async (notifId, token) => {
  const res = await axios.put(`${API}/notifications/${notifId}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
