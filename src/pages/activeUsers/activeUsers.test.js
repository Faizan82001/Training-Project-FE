import { fireEvent, render, screen } from '@testing-library/react';
import ActiveUsers from './ActiveUsers';
import { getUsers, userCTA } from '../../utils/getDataFunctions';

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  onMessage: jest.fn(() => Promise.resolve()),
  getToken: jest.fn(() => Promise.resolve('1234')),
}));

describe('get active users', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            data: {
              count: 12,
              rows: [
                {
                  firstName: 'Alex1',
                  lastName: 'Bob',
                  email: 'alex@yopmail.com',
                  roleId: 3,
                  status: 'active',
                },
                {
                  firstName: 'Alexy',
                  lastName: 'Boby',
                  email: 'alexy@yopmail.com',
                  roleId: 2,
                  status: 'active',
                },
                {
                  firstName: 'Alex',
                  lastName: 'Bob',
                  email: 'alex@yopmail.com',
                  roleId: 3,
                  status: 'active',
                },
                {
                  firstName: 'Alexy',
                  lastName: 'Boby',
                  email: 'alexy@yopmail.com',
                  roleId: 2,
                  status: 'active',
                },
                {
                  firstName: 'Alex',
                  lastName: 'Bob',
                  email: 'alex@yopmail.com',
                  roleId: 3,
                  status: 'active',
                },
                {
                  firstName: 'Alexy',
                  lastName: 'Boby',
                  email: 'alexy@yopmail.com',
                  roleId: 2,
                  status: 'active',
                },
                {
                  firstName: 'Alex',
                  lastName: 'Bob',
                  email: 'alex@yopmail.com',
                  roleId: 3,
                  status: 'active',
                },
                {
                  firstName: 'Alexy',
                  lastName: 'Boby',
                  email: 'alexy@yopmail.com',
                  roleId: 2,
                  status: 'active',
                },
                {
                  firstName: 'Alex',
                  lastName: 'Bob',
                  email: 'alex@yopmail.com',
                  roleId: 3,
                  status: 'active',
                },
                {
                  firstName: 'Alexy',
                  lastName: 'Boby',
                  email: 'alexy@yopmail.com',
                  roleId: 2,
                  status: 'active',
                },
                {
                  firstName: 'Alex11',
                  lastName: 'Bob11',
                  email: 'alex11@yopmail.com',
                  roleId: 3,
                  status: 'active',
                },
                {
                  firstName: 'Alex12',
                  lastName: 'Bob12',
                  email: 'alexy@yopmail.com',
                  roleId: 2,
                  status: 'active',
                },
              ],
            },
            limit: 10,
            status: 200,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });
  test('for successfull fetch call', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=active&role_id=1&page=1',
    };
    render(<ActiveUsers />);
    const { res } = await getUsers('active');
    expect(res.status).toBe(200);
    const userData = await screen.findByText('Alex1');
    expect(userData).toBeInTheDocument();
  });

  test('for pagination', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=active&role_id=1&page=2',
    };
    render(<ActiveUsers />);
    const { res } = await getUsers('active');
    expect(res.status).toBe(200);

    const page2 = await screen.findByTitle('2');
    const nextPageData = await screen.findByText('Alex11');
    expect(nextPageData).toBeInTheDocument();
  });

  test('for successfull activate cta clicked', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=active&role_id=1&page=1',
    };
    render(<ActiveUsers />);
    const ctaBtns = await screen.findAllByTestId('cta-btn');
    expect(ctaBtns.length).toBe(10);
    fireEvent.click(ctaBtns[0]);
    const { res, ans } = await userCTA(123);
    expect(res.status).toBe(200);
  });
});

describe('unsuccessfull api call', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 400,
        json: () => Promise.resolve({ message: 'users not found' }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });
  test('for unsuccessfull fetch call', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=active&role_id=1&page=1',
    };
    render(<ActiveUsers />);
    const { res } = await getUsers('active');
    expect(res.status).toBe(400);
  });
});

describe('successfull api call with 0 data', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            data: {
              count: 0,
              rows: [],
            },
            limit: 10,
            status: 200,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });
  test('for successfull fetch call with 0 data', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=active&role_id=1&page=1',
    };
    render(<ActiveUsers />);
    const { res, ans } = await getUsers('active');
    expect(res.status).toBe(200);
    expect(ans.data.rows.length).toBe(0);
  });
});

describe('successfull api call with different query parameters', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            data: {
              count: 2,
              rows: [
                {
                  firstName: 'Alex',
                  lastName: 'Bob',
                  email: 'alex@yopmail.com',
                  roleId: 3,
                  status: 'active',
                },
                {
                  firstName: 'Alexy',
                  lastName: 'Boby',
                  email: 'alexy@yopmail.com',
                  roleId: 2,
                  status: 'active',
                },
              ],
            },
            limit: 10,
            status: 200,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });
  test('for undefined status fetch call', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=active&role_id=1&page=1',
    };
    render(<ActiveUsers />);
    const { res, ans } = await getUsers();
    expect(res.status).toBe(200);
    expect(ans.data.rows.length).toBe(2);
  });
  test('for fetch call with all parameters defined', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=active&role_id=1&page=1',
    };
    render(<ActiveUsers />);
    const { res, ans } = await getUsers('active', 2, 1);
    expect(res.status).toBe(200);
    expect(ans.data.rows.length).toBe(2);
  });
  test('for nurse button', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=active&role_id=1&page=1',
    };
    render(<ActiveUsers />);
    const nurseButton = screen.getByTestId('nurse');
    fireEvent.click(nurseButton);
    expect(nurseButton.checked).toBe(true);
  });
  test('for billing admin button', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=active&role_id=1&page=1',
    };
    render(<ActiveUsers />);
    const billingAdminButton = screen.getByTestId('billingAdmin');
    fireEvent.click(billingAdminButton);
    expect(billingAdminButton.checked).toBe(true);
  });
  test('for all user button', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=active&role_id=2&page=1',
    };
    render(<ActiveUsers />);
    const allUserButton = screen.getByTestId('all');
    fireEvent.click(allUserButton);
    expect(allUserButton.checked).toBe(true);
  });
});

//for handle change function when response is not 200

describe('for handle change function when response is not 200', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 400,
        json: () => Promise.resolve({ message: 'users not found' }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  test('for all roles', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=active&role_id=1&page=1',
    };
    render(<ActiveUsers />);
    const allUserButton = screen.getByTestId('all');
    const nurseButton = screen.getByTestId('nurse');
    const billingAdminButton = screen.getByTestId('billingAdmin');
    fireEvent.click(nurseButton);
    fireEvent.click(allUserButton);
    expect(allUserButton.checked).toBe(true);
    fireEvent.click(billingAdminButton);
    expect(billingAdminButton.checked).toBe(true);
  });
});
