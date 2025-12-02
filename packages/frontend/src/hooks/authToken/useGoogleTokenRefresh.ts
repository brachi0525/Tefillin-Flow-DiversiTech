import { useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { useGoogleToken } from './useGoogleToken';

export const useGoogleTokenRefresh = () => {
  const { setGoogleTokens, clearGoogleTokens, getUserDataFromServer } = useGoogleToken();

  const refreshGoogleAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      // קבלת פרטי המשתמש מהשרת כדי לדעת את ה-google_id
      const userData = await getUserDataFromServer();
      
      if (!userData?.google_id) {
        console.warn('No user data or google_id found');
        clearGoogleTokens();
        return null;
      }

      // בקשת refresh עם google_id
      const response = await axios.post('/api/auth/google/refresh', {
        google_id: userData.google_id
      });

      const { access_token } = response.data;

      if (access_token) {
        // שמירת רק ה-access_token החדש
        setGoogleTokens(access_token);
        return access_token;
      } else {
        console.error('No access_token returned on refresh');
        clearGoogleTokens();
        return null;
      }
    } catch (error: unknown) { // הצהרת סוג של 'unknown'
      console.error('Failed to refresh Google access token', error);

      // הצהרת סוג ל-AxiosError
      if ((error as AxiosError).response?.status === 401 || (error as AxiosError).response?.status === 400) {
        console.warn('Refresh failed, user needs to re-login');
        clearGoogleTokens();
      }

      return null;
    }
  }, [getUserDataFromServer, setGoogleTokens, clearGoogleTokens]);

  return { refreshGoogleAccessToken };
};
