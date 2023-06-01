import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';

const PaymentDetail = () => {
    // 參數
    const navigate = useNavigate();
    const [tableList] = useState(['項次', '商品名稱', '商品圖片', '商品金額', '購買數量']); // table 標頭 列表
    const location = useLocation();
    const state = location.state;

    return (
        // 頁面開始
        <div className='container'>
            <div className="d-flex justify-content-between align-items-center">
                <h2>訂單交易明細頁面</h2>
                <Button variant="primary" className="ml-auto" onClick={() => navigate('/')}>繼續購物</Button>
            </div>
            <hr className='hr-primary' />
            {
                state !== null ? (
                    <>
                        <div>
                            <p>交易狀況: {state.outputResultMessage.message}</p>
                            <p>姓名: {state.name}</p>
                            <p>電話: {state.phone}</p>
                            <p>地址: {state.address}</p>
                            <p>實付金額: {state.inputPay}</p>
                            <p>找零金額: {(state.inputPay - state.outputShoppingCartGoodsInfo.totalAmount)}</p>
                        </div>
                        <div>
                            {
                                <Table className='text-center' striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            {
                                                tableList.map((item, index) => (
                                                    <th key={index}>{item}</th>
                                                ))
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            state.outputShoppingCartGoodsInfo.shoppingCartGoods.length === 0 ? (
                                                <tr>
                                                    <td colSpan={tableList.length}>未有商品加入購物車!</td>
                                                </tr>
                                            ) : (
                                                state.outputShoppingCartGoodsInfo.shoppingCartGoods.map((shoppingCartGoods, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{shoppingCartGoods.goodsName}</td>
                                                        <td><div className='tr-imgs-size'><img className='tr-imgs-goods' src={'/DrinksImage/' + shoppingCartGoods.goodsImageName} alt='' /></div></td>
                                                        <td>{shoppingCartGoods.goodsPrice}</td>
                                                        <td>{shoppingCartGoods.buyQuantity === 0 ? "已賣完" : shoppingCartGoods.buyQuantity}</td>
                                                    </tr>
                                                ))
                                            )
                                        }
                                    </tbody>
                                </Table>
                            }
                        </div>
                    </>
                ) : (<div>暫無商品結帳.....</div>)
            }
        </div>
        // 頁面結束
    );
}

export default PaymentDetail;
