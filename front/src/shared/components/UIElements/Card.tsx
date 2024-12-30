import React, { ReactNode } from 'react';

import './Card.css';

type Props = {
    className?: string;
    style?: string;
    children: ReactNode;
};

const Card = (props: Props) => {
    return (
        <div
            className={`card ${props.className}`}
            //  style={props.style}
        >
            {props.children}
        </div>
    );
};

export default Card;
