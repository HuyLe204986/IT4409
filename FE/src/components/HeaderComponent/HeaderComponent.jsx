import { Badge, Col, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from './style';
// import Search from 'antd/es/input/Search';
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as userService  from "../../services/UserService";
import { resetUser } from '../../redux/slides/userSlide';
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/slides/productSlide';

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const order = useSelector((state) => state.order)
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [search,setSearch] = useState('')
    const [isOpenPopup,setIsOpenPopup] = useState(false)
    const handleNavigateLogin = () => {
        navigate('/sign-in');
    };
    const handleLogout = async () => {
        setLoading(true);
        await userService.logOutUser();
        dispatch(resetUser())
        setLoading(false);
        navigate('/sign-in')
    }

    useEffect(() => {
        setLoading(true);
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false);
    }, [user?.name, user?.avatar])

    const content = (
        <div>
            <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
            <WrapperContentPopup onClick={() => handleClickNavigate('my-order')}>Đơn hàng của tôi</WrapperContentPopup>
            {user?.isAdmin && (
                <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lý hệ thống</WrapperContentPopup>
            )}
            <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
        </div>
    );

    const handleClickNavigate = (type) => {
        if(type === 'profile') {
          navigate('/profile-user')
        }else if(type === 'admin') {
          navigate('/system/admin')
        }else if(type === 'my-order') {
          navigate('/my-order',{ state : {
              id: user?.id,
              token : user?.access_token
            }
          })
        }else {
          handleLogout()
        }
        setIsOpenPopup(false)
    }

    const onSearch = (e) => {
        setSearch(e.target.value)
        dispatch(searchProduct(e.target.value))
    }

    return (
        <div style={{ width: '100%', display: 'flex', background: '#9255FD', justifyContent: 'center' }}>
            <WrapperHeader style={{justifyContent: isHiddenCart && isHiddenSearch ?  'space-between' : 'unset', background: '#9255FD'}}>
                <Col span={5}>
                    <WrapperTextHeader style={{cursor: 'pointer'}} to='/'>SHOP CONG NGHE</WrapperTextHeader>
                </Col>
                {!isHiddenSearch && (
                    <Col span={13}>
                        <ButtonInputSearch
                            size="large"
                            placeholder="Tìm kiếm sản phẩm"
                            textButton="Tìm kiếm"
                            bordered={false}
                            // allowClear
                            // enterButton="Search"
                            // size="large"
                            onChange={onSearch}
                            bgcButton="#5a20c1"
                        />
                    </Col>
                )}
                <Col span={6} style={{ display: 'flex', gap: '54px', alignItems: 'center' }}>
                    <Loading isLoading={loading}>
                        <WrapperHeaderAccount>
                            {userAvatar ? (
                                <img src={userAvatar} style={{
                                    height: '30px',
                                    width: '30px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }} alt='avatar'/>
                            ): (
                                <UserOutlined style={{ fontSize: '30px' }} />
                            )}
                            {user?.access_token ? (
                                <>
                                    <Popover content={content} trigger="click" open={isOpenPopup}>
                                        <div style={{ cursor: 'pointer',maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => setIsOpenPopup((prev) => !prev)}>{userName?.length ? userName : user?.email}</div>
                                    </Popover>
                                </>
                            ) : (
                                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                                    <WrapperTextHeaderSmall>Đăng nhập/ Đăng ký</WrapperTextHeaderSmall>
                                    <div>
                                        <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                                        <CaretDownOutlined />
                                    </div>
                                </div>
                            )}
                        </WrapperHeaderAccount>
                    </Loading>
                    {!isHiddenCart && (
                        <div onClick={() => navigate('/order')} style={{cursor: 'pointer'}}>
                            <Badge count = {order?.orderItems?.length} size="small">
                                <ShoppingCartOutlined style={{ fontSize: '24px', color: '#fff' }} />
                            </Badge>
                            <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                        </div>
                    )}
                </Col>
            </WrapperHeader>
        </div>
    );
};

export default HeaderComponent;
