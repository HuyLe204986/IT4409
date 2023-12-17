import React from 'react';
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent';
import { useNavigate, useParams } from 'react-router-dom';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    return (
        <div style={{ width: '100%', background: '#efefef'}}>
            <div style={{width: '1270px', height: '100%', margin: '0 auto'}}>
                <h4 style={{padding: '10px 0 4px 0'}}>
                    <span
                        style={{ cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => {
                            navigate('/');
                        }}
                    >
                        Trang chủ 
                    </span>
                    <span> - Chi tiết sản phẩm</span>
                </h4>
                <ProductDetailsComponent idProduct={id} />
            </div>
        </div>
    );
};

export default ProductDetailsPage;
