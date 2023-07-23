import React from 'react';
import { Layout, theme } from 'antd';
const { Footer } = Layout;

const FooterComponent = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Footer
      style={{
        background: colorBgContainer,
        textAlign: 'center',
        boxShadow: '0px 0px 10px 0px #7d7d7d',
      }}
    >
      Medical Data Innovations &copy; 2023
    </Footer>
  );
};

export default FooterComponent;
