import React from 'react';
import PropTypes from 'prop-types';
import { Space, Table, Button } from 'antd';

// think about the CTA action flow after clicking particular CTA like link or event handler

const UserTable = ({
  data,
  getPaginatedData,
  pageData,
  loading,
  handleCTA,
}) => {
  const search = window.location.search;
  const queries = search.split('&');
  let page = 1;

  if (queries.length === 3) {
    page = +queries[2].substring(5);
  }

  const handleClick = (e) => {
    const email = e.target.parentElement.value;
    handleCTA(email);
  };

  const getCTA = (record) => {
    let cta;
    switch (record.status) {
      case 'active':
        cta = 'deactivate';
        break;
      case 'inactive':
        cta = 'activate';
        break;
      case 'invited':
        cta = 'invite again';
        break;
      default:
        break;
    }
    return cta;
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={handleClick}
            value={record.email}
            data-testid="cta-btn"
          >
            {getCTA(record)}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: pageData.limit,
          current: parseInt(page),
          total: pageData.totalCount, //for sake of testing set 5 pages
          onChange: (page) => {
            getPaginatedData(page);
          },
        }}
      />
    </>
  );
};

UserTable.propTypes = {
  data: PropTypes.array,
  getPaginatedData: PropTypes.func,
  pageData: PropTypes.object,
  loading: PropTypes.bool,
  handleCTA: PropTypes.func,
};

export default UserTable;
