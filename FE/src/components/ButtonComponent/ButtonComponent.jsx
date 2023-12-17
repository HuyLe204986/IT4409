import { Button } from "antd";
import React from "react";

const ButtonComponent = ({size, styleButton, styleTextButton, textButton, disabled, ...rests}) => {
    return (
        <Button
            style={{
                ...styleButton,
                background: disabled ? '#333333' : styleButton.background
            }}
            size={size}
            {...rests}
            // icon={<SearchOutlined color={colorButton}/>}
        >
            <span style={styleTextButton}>{textButton}</span>
        </Button>
    )
}

export default ButtonComponent