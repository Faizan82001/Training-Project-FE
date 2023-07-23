import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import NewRequests from '../newRequests/NewRequests';
import PendingRequests from '../pendingRequests/PendingRequests';
import ApprovedRequests from '../approvedRequests/ApprovedRequests';
import { setActiveKey } from '../../features/sidebar/sidebarSlice';
import { useDispatch } from 'react-redux';

const items = [
  {
    key: '1',
    label: `New Requests`,
    children: <NewRequests />,
  },
  {
    key: '2',
    label: `Pending Requests`,
    children: <PendingRequests />,
  },
  {
    key: '3',
    label: `Approved Requests`,
    children: <ApprovedRequests />,
  },
];

const RequestList = () => {
  const [currentKey, setCurrentKey] = useState('1');
  const dispatch = useDispatch();
  const search = window.location.search;
  const queries = search.split('&');
  let key = '1';
  let status = 'all';
  let page = '1';
  let myRequest = 'false';

  if (queries.length === 4) {
    page =
      queries[2].substring(5) === 'undefined' ? '1' : queries[2].substring(5);
    key = queries[0].substring(5);
    status = queries[1].substring(7) ? queries[1].substring(7) : 'all';
    myRequest =
      queries[3].substring(10) === 'undefined'
        ? 'false'
        : queries[3].substring(10);
  } else if (queries.length === 1 && queries !== ['']) {
    key = queries[0].substring(5) ? queries[0].substring(5) : '1';
  } else if (queries.length === 2) {
    key = queries[0].substring(5) ? queries[0].substring(5) : '1';
    status = queries[1].substring(7) ? queries[1].substring(7) : 'all';
  } else if (queries.length === 3) {
    key = queries[0].substring(5) ? queries[0].substring(5) : '1';
    status = queries[1].substring(7) ? queries[1].substring(7) : 'all';
    page = queries[2].substring(5) === '' ? '1' : queries[2].substring(5);
  }

  useEffect(() => {
    window.history.pushState(null, '', '/trip-requests');
    setURL(key, status, page, myRequest);
    dispatch(setActiveKey('2'));
  }, []);

  const setURL = (key, status, page = 1, myRequest = 'false') => {
    const queryParam = `?key=${key}&status=${status}&page=${page}&myRequest=${myRequest}`;
    window.history.pushState(null, '', queryParam);
    setCurrentKey(key);
  };

  const handleTabClick = (e) => {
    setURL(e, 'all', '1');
    setCurrentKey(e);
  };

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        items={items}
        onTabClick={handleTabClick}
        destroyInactiveTabPane={true}
        activeKey={currentKey}
      />
    </>
  );
};

export default RequestList;
