import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';
import PerformanceCounter from './PerformanceCounter';
import { act } from 'react-dom/test-utils';
import moment from 'moment';
import { toast } from 'react-toastify';
import { store } from '../../app/store';
import {Provider} from 'react-redux'

const mockedUsedNavigate = jest.fn();

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  onMessage: jest.fn(() => Promise.resolve()),
  getToken: jest.fn(() => Promise.resolve('1234')),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('for no data', () => {
  const unmockedFetch = global.fetch;
  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            data: [
              {
                id: '1234567',
                email: 'test@yopmail.com',
                count: 0
              },
              {
                id: '1234568',
                email: 'maria@yopmail.com',
                count: 0
              },
            ],
            totalCount: 0
          }),
      });
  })

  afterEach(() => {
    global.fetch = unmockedFetch;
  })

  it('redirects to login page', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
        <Router>
          <PerformanceCounter />
          </Router>
        </Provider>
      );
    })
    expect(screen.getByText('No data available')).toBeInTheDocument();
  })
})

describe('for 401 response', () => {
  const unmockedFetch = global.fetch;
  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 401,
        json: () =>
          Promise.resolve({
            data: [],
            totalCount: 0
          }),
      });
  })

  afterEach(() => {
    global.fetch = unmockedFetch;
  })

  it('renders no data when data is not present', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
        <Router>
          <PerformanceCounter />
          </Router>
        </Provider>
      );
    })
    expect(mockedUsedNavigate).toHaveBeenCalled();
  })
})

describe('Graph Component', () => {
  const unmockedFetch = global.fetch;
  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            data: [
              {
                id: '1234567',
                email: 'test@yopmail.com',
                status: 'Assigned for Review',
                count: 1
              },
              {
                id: '1234568',
                email: 'maria@yopmail.com',
                status: 'Request more Information',
                count: 2
              },
              {
                id: '12345679',
                email: 'test1@yopmail.com',
                status: 'Approved',
                count: 1
              },
              {
                id: '12345686',
                email: 'maria1@yopmail.com',
                status: 'Approved with Exception',
                count: 2
              },
              {
                id: '12345676',
                email: 'test2@yopmail.com',
                status: 'Data Provided',
                count: 1
              },
            ],
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('renders loading state initially', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
        <Router>
          <PerformanceCounter />
          </Router>
        </Provider>
      );
    })

    expect(await screen.findByTestId('email-list')).toBeInTheDocument();
    expect(await screen.findByTestId('range-picker')).toBeInTheDocument();
  });

  it('shows list of admins when select is clicked', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
        <Router>
          <PerformanceCounter />
          </Router>
        </Provider>
      );
    })
    fireEvent.blur(screen.queryAllByRole('combobox')['0']);
    fireEvent.focus(screen.queryAllByRole('combobox')['0']);
    fireEvent.mouseDown(screen.queryAllByRole('combobox')['0']);
    fireEvent.click(
      document.querySelectorAll('.ant-select-item-option-content')[0]
    );
    expect(screen.queryAllByText('maria@yopmail.com')[0]).toBeInTheDocument()
  })

  it('opens calender if date input is clicked', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
        <Router>
          <PerformanceCounter />
          </Router>
        </Provider>
      );
    })

    const from = screen.getByPlaceholderText('Start date');
    fireEvent.focus(from);
    fireEvent.blur(from);
    fireEvent.mouseDown(from);
    fireEvent.change(from, {
      target: {
        value: moment('2021-06-01').format('YYYY-MM-DD'),
      },
    });

    const to = screen.getByPlaceholderText('End date');
    fireEvent.mouseDown(to);
    fireEvent.change(to, {
      target: {
        value: moment('2021-06-02').format('YYYY-MM-DD'),
      },
    });
    expect(from.value).toBe('2021-06-01');
    expect(to.value).toBe('2021-06-02');
  });

  it('navigates to other page when a bar is clicked', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
        <Router>
          <PerformanceCounter />
          </Router>
        </Provider>
      );
    });
    const pending = document.querySelectorAll(
      '.recharts-layer .recharts-bar-rectangle'
    )[0];
    const approved = document.querySelectorAll(
      '.recharts-layer .recharts-bar-rectangle'
    )[1];
    const awe = document.querySelectorAll(
      '.recharts-layer .recharts-bar-rectangle'
    )[2];

    fireEvent.click(pending);
    expect(mockedUsedNavigate).toHaveBeenCalled();
    fireEvent.click(approved);
    expect(mockedUsedNavigate).toHaveBeenCalled();
    fireEvent.click(awe);
    expect(mockedUsedNavigate).toHaveBeenCalled();
  });
});

