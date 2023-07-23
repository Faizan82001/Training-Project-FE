import { Space, Table, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import {
  setCurrentRunNo,
  setCurrentStatus,
} from '../../features/requestDetails/requestDetailsSlice';
import { toast } from 'react-toastify';
import { getRequests, changeRequestStatus } from '../../utils/getDataFunctions';
import messages from '../../utils/messages.json';
import moment from 'moment';

function NewRequests() {
  const search = window.location.search;
  const queries = search.split('&');
  let page = 1;
  if (queries.length === 4) {
    page = queries[2].substring(5) === '' ? 1 : queries[2].substring(5);
  }
  const [request, setRequest] = useState([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPage] = useState(page);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const data = JSON.parse(localStorage.getItem('data'));

  const handleAssign = async (e) => {
    try {
      const currentRunNo = Number(e.target.parentElement.value);

      const { res, ans } = await changeRequestStatus(currentRunNo);
      if (res.status === 200) {
        setRequest((pre) => {
          return pre.filter((req) => req.runNo !== currentRunNo);
        });
        toast.success(ans.message);
      } else {
        toast.error(ans.message);
      }
    } catch (error) {
      toast.error(messages.GENERAL_ERROR);
    }
  };

  const columns = [
    {
      title: 'Run No.',
      dataIndex: 'runNo',
      key: 'runNo',
      render: (text) => <a>{text}</a>,
      onCell: (record) => {
        return {
          onClick: () => {
            dispatch(setCurrentRunNo(record.runNo));
            dispatch(setCurrentStatus(record.status));
            navigate({
              pathname: `/request-details/${record.runNo}`,
              search: `?status=${record.status}&assignee=${null}`,
            });
          },
        };
      },
    },
    {
      title: 'Service type',
      dataIndex: 'serviceType',
      key: 'serviceType',
    },
    {
      title: 'Patient Name',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Nurse Name',
      dataIndex: 'nurseName',
      key: 'nurseName',
    },
    {
      title: 'Date & Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
    },

    {
      title: 'Action',
      key: 'action',
      render: (records) => (
        <Space size="middle">
          <Button
            type="link"
            id="assignBtn"
            onClick={handleAssign}
            value={records.runNo}
            data-testid={`assignBtn${records.runNo}`}
          >
            Assign to me
          </Button>
        </Space>
      ),
    },
  ];

  let updatedColumns = columns;
  if (data.roleId === 1) {
    updatedColumns = columns.filter((column) => {
      return column.title !== 'Action';
    });
  }

  const handlePagination = async (page) => {
    setPage(page);
    setLoading(true);
    const { ans, res } = await getRequests(token, null, null, page);

    setTotalRequests(ans.requestCount);
    fetchApi(ans, res);
    setURL(page);
  };

  const setURL = (page = 1) => {
    const queryParam = `?key=1&status=all&page=${page}&myRequest=false`;
    window.history.pushState(null, '', queryParam);
  };

  const fetchApi = (ans, res) => {
    setTotalRequests(ans.requestCount);
    if (res.status === 200) {
      ans?.data?.map((trip) => {
        trip.nurseName = trip['creator_data.nurseName'];
        trip.key = trip.runNo;
        trip.dateTime = moment(trip.createdAt).format('h:mm A, MMMM D, YYYY');
        return trip;
      });
      setRequest(ans.data);
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(ans.data);
    }
  };

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const { ans, res } = await getRequests(token, '', '', pageNo);
      fetchApi(ans, res);
    }
    fetch();
  }, []);

  return (
    <>
      <Table
        data-testid="new-requests-table"
        columns={updatedColumns}
        dataSource={request}
        loading={loading}
        pagination={{
          pageSize: 10,
          total: totalRequests,
          onChange: handlePagination,
          current: parseInt(pageNo),
        }}
      />
    </>
  );
}

export default NewRequests;
