import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const userStr = localStorage.getItem('user');
            const userData = userStr ? JSON.parse(userStr) : null;
            setUser(userData);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const response = await api.post('/accounts/login/', { username, password });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setUser(response.data.user);
        }
        return response.data;
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    const register = async (userData) => {
        const response = await api.post('/accounts/register/', userData);
        return response.data;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);