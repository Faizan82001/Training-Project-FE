import React, { useEffect, useState } from 'react';
import { Tabs, Button } from 'antd';
import InactiveUsers from '../inactiveUsers/InactiveUsers';
import InvitedUsers from '../invitedUsers/InvitedUsers';
import ActiveUsers from '../activeUsers/ActiveUsers';
import { Link } from 'react-router-dom';
import './userList.css';
import { useDispatch } from 'react-redux';
import { setActiveKey } from '../../features/sidebar/sidebarSlice';

const items = [
  {
    key: 'active',
    label: `Active Users`,
    children: <ActiveUsers />,
  },
  {
    key: 'invited',
    label: `Invited Users`,
    children: <InvitedUsers />,
  },
  {
    key: 'inactive',
    label: `Inactive Users`,
    children: <InactiveUsers />,
  },
];

const UserList = () => {
  const data = JSON.parse(localStorage.getItem('data'));

  const [currentStatus, setCurrentStatus] = useState('active');
  const dispatch = useDispatch();

  const search = window.location.search;
  const queries = search.split('&');
  let status = 'active';
  let role_id = 0;
  let page = 1;

  if (queries.length === 3) {
    status =
      queries[0].substring(8) === '' ? 'active' : queries[0].substring(8);
    role_id = queries[1].substring(8) === 0 ? '' : queries[1].substring(8);
    page = queries[2].substring(5);
  } else if (queries.length === 2) {
    status =
      queries[0].substring(8) === '' ? 'active' : queries[0].substring(8);
    role_id = queries[1].substring(8) === 0 ? '' : queries[1].substring(8);
  } else if (queries.length === 1 && queries[0] !== '') {
    status =
      queries[0].substring(8) === '' ? 'active' : queries[0].substring(8);
  }

  useEffect(() => {
    window.history.pushState(null, '', '/users');
    setURL(status, role_id, page);
    dispatch(setActiveKey('3'));
  }, []);

  const setURL = (status = 'active', role_id, page = 1) => {
    const queryParam = `?status=${status}&role_id=${role_id}&page=${page}`;
    window.history.pushState(null, '', queryParam);
    setCurrentStatus(status);
  };

  const handleTabClick = (key) => {
    setCurrentStatus(key);
    const queryParam = `?status=${key}&role_id=0&page=1`;
    window.history.pushState(null, '', queryParam);
  };

  if (data.roleId === 1) {
    return (
      <>
        <Tabs
          defaultActiveKey="active"
          items={items}
          onTabClick={handleTabClick}
          destroyInactiveTabPane={true}
          activeKey={currentStatus}
        />
        <div className="createUser">
          <Button type="primary">
            <Link to="/manager/create-user">Create User</Link>
          </Button>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>
          <h2 data-testid="notAuthorized">
            You are not authorized to access this page.
          </h2>
          <Button>
            <Link to="/trip-requests">Go Back to Trip Requests</Link>
          </Button>
        </div>
      </>
    );
  }
};

export default UserList;
