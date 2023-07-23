import React, { useEffect } from 'react';
import './analytics.css';
import { Link } from 'react-router-dom';
import { Col, Row, Divider, Button } from 'antd';
import PieChartComponent from '../../components/pieChart/PieChart';
import PerformanceCounter from '../../components/performanceCounter/PerformanceCounter';
import AverageTime from '../../components/averageTime/AverageTime';
import { useDispatch } from 'react-redux';
import { setActiveKey } from '../../features/sidebar/sidebarSlice';

const Analytics = function () {
  const data = JSON.parse(localStorage.getItem('data'));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveKey('1'));
  }, []);

  if (data.roleId === 1) {
    return (
      <div className="analytics">
        <Row>
          <Col xs={23} sm={23} xl={11} className="charts chartGroup">
            <div>
              <h1 className="title">Total Requests</h1>
              <Divider />
              <PieChartComponent />
            </div>
          </Col>
          <Col
            xs={23}
            sm={23}
            xl={11}
            className="charts chartGroup"
            offset={1}
            id="bar"
          >
            <div>
              <h1 className="title">Performance Counter (per billing admin)</h1>
              <Divider />
              <PerformanceCounter />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={23} className="charts">
            <h1 className="title">Average Time Per Request</h1>
            <Divider />
            <AverageTime />
          </Col>
        </Row>
      </div>
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

export default Analytics;
