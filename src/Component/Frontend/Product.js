import React, { useEffect, useState, useCallback, useRef, useContext } from 'react';
import { Button, Form, InputGroup, Badge, Card, FormControl, ListGroup } from 'react-bootstrap';
import { Search, Cart4, HandbagFill } from 'react-bootstrap-icons';
import axios from 'axios';
import CarouselCard from '../Layout/CarouselCard';
import Paginations from '../Layout/Paginations';
import PaginationContext from '../Layout/PaginationContext';
import { AuthContext } from '../Layout/AuthContext';
import useShoppingCartGoodsSearch from '../Layout/ShoppingCartGoodsSearch';
import ScrollToTopButton from '../Layout/ScrollToTopButton';
import useWebState from '../Layout/WebState';

const Product = () => {
    // 參數
    const url = 'http://localhost:8088';
    const formRef = useRef(null); // form ref
    const [totalCount, setTotalCount] = useState(0); // 總筆數
    const [mainPage, setMainPage] = useState(1); // 指定頁數
    const [showPage, setShowPage] = useState(10); // 每頁顯示頁數
    const [prevMainPage, setPrevMainPage] = useState(0); // 前一次指定頁數
    const [prevShowPage, setPrevShowPage] = useState(0); // 前一次顯示頁數
    const [data, setData] = useState([]); // listData
    const { isLoginState } = useContext(AuthContext); // 權限檢查
    const { getShoppingCartGoodsInfo } = useShoppingCartGoodsSearch(); // modal控制
    const { webState } = useWebState();

    // 頁面動作 搜尋產品
    const handlSubmiteGetList = async (event) => {
        event.preventDefault();
        const form = event.target;
        await getList(form);
    };
    // 加入購物車
    const handleSubmitAddShoppingCartGoods = async (event) => {
        event.preventDefault();
        const form = event.target;
        await addShoppingCartGoods(form);
        event.target.goodsQuantity.value = '';
        getShoppingCartGoodsInfo();
    };
    // 搜尋產品 
    const getList = useCallback(async () => {
        const apiUrl = url + '/training/FrontendController/queryGoods';
        const design = './Data/Frontend/Product/ProductGetList.json';
        const form = formRef.current; // form data
        const objform = {
            action: 'List',
            goodsID: '',
            goodsName: form === null ? '' : form.goodsName.value,
            mainPage: mainPage,
            showPage: showPage,
        };
        try {
            const response = await axios.get((webState ? design : apiUrl), objform);
            setTotalCount(response.data.totalCount);
            setData(response.data.goods);
            setMainPage(mainPage === 0 ? 1 : mainPage);
            setShowPage(showPage === 0 ? 10 : showPage);
        } catch (error) {
            if (error.code === 'ERR_NETWORK') {
                console.log('系統未連線');
            } else {
                console.log(error);
            }
        }
    }, [mainPage, showPage, webState]);
    // 加入購物車
    const addShoppingCartGoods = async (event) => {
        const apiUrl = url + '/training/FrontendController/addCartGoods';
        const design = './Data/Frontend/Product/ProductAddShoppingCartGoods.json';
        const objform = {
            buyQuantity: event.elements.goodsQuantity.value,
            goodsID: event.elements.goodsID.value,
        };
        const response = await axios.get((webState ? design : apiUrl), objform).then((rs) => rs.data).catch((error) => { console.log(error); });
        console.log(response);
    };
    // 
    useEffect(() => {
        if (prevMainPage !== mainPage || prevShowPage !== showPage) {
            getList();
            setPrevMainPage(mainPage);
            setPrevShowPage(showPage);
        }
    }, [prevMainPage, mainPage, getList, prevShowPage, showPage]);
    // 
    useEffect(() => {
        window.scrollTo(0, 0); // 網頁滾輪移到最頂
    }, []);

    return (
        <div className="container">
            <ScrollToTopButton />
            <CarouselCard />
            <br />
            <Form onSubmit={handlSubmiteGetList} ref={formRef}>
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="請輸入搜尋商品關鍵字..."
                        aria-label="請輸入搜尋商品關鍵字..."
                        id="goodsName"
                        aria-describedby="basic-addon2"
                    />
                    <Button variant="outline-secondary" type="submit">
                        <Search />
                    </Button>
                </InputGroup>
            </Form>
            <br />
            <div className="row g-4 row-cols-lg-5 row-cols-2 row-cols-md-3 text-center">
                {data.map((goods, index) => (
                    <div className="col" key={index}>
                        <Card className="card-product">
                            <Card.Header as="h6" style={{ fontSize: '0.83rem' }}>{goods.goodsName}</Card.Header>
                            <Card.Body className="text-center">
                                {/* <h1 className="fs-6 ">
                                    <div>{goods.goodsName}</div>
                                </h1> */}
                                <div className="position-relative">
                                    <div className="position-relative">
                                        <img
                                            src={goods.strImagePath.replaceAll('//', '/')}
                                            alt="Grocery Ecommerce Template"
                                            className="mb-3 img-fluid custom-image"
                                        />
                                    </div>
                                </div>
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item>
                                    <div>
                                        <div className="text-dark" style={{ fontSize: '0.83rem' }}>
                                            <span>{'售價 : $' + goods.goodsPrice + '元'}</span>
                                            <span>
                                                {goods.goodsQuantity === 0 ? (
                                                    <div>
                                                        <Badge bg="danger">{'已售完'}</Badge>
                                                    </div>
                                                ) : (
                                                    <span>{'(庫存:' + goods.goodsQuantity + ')'}</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        {isLoginState && goods.goodsQuantity !== 0 && (
                                            <>
                                                <Form onSubmit={handleSubmitAddShoppingCartGoods}>
                                                    <InputGroup className="mb-1">
                                                        <FormControl
                                                            type="number"
                                                            name="goodsQuantity"
                                                            autoComplete="off"
                                                        />
                                                        {/* <Form.Select
                                                        aria-label="Default select example"
                                                        name="goodsQuantity"
                                                        >
                                                        {Array.from(
                                                            { length: goods.goodsQuantity },
                                                            (_, index) => index + 1
                                                        ).map((num) => (
                                                            <option value={num} key={num}>
                                                            {num}
                                                            </option>
                                                        ))}
                                                        </Form.Select> */}
                                                        {/* <ButtonAddShoppingCardGoods /> */}
                                                        <Button
                                                            className="btn btn-primary btn-sm"
                                                            type="submit"
                                                            disabled={goods.totalCount === 0}
                                                        >
                                                            {goods.totalCount === 0 ? (
                                                                <HandbagFill />
                                                            ) : (
                                                                <Cart4 />
                                                            )}
                                                        </Button>
                                                        <input type="hidden" name="goodsID" value={goods.goodsID} />
                                                    </InputGroup>
                                                </Form>
                                            </>
                                        )}
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </div>
                ))}
            </div>

            <br />
            {
                // 總筆數(totalCount)、指定頁數(mainPage)、顯示筆數(showPage)
                totalCount > 0 ? (
                    <PaginationContext.Provider value={{ totalCount: totalCount, mainPage: mainPage, showPage: showPage, setMainPage: setMainPage, setShowPage: setShowPage }}>
                        <Paginations />
                    </PaginationContext.Provider>
                ) : null
            }
        </div>
    );
};

export default Product;
