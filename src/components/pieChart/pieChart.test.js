import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';
import PieChartComponent from './PieChart';
import { act } from 'react-dom/test-utils';
import moment from 'moment';
import { store } from '../../app/store';
import { Provider } from 'react-redux';
import { toast } from 'react-toastify';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('Pie Chart Component', () => {
  const unmockedFetch = global.fetch;
  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            data: [
              {
                status: 'Approved',
                count: 1,
                percentage: '4.13%',
              },
              {
                status: 'Approved with Exception',
                count: 5,
                percentage: '20.83%',
              },
              {
                status: 'New Request',
                count: 4,
                percentage: '16.67%',
              },
              {
                status: 'Assigned for Review',
                count: 8,
                percentage: '33.33%',
              },
              {
                status: 'Data Provided',
                count: 2,
                percentage: '8.33%',
              },
              {
                status: 'Request more Information',
                count: 4,
                percentage: '16.67%',
              },
            ],
            totalCount: 3,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('opens calender if date input is clicked', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <PieChartComponent />
        </BrowserRouter>
      </Provider>
    );

    const from = await screen.findByPlaceholderText('Start date');
    fireEvent.focus(from);
    fireEvent.blur(from);
    fireEvent.mouseDown(from);
    fireEvent.change(from, {
      target: {
        value: moment('2021-06-01').format('YYYY-MM-DD'),
      },
    });

    const to = await screen.findByPlaceholderText('End date');
    fireEvent.mouseDown(to);
    fireEvent.change(to, {
      target: {
        value: moment('2021-06-02').format('YYYY-MM-DD'),
      },
    });
    expect(from.value).toBe('2021-06-01');
    expect(to.value).toBe('2021-06-02');
  });

  it('navigates to other page when a pie slice is clicked', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <PieChartComponent />
          </BrowserRouter>
        </Provider>
      );
    });
    const newReq = document.getElementsByClassName('recharts-pie-sector')[0];
    const afr = document.getElementsByClassName('recharts-pie-sector')[1];
    const rmi = document.getElementsByClassName('recharts-pie-sector')[2];
    const dp = document.getElementsByClassName('recharts-pie-sector')[3];
    const approved = document.getElementsByClassName('recharts-pie-sector')[4];
    const awe = document.getElementsByClassName('recharts-pie-sector')[5];

    fireEvent.click(newReq);
    expect(mockedUsedNavigate).toHaveBeenCalled();
    fireEvent.click(afr);
    expect(mockedUsedNavigate).toHaveBeenCalled();
    fireEvent.click(rmi);
    expect(mockedUsedNavigate).toHaveBeenCalled();
    fireEvent.click(dp);
    expect(mockedUsedNavigate).toHaveBeenCalled();
    fireEvent.click(approved);
    expect(mockedUsedNavigate).toHaveBeenCalled();
    fireEvent.click(awe);
    expect(mockedUsedNavigate).toHaveBeenCalled();
  });
});

describe('for error responses', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    toast.error = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());
  });

  it('navigates to login page when response status is 401', async () => {
    global.fetch = () =>
      Promise.resolve({
        status: 401,
        json: () =>
          Promise.resolve({
            data: [],
            totalCount: 0,
          }),
      });
    await act(async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <PieChartComponent />
          </BrowserRouter>
        </Provider>
      );
    });
    const token = localStorage.getItem('token');
    expect(token).toBeNull();
    global.fetch = unmockedFetch;
  });

  it('navigates to login page when response status is 500', async () => {
    global.fetch = () =>
      Promise.reject({
        status: 500,
        json: () =>
          Promise.reject({
            data: [],
            totalCount: 0,
          }),
      });
    await act(async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <PieChartComponent />
          </BrowserRouter>
        </Provider>
      );
    });
    expect(toast.error).toHaveBeenCalled();
    global.fetch = unmockedFetch;
  });

  it('navigates to login page when response status is 400', async () => {
    global.fetch = () =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            data: [],
            totalCount: 0,
          }),
      });
    await act(async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <PieChartComponent />
          </BrowserRouter>
        </Provider>
      );
    });
    expect(toast.error).toHaveBeenCalled();
    global.fetch = unmockedFetch;
  });
});
