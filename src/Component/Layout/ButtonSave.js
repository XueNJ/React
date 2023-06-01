import React from 'react';
import useModal from './ModalCard';
import { Modal, Button } from 'react-bootstrap';

const ButtonSave = ({ onConfirm }) => {
    const { showModal, handleShowModal, handleCloseModal } = useModal();

    // handleSaveClick event:事件、result: true & false
    const handleSaveClick = (event) => {
        event.preventDefault();
        onConfirm(event); // 回傳下方按鈕 handleSaveClick 結果 確認:true \ 取消:false
        handleCloseModal(event);
    };

    return (
        <>
            <>
                <Button variant="secondary" type="submit" onClick={handleShowModal}>存檔</Button>{' '}
            </>
            <>
                <Modal show={showModal} onHide={handleCloseModal} animation={false} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>提示確認:</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>確認存檔該筆資料?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={(event) => handleSaveClick(event, true)}>確認 </Button>{' '}
                        <Button variant="secondary" onClick={(event) => handleSaveClick(event, false)}>取消</Button>{' '}
                    </Modal.Footer>
                </Modal>
            </>
        </>
    );
};

export default ButtonSave;