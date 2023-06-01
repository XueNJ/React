// LoginModal.js
import React, { useState, useContext } from 'react';
import axios from "axios";
import useModal from './ModalCard';
import { Modal, Button, Tab, Nav, Col, Row, Form } from 'react-bootstrap';
import { AuthContext } from './AuthContext';
import useWebState from './WebState';

const ModalLogin = () => {
    const url = 'http://localhost:8088';
    const { showModal, setShowModal, handleShowModal, handleCloseModal } = useModal();
    const [validated, setValidated] = useState(false);
    const { setIsLoginState } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const { webState } = useWebState();

    // Submit 登入
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            await UserLogin(form);
        }
        setValidated(true); // 判別不允許空值
    };
    // Submit 註冊
    const handleSubmitRegister = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            await UserRegister(form);
        }
        setValidated(true); // 判別不允許空值
    };
    // 登入
    const UserLogin = async (form) => {
        const apiUrl = url + '/training/FrontendController/login';
        const design = '../Data/Layout/login.json';
        const objform = {
            id: form.elements.LUserID.value,
            pwd: form.elements.LUserPassword.value
        };
        const response = await axios.post((webState ? apiUrl : design), objform, { withCredentials: true }, { timeout: 3000 }).then(rs => rs.data).catch(error => { console.log(error); });
        if (response.outputResultMessage.result === "S") { // S : 成功登入
            setIsLoginState(true); // 設定為已登入
            setShowModal(false); // 隱藏Modal
        }
        setMessage("(" + response.outputResultMessage.message + ")");
    };
    // 註冊
    const UserRegister = async (form) => {
        const apiUrl = url + '/training/FrontendController/memberModify';
        const design = '../Data/Layout/login.json';
        const objform = {
            id: form.elements.id.value,
            name: form.elements.name.value,
            pwd: form.elements.pwd.value,
            pwdCheck: form.elements.pwdCheck.value,
            action: 'Add',
            status: '1'
        };
        const formData = new FormData();
        Object.keys(objform).map((key) => {
            let value = objform[key];
            formData.append(key, value);
            return formData;
        });
        const response = await axios.post((webState ? design : apiUrl), formData, { withCredentials: true }, { timeout: 3000 }).then(rs => rs.data).catch(error => { console.log(error); });
        console.log(response.outputResultMessage.message);
        if (response.outputResultMessage.result === "S") { // S : 成功註冊
            // setShowModal(false); // 隱藏Modal
            form.elements.id.value = '';
            form.elements.name.value = '';
            form.elements.pwd.value = '';
            form.elements.pwdCheck.value = '';
            setValidated(false); // 判別不允許空值
        }
        // console.log(response.outputResultMessage.message);
        setMessage("(" + response.outputResultMessage.message + ")");
    };

    return (
        <>
            <span>
                <Button variant="warning" onClick={handleShowModal}>登入 / 註冊</Button>
            </span>
            <Modal show={showModal} onHide={handleCloseModal} animation={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>登入/註冊 視窗<span style={{ fontSize: '0.9rem', color: 'red' }}>{message}</span></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                        <Row>
                            <Col sm={3}>
                                <Nav variant="pills" className="flex-column" style={{ textAlign: 'center' }}>
                                    <Nav.Item>
                                        <Nav.Link eventKey="first" onClick={() => (setValidated(false))} >登入</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="second" onClick={() => (setValidated(false))} >註冊</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={9}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="first">
                                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} md="12" controlId="LUserID">
                                                    <Form.Label>帳號 :</Form.Label>
                                                    <Form.Control required type="text" placeholder="請輸入帳號..." defaultValue="" />
                                                    <Form.Control.Feedback>Goods!</Form.Control.Feedback>
                                                    <Form.Control.Feedback type="invalid">不可為空白!</Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} md="12" controlId="LUserPassword">
                                                    <Form.Label>密碼 :</Form.Label>
                                                    <Form.Control required type="password" placeholder="請輸入密碼..." defaultValue="" />
                                                    <Form.Control.Feedback>Goods!</Form.Control.Feedback>
                                                    <Form.Control.Feedback type="invalid">不可為空白!</Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>
                                            <Button className='right-aligned-button' type="submit">確認</Button>
                                        </Form>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second">
                                        <Form noValidate validated={validated} onSubmit={handleSubmitRegister}>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} md="12" controlId="id">
                                                    <Form.Label>帳號 :</Form.Label>
                                                    <Form.Control required type="text" placeholder="請輸入帳號..." defaultValue="" />
                                                    <Form.Control.Feedback>Goods!</Form.Control.Feedback>
                                                    <Form.Control.Feedback type="invalid">不可為空白!</Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} md="12" controlId="name">
                                                    <Form.Label>姓名 :</Form.Label>
                                                    <Form.Control required type="text" placeholder="請輸入姓名..." defaultValue="" />
                                                    <Form.Control.Feedback>Goods!</Form.Control.Feedback>
                                                    <Form.Control.Feedback type="invalid">不可為空白!</Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} md="12" controlId="pwd">
                                                    <Form.Label>密碼 :</Form.Label>
                                                    <Form.Control required type="password" placeholder="請輸入密碼..." defaultValue="" />
                                                    <Form.Control.Feedback>Goods!</Form.Control.Feedback>
                                                    <Form.Control.Feedback type="invalid">不可為空白!</Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} md="12" controlId="pwdCheck">
                                                    <Form.Label>密碼確認 :</Form.Label>
                                                    <Form.Control required type="password" placeholder="請再輸入密碼..." defaultValue="" />
                                                    <Form.Control.Feedback>Goods!</Form.Control.Feedback>
                                                    <Form.Control.Feedback type="invalid">不可為空白!</Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>
                                            <Button className='right-aligned-button' type="submit">確認</Button>
                                        </Form>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                    {/* 其他表單或內容 */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>取消</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalLogin;
