import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
const ButtonInputSearch = (props) => {
    const { 
        size, 
        placeholder, 
        textButton, 
        bordered, 
        bgcInput = '#fff', 
        bgcButton =   '#333333',
        colorButton = '#333333',  
    
    } = props;
    return (
        <div style={{ display: 'flex' }}>
            <InputComponent
                size={size}
                placeholder={placeholder}
                bordered={bordered}
                style={{ borderRadius: '0px', backgroundColor: bgcInput }}
                {...props}
            />
            <ButtonComponent
                size={size}
                icon={<SearchOutlined color={colorButton}/>}
                styleButton={{ backgroundColor: bgcButton, borderRadius: '0px', border: !bordered && 'none' }}
                textButton={textButton}
                styleTextButton={{color: colorButton}}
            >
            </ButtonComponent>
        </div>
    );
};

export default ButtonInputSearch;
