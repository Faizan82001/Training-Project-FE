import { Space, DatePicker, Select, Spin } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import messages from '../../utils/messages.json';
import { toast } from 'react-toastify';
import { getBarGraphData } from '../../utils/getDataFunctions';
import { useDispatch } from 'react-redux';
import { setActiveKey } from '../../features/sidebar/sidebarSlice';
const { RangePicker } = DatePicker;

const PerformanceCounter = () => {
  const [data, setData] = useState([
    {
      name: `Pending Requests`,
      'Pending Requests': 0,
    },
    {
      name: `Approved Requests`,
      'Approved Requests': 0,
    },
    {
      name: `Approved with Exception`,
      'Approved with Exception': 0,
    },
  ]);
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [startDate, setStartDate] = useState(
    moment(endDate).startOf('day').subtract(3, 'months').format('YYYY-MM-DD')
  );
  const [totalCount, setTotalCount] = useState(0);
  const [emailList, setEmailList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    fetchEmailList();
  }, []);

  const handleDate = (e) => {
    setStartDate(moment(e[0].$d).format('YYYY-MM-DD'));
    setEndDate(moment(e[1].$d).format('YYYY-MM-DD'));
  };

  function disabledDate(current) {
    if (current > moment()) {
      return true;
    } else if (current < moment(endDate).subtract(3, 'months')) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    if (id !== '') {
      fetchAPI();
    }
  }, [id, startDate, endDate]);

  const fetchEmailList = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_URL}/api/billing-manager/list-billing-admin`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const ans = await res.json();
      if (res.status === 200) {
        setEmailList(ans.data);
        setId(ans.data[0].id);
      } else if (res.status === 401) {
        localStorage.clear();
        navigate('/login');
      } else if (res.status === 400) {
        toast.error(ans.message);
      }
    } catch (error) {
      toast.error(messages.GENERAL_ERROR);
    }
  };

  const getBillingAdminPerformance = (_, text) => {
    setId(text.key);
  };

  const fetchAPI = async () => {
    try {
      const { res, ans } = await getBarGraphData(token, startDate, endDate, id);

      if (res.status === 200) {
        const updatedData = [
          {
            name: `Pending Requests`,
            'Pending Requests': 0,
          },
          {
            name: `Approved Requests`,
            'Approved Requests': 0,
          },
          {
            name: `Approved with Exception`,
            'Approved with Exception': 0,
          },
        ];
        ans.data.forEach((element) => {
          switch (element.status) {
            case 'Assigned for Review':
              updatedData[0]['Pending Requests'] += element.count;
              break;
            case 'Request more Information':
              updatedData[0]['Pending Requests'] += element.count;
              break;
            case 'Data Provided':
              updatedData[0]['Pending Requests'] += element.count;
              break;
            case 'Approved':
              updatedData[1]['Approved Requests'] = element.count;
              break;
            case 'Approved with Exception':
              updatedData[2]['Approved with Exception'] = element.count;
              break;
            default:
              return 0;
          }
        });
        setLoading(false);
        setTotalCount(ans.totalCount);
        setData(updatedData);
      } else if (res.status === 400) {
        toast.error(ans.message);
      } else if (res.status === 401) {
        navigate('/login');
      }
    } catch (e) {
      toast.error(messages.GENERAL_ERROR);
    }
  };

  const handleClick = (e) => {
    dispatch(setActiveKey('2'));
    switch (e.name) {
      case 'Pending Requests':
        navigate('/trip-requests?key=2&status=all&page=1&myRequest=false');
        break;
      case 'Approved Requests':
        navigate('/trip-requests?key=3&status=Approved&page=1&myRequest=false');
        break;
      case 'Approved with Exception':
        navigate(
          '/trip-requests?key=3&status=Approved%20with%20Exception&page=1&myRequest=false'
        );
        break;
      default:
        return 0;
    }
  };

  const defaultValue = () => {
    return emailList.length === 0 ? 'default' : emailList[0].email;
  };

  const renderData = () => {
    if (totalCount === 0 && loading === false) {
      return <div className="no-data">No data available</div>;
    } else {
      return (
        <BarChart width={600} height={530} data={data} className="graph">
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={<CustomTooltip />} />
          <XAxis dataKey="name" />
          <YAxis
            label={{
              value: 'Trips',
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Bar
            barSize={70}
            dataKey="Pending Requests"
            stackId="a"
            fill="#71dee0"
            onClick={handleClick}
            isAnimationActive={false}
            label={<CustomizedLabel />}
            cursor="pointer"
          />
          <Bar
            barSize={70}
            dataKey="Approved Requests"
            stackId="a"
            fill="#f2ae2b"
            onClick={handleClick}
            isAnimationActive={false}
            label={<CustomizedLabel />}
            cursor="pointer"
          />
          <Bar
            barSize={70}
            dataKey="Approved with Exception"
            stackId="a"
            fill="#e86852"
            onClick={handleClick}
            isAnimationActive={false}
            label={<CustomizedLabel />}
            cursor="pointer"
          />
        </BarChart>
      );
    }
  };

  return (
    <Spin spinning={loading} style={{ position: 'inherit' }}>
      <div className="performance-counter-container">
        <div className="date-picker-container">
          <Space
            direction="vertical"
            size={12}
            style={{
              flexDirection: 'column',
              display: 'flex',
              justifyContent: 'flex-end',
              rowGap: '0',
              columnGap: '0',
              margin: '2%',
            }}
          >
            <div className="dropdowns">
              {loading ? (
                <></>
              ) : (
                <Select
                  placeholder="--select--"
                  onChange={getBillingAdminPerformance}
                  data-testid="email-list"
                  defaultValue={defaultValue}
                >
                  {emailList.map((data) => {
                    return (
                      <Select.Option key={data.id} value={data.email}>
                        {data.email}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}

              <span>
                &nbsp;&nbsp;&nbsp;
                <RangePicker
                  placement="bottomRight"
                  data-testid="range-picker"
                  onChange={handleDate}
                  disabledDate={disabledDate}
                  defaultValue={[
                    dayjs(startDate, 'YYYY-MM-DD'),
                    dayjs(endDate, 'YYYY-MM-DD'),
                  ]}
                />
              </span>
              <div className="limit">{messages.MAX_RANGE}</div>
            </div>
          </Space>
        </div>
        {renderData()}
      </div>
    </Spin>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const CustomizedLabel = (props) => {
  const { x, y, value } = props;
  return (
    <g>
      <text x={x} y={y} fill="gray" dx="30" dy="-5" textAnchor="start">
        {value}
      </text>
    </g>
  );
};

CustomizedLabel.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  value: PropTypes.number,
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
};

export default PerformanceCounter;
