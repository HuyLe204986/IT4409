import { Button, Form, Space, Select } from 'antd'
import React, { useEffect, useRef, useState } from 'react';
import { WrapperHeader, WrapperUploadFile } from './style'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import Loading from '../LoadingComponent/Loading'
import ModalComponent from '../ModalComponent/ModalComponent'
import { convertPrice, getBase64 } from '../../utils'
import * as message from '../Message/Message'
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { EditOutlined, SearchOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { orderContant } from '../../contant'
// import PieChartComponent from './PieChart'

const AdminOrder = () => {
  const user = useSelector((state) => state?.user)
  const initial = () => ({
    isPaid: false,
    isDelivered: false
  })
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState('');
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [stateOrderDetails, setStateOrderDetails] = useState(initial);
  const [form] = Form.useForm();
  const handleDetailsOrder = () => {
    setIsOpenDrawer(true);
  };

  // call API
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = OrderService.updateOrder(id, token, { ...rests });
    return res;
  });
  
  const onUpdateOrder = () => {
    mutationUpdate.mutate(
        { id: rowSelected, token: user?.access_token, ...stateOrderDetails },
        {
            onSettled: () => {
                queryOrder.refetch();
            },
        },
    );
  };

  const {
    data: dataUpdated,
    isPending: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
} = mutationUpdate;

  const fetchGetDetailsOrder = async (rowSelected) => {
    const res = await OrderService.getDetailsOrder(rowSelected);
    if (res?.data) {
        setStateOrderDetails({
            isPaid: res.data.isPaid,
            isDelivered: res.data.isDelivered,
        });
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
  if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsOrder(rowSelected);
  }
  // setIsOpenDrawer(true);
}, [rowSelected, isOpenDrawer]);

  const handleOnChangeDetails = (value, e) => {
    setStateOrderDetails({
        ...stateOrderDetails,
        [e.name]: value,
    });
  };

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return res
  }

  const renderAction = () => {
    return (
        <div>
            <EditOutlined
                style={{ color: 'orange', fontSize: '24px', cursor: 'pointer' }}
                onClick={handleDetailsOrder}
            />
        </div>
    );
};

  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
  const { isPending: isLoadingOrders, data: orders } = queryOrder

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          // ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            // onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        // setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     // <Highlighter
    //     //   highlightStyle={{
    //     //     backgroundColor: '#ffc069',
    //     //     padding: 0,
    //     //   }}
    //     //   searchWords={[searchText]}
    //     //   autoEscape
    //     //   textToHighlight={text ? text.toString() : ''}
    //     // />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: 'User name',
      dataIndex: 'userName',
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps('userName')
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps('address')
    },
    {
      title: 'Paid',
      dataIndex: 'isPaid',
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      ...getColumnSearchProps('isPaid')
    },
    {
      title: 'Delivered',
      dataIndex: 'isDelivered',
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
      ...getColumnSearchProps('isDelivered')
    },
    {
      title: 'Payment method',
      dataIndex: 'paymentMethod',
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      ...getColumnSearchProps('paymentMethod')
    },
    {
      title: 'Total price',
      dataIndex: 'totalPrice',
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
      ...getColumnSearchProps('totalPrice')
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction,
    },
  ];

  const dataTable = orders?.data?.length && orders?.data?.map((order) => {
    //console.log('usewr', order)
    return { ...order, key: order._id, userName: order?.fullName, phone: order?.phone, address: order?.address, paymentMethod: orderContant.payment[order?.paymentMethod],isPaid: order?.isPaid ? 'TRUE' :'FALSE',isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE', totalPrice: convertPrice(order?.totalPrice)}


  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateOrderDetails({
        isPaid: false,
        isDelivered:false
    });
    form.resetFields();
  };

  useEffect(() => {
      if (isSuccessUpdated && dataUpdated?.status === 'OK') {
          message.success();
          handleCloseDrawer();
      } else if (isErrorUpdated) {
          message.error();
      }
  }, [isSuccessUpdated]);

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      {/* <div style={{height: 200, width:200}}>
        <PieChartComponent data={orders?.data} />
      </div> */}
      <div style={{ marginTop: '20px' }}>
        <TableComponent  columns={columns} isLoading={isLoadingOrders} data={dataTable} />
        <DrawerComponent 
                title="Thông tin đơn hàng"
                isOpen={isOpenDrawer}
                onClose={() => setIsOpenDrawer(false)}
                width="70%"
        >
          <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{
                span: 2,
            }}
            wrapperCol={{
                span: 22,
            }}
            onFinish={onUpdateOrder}
            autoComplete="on"
            form={form}
          >
                <Form.Item
                    label="Paid"
                    name="isPaid"
                    rules={[
                        {
                            required: true,
                            message: 'Please input payment status!',
                        },
                    ]}
                >
                    <Select
                        value={stateOrderDetails.isPaid}
                        onChange={(value, option) => handleOnChangeDetails(value, {name: "isPaid"})}
                        options= {[
                          {
                            value: true,
                            label: "True"
                          },
                          {
                            value: false,
                            label: "False"
                          }
                        ]}
                        name="isPaid"
                    />
                </Form.Item>
                <Form.Item
                    label="Delivered"
                    name="isDelivered"
                    rules={[
                        {
                            required: true,
                            message: 'Please input delivery status!',
                        },
                    ]}
                >
                    <Select
                        value={stateOrderDetails.isDelivered}
                        onChange={(value, option) => handleOnChangeDetails(value, {name: "isDelivered"})}
                        options= {[
                          {
                            value: true,
                            label: "True"
                          },
                          {
                            value: false,
                            label: "False"
                          }
                        ]}
                        name = "isDelivered"
                    />
                </Form.Item>
                <Form.Item
                            wrapperCol={{
                                offset: 20,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                  </Form.Item>
                </Form>
          </Loading>
        </DrawerComponent>
      </div>
    </div>
  )
}

export default AdminOrder