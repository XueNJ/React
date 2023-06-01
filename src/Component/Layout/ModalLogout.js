import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import useModal from './ModalCard';
import { Modal, Button } from 'react-bootstrap';
import { AuthContext } from './AuthContext';
import useWebState from './WebState';

const url = 'http://localhost:8088';

const ModalLogout = () => {
    // 參數
    const navigate = useNavigate(); // 跳頁
    const { showModal, handleShowModal, handleCloseModal } = useModal(); // Modal
    const { setIsLoginState } = useContext(AuthContext); // 檢核登入者狀態
    const { webState } = useWebState();
    // submit Logout
    const handleLogout = async (event) => {
        event.preventDefault();
        Logout(event);
        handleCloseModal(); // 關閉 提醒視窗
        navigate('/'); // 導頁 回首頁
    };
    // Logout
    const Logout = async (event) => {
        event.preventDefault();
        const apiUrl = url + '/training/FrontendController/logout';
        const design = '../Data/Layout/logout.json';
        const response = await axios.get((webState ? design : apiUrl)).then(rs => rs.data).catch(error => { console.log(error); });

        if (response.outputResultMessage.result === "S") {
            console.log('登出成功');
            setIsLoginState(false);
        } else {
            console.log('登出失敗');
        }
    }

    return (
        <>
            {/* backdrop="禁用modal以外區域onclick，達無法關閉modal效果！" keyboard={禁用鍵盤ESC鍵，達到無法關閉modal效果} */}
            <Button variant="light" onClick={handleShowModal}>{' 登出 '}</Button>
            <Modal show={showModal} onHide={handleCloseModal} animation={showModal} backdrop="static" keyboard={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>頁面提醒:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {'確認登出?'}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleLogout}>確認</Button>
                    <Button variant="light" onClick={handleCloseModal}>取消</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalLogout;
