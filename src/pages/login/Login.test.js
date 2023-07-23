import { fireEvent, render, screen } from '@testing-library/react';
import { Login, postLogin } from './Login';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  onMessage: jest.fn(() => Promise.resolve()),
  getToken: jest.fn(() => Promise.resolve('1234')),
}));

describe('Login Component', () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      status: 200,
      json: () => Promise.resolve({ message: 'you are logged in' }),
    })
  );

  //checks that the components are present
  it('render all the elements', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const logoElement = screen.getByAltText(/logoImage/i);
    const emailLabel = screen.getByLabelText(/email id/i);
    const passwordLabel = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    const forgotPasswordButton = screen.getByRole('button', {
      name: /forgot password/i,
    });

    expect(loginButton).toBeInTheDocument();
    expect(forgotPasswordButton).toBeInTheDocument();
    expect(emailLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
    expect(logoElement).toBeInTheDocument();
  });

  // Test that the ...

  it('forgot password event', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const forgotPasswordButton = screen.getByRole('button', {
      name: /forgot password/i,
    });

    expect(forgotPasswordButton).toBeInTheDocument();

    expect(fireEvent.click(forgotPasswordButton)).toBeTruthy();
  });

  it('password length is shorter then 6', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const passwordLabel = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(passwordLabel, { target: { value: '12345' } });
    fireEvent.click(loginButton);

    expect(passwordLabel.value.length).toBeLessThan(6);
  });
});

describe('for successful login', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            message: 'User logged in successfully',
            data: { roleId: 1 },
            status: 200,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  test('works', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailLabel = screen.getByLabelText(/email id/i);
    const passwordLabel = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailLabel, { target: { value: 'admin@growexx.com' } });
    fireEvent.change(passwordLabel, { target: { value: '1234567' } });
    fireEvent.click(loginButton);
    const { res, ans } = await postLogin(emailLabel.value, passwordLabel.value);
    expect(res.status).toEqual(200);
    expect(ans.message).toEqual('User logged in successfully');
    expect(ans.data.roleId).toBe(1);
  });
});

describe('for invalid credentials', () => {
  const unmockedFetch = global.fetch;
  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 401,
        json: () =>
          Promise.resolve({
            message: 'invalid credentials',
            status: 401,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  test('works', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailLabel = screen.getByLabelText(/email id/i);
    const passwordLabel = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.change(emailLabel, { target: { value: 'admin@growexx.com' } });
    fireEvent.change(passwordLabel, { target: { value: '1234567' } });
    fireEvent.click(loginButton);
    const { res, ans } = await postLogin(emailLabel.value, passwordLabel.value);
    expect(res.status).toEqual(401);
    expect(ans.message).toEqual('invalid credentials');
  });
});

describe('for user not found', () => {
  const unmockedFetch = global.fetch;
  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            message: 'user not found',
            status: 400,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  test('works', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailLabel = screen.getByLabelText(/email id/i);
    const passwordLabel = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.change(emailLabel, { target: { value: 'admin@growexx.com' } });
    fireEvent.change(passwordLabel, { target: { value: '1234567' } });
    fireEvent.click(loginButton);
    const { res, ans } = await postLogin(emailLabel.value, passwordLabel.value);
    expect(res.status).toEqual(400);
    expect(ans.message).toEqual('user not found');
  });
});

// if nurse tries to log in

describe('if nurse tries to log in', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            message: 'User logged in successfully',
            data: { roleId: 3 },
            status: 200,
          }),
      });

    toast.error = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  test('nurse log in', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailLabel = screen.getByLabelText(/email id/i);
    const passwordLabel = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailLabel, { target: { value: 'admin@growexx.com' } });
    fireEvent.change(passwordLabel, { target: { value: '1234567' } });
    fireEvent.click(loginButton);
    const { res, ans } = await postLogin(emailLabel.value, passwordLabel.value);
    expect(res.status).toEqual(200);
    expect(ans.message).toEqual('User logged in successfully');
    expect(ans.data.roleId).toBe(3);
    // expect(toast.error).toHaveBeenCalled();
  });
});
