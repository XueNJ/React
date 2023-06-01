import React, { useState, useEffect, useCallback, useRef } from 'react'
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { Form, Col, Row, Alert, Table, Card, Button } from 'react-bootstrap';
import usePageAction from '../Layout/PageAction';
import ButtonBuyCheck from '../Layout/ButtonBuyCheck';
import useWebState from '../Layout/WebState';

const Payment = () => {
    const url = 'http://localhost:8088';
    const formDetailRef = useRef(null); // 明細 form
    const navigate = useNavigate();
    // 頁面控制
    const { handlePageAction, setPageAction, pageAction, setPrePageAction } = usePageAction();
    // 參數宣告
    const mainPage = 1;
    const showPage = 10;
    const [prevMainPage, setPrevMainPage] = useState(0); // 前一次指定頁數
    const [prevShowPage, setPrevShowPage] = useState(0); // 前一次顯示頁數
    const [data, setData] = useState([]); // 列表資料
    const [tableList] = useState(['項次', '商品名稱', '商品圖片', '商品金額', '購買數量']); // table 標頭 列表
    const [pageCount, setPageCount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [validated, setValidated] = useState(false);
    const [message, setMessage] = useState('');
    const { webState } = useWebState();

    // 參數宣告 明細
    const [formParamDetail, setFormParamDetail] = useState({
        name: '', phone: '', address: '', inputPay: 0
    });
    // 明細 
    const getDetail = useCallback(async () => {
        const apiUrl = url + '/training/FrontendController/loginCheck';
        const design = '../Data/Frontend/Payment/loginCheck.json';
        const response = await axios.get((webState ? design : apiUrl)).then(rs => rs.data).catch(error => { console.log(error); });
        if (response.totalCount !== 0) {
            // text input
            setFormParamDetail(p => ({ ...p, name: response.outputMember.name }));
            // last Page Action
            setPageAction('Detail');
            setPrePageAction('List');
        }
    }, [setPageAction, setPrePageAction, webState]);
    // 列表 
    const getList = useCallback(async () => {
        const apiUrl = url + '/training/FrontendController/queryCartGoods';
        const design = '../Data/Frontend/Payment/queryCartGoods.json';
        const response = await axios.get((webState ? design : apiUrl), { withCredentials: true }, { timeout: 3000 }).then(rs => rs.data).catch(error => { console.log(error); });
        setData(response.shoppingCartGoods);
        setTotalAmount(response.totalAmount);
        getDetail();
    }, [getDetail, webState]);
    // 新增訂單 
    const save = async () => {
        const apiUrl = url + '/training/FrontendController/paymentGoods';
        const design = './Data/Frontend/Payment/paymentGoods.json';
        const formData = new FormData();
        formData.append('inputPay', formParamDetail.inputPay);
        const response = await axios.get((webState ? design : apiUrl), formData, { withCredentials: true }, { timeout: 3000 }).then(rs => rs.data).catch(error => { console.log(error); });
        if (response.outputResultMessage.result === 'S') {
            navigate('/PaymentDetail', { state: { ...formParamDetail, ...response } }); // 跳頁
        } else {
            handlSubmiteGetList();
            getList();
        }
        setMessage(response.outputResultMessage.message);
    }
    // Submit查詢 按鈕動作
    const handlSubmiteGetList = useCallback(async () => {
        await getList();
        setPageAction('List');
        setPrePageAction('List');
    }, [getList, setPageAction, setPrePageAction]);

    // submit 按鈕(BuyCheck)動作
    const handlSubmiteSave = (result) => {
        const value = handleCheckValue(); // 檢核空白
        if (result && value) {
            console.log('進入存檔流程中...');
            save();
        }
    };

    // 清空購物
    const clearShoppingCartGoods = async (event) => {
        event.preventDefault();
        const apiUrl = url + '/training/FrontendController/clearCartGoods';
        const design = './Data/Frontend/Payment/clearCartGoods.json';
        await axios.get((webState ? design : apiUrl)).then(rs => rs.data).catch(error => { console.log(error); });
        setData([]);
        setTotalAmount(0);
        // getList();
    }

    // 檢核明細空白欄位
    const handleCheckValue = () => {
        let result = false;
        const form = formDetailRef.current;
        result = !(form.checkValidity() === false); // 欄位檢核
        if (!result) { setValidated(true) }; // 空值，欄位紅框設定
        return result;
    };

    // onchange & DB input set
    const onChangeDateFieldDetailTxt = (e, txtID) => { setFormParamDetail(p => ({ ...p, [txtID]: e.target.value })) }; // Detail txt
    const onChangeDateFieldDetailTxtNum = (e, txtID) => {
        const value = e.target.value;
        if (!(!/^-?\d*$/.test(value) || value.includes('-'))) {
            setFormParamDetail((prevState) => ({
                ...prevState,
                [txtID]: value
            }));
        }
    };

    // 異動頁數
    useEffect(() => {
        if (prevMainPage !== mainPage || prevShowPage !== showPage) {
            setPrevMainPage(mainPage);
            setPrevShowPage(showPage);
            setPageAction('List');
            setPrePageAction('');
        }
    }, [prevMainPage, mainPage, getList, prevShowPage, showPage, setPageAction, setPrePageAction]);
    // 異動頁面動作
    useEffect(() => {
        // 起始畫面設定
        if (pageCount === 0 & pageAction === 'List') {
            handlSubmiteGetList();
            setPageAction(''); // 頁面動作
            handlePageAction(); // 執行頁面動作
            setPageCount(1); // 塞值避免迴圈
        }
        // 後續頁面動作
        if (pageAction !== '' & pageCount !== 0) {
            setPageAction(''); // 頁面動作
            handlePageAction(); // 執行頁面動作
        }
    }, [setPageAction, handlePageAction, pageAction, pageCount, getList, handlSubmiteGetList]);
    return (
        // 頁面開始
        <div className='container'>
            {/* 路徑導覽開始 */}
            <div>
                <Alert variant='info'>
                    <nav>
                        <ul className="breadcrumb-container breadcrumb-container alert-margin-top">
                            <li>
                                <Link to="/">首頁</Link>
                            </li>
                            <li>
                                <span>前台管理</span>
                            </li>
                            <li>
                                <Link to="/Order">會員結帳頁面</Link>
                            </li>
                        </ul>
                    </nav>
                </Alert>
            </div>
            {/* 路徑導覽結束 */}
            {/* 網頁名稱開始 */}
            <h2>訂單確認頁面</h2>
            {/* 網頁名稱結束 */}
            <hr className='hr-primary' />
            {/* 列表開始 */}
            <div>
                <div className='float-right'>
                    <span><Button variant="primary" onClick={() => navigate('/')}>{'繼續購物'}</Button>{' '}</span>
                    <span>
                        <Button variant="danger" onClick={clearShoppingCartGoods}>購物車清空</Button>
                        {/* {totalAmount !== 0 && (
                            <Button variant="danger" onClick={clearShoppingCartGoods}>
                                購物車清空
                            </Button>
                        )} */}
                    </span>
                </div>
            </div>
            <br />
            <br />
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
                                data.length === 0 ? (
                                    <tr>
                                        <td colSpan={tableList.length}>未有商品加入購物車!</td>
                                    </tr>
                                ) : (
                                    data.map((shoppingCartGoods, index) => (
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
                <div className='text-right'>{'總金額 : '}{totalAmount}{'元'}</div>
            </div>
            {/* 列表結束 */}
            <br />
            <br />
            {/* 明細開始 */}
            {
                data.length === 0 ? ("") :
                    (
                        <div>
                            <div className='form-control'>
                                <div className='row col-12'>
                                    <Form noValidate validated={validated} ref={formDetailRef} onSubmit={handlSubmiteSave}>
                                        <br />
                                        <Card>
                                            <Card.Header>{'付款人基本資訊 : '}<span style={{ fontSize: '0.8rem', color: 'red' }}>{message}</span></Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Form.Group as={Col} md="3" controlId="inputPay">
                                                        <Form.Label>付款金額</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={formParamDetail.inputPay}
                                                            onChange={(e) => onChangeDateFieldDetailTxtNum(e, 'inputPay')}
                                                            autoComplete='off' // 關閉歷史紀錄
                                                            required
                                                        />
                                                        <Form.Control.Feedback type="invalid">付款金額不可為空白!</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Row>
                                                <Row className='mb-3'>
                                                    <Form.Group as={Col} md="6" controlId="name">
                                                        <Form.Label>購買人姓名:</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={formParamDetail.name}
                                                            onChange={(e) => onChangeDateFieldDetailTxt(e, 'name')}
                                                            autoComplete='off' // 關閉歷史紀錄
                                                            required
                                                        />
                                                        <Form.Control.Feedback type="invalid">購買人姓名不可為空白!</Form.Control.Feedback>
                                                    </Form.Group>
                                                    <Form.Group as={Col} md="6" controlId="phone">
                                                        <Form.Label>聯絡電話</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={formParamDetail.phone}
                                                            onChange={(e) => onChangeDateFieldDetailTxtNum(e, 'phone')}
                                                            autoComplete='off' // 關閉歷史紀錄
                                                            required
                                                        />
                                                        <Form.Control.Feedback type="invalid">連絡電話不可為空白!</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Row>
                                                <Row>
                                                    <Form.Group as={Col} md="12" controlId="address">
                                                        <Form.Label>地址</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={formParamDetail.address}
                                                            onChange={(e) => onChangeDateFieldDetailTxt(e, 'address')}
                                                            autoComplete='off' // 關閉歷史紀錄
                                                            required
                                                        />
                                                        <Form.Control.Feedback type="invalid">地址不可為空白!</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                        <br />
                                        <div className='float-right'>
                                            <span><ButtonBuyCheck onConfirm={handlSubmiteSave} />{' '}</span>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    )
            }
            {/* 明細結束 */}
        </div >
        // 頁面結束
    )
}

export default Payment
