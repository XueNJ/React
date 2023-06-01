import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import useModal from './ModalCard';
import { Modal, Button, Table, Badge } from 'react-bootstrap';
import { Cart4, Trash3, CreditCard2BackFill, DoorClosedFill } from 'react-bootstrap-icons';
import useShoppingCartGoodsSearch from './ShoppingCartGoodsSearch';
import useWebState from './WebState';

const ModalShoppingCartGoods = () => {
    // 參數
    const navigate = useNavigate(); // 導頁宣告
    const url = 'http://localhost:8088'; // Server 
    const title = ['項次', '商品名稱', '商品金額', '購買數量']; // 購物車 列表標頭
    const { showModal, handleShowModal, handleCloseModal } = useModal(); // modal控制
    const [preCount] = useState(0);
    const [fnCount, setFnCount] = useState(0);
    const [data, setData] = useState([]);
    const { webState } = useWebState();
    const { getShoppingCartGoodsInfo, buyCount, setBuyCount, shoppingCartGoods, setShoppingCartGoods, totalAmount, setTotalAmount, result, message, setResult, setMessage } = useShoppingCartGoodsSearch(); // modal控制

    // 查詢購物車
    const handleShoppingCartGoods = (event) => {
        event.preventDefault();
        handleShowModal(event);
        setResult('');
        setMessage('');
        setData([]);
        getShoppingCartGoodsInfo();
        console.log(buyCount);
    }

    // 前往結帳
    const handleGoPayment = (event) => {
        navigate('/Payment');
        handleCloseModal(event);
    }

    // 清空購物車
    const clearShoppingCartGoods = async (event) => {
        const apiUrl = url + '/training/FrontendController/clearCartGoods';
        const design = './Data/Layout/clearCartGoods.json';
        const response = await axios.get((webState ? design : apiUrl)).then(rs => rs.data).catch(error => { console.log(error); });
        setResult('');
        setMessage('');
        setShoppingCartGoods([]);
        setTotalAmount(0);
        setBuyCount(0);
        handleShowModal(event);
        setData(response);
    }

    // 異動
    useEffect(() => {
        // 後續載入
        if (buyCount !== preCount && fnCount > 1) {
            getShoppingCartGoodsInfo();
        }
        // 初次載入
        if (buyCount === preCount && fnCount === 0) {
            getShoppingCartGoodsInfo();
            setFnCount(fnCount + 1);
        }
    }, [getShoppingCartGoodsInfo, buyCount, preCount, fnCount, setShoppingCartGoods]);

    return (
        <>
            <>
                <Button variant="light" onClick={handleShoppingCartGoods}>
                    <span><Cart4 /></span>{' 購物車 '}
                    {/* <Badge bg="secondary">{buyCount}</Badge> */}
                    <Badge bg="secondary"></Badge>
                </Button>{' '}
            </>
            <>
                <Modal show={showModal} onHide={handleCloseModal} animation={false} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>購物車查詢 :
                            <span style={{ fontSize: '0.8rem', color: 'red' }}>{result === 'M' ? message : ''}</span>
                            <span style={{ fontSize: '0.5rem', color: 'red' }}>{data.message !== undefined ? (data.message) : ("")}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table className="table text-center">
                            <thead>
                                <tr>
                                    {title.map((item, index) => (
                                        <th key={index} scope="col">{item}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {shoppingCartGoods.length === 0 ? (
                                    <tr>
                                        <td colSpan={title.length}>購物車暫無加入商品</td>
                                    </tr>
                                ) : (
                                    shoppingCartGoods.map((item, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{item.goodsName}</td>
                                            <td>{item.goodsPrice}</td>
                                            <td style={item.note === "1" ? { color: 'red' } : {}}>{item.buyQuantity}</td>
                                        </tr>
                                    ))

                                )}
                            </tbody>
                        </Table>
                        <div className='text-right'>{'總金額 : '}{totalAmount}{'元'}</div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleGoPayment}><CreditCard2BackFill /></Button>{' '}
                        <Button variant="danger" onClick={clearShoppingCartGoods}><Trash3 /></Button>{' '}
                        <Button variant="secondary" onClick={handleCloseModal}><DoorClosedFill /></Button>{' '}
                    </Modal.Footer>
                </Modal>
            </>
        </>
    );
}

export default ModalShoppingCartGoods;
