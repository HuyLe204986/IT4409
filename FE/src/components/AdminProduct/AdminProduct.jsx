import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Select, Space, Tooltip } from 'antd';
import { WrapperHeader, WrapperUploadFile } from './style';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import { getBase64, renderOptions } from '../../utils';
import * as productService from '../../services/ProductService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../LoadingComponent/Loading';
import * as message from '../Message/Message';
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { useSelector } from 'react-redux';
import ModalComponent from '../ModalComponent/ModalComponent';
const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    // const [searchText, setSearchText] = useState('');
    // const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const user = useSelector((state) => state?.user);
    // console.log('user', user);
    const inittial = () => ({
        name: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        type: '',
        countInStock: '',
        newType: '',
        discount: '',
      })

    const [stateProduct, setStateProduct] = useState(inittial());

    const [stateProductDetails, setStateProductDetails] = useState(inittial());

    const renderAction = () => {
        return (
            <div>
                <Button
                    style={{color: 'white', cursor: 'pointer', backgroundColor:'#d9534f' }}
                    onClick={() => setIsModalOpenDelete(true)}
                ><DeleteOutlined />Xóa</Button>
                <Button
                    style={{color: 'white',cursor: 'pointer', float:'right',backgroundColor: '#5bc0de'}}
                    onClick={handleDetailsProduct}
                ><EditOutlined />Sửa</Button>
            </div>
        );
    };

    const [form] = Form.useForm();

    // call API
    const mutation = useMutationHooks((data) => {
        const { name, price, description, rating, image, type, countInStock, discount } = data;
        const res = productService.createProduct({
            name,
            price,
            description,
            rating,
            image,
            type,
            countInStock,
            discount,
        }, user.access_token);
        return res;
    });

    // call API
    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = productService.updateProduct(id, token, { ...rests });
        return res;
    });

    const mutationDelete = useMutationHooks((data) => {
        const { id, token } = data;
        const res = productService.deleteProduct(id, token);
        return res;
    });

    const mutationDeletedMany = useMutationHooks((data) => {
        const { token, ...ids } = data;
        const res = productService.deleteManyProduct(ids, token);
        return res;
    });

    const handleDeleteManyProducts = (ids) => {
        mutationDeletedMany.mutate(
            { ids: ids, token: user?.access_token },
            {
                onSettled: () => {
                    queryProduct.refetch();
                    typeProduct.refetch();
                },
            },
        );
    };

    const fetchAllTypeProduct = async () => {
        const res = await productService.getAllTypeProduct();
        return res;
    };

    const { data, isPending, isSuccess, isError } = mutation;
    const {
        data: dataUpdated,
        isPending: isLoadingUpdated,
        isSuccess: isSuccessUpdated,
        isError: isErrorUpdated,
    } = mutationUpdate;
    const {
        data: dataDeleted,
        isPending: isLoadingDeleted,
        isSuccess: isSuccessDeleted,
        isError: isErrorDeleted,
    } = mutationDelete;
    const {
        data: dataDeletedMany,
        isPending: isLoadingDeletedMany,
        isSuccess: isSuccessDeletedMany,
        isError: isErrorDeletedMany,
    } = mutationDeletedMany;

    

    const getAllProducts = async () => {
        const res = await productService.getAllProduct();
        return res;
    };

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await productService.getDetailsProduct(rowSelected);
        if (res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                price: res?.data?.price,
                description: res?.data?.description,
                rating: res?.data?.rating,
                image: res?.data?.image,
                type: res?.data?.type,
                countInStock: res?.data?.countInStock,
                discount: res?.data?.discount,
            });
        }
        setIsLoadingUpdate(false);
    };

    useEffect(() => {
        if(!isModalOpen) {
            form.setFieldsValue(stateProductDetails);
        }else {
            form.setFieldsValue(inittial());
        }
    }, [form, stateProductDetails, isModalOpen]);

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true);
            fetchGetDetailsProduct(rowSelected);
        }
        // setIsOpenDrawer(true);
    }, [rowSelected, isOpenDrawer]);

    const handleDetailsProduct = () => {
        setIsOpenDrawer(true);
    };

    const queryProduct = useQuery({
        queryKey: ['products'],
        queryFn: getAllProducts,
    });
    const typeProduct = useQuery({
        queryKey: ['type-product'],
        queryFn: fetchAllTypeProduct,
    });
    const { isLoading: isLoadingProduct, data: products } = queryProduct;

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // setSearchText(selectedKeys[0]);
        // setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        // setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>

                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Close
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
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
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
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            // render: (text) => <a>{text}</a>,
            ellipsis: {
                showTitle: false,
            },
            render: (name) => (
                <Tooltip placement="topLeft" title={name}>
                    {name}
                </Tooltip>
            ),
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Giá tiền (VND)',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: '>= 50',
                    value: '>=',
                },
                {
                    text: '<= 50',
                    value: '<=',
                },
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.price >= 50;
                }
                return record.price <= 50;
            },
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            filters: [
                {
                    text: '>= 3',
                    value: '>=',
                },
                {
                    text: '<= 3',
                    value: '<=',
                },
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return Number(record.rating) >= 3;
                }
                return Number(record.rating) <= 3;
            },
        },
        {
            title: 'Loại sản phẩm',
            dataIndex: 'type',
        },
        {
            title: 'Số lượng hàng trong kho',
            dataIndex: 'countInStock',
            sorter: (a, b) => a.countInStock - b.countInStock,
            filters: [
                {
                    text: '>=3',
                    value: '>=',
                },
                {
                    text: '<=3',
                    value: '<=',
                },
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return Number(record.countInStock) >= 3;
                }
                return Number(record.countInStock) <= 3;
            },
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            render: renderAction,
        },
    ];
    const dataTable =
        products?.data?.length &&
        products?.data?.map((product) => {
            return {
                ...product,
                key: product.id,
            };
        });

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success();
            handleCancel();
        } else if (isError) {
            message.error();
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success();
            handleCancelDelete();
        } else if (isErrorDeleted) {
            message.error();
        }
    }, [isSuccessDeleted]);

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success();
        } else if (isErrorDeletedMany) {
            message.error();
        }
    }, [isSuccessDeletedMany]);

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleDeleteProduct = () => {
        mutationDelete.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryProduct.refetch();
                    typeProduct.refetch();
                },
            },
        );
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            countInStock: '',
            discount: '',
        });
        form.resetFields();
    };

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateProductDetails({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            countInStock: '',
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

    const onFinish = () => {
        // console.log('finisd');
        const params = {
            name: stateProduct.name,
            price: stateProduct.price,
            description: stateProduct.description,
            rating: stateProduct.rating,
            image: stateProduct.image,
            type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
            countInStock: stateProduct.countInStock,
            discount: stateProduct.discount,
        };
        mutation.mutate(params, {
            onSettled: () => {
                queryProduct.refetch();
                typeProduct.refetch();
            },
        });
    };
    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value,
        });
    };

    const handleOnChangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview,
        });
    };

    const handleOnChangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview,
        });
    };

    const onUpdateProduct = () => {
        mutationUpdate.mutate(
            { id: rowSelected, token: user?.access_token, ...stateProductDetails },
            {
                onSettled: () => {
                    queryProduct.refetch();
                },
            },
        );
    };

    const handleChangeSelect = (value) => {
        setStateProduct({
            ...stateProduct,
            type: value,
        });
    };
    console.log('image-admin product', stateProduct)
    return (
        <div>
            <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <Button
                    style={{borderRadius: '6px', backgroundColor: '#0275d8', color: 'white'}}
                    onClick={() => setIsModalOpen(true)}
                >
                    {/* <PlusOutlined style={{ fontSize: '60px' }} /> */}
                    <PlusOutlined /> Thêm mới sản phẩm 
                </Button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent
                    handleDeleteMany={handleDeleteManyProducts}
                    columns={columns}
                    data={dataTable}
                    isLoading={isLoadingProduct}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                //click row
                                setRowSelected(record.id);
                            },
                        };
                    }}
                />
            </div>
            <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Loading isLoading={isPending}>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 18,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        onFinish={onFinish}
                        form={form}
                    >
                        <Form.Item
                            label="Tên sản phẩm"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên sản phẩm!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProduct.name} onChange={handleOnChange} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Loại sản phẩm"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập loại sản phẩm!',
                                },
                            ]}
                        >
                            <Select
                                name="type"
                                value={stateProduct.type}
                                onChange={handleChangeSelect}
                                options={renderOptions(typeProduct?.data?.data)}
                            />
                        </Form.Item>
                        {stateProduct.type === 'add_type' && (
                            <Form.Item
                                label="Loại mới"
                                name="newType"
                                rules={[{ required: true, message: 'Vui lòng nhập loại sản phẩm!' }]}
                            >
                                <InputComponent value={stateProduct.newType} onChange={handleOnChange} name="newType" />
                            </Form.Item>
                        )}

                        <Form.Item
                            label="Số lượng"
                            name="countInStock"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số lượng!',
                                },
                            ]}
                        >
                            <InputComponent
                                value={stateProduct.countInStock}
                                onChange={handleOnChange}
                                name="countInStock"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Giá tiền"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá tiền!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProduct.price} onChange={handleOnChange} name="price" />
                        </Form.Item>

                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả!',
                                },
                            ]}
                        >
                            <InputComponent
                                value={stateProduct.description}
                                onChange={handleOnChange}
                                name="description"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Đánh giá"
                            name="rating"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập đánh giá!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProduct.rating} onChange={handleOnChange} name="rating" />
                        </Form.Item>

                        <Form.Item
                            label="Giảm giá"
                            name="discount"
                            rules={[{ required: true, message: 'Vui lòng nhập giảm giá!' }]}
                        >
                            <InputComponent value={stateProduct.discount} onChange={handleOnChange} name="discount" />
                        </Form.Item>

                        <Form.Item
                            label="Hình ảnh"
                            name="image"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ảnh!',
                                },
                            ]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                                <Button>Chọn File</Button>
                                {stateProduct?.image && (
                                    <img
                                        src={stateProduct?.image}
                                        style={{
                                            height: '60px',
                                            width: '60px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            marginLeft: '10px',
                                        }}
                                        alt="avatar"
                                    />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 20,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Xác nhận
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>

            <DrawerComponent
                title="Chi tiết sản phẩm"
                isOpen={isOpenDrawer}
                onClose={() => setIsOpenDrawer(false)}
                width="90%"
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
                        onFinish={onUpdateProduct}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Tên sản phẩm"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên sản phẩm!',
                                },
                            ]}
                        >
                            <InputComponent
                                value={stateProductDetails.name}
                                onChange={handleOnChangeDetails}
                                name="name"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Loại sản phẩm"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập loại sản phẩm!',
                                },
                            ]}
                        >
                            <InputComponent
                                value={stateProductDetails.type}
                                onChange={handleOnChangeDetails}
                                name="type"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Số lượng"
                            name="countInStock"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số lượng!',
                                },
                            ]}
                        >
                            <InputComponent
                                value={stateProductDetails.countInStock}
                                onChange={handleOnChangeDetails}
                                name="countInStock"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Giá tiền"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá tiền!',
                                },
                            ]}
                        >
                            <InputComponent
                                value={stateProductDetails.price}
                                onChange={handleOnChangeDetails}
                                name="price"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả sản phẩm!',
                                },
                            ]}
                        >
                            <InputComponent
                                value={stateProductDetails.description}
                                onChange={handleOnChangeDetails}
                                name="description"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Đánh giá"
                            name="rating"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập đánh giá!',
                                },
                            ]}
                        >
                            <InputComponent
                                value={stateProductDetails.rating}
                                onChange={handleOnChangeDetails}
                                name="rating"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Giảm giá"
                            name="discount"
                            rules={[{ required: true, message: 'Vui lòng nhập giảm giá!' }]}
                        >
                            <InputComponent
                                value={stateProductDetails.discount}
                                onChange={handleOnChangeDetails}
                                name="discount"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Hình ảnh"
                            name="image"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ảnh!',
                                },
                            ]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                                <Button>Chọn File</Button>
                                {stateProductDetails?.image && (
                                    <img
                                        src={stateProductDetails?.image}
                                        style={{
                                            height: '60px',
                                            width: '60px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            marginLeft: '10px',
                                        }}
                                        alt="avatar"
                                    />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 20,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Xác nhận
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>

            <ModalComponent
                forceRender
                title="Xóa sản phẩm"
                open={isModalOpenDelete}
                onCancel={handleCancelDelete}
                onOk={handleDeleteProduct}
            >
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có chắc chắn muốn xóa sản phẩm này không?</div>
                </Loading>
            </ModalComponent>
        </div>
    );
};

export default AdminProduct;
