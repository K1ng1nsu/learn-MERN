import React, { useContext } from 'react';

import './NavLinks.css';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import Button from '../FormElements/Button';

type Props = {};

const NavLinks = (props: Props) => {
    const auth = useContext(AuthContext);

    return (
        <ul className="nav-links">
            <li>
                <NavLink to="/">ALL USERS</NavLink>
            </li>
            {auth.isLoggedIn && (
                <li>
                    <NavLink to={`${auth.userId}/places`}>MY PLACES</NavLink>
                </li>
            )}
            {auth.isLoggedIn && (
                <li>
                    <NavLink to="/place/new">ADD PLACE</NavLink>
                </li>
            )}
            {!auth.isLoggedIn && (
                <li>
                    <NavLink to="/auth">AUTHRENTICATE</NavLink>
                </li>
            )}
            {auth.isLoggedIn && (
                <li>
                    <button onClick={auth.logout}>LOG OUT</button>
                </li>
            )}
        </ul>
    );
};

export default NavLinks;
