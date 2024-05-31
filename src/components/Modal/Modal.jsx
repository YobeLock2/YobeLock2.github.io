import React from 'react';
import "./modal.css"

const Modal = ({active, setActive, children}) => {
    return (
        <div className={active ? "modal active" : "modal"} onClick={() => setActive(false)}>
            <div className={active ? "modal_content active" : "modal_content"} onClick={eaa => eaa.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export default Modal;