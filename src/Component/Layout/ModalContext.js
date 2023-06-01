import { createContext } from 'react';

const ModalContext = createContext({
    showModal: false,
    handleShowModal: () => { },
    handleCloseModal: () => { }
});

export default ModalContext;
