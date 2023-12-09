
import React from 'react';
import { WrapperDiscount } from './style';

const DiscountComponent = (props) => {
    const {discount} = props;
    return (
        <WrapperDiscount>
            <div style={{marginTop: '2px'}}>Giảm</div>
            <span>{discount}%</span> 
        </WrapperDiscount>
    );
}

export default DiscountComponent;