import React, { ReactNode } from 'react';

import './MainHeader.css';

type Props = {
    children: ReactNode;
};

const MainHeader = (props: Props) => {
    return <header className="main-header">{props.children}</header>;
};

export default MainHeader;
