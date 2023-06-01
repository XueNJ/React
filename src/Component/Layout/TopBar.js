import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from "axios";
import { Container, Form, Nav, Navbar, NavDropdown, Badge, Image } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import ModalLogin from './ModalLogin';
import ModalShoppingCartGoods from './ModalShoppingCartGoods';
import ModalLogout from './ModalLogout';
import useWebState from './WebState';
const TopBar = () => {
    // 參數
    const navigate = useNavigate();
    const url = 'http://localhost:8088'; // Server
    const { isLoginState, setIsLoginState } = useContext(AuthContext);
    const [userName, setUserName] = useState('');
    const location = useLocation();
    const { webState } = useWebState();
    // 登入
    const handleModalLogin = useCallback(() => {
        setIsLoginState(true);
    }, [setIsLoginState]);
    // 登出
    const handleModalLogout = useCallback(() => {
        setIsLoginState(false);
        navigate('/');
    }, [setIsLoginState, navigate]);
    // 檢核人員登入狀況
    const checkLoginState = useCallback(async () => {
        const apiUrl = url + '/training/FrontendController/loginCheck';
        const design = './Data/Layout/loginCheck.json';
        try {
            const response = await axios.get((webState ? design : apiUrl), { withCredentials: true }, { timeout: 3000 });
            if (response.status === 200 && response.data.outputMember !== null) {
                handleModalLogin();
                setUserName('(' + response.data.outputMember.name + '，您好!)');
            } else {
                handleModalLogout();
                setUserName('(訪客)');
                navigate('/'); // 導頁
            }
        } catch (error) {
            if (error.code === 'ERR_NETWORK') {
                // console.log('系統未連線');
            } else {
                console.log(error);
            }
            console.log('系統維護中...');
            navigate('/Maintenance'); // 導頁維護頁面
        }
    }, [handleModalLogin, handleModalLogout, navigate, webState]);
    // 異動
    useEffect(() => {
        checkLoginState();
    }, [isLoginState, checkLoginState]);

    return (
        <>
            <Navbar collapseOnSelect={true} className='navbar-expand-md fixed-top navbar-dark bg-dark ' expand="lg">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">
                        <span>
                            <span><Image src="/logo.gif" className='d-inline-block align-top' width='30' height='30' roundedCircle /></span>
                            <span style={{ fontWeight: 'bold' }}>{' 購物商城  '}</span>
                            <span><Badge bg='light' text='black'>{userName}</Badge></span> {' '}
                        </span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            {isLoginState ? (
                                <>
                                    <Nav.Link as={Link} to="/">首頁</Nav.Link>
                                    <NavDropdown title="會員管理" id="collasible-nav-dropdown">
                                        <NavDropdown.Item as={Link} to="/Payment">購物車&付款</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/HistoryOrder">歷史訂單查詢</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/Customer">基本資料修改</NavDropdown.Item>
                                    </NavDropdown>
                                    <NavDropdown title="後台管理" id="collasible-nav-dropdown">
                                        <NavDropdown.Item as={Link} to="/Product">商品維護</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/Order">訂單報表</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/User">人員管理</NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/">首頁</Nav.Link>
                                </>
                            )}
                        </Nav>
                        <Form className="d-flex">
                            {
                                <span hidden={location.pathname === '/Maintenance'}>
                                    {
                                        isLoginState ? (
                                            <>
                                                <span hidden={location.pathname === '/Payment' || location.pathname === '/PaymentDetail'}><ModalShoppingCartGoods /></span>
                                                <ModalLogout onLogout={handleModalLogout} />{' '}
                                            </>
                                        ) : (
                                            <>
                                                <ModalLogin onLogin={handleModalLogin} />{' '}
                                            </>
                                        )
                                    }
                                </span>
                            }
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default TopBar