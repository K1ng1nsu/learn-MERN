import { useCallback, useEffect, useState } from 'react';
let logoutTimer: number;

const useAuth = () => {
    const [userId, setUserId] = useState('');
    const [token, setToken] = useState('');
    const [tokenExpiration, setTokenExpiration] = useState<Date>();

    const login = useCallback((uid: string, token: string, expirationDate?: Date) => {
        setUserId(uid);
        setToken(token);
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 59);
        setTokenExpiration(tokenExpirationDate);
        localStorage.setItem(
            'userData',
            JSON.stringify({ userId: uid, token, expiration: tokenExpirationDate.toISOString() })
        );
    }, []);
    const logout = useCallback(() => {
        setUserId('');
        setTokenExpiration(undefined);
        localStorage.clear();
        setToken('');
    }, []);

    useEffect(() => {
        if (token && tokenExpiration) {
            const remainingTime = tokenExpiration.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpiration]);

    useEffect(() => {
        if (localStorage.getItem('userData')) {
            const storedData = JSON.parse(localStorage.getItem('userData')!);
            if (storedData.token && new Date(storedData.expiration) > new Date()) {
                login(storedData.userId, storedData.token, new Date(storedData.expiration));
            }
        }
    }, [login]);

    return { login, logout, token, userId };
};

export default useAuth;
