import { Radio, Space, Table, Switch, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import {
  setCurrentRunNo,
  setCurrentAssignee,
  setCurrentStatus,
} from '../../features/requestDetails/requestDetailsSlice';
import { toast } from 'react-toastify';
import { getRequests, changeRequestStatus } from '../../utils/getDataFunctions';
import messages from '../../utils/messages.json';
import moment from 'moment';

function PendingRequests() {
  const token = localStorage.getItem('token');
  const data = JSON.parse(localStorage.getItem('data'));
  const str1 = 'true';
  const search = window.location.search;
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

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [request, setRequest] = useState([]);
  const [totalRequests, setTotalRequests] = useState('0');
  const [radio, setRadio] = useState(status);
  const [toggle, setToggle] = useState(new RegExp(myRequest).test(str1));
  const [pageNo, setPage] = useState(thisPage);
  const [loading, setLoading] = useState(true);

  const loggedInUserName = `${data.firstName} ${data.lastName}`;

  const handleUnassign = async (e) => {
    try {
      const currentRunNo = Number(e.target.parentElement.value);

      const { res, ans } = await changeRequestStatus(currentRunNo);
      if (res.status === 200) {
        setRequest((pre) => {
          return pre.filter((req) => req.runNo !== currentRunNo);
        });
        toast.success(ans.message);
        dispatch(setCurrentAssignee(''));
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
    },

    {
      title: 'Action',
      key: 'action',
      render: (records) => {
        if (records.assigneeName === loggedInUserName) {
          return (
            <Space size="middle">
              <Button
                type="link"
                onClick={handleUnassign}
                value={records.runNo}
                data-testid={`unAssignBtn${records.runNo}`}
              >
                Unassign request
              </Button>
            </Space>
          );
        }
      },
    },
  ];

  let updatedColumns = columns;
  if (data.roleId === 1) {
    updatedColumns = columns.filter((column) => {
      return column.title !== 'Action';
    });
  }

  const handlePagination = async (page) => {
    setLoading(true);
    setPage(page);
    switch (radio) {
      case 'Request%20more%20Information': {
        const { ans, res } = await getRequests(
          token,
          'pending',
          'Request more Information',
          page,
          toggle
        );
        fetchApi(ans, res);
        setURL('2', 'Request more Information', page, toggle);
        break;
      }

      case '': {
        const { ans, res } = await getRequests(
          token,
          'pending',
          '',
          page,
          toggle
        );
        fetchApi(ans, res);
        setURL('2', '', page, toggle);
        break;
      }
      case 'Assigned%20for%20Review': {
        const { ans, res } = await getRequests(
          token,
          'pending',
          'Assigned for Review',
          page,
          toggle
        );
        fetchApi(ans, res);
        setURL('2', 'Assigned for Review', page, toggle);
        break;
      }
      case 'Data%20Provided': {
        const { ans, res } = await getRequests(
          token,
          'pending',
          'Data Provided',
          page,
          toggle
        );
        fetchApi(ans, res);
        setURL('2', 'Data Provided', page);
        break;
      }
    }
  };

  const setURL = (key, status, page = 1, myRequest = 'false') => {
    const queryParam = `?key=${key}&status=${status}&page=${page}&myRequest=${myRequest}`;
    window.history.pushState(null, '', queryParam);
  };

  const onToggle = async (checked) => {
    setLoading(true);
    setPage('1');
    setToggle(checked);
    switch (radio) {
      case '': {
        const { ans, res } = await getRequests(
          token,
          'pending',
          '',
          '',
          !toggle
        );
        fetchApi(ans, res);
        setURL('2', '', 1, !toggle);
        break;
      }
      case 'Request%20more%20Information': {
        const { ans, res } = await getRequests(
          token,
          'pending',
          'Request more Information',
          '',
          !toggle
        );
        fetchApi(ans, res);
        setURL('2', 'Request more Information', 1, !toggle);
        break;
      }

      case 'Assigned%20for%20Review': {
        const { ans, res } = await getRequests(
          token,
          'pending',
          'Assigned for Review',
          '',
          !toggle
        );
        fetchApi(ans, res);
        setURL('2', 'Assigned for Review', 1, !toggle);
        break;
      }
      case 'Data%20Provided': {
        const { ans, res } = await getRequests(
          token,
          'pending',
          'Data Provided',
          '',
          !toggle
        );
        fetchApi(ans, res);
        setURL('2', 'Data Provided', 1, !toggle);
        break;
      }
    }
  };

  const handleChange = async (e) => {
    setPage('1');
    setLoading(true);
    setRadio(e.target.value);

    switch (e.target.value) {
      case 'Request%20more%20Information': {
        const { ans, res } = await getRequests(
          token,
          'pending',
          e.target.value,
          '',
          toggle
        );
        fetchApi(ans, res);
        setURL('2', e.target.value, 1, data.roleId === '1' ? false : myRequest);
        break;
      }
      case '': {
        const { ans, res } = await getRequests(
          token,
          'pending',
          '',
          '',
          toggle
        );
        fetchApi(ans, res);
        setURL('2', 'all', 1, data.roleId === '1' ? false : myRequest);
        break;
      }
      case 'Assigned%20for%20Review': {
        const { ans, res } = await getRequests(
          token,
          'pending',
          e.target.value,
          '',
          toggle
        );
        fetchApi(ans, res);
        setURL('2', e.target.value, 1, data.roleId === '1' ? false : myRequest);
        break;
      }
      case 'Data%20Provided': {
        const { ans, res } = await getRequests(
          token,
          'pending',
          e.target.value,
          '',
          toggle
        );
        fetchApi(ans, res);
        setURL('2', e.target.value, 1, data.roleId === '1' ? false : myRequest);
        break;
      }
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

  useEffect(() => {
    setLoading(true);
    async function fetch() {
      setLoading(true);
      const { ans, res } = await getRequests(
        token,
        'pending',
        status,
        thisPage,
        toggle
      );
      fetchApi(ans, res);
      setLoading(false);
    }
    fetch();
  }, [token]);

  return (
    <>
      <div>
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
          defaultValue={status}
          buttonStyle="solid"
          onChange={handleChange}
          className="buttonGroup"
          data-testid="pending-requests-radio"
        >
          <Radio.Button data-testid="all" value="">
            All
          </Radio.Button>
          <Radio.Button data-testid="afr" value="Assigned%20for%20Review">
            Assigned for Review
          </Radio.Button>
          <Radio.Button data-testid="rfm" value="Request%20more%20Information">
            Request more Information
          </Radio.Button>
          <Radio.Button data-testid="dp" value="Data%20Provided">
            Data Provided
          </Radio.Button>
        </Radio.Group>
      </div>

      <Table
        data-testid="pending-requests-table"
        columns={updatedColumns}
        dataSource={request}
        loading={loading}
        rowClassName={(record) => {
          if (record.status === 'Data Provided') {
            return 'data-provided-row';
          } else if (record.status === 'Request more Information') {
            return 'request-more-info-row';
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

export default PendingRequests;
