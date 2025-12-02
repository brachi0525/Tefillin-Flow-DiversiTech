import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useRefreshTokenMutation } from '../services/apiClient';

const AppInitializer = ({ onFinish }: { onFinish: () => void }) => {
    const navigate = useNavigate();
    const [refreshToken] = useRefreshTokenMutation();

    const isTokenExpired = (token: string): boolean => {
        console.log(`Checking token expiration for: ${token}`);

        try {
            const payloadBase64 = token.split('.')[1];
            const decodedPayload = atob(payloadBase64);
            const payload = JSON.parse(decodedPayload);
            const exp = payload.exp;
            const currentTime = Math.floor(Date.now() / 1000);
            return exp < currentTime;
        } catch {
            return true;
        }
    };

    useEffect(() => {

        const checkToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                onFinish();
                return;
            }

            if (isTokenExpired(token)) {
                try {
                    const newToken = await refreshToken().unwrap();
                    if (newToken) {
                        localStorage.setItem('token', newToken.accessToken);
                        navigate('/');
                    } else {
                        navigate('/login');
                    }
                } catch {
                    navigate('/login');
                } finally {
                    onFinish();

                }
            } else {
                navigate('/');
                onFinish();

            }
        };

        checkToken();
    }, []);


    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh" flexDirection="column">
            <CircularProgress />
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>טוען...</div>
        </Box>
    )



};

export default AppInitializer;
