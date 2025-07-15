import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            api.setAuth(sessionId);
            api.get('/auth/me')
                .then(({ user }) => setUser(user))
                .catch(() => localStorage.removeItem('sessionId'))
                .finally(() => setLoading(false));
        }
        else {
            setLoading(false);
        }
    }, []);
    const login = (sessionId) => {
        localStorage.setItem('sessionId', sessionId);
        api.setAuth(sessionId);
        api.get('/auth/me').then(({ user }) => setUser(user));
    };
    const logout = () => {
        api.post('/auth/logout').finally(() => {
            localStorage.removeItem('sessionId');
            api.setAuth(null);
            setUser(null);
        });
    };
    return (_jsx(AuthContext.Provider, { value: { user, loading, login, logout }, children: children }));
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
