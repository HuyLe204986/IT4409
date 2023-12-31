import React, { useEffect, useState } from 'react'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct,TextName } from './style'
import slider1 from '../../assets/images/slider1.png';
import slider2 from '../../assets/images/slider2.jpg';
import slider3 from '../../assets/images/slider3.jpg';
import slider4 from '../../assets/images/slider4.jpg';
import slider5 from '../../assets/images/slider5.jpg';
import slider6 from '../../assets/images/slider6.png';
import slider7 from '../../assets/images/slider7.jpg';
import slider8 from '../../assets/images/slider8.png';
import slider9 from '../../assets/images/slider9.png';
import slider10 from '../../assets/images/slider10.jpg';
import ad from '../../assets/images/ad.jpg'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
import * as productService from '../../services/ProductService';
import { useQuery } from '@tanstack/react-query'
import Loading from '../../components/LoadingComponent/Loading'
import Footer from '../../components/FooterComponent/FooterComponent'
import { Col, Row, Image } from 'antd'
const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const [limit, setLimit] = useState(6)
    const [loading, setLoading] = useState(false)
    const [typeProducts, setTypeProducts] = useState([])

    const fetchProductAll = async (context) => { // mảng chứa queryKey
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
        const res = await productService.getAllProduct(search, limit);
        return res;   
    }
    
    const fetchAllTypeProduct = async () => {
        const res = await productService.getAllTypeProduct()
        if(res?.status === 'OK') {
          setTypeProducts(res?.data)
        }
    }

    useEffect(() => {
        fetchAllTypeProduct()
      }, [])

    const {isLoading, data: products, isPlaceholderData } = useQuery({
        queryKey: ['product', limit, searchDebounce],
        queryFn: fetchProductAll,
        retry: 3,
        retryDelay: 1000,
        placeholderData: true
    })
    console.log('pro', products);
    // console.log("prev", isPlaceholderData, isLoading);
    return (
        <Loading isLoading={isLoading || loading}>
            <div style={{ width: '1270px', margin: '0 auto' }}>
                <WrapperTypeProduct>
                    {typeProducts.map((item) => {
                        return <TypeProduct  name={item} key={item} />;
                        
                    })}
                    
                </WrapperTypeProduct>
            </div>
            <div className='body' style={{ width: '100%', backgroundColor: '#efefef' }}>
                <div id="container" style={{ margin: '0 auto', width: '1270px', paddingTop: '20px' }}>     
                <Row gutter={[16, 16]}>
                        <Col span={16}>
                            <SliderComponent
                                arrImages={[
                                    slider1,
                                    slider2,
                                    slider3,
                                    slider4,
                                    slider5,
                                    slider6,
                                    slider7,
                                    slider8,
                                    slider9,
                                    slider10,
                                ]}
                            />
                        </Col>
                        <Col span={8}>      
                            <div style={{flex: 1}}><Image height={274} src= {ad}/> </div>

                        </Col>
                    </Row>
                    <WrapperProducts>
                        {products?.data?.map((product) => {
                            return (
                                <CardComponent 
                                    key={product.id}
                                    conutInStock = {product.conutInStock}
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
                            )
                        })}
                    </WrapperProducts>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                        <WrapperButtonMore
                            textButton="Xem thêm"
                            type="outline"
                            styleButton={{
                                border: `1px solid ${products?.total === products?.data?.length ? '#f5f5f5' : '#9255FD'}`,
                                color: `${products?.total === products?.data?.length ? '#f5f5f5' : '#9255FD'}`,
                                width: '240px',
                                height: '38px',
                                borderRadius: '4px',
                            }}
                            disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                            styleTextButton={{fontWeight: 500, color: products?.total === products?.data?.length && '#fff'}}
                            onClick = {() => setLimit((prev) => prev + 6)}
                        />
                    </div>
                </div>
            </div>
        </Loading>
    );
}

export default HomePage 
