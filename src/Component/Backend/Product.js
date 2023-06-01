import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Form, Col, Row, Button, Alert, Table, Card } from 'react-bootstrap';
import axios from "axios";
import PaginationContext from '../Layout/PaginationContext';
import Paginations from '../Layout/Paginations';
import usePageAction from '../Layout/PageAction';
import ButtonSave from '../Layout/ButtonSave';
import ButtonRemove from '../Layout/ButtonRemove';
import useWebState from '../Layout/WebState';

const Product = () => {
    const Url = 'http://localhost:8088';
    const formRef = useRef(null); // 搜尋 form
    const formDetailRef = useRef(null); // 明細 form
    // 頁面控制
    const { handlePageAction, setPageAction, pageAction, setPrePageAction, prePageAction, pageActionName, searchPanel, searchTipPanel, listPanel, detailPanel, textDisabled, textHidden, btnHiddenBtnSearch, btnHiddenBtnAdd, btnHiddenBtnModify, btnHiddenBtnSave, btnHiddenBtnRemove, btnHiddenBtnCancel } = usePageAction();
    // 參數宣告
    const [totalCount, setTotalCount] = useState(0); // 總筆數
    const [mainPage, setMainPage] = useState(1); // 指定頁數
    const [prevMainPage, setPrevMainPage] = useState(0); // 前一次指定頁數
    const [prevShowPage, setPrevShowPage] = useState(0); // 前一次顯示頁數
    const [showPage, setShowPage] = useState(10); // 每頁顯示頁數
    const [data, setData] = useState([]); // 列表資料
    const [tableStart] = useState(['項次', '商品編號', '商品名稱', '商品價格', '商品庫存', '商品狀態']); // table 標頭
    const [pageCount, setPageCount] = useState(0);
    const [validated, setValidated] = useState(false);
    const [modifyAction, setModifyAction] = useState('');
    const [imagePath, setImagePath] = useState('');
    const { webState } = useWebState(); // design(true)&api (false)

    // 參數宣告 列表
    const [formParamSearch, setFormParamSearch] = useState({
        searchGoodsID: 0, searchGoodsName: '', searchPriceDown: 0, searchPriceUp: 0, searchOrderBy: '', searchGoodsQuantityDown: 0, searchStatus: ''
    });
    // 參數宣告 明細
    const [formParamDetail, setFormParamDetail] = useState({
        goodsID: 0, goodsName: '', goodsPrice: 0, goodsQuantity: 0, goodsImageName: '', status: false, fileName: ''
    });
    // 參數宣告 專屬頁面(啟用&停用)
    const [txtDisabledGoodsID, setTxtDisabledGoodsID] = useState(); // 商品編號
    const [txtDisabledGoodsImageName, setTxtDisabledGoodsImageName] = useState(); // 商品編號
    // 參數宣告 專屬頁面(顯示&隱藏)
    const [txtHiddenImage, setTxtHiddenImage] = useState(); // 商品圖片
    const [txtHiddenGoodsID, setTxtHiddenGoodsID] = useState(); // 商品編號
    const [txtHiddenImageName, setTxtHiddenImageName] = useState(); // 商品圖片名稱
    const [txtHiddenUpdateGoodsImage, setTxtHiddenUpdateGoodsImage] = useState(); // 商品上傳圖片
    // Submit 按鈕(Search)動作
    const handlSubmiteGetList = (event) => {
        event.preventDefault();
        setMainPage(1); // 預設 搜尋按鈕 page:1
        getList();
        setPageAction('List');
        setPrePageAction('List');
    }
    // submit 按鈕(Add&update)動作
    const handlSubmiteModify = async (event) => {
        event.preventDefault();
        setPageAction(event.target.value);
        if (event.target.value === 'Add') {
            setModifyAction('Add');
            setPrePageAction('Cancel');
            defaultInputDetail();
        } else {
            setModifyAction('Modify');
            setPrePageAction('Detail');
        }
    }
    // submit 按鈕(Save)動作
    const handlSubmiteSave = (result) => {
        const value = handleCheckValue(); // 檢核空白
        if (result && value) {
            console.log('進入存檔流程中...');
            save();
        }
    };
    // submit 按鈕(Remove)動作
    const handlSubmiteRemove = (result) => {
        if (result) {
            remove();
        }
    }
    // submit 按鈕(Cancel)動作
    const handlSubmiteCancel = async (event) => {
        event.preventDefault();
        if (prePageAction === 'List') {
            setPageAction('List');
        } else if (prePageAction === 'Detail') {
            setPageAction('List');
        } else {
            setPageAction('Cancel');
        }
        setValidated(false); // 欄位檢核顯示:紅框不顯示。
    }
    // List 取得
    const getList = useCallback(async (params) => {
        const apiUrl = Url + '/training/BackendController/queryGoods';
        const design = './Data/Backend/Product/queryGoodsList.json';
        const formData = new FormData();
        Object.keys(formParamSearch).map((key) => {
            const value = formParamSearch[key];
            // (params!== undefined && key === 'searchGoodsID') ? "":""
            if (key === 'searchGoodsID' && params !== undefined) {
                formData.append(key, params);
            } else {
                formData.append(key, value);
            }
            return null;
        });
        formData.append('action', 'List'); // 指定頁數
        formData.append('mainPage', mainPage); // 指定頁數
        formData.append('showPage', showPage); // 顯示頁數
        const response = await axios.get((webState ? design : apiUrl), formData).then(rs => rs.data).catch(error => { console.log(error); });
        setTotalCount(response.totalCount);
        setData(response.goods);
    }, [mainPage, showPage, formParamSearch, webState]);
    // Detail 取得
    const getDetail = async (params) => {
        const apiUrl = Url + '/training/BackendController/queryGoods';
        const design = './Data/Backend/Product/queryGoodsDetail.json';
        const formData = new FormData();
        Object.keys(formParamSearch).map((key) => {
            if (key !== 'searchGoodsID') {
                const value = formParamSearch[key];
                formData.append(key, value);
            }
            return null;
        });
        formData.append('action', 'Detail'); // 指定頁數
        formData.append('searchGoodsID', params); // 商品編號
        formData.append('mainPage', 0); // 指定頁數
        formData.append('showPage', 1); // 顯示頁數
        const response = await axios.get((webState ? design : apiUrl), formData).then(rs => rs.data).catch(error => { console.log(error); });
        if (response.totalCount !== 0) {
            setFormParamDetail(p => ({ ...p, goodsID: response.goods[0].goodsID }));
            setFormParamDetail(p => ({ ...p, goodsName: response.goods[0].goodsName }));
            setFormParamDetail(p => ({ ...p, goodsPrice: response.goods[0].goodsPrice }));
            setFormParamDetail(p => ({ ...p, goodsQuantity: response.goods[0].goodsQuantity }));
            setFormParamDetail(p => ({ ...p, goodsImageName: response.goods[0].goodsImageName }));
            setFormParamDetail(p => ({ ...p, status: response.goods[0].status === "1" }));
            setImagePath(response.goods[0].strImagePath.replace("//", "/"));
            setPageAction('Detail');
            setPrePageAction('List');
        }
    };
    // Add&Update 異動
    const save = async () => {
        const apiUrl = Url + (modifyAction !== 'Add' ? '/training/BackendController/updateGoods' : '/training/BackendController/createGoods'); // 新增 or 修改
        const design = (modifyAction !== 'Add') ? './Data/Backend/Product/updateGoods.json' : './Data/Backend/Product/createGoods.json';
        const formData = new FormData();
        Object.keys(formParamDetail).map((key) => {
            let value = formParamDetail[key];
            if (key === 'status') { value = value === false ? '0' : '1'; } // 狀態按鈕檢核(開啟:1/關閉:0)
            formData.append(key, value);
            return formData;
        });
        if (formDetailRef.current.updateGoodsImage.files.length > 0) {
            formData.append('updateGoodsImage', formDetailRef.current.updateGoodsImage.files[0]); // 上傳檔案資訊
        }
        const response = (modifyAction !== 'Add' ?
            (await axios.get((webState ? design : apiUrl), formData).then(rs => rs.data).catch(error => { console.log(error); })) :
            (await axios.get((webState ? design : apiUrl), formData).then(rs => rs.data).catch(error => { console.log(error); }))
        )
        setDetail(response.outputGoods.goodsID); // 後續動作
        console.log(response.outputResultMessage.message);
    }
    // Add&Update異動後，後續動作。
    const setDetail = async (params) => {
        getList();
        getDetail(params);
    }
    // Remove 刪除
    const remove = async () => {
        console.log("刪除動作中...");
        const apiUrl = Url + '/training/BackendController/deleteGoods'; // 刪除
        const design = './Data/Backend/Product/deleteGoods.json';
        const formData = new FormData();
        formData.append('goodsID', formParamDetail.goodsID); // 上傳檔案資訊
        const response = await axios.get((webState ? design : apiUrl), { data: formData }).then(rs => rs.data).catch(error => { console.log(error); });
        if (response) {
            console.log('刪除成功!');
        } else {
            console.log('刪除失敗!');
        }
        setList();
    }
    // Remove，刪除後，後續動作。
    const setList = async () => {
        setMainPage(1); // 預設 搜尋按鈕 page:1
        await getList();
        setPageAction('List');
        setPrePageAction('List');
    }

    // for this Page txt control(專屬該頁欄位屬性控制)
    const handleExclusivePageAction = (pageAction) => {
        switch (pageAction) {
            case "Add":
                setTxtDisabledGoodsID(true); // 商品編號(啟用&停用)
                setTxtDisabledGoodsImageName(true); // 商品圖片(啟用&停用)
                setTxtHiddenImage(true); // 商品圖片(顯示&隱藏)
                setTxtHiddenGoodsID(true); // 商品編號(顯示&隱藏)
                setTxtHiddenImageName(true); // 商品圖片名稱(顯示&隱藏)
                setTxtHiddenUpdateGoodsImage(false); // 商品圖片上傳(顯示&隱藏)
                break;
            case "Modify":
                setTxtDisabledGoodsID(true); // 商品編號 (啟用&停用)
                setTxtDisabledGoodsImageName(true); // 商品圖片(啟用&停用)
                setTxtHiddenImage(true); // 商品圖片(顯示&隱藏)
                setTxtHiddenGoodsID(false); // 商品編號(顯示&隱藏)
                setTxtHiddenImageName(false); // 商品圖片名稱(顯示&隱藏)
                setTxtHiddenUpdateGoodsImage(false); // 商品圖片上傳(顯示&隱藏)
                break;
            default:
                setTxtDisabledGoodsID(true); // 商品編號(啟用&停用)
                setTxtDisabledGoodsImageName(true); // 商品圖片(啟用&停用)
                setTxtHiddenImage(false); // 商品圖片(顯示&隱藏)
                setTxtHiddenGoodsID(false); // 商品編號(顯示&隱藏)
                setTxtHiddenImageName(false); // 商品圖片名稱(顯示&隱藏)
                setTxtHiddenUpdateGoodsImage(true); // 商品圖片上傳(顯示&隱藏)
                break;

        }
    }
    // 初始化欄位(搜尋)
    const defaultInputSearch = () => {
        setFormParamSearch(p => ({ ...p, searchGoodsID: '' })); // 商品編號
        setFormParamSearch(p => ({ ...p, searchGoodsName: '' })); // 商品名稱
        setFormParamSearch(p => ({ ...p, searchPriceDown: '' })); // 商品價格最高
        setFormParamSearch(p => ({ ...p, searchPriceUp: '' })); // 商品價格最低
        setFormParamSearch(p => ({ ...p, searchOrderBy: '' })); // 排序
        setFormParamSearch(p => ({ ...p, searchGoodsQuantityDown: '' })); // 商品庫存量低於
        setFormParamSearch(p => ({ ...p, searchStatus: '' })); // 商品狀態
    }
    //初始化欄位(明細)
    const defaultInputDetail = () => {
        setFormParamDetail(p => ({ ...p, goodsID: '' })); // 商品編號
        setFormParamDetail(p => ({ ...p, goodsName: '' })); // 商品名稱
        setFormParamDetail(p => ({ ...p, goodsPrice: '' })); // 商品金額
        setFormParamDetail(p => ({ ...p, goodsQuantity: '' })); // 商品庫存
        setFormParamDetail(p => ({ ...p, goodsImageName: '' })); // 商品圖片
        setFormParamDetail(p => ({ ...p, status: true })); // 商品狀態
    }
    // onchange & DB input set
    const onChangeDateFieldSearchTxt = (e, txtID) => { setFormParamSearch(p => ({ ...p, [txtID]: e.target.value })) }; // Search txt
    const onChangeDateFieldDetailTxt = (e, txtID) => { setFormParamDetail(p => ({ ...p, [txtID]: e.target.value })) }; // Detail txt
    const onChangeDateFieldDetailSwtich = (e, txtID) => { setFormParamDetail(p => ({ ...p, [txtID]: e.target.checked })); }; // Detail Switch

    // 瀏灠檔案上傳欄位
    const onChangeFile = (e) => {
        const changFile = e.target.files;
        const changFileName = changFile.length === 0 ? '' : changFile[0].name;
        setFormParamDetail(p => ({ ...p, fileName: changFileName }))
    };

    // 檢核明細空白欄位
    const handleCheckValue = () => {
        let result = false;
        const form = formDetailRef.current;
        result = !(form.checkValidity() === false); // 欄位檢核
        if (!result) { setValidated(true) }; // 空值，欄位紅框設定
        return result;
    };

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
            handleExclusivePageAction(pageAction);
        }
    }, [prevMainPage, prevShowPage, mainPage, getList, showPage, setPageAction, setPrePageAction, handlePageAction, pageAction, pageCount]);

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
                                <Link to="/Product">商品維護</Link>
                            </li>
                        </ul>
                    </nav>
                </Alert>
            </div>
            {/* 路徑導覽結束 */}
            {/* 網頁名稱開始 */}
            <h2>商品維護頁面</h2>
            {/* 網頁名稱結束 */}
            <hr className='hr-primary' />
            <hr />
            {/* 搜尋開始 */}
            <div hidden={searchPanel}>
                <Form onSubmit={handlSubmiteGetList} ref={formRef}>
                    <Row className="mb-3">
                        <Form.Group controlId="searchGoodsID" as={Col} md="3">
                            <Form.Label>商品編號 : </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="請輸入商品編號..."
                                value={formParamSearch.searchGoodsID}
                                onChange={(e) => onChangeDateFieldSearchTxt(e, 'searchGoodsID')}
                                autoComplete='off' // 關閉歷史紀錄
                            />
                        </Form.Group>
                        <Form.Group controlId="searchGoodsName" as={Col} md="3">
                            <Form.Label>商品名稱 : </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="請輸入商品名稱..."
                                value={formParamSearch.searchGoodsName}
                                onChange={(e) => onChangeDateFieldSearchTxt(e, 'searchGoodsName')}
                                autoComplete='off' // 關閉歷史紀錄
                            />
                        </Form.Group>
                        <Form.Group controlId="searchPriceDown" as={Col} md="3">
                            <Form.Label>商品價格(最低){'(大於此資料) : '}</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="商品價格(最低)..."
                                value={formParamSearch.searchPriceDown}
                                onChange={(e) => onChangeDateFieldSearchTxt(e, 'searchPriceDown')}
                                autoComplete='off' // 關閉歷史紀錄
                            />
                        </Form.Group>
                        <Form.Group controlId="searchPriceUp" as={Col} md="3">
                            <Form.Label>商品價格(最高){'(小於此資料) : '}</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="請輸入商品價格(最高)..."
                                value={formParamSearch.searchPriceUp}
                                onChange={(e) => onChangeDateFieldSearchTxt(e, 'searchPriceUp')}
                                autoComplete='off' // 關閉歷史紀錄
                            />
                        </Form.Group>
                        <Form.Group controlId="searchOrderBy" as={Col} md="3">
                            <Form.Label>排序 : </Form.Label>
                            <Form.Select as="select"
                                value={formParamSearch.searchOrderBy}
                                onChange={(e) => onChangeDateFieldSearchTxt(e, 'searchOrderBy')}
                            >
                                <option value="">請選擇商品狀態</option>
                                <option value="Asc">由小到大</option>
                                <option value="Desc">由大到小</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="searchGoodsQuantityDown" as={Col} md="3">
                            <Form.Label>低於庫存量 : </Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="請輸入低庫存量..."
                                value={formParamSearch.searchGoodsQuantityDown}
                                onChange={(e) => onChangeDateFieldSearchTxt(e, 'searchGoodsQuantityDown')}
                                autoComplete='off' // 關閉歷史紀錄
                            />
                        </Form.Group>
                        <Form.Group controlId="searchStatus" as={Col} md="3">
                            <Form.Label>商品狀態 : </Form.Label>
                            <Form.Select as="select"
                                value={formParamSearch.searchStatus}
                                onChange={(e) => onChangeDateFieldSearchTxt(e, 'searchStatus')}
                            >
                                <option value="">請選擇商品狀態</option>
                                <option value="1">啟用</option>
                                <option value="0">停用</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <div className='float-right'>
                        <Button variant="success" type="submit" hidden={btnHiddenBtnSearch}>搜尋</Button> {' '}
                        <Button variant="primary" type="button" hidden={btnHiddenBtnAdd} value='Add' onClick={handlSubmiteModify}>新增</Button> {' '}
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
                                    tableStart.map((item, index) => (
                                        <th key={index}>{item}</th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.length === 0 ? (
                                    <tr>
                                        <td colSpan={tableStart.length}>查無資料</td>
                                    </tr>
                                ) : (
                                    data.map((goods, index) => (
                                        <tr key={index} onClick={() => (getDetail(goods.goodsID))}>
                                            <td>{index + 1}</td>
                                            <td>{goods.goodsID}</td>
                                            <td>{goods.goodsName}</td>
                                            <td>{goods.goodsPrice}</td>
                                            <td>{goods.goodsQuantity}</td>
                                            <td>{goods.statusName}</td>
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
                        <Form noValidate validated={validated} ref={formDetailRef}>
                            <div className='float-right'>
                                <span hidden={btnHiddenBtnModify}><Button variant="info" type="submit" onClick={handlSubmiteModify} value='Modify'>修改</Button> {' '}</span>
                                <span hidden={btnHiddenBtnSave}><ButtonSave onConfirm={handlSubmiteSave} />{' '}</span>
                                <span hidden={btnHiddenBtnRemove}><ButtonRemove onConfirm={handlSubmiteRemove} /></span>
                                <span hidden={btnHiddenBtnCancel}><Button variant="warning" type="button" onClick={handlSubmiteCancel}>取消</Button> {' '}</span>
                            </div>
                            <br />
                            <br />
                            <Card>
                                <Card.Header>資料明細：{pageActionName || '測試'}模式</Card.Header>
                                <Card.Body>
                                    <Row className="mb-3">
                                        <Form.Group controlId="goosImage" as={Col} md="12" hidden={txtHiddenImage === undefined ? textHidden : txtHiddenImage}>
                                            <Card>
                                                <Card.Header>商品名稱: {formParamDetail.goodsName ? formParamDetail.goodsName : '未命名'}</Card.Header>
                                                <div className='div-imgs-size' >
                                                    <Card.Img className='imgs-goods' src={imagePath} />
                                                </div>
                                            </Card>
                                        </Form.Group>
                                    </Row>
                                    <Row className='mb-3'>
                                        <Form.Group controlId="goodsID" as={Col} md="3" hidden={txtHiddenGoodsID === undefined ? textHidden : txtHiddenGoodsID}>
                                            <Form.Label>商品編號</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={formParamDetail.goodsID}
                                                onChange={(e) => onChangeDateFieldDetailTxt(e, 'goodsID')}
                                                autoComplete='off' // 關閉歷史紀錄
                                                disabled={txtDisabledGoodsID === undefined ? textDisabled : txtDisabledGoodsID}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group controlId="goodsName" as={Col} md="3" hidden={textHidden}>
                                            <Form.Label>商品名稱</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={formParamDetail.goodsName}
                                                onChange={(e) => onChangeDateFieldDetailTxt(e, 'goodsName')}
                                                autoComplete='off' // 關閉歷史紀錄
                                                disabled={textDisabled}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">商品名稱不可為空白!</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="goodsPrice" as={Col} md="3" hidden={textHidden}>
                                            <Form.Label>商品價格</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={formParamDetail.goodsPrice}
                                                onChange={(e) => onChangeDateFieldDetailTxt(e, 'goodsPrice')}
                                                autoComplete='off' // 關閉歷史紀錄
                                                disabled={textDisabled}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">商品價格不可為空白!</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="goodsQuantity" as={Col} md="3" hidden={textHidden}>
                                            <Form.Label>商品數量</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={formParamDetail.goodsQuantity}
                                                onChange={(e) => onChangeDateFieldDetailTxt(e, 'goodsQuantity')}
                                                autoComplete='off' // 關閉歷史紀錄
                                                disabled={textDisabled}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">商品數量不可為空白!</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="status" as={Col} md="3" hidden={textHidden}>
                                            <Form.Label>商品狀態</Form.Label>
                                            <Form.Check
                                                type="switch"
                                                checked={formParamDetail.status}
                                                onChange={(e) => onChangeDateFieldDetailSwtich(e, 'status')}
                                                autoComplete='off' // 關閉歷史紀錄
                                                disabled={textDisabled}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="goodsImageName" as={Col} md="4" hidden={txtHiddenImageName === undefined ? textHidden : txtHiddenImageName}>
                                            <Form.Label>商品圖片名稱</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={formParamDetail.goodsImageName}
                                                onChange={(e) => onChangeDateFieldDetailTxt(e, 'goodsImageName')}
                                                autoComplete='off' // 關閉歷史紀錄
                                                disabled={txtDisabledGoodsImageName === undefined ? textDisabled : txtDisabledGoodsImageName}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">商品圖片名稱欄位不可為空白！</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="updateGoodsImage" as={Col} md="8" className="mb-3" hidden={txtHiddenUpdateGoodsImage === undefined ? textHidden : txtHiddenUpdateGoodsImage}>
                                            <Form.Label>請選擇上傳檔案...</Form.Label>
                                            <Form.Control
                                                type="file"
                                                disabled={textDisabled}
                                                onChange={onChangeFile}
                                                {...(formParamDetail.goodsImageName === '' ? { required: true } : {})}
                                            />
                                            <Form.Control.Feedback type="invalid">上傳檔案欄位不可為空白！</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                </Card.Body>
                            </Card>
                            <br />
                            <div className='float-right'>
                                <span hidden={btnHiddenBtnModify}><Button variant="info" type="submit" onClick={handlSubmiteModify} value='Modify'>修改</Button> {' '}</span>
                                <span hidden={btnHiddenBtnSave}><ButtonSave onConfirm={handlSubmiteSave} />{' '}</span>
                                <span hidden={btnHiddenBtnRemove}><ButtonRemove onConfirm={handlSubmiteRemove} /></span>
                                <span hidden={btnHiddenBtnCancel}><Button variant="warning" type="button" onClick={handlSubmiteCancel}>取消</Button> {' '}</span>
                            </div>
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

export default Product
