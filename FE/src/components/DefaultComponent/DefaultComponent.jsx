import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import FooterComponent from "../FooterComponent/FooterComponent"
const DefaultComponent = ({children, footer}) => {
    console.log('isshow', footer);
    return (
        <div>
            <HeaderComponent />
            {children}
            {footer && <FooterComponent />}
        </div>
    )
}

export default DefaultComponent