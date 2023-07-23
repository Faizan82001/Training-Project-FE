import React from 'react';
import {
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, theme, Button, Avatar, Dropdown } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { toggle } from '../../features/sidebar/sidebarSlice.js';
import LogoutButton from '../logout/LogoutButton.jsx';
import ChangePasswordButton from '../changePasswordButton/ChangePasswordButton.jsx';
import NotificationButton from '../notificationButton/notificationButton.jsx';
import './headerComponent.css';
const { Header } = Layout;

const HeaderComponent = () => {
  const collapsed = useSelector((state) => state.collapsed.value);
  const dispatch = useDispatch();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const data = JSON.parse(localStorage.getItem('data'));

  const UserNameDiv = () => {
    const userName = `${data.firstName} ${data.lastName}`;
    return <div className="userType">{`${userName}`}</div>;
  };
  const items = [
    {
      label: <UserNameDiv />,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: '1',
      icon: <ChangePasswordButton />,
    },
    {
      key: '2',
      icon: <LogoutButton />,
    },
  ];
  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
        boxShadow: '0 1px 9px gray',
      }}
    >
      <div className="menuWrapper">
        <Button
          data-testid="toggle"
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => dispatch(toggle())}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
        <div className="actions">
          {data.roleId === 1 ? <></> : <NotificationButton />}
          <div>
            <Dropdown
              menu={{
                items,
              }}
              trigger={['click']}
              align={{ offset: [0, 19] }}
              overlayClassName="header-dropdown dropdown"
            >
              <div className="avatar-container" data-testid="avatar-dropdown">
                <Avatar
                  style={{
                    backgroundColor: '#d3d3d3',
                    color: '#173066',
                    cursor: 'pointer',
                    margin: '0rem 0.2rem 0rem 0.8rem',
                    height: '4vh',
                    width: '4vh',
                    minHeight: '40px',
                    minWidth: '40px',
                    maxHeight: '45px',
                    maxWidth: '45px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {data.firstName.substring(0, 1) +
                    data.lastName.substring(0, 1)}
                </Avatar>
                <DownOutlined
                  style={{
                    cursor: 'pointer',
                  }}
                />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </Header>
  );
};
export default HeaderComponent;
