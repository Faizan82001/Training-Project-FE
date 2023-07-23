import { fireEvent, render, screen } from '@testing-library/react';
import { ChangePassword, changePasswordApi } from './ChangePassword';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('tests change password page', () => {
  beforeEach(() => {
    toast.error = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());
  });

  it('checks if all the elements are rendered', () => {
    render(
      <MemoryRouter>
        <ChangePassword />
      </MemoryRouter>
    );
    expect(screen.getByText(/change password/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter old password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter new password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm new password/i)
    ).toBeInTheDocument();
  });

  it('renders error if any field is empty', () => {
    render(
      <MemoryRouter>
        <ChangePassword />
      </MemoryRouter>
    );

    const oldPass = screen.getByPlaceholderText(/enter old password.../i);
    const newPass = screen.getAllByTestId('id-new').at(0);
    const confirmPass = screen.getByPlaceholderText(/confirm new password.../i);

    fireEvent.change(oldPass, {
      preventDefault: jest.fn(),
      target: {
        value: '',
        name: 'old-password',
      },
    });

    fireEvent.change(newPass, {
      preventDefault: jest.fn(),
      target: {
        value: '',
        name: 'new-password',
      },
    });

    fireEvent.change(confirmPass, {
      preventDefault: jest.fn(),
      target: {
        value: '',
        name: 'confirm-password',
      },
    });

    const btn = screen.getByTestId('id-submit');
    fireEvent.click(btn);
    
    expect(toast.error).toHaveBeenCalled();
  });

  it('renders error if password length is short', () => {
    render(
      <MemoryRouter>
        <ChangePassword />
      </MemoryRouter>
    );

    const oldPass = screen.getByPlaceholderText(/enter old password.../i);
    const newPass = screen.getAllByTestId('id-new').at(0);
    const confirmPass = screen.getByPlaceholderText(/confirm new password.../i);

    fireEvent.change(oldPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'abcderssf',
        name: 'old-password',
      },
    });

    fireEvent.change(newPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'abcd',
        name: 'new-password',
      },
    });

    fireEvent.change(confirmPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'abcd',
        name: 'confirm-password',
      },
    });

    const btn = screen.getByTestId('id-submit');
    fireEvent.click(btn);

    expect(toast.error).toHaveBeenCalled();
  });

  it('renders error if password and confirm password is not same', () => {
    render(
      <MemoryRouter>
        <ChangePassword />
      </MemoryRouter>
    );

    const oldPass = screen.getByPlaceholderText(/enter old password.../i);
    const newPass = screen.getAllByTestId('id-new').at(0);
    const confirmPass = screen.getByPlaceholderText(/confirm new password.../i);

    fireEvent.change(oldPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'abcderssf',
        name: 'old-password',
      },
    });

    fireEvent.change(newPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'abcdefgh',
        name: 'new-password',
      },
    });

    fireEvent.change(confirmPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'abcdefg',
        name: 'confirm-password',
      },
    });

    const btn = screen.getByTestId('id-submit');
    fireEvent.click(btn);

    expect(toast.error).toHaveBeenCalled();
  });
});

describe('response of 200', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,

        json: () =>
          Promise.resolve({
            message: 'Password changed successfully.',
            status: 200,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('should pass test', async () => {
    render(
      <MemoryRouter>
        <ChangePassword />
      </MemoryRouter>
    );

    const oldPass = screen.getByPlaceholderText(/enter old password.../i);
    const newPass = screen.getAllByTestId('id-new').at(0);
    const confirmPass = screen.getByPlaceholderText(/confirm new password.../i);

    fireEvent.change(oldPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'mayank',
        name: 'old-password',
      },
    });

    fireEvent.change(newPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'mayank123',
        name: 'new-password',
      },
    });

    fireEvent.change(confirmPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'mayank123',
        name: 'confirm-password',
      },
    });

    const btn = screen.getByTestId('id-submit');
    fireEvent.click(btn);

    await changePasswordApi(oldPass.value, newPass.value, confirmPass.value, 2);
    expect(mockedUsedNavigate).toBeCalled();
  });
});

describe('response of 400', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 400,

        json: () =>
          Promise.resolve({
            message:
              'Please enter a password that has minimum 8 and maximum 20 character. It should contain atleast 1 uppercase, 1 lowercase letter, 1 special character and 1 number.',
            status: 400,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('should pass test', async () => {
    render(
      <MemoryRouter>
        <ChangePassword />
      </MemoryRouter>
    );

    const oldPass = screen.getByPlaceholderText(/enter old password.../i);
    const newPass = screen.getAllByTestId('id-new').at(0);
    const confirmPass = screen.getByPlaceholderText(/confirm new password.../i);

    fireEvent.change(oldPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'mayank',
        name: 'old-password',
      },
    });

    fireEvent.change(newPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'mayank123',
        name: 'new-password',
      },
    });

    fireEvent.change(confirmPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'mayank123',
        name: 'confirm-password',
      },
    });

    const btn = screen.getByTestId('id-submit');
    fireEvent.click(btn);

    const ans = await changePasswordApi(
      oldPass.value,
      newPass.value,
      confirmPass.value
    );
    expect(ans).toBe(true);
  });
});

describe('response of 401', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 401,

        json: () =>
          Promise.resolve({
            message:
              'Your password is incorrect.Please enter correct password.',
            status: 401,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('should pass test', async () => {
    render(
      <MemoryRouter>
        <ChangePassword />
      </MemoryRouter>
    );

    const oldPass = screen.getByPlaceholderText(/enter old password.../i);
    const newPass = screen.getAllByTestId('id-new').at(0);
    const confirmPass = screen.getByPlaceholderText(/confirm new password.../i);

    fireEvent.change(oldPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'mayank',
        name: 'old-password',
      },
    });

    fireEvent.change(newPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'mayank123',
        name: 'new-password',
      },
    });

    fireEvent.change(confirmPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'mayank123',
        name: 'confirm-password',
      },
    });

    const btn = screen.getByTestId('id-submit');
    fireEvent.click(btn);

    const ans = await changePasswordApi(
      oldPass.value,
      newPass.value,
      confirmPass.value
    );
    expect(ans).toBe(true);
  });
});

describe('response of 500', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.reject({
        status: 500,

        json: () =>
          Promise.reject({
            message: 'Something went wrong',
            status: 500,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('should pass test', async () => {
    render(
      <MemoryRouter>
        <ChangePassword />
      </MemoryRouter>
    );

    const oldPass = screen.getByPlaceholderText(/enter old password.../i);
    const newPass = screen.getAllByTestId('id-new').at(0);
    const confirmPass = screen.getByPlaceholderText(/confirm new password.../i);

    fireEvent.change(oldPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'mayank',
        name: 'old-password',
      },
    });

    fireEvent.change(newPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'mayank123',
        name: 'new-password',
      },
    });

    fireEvent.change(confirmPass, {
      preventDefault: jest.fn(),
      target: {
        value: 'mayank123',
        name: 'confirm-password',
      },
    });

    const btn = screen.getByTestId('id-submit');
    fireEvent.click(btn);

    const ans = await changePasswordApi(
      oldPass.value,
      newPass.value,
      confirmPass.value
    );
    expect(ans).toBe(true);
  });
});
