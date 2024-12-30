import React from 'react';

import UsersList from '../components/UserList';
import { UserType } from '../UserType';

type Props = {};

const Users = (props: Props) => {
    const USERS: Array<UserType> = [
        {
            id: 'u1',
            name: 'insu',
            image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT4is8rP6vgN2j1gBkrHpjZepJvJisJcdS9c5qjIzkeMZusSlpdY0xIEplzTvQZtJQksvL5ljEvnrXDD1Hk_dTgSM4xis4RiDWx6H5Baz8',
            places: 3,
        },
    ];

    return <UsersList items={USERS} />;
};

export default Users;
