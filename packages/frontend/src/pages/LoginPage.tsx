import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID!;
const REDIRECT_URI = `${window.location.origin}/google-auth-callback`;
const SCOPE = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar",
].join(" ");

const LoginPage: React.FC = () => {
  const handleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      alert("Google Client ID is not set. Please configure it in .env");
      return;
    }

    const params = new URLSearchParams({
      response_type: "code",
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: SCOPE,
      access_type: "offline",
      prompt: "consent",
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: "center" }}>
      <Box p={4} boxShadow={3} borderRadius={4}>
        <Typography variant="h4" gutterBottom>
          התחברות עם Google
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          לחץ על הכפתור כדי להתחבר עם חשבון Google שלך
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          size="large"
          sx={{ mt: 3 }}
        >
          התחבר עם Google
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
