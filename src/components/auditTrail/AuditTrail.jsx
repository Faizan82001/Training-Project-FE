import React, { useEffect, useState } from 'react';
import { Table, Spin } from 'antd';
import moment from 'moment';
import { toast } from 'react-toastify';
import messages from '../../utils/messages.json';

function AuditTrail() {
  const runNo = window.location.pathname.substring(17);
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([
    {
      key: 0,
      dateTime: '',
      user: '',
      actions: '',
    },
  ]);
  const columns = [
    {
      title: 'Date & Time',
      dataIndex: 'dateTime',
    },
    {
      title: 'User',
      dataIndex: 'user',
    },
    {
      title: 'Actions',
      dataIndex: 'message',
    },
  ];

  const fetchApi = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/audit-trail/list/${runNo}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const ans = await response.json();
      if (response.status === 200) {
        ans?.data?.map((element, index) => {
          element.key = index;
          element.dateTime = moment(element.createdAt).format(
            'h:mm A, MMMM D, YYYY'
          );
          element.user = `${element.firstName} ${element.lastName} (${
            element.roleId === 2 ? 'BA' : 'Nurse'
          })`;
          return element;
        });
        setData(ans.data);
        setLoading(false);
      } else if (response.status === 401) {
        setLoading(false);
        localStorage.clear();
      } else if (response.status === 400) {
        setLoading(false);
        toast.error(ans.message);
      }
    } catch (e) {
      setLoading(false);
      toast.error(messages.GENERAL_ERROR);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const renderData = () => {
    if (data[0].actions === '' && loading === false) {
      return <span className="audit-trail-no-data">No data available</span>;
    }
    return (
      <Table
        rowClassName={() => 'rowClassName1'}
        columns={columns}
        dataSource={data}
        bordered
        size="middle"
        pagination={false}
        sticky
      />
    );
  };

  return (
    <Spin spinning={loading} style={{ height: '60vh' }}>
      <div
        className={
          data[0].actions === ''
            ? '.audit-trail .audit-trail-no-data'
            : 'audit-trail'
        }
        style={{
          background: 'white',
          height: '100%',
          maxHeight: '536px',
          overflow: 'auto',
        }}
      >
        {renderData()}
      </div>
    </Spin>
  );
}

export default AuditTrail;
