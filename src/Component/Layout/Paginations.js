import React, { useContext } from 'react'
import { Pagination, Form } from 'react-bootstrap';
import PaginationContext from './PaginationContext';

const Paginations = () => {
    //
    const { totalCount, mainPage, setMainPage, showPage, setShowPage } = useContext(PaginationContext); // 取得 context 傳進來的總筆數
    const pageCounts = Math.ceil(totalCount / showPage); // 最末頁
    const pageCountArray = Array.from({ length: pageCounts }, (_, index) => index + 1); // 頁數陣列 [1, 2, 3...]
    const pageCount = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const currentPage = mainPage; // 目前指定頁數
    const totalPages = pageCountArray.length; // 總頁數
    let renderedPageCountArray = pageCountArray; // 頁數陣列整理
    if (totalPages === 0) {
        renderedPageCountArray = [1];
    } else if (totalPages > 5) {
        if (currentPage === 1) {
            renderedPageCountArray = pageCountArray;
        } else if (currentPage === totalPages) {
            renderedPageCountArray = [totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            renderedPageCountArray = [currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
        }
    }
    //
    const handlePageClick = (pageNumber) => {
        setMainPage(pageNumber);
    };
    //
    const handleShowPageClick = (showPageNumber) => {
        setShowPage(showPageNumber);
        if (mainPage !== 1) {
            setMainPage(1);
        }
    }

    return (
        <>
            <div className="float-right" style={{ display: 'flex', flexDirection: 'row' }}>
                <div className='mx-1'>
                    {
                        <Pagination>
                            <Pagination.First disabled={currentPage === 1 || totalPages === 0} onClick={() => handlePageClick(1)} />
                            <Pagination.Prev disabled={currentPage === 1 || totalPages === 0} onClick={() => handlePageClick(mainPage - 1)} />
                            {renderedPageCountArray.map((number, index) => (
                                <Pagination.Item key={index} active={number === currentPage} disabled={totalPages === 0} onClick={() => handlePageClick(number)}>
                                    {number}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next disabled={currentPage === totalPages || totalPages === 0} onClick={() => handlePageClick(mainPage + 1)} />
                            <Pagination.Last disabled={currentPage === totalPages || totalPages === 0} onClick={() => handlePageClick(renderedPageCountArray.length)} />
                        </Pagination>
                    }
                </div>
                <div className='mx-1'>
                    <Form.Select aria-label="Default select example" value={showPage} onChange={(e) => handleShowPageClick(e.target.value)}>
                        {pageCount.map((count, index) => (
                            <option key={index} value={count}>
                                {count}
                            </option>
                        ))}
                    </Form.Select>
                </div>
                <div className='mx-1'>
                    <div style={{ whiteSpace: 'nowrap', textAlign: 'center', flexGrow: 1 }}>
                        {'總筆數 : '}{totalCount}{'筆'}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Paginations;
