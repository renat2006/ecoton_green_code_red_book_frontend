import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user data exists in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            console.log('User found in localStorage:', storedUser); // Debug: Check if user is found in localStorage
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData, token) => {
        // Save user data to state and localStorage
        console.log('Logging in user:', userData); // Debug: Check user data during login
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };

    const logout = () => {
        // Clear user data from state and localStorage
        console.log('Logging out'); // Debug: Check logout action
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
