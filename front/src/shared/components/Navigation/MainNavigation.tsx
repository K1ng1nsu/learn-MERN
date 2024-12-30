import React, { ReactNode, useState } from 'react';

import './MainNavigation.css';
import MainHeader from './MainHeader';
import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/Backdrop';

type Props = {};

const MainNavigation = (props: Props) => {
    const [drawerIsOpen, setDrawerIdOpen] = useState(false);

    return (
        <>
            {drawerIsOpen && <Backdrop onClick={() => setDrawerIdOpen(false)} />}
            <SideDrawer onClick={() => setDrawerIdOpen(false)} show={drawerIsOpen}>
                <nav className="main-navigation__drawer-nav">
                    <NavLinks />
                </nav>
            </SideDrawer>
            <MainHeader>
                <button
                    className="main-navigation__menu-btn"
                    onClick={() => {
                        setDrawerIdOpen(true);
                    }}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <h1 className="main-navigation__title">
                    <Link to="/">YourPlaces</Link>
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks />
                </nav>
            </MainHeader>
        </>
    );
};

export default MainNavigation;
