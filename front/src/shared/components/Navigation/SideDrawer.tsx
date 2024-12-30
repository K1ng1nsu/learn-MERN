import React, { ReactNode, ReactPortal } from 'react';
import ReactDOM from 'react-dom';
import './SideDrawer.css';
import { CSSTransition } from 'react-transition-group';

type Props = {
    children: ReactNode;
    show: boolean;
    onClick: () => void;
};

const SideDrawer = (props: Props) => {
    const content = (
        <CSSTransition in={props.show} timeout={200} classNames="slide-in-left" mountOnEnter unmountOnExit>
            <aside onClick={props.onClick} className="side-drawer">
                {props.children}
            </aside>
        </CSSTransition>
    );

    return ReactDOM.createPortal(content, document.getElementById('drawer-hook')!);
};

export default SideDrawer;
