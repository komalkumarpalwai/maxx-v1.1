import api from './api';

export const profileService = {
  async getUserProfile(userId) {
    try {
  const response = await api.get(`/api/profile/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user profile');
    }
  },

  async updateProfile(profileData) {
    try {
  const response = await api.put('/api/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  async uploadProfilePicture(file) {
    // Profile image uploads have been disabled in this app version.
    // Keep this function for compatibility but always reject with a clear message.
    return Promise.reject(new Error('Profile picture uploads are disabled.'));
  },

  async getAllUsers() {
    try {
  const response = await api.get('/api/users/admins');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get all users');
    }
  },

  async deleteUser(userId) {
    try {
  const response = await api.delete(`/api/profile/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }

  ,
  async markPartnerInviteShown() {
    try {
      const response = await api.put('/api/profile/partner-invite');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark partner invite');
    }
  }
};

