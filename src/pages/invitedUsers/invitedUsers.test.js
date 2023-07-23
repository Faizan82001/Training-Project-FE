import { fireEvent, render, screen } from '@testing-library/react';
import InvitedUsers from './InvitedUsers';
import { getUsers,userCTA } from '../../utils/getDataFunctions';

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  onMessage: jest.fn(() => Promise.resolve()),
  getToken: jest.fn(() => Promise.resolve('1234')),
}));

describe('get invited users', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            data: {
              count:12,
              rows:[
                {
                  firstName: 'Alex',
                  lastName: 'Bob',
                  email: 'alex@yopmail.com',
                  roleId: 3,
                  status: 'invited',
                },
                {
                  firstName: 'Alexy',
                  lastName: 'Boby',
                  email: 'alexy@yopmail.com',
                  roleId: 2,
                  status: 'invited',
                },
                {
                  firstName: 'Alex',
                  lastName: 'Bob',
                  email: 'alex@yopmail.com',
                  roleId: 3,
                  status: 'invited',
                },
                {
                  firstName: 'Alexy',
                  lastName: 'Boby',
                  email: 'alexy@yopmail.com',
                  roleId: 2,
                  status: 'invited',
                },
                {
                  firstName: 'Alex',
                  lastName: 'Bob',
                  email: 'alex@yopmail.com',
                  roleId: 3,
                  status: 'invited',
                },
                {
                  firstName: 'Alexy',
                  lastName: 'Boby',
                  email: 'alexy@yopmail.com',
                  roleId: 2,
                  status: 'invited',
                },
                {
                  firstName: 'Alex',
                  lastName: 'Bob',
                  email: 'alex@yopmail.com',
                  roleId: 3,
                  status: 'invited',
                },
                {
                  firstName: 'Alexy',
                  lastName: 'Boby',
                  email: 'alexy@yopmail.com',
                  roleId: 2,
                  status: 'invited',
                },
                {
                  firstName: 'Alex',
                  lastName: 'Bob',
                  email: 'alex@yopmail.com',
                  roleId: 3,
                  status: 'invited',
                },
                {
                  firstName: 'Alexy',
                  lastName: 'Boby',
                  email: 'alexy@yopmail.com',
                  roleId: 2,
                  status: 'invited',
                },
                {
                  firstName: 'Alex11',
                  lastName: 'Bob11',
                  email: 'alex11@yopmail.com',
                  roleId: 3,
                  status: 'invited',
                },
                {
                  firstName: 'Alex12',
                  lastName: 'Bob12',
                  email: 'alex12@yopmail.com',
                  roleId: 2,
                  status: 'invited',
                },
              ],
            },
            limit:10,
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
      search: '?status=invited&role_id=1&page=1',
    };
    render(<InvitedUsers />);
    const { res } = await getUsers('invited');
    expect(res.status).toBe(200);
  });

  test('for successfull invite again cta clicked', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=invited&role_id=1&page=1',
    };
    render(<InvitedUsers />);
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
      search: '?status=invited&role_id=1&page=1',
    };
    render(<InvitedUsers />);
    const { res } = await getUsers('invited');
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
            data:{
              count:0,
              rows:[],
            },
            limit:10,
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
      search: '?status=invited&role_id=1&page=1',
    };
    render(<InvitedUsers />);
    const { res, ans } = await getUsers('invited');
    expect(res.status).toBe(200);
    expect(ans.data.rows.length).toBe(0);
  });
});

describe('for handle change function', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            data:{
              count:0,
              rows:[],
            },
            limit:10,
            status: 200,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });
  test('for all roles', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=invited&role_id=1&page=1',
    };
    render(<InvitedUsers />);
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
      search: '?status=invited&role_id=1&page=1',
    };
    render(<InvitedUsers />);
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