import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { AuthTokens, User, LoginCredentials, RegisterData } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    updateUser: (user: User | null) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const userData = await api.get<User>('users/me/');
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    api.clearTokens();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const tokens = await api.post<AuthTokens>('login/', credentials);
            api.setTokens(tokens);

            // Fetch user profile after login
            const userData = await api.get<User>('users/me/');
            setUser(userData);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (data: RegisterData) => {
        try {
            await api.post('register/', data);
            // Automatically login after register? Or redirect to login?
            // For now, let's just register. The user can then login.
            // Or we can auto-login if the API returns tokens (it usually doesn't for register).
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const updateUser = (userData: User | null) => {
        setUser(userData);
    };

    const logout = () => {
        api.clearTokens();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            updateUser,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
