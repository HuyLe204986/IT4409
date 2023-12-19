import { Button, Space, Select } from 'antd'
import React, { useEffect, useState } from 'react';
import { WrapperHeader} from './style'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { convertPrice} from '../../utils'
import * as message from '../Message/Message'
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { SearchOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { orderContant } from '../../contant'


const AdminOrder = () => {
  const user = useSelector((state) => state?.user)
  const initial = () => ({
    isPaid: false,
    isDelivered: false
  })
  const [rowSelected, setRowSelected] = useState('');
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isSendingData, setIsSendingData] = useState(false);
  const [stateOrderDetails, setStateOrderDetails] = useState(initial);

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
            isPaid: res?.data?.isPaid,
            isDelivered: res?.data?.isDelivered,
        });
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
  if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetDetailsOrder(rowSelected);
  }
}, [rowSelected]);

  const handleOnChangeDetails = (value, e) => {
    setStateOrderDetails({
        ...stateOrderDetails,
        [e.name]: value,
    });
    setIsSendingData(true);
  };

  
  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return res;
  }


  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
  const { isPending: isLoadingOrders, data: orders } = queryOrder
  console.log('que', queryOrder);
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
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
      }
    },
  });

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'userName',
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps('userName')
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps('address')
    },
    {
      title: 'Tình trạng thanh toán',
      dataIndex: 'isPaid',
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      ...getColumnSearchProps('isPaid')
    },
    {
      title: 'Tình trạng giao hàng',
      dataIndex: 'isDelivered',
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
      ...getColumnSearchProps('isDelivered')
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      ...getColumnSearchProps('paymentMethod')
    },
    {
      title: 'Tổng giá tiền',
      dataIndex: 'totalPrice',
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
      ...getColumnSearchProps('totalPrice')
    },
  ];

  const dataTable = orders?.data?.length && orders?.data?.map((order) => {
    return { ...order,
      key: order._id,
      userName: order?.fullName,
      phone: order?.phone,
      address: order?.address,
      paymentMethod: orderContant.payment[order?.paymentMethod],
      isPaid: <Select
          value= {order?.isPaid}
          onChange={ (value, option) => {
            handleOnChangeDetails(value, {name: "isPaid"});
          }}
          options= {[
          {
          value: true,
          label: "Đã thanh toán"
          },
          {
          value: false,
          label: "Chưa thanh toán"
          }
        ]}
      name="isPaid"
      />,
      isDelivered:<Select
      value={order?.isDelivered}
      onChange={(value, option) => {
        handleOnChangeDetails(value, {name: "isDelivered"});
      }}
      options= {[
        {
          value: true,
          label: "Giao hàng thành công"
        },
        {
          value: false,
          label: "Chưa giao hàng"
        }
      ]}
      name = "isDelivered"
    />,
      totalPrice: convertPrice(order?.totalPrice)}
  })

  useEffect(() => {
      if (isSuccessUpdated && dataUpdated?.status === 'OK') {
          message.success();
      } else if (isErrorUpdated) {  
          message.error();
      }
  }, [isSuccessUpdated]);

  useEffect(() => {
    if (isSendingData){
      onUpdateOrder();
      setIsSendingData(false);
    }
  }, [stateOrderDetails]);

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      {/* <div style={{height: 200, width:200}}>
        <PieChartComponent data={orders?.data} />
      </div> */}
      <div style={{ marginTop: '20px' }}>
        <TableComponent  columns={columns} isLoading={isLoadingOrders} data={dataTable} 
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setRowSelected(record.id);
                            },
                        };
                    }}/>
      </div>
    </div>
  )
};
export default AdminOrder;