// Footer.js
import { Col, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
import {FacebookOutlined, YoutubeOutlined, InstagramOutlined, LinkedinFilled} from '@ant-design/icons';
import QRCode from '../../assets/images/QRcode.jpg';
import AppStore from '../../assets/images/AppStore.jpg';
import GGplay from '../../assets/images/GGplay.jpg';

const FooterList = styled.ul`
  padding-left: 0;
  list-style: none;
`
const FooterItemLink = styled.a`
  display: block;
  text-decoration: none;
  font-size: 1.2rem;
  color: #737373;
  padding: 4px 0;
  display: flex;
  align-items: center;

  &:hover {
    color: rgb(22, 156, 44);
    ;
  }
`

const FooterDownloadApp = styled.div`
  flex: 1;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const FooterText = styled.p`
  margin: 0;
  text-align: center;
  font-size: 1.2rem;
  color: #737373;
`

// Footer component
const Footer = () => {
  return (
    <footer style={{ paddingTop: '16px', borderTop: '4px solid rgb(22, 156, 44)'}}>
      <div style={{display: 'flex', justifyContent: 'center'}}>
      <Row style={{width: '1270px', alignItems: 'center'}}>
        <Col span={6}>
          <h3 style={{fontSize: '14px', textTransform: 'uppercase', color: '#333'}}>Chăm sóc khách hàng</h3>
          <FooterList>
            <li><FooterItemLink href="">Trung tâm trợ giúp</FooterItemLink></li>
            <li><FooterItemLink href="">Shop công nghệ Blog</FooterItemLink></li>
            <li><FooterItemLink href="">Hướng dẫn mua hàng</FooterItemLink></li>
            <li><FooterItemLink href="">Chính sách bảo hành</FooterItemLink></li>
          </FooterList>
        </Col>
        <Col span={6}>
          <h3 style={{fontSize: '14px', textTransform: 'uppercase', color: '#333'}}>Giới thiệu</h3>
          <FooterList>
            <li><FooterItemLink href="">Giới thiệu về shop</FooterItemLink></li>
            <li><FooterItemLink href="">Tuyển dụng</FooterItemLink></li>
            <li><FooterItemLink href="">Điều khoản</FooterItemLink></li>
            <li><FooterItemLink href="">Flash sales</FooterItemLink></li>
          </FooterList>
        </Col>
        <Col span={6}>
          <h3 style={{fontSize: '14px', textTransform: 'uppercase', color: '#333'}}>Theo dõi</h3>
          <FooterList>
            <li>
              <FooterItemLink href="">
              <FacebookOutlined style={{fontSize: '16px', margin: '-2px 8px 0 0'}}/>
                Facebook
              </FooterItemLink>
            </li>
            <li>
              <FooterItemLink href="">
                <InstagramOutlined style={{fontSize: '16px', margin: '-2px 8px 0 0'}}/>
                Instagram
              </FooterItemLink>
            </li>
            <li>
              <FooterItemLink href="">
                <LinkedinFilled style={{fontSize: '16px', margin: '-2px 8px 0 0'}}/>
                Linkedln
                </FooterItemLink>
            </li>
            <li>
              <FooterItemLink href="">
                <YoutubeOutlined style={{fontSize: '16px', margin: '-2px 8px 0 0'}}/>
                Youtube
              </FooterItemLink>
            </li>
          </FooterList>
        </Col>
        <Col span={6}>
          <h3 style={{fontSize: '14px', textTransform: 'uppercase', color: '#333'}}>
            Vào cửa hàng trên ứng dụng
          </h3>
          <div style={{display: 'flex'}}>
            <img src={QRCode} alt="qr-code" style={{width: '80px', objectFit: 'contain', border: '1px solid #dbdbdb'}}/>
            <FooterDownloadApp>
              <a href="" style={{color: 'transparent', textDecoration: 'none'}}>
                <img src={GGplay} alt="" style={{height: '16px'}}/>
              </a>
              <a href="">
                <img src={AppStore} alt="" style={{height: '16px'}}/>
              </a>
            </FooterDownloadApp>
          </div>
        </Col>
      </Row>
      </div>
      <div style={{padding: '8px 0', backgroundColor: '#f5f5f5', marginTop: '36px'}}>
        <div>
            <FooterText>2023 - Bản quyền thuộc về Đại học Bách Khoa Hà Nội</FooterText>
        </div>
      </div>
    </footer>
  );
};

export default Footer;