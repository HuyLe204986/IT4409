import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
    width: 200px;
    & img {
        height: 200px;
        width: 200px;
    },
    position: relative;
    background-color: ${props => props.disabled ? '#ccc' : '#fff'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'}
`

export const StyleNameProduct = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: rgb(56, 56, 61);
    font-weight: 400;
`

export const WrapperReportText = styled.div`
    font-size: 11px;
    color: rgb(128, 128, 137);
    display: flex;
    align-items: center;
    margin: 6px 0 0px;
`

export const WrapperPriceText = styled.div`
    color: rgb(255, 66, 78);
    font-size: 16px;
    font-weight: 500;
`

export const WrapperDiscountText = styled.span`
    color: rgb(255, 66, 78);
    font-size: 12px;
    font-weight: 500;
`

export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120, 120, 120)
`
export const WrapperFavourite = styled.div`
position: absolute;
top: 0px;
left: -4px;
color: #ee4d2d;
background-color: currentColor;
font-size: 10px;
font-weight: 500;
line-height: 16px;
padding-right: 4px;
border-top-right-radius: 3px;
border-bottom-right-radius: 3px;

&::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -3px;
    border-top: 3px solid currentColor;
    border-left: 3px solid transparent;
    filter: brightness(60%);
}
`