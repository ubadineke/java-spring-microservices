import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from 'react';
import { authApi } from '../api/auth';
import type { AuthUser, LoginRequest } from '../types';

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On mount: check for existing token and validate it
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('user_email');

            if (token && email) {
                const isValid = await authApi.validateToken();
                if (isValid) {
                    setUser({ email, token });
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user_email');
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = useCallback(async (credentials: LoginRequest) => {
        const response = await authApi.login(credentials);
        const { token } = response;

        localStorage.setItem('token', token);
        localStorage.setItem('user_email', credentials.email);
        setUser({ email: credentials.email, token });
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_email');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
