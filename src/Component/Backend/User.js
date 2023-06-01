import React, { useState, useEffect, useCallback, useRef } from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';
import { Form, Col, Row, Button, Alert, Table, Card } from 'react-bootstrap';
import PaginationContext from '../Layout/PaginationContext';
import Paginations from '../Layout/Paginations';
import usePageAction from '../Layout/PageAction';
import ButtonSave from '../Layout/ButtonSave';
import useWebState from '../Layout/WebState';

const User = () => {
    const Url = 'http://localhost:8088';
    // const imgs = require('../../assets/images/pika.jpg'); // 測試圖片
    const formRef = useRef(null); // 搜尋 form
    const formDetailRef = useRef(null); // 明細 form
    // 頁面控制
    const { handlePageAction, setPageAction, pageAction, setPrePageAction, prePageAction, pageActionName, searchPanel, searchTipPanel, listPanel, detailPanel, textDisabled, textHidden, btnHiddenBtnSearch, btnHiddenBtnAdd, btnHiddenBtnModify, btnHiddenBtnSave, btnHiddenBtnCancel } = usePageAction();
    // 參數宣告
    const [totalCount, setTotalCount] = useState(0); // 總筆數
    const [mainPage, setMainPage] = useState(1); // 指定頁數
    const [prevMainPage, setPrevMainPage] = useState(0); // 前一次指定頁數
    const [prevShowPage, setPrevShowPage] = useState(0); // 前一次顯示頁數
    const [showPage, setShowPage] = useState(10); // 每頁顯示頁數
    const [data, setData] = useState([]); // 列表資料
    const [tableStart] = useState(['項次', '編號', '姓名', '狀態']); // table 標頭
    const [pageCount, setPageCount] = useState(0);
    const [validated, setValidated] = useState(false);
    const [modifyAction, setModifyAction] = useState('');
    const { webState } = useWebState(); // design(true)&api (false)
    // 參數宣告 列表
    const [formParamSearch, setFormParamSearch] = useState({
        searchID: '', searchName: ''
    });
    // 參數宣告 明細
    const [formParamDetail, setFormParamDetail] = useState({
        id: 0, name: '', pwd: '', pwdCheck: '', status: true
    });
    // 參數宣告 專屬頁面(啟用&停用)
    const [txtDisabledid, setTxtDisabledid] = useState(); // 人員編號
    // 參數宣告 專屬頁面(顯示&隱藏)
    const [txtHiddenid, setTxtHiddenid] = useState(); // 人員編號
    const [txtHiddenpwdcheck, setTxtHiddenpwdcheck] = useState(); // 人員編號
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
            save();
        }
    };
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
        const apiUrl = Url + '/training/FrontendController/memberQuery';
        const design = './Data/Backend/User/memberQueryList.json';
        const formData = new FormData();
        Object.keys(formParamSearch).map((key) => {
            const value = formParamSearch[key];
            formData.append(key, (key === 'searchID' && params !== undefined) ? params : value);
            return null;
        });
        formData.append('action', 'List'); // 指定頁數
        formData.append('mainPage', mainPage); // 指定頁數
        formData.append('showPage', showPage); // 顯示頁數
        const response = await axios.get((webState ? design : apiUrl), formData, { timeout: 3000 }).then(rs => rs.data).catch(error => { console.log(error); });
        setData(response.member);
        setTotalCount(response.totalCount);
    }, [mainPage, showPage, formParamSearch, webState]);
    // Detail 取得
    const getDetail = async (params) => {
        const apiUrl = Url + '/training/FrontendController/memberQuery';
        const design = './Data/Backend/User/memberQueryDetail.json';
        const formData = new FormData();
        formData.append('action', 'Detail'); // 指定頁數
        formData.append('searchID', params); // 人員編號
        formData.append('searchName', ''); // 人員名稱
        formData.append('mainPage', 0); // 指定頁數
        formData.append('showPage', 1); // 顯示頁數
        const response = await axios.get((webState ? design : apiUrl), formData).then(rs => rs.data).catch(error => { console.log(error); });
        if (response.totalCount !== 0) {
            setFormParamDetail(p => ({ ...p, id: response.member[0].id }));
            setFormParamDetail(p => ({ ...p, name: response.member[0].name }));
            setFormParamDetail(p => ({ ...p, pwd: response.member[0].pwd }));
            setFormParamDetail(p => ({ ...p, pwdCheck: response.member[0].pwd }));
            setFormParamDetail(p => ({ ...p, status: response.member[0].status === "1" }));
            setPageAction('Detail');
            setPrePageAction('List');
        }
    };
    // Add&Update 異動
    const save = async () => {
        const apiUrl = Url + '/training/FrontendController/memberModify'; // 新增 or 修改
        const design = modifyAction !== 'Add' ? './Data/Backend/User/memberModifyUpdate.json' : './Data/Backend/User/memberModifyAdd.json';
        const formData = new FormData();
        Object.keys(formParamDetail).map((key) => {
            let value = formParamDetail[key];
            if (key === 'status') { value = value === false ? '0' : '1'; } // 狀態按鈕檢核(開啟:1/關閉:0)
            formData.append(key, value);
            return formData;
        });
        formData.append('action', modifyAction); // 異動動作
        const response = await axios.get((webState ? design : apiUrl), formData).then(rs => rs.data).catch(error => { console.log(error); });
        if (response.outputResultMessage.result === 'S') {
            setDetail(response.outputMember.id); // 後續動作
        }
    }
    // Add&Update異動後，後續動作。
    const setDetail = async (params) => {
        getList('');
        getDetail(params);
    }

    // for this Page txt control(專屬該頁欄位屬性控制)
    const handleExclusivePageAction = (pageAction) => {
        switch (pageAction) {
            case "Add":
                setTxtDisabledid(false); // 人員編號(啟用&停用)
                setTxtHiddenid(false); // 人員編號(顯示&隱藏)
                setTxtHiddenpwdcheck(false); // 密碼確認(顯示&隱藏)
                break;
            case "Modify":
                setTxtDisabledid(true); // 人員編號(啟用&停用)
                setTxtHiddenid(false); // 人員編號(顯示&隱藏)
                setTxtHiddenpwdcheck(false); // 密碼確認(顯示&隱藏)
                break;
            default:
                setTxtDisabledid(true); // 人員編號(啟用&停用)
                setTxtHiddenid(false); // 人員編號(顯示&隱藏)
                setTxtHiddenpwdcheck(true); // 密碼確認(顯示&隱藏)
                break;

        }
    }
    // 初始化欄位(搜尋)
    const defaultInputSearch = () => {
        setFormParamSearch(p => ({ ...p, searchID: '' })); // 人員編號
        setFormParamSearch(p => ({ ...p, searchName: '' })); // 人員名稱
    }
    //初始化欄位(明細)
    const defaultInputDetail = () => {
        setFormParamDetail(p => ({ ...p, id: '' })); // 人員編號
        setFormParamDetail(p => ({ ...p, name: '' })); // 人員姓名

        setFormParamDetail(p => ({ ...p, pwd: '' })); // 密碼
        setFormParamDetail(p => ({ ...p, pwdCheck: '' })); // 密碼確認
        setFormParamDetail(p => ({ ...p, status: true })); // 商品狀態
    }
    // onchange & DB input set
    const onChangeDateFieldSearchTxt = (e, txtID) => { setFormParamSearch(p => ({ ...p, [txtID]: e.target.value })) }; // Search txt
    const onChangeDateFieldDetailTxt = (e, txtID) => { setFormParamDetail(p => ({ ...p, [txtID]: e.target.value })) }; // Detail txt
    const onChangeDateFieldDetailSwtich = (e, txtID) => { setFormParamDetail(p => ({ ...p, [txtID]: e.target.checked })); }; // Detail Switch

    // 檢核明細空白欄位
    const handleCheckValue = () => {
        let result = false;
        const form = formDetailRef.current;
        result = !(form.checkValidity() === false); // 欄位檢核
        if (!result) { setValidated(true) }; // 空值，欄位紅框設定
        return result;
    };

    // 異動頁數
    useEffect(() => {
        if (prevMainPage !== mainPage || prevShowPage !== showPage) {
            getList();
            setPrevMainPage(mainPage);
            setPrevShowPage(showPage);
            setPageAction('List');
            setPrePageAction('');
        }
    }, [prevMainPage, prevShowPage, mainPage, getList, showPage, setPageAction, setPrePageAction]);
    // 異動頁面動作
    useEffect(() => {
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
    }, [setPageAction, handlePageAction, pageAction, pageCount]);
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
                                <Link to="/Product">會員維護</Link>
                            </li>
                        </ul>
                    </nav>
                </Alert>
            </div>
            {/* 路徑導覽結束 */}
            {/* 網頁名稱開始 */}
            <h2>會員維護頁面</h2>
            {/* 網頁名稱結束 */}
            <hr className='hr-primary' />
            <hr />
            {/* 搜尋開始 */}
            <div hidden={searchPanel}>
                <Form onSubmit={handlSubmiteGetList} ref={formRef}>
                    <Row className="mb-3">
                        <Form.Group controlId="searchID" as={Col} md="3">
                            <Form.Label>人員編號 : </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="請輸入人員編號..."
                                value={formParamSearch.searchID}
                                onChange={(e) => onChangeDateFieldSearchTxt(e, 'searchID')}
                                autoComplete='off' // 關閉歷史紀錄
                            />
                        </Form.Group>
                        <Form.Group controlId="searchName" as={Col} md="3">
                            <Form.Label>人員名稱 : </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="請輸入商品名稱..."
                                value={formParamSearch.searchName}
                                onChange={(e) => onChangeDateFieldSearchTxt(e, 'searchName')}
                                autoComplete='off' // 關閉歷史紀錄
                            />
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
                                    data.map((member, index) => (
                                        <tr key={index} onClick={() => (getDetail(member.id))}>
                                            <td>{index + 1}</td>
                                            <td>{member.id}</td>
                                            <td>{member.name}</td>
                                            <td>{member.statusName}</td>
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
                                <span hidden={btnHiddenBtnCancel}><Button variant="warning" type="button" onClick={handlSubmiteCancel}>取消</Button> {' '}</span>
                            </div>
                            <br />
                            <br />
                            <Card>
                                <Card.Header>資料明細：{pageActionName || '測試'}模式</Card.Header>
                                <Card.Body>
                                    <Row className='mb-3'>
                                        <Form.Group controlId="id" as={Col} md="3" hidden={txtHiddenid === undefined ? textHidden : txtHiddenid}>
                                            <Form.Label>人員編號</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={formParamDetail.id}
                                                onChange={(e) => onChangeDateFieldDetailTxt(e, 'id')}
                                                autoComplete='off' // 關閉歷史紀錄
                                                disabled={txtDisabledid === undefined ? textDisabled : txtDisabledid}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group controlId="name" as={Col} md="3" hidden={textHidden}>
                                            <Form.Label>人員名稱</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={formParamDetail.name}
                                                onChange={(e) => onChangeDateFieldDetailTxt(e, 'name')}
                                                autoComplete='off' // 關閉歷史紀錄
                                                disabled={textDisabled}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">密碼不可為空白!</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="pwd" as={Col} md="3" hidden={textHidden}>
                                            <Form.Label>密碼</Form.Label>
                                            <Form.Control
                                                type="password"
                                                value={formParamDetail.pwd}
                                                onChange={(e) => onChangeDateFieldDetailTxt(e, 'pwd')}
                                                autoComplete='off' // 關閉歷史紀錄
                                                disabled={textDisabled}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">密碼確認不可為空白!</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="pwdCheck" as={Col} md="3" hidden={txtHiddenpwdcheck === undefined ? textHidden : txtHiddenpwdcheck}>
                                            <Form.Label>密碼確認</Form.Label>
                                            <Form.Control
                                                type="password"
                                                value={formParamDetail.pwdCheck}
                                                onChange={(e) => onChangeDateFieldDetailTxt(e, 'pwdCheck')}
                                                autoComplete='off' // 關閉歷史紀錄
                                                disabled={textDisabled}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">密碼確認不可為空白!</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="status" as={Col} md="3" hidden={textHidden}>
                                            <Form.Label>人員狀態</Form.Label>
                                            <Form.Check
                                                type="switch"
                                                checked={formParamDetail.status}
                                                onChange={(e) => onChangeDateFieldDetailSwtich(e, 'status')}
                                                autoComplete='off' // 關閉歷史紀錄
                                                disabled={textDisabled}
                                            />
                                        </Form.Group>
                                    </Row>
                                </Card.Body>
                            </Card>
                            <br />
                            <div className='float-right'>
                                <span hidden={btnHiddenBtnModify}><Button variant="info" type="submit" onClick={handlSubmiteModify} value='Modify'>修改</Button> {' '}</span>
                                <span hidden={btnHiddenBtnSave}><ButtonSave onConfirm={handlSubmiteSave} />{' '}</span>
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

export default User
