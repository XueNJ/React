import React, { useState, useEffect, useRef, useCallback } from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';
import { Form, Col, Row, Button, Alert, Card } from 'react-bootstrap';
import usePageAction from '../Layout/PageAction';
import ButtonSave from '../Layout/ButtonSave';
import useWebState from '../Layout/WebState';

const Customer = () => {
    const url = 'http://localhost:8088';
    const formDetailRef = useRef(null); // 明細 form
    const { webState } = useWebState(); // design(true)&api (false)
    // 頁面控制
    const { handlePageAction, setPageAction, pageAction, setPrePageAction, prePageAction, pageActionName, detailPanel, textDisabled, textHidden, btnHiddenBtnModify, btnHiddenBtnSave, btnHiddenBtnCancel, setHiddenBtnCancel } = usePageAction();
    // 參數宣告
    const [pageCount, setPageCount] = useState(0);
    const [validated, setValidated] = useState(false);
    const [modifyAction, setModifyAction] = useState('');
    // 參數宣告 明細
    const [formParamDetail, setFormParamDetail] = useState({
        id: 0, name: '', pwd: '', pwdCheck: '', status: true
    });
    // 參數宣告 專屬頁面(啟用&停用)
    const [txtDisabledid, setTxtDisabledid] = useState(); // 人員編號
    // 參數宣告 專屬頁面(顯示&隱藏)
    const [txtHiddenid, setTxtHiddenid] = useState(); // 人員編號
    const [txtHiddenpwdcheck, setTxtHiddenpwdcheck] = useState(); // 人員編號
    const [txtHiddenstatus, setTxtHiddenstatus] = useState(); // 人員編號
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
            setPageAction('Detail');
        } else if (prePageAction === 'Detail') {
            setPageAction('Detail');
        } else {
            setPageAction('Cancel');
        }
        setValidated(false); // 欄位檢核顯示:紅框不顯示。
    }
    // Detail 取得
    const getDetail = useCallback(async () => {
        const apiUrl = url + '/training/FrontendController/loginCheck';
        const design = './Data/Frontend/Customer/loginCheck.json';
        const response = await axios.get((webState ? design : apiUrl), { withCredentials: true }, { timeout: 3000 }).then(rs => rs.data).catch(error => { console.log(error); });
        if (response.totalCount !== 0) {
            setFormParamDetail(p => ({ ...p, id: response.outputMember.id }));
            setFormParamDetail(p => ({ ...p, name: response.outputMember.name }));
            setFormParamDetail(p => ({ ...p, pwd: response.outputMember.pwd }));
            setFormParamDetail(p => ({ ...p, pwdCheck: response.outputMember.pwd }));
            setFormParamDetail(p => ({ ...p, status: response.outputMember.status === "1" }));
            setPageAction('Detail');
            setPrePageAction('List');
        }
    }, [setPageAction, setPrePageAction, webState]);
    // Add&Update 異動
    const save = async () => {
        const apiUrl = url + '/training/FrontendController/memberModify'; // 新增 or 修改
        const design = './Data/Frontend/Customer/memberModify.json';
        const formData = new FormData();
        Object.keys(formParamDetail).map((key) => {
            let value = formParamDetail[key];
            if (key === 'status') { value = value === false ? '0' : '1'; } // 狀態按鈕檢核(開啟:1/關閉:0)
            formData.append(key, value);
            return formData;
        });
        formData.append('action', modifyAction); // 異動動作
        const response = await axios.get((webState ? design : apiUrl), formData).then(rs => rs.data).catch(error => { console.log(error); });
        setDetail(response.outputMember.id); // 後續動作
    }
    // Add&Update異動後，後續動作。
    const setDetail = async (params) => {
        getDetail(params);
    }
    // for this Page txt control(專屬該頁欄位屬性控制)
    const handleExclusivePageAction = useCallback((pageAction) => {
        switch (pageAction) {
            case "Add":
                setTxtDisabledid(false); // 人員編號(啟用&停用)
                setTxtHiddenid(false); // 人員編號(顯示&隱藏)
                setTxtHiddenpwdcheck(false); // 密碼確認(顯示&隱藏)
                setTxtHiddenstatus(true); // 狀態(顯示&隱藏)
                setHiddenBtnCancel(false); // 取消按鈕(顯示&隱藏)
                break;
            case "Modify":
                setTxtDisabledid(true); // 人員編號(啟用&停用)
                setTxtHiddenid(false); // 人員編號(顯示&隱藏)
                setTxtHiddenpwdcheck(false); // 密碼確認(顯示&隱藏)
                setTxtHiddenstatus(true); // 狀態(顯示&隱藏)
                setHiddenBtnCancel(false); // 取消按鈕(顯示&隱藏)
                break;
            default:
                setTxtDisabledid(true); // 人員編號(啟用&停用)
                setTxtHiddenid(false); // 人員編號(顯示&隱藏)
                setTxtHiddenpwdcheck(true); // 密碼確認(顯示&隱藏)
                setTxtHiddenstatus(true); // 狀態(顯示&隱藏)
                setHiddenBtnCancel(true); // 取消按鈕(顯示&隱藏)
                break;

        }
    }, [setHiddenBtnCancel])
    //初始化欄位(明細)
    const defaultInputDetail = () => {
        setFormParamDetail(p => ({ ...p, id: '' })); // 人員編號
        setFormParamDetail(p => ({ ...p, name: '' })); // 人員姓名

        setFormParamDetail(p => ({ ...p, pwd: '' })); // 密碼
        setFormParamDetail(p => ({ ...p, pwdCheck: '' })); // 密碼確認
        setFormParamDetail(p => ({ ...p, status: true })); // 商品狀態
    }
    // onchange & DB input set
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
    // 異動頁面動作
    useEffect(() => {
        // 起始畫面設定
        if (pageCount === 0) {
            getDetail();
            setPageAction('Detail'); // 頁面動作
            handlePageAction(); // 執行頁面動作
            setPageCount(1); // 塞值避免迴圈
        }
        // 後續頁面動作
        if (pageAction !== '' & pageCount !== 0) {
            setPageAction(''); // 頁面動作
            handlePageAction(); // 執行頁面動作
            handleExclusivePageAction(pageAction);
        }
    }, [setPageAction, handlePageAction, pageAction, pageCount, getDetail, handleExclusivePageAction]);
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
                                        <Form.Group controlId="status" as={Col} md="3" hidden={txtHiddenstatus === undefined ? textHidden : txtHiddenstatus}>
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

export default Customer
