import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import { Col, Pagination, Row } from 'antd';
import { WrapperNavbar, WrapperProducts } from './style';
import { useLocation } from 'react-router-dom';
import * as productService from '../../services/ProductService';
import { useState } from 'react';
import { useEffect } from 'react';
import Loading from '../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';
const TypeProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchProduct, 500);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [paginate, setPaginate] = useState({
        page: 0,
        limit: 10,
        total: 1,
    });
    const [isFilter, setIsfilter] = useState(false);
    const [sort, setSort] = useState('');
    const [star, setStar] = useState(null);
    const [price, setPrice] = useState(null);
    const [originalProducts, setOriginalProducts] = useState([]);

    const { state } = useLocation();
    const fetchProductType = async (type, page, limit) => {
        setLoading(true);
        const res = await productService.getProductType(type, page, limit);
        console.log('res', res);
        if (res?.status === 'OK') {
            setLoading(false);
            setProducts(res?.data);
            setOriginalProducts(res?.data); // lưu lại bản sao products
            setPaginate({ ...paginate, total: res?.total});
        } else {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (state) {
            fetchProductType(state, paginate.page, paginate.limit);
        }
    }, [state, paginate.page, paginate.limit]);
    const onChange = (current, pageSize) => {
        setPaginate({ ...paginate, page: current - 1, limit: pageSize });
    };

    const filterProducts = (sortCriteria, starCriteria, priceCriteria) => {
        console.log('filter', originalProducts);
        let filteredProducts = [...originalProducts];
        if (sortCriteria === 'asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortCriteria === 'desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        if (starCriteria) {
            filteredProducts = filteredProducts.filter((product) => product.rating >= Number(starCriteria));
            // console.log('fitler start', filteredProducts);
        }

        if (priceCriteria) {
            switch (priceCriteria) {
                case 1:
                    filteredProducts = filteredProducts.filter((product) => product.price * (100 - product.discount) / 100 < 2000000);
                    break;
                case 2:
                    filteredProducts = filteredProducts.filter((product) => product.price * (100 - product.discount) / 100 > 2000000 && product.price * (100 - product.discount) / 100 < 5000000);
                    break;
                case 3:
                    filteredProducts = filteredProducts.filter((product) => product.price * (100 - product.discount) / 100 > 5000000 && product.price * (100 - product.discount) / 100 < 20000000);
                    break;
                case 4:
                    filteredProducts = filteredProducts.filter((product) => product.price * (100 - product.discount) / 100 > 20000000);
                    break;
                default:
                    break;
            }
        }
        setProducts(filteredProducts);
        setIsfilter(true);
    };

    const handleOnChangeSort = (itemSelected) => {
        filterProducts(itemSelected, star, price);
        setSort(itemSelected);
    };

    const handleOnChangeStar = (itemSelected) => {
        filterProducts(sort, itemSelected, price);
        setStar(itemSelected);
    };

    const handleOnChangePrice = (itemSelected) => {
        filterProducts(sort, star, itemSelected);
        setPrice(itemSelected);
    };

    const handleRemoveOption = (isRemoveOption) =>  {
        if (isRemoveOption) {
            setProducts(originalProducts)
            setIsfilter(false)
        }
    }

    return (
        <Loading isLoading={loading}>
            <div style={{ width: '100%', background: '#efefef', height: '100%' }}>
                <div style={{ width: '1270px', margin: '0 auto', height: '100%' }}>
                    <Row style={{ flexWrap: 'nowrap', paddingTop: '10px', height: 'calc(100% - 20px)' }}>
                        <WrapperNavbar span={4}>
                            <NavbarComponent 
                                onChangeSort = {handleOnChangeSort}
                                onChangeStar = {handleOnChangeStar}
                                onChangePrice = {handleOnChangePrice}
                                onRemoveOption = {handleRemoveOption}
                            />
                        </WrapperNavbar>
                        <Col
                            span={20}
                            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                        >
                            <WrapperProducts span={20}>
                                {products?.filter((pro) => {
                                    if (searchDebounce === '') {
                                        return pro;
                                    } else if (pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())) {
                                        return pro;
                                    }
                                }).map((product) => {
                                    return (
                                        <CardComponent
                                            key={product.id}
                                            countInStock={product.countInStock}
                                            description={product.description}
                                            image={product.image}
                                            name={product.name}
                                            price={product.price}
                                            rating={product.rating}
                                            type={product.type}
                                            selled={product.selled}
                                            discount={product.discount}
                                            id={product.id}
                                        />
                                    );
                                })}
                            </WrapperProducts>
                            <Pagination
                                defaultCurrent={paginate?.page + 1}
                                total={isFilter ? products.length : paginate?.total}
                                onChange={onChange}
                                style={{ textAlign: 'center', margin: '10px 0' }}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        </Loading>
    );
};

export default TypeProductPage;
