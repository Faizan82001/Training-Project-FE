import { fireEvent, render, screen } from '@testing-library/react';
import InactiveUsers from './InactiveUsers';
import { getUsers,userCTA } from '../../utils/getDataFunctions';

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  onMessage: jest.fn(() => Promise.resolve()),
  getToken: jest.fn(() => Promise.resolve('1234')),
}));

describe('get inactive users', () => {
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
                  status: 'inactive',
                },
                {
                  firstName: 'Alexy',
                  lastName: 'Boby',
                  email: 'alexy@yopmail.com',
                  roleId: 2,
                  status: 'inactive',
                },
                {
                  firstName: 'Alex',
                  lastName: 'Bob',
                  email: 'alex@yopmail.com',
                  roleId: 3,
                  status: 'inactive',
                },
                {
                  firstName: 'Alexy',
                  lastName: 'Boby',
                  email: 'alexy@yopmail.com',
                  roleId: 2,
                  status: 'inactive',
                },
                {
                  firstName: 'Alex',
                  lastName: 'Bob',
                  email: 'alex@yopmail.com',
                  roleId: 3,
                  status: 'inactive',
                },
                {
                  firstName: 'Alexy',
                  lastName: 'Boby',
                  email: 'alexy@yopmail.com',
                  roleId: 2,
                  status: 'inactive',
                },
                {
                  firstName: 'Alex',
                  lastName: 'Bob',
                  email: 'alex@yopmail.com',
                  roleId: 3,
                  status: 'inactive',
                },
                {
                  firstName: 'Alexy',
                  lastName: 'Boby',
                  email: 'alexy@yopmail.com',
                  roleId: 2,
                  status: 'inactive',
                },
                {
                  firstName: 'Alex',
                  lastName: 'Bob',
                  email: 'alex@yopmail.com',
                  roleId: 3,
                  status: 'inactive',
                },
                {
                  firstName: 'Alexy',
                  lastName: 'Boby',
                  email: 'alexy@yopmail.com',
                  roleId: 2,
                  status: 'inactive',
                },
                {
                  firstName: 'Alex11',
                  lastName: 'Bob11',
                  email: 'alex11@yopmail.com',
                  roleId: 3,
                  status: 'inactive',
                },
                {
                  firstName: 'Alex12',
                  lastName: 'Bob12',
                  email: 'alex12@yopmail.com',
                  roleId: 2,
                  status: 'inactive',
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
      search: '?status=inactive&role_id=1&page=1',
    };
    render(<InactiveUsers />);
    const { res } = await getUsers('inactive');
    expect(res.status).toBe(200);
    const userData = await screen.findByText('Alex1');
    expect(userData).toBeInTheDocument();
  });
  test('for pagination', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=inactive&role_id=1&page=2',
    };
    render(<InactiveUsers />);
    const { res } = await getUsers('inactive');
    expect(res.status).toBe(200);
    const nextPageData = await screen.findByText('Alex11');
    expect(nextPageData).toBeInTheDocument();
  });

  test('for nurse button', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=inactive&role_id=1&page=1',
    };
    render(<InactiveUsers />);
    const nurseButton = screen.getByTestId('nurse');
    fireEvent.click(nurseButton);
    expect(nurseButton.checked).toBe(true);
    
  });
  test('for billing admin button', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=inactive&role_id=1&page=1',
    };
    render(<InactiveUsers />);
    const billingAdminButton = screen.getByTestId('billingAdmin');
    fireEvent.click(billingAdminButton);
    expect(billingAdminButton.checked).toBe(true);
  });
  test('for all user button', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=inactive&role_id=2&page=1',
    };
    render(<InactiveUsers />);
    const allUserButton = screen.getByTestId('all');
    fireEvent.click(allUserButton);
    expect(allUserButton.checked).toBe(true);
  });
  test('for successfull activate cta clicked', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=inactive&role_id=1&page=1',
    };
    render(<InactiveUsers />);
    const ctaBtns = await screen.findAllByTestId('cta-btn');
    expect(ctaBtns.length).toBe(10);
    fireEvent.click(ctaBtns[0]);
    const {res,ans} = await userCTA(123);
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
      search: '?status=inactive&role_id=1&page=1',
    };
    render(<InactiveUsers />);
    const { res } = await getUsers('inactive');
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
      search: '?status=inactive&role_id=1&page=1',
    };
    render(<InactiveUsers />);
    const { res, ans } = await getUsers('inactive');
    expect(res.status).toBe(200);
    expect(ans.data.rows.length).toBe(0);
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
      search: '?status=inactive&role_id=1&page=1',
    };
    render(<InactiveUsers />);
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
