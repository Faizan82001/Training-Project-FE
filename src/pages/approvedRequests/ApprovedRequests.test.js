import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../../app/store';
import { Provider } from 'react-redux';
import ApprovedRequests from './ApprovedRequests';
import { TRIP_STATUS } from '../../utils/constants';
const setLocalStorage = (id, data) => {
  localStorage.setItem(id, JSON.stringify(data));
};

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  onMessage: jest.fn(() => Promise.resolve()),
  getToken: jest.fn(() => Promise.resolve('1234')),
}));

describe('for status is 200', () => {
  const unmockedFetch = global.fetch;

  beforeAll(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            data: [
              {
                runNo: 123456,
                serviceType: 'ALS',
                patientName: 'Bob',
                dateTime: '7:26 PM, April 27, 2023',
                assignee: 'Maria',
                status: TRIP_STATUS.EXCEPTION,
                nurseName: 'creator_data.nurseName',
                key: 'runNo',
                assigneeName: 'assignee_data.assigneeName',
              },
              {
                runNo: 123457,
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
                runNo: 123458,
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

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  it('should pass test', async () => {
    setLocalStorage('data', { roleId: 2 });
    delete window.location;
    window.location = {
      pathname: '/trip-requests',
      search: '?key=3&status=all&page=1&myRequest=false',
    };

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ApprovedRequests />
        </MemoryRouter>
      </Provider>
    );
    expect(await screen.findByText('123456')).toBeInTheDocument();
    localStorage.removeItem('data');
  });
});

describe('for toggles and pagination', () => {
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
              }, {
                runNo: 12346,
                serviceType: 'ALS',
                patientName: 'Bob',
                dateTime: '7:26 PM, April 27, 2023',
                assignee: 'Maria',
                status: 'Approved with Exception',
                nurseName: 'creator_data.nurseName',
                key: 'runNo',
                assigneeName: 'assignee_data.assigneeName',
              },
              {
                runNo: 12347,
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
                runNo: 12348,
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
                runNo: 12349,
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
                runNo: 12350,
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
                runNo: 12351,
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
                runNo: 12352,
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
                runNo: 12353,
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
                runNo: 12354,
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
                runNo: 12355,
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
                runNo: 12356,
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
                runNo: 12357,
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
                runNo: 12358,
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
                runNo: 12359,
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
          <ApprovedRequests />
        </MemoryRouter>
      </Provider>
    );
    const table = screen.getByTestId('approved-requests-table');
    const radio = screen.getByTestId('approved-requests-radio');

    expect(table).toBeInTheDocument();
    expect(radio).toBeInTheDocument();
    localStorage.removeItem('data');
  });

  it('works for toggle', async () => {
    setLocalStorage('data', { roleId: 2 });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ApprovedRequests />
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
          <ApprovedRequests />
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
          <ApprovedRequests />
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
          <ApprovedRequests />
        </MemoryRouter>
      </Provider>
    );

    const toggle = screen.getByTestId('toggle');
    setTimeout(await act(() => fireEvent.click(toggle)), 500);

    await act(() => fireEvent.click(screen.queryByTitle('2')));

    expect(toggle).toBeTruthy();
    localStorage.removeItem('data');
  });

  it('should pass test if more than one page and approved filter', async () => {
    setLocalStorage('data', { roleId: 2 });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ApprovedRequests />
        </MemoryRouter>
      </Provider>
    );

    const toggle = screen.getByTestId('toggle');
    const rfmReq = screen.getByTestId('approved');

    await act(() => fireEvent.click(toggle));
    await act(() => fireEvent.click(rfmReq));
    await act(() => fireEvent.click(screen.queryByTitle('2')));

    expect(toggle).toBeTruthy();
    localStorage.removeItem('data');
  });

  it('should pass test if more than one page and toggled and awe', async () => {
    setLocalStorage('data', { roleId: 2 });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ApprovedRequests />
        </MemoryRouter>
      </Provider>
    );

    const awe = screen.getByTestId('awe');

    await act(() => fireEvent.click(awe));
    await act(() => fireEvent.click(screen.queryByTitle('2')));

    expect(awe).toBeTruthy();
    localStorage.removeItem('data');
  });

  it('should pass test for toggle and pagination', async () => {
    setLocalStorage('data', { roleId: 2 });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ApprovedRequests />
        </MemoryRouter>
      </Provider>
    );

    const toggle = screen.getByTestId('toggle');
    const rfmReq = screen.getByTestId('awe');

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
          <ApprovedRequests />
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
