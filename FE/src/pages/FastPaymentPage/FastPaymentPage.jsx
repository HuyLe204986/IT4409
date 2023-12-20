import {Form, Radio } from 'antd'
import React, { useEffect, useState } from 'react'
import { Lable, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style';
import {UserOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { useMemo } from 'react';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'
import { useLocation, useNavigate } from 'react-router-dom';

const FastPaymentPage = () => {
  const location = useLocation();
  const {state} = location;
  let orderItemsSlected = [];
  orderItemsSlected.push(state)

  const user = useSelector((state) => state.user)
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState('fast')
  const [payment, setPayment] = useState('later_money')


  const priceMemo = useMemo(() => {
    const {price, amount} = state
    const result = price * amount
    return result
  },[state])

  const priceDiscountMemo = useMemo(() => {
    const  {price, amount, discount} = state
    const result = price * (discount * amount) / 100
    return result;
  },[state])

  const diliveryPriceMemo = useMemo(() => {
    if(priceMemo > 2000000 && priceMemo < 5000000){
      return 10000
    }else if( priceMemo >= 5000000 ||  orderItemsSlected?.length === 0 ){
      return 0
    }else {
      return 20000
    }
  },[state])

//   const diliveryPriceMemo = useMemo(() => {
//     if (priceMemo >= 20000 && priceMemo < 500000) {
//         return 10000;
//     } else if (priceMemo >= 500000 || order?.orderItemsSlected?.length === 0) {
//         return 0;
//     } else {
//         return 20000;
//     }
// }, [priceMemo]);

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
  },[priceMemo,priceDiscountMemo, diliveryPriceMemo])

  const mutationAddOrder = useMutationHooks(
    (data) => {
      const {
        token,
        ...rests } = data
      const res = OrderService.createOrder(
        { ...rests }, token)
      return res
    },
  )
  console.log('mutation add order', mutationAddOrder);
  const handleAddOrder = () => {
        mutationAddOrder.mutate(
          { 
            token: user?.access_token, 
            orderItems: orderItemsSlected, 
            fullName: user?.name,
            address:user?.address, 
            phone:user?.phone,
            // city: user?.city,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: diliveryPriceMemo,
            totalPrice: totalPriceMemo,
            user: user?.id,
            email: user?.email
          }
        )
  }

  const {data: dataAdd,isPending: isLoadingAddOrder, isSuccess, isError} = mutationAddOrder
  useEffect(() => {
    if (isSuccess && dataAdd?.status === 'OK') {

      message.success('Đặt hàng thành công')
      navigate('/order-success', {
        state: {
          delivery,
          payment,
          orders: orderItemsSlected,
          totalPriceMemo: totalPriceMemo
        }
      })
    } else if (isError) {
      message.error('')
    }
  }, [isSuccess,isError])

  const handleDilivery = (e) => {
    setDelivery(e.target.value)
  }

  const handlePayment = (e) => {
    setPayment(e.target.value)
  }

  return (
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
      <Loading isLoading={isLoadingAddOrder}
        >
        <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
          <h3>Thanh toán</h3>
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            <WrapperLeft>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức giao hàng</Lable>
                  <WrapperRadio onChange={handleDilivery} value={delivery}> 
                    <Radio  value="fast"><span style={{color: '#ea8500', fontWeight: 'bold'}}>FAST</span> Giao hàng tiết kiệm</Radio>
                    <Radio  value="gojek"><span style={{color: '#ea8500', fontWeight: 'bold'}}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức thanh toán</Lable>
                  <WrapperRadio onChange={handlePayment} value={payment}> 
                    <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                    <Radio value="paypal"> Thanh toán tiền bằng paypal</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
            </WrapperLeft>
            <WrapperRight>
            <div style={{ width: '100%' }}>
                    <WrapperInfo>
                        <div style={{padding: '15px 0px'}}>
                            <span style={{fontWeight: 'bold', fontSize: '20px'}}>Thông tin khách hàng </span>
                        </div>
                        <div style={{padding: '5px 0px'}}>
                            <UserOutlined style={{paddingRight: '5px'}}/>
                            <span>Khách hàng: </span>
                            <span style={{ fontWeight: 'bold' }}>{`${user?.name}`} </span>
                        </div>
                        <div style={{padding: '5px 0px'}}>
                            <PhoneOutlined style={{paddingRight: '5px'}}/>
                            <span>Số điện thoại: </span>
                            <span style={{ fontWeight: 'bold' }}>{`${user?.phone}`} </span>
                        </div>
                        <div style={{padding: '5px 0px'}}>
                            <HomeOutlined style={{paddingRight: '5px'}}/>
                            <span>Địa chỉ: </span>
                            <span style={{ fontWeight: 'bold' }}>{`${user?.address}`} </span>
                        </div>
                    </WrapperInfo>
                    <WrapperInfo>
                        <div style={{padding: '15px 0px'}}>
                            <span style={{fontWeight: 'bold', fontSize: '20px'}}>Thông tin thanh toán </span>
                        </div>
                        <div
                            style={{
                                padding: '5px 0px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <span>Giá gốc</span>
                            <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>
                                {convertPrice(priceMemo)}
                            </span>
                        </div>
                        <div
                            style={{
                                padding: '5px 0px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <span>Giảm giá</span>
                            <span
                                style={{ color: '#000', fontSize: '14px', fontWeight: 'bold', margin: '6px 0' }}
                            >{convertPrice(priceDiscountMemo)}</span>
                        </div>
                        <div
                            style={{
                                padding: '5px 0px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <span>Phí giao hàng</span>
                            <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>
                                {convertPrice(diliveryPriceMemo)}
                            </span>
                        </div>
                    </WrapperInfo>
                    <WrapperTotal>
                        <span>Tổng tiền</span>
                        <span style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>
                                {convertPrice(totalPriceMemo)}
                            </span>
                            <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                        </span>
                    </WrapperTotal>
                </div>
              <ButtonComponent
                    onClick={() => handleAddOrder()}
                    size={40}
                    styleButton={{
                        background: 'rgb(255, 57, 69)',
                        height: '48px',
                        width: '320px',
                        border: 'none',
                        borderRadius: '4px'
                    }}
                    textButton={'Đặt hàng'}
                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                ></ButtonComponent>
              {/* )
            } */}
            </WrapperRight>
          </div>
        </div>
      </Loading>
    </div>
  )
}

export default FastPaymentPage