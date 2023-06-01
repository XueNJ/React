import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom';
import { Form, Col, Row, Button, Alert, Table, Card } from 'react-bootstrap';
import axios from "axios";
import PaginationContext from '../Layout/PaginationContext';
import Paginations from '../Layout/Paginations';
import usePageAction from '../Layout/PageAction';
import useWebState from '../Layout/WebState';

const Order = () => {

    const Url = 'http://localhost:8088';
    const formRef = useRef(null); // 搜尋 form
    // 頁面控制
    const { handlePageAction, setPageAction, pageAction, setPrePageAction, pageActionName, searchPanel, searchTipPanel, listPanel, detailPanel, textDisabled, btnHiddenBtnSearch } = usePageAction();
    // 參數宣告
    const [totalCount, setTotalCount] = useState(0); // 總筆數
    const [mainPage, setMainPage] = useState(1); // 指定頁數
    const [prevMainPage, setPrevMainPage] = useState(0); // 前一次指定頁數
    const [prevShowPage, setPrevShowPage] = useState(0); // 前一次顯示頁數
    const [showPage, setShowPage] = useState(10); // 每頁顯示頁數
    const [data, setData] = useState([]); // 列表資料
    const [dataDetail, setDataDetail] = useState([]); // 明細列表列表資料
    const [tableList] = useState(['項次', '訂單編號', '客戶名稱', '訂單日期']); // table 標頭 列表
    const [tableDetail] = useState(['項次', '商品名稱', '商品圖片', '商品金額', '商品數量']); // table 標頭 明細
    const [pageCount, setPageCount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const { webState } = useWebState(); // design(true)&api (false)
    // 參數宣告 列表txt
    const [formParamSearch, setFormParamSearch] = useState({
        searchStartDate: '', searchEndDate: ''
    });
    // 參數宣告 明細txt
    const [formParamDetail, setFormParamDetail] = useState({
        orderID: 0, customerID: '', customerName: '', orderDate: ''
    });
    // Submit查詢 按鈕動作
    const handlSubmiteGetList = async (event) => {
        event.preventDefault();
        setMainPage(1);
        await getList();
        setPageAction('List');
        setPrePageAction('List');
    }
    // 列表 
    const getList = useCallback(async () => {
        const apiUrl = Url + '/training/BackendController/queryOrder'; // api
        const design = './Data/Backend/Order/queryOrderList.json'; // 設計檔
        const formData = new FormData();
        Object.keys(formParamSearch).map((key) => {
            const value = formParamSearch[key];
            formData.append(key, value);
            return null;
        });
        formData.append('action', 'List'); // 指定頁數
        formData.append('mainPage', mainPage); // 指定頁數
        formData.append('showPage', showPage); // 顯示頁數
        const response = await axios.get((webState ? design : apiUrl), formData).then(rs => rs.data).catch(error => { console.log(error); });
        setTotalCount(response.totalCount);
        setData(response.orders);
    }, [mainPage, showPage, formParamSearch, webState]);
    // 明細 
    const getDetail = async (params) => {
        const apiUrl = Url + '/training/BackendController/queryOrder';
        const design = './Data/Backend/Order/queryOrderDetail.json';
        const formData = new FormData();
        Object.keys(formParamSearch).map((key) => {
            formData.append(key, '');
            return null;
        });
        formData.append('action', 'Detail'); // 指定頁數
        formData.append('searchOrderID', params); // 商品編號
        formData.append('mainPage', 0); // 指定頁數
        formData.append('showPage', 1); // 顯示頁數
        const response = await axios.get((webState ? design : apiUrl), formData).then(rs => rs.data).catch(error => { console.log(error); });
        if (response.totalCount !== 0) {
            setFormParamDetail(p => ({ ...p, orderID: response.orders[0].orderID }));
            setFormParamDetail(p => ({ ...p, customerName: response.orders[0].customerName }));
            const strDate = formatDate(response.orders[0].orderDate);
            setFormParamDetail(p => ({ ...p, orderDate: strDate }));
            const orderDetailElements = response.orders[0].orderDetails.map((orderDetail, index) => (
                <tr className="centered-tr" key={index}>
                    <td>{index + 1}</td>
                    <td>{orderDetail.goodsName}</td>
                    <td><div className='tr-imgs-size'><img className='tr-imgs-goods' src={orderDetail.imagePath.replace('//', '/')} alt='' /></div></td>
                    <td>{orderDetail.goodsBuyPrice}</td>
                    <td>{orderDetail.buyQuantity}</td>
                </tr>
            ));
            setDataDetail(orderDetailElements);
            setTotalAmount(response.orders[0].totalAmount);
            setPageAction('Detail');
            setPrePageAction('List');
        }
    };
    // 字串 spring boot localdatetime => date(yyyy-MM-dd) => String 
    const formatDate = (value) => {
        const date = new Date(value);
        // 获取年、月、日
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        // 格式化日期
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate.toString();
    }
    // 初始化欄位(搜尋)
    const defaultInputSearch = () => {
        setFormParamSearch(p => ({ ...p, searchStartDate: '' })); // 訂單日期(起)
        setFormParamSearch(p => ({ ...p, searchEndDate: '' })); // 商品名稱(迄)
    }
    // onchange & DB input set
    const onChangeSearchStartDate = (e) => { setFormParamSearch(p => ({ ...p, searchStartDate: e.target.value })) }; // (搜尋)日期起
    const onChangeSearchEndDate = (e) => { setFormParamSearch(p => ({ ...p, searchEndDate: e.target.value })) }; // (搜尋)日期迄
    const onChangeOrderDate = (e) => { setFormParamDetail(p => ({ ...p, orderDate: e.target.value })) }; // (明細)訂單日期
    const onChangeDateFieldDetailTxt = (e, txtID) => { setFormParamDetail(p => ({ ...p, [txtID]: e.target.value })) }; // Detail txt

    // 預載、異動頁數(監視異動...)
    useEffect(() => {
        if (prevMainPage !== mainPage || prevShowPage !== showPage) {
            getList();
            setPrevMainPage(mainPage);
            setPrevShowPage(showPage);
            setPageAction('List');
            setPrePageAction('');
        }
        // 起始畫面設定
        if (pageCount === 0) {
            setPageAction(''); // 頁面動作
            handlePageAction(); // 執行頁面動作
            defaultInputSearch(); //
            setPageCount(1); // 塞值避免迴圈
        }
        // 後續頁面動作
        if (pageAction !== '' & pageCount !== 0) {
            setPageAction(''); // 頁面動作
            handlePageAction(); // 執行頁面動作
        }
    }, [prevMainPage, mainPage, getList, prevShowPage, showPage, setPageAction, setPrePageAction, handlePageAction, pageAction, pageCount]);

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
                                <span>後台管理</span>
                            </li>
                            <li>
                                <Link to="/Order">訂單查詢</Link>
                            </li>
                        </ul>
                    </nav>
                </Alert>
            </div>
            {/* 路徑導覽結束 */}
            {/* 網頁名稱開始 */}
            <h2>訂單查詢頁面</h2>
            {/* 網頁名稱結束 */}
            <hr className='hr-primary' />
            <hr />
            {/* 搜尋開始 */}
            <div hidden={searchPanel}>
                <Form onSubmit={handlSubmiteGetList} ref={formRef}>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="3" controlId="searchStartDate">
                            <Form.Label>訂單日期(起) : </Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="請輸入訂單日期(起)..."
                                value={formParamSearch.searchStartDate}
                                onChange={onChangeSearchStartDate}
                                autoComplete='off' // 關閉歷史紀錄
                            />
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="searchEndDate">
                            <Form.Label>訂單日期(迄) : </Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="請輸入訂單日期(迄)..."
                                value={formParamSearch.searchEndDate}
                                onChange={onChangeSearchEndDate}
                                autoComplete='off' // 關閉歷史紀錄
                            />
                        </Form.Group>
                    </Row>
                    <div className='float-right'>
                        <Button variant="success" type="submit" hidden={btnHiddenBtnSearch}>搜尋</Button> {' '}
                    </div>
                </Form>
                <br />
                <br />
                <hr />
            </div>
            {/* 搜尋結束 */}
            {/* 搜尋提示開始 */}
            <div hidden={searchTipPanel}>
                <Alert key='warning' variant='warning'>
                    {'請按下搜尋查詢商品.....'}
                </Alert>
            </div>
            {/* 搜尋提示結束 */}
            {/* 列表開始 */}
            <div hidden={listPanel}>
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
                                        <td colSpan={tableList.length}>查無資料</td>
                                    </tr>
                                ) : (
                                    data.map((orders, index) => (
                                        <tr key={index} onClick={() => (getDetail(orders.orderID))}>
                                            <td>{index + 1}</td>
                                            <td>{orders.orderID}</td>
                                            <td>{orders.customerName}</td>
                                            <td>{formatDate(orders.orderDate)}</td>
                                        </tr>
                                    ))
                                )
                            }
                        </tbody>
                    </Table>
                }
                {
                    // 總筆數(totalCount)、指定頁數(mainPage)、顯示筆數(showPage)
                    totalCount > 0 ? (
                        <PaginationContext.Provider value={{ totalCount: totalCount, mainPage: mainPage, showPage: showPage, setMainPage: setMainPage, setShowPage: setShowPage }}>
                            <Paginations />
                        </PaginationContext.Provider>
                    ) : null
                }
            </div>
            {/* 列表結束 */}
            <br />
            <br />
            {/* 明細開始 */}
            <div hidden={detailPanel}>
                <div className='form-control'>
                    <div className='row col-12'>
                        <Form>
                            <br />
                            <Card>
                                <Card.Header>資料明細：{pageActionName || '測試'}模式</Card.Header>
                                <Card.Body>
                                    <Row className='mb-3'>
                                        <Form.Group as={Col} md="3" controlId="orderID">
                                            <Form.Label>訂單編號</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={formParamDetail.orderID}
                                                onChange={(e) => onChangeDateFieldDetailTxt(e, 'orderID')}
                                                autoComplete='off' // 關閉歷史紀錄
                                                disabled={textDisabled}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="3" controlId="customerName">
                                            <Form.Label>客戶名稱</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={formParamDetail.customerName}
                                                onChange={(e) => onChangeDateFieldDetailTxt(e, 'customerName')}
                                                autoComplete='off' // 關閉歷史紀錄
                                                disabled={textDisabled}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="3" controlId="orderDate">
                                            <Form.Label>訂單日期</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={formParamDetail.orderDate}
                                                onChange={onChangeOrderDate}
                                                autoComplete='off' // 關閉歷史紀錄
                                                disabled={textDisabled}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Table className='text-center' striped bordered hover variant="light">
                                        <thead>
                                            <tr>
                                                {
                                                    tableDetail.map((item, index) => (
                                                        <th key={index}>{item}</th>
                                                    ))
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                dataDetail.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={tableDetail.length}>查無資料</td>
                                                    </tr>
                                                ) : (
                                                    dataDetail
                                                )
                                            }
                                        </tbody>
                                    </Table>
                                    <div className='text-right'>{'總金額 : '}{totalAmount}{'元'}</div>
                                </Card.Body>
                            </Card>
                            <br />
                        </Form>
                    </div>
                </div>
            </div>
            {/* 明細結束 */}
        </div >
        // 頁面結束
    )
}

export default Order
