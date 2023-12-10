import React, { useEffect, useState } from 'react'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct,TextName } from './style'
import slider1 from '../../assets/images/slider1.webp'
import slider2 from '../../assets/images/slider2.webp'
import slider3 from '../../assets/images/slider3.webp'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
import * as productService from '../../services/ProductService';
import { useQuery } from '@tanstack/react-query'
import Loading from '../../components/LoadingComponent/Loading'
import Footer from '../../components/FooterComponent/FooterComponent'
const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const [limit, setLimit] = useState(6)
    const [loading, setLoading] = useState(false)
    const [typeProducts, setTypeProducts] = useState([])

    const fetchProductAll = async (context) => {
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
            <div style={{ width: '100%', margin: '0 auto',backgroundColor: '#333333' }}>
                <WrapperTypeProduct>
                    {typeProducts.map((item) => {
                        return <TypeProduct  name={item} key={item} />;
                        
                    })}
                    
                </WrapperTypeProduct>
            </div>
            <div className='body' style={{ width: '100%', backgroundColor: '#efefef' }}>
                <div style={{ display:'flex',marginLeft: '62px ', width: '100%'}}>
                    <div class='right' style={{display: 'block', width: '55%'}}>
                    <SliderComponent
                        arrImages={[
                            slider1,
                            slider2,
                            slider3,
                        ]}
                    />
                    </div>
                    <div class='left' style={{display:'block',paddingTop:'20px',flex: 1, marginLeft: '60px'}}>
                    <div class="new" style={{padding:'10px',backgroundColor:'green'}} >
                        <div class="title"style={{display:'block',boxSizing:'border-box'}}>
                            <span class="name"style={{fontSize:'20px'}}>TIN CÔNG NGHỆ NỔI BẬT</span>
                            <a href="#" style={{marginLeft:'50px',display: 'inline-block',color:'green' }}>Xem Tất Cả</a>
                        </div>
                        <div class="new-list">
                            <div class="new">
                            <div class="thumbnail">
                                 <a href="" class="wrap-img">
<img class="owl-lazy lazy" src="https://lapvip.vn/upload/news/thumb_77x55/bat-mi-cach-su-dung-surface-lau-hon-khi-pin-yeu-1616999503.jpg" alt="Bật mí cách sử dụng Surface lâu hơn khi pin yếu"></img>
</a></div>
                             <a href="" class="name"> <span>Bật mí cách sử dụng Surface lâu hơn khi pin yếu</span>
</a>

                            </div>

                        </div>
                    </div>
                         </div>
                     
                </div>
                <div id="container" style={{ margin: '0 auto', width: '1270px' }}>    
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
