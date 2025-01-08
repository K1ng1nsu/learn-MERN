import { useCallback, useEffect, useRef, useState } from 'react';
import { isErrorWithMessage } from '../util/utils';
import { ENV } from '../util/config';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const activeHttpRequests = useRef<AbortController[]>([]);

    const sendRequest = useCallback(async (url: string, method = 'GET', body?: string | FormData, headers = {}) => {
        setIsLoading(true);
        const httpAbortController = new AbortController();
        activeHttpRequests.current.push(httpAbortController);
        try {
            const response = await fetch(`${ENV.BACK_END_URL}${url}`, {
                method,
                body,
                headers,
                signal: httpAbortController.signal,
            });

            const responseData = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(
                (reqCtrl) => reqCtrl !== httpAbortController
            );

            if (!response.ok) {
                throw new Error(responseData.message);
            }
            setIsLoading(false);
            return responseData;
        } catch (err) {
            console.log(err);

            setIsLoading(false);
            if (isErrorWithMessage(err)) {
                setError(err.message);
            } else {
                setError('Something went wrong');
            }
            throw err;
        }
    }, []);

    const clearError = () => {
        setError('');
    };

    useEffect(() => {
        return () => {
            console.log('Active Requests:', activeHttpRequests.current.length);
            activeHttpRequests.current.forEach((abortController) => {
                console.log('AbortController Status:', abortController.signal.aborted);
                if (!abortController.signal.aborted) {
                    abortController.abort();
                }
            });
        };
    }, []);

    return { isLoading, error, clearError, sendRequest };
};
