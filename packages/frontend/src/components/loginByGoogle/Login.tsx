import React, { useState } from 'react';
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import './Login.css';
import { useAuthenticate } from '../../services/authentication/authentication';
import ErrorBoundary from '../ErrorBoundary';



const Login: React.FC = () => {
    const { authenticate } = useAuthenticate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const CLIENT_ID = process.env.CLIENT_ID || '';

    const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
        try {
            await authenticate(credentialResponse)
            setIsLoggedIn(true);
        }
        catch (error) {
            throw new Error('Authentication failed: ' + error);
        }
    };

    const handleLoginError = () => {
        throw new Error('Error during login: Please try again later.');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
    };

    return (
        <ErrorBoundary>
            <GoogleOAuthProvider clientId={CLIENT_ID}>
                {isLoggedIn ? (
                    <div className='login-container'>
                        <h1>ברוך הבא!</h1>
                        <p>התחברת בהצלחה</p>
                        <button onClick={handleLogout}>התנתק</button>
                    </div>
                ) : (
                    <div className='login-container'>
                        <h1>ברוך הבא לפרויקט תפילין של חב"ד</h1>
                        <p>יש להתחבר כדי להמשיך</p>
                        <GoogleLogin onSuccess={handleGoogleLogin} onError={handleLoginError} />
                    </div>
                )}
            </GoogleOAuthProvider>
        </ErrorBoundary>
    );
};

export default Login;