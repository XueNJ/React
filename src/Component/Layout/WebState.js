import { useState } from 'react';

const useWebState = () => {
    const [webState, setWebState] = useState(true); // 設計模式: true，連線模式:false

    return {
        webState,
        setWebState
    };
};

export default useWebState;
