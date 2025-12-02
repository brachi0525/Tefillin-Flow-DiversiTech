import React, { useState, useEffect } from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';

import router from './routing/Router '; // בדוק שאת מכילה שם את הנתיבים ל-LoginPage ו-GoogleAuthCallback
import { getTheme } from './theme/theme';
import { Provider } from 'react-redux';
import store from './services/store';
import { LoadingProvider } from './components/generics/genericLoading/LoadingContext';

import { ThemeProvider, CssBaseline, Box, CircularProgress, Typography } from '@mui/material';
import { AuthProvider } from './hooks/AuthContext';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/health');
        if (!res.ok) throw new Error('API server not responding');
        setLoading(false);
      } catch (err) {
        setError('Could not connect to API server. Make sure it is running.');
        setLoading(false);
      }
    };
    checkApiHealth();
  }, []);

  if (loading) {
    return (
      <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        px={2}
      >
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          אנא ודא שהשרת פועל ונסה לרענן את הדף.
        </Typography>
      </Box>
    );
  }

  return (
    <AuthProvider>
    <LoadingProvider>
      <ThemeProvider theme={getTheme('light')}>
        <CssBaseline />
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </ThemeProvider>
    </LoadingProvider>
    </AuthProvider>
  );
}

export default App;
