import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Space, DatePicker, Spin } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import messages from '../../utils/messages.json';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setActiveKey } from '../../features/sidebar/sidebarSlice.js';

const { RangePicker } = DatePicker;

const PieChartComponent = () => {
  const COLORS = [
    '#33658a',
    '#71dee0',
    '#999999',
    '#e86852',
    '#f2ae2b',
    '#de5882',
  ];
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [startDate, setStartDate] = useState(
    moment(endDate).startOf('day').subtract(3, 'months').format('YYYY-MM-DD')
  );
  const [data, setData] = useState([
    { name: 'New Request', value: 0 },
    { name: 'Assigned for Review', value: 0 },
    { name: 'Request more Information', value: 0 },
    { name: 'Data Provided', value: 0 },
    { name: 'Approved', value: 0 },
    { name: 'Approved with Exception', value: 0 },
  ]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem('token');

  const handleDate = (e) => {
    setStartDate(moment(e[0].$d).format('YYYY-MM-DD'));
    setEndDate(moment(e[1].$d).format('YYYY-MM-DD'));
    fetchAPI(
      moment(e[0].$d).format('YYYY-MM-DD'),
      moment(e[1].$d).format('YYYY-MM-DD')
    );
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
    fetchAPI(startDate, endDate);
  }, [startDate, endDate]);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    value,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#635b58"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        alignmentBaseline="middle"
      >
        {`${(percent * 100).toFixed(0)}%(${value})`}
      </text>
    );
  };

  const fetchAPI = async (start, end) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_URL}/api/billing-manager/total-requests?startDate=${start}&endDate=${end}`,
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
        setLoading(false);
        const updatedData = [
          { name: 'New Request', value: 0 },
          { name: 'Assigned for Review', value: 0 },
          { name: 'Request more Information', value: 0 },
          { name: 'Data Provided', value: 0 },
          { name: 'Approved', value: 0 },
          { name: 'Approved with Exception', value: 0 },
        ];
        ans.data.forEach((element) => {
          switch (element.status) {
            case 'New Request':
              updatedData[0].value = element.count;
              break;
            case 'Assigned for Review':
              updatedData[1].value = element.count;
              break;
            case 'Request more Information':
              updatedData[2].value = element.count;
              break;
            case 'Data Provided':
              updatedData[3].value = element.count;
              break;
            case 'Approved':
              updatedData[4].value = element.count;
              break;
            case 'Approved with Exception':
              updatedData[5].value = element.count;
              break;
            default:
              break;
          }
        });
        setTotalCount(ans.totalCount);
        setData(updatedData);
        new MutationObserver(handleBox).observe(document, {
          childList: true,
          subtree: true,
        });
      } else if (res.status === 401) {
        localStorage.clear();
        navigate('/login');
      } else if (res.status === 400) {
        toast.error(ans.message);
      }
    } catch (e) {
      toast.error(messages.GENERAL_ERROR);
    }
  };

  function handleBox(_, observer) {
    const pieBox = document.querySelectorAll('#pie .recharts-surface')[0];
    if (!pieBox) {
      observer.disconnect();
    } else {
      pieBox.setAttribute('viewBox', '-20, 0, 500, 500');
    }
  }

  const handleClick = (e) => {
    dispatch(setActiveKey('2'));
    switch (e.name) {
      case 'New Request':
        navigate('/trip-requests?key=1&status=all&page=1&myRequest=false');
        break;
      case 'Assigned for Review':
        navigate(
          '/trip-requests?key=2&status=Assigned%20for%20Review&page=1&myRequest=false'
        );
        break;
      case 'Request more Information':
        navigate(
          '/trip-requests?key=2&status=Request%20more%20Information&page=1&myRequest=false'
        );
        break;
      case 'Data Provided':
        navigate(
          '/trip-requests?key=2&status=Data%20Provided&page=1&myRequest=false'
        );
        break;
      case 'Approved':
        navigate('/trip-requests?key=3&status=Approved&page=1&myRequest=false');
        break;
      case 'Approved with Exception':
        navigate(
          '/trip-requests?key=3&status=Approved%20with%20Exception&page=1&myRequest=false'
        );
        break;
      default:
        break;
    }
  };

  const renderData = () => {
    if (totalCount === 0 && loading === false) {
      return <div className="no-data">No data available</div>;
    } else {
      return (
        <div className="pie-chart-container" id="pie">
          <PieChart
            margin={{ top: 25, right: 30, left: 30, bottom: 5 }}
            width={500}
            height={500}
            className="graph"
          >
            <Pie
              cursor="pointer"
              data-testid="pie-chart"
              dataKey="value"
              nameKey="name"
              label={renderCustomizedLabel}
              labelLine={true}
              data={data}
              cx={200}
              cy={200}
              outerRadius={160}
              fill="#8884d8"
              onClick={handleClick}
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              height={35}
              formatter={(value) => (
                <span style={{ color: '#635b58' }}>{value}</span>
              )}
            />
          </PieChart>
        </div>
      );
    }
  };

  return (
    <Spin spinning={loading} style={{ position: 'inherit' }}>
      <div className="total-request-container">
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
            <div className="limit">{messages.MAX_RANGE}</div>
          </Space>
        </div>
        {renderData()}
      </div>
    </Spin>
  );
};

export default PieChartComponent;
