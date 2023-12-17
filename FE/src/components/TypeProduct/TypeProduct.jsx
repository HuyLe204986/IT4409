import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const TypeProduct = ({name}) => {
    const navigate = useNavigate();
    const handleNavigateType = (type) => {
        navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, {state: type})
    }
    return (
        <div style={{padding:"0 20px",marginLeft:"60px", cursor: 'pointer', backgroundcolor: "#333333", color:"white",fontSize: "18px" }} onClick={() => handleNavigateType(name)}>{name}</div>
    )
}

export default TypeProduct