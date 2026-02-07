import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('https://project-3-project-management-app.onrender.com/api/auth/login', {
                email,
                password,
            });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const register = async (username, email, password) => {
        try {
            const { data } = await axios.post('https://project-3-project-management-app.onrender.com/api/auth/register', {
                username,
                email,
                password,
            });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const loginWithToken = async (token) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get('https://project-3-project-management-app.onrender.com/api/auth/me', config);
            // Combine profile data with token
            const userInfo = { ...data, token };
            setUser(userInfo);
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            return userInfo;
        } catch (error) {
            throw error.response?.data?.message || 'Token verification failed';
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, loginWithToken, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
