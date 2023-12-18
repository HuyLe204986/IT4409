import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
    height: 64px !important;
    width: 64px !important;
`
export const WrapperStyleColImage = styled(Col)`
   flex-basis: unset;
   display: flex;
`

export const WrapperStyleNameProduct = styled.h1`
    color: rgb(36, 36, 36);
    font-size: 24px;
    font-weight: 300;
    line-height: 32px;
    word-break: break-word;
`

export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120, 120, 120);
    margin-left: 16px;
`
export const WrapperPriceProduct = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
`

export const WrapperPriceTextProduct = styled.div`
    font-size: 35px;
    font-weight: 500;
    padding: 10px 0;
    color: #ee4d2d;
`

export const WrapperAddressProduct = styled.div`
    span.address {
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    };

    span.change-address {
        color: rgb(11, 116, 299);
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
    }
`
export const WrapperQuanlityProduct = styled.div `
    display: flex;
    gap: 4px;
    align-items: center;
    border-radius: 4px;
    width: 120px;
    border: 1px solid #ccc;

`


export const WrapperInputNumber = styled(InputNumber) `
    &.ant-input-number.ant-input-number-sm {
        width: 60px;
        border-top: none;
        border-bottom: none;
       
        .ant-input-number-handler-wrap {
            display: none !important;
        }
    }

`

export const WrapperOldPriceProduct = styled.div`
    font-size: 18px;
    color: #999;
    text-decoration: line-through;
`

export const WrapperGiftContent = styled.ul`
    border: 1px solid #169c2c;
    border-radius: 10px;
    padding: 20px 25px;
    margin-bottom: 15px;
    position: relative;
    list-style: none;
`

export const WrapperGiftHeader = styled.div`
    display: inline-block;
    background: rgb(22, 156, 44);
    border-radius: 4px;
    padding: 2px 5px;
    text-align: center;
    width: 100px;
    height: 25px;
    color: white;
    position: absolute;
    top: -11px;
    left: 30px;
`

export const WrapperGiftItem = styled.li`
    margin: 6px 0;
`

export const WrapperStyleDescProduct = styled.div`
    margin-bottom: 15px;
`