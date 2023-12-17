// Footer.js
import React from 'react';
import styled from 'styled-components';

// Styled components
const FooterContainer = styled.footer`
  background-color: #333333;
  padding: 20px;
  text-align: center;
`;

const FooterColumnsContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const FooterColumn = styled.div`
  flex: 1;
  margin-right: 20px;
`;

const FooterTitle = styled.h4`
  color: white;
  font-size: 18px;
`;

const FooterList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FooterListItem = styled.li`
  margin-bottom: 8px;
`;

const CopyrightText = styled.p`
  margin-top: 20px;
  color: #777;
`;

// Footer component
const Footer = () => {
  return (
    <FooterContainer>
      <FooterColumnsContainer>
        {/* Phần 1: Hỗ trợ khách hàng */}
        <FooterColumn>
          <FooterTitle>Hỗ trợ khách hàng</FooterTitle>
          <FooterList>
            <FooterListItem>FAQ</FooterListItem>
            <FooterListItem>Hướng dẫn đặt hàng</FooterListItem>
            <FooterListItem>Chính sách hoàn trả</FooterListItem>
          </FooterList>
        </FooterColumn>

        {/* Phần 2: Về chúng tôi */}
        <FooterColumn>
          <FooterTitle>Về chúng tôi</FooterTitle>
          <FooterList>
            <FooterListItem>Giới thiệu</FooterListItem>
            <FooterListItem>Chính sách riêng tư</FooterListItem>
            <FooterListItem>Đối tác</FooterListItem>
          </FooterList>
        </FooterColumn>

        {/* Phần 3: Liên hệ với chúng tôi */}
        <FooterColumn>
          <FooterTitle>Liên hệ với chúng tôi</FooterTitle>
          <FooterList>
            <FooterListItem>Email: contact@example.com</FooterListItem>
            <FooterListItem>Điện thoại: (123) 456-7890</FooterListItem>
            <FooterListItem>Địa chỉ: 123 Đường ABC, Thành phố XYZ</FooterListItem>
          </FooterList>
        </FooterColumn>

        {/* Phần 4: Thông tin khác */}
        <FooterColumn>
          <FooterTitle>Thông tin khác</FooterTitle>
          <FooterList>
            <FooterListItem>Điều khoản sử dụng</FooterListItem>
            <FooterListItem>Blog</FooterListItem>
          </FooterList>
        </FooterColumn>
      </FooterColumnsContainer>

      <CopyrightText>&copy; 2023 Tên Của Bạn. Tất cả các quyền được bảo lưu.</CopyrightText>
    </FooterContainer>
  );
};

export default Footer;

