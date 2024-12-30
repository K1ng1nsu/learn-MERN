import React, { CSSProperties, ReactNode, Ref, useRef } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';
import Backdrop from './Backdrop';
import { CSSTransition } from 'react-transition-group';

type Props = {
    show?: boolean;
    onCancel: () => void;
    className?: string;
    style?: CSSProperties;
    headerClass?: string;
    header?: string;
    onSubmit?: () => void;
    contentClass?: string;
    children?: ReactNode;
    footerClass?: string;
    footer?: ReactNode;
};

type Props2 = {
    className?: string;
    style?: CSSProperties;
    headerClass?: string;
    header?: string;
    onSubmit?: () => void;
    contentClass?: string;
    children?: ReactNode;
    footerClass?: string;
    footer?: ReactNode;
};
const ModalOverlay = React.forwardRef<HTMLDivElement, Props2>((props, ref) => {
    const content = (
        <div ref={ref} className={`modal ${props.className}`} style={props.style}>
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <form onSubmit={props.onSubmit ? props.onSubmit : (event) => event.preventDefault()}>
                <div className={`modal__content ${props.contentClass}`}>{props.children}</div>
                <footer className={`modal__footer ${props.footerClass}`}>{props.footer}</footer>
            </form>
        </div>
    );

    return ReactDOM.createPortal(content, document.getElementById('modal-hook')!);
});

const Modal = (props: Props) => {
    const nodeRef = useRef<HTMLDivElement>(null); // nodeRef 생성

    return (
        <>
            {props.show && <Backdrop onClick={props.onCancel} />}
            <CSSTransition
                in={props.show}
                mountOnEnter
                unmountOnExit
                timeout={200}
                classNames="modal"
                nodeRef={nodeRef}
            >
                <ModalOverlay {...props} ref={nodeRef} />
            </CSSTransition>
        </>
    );
};

export default Modal;
