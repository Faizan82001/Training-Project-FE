import React from 'react';
import { Layout, Menu } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AnalyticsIcon, UserIcon, AmbulanceIcon } from '../icons/icons';
import logo from '../../assets/logo.png';
import './sidebar.css';
import { setActiveKey } from '../../features/sidebar/sidebarSlice';
const { Sider } = Layout;

const Sidebar = () => {
  const data = JSON.parse(localStorage.getItem('data'));
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.collapsed.value);
  const activeKey = useSelector((state) => state.collapsed.activeKey);

  let items = [
    {
      key: '1',
      icon: <AnalyticsIcon />,
      label: 'Analytics',
    },
    {
      key: '2',
      icon: <AmbulanceIcon />,
      label: 'Trip Requests',
    },
    {
      key: '3',
      icon: <UserIcon />,
      label: 'Users',
    },
  ];

  if (token && data.roleId === 2) {
    const filteredItems = items.filter((item) => item.key === '2');
    items = filteredItems;
  }

  const handleClick = (e) => {
    dispatch(setActiveKey(e.key));
    if (e.key === '1') {
      navigate('/analytics');
    } else if (e.key === '2') {
      navigate('/trip-requests?key=1&status=all&page=1&myRequest=false');
    } else if (e.key === '3') {
      navigate({
        pathname: `/users`,
        search: `?status=active&role_id=0&page=1`,
      });
    }
  };
  return (
    <Sider
      style={{
        minHeight: '100vh',
        height: 'auto',
      }}
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        // defaultSelectedKeys={activeKey}
        selectedKeys={[activeKey]}
        onClick={handleClick}
        items={items}
      />
    </Sider>
  );
};

export default Sidebar;
