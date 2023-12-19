import React from 'react'
import { Lable, WrapperInfo, WrapperContainer, WrapperValue, WrapperItemOrder, WrapperItemOrderInfo } from './style';
import Loading from '../../components/LoadingComponent/Loading';
import { useLocation } from 'react-router-dom';
import { orderContant } from '../../contant';
import { convertPrice } from '../../utils';


const OrderSucess = () => {
  const location = useLocation()
  const {state} = location
  return (
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
      <Loading isLoading={false}>
        <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
          <h3 style={{padding: '10px 0', color: '#169c2c', fontSize: '30px'}}>Đơn hàng đặt thành công !</h3>
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            <WrapperContainer>
              <WrapperInfo>
                <div>
                  <Lable style={{fontSize: '17px'}}>Phương thức giao hàng</Lable>
                    <WrapperValue>
                      <span style={{color: '#ea8500', fontWeight: 'bold'}}>{orderContant.delivery[state?.delivery]}</span> Giao hàng tiết kiệm
                    </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable style={{fontSize: '17px'}}>Phương thức thanh toán</Lable>
                  <WrapperValue>
                    {orderContant.payment[state?.payment]}
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperItemOrderInfo>
                {state.orders?.map((order) => {
                  return (
                    <WrapperItemOrder key={order?.name}>
                      <div style={{width: '500px', display: 'flex', alignItems: 'center', gap: '10px'}}> 
                        <img src={order.image} style={{width: '77px', height: '79px', objectFit: 'cover'}} alt='product-img'/>
                        <div style={{
                          width: 260,
                          overflow: 'hidden',
                          textOverflow:'ellipsis',
                          whiteSpace:'nowrap'
                        }}><span style={{ fontSize: '17px', color: '#242424' }}>{order?.name}</span></div>
                      </div>
                      <div style={{flex: 1, display: 'flex', alignItems: 'center',gap: '10px', justifyContent:'space-between'}}>
                        <div>
                          <span style={{ fontSize: '17px', color: '#242424' }}>Số lượng: {order?.amount}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '17px', color: '#242424' }}>Giá tiền: {convertPrice(order?.price)}</span>
                        </div>
                      </div>
                    </WrapperItemOrder>
                  )
                })}
              </WrapperItemOrderInfo>
                <div style={{fontWeight: 'bold', fontSize: '25px', color: 'red', display: 'flex', justifyContent: 'flex-end', margin: '8px 18px 0 0'}}>Tổng tiền: {convertPrice(state?.totalPriceMemo)}</div>
            </WrapperContainer>
          </div>
        </div>
      </Loading>
    </div>
  )
}

export default OrderSucess