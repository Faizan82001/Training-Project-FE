import { Space, DatePicker, Spin } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import messages from '../../utils/messages.json';
const { RangePicker } = DatePicker;

const mapAvgTimeData = (data) => {
  const mappedData = [];

  Object.keys(data).forEach((key) => {
    const dateObj = {
      name: '',
      date: '',
      ALS: 0,
      BLS: 0,
      CCT: 0,
    };
    dateObj.name = key;
    mappedData.push(dateObj);
  });

  Object.values(data).forEach((date, i) => {
    mappedData[i].date = new Date(mappedData[i].name);
    date.forEach((request) => {
      mappedData[i][request.serviceType] = request.averageTimeTaken;
    });
  });

  mappedData.sort((a, b) => a.date - b.date);

  return mappedData;
};

const AverageTime = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [startDate, setStartDate] = useState(
    moment(endDate).startOf('day').subtract(3, 'months').format('YYYY-MM-DD')
  );
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchGraphData(startDate, endDate);
  }, [startDate, endDate]);

  const handleDate = (e) => {
    setStartDate(moment(e[0].$d).format('YYYY-MM-DD'));
    setEndDate(moment(e[1].$d).format('YYYY-MM-DD'));
    fetchGraphData(
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
  const fetchGraphData = async (start, end) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_URL}/api/billing-manager/avg-time-taken?startDate=${start}&endDate=${end}`,
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
        setData(ans.data);
      } else if (res.data === 401) {
        localStorage.clear();
        setLoading(false);
        navigate('/login');
      } else {
        setLoading(false);
        toast.error(ans.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(messages.GENERAL_ERROR);
    }
  };
  const renderGraph = () => {
    if (Object.keys(data).length === 0 && loading === false) {
      return <div className="no-data">No data available</div>;
    } else {
      const mappedData = mapAvgTimeData(data);
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={800}
            height={600}
            data={mappedData}
            className="graph"
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              label={{
                value: 'Minutes',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
            <Bar
              dataKey="ALS"
              fill="#33658a"
              maxBarSize={70}
              isAnimationActive={false}
            />
            <Bar
              dataKey="BLS"
              fill="#71dee0"
              maxBarSize={70}
              isAnimationActive={false}
            />
            <Bar
              dataKey="CCT"
              fill="#e75c56"
              maxBarSize={70}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };
  return (
    <div className="avg-time">
      <Spin spinning={loading} style={{ position: 'inherit' }}>
        <div className="avg-time-container">
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
          <div className="graph-container">{renderGraph()}</div>
        </div>
      </Spin>
    </div>
  );
};

export default AverageTime;
