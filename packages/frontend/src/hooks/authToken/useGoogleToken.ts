import { useCallback } from 'react';
import { storage } from '../../utils/storage';
import { GOOGLE_ACCESS_TOKEN_KEY } from '../../constants/storageKeys';

export const useGoogleToken = () => {
  // שמירת רק access_token בלוקל סטורג'
  const setGoogleTokens = useCallback((accessToken: string) => {
    storage.set(GOOGLE_ACCESS_TOKEN_KEY, accessToken);
  }, []);

  const getGoogleAccessToken = useCallback(() => 
    storage.get(GOOGLE_ACCESS_TOKEN_KEY), []);

  const clearGoogleTokens = useCallback(() => {
    storage.remove(GOOGLE_ACCESS_TOKEN_KEY);
  }, []);

  // פונקציה לקבלת פרטי המשתמש מהשרת (לא מלוקל סטורג')
  const getUserDataFromServer = useCallback(async () => {
    try {
      const accessToken = getGoogleAccessToken();
      if (!accessToken) return null;

      // קריאה לשרת לקבלת פרטי המשתמש
      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Failed to get user data from server:', error);
      return null;
    }
  }, [getGoogleAccessToken]);

  return {
    setGoogleTokens,
    getGoogleAccessToken,
    clearGoogleTokens,
    getUserDataFromServer,
  };
};
