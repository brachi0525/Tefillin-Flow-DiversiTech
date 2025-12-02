import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
export const googleAuthService = {
  exchangeCodeForTokens: async (code: string, redirectUri: string) => {
    const response = await axios.post(`${API_URL}/api/auth/google/auth`, {
      code,
      redirectUri,
    });
    return response.data; // { access_token, refresh_token, user }
  },

  refreshAccessToken: async (refreshToken: string) => {
    const response = await axios.post(`${API_URL}/api/auth/google/refresh`, {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};