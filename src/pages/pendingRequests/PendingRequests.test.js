import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../../app/store';
import { Provider } from 'react-redux';
import PendingRequests from './PendingRequests';
import { toast } from 'react-toastify';
import { TRIP_STATUS } from '../../utils/constants';

const setLocalStorage = (id, data) => {
  localStorage.setItem(id, JSON.stringify(data));
};

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  onMessage: jest.fn(() => Promise.resolve()),
  getToken: jest.fn(() => Promise.resolve('1234')),
}));

describe('for status is 500', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 500,
        json: () =>
          Promise.resolve({
            data: [],
            requestCount: 0,
            paginationData: { totalDocs: 0 },
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('should pass test', async () => {
    delete window.location;
    window.location = {
      pathname: '/trip-requests',
      search: '?key=2&status=all&page=1&myRequest=false',
    };
    setLocalStorage('data', { roleId: 2 });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PendingRequests />
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText(/no data/i)).toBeInTheDocument();
    localStorage.removeItem('data');
  });
});

describe('for status is 200', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
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
                status: TRIP_STATUS.DATA_PROVIDED,
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
                status: TRIP_STATUS.REVIEW,
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
                status: TRIP_STATUS.MORE_INFO,
                nurseName: 'creator_data.nurseName',
                key: 'runNo',
                assigneeName: 'assignee_data.assigneeName',
              },
            ],
            requestCount: 3,
            paginationData: { totalDocs: 3 },
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('should pass test', async () => {
    setLocalStorage('data', { roleId: 2 });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PendingRequests />
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText('12345')).toBeInTheDocument();
    localStorage.removeItem('data');
  });

  it('should handle click on the runNo cell', async () => {
    setLocalStorage('data', { roleId: 2 });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PendingRequests />
        </MemoryRouter>
      </Provider>
    );

    const reqRunNo = await screen.findByText('12345');
    expect(reqRunNo).toBeInTheDocument();
    expect(fireEvent.click(reqRunNo)).toBeTruthy();
  });
});

