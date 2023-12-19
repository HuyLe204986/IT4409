import { Row, Col, Image, Rate, Button, Empty, Flex } from 'antd';
import React, { useEffect } from 'react';
import {  PlusOutlined, MinusOutlined, GiftOutlined } from '@ant-design/icons';
import {
    WrapperAddressProduct,
    WrapperGiftContent,
    WrapperGiftHeader,
    WrapperGiftItem,
    WrapperInputNumber,
    WrapperOldPriceProduct,
    WrapperPriceProduct,
    WrapperPriceTextProduct,
    WrapperQuanlityProduct,
    WrapperStyleDescProduct,
    WrapperStyleNameProduct,
    WrapperStyleTextSell,
} from './style';
import * as productService from '../../services/ProductService';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { useQueries, useQuery } from '@tanstack/react-query';
import Loading from '../LoadingComponent/Loading';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide';
import { convertPrice, initFacebookSDK } from '../../utils';
import * as message from '../Message/Message'
import * as commentService from '../../services/CommentService'
import InputForm from '../InputForm/InputForm';
import CommentComponent from '../CommentComponent/CommentComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
// import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent';
// import CommentComponent from '../CommentComponent/CommentComponent';

const ProductDetailsComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const user  = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const [errorLimitOrder,setErrorLimitOrder] = useState(false)
    const [comment, setComment] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const onChange = (value) => {
        setNumProduct(Number(value));
    };
    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1];
        if (id) {
            const res = await productService.getDetailsProduct(id);
            return res.data;
        }
    };
    
    const handleChangeCount = (type, limited) => {
        if(type === 'increase') {
            if(!limited) {
                setNumProduct(numProduct + 1)
            }else {
                setErrorLimitOrder(true);
            }
        }else {
            if(!limited) {
                setNumProduct(numProduct - 1)
            }
        }
    }


    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id) 
        if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0) ) {
            setErrorLimitOrder(false)
        }else if (productDetails?.countInStock === 0) {
            setErrorLimitOrder(true)
        }
    },[numProduct])

    useEffect(() => {
        if(order.isSucessOrder) {
            message.success('Đã thêm vào giỏ hàng')
        }
        return () => {
            dispatch(resetOrder())
        }
    }, [order.isSucessOrder])

    const handleAddOrderProduct = () => {
        if(!user?.id) {
            navigate('/sign-in', {state: location?.pathname})
        }else {
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
            if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)){
                dispatch(addOrderProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: numProduct,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?.id,
                        discount: productDetails?.discount,
                        countInstock: productDetails?.countInStock
                    }
                }))
            }else {
                setErrorLimitOrder(true)
            }
            
        }
    }

    const handleBuyProduct = () => {
        if(!user?.phone || !user.address || !user.name) {
            message.error('Vui lòng cập nhật thông tin cá nhân để có thể đặt hàng')
            navigate('/profile-user')
        }else {
            const {id: product, ...rest} = productDetails
            navigate('/payment-now', {
                state: {
                    product,
                    ...rest,
                    amount: numProduct,
                }
            })
        }
    }
    
    const { isLoading, data: productDetails } = useQuery({
        queryKey: ['product-details', idProduct], // id của sản phẩm cần lấy
        queryFn: fetchGetDetailsProduct, 
        enabled: !!idProduct
    });

    const productAfterDiscount = productDetails?.price * (100 - Number(productDetails?.discount)) / 100

    const handleChangeComment = (value) => {
        setComment(value);
    }

    // tạo comments
    const mutation = useMutationHooks(
        data => commentService.addComment(data)
    )

    // const {data, isPending: isLoadingAddComment} = mutation

    const handleAddComment = async () => {
        // console.log('add commnet', comment, productDetails.id, user.email);
        mutation.mutate({productId: productDetails.id, email: user.email, content: comment}, {
            onSettled: () => {
                queryComment.refetch();
            },
        })
        setComment('')
    }


    // get all comments
    const getAllCommentProduct = async () => {
        const res = await commentService.getCommentById(idProduct);
        return res;
    }
    const queryComment = useQuery({ queryKey: ['comment'], queryFn: getAllCommentProduct, enabled: !!idProduct })
    console.log('query comment', queryComment);
    const { isPending: isLoadingComment , data: comments } = queryComment
    // end

    return (
        <Loading isLoading={isLoading | isLoadingComment}>
            <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px', height:'560px', position: 'relative' }}>
                <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                    <Image 
                        src={productDetails?.image} 
                        alt="image-product" 
                        preview={true} />
                </Col>
                <Col span={14} style={{ paddingLeft: '10px' }}>
                    <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                    <WrapperStyleDescProduct>{productDetails?.description}</WrapperStyleDescProduct>
                    <div>
                    <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                        <WrapperStyleTextSell>Đã bán {productDetails?.selled}</WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>{convertPrice(productAfterDiscount)}</WrapperPriceTextProduct>
                        <WrapperOldPriceProduct>{convertPrice(productDetails?.price)}</WrapperOldPriceProduct>
                    </WrapperPriceProduct>
                    <WrapperAddressProduct>
                        <span>Giao đến </span>
                        <span className="address">{user?.address}</span> 
                    </WrapperAddressProduct>
                    {/* <LikeButtonComponent 
                        dataHref= {
                            process.env.REACT_APP_IS_LOCAL 
                            ? "https://developers.facebook.com/docs/plugins/" 
                            : window.location.href
                        }
                    /> */}
                    <div
                        style={{
                            margin: '10px 0 20px',
                            padding: '20px 0',
                            borderTop: '1px solid #e5e5e5',
                            borderBottom: '1px solid #e5e5e5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>Số lượng</div>
                        <WrapperQuanlityProduct>
                            <button style={{ border: 'none', background: 'transparent', cursor:'pointer' }} onClick={() => handleChangeCount('decrease', numProduct === 1)}>
                                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                            <WrapperInputNumber  onChange={onChange} value={numProduct} min={1} max={productDetails?.countInStock} size="small" />
                            <button style={{ border: 'none', background: 'transparent', cursor:'pointer' }} onClick={() => handleChangeCount('increase',  numProduct === productDetails?.countInStock)}>
                                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                        </WrapperQuanlityProduct>
                    </div>
                    {errorLimitOrder && <div style={{color: 'red', display: 'flex', justifyContent: 'flex-end', marginBottom: '8px'}}>Sản phẩm đã hết hàng</div>}
                    <WrapperGiftContent>
                        <WrapperGiftHeader>
                            <GiftOutlined />
                            <span style={{marginLeft: '6px'}}>Quà tặng</span>
                        </WrapperGiftHeader>
                        <WrapperGiftItem>Balo hoặc túi chống sốc</WrapperGiftItem>
                        <WrapperGiftItem>Chuột Bluetooth Rapoo M160 + Bàn di chuột</WrapperGiftItem>
                        <WrapperGiftItem>Giảm 20% khi mua phụ kiện tại Lapvip</WrapperGiftItem>
                        <WrapperGiftItem>Giao máy 30P nội thành, miễn phí vận chuyển toàn quốc</WrapperGiftItem>
                        <WrapperGiftItem>Miễn phí cài đặt phần mềm, vệ sinh máy trong suốt thời gian sử dụng</WrapperGiftItem>
                    </WrapperGiftContent>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'absolute', bottom: 0, right: 0}}>
                        <div>
                            <ButtonComponent
                                size={40}
                                styleButton={{
                                    background: 'rgb(255, 57, 69)',
                                    height: '48px',
                                    width: '220px',
                                    border: 'none',
                                    borderRadius: '4px',
                                }}
                                onClick={handleAddOrderProduct}
                                textButton={'Thêm vào giỏ hàng'}
                                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                            ></ButtonComponent>
                        </div>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: '#fff',
                                height: '48px',
                                width: '220px',
                                border: '1px solid rgb(13, 92, 182)',
                                borderRadius: '4px',
                            }}
                            textButton={'Mua ngay'}
                            onClick={handleBuyProduct}
                            styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}
                        ></ButtonComponent>
                    </div>
                </Col>
                {/* <CommentComponent 
                    dataHref={
                        process.env.REACT_APP_IS_LOCAL 
                        ? "https://developers.facebook.com/docs/plugins/" 
                        : window.location.href
                    } 
                    width="1270"
                /> */}

            </Row>
            <InputForm 
                style={{marginTop: '30px', height: '80px'}} 
                placeholder="Viết bình luận của bạn"
                onChange={handleChangeComment}
                value={comment} 
            />
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}><Button onClick={handleAddComment}>Gửi</Button></div>

            {comments?.data?.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
                <>
                    <div style={{fontSize: '16px', fontWeight: 'bold', margin: '8px 0 24px 0'}}>Bình luận ({comments?.data?.length})</div>
                    {
                        comments?.data?.map((comment) => {
                            return (
                                <CommentComponent 
                                    key={comment.id}
                                    avatar="https://th.bing.com/th/id/OIP.hOiJYsPoj5A0ozax8YgrUgHaHa?w=204&h=204&c=7&r=0&o=5&dpr=1.4&pid=1.7"  
                                    // avatar={comment.avatar} 
                                    name={comment.name}
                                    email={comment.email} 
                                    content={comment.content}>
                                </CommentComponent>
                            )
                        }) 
                    }
                </>
                
            )}
        </Loading>
    );
};

export default ProductDetailsComponent;
