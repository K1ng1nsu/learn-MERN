import React, { useEffect, useState } from 'react';

import UsersList from '../components/UserList';
import { UserType } from '../UserType';
import { ENV } from '../../shared/util/config';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

type Props = {};

const Users = (props: Props) => {
    const { isLoading, error, clearError, sendRequest } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState<UserType[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await sendRequest(`/api/users`);
                setLoadedUsers(responseData.users);
            } catch (err) {
                //
            }
        };
        fetchData();
    }, [sendRequest]);

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            <UsersList items={loadedUsers!} />
        </>
    );
};

export default Users;
