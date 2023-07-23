import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import HeaderComponent from '../headerComponent/HeaderComponent';
import Sidebar from '../sidebar/Sidebar';
import FooterComponent from '../footerComponent/FooterComponent';
import { useLocation } from 'react-router-dom';

const { Content } = Layout;

const Appwrapper = ({ children }) => {
  const location = useLocation();
  const setPassword = /\/set-password\//;
  const path = location.pathname;

  if (
    path === '/login' ||
    path === '/forgot-password' ||
    setPassword.test(path) ||
    path === '/'
  ) {
    return (
      <Layout>
        <Content style={{ backgroundColor: '#ffffff' }}>{children}</Content>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Sidebar />
        <Layout>
          <HeaderComponent />
          <Content>{children}</Content>
          <FooterComponent />
        </Layout>
      </Layout>
    );
  }
};

Appwrapper.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Appwrapper;
