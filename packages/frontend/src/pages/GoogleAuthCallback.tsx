import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Typography, Button } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../hooks/AuthContext'; // ודא שהנתיב תואם למיקום הקונטקסט שלך

const GoogleAuthCallback = () => {
  const [params] = useSearchParams();
  const code = params.get('code');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasProcessed = useRef(false);
  const { login } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      if (hasProcessed.current || !code) {
        if (!code) navigate('/login');
        return;
      }

      hasProcessed.current = true;

      try {
        const redirectUri = window.location.origin + '/google-auth-callback';

        const response = await axiosInstance.post('/api/auth/google/auth', {
          code,
          redirectUri
        });

        const {
          internalAccessToken,
          internalRefreshToken,
          googleAccessToken,
          googleRefreshToken,
          user
        } = response.data;

        login(internalAccessToken, user, internalRefreshToken, googleAccessToken, googleRefreshToken);

        // ניקוי ה-URL
        window.history.replaceState({}, document.title, window.location.pathname);

        navigate('/');
      } catch (error: any) {
        console.error('Google auth error:', error);

        if (error.response?.status === 401) {
          setErrorMessage('המשתמש לא רשום במערכת. אנא פנה למנהל.');
        } else if (error.response?.status === 400) {
          setErrorMessage('קוד ההרשאה לא תקין או שפג תוקפו. אנא נסה שוב.');
        } else {
          setErrorMessage('אירעה שגיאה בהתחברות עם Google. אנא נסה שוב.');
        }

        setIsLoading(false);
      }
    };

    handleAuth();
  }, [code, navigate, login]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>מתחבר...</Typography>
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        px={2}
        textAlign="center"
      >
        <Typography color="error" variant="h6" gutterBottom>
          {errorMessage}
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/login')}>
          חזרה להתחברות
        </Button>
      </Box>
    );
  }

  return null;
};

export default GoogleAuthCallback;
