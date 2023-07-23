import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { store } from '../../app/store';
import { Provider } from 'react-redux';
import NewRequests from './NewRequests';
import { TRIP_STATUS } from '../../utils/constants';

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  onMessage: jest.fn(() => Promise.resolve()),
  getToken: jest.fn(() => Promise.resolve('1234')),
}));

describe('for status is 200', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    toast.success = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());
    toast.error = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());

    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            data: [
              {
                runNo: 12345,
                serviceType: 'ALS',
                patientName: 'Bob',
                dateTime: '7:26 PM, April 27, 2023',
                assignee: 'Maria',
                status: TRIP_STATUS.NEW,
                nurseName: 'creator_data.nurseName',
                key: 'runNo',
                assigneeName: 'assignee_data.assigneeName',
              },
              {
                runNo: 1234,
                serviceType: 'ALS',
                patientName: 'Bob',
                dateTime: '7:26 PM, April 27, 2023',
                assignee: 'Maria',
                status: TRIP_STATUS.APPROVED,
                nurseName: 'creator_data.nurseName',
                key: 'runNo',
                assigneeName: 'assignee_data.assigneeName',
              },
              {
                runNo: 123405,
                serviceType: 'ALS',
                patientName: 'Bob',
                dateTime: '7:26 PM, April 27, 2023',
                assignee: 'Maria',
                status: TRIP_STATUS.APPROVED,
                nurseName: 'creator_data.nurseName',
                key: 'runNo',
                assigneeName: 'assignee_data.assigneeName',
              },
            ],
            requestCount: 12,
            len: 12,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('renders everything', () => {
    localStorage.setItem('data', '{"roleId":2}');
    delete window.location;
    window.location = {
      pathname: '/trip-requests',
      search: '?key=1&status=&page=1&myRequest=false',
    };
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewRequests />
        </MemoryRouter>
      </Provider>
    );

    const table = screen.getByTestId('new-requests-table');
    expect(table).toBeInTheDocument();
  });

  it('should pass test', async () => {
    localStorage.setItem('data', '{"roleId":2}');
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewRequests />
        </MemoryRouter>
      </Provider>
    );
    const data = await screen.findByText('12345');
    expect(data).toBeInTheDocument();
  });

  it('should show page 2 if more than 10 requests', async () => {
    localStorage.setItem('data', '{"roleId":2}');
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewRequests />
        </MemoryRouter>
      </Provider>
    );

    const page2 = await screen.findByTitle('2');
    fireEvent.click(page2);;
    expect(page2).toBeInTheDocument();;
  });

  it('should handle click on the runNo cell', async () => {
    localStorage.setItem('data', '{"roleId":2}');
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewRequests />
        </MemoryRouter>
      </Provider>
    );

    const reqRunNo = await screen.findByText('12345');
    expect(reqRunNo).toBeInTheDocument();
    expect(fireEvent.click(reqRunNo)).toBeTruthy();

  })

  // for assign unassign requests

  it('assign button with success', async () => {
    localStorage.clear();
    localStorage.setItem('data', '{"roleId":2}');
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewRequests />
        </MemoryRouter>
      </Provider>
    );
    const assignBtn12345 = await screen.findByTestId('assignBtn12345');
    expect(assignBtn12345).toBeInTheDocument();
    expect(fireEvent.click(assignBtn12345)).toBeTruthy();
  });
});

describe('for status is 400', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 500,
        json: () =>
          Promise.resolve({
            data: [],
            requestCount: 0,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('should pass test', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewRequests />
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText(/no data/i)).toBeInTheDocument();
  });
});

