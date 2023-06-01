import { createContext } from 'react';

const PaginationContext = createContext({
    totalCount: 0, // 提供預設值
    mainPage: 0,
    setMainPage: 0,
    showPage: 0,
    setShowPage: 0
});

export default PaginationContext;
