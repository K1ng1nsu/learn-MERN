import { createContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    userId: '',
    login: (uid: string, token: string) => {},
    logout: () => {},
    token: '',
});
