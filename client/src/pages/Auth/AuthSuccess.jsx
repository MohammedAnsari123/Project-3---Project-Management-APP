import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useContext(AuthContext); // We need to add this method to context

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            if (loginWithToken) {
                // Call context to update user state and then navigate
                loginWithToken(token)
                    .then(() => {
                        // Navigation to root/dashboard
                        navigate('/');
                    })
                    .catch(() => {
                        navigate('/login');
                    });
            } else {
                // Fallback
                window.location.href = '/';
            }
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate, loginWithToken]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Authenticating...</h2>
                <p className="text-gray-600">Please wait while we log you in.</p>
            </div>
        </div>
    );
};

export default AuthSuccess;