describe('for assigned for review button', () => {
  const unmockedFetch = global.fetch;

  beforeAll(() => {
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
                status: TRIP_STATUS.DATA_PROVIDED,
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
                status: TRIP_STATUS.REVIEW,
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
                status: TRIP_STATUS.MORE_INFO,
                nurseName: 'creator_data.nurseName',
                key: 'runNo',
                assigneeName: 'assignee_data.assigneeName',
              },
              {
                runNo: 12345,
                serviceType: 'ALS',
                patientName: 'Bob',
                dateTime: '7:26 PM, April 27, 2023',
                assignee: 'Maria',
                status: TRIP_STATUS.DATA_PROVIDED,
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
                status: TRIP_STATUS.REVIEW,
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
                status: TRIP_STATUS.MORE_INFO,
                nurseName: 'creator_data.nurseName',
                key: 'runNo',
                assigneeName: 'assignee_data.assigneeName',
              },
              {
                runNo: 12345,
                serviceType: 'ALS',
                patientName: 'Bob',
                dateTime: '7:26 PM, April 27, 2023',
                assignee: 'Maria',
                status: TRIP_STATUS.DATA_PROVIDED,
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
                status: TRIP_STATUS.REVIEW,
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
                status: TRIP_STATUS.MORE_INFO,
                nurseName: 'creator_data.nurseName',
                key: 'runNo',
                assigneeName: 'assignee_data.assigneeName',
              },
              {
                runNo: 12345,
                serviceType: 'ALS',
                patientName: 'Bob',
                dateTime: '7:26 PM, April 27, 2023',
                assignee: 'Maria',
                status: TRIP_STATUS.DATA_PROVIDED,
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
                status: TRIP_STATUS.REVIEW,
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
                status: TRIP_STATUS.MORE_INFO,
                nurseName: 'creator_data.nurseName',
                key: 'runNo',
                assigneeName: 'assignee_data.assigneeName',
              },
            ],
            requestCount: 12,
            paginationData: { totalDocs: 12 },
          }),
      });
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  it('renders everything', () => {
    setLocalStorage('data', { roleId: 2 });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PendingRequests />
        </MemoryRouter>
      </Provider>
    );
    const table = screen.getByTestId('pending-requests-table');
    const radio = screen.getByTestId('pending-requests-radio');

    expect(table).toBeInTheDocument();
    expect(radio).toBeInTheDocument();
    localStorage.removeItem('data');
  });

  it('works', async () => {
    setLocalStorage('data', { roleId: 2 });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PendingRequests />
        </MemoryRouter>
      </Provider>
    );

    const data = await JSON.parse(localStorage.getItem('data'));
    const toggle = screen.getByTestId('toggle');
    expect(data.roleId).toBe(2);
    expect(toggle).toBeInTheDocument();
    localStorage.removeItem('data');
  });

  it('works for role id is 1', async () => {
    setLocalStorage('data', { roleId: 1 });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PendingRequests />
        </MemoryRouter>
      </Provider>
    );

    const data = await JSON.parse(localStorage.getItem('data'));
    const toggle = screen.queryByTestId('toggle');
    expect(data.roleId).toBe(1);
    expect(toggle).not.toBeInTheDocument();
    localStorage.removeItem('data');
  });

  it('for toggle', async () => {
    setLocalStorage('data', { roleId: 2 });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PendingRequests />
        </MemoryRouter>
      </Provider>
    );

    const toggle = screen.getByTestId('toggle');
    setTimeout(await act(() => fireEvent.click(toggle)), 500);

    expect(toggle).toBeTruthy();
    localStorage.removeItem('data');
  });

  it('should pass for toggle and pagination', async () => {
    setLocalStorage('data', { roleId: 2 });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PendingRequests />
        </MemoryRouter>
      </Provider>
    );

    const toggle = screen.getByTestId('toggle');
    setTimeout(await act(() => fireEvent.click(toggle)), 500);

    await act(() => fireEvent.click(screen.queryByTitle('2')));

    expect(toggle).toBeTruthy();
    localStorage.removeItem('data');
  });

  it('should pass test if more than one page and afr', async () => {
    setLocalStorage('data', { roleId: 2 });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PendingRequests />
        </MemoryRouter>
      </Provider>
    );

    const toggle = screen.getByTestId('toggle');
    const rfmReq = screen.getByTestId('dp');

    await act(() => fireEvent.click(toggle));
    await act(() => fireEvent.click(rfmReq));
    await act(() => fireEvent.click(screen.queryByTitle('2')));

    expect(toggle).toBeTruthy();
    localStorage.removeItem('data');
  });

  it('should pass test if more than one page and toggled and afr', async () => {
    setLocalStorage('data', { roleId: 2 });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PendingRequests />
        </MemoryRouter>
      </Provider>
    );

    const rfmReq = screen.getByTestId('afr');

    await act(() => fireEvent.click(rfmReq));
    await act(() => fireEvent.click(screen.queryByTitle('2')));

    expect(rfmReq).toBeTruthy();
    localStorage.removeItem('data');
  });

  it('should pass test with toggle pagination and rfm', async () => {
    setLocalStorage('data', { roleId: 2 });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PendingRequests />
        </MemoryRouter>
      </Provider>
    );

    const toggle = screen.getByTestId('toggle');
    const rfmReq = screen.getByTestId('rfm');

    setTimeout(await act(() => fireEvent.click(rfmReq)), 500);
    setTimeout(await act(() => fireEvent.click(toggle)), 500);

    setTimeout(await act(() => fireEvent.click(screen.queryByTitle('2'))), 500);

    expect(toggle).toBeTruthy();
    localStorage.removeItem('data');
  });

  it('should pass test for toggle and pagination', async () => {
    setLocalStorage('data', { roleId: 2 });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PendingRequests />
        </MemoryRouter>
      </Provider>
    );

    const toggle = screen.getByTestId('toggle');
    const rfmReq = screen.getByTestId('afr');

    setTimeout(await act(() => fireEvent.click(toggle)), 500);
    setTimeout(await act(() => fireEvent.click(rfmReq)), 500);
    await act(() => fireEvent.click(screen.queryByTitle('2')));

    expect(rfmReq).toBeTruthy();
    localStorage.removeItem('data');
  });

  it('should pass test with toggle and pagination', async () => {
    setLocalStorage('data', { roleId: 2 });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PendingRequests />
        </MemoryRouter>
      </Provider>
    );

    const toggle = screen.getByTestId('toggle');
    setTimeout(await act(() => fireEvent.click(toggle)), 500);
    await act(() => fireEvent.click(screen.queryByTitle('2')));

    expect(toggle).toBeTruthy();
    localStorage.removeItem('data');
  });
});

describe('for unassign request', () => {
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
                status: TRIP_STATUS.DATA_PROVIDED,
                'creator_data.nurseName': 'Marissbsbb',
                key: 'runNo',
                'assignee_data.assigneeName': 'Maria Nelson',
              },
              {
                runNo: 1234,
                serviceType: 'ALS',
                patientName: 'Bob',
                dateTime: '7:26 PM, April 27, 2023',
                assignee: 'Maria',
                status: TRIP_STATUS.REVIEW,
                'creator_data.nurseName': 'Marissbsbb',
                key: 'runNo',
                'assignee_data.assigneeName': 'Maria Nelson',
              },
              {
                runNo: 123405,
                serviceType: 'ALS',
                patientName: 'Bob',
                dateTime: '7:26 PM, April 27, 2023',
                assignee: 'Maria',
                status: TRIP_STATUS.MORE_INFO,
                'creator_data.nurseName': 'Marissbsbb',
                key: 'runNo',
                'assignee_data.assigneeName': 'Maria Nelson',
              },
            ],
            requestCount: 3,
            paginationData: { totalDocs: 3 },
            message: 'request unassigned successfully',
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('unassign button with success', async () => {
    localStorage.clear();
    localStorage.setItem(
      'data',
      '{"firstName":"Maria","lastName":"Nelson","roleId":2}'
    );
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PendingRequests />
        </MemoryRouter>
      </Provider>
    );
    const unAssignBtn12345 = await screen.findByTestId('unAssignBtn12345');
    expect(unAssignBtn12345).toBeInTheDocument();
    expect(fireEvent.click(unAssignBtn12345)).toBeTruthy();
  });
});
