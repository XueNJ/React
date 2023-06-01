import { useState } from 'react';

const usePageAction = () => {
    // 參數
    const [pageAction, setPageAction] = useState(''); // 頁面動作
    const [prePageAction, setPrePageAction] = useState(''); // 紀錄上一步驟頁面動作
    const [pageActionName, setPageActionName] = useState(''); // 頁面動作名稱
    const [searchPanel, setSearchPanel] = useState(true); // 搜尋區域
    const [searchTipPanel, setSearchTipPanel] = useState(true); // 搜尋提示區域
    const [listPanel, setListPanel] = useState(true); // 清單區域
    const [detailPanel, setDetailPanel] = useState(true); // 明細區域
    const [textDisabled, setTextDisabled] = useState(false); // 明細區域欄位禁用狀態
    const [textHidden, setTextHidden] = useState(false); // 明細區域欄位禁用狀態
    const [btnHiddenBtnSearch, setHiddenBtnSearch] = useState(); // 按鈕 搜尋 顯示&隱藏
    const [btnHiddenBtnAdd, setHiddenBtnAdd] = useState(); // 按鈕 新增 顯示&隱藏
    const [btnHiddenBtnModify, setHiddenBtnModify] = useState(); // 按鈕 修改 顯示&隱藏
    const [btnHiddenBtnSave, setHiddenBtnSave] = useState(); // 按鈕 存檔 顯示&隱藏
    const [btnHiddenBtnRemove, setHiddenBtnRemove] = useState(); // 按鈕 刪除 顯示&隱藏
    const [btnHiddenBtnCancel, setHiddenBtnCancel] = useState(); // 按鈕 取消 顯示&隱藏
    // 頁面動作（預設/搜尋/修改）
    const handlePageAction = () => {
        switch (pageAction) {
            case 'List':
                setPageActionName('瀏覽');
                // 頁面區域（顯示/隱藏）
                setSearchPanel(false); // 顯示搜尋區域
                setSearchTipPanel(true); // 顯示搜尋提示區域
                setListPanel(false); // 顯示清單區域
                setDetailPanel(true); // 隱藏明細區域
                // 明細欄位（啟用/禁用）
                setTextDisabled(true);
                // 明細欄位 (顯示/隱藏)
                setTextHidden(true);
                // 按鈕 (顯示/隱藏)
                setHiddenBtnSearch(false); // 搜尋
                setHiddenBtnAdd(false); // 新增
                setHiddenBtnModify(true); // 修改
                setHiddenBtnSave(true); // 存檔
                setHiddenBtnRemove(true); // 刪除
                setHiddenBtnCancel(true); // 取消
                break;
            case 'Detail':
                setPageActionName('瀏覽');
                // 頁面區域（顯示/隱藏）
                setSearchPanel(false); // 顯示搜尋區域
                setSearchTipPanel(true); // 顯示搜尋提示區域
                setListPanel(false); // 顯示清單區域
                setDetailPanel(false); // 隱藏明細區域
                // 明細欄位（啟用/禁用）
                setTextDisabled(true);
                // 明細欄位 (顯示/隱藏)
                setTextHidden(false);
                // 按鈕 (顯示/隱藏)
                setHiddenBtnSearch(false); // 搜尋
                setHiddenBtnAdd(false); // 新增
                setHiddenBtnModify(false); // 修改
                setHiddenBtnSave(true); // 存檔
                setHiddenBtnRemove(false); // 刪除
                setHiddenBtnCancel(false); // 取消
                break;
            case 'Add':
                setPageActionName('新增');
                // 頁面區域（顯示/隱藏）
                setSearchPanel(true); // 顯示搜尋區域
                setSearchTipPanel(true); // 顯示搜尋提示區域
                setListPanel(true); // 顯示清單區域
                setDetailPanel(false); // 隱藏明細區域
                // 明細欄位（啟用/禁用）
                setTextDisabled(false);
                // 明細欄位 (顯示/隱藏)
                setTextHidden(false);
                // 按鈕 (顯示/隱藏)
                setHiddenBtnSearch(true); // 搜尋
                setHiddenBtnAdd(true); // 新增
                setHiddenBtnModify(true); // 修改
                setHiddenBtnSave(false); // 存檔
                setHiddenBtnRemove(true); // 刪除
                setHiddenBtnCancel(false); // 取消
                break;
            case 'Modify':
                setPageActionName('修改');
                // 頁面區域（顯示/隱藏）
                setSearchPanel(true); // 顯示搜尋區域
                setSearchTipPanel(true); // 顯示搜尋提示區域
                setListPanel(true); // 顯示清單區域
                setDetailPanel(false); // 隱藏明細區域
                // 明細欄位（啟用/禁用）
                setTextDisabled(false);
                // 明細欄位 (顯示/隱藏)
                setTextHidden(false);
                // 按鈕 (顯示/隱藏)
                setHiddenBtnSearch(true); // 搜尋
                setHiddenBtnAdd(true); // 新增
                setHiddenBtnModify(true); // 修改
                setHiddenBtnSave(false); // 存檔
                setHiddenBtnRemove(true); // 刪除
                setHiddenBtnCancel(false); // 取消
                break;
            case 'Cancel':
                // 頁面區域（顯示/隱藏）
                setSearchPanel(false); // 顯示搜尋區域
                setSearchTipPanel(false); // 顯示搜尋提示區域
                setListPanel(true); // 顯示清單區域
                setDetailPanel(true); // 隱藏明細區域
                // 明細欄位（啟用/禁用）
                setTextDisabled(true);
                // 明細欄位 (顯示/隱藏)
                setTextHidden(true);
                // 按鈕 (顯示/隱藏)
                setHiddenBtnSearch(false); // 搜尋
                setHiddenBtnAdd(false); // 新增
                setHiddenBtnModify(true); // 修改
                setHiddenBtnSave(true); // 存檔
                setHiddenBtnRemove(true); // 刪除
                setHiddenBtnCancel(true); // 取消
                break;
            default:
                setPageActionName('預設');
                // 頁面區域（顯示/隱藏）
                setSearchPanel(false); // 搜尋區域
                setSearchTipPanel(false); // 搜尋提示區域
                setListPanel(true); // 清單區域
                setDetailPanel(true); // 明細區域
                // 明細欄位（啟用/禁用）
                setTextDisabled(true);
                // 明細欄位 (顯示/隱藏)
                setTextHidden(false);
                // 按鈕 (顯示/隱藏)
                setHiddenBtnSearch(false); // 搜尋
                setHiddenBtnAdd(false); // 新增
                setHiddenBtnModify(true); // 修改
                setHiddenBtnSave(true); // 存檔
                setHiddenBtnRemove(true); // 刪除
                setHiddenBtnCancel(true); // 取消
                break;
        }
    };

    return {
        setPrePageAction,
        prePageAction,
        setPageAction,
        pageAction,
        pageActionName,
        searchPanel,
        searchTipPanel,
        listPanel,
        detailPanel,
        textDisabled,
        textHidden,
        handlePageAction,
        btnHiddenBtnSearch,
        btnHiddenBtnAdd,
        btnHiddenBtnModify,
        btnHiddenBtnSave,
        btnHiddenBtnRemove,
        btnHiddenBtnCancel,
        setSearchPanel,
        setSearchTipPanel,
        setListPanel,
        setDetailPanel,
        setHiddenBtnCancel
    };
};

export default usePageAction;
