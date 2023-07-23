import { Radio, Table, Switch, Tooltip } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import {
  setCurrentAssignee,
  setCurrentRunNo,
  setCurrentStatus,
} from '../../features/requestDetails/requestDetailsSlice';
import { toast } from 'react-toastify';
import { getRequests } from '../../utils/getDataFunctions';
import moment from 'moment';

function ApprovedRequests() {
  const data = JSON.parse(localStorage.getItem('data'));
  const token = localStorage.getItem('token');
  const search = window.location.search;
  const str1 = 'true';
  const queries = search.split('&');
  const status =
    queries[1].substring(7) === 'all' ? '' : queries[1].substring(7);
  const thisPage = queries[2].substring(5) === '' ? 1 : queries[2].substring(5);
  let myRequest;

  if (data.roleId === 1 || queries[3].substring(10) === '') {
    myRequest = 'false';
  } else {
    myRequest = queries[3].substring(10);
  }

  const [request, setRequest] = useState([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [radio, setRadio] = useState(status);
  const [toggle, setToggle] = useState(new RegExp(myRequest).test(str1));
  const [pageNo, setPage] = useState(thisPage);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
            dispatch(setCurrentAssignee(record.assignee));
            navigate({
              pathname: `/request-details/${record.runNo}`,
              search: `?status=${record.status}&assignee=${record.assignee}`,
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
      title: 'Assignee',
      dataIndex: 'assigneeName',
      key: 'assigneeName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        if (text === 'Approved with Exception') {
          return (
            <>
              <span>
                {text} &nbsp;
                <Tooltip title={record.exceptionMessage} placement="left">
                  <MessageOutlined
                    style={{ fontSize: '1rem', color: 'black' }}
                  />
                </Tooltip>
              </span>
            </>
          );
        } else {
          return (
            <>
              <span>{text}</span>
            </>
          );
        }
      },
    },
  ];

  const handlePagination = async (page) => {
    setPage(page);
    setLoading(true);
    if (radio === 'Approved') {
      const { ans, res } = await getRequests(
        token,
        'approved',
        'Approved',
        page,
        toggle
      );
      fetchApi(ans, res);
      setURL('3', status, page, data.roleId === '1' ? myRequest : 'false');
    } else if (radio === '') {
      const { ans, res } = await getRequests(
        token,
        'approved',
        '',
        page,
        toggle
      );
      fetchApi(ans, res);
      setURL('3', '', page, data.roleId === '1' ? myRequest : 'false');
    } else if (radio === 'Approved%20with%20Exception') {
      const { ans, res } = await getRequests(
        token,
        'approved',
        'Approved with Exception',
        page,
        toggle
      );
      fetchApi(ans, res);
      setURL(
        '3',
        'Approved with Exception',
        page,
        data.roleId === '1' ? myRequest : 'false'
      );
    }
  };

  const setURL = (key, status, page = 1, request = 'false') => {
    const queryParam = `?key=${key}&status=${status}&page=${page}&myRequest=${request}`;
    window.history.pushState(null, '', queryParam);
  };

  const handleChange = async (e) => {
    setLoading(true);
    setPage(1);
    setRadio(e.target.value);

    if (e.target.value === 'Approved') {
      const { ans, res } = await getRequests(
        token,
        'approved',
        'Approved',
        '',
        toggle
      );
      fetchApi(ans, res);
      setURL('3', e.target.value, 1, data.roleId === '1' ? false : myRequest);
    } else if (e.target.value === '') {
      const { ans, res } = await getRequests(token, 'approved', '', '', toggle);
      fetchApi(ans, res);
      setURL('3', 'all', 1, data.roleId === '1' ? false : myRequest);
    } else if (e.target.value === 'Approved%20with%20Exception') {
      const { ans, res } = await getRequests(
        token,
        'approved',
        'Approved with Exception',
        '',
        toggle
      );
      fetchApi(ans, res);
      setURL('3', e.target.value, 1, data.roleId === '1' ? false : myRequest);
    }
  };

  const fetchApi = (ans, res) => {
    setTotalRequests(ans.paginationData.totalDocs);
    if (res.status === 200) {
      ans.data.map((trip) => {
        trip.nurseName = trip['creator_data.nurseName'];
        trip.key = trip.runNo;
        trip.assigneeName = trip['assignee_data.assigneeName'];
        trip.dateTime = moment(trip.createdAt).format('h:mm A, MMMM D, YYYY');
        return trip;
      });
      setRequest(ans.data);
      setLoading(false);
    } else {
      toast.error(ans.message);
    }
  };

  const onToggle = async (checked) => {
    setLoading(true);
    setPage(1);
    setToggle(checked);
    if (radio === 'Approved') {
      const { ans, res } = await getRequests(
        token,
        'approved',
        'Approved',
        1,
        !toggle
      );
      fetchApi(ans, res);
      setURL('3', 'Approved', 1, !toggle);
    } else if (radio === '') {
      const { ans, res } = await getRequests(token, 'approved', '', 1, !toggle);
      fetchApi(ans, res);
      setURL('3', '', 1, !toggle);
    } else if (radio === 'Approved%20with%20Exception') {
      const { ans, res } = await getRequests(
        token,
        'approved',
        'Approved with Exception',
        1,
        !toggle
      );
      fetchApi(ans, res);
      setURL('3', 'Approved with Exception', 1, !toggle);
    }
  };

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const { ans, res } = await getRequests(
        token,
        'approved',
        status,
        thisPage,
        toggle
      );
      fetchApi(ans, res);
    }
    fetch();
  }, [token]);

  return (
    <>
      {data.roleId === 2 ? (
        <p
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '20%',
            position: 'absolute',
            transform: 'translate(400%, -220%)',
          }}
        >
          My Requests &nbsp;{' '}
          <Switch
            data-testid="toggle"
            style={{ margin: '0 0.7rem' }}
            onChange={onToggle}
            checked={toggle}
          />
        </p>
      ) : (
        <></>
      )}

      <Radio.Group
        defaultValue={`${status}`}
        buttonStyle="solid"
        onChange={handleChange}
        className="buttonGroup"
        data-testid="approved-requests-radio"
      >
        <Radio.Button value="" data-testid="all">
          All
        </Radio.Button>
        <Radio.Button value="Approved" data-testid="approved">
          Approved
        </Radio.Button>
        <Radio.Button value="Approved%20with%20Exception" data-testid="awe">
          Approved with Exception
        </Radio.Button>
      </Radio.Group>
      <Table
        data-testid="approved-requests-table"
        columns={columns}
        dataSource={request}
        loading={loading}
        rowClassName={(record) => {
          if (record.status === 'Approved with Exception') {
            return 'approved-with-exception-row';
          }
        }}
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

export default ApprovedRequests;
