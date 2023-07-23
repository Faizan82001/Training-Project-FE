import { toast } from 'react-toastify';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';
import AverageTime from './AverageTime';
import { act } from 'react-dom/test-utils';
import moment from 'moment';

describe('Average Time Taken Bar Chart Component', () => {
  const unmockedFetch = global.fetch;
  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            data: {
              '2023-05-24': [
                {
                  serviceType: 'BLS',
                  averageTimeTaken: 95,
                },
                {
                  serviceType: 'ALS',
                  averageTimeTaken: 84,
                },
                {
                  serviceType: 'CCT',
                  averageTimeTaken: 50,
                },
              ],
              '2023-03-24': [
                {
                  serviceType: 'BLS',
                  averageTimeTaken: 80,
                },
              ],
              '2023-05-23': [
                {
                  serviceType: 'ALS',
                  averageTimeTaken: 48,
                },
                {
                  serviceType: 'BLS',
                  averageTimeTaken: 145,
                },
              ],
              '2023-03-15': [
                {
                  serviceType: 'ALS',
                  averageTimeTaken: 50,
                },
              ],
              '2023-04-10': [
                {
                  serviceType: 'CCT',
                  averageTimeTaken: 45,
                },
              ],
            },
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('renders average time taken bar graph if data is present', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AverageTime />
        </BrowserRouter>
      );
    });
    const graph = document.querySelector('.recharts-responsive-container');
    expect(graph).toBeInTheDocument();
  });

  it('opens calender if date input is clicked', async () => {
    render(
      <BrowserRouter>
        <AverageTime />
      </BrowserRouter>
    );

    const from = screen.getByPlaceholderText('Start date');
    fireEvent.focus(from);
    fireEvent.blur(from);
    fireEvent.mouseDown(from);
    fireEvent.change(from, {
      target: {
        value: moment('2023-02-26').format('YYYY-MM-DD'),
      },
    });

    const to = screen.getByPlaceholderText('End date');
    fireEvent.mouseDown(to);
    fireEvent.change(to, {
      target: {
        value: moment('2023-05-26').format('YYYY-MM-DD'),
      },
    });
    expect(from.value).toBe('2023-02-26');
    expect(to.value).toBe('2023-05-26');
  });
});

describe('Average Time Taken Bar Chart Component, failed response', () => {
  const unmockedFetch = global.fetch;
  beforeEach(() => {
    toast.error = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());
    toast.warning = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());
    global.fetch = () =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            data:  { },
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('renders average time taken bar graph if response is not 200', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AverageTime />
        </BrowserRouter>
      );
    });
    expect(await screen.findByText(/no data available/i)).toBeInTheDocument();
  });
});

describe('Average Time Taken Bar Chart Component, for catch block', () => {
  const unmockedFetch = global.fetch;
  beforeEach(() => {
    toast.error = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());
    toast.warning = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());
    global.fetch = () => Promise.reject();
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('renders average time taken bar graph if response is not 200', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AverageTime />
        </BrowserRouter>
      );
    });
    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalled();
  });
});
