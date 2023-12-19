import { Menu } from 'antd'
import React, { useState } from 'react'
import { getItem } from '../../utils';
import { UserOutlined, AppstoreOutlined,ShoppingCartOutlined } from '@ant-design/icons'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminOrder from '../../components/AdminOrder/AdminOrder';
import AdminProduct from '../../components/AdminProduct/AdminProduct';

const AdminPage = () => {
  const items = [
    getItem('Người dùng', 'user', <UserOutlined />),
    getItem('Sản phẩm', 'product', <AppstoreOutlined />),
    getItem('Đơn hàng', 'order', <ShoppingCartOutlined />)
  ];

  const [keySelected, setKeySelected] = useState('')

  const renderPage = (key) => {
    switch (key) {
      case 'user':
        return (
          <AdminUser />
        )
      case 'product':
        return (
          <AdminProduct />
        )
      case 'order':
        return (
          <AdminOrder />
        )
      default:
        return <></>
    }
  }

  const handleOnCLick = ({ key }) => {
    setKeySelected(key)
  }
  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div style={{ display: 'flex', }}>
        <Menu
          mode="inline"
          style={{
            width: 256,
            boxShadow: '1px 1px 2px #ccc',
            height: 'calc(100vh + 130px)'
          }}
          items={items}
          onClick={handleOnCLick}
        />
        <div style={{ flex: 1, padding: '15px' }}>
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  )
}

export default AdminPage