import styled from "styled-components";
export const WrapperDiscount = styled.div` 
    font-size: 10px;
    color: #fff;
    position: absolute;
    right: -1px;
    top: -1px;
    width: 40px;
    height: 36px;
    text-align: center;
    background-color: #ee4d2d;
    border-top-right-radius: 2px;

    &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -4px;
        border-width: 0 20px 4px;
        border-style: solid;
        color: #ee4d2d;
        border-color: transparent currentColor transparent currentColor;
    }
`