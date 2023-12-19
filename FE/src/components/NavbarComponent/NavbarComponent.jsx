import React, { useState } from 'react';
import { WrapperContent, WrapperLabelText, WrapperTextPrice, WrapperTextValue } from './style';
import { Button, Radio, Rate } from 'antd';

const NavbarComponent = ({onChangeSort, onChangeStar, onChangePrice, onRemoveOption}) => {
    const [selectedStar, setSelectedStar] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const onChange = (e) => {
        setSelectedOption(e.target.value)
        onChangeSort(e.target.value);
    };
    const handleStarClick = (value) => {
        setSelectedStar(value)
        onChangeStar(value); 
    };
    const handlePriceClick = (value) => {
        setSelectedPrice(value);
        onChangePrice(value)
    }
    const handleRemoveOption  = () => {
        setSelectedStar(null);
        setSelectedPrice(null);
        setSelectedOption(null);
        onRemoveOption(true)
    }
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => {
                    return <WrapperTextValue>{option}</WrapperTextValue>;
                });
            case 'radio':
                return (
                    <Radio.Group
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}
                        value={selectedOption}
                        onChange={onChange}
                    >
                        {options.map((option) => {
                            return (
                                <Radio value={option.value}>{option.label}</Radio>
                            )
                        })}
                    </Radio.Group>
                );
            case 'star': 
                return options.map((option) => {
                        return (
                            <div style={{
                                display: 'flex', 
                                alignItems: 'center' ,
                                cursor: 'pointer',
                                border: selectedStar === option ? '1px solid rgb(26, 148, 255)' : 'unset',
                                padding: '4px', 
                                borderRadius: '6px',
                                width: '160px'
                            }} 
                                onClick={() => handleStarClick(option)}
                            >
                                <Rate style={{fontSize: '12px'}} disabled defaultValue={option} />
                                <span style={{marginLeft: '6px'}}>{`từ ${option} sao`}</span>
                            </div>
                        )
                    })
            case 'price':
                    return options.map((option) => {
                        return (
                            <div style={{
                                cursor: 'pointer',
                                border: selectedPrice === option.value ? '1px solid rgb(26, 148, 255)' : 'unset',
                                padding: '4px', 
                                borderRadius: '6px',
                                width: '170px'
                            }}  
                                onClick={() => handlePriceClick(option.value)}
                            >
                                <WrapperTextPrice>{option.text}</WrapperTextPrice>
                            </div>
                        )
                    })
            default:
                return {};
            }
    };
    return (
        <div>
            <WrapperLabelText>Sắp xếp</WrapperLabelText>
            <WrapperContent>
                {renderContent('radio', [
                    {value: 'asc', label: 'Giá từ thấp đến cao'},
                    {value: 'desc', label: 'Giá từ cao đến thấp'},
                ])}
            </WrapperContent>
            <WrapperLabelText>Đánh giá</WrapperLabelText>
            <WrapperContent>
                {renderContent('star', [5, 4, 3])}
            </WrapperContent>
            <WrapperLabelText>Giá</WrapperLabelText>
            <WrapperContent>
                {renderContent('price', [
                    {
                        value: 1,
                        text: 'Dưới 2.000.000'
                    },
                    {
                        value: 2,
                        text: '2.000.000 -> 5.000.000'
                    },
                    {
                        value: 3,
                        text: '5.000.000 -> 20.000.000'
                    },
                    {
                        value: 4,
                        text: 'Trên 20.000.000'
                    },
                ] )}
            </WrapperContent>
                <Button style={{
                    marginTop: '8px',
                    color: 'rgb(11, 116, 229)',
                    display : selectedOption || selectedPrice || selectedStar ?  'block' : 'none',
                }}
                onClick={handleRemoveOption}
                >Xóa lựa chọn</Button>
            
        </div>
    );
};

export default NavbarComponent;
