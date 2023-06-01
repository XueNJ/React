import { useState } from 'react';
import axios from "axios"
import useWebState from './WebState';

const useShoppingCartGoodsSearch = () => {
    const url = 'http://localhost:8088'; // Server 
    const [shoppingCartGoods, setShoppingCartGoods] = useState([]); // 購物車商品資訊
    const [totalAmount, setTotalAmount] = useState(0);
    const [buyCount, setBuyCount] = useState(0); // 購物車商品數量
    const [result, setResult] = useState('');
    const [message, setMessage] = useState('');
    const { webState } = useWebState();

    // 購物車資訊
    const getShoppingCartGoodsInfo = async () => {
        const apiUrl = url + '/training/FrontendController/queryCartGoods';
        const design = './Data/Layout/queryCartGoods.json';
        const response = await axios.get((webState ? design : apiUrl)).then(rs => rs.data).catch(error => { console.log(error); });
        setShoppingCartGoods(response.shoppingCartGoods);
        setTotalAmount(response.totalAmount);
        setBuyCount(response.totalCount);
        setResult(response.outputResultMessage.result);
        setMessage(response.outputResultMessage.message);
    };

    return {
        getShoppingCartGoodsInfo,
        buyCount,
        setBuyCount,
        shoppingCartGoods,
        setShoppingCartGoods,
        totalAmount,
        setTotalAmount,
        result,
        message,
        setResult,
        setMessage
    };
};

export default useShoppingCartGoodsSearch;
