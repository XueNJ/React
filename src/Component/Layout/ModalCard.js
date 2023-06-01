import { useState } from 'react';

const useModal = () => {
    const [showModal, setShowModal] = useState(false); // 提示視窗顯示 false 關閉 &　true 開啟

    // 開啟 modal
    const handleShowModal = (event) => {
        event.preventDefault();
        setShowModal(true);
    };
    // 關閉 modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return {
        showModal,
        setShowModal,
        handleShowModal,
        handleCloseModal
    };
};

export default useModal;
